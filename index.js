#!/usr/bin/env node
'use strict';
const { execSync, spawnSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

// ============================================================================
// Console Output Utilities
// ============================================================================
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function clearScreen() {
  console.clear();
}

function status(message) {
  console.log(`${colors.bright}${colors.cyan}▶${colors.reset} ${message}`);
}

function success(message) {
  console.log(`${colors.bright}${colors.green}✓${colors.reset} ${message}`);
}

function warn(message) {
  console.log(`${colors.yellow}⚠${colors.reset} ${message}`);
}

function section(title) {
  console.log(`\n${colors.bright}${title}${colors.reset}`);
  console.log(colors.dim + '─'.repeat(50) + colors.reset);
}

// ============================================================================
// File System Utilities (from lib/fs-utils.js)
// ============================================================================

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function copyFileSync(src, dest) {
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function readJsonFile(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (e) {
    return null;
  }
}

function writeJsonFile(filePath, obj) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, JSON.stringify(obj, null, 2), 'utf8');
}
function copyRecursive(src, dest, options = {}) {
  const skipNames = options.skipNames || [];
  try {
    const stat = fs.statSync(src);
    if (stat.isDirectory()) {
      ensureDir(dest);
      for (const file of fs.readdirSync(src)) {
        if (skipNames.includes(file)) continue;
        copyRecursive(path.join(src, file), path.join(dest, file), options);
      }
    } else {
      copyFileSync(src, dest);
    }
  } catch (err) {
    // stille Warnung, damit Template-Kopierlauf nicht abbricht
    console.warn(`Warnung beim Kopieren ${src}: ${err.message}`);
  }
}

function copyTemplates(templatePath, projectPath) {
  // Keep this list in sync with package.json -> files
  // Base template files to copy into the new project
  const filesToCopy = [
    'src',
    'public',
    'index.js',
    'package.json',
    'scripts',
    'docker-compose.yml',
    'Dockerfile',
    '.env.example',
    '.gitignore',
    '.gitattributes',
    'README.md',
    // common config files (keep in sync with package.json files/globs)
    'tsconfig.json',
    'next.config.ts',
    'tailwind.config.ts',
    'postcss.config.mjs',
    'eslint.config.mjs',
    // Additional deployment helpers (not part of published package 'files')
    'upload-env-secrets.ps1',
    'upload-env-secrets.sh',
    '.github',
    "SAAS_PROMPT.md",
    
  ];

  // Dateien/Varianten, die wir beim Kopieren standardmäßig überspringen wollen
  // (keine generische `auth.ts` mehr - nur DB/provider-spezifische Varianten)
  const skipNames = ['auth.postgresql.ts', 'auth.mongodb.ts', 'schema.postgresql.prisma', 'schema.mongodb.prisma', 'publish.yml'];

  for (const file of filesToCopy) {
    const srcPath = path.join(templatePath, file);
    const destPath = path.join(projectPath, file);
    if (!fs.existsSync(srcPath)) continue;
    try {
      const stat = fs.statSync(srcPath);
      if (stat.isDirectory()) {
        copyRecursive(srcPath, destPath, { skipNames });
      } else {
        copyFileSync(srcPath, destPath);
      }
    } catch (err) {
      // ignore individual copy errors to keep output concise
    }
  }

  // Immer das schema.prisma aus der Vorlage kopieren (Quelle: src/prisma/schema.prisma)
  // Ziel im neuen Projekt: src/prisma/schema.prisma
  const schemaSrc = path.join(templatePath, 'src', 'prisma', 'schema.prisma');
  const schemaDest = path.join(projectPath, 'src', 'prisma', 'schema.prisma');

  if (fs.existsSync(schemaSrc)) {
    ensureDir(path.dirname(schemaDest));
    copyFileSync(schemaSrc, schemaDest);
  } else {
    // No warning for missing schema to keep output clean
  }

  // Ensure scripts folder is copied robustly (use fs.cpSync when available)
  try {
    const scriptsSrc = path.join(templatePath, 'scripts');
    const scriptsDest = path.join(projectPath, 'scripts');
    if (fs.existsSync(scriptsSrc)) {
      // Prefer fs.cpSync (Node 16+) for a robust recursive copy
      if (typeof fs.cpSync === 'function') {
        try {
          fs.cpSync(scriptsSrc, scriptsDest, { recursive: true });
        } catch (e) {
          // fallback to our copyRecursive
          copyRecursive(scriptsSrc, scriptsDest, { skipNames });
        }
      } else {
        copyRecursive(scriptsSrc, scriptsDest, { skipNames });
      }
    }
  } catch (e) {
    // keep quiet; copying will have been attempted above
  }

  // Some registries / npm packing flows may change or drop files that start
  // with a dot (for example .gitignore). To be robust we look for a
  // non-dotted 'gitignore' filename in the template and copy it to the
  // destination as '.gitignore' if the dotted version was not copied.
  try {
    const altGitignoreSrc = path.join(templatePath, 'gitignore');
    const destGitignore = path.join(projectPath, '.gitignore');

    // If destination doesn't have a .gitignore, but template shipped a
    // 'gitignore' file (without leading dot), copy/rename it.
    if (!fs.existsSync(destGitignore) && fs.existsSync(altGitignoreSrc)) {
      ensureDir(path.dirname(destGitignore));
      try {
        copyFileSync(altGitignoreSrc, destGitignore);
        console.log("Copied gitignore -> .gitignore (template provided 'gitignore')");
      } catch (e) {
        // don't fail the whole copy process for this
        console.warn('Could not copy gitignore to .gitignore:', e && e.message ? e.message : e);
      }
    }
  } catch (e) {
    // ignore any failure here
  }
}

// ============================================================================
// Main Application
// ============================================================================

const projectName = process.argv[2] || ".";
const targetDir = path.resolve(process.cwd(), projectName);

async function main() {
  clearScreen();
  section(`🚀 Projet Setup: ${projectName}`);

  const projectPath = targetDir;

  if (projectName !== "." && require('fs').existsSync(projectPath)) {
    console.error(`${colors.red}✗ Error: Directory already exists: ${projectName}${colors.reset}`);
    process.exit(1);
  }

  try {
    ensureDir(projectPath);
    // Template source directory
    const templatePath = __dirname;

    status('Copying template files...');

    // Prioritized copy: ensure docker-compose and Dockerfile exist in the
    // target project immediately so attempts to run `docker compose` won't
    // fail due to file-not-found when we ask to start mongodb right after.
    const prioritized = ['docker-compose.yml', 'Dockerfile'];
    for (const f of prioritized) {
      try {
        const src = path.join(templatePath, f);
        const dest = path.join(projectPath, f);
        if (fs.existsSync(src)) {
          copyFileSync(src, dest);
        }
      } catch (e) {
        // silent
      }
    }

    // Copy GitHub Actions workflow from deployment folder to .github/workflows
    try {
      const workflowSrc = path.join(templatePath, 'deployment', 'deploy.yml');
      const workflowDest = path.join(projectPath, '.github', 'workflows', 'deploy.yml');
      if (fs.existsSync(workflowSrc)) {
        ensureDir(path.dirname(workflowDest));
        copyFileSync(workflowSrc, workflowDest);
      }
    } catch (e) {
      // silent
    }

    // Copy deployment scripts (PowerShell and Bash)
    try {
      const psScriptSrc = path.join(templatePath, 'upload-env-secrets.ps1');
      const psScriptDest = path.join(projectPath, 'upload-env-secrets.ps1');
      if (fs.existsSync(psScriptSrc)) {
        copyFileSync(psScriptSrc, psScriptDest);
      }

      const shScriptSrc = path.join(templatePath, 'upload-env-secrets.sh');
      const shScriptDest = path.join(projectPath, 'upload-env-secrets.sh');
      if (fs.existsSync(shScriptSrc)) {
        copyFileSync(shScriptSrc, shScriptDest);
        try {
          fs.chmodSync(shScriptDest, 0o755);
        } catch (e) {
          // Ignore chmod errors on Windows
        }
      }
    } catch (e) {
      // silent
    }

    // copy remaining templates
    copyTemplates(templatePath, projectPath);
    success('Template files copied');

    // package.json anpassen
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = readJsonFile(packageJsonPath);
    if (packageJson) {
      packageJson.name = projectName;
      packageJson.version = '0.1.0';
      delete packageJson.bin;
      delete packageJson.files;
      writeJsonFile(packageJsonPath, packageJson);
    }

    status('Configuring project...');

    process.chdir(projectPath);

    // Ask about MongoDB first: use existing or start docker-compose MongoDB
    let dbUrl = null;
    try {
      const readline = require('readline');
      const rlDb = readline.createInterface({ input: process.stdin, output: process.stdout });
      const askDb = (q) => new Promise((resolve) => rlDb.question(q, resolve));
      console.log('');
      const hasDbAns = (await askDb(`${colors.bright}MongoDB Setup${colors.reset}\nHast du bereits eine MongoDB? (j/N): `)).trim().toLowerCase();
      if (hasDbAns === 'j' || hasDbAns === 'y' || hasDbAns === 'yes') {
        const provided = (await askDb('DATABASE_URL (z.B. mongodb://user:pass@host:27017/db): ')).trim();
        if (provided) dbUrl = provided;
        rlDb.close();
        success('MongoDB URL configured');
      } else {
        rlDb.close();
        // Start mongodb via docker-compose if available
        try {
          status('Starting MongoDB via Docker Compose...');
          let res = spawnSync('docker', ['compose', '-f', 'docker-compose.yml', 'up', '-d', 'mongodb'], { stdio: 'ignore' });
          if (res.status !== 0) {
            // fallback to docker-compose
            res = spawnSync('docker-compose', ['-f', 'docker-compose.yml', 'up', '-d', 'mongodb'], { stdio: 'ignore' });
          }
          if (res.status === 0) {
            // give container time to initialize
            await new Promise((r) => setTimeout(r, 3000));
            dbUrl = 'mongodb://admin:admin123@localhost:27017/vorlage?replicaSet=rs0&authSource=admin';
            success('MongoDB started locally');
          } else {
            warn('Could not start MongoDB via Docker. You can provide DATABASE_URL manually later.');
          }
        } catch (e) {
          warn('Docker Compose startup failed');
        }
      }
    } catch (err) {
      // ignore prompt errors and continue
    }

    // Create a .env file with a randomized BETTER_AUTH_SECRET if one doesn't already exist.
    try {
      const envPath = path.join(projectPath, '.env');
      const examplePath = path.join(projectPath, '.env.example');

      function parseEnv(content) {
        const map = {};
        if (!content) return map;
        content.split(/\r?\n/).forEach((line) => {
          const m = line.match(/^\s*([^#=\s]+)\s*=\s*(.*)$/);
          if (m) {
            map[m[1]] = m[2];
          }
        });
        return map;
      }

      if (fs.existsSync(envPath)) {
        // Merge missing keys from .env.example into existing .env (do not overwrite existing values)
  console.log('Merging .env.example into .env (if needed)');
        const envContents = fs.readFileSync(envPath, 'utf8');
        const exampleContents = fs.existsSync(examplePath) ? fs.readFileSync(examplePath, 'utf8') : '';

        const envMap = parseEnv(envContents);
        const exMap = parseEnv(exampleContents);

        let updated = envContents;
        let changed = false;

        for (const key of Object.keys(exMap)) {
          if (!(key in envMap)) {
            if (updated && !updated.endsWith('\n')) updated += '\n';
            updated += `${key}=${exMap[key]}\n`;
            changed = true;
          }
        }

        // If user provided a DB URL or docker-compose started DB, ensure DATABASE_URL is set/overwritten
        if (dbUrl) {
          if (/^\s*DATABASE_URL\s*=.*$/m.test(updated)) {
            updated = updated.replace(/^\s*DATABASE_URL\s*=.*$/m, `DATABASE_URL="${dbUrl}"`);
          } else {
            if (updated && !updated.endsWith('\n')) updated += '\n';
            updated += `DATABASE_URL="${dbUrl}"\n`;
          }
          changed = true;
        }

        // Ensure BETTER_AUTH_SECRET exists
        if (!/^\s*BETTER_AUTH_SECRET\s*=.*$/m.test(updated)) {
          const secret = crypto.randomBytes(32).toString('base64');
          if (updated && !updated.endsWith('\n')) updated += '\n';
          updated += `BETTER_AUTH_SECRET="${secret}"\n`;
          changed = true;
        }

        if (changed) {
          fs.writeFileSync(envPath, updated, 'utf8');
          success('.env configured');
        }
      } else {
        // Create new .env using .env.example as base and add BETTER_AUTH_SECRET
        let contents = '';
        if (fs.existsSync(examplePath)) {
          contents = fs.readFileSync(examplePath, 'utf8');
        }

        // Ensure DATABASE_URL from prompt/docker is set in new .env
        if (dbUrl) {
          if (/^\s*DATABASE_URL\s*=.*$/m.test(contents)) {
            contents = contents.replace(/^\s*DATABASE_URL\s*=.*$/m, `DATABASE_URL="${dbUrl}"`);
          } else {
            if (contents && !contents.endsWith('\n')) contents += '\n';
            contents += `DATABASE_URL="${dbUrl}"\n`;
          }
        }

        // Generate a secure random secret (base64) and insert or append it to the .env contents
        const secret = crypto.randomBytes(32).toString('base64');
        const secretLine = `BETTER_AUTH_SECRET="${secret}"`;

        if (/^\s*BETTER_AUTH_SECRET\s*=.*$/m.test(contents)) {
          contents = contents.replace(/^\s*BETTER_AUTH_SECRET\s*=.*$/m, secretLine);
        } else {
          if (contents && !contents.endsWith('\n')) contents += '\n';
          contents += `${secretLine}\n`;
        }

        fs.writeFileSync(envPath, contents, 'utf8');
        success('.env created');
      }
    } catch (err) {
      warn('Could not create/update .env');
    }

    // Try to run Prisma generate/db push first. If Prisma CLI (npx) isn't available
    // because dependencies haven't been installed, run `npm install` and retry.
    try {
      status('Setting up database...');

      const schemaPath = path.join('src', 'prisma', 'schema.prisma');

      function runPrismaCommands() {
        // Always run prisma generate and prisma db push without passing a
        // specific schema path. Rely on Prisma's default discovery of
        // schema.prisma in the project (or the CLI's defaults).
        execSync('npx prisma generate', { stdio: 'ignore' });
        execSync('npx prisma db push', { stdio: 'ignore' });
      }

      try {
        runPrismaCommands();
        success('Database setup complete');
      } catch (prismaErr) {
        status('Running npm install...');
        execSync('npm install', { stdio: 'ignore' });
        // retry
        try {
          runPrismaCommands();
          success('Database setup complete');
        } catch (prismaErr2) {
          warn('Database setup encountered issues');
        }
      }

      // Start dev server in background (detached) so we can continue and run the admin script.
      try {
        status('Starting dev server...');
        let dev;
        if (process.platform === 'win32') {
          // On Windows use `start` to spawn an independent window/process that won't die with this script
          // start requires a title argument, provide empty title "" before the command
          dev = spawn('cmd', ['/c', 'start', '""', 'npm', 'run', 'dev'], { stdio: 'ignore', detached: true });
        } else {
          // POSIX: spawn detached child
          dev = spawn('npm', ['run', 'dev'], { stdio: 'ignore', detached: true });
        }
        if (dev && typeof dev.unref === 'function') dev.unref();
        // give the server a moment to boot so HTTP endpoints may be reachable
        await new Promise((resolve) => setTimeout(resolve, 2500));
        success('Dev server started (http://localhost:3000)');
      } catch (devErr) {
        warn('Could not start dev server');
      }

      // Prompt for admin credentials and run create-admin-via-api.js in the newly created project
      const readline = require('readline');
      const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

      const ask = (q) => new Promise((resolve) => rl.question(q, resolve));

      console.log('');
      const email = (await ask(`${colors.bright}Admin Setup${colors.reset}\nAdmin E-Mail (leer = überspringen): `)).trim();
      if (!email) {
        rl.close();
      } else {
        const password = (await ask('Admin Passwort: ')).trim();
        const name = (await ask('Admin Name (optional): ')).trim();
        const baseUrlInput = (await ask('Base URL (optional, default http://localhost:3000): ')).trim();
        const baseUrl = baseUrlInput || 'http://localhost:3000';
        rl.close();

        const scriptPath = path.join(projectPath, 'scripts', 'create-admin-via-api.js');
        if (!fs.existsSync(scriptPath)) {
          console.warn('Admin script not found, skipping.');
        } else {
          console.log('Running admin script...');
          // Use spawnSync to avoid shell quoting issues and inherit stdio
          const args = [scriptPath, email, password, name || '', baseUrl];
          const node = process.execPath; // path to node binary
          const res = spawnSync(node, args, { stdio: 'ignore' });
          if (res.error) {
            warn('Error running admin script');
          } else if (res.status !== 0) {
            warn('Admin script encountered an issue');
          } else {
            success('Admin user created');
          }
        }
      }
    } catch (err) {
      warn('Setup encountered issues');
    }

    section('✅ Project Setup Complete!');
    console.log(`\n${colors.bright}Next steps:${colors.reset}`);
    console.log(`  cd ${projectName}`);
    console.log('  npm run dev\n');
    console.log(`${colors.dim}Dev server: http://localhost:3000${colors.reset}`);
    console.log('');
    section('🚀 Deployment Setup');
    console.log(`${colors.dim}`);
    console.log('To deploy to Ubuntu server:');
    console.log('');
    console.log('1. Install GitHub CLI: https://cli.github.com/');
    console.log('2. Run: gh auth login');
    console.log('3. Upload secrets:');
    if (process.platform === 'win32') {
      console.log('     .\\upload-env-secrets.ps1');
    } else {
      console.log('     ./upload-env-secrets.sh');
    }
    console.log('4. Set secrets (gh secret set SERVER_IP, SSH_PRIVATE_KEY)');
    console.log('5. Push to main: git push origin main');
    console.log(`${colors.reset}\n`);
  } catch (error) {
    console.error(`${colors.red}✗ Error: ${error && error.message ? error.message : error}${colors.reset}`);
    process.exit(1);
  }
}

main().catch(error => {
  console.error('Error:', error && error.message ? error.message : error);
  process.exit(1);
});