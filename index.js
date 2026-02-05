#!/usr/bin/env node
'use strict';
const { execSync, spawnSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const readline = require('readline');

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
// File System Utilities
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
    console.warn(`Warnung beim Kopieren ${src}: ${err.message}`);
  }
}

// ============================================================================
// V1 Specific Logic
// ============================================================================

function copyV1(templatePath, projectPath) {
  // Keep this list in sync with V1 structure
  const filesToCopy = [
    'src',
    'public',
    'scripts',
    'messages',
    'docker-compose.yml',
    'Dockerfile',
    '.env.example',
    '.gitignore',
    '.gitattributes',
    'package.json',
    'README.md',
    'tsconfig.json',
    'next.config.ts',
    'tailwind.config.ts',
    'postcss.config.mjs',
    'eslint.config.mjs',
    'upload-env-secrets.ps1',
    'upload-env-secrets.sh',
    'SAAS_PROMPT.md',
    'STRIPE_SETUP.md',
    'init.py'
  ];

  const skipNames = ['node_modules', '.next', 'dist', 'build', '.git'];

  for (const file of filesToCopy) {
    const srcPath = path.join(templatePath, file);
    const destPath = path.join(projectPath, file);
    if (!fs.existsSync(srcPath)) continue;
    
    // Check if it's a directory or file
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyRecursive(srcPath, destPath, { skipNames });
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
  
  // Special case for .gitignore (sometimes renamed to gitignore)
  if (!fs.existsSync(path.join(projectPath, '.gitignore')) && fs.existsSync(path.join(templatePath, 'gitignore'))) {
      copyFileSync(path.join(templatePath, 'gitignore'), path.join(projectPath, '.gitignore'));
  }

  // Copy deployment workflow
   try {
      const workflowSrc = path.join(templatePath, 'deployment', 'deploy.yml');
      const workflowDest = path.join(projectPath, '.github', 'workflows', 'deploy.yml');
      if (fs.existsSync(workflowSrc)) {
        ensureDir(path.dirname(workflowDest));
        copyFileSync(workflowSrc, workflowDest);
      }
    } catch (e) { }

}

async function setupV1(projectPath, projectName) {
    // package.json anpassen
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = readJsonFile(packageJsonPath);
    if (packageJson) {
      packageJson.name = projectName;
      packageJson.version = '0.1.0';
      writeJsonFile(packageJsonPath, packageJson);
    }

    status('Configuring V1 project...');
    process.chdir(projectPath);

    // MongoDB Setup
    let dbUrl = null;
    try {
      const rlDb = readline.createInterface({ input: process.stdin, output: process.stdout });
      const askDb = (q) => new Promise((resolve) => rlDb.question(q, resolve)); // local helper
      console.log('');
      const hasDbAns = (await askDb(`${colors.bright}MongoDB Setup${colors.reset}\nHast du bereits eine MongoDB? (j/N): `)).trim().toLowerCase();
      if (hasDbAns === 'j' || hasDbAns === 'y' || hasDbAns === 'yes') {
        const provided = (await askDb('DATABASE_URL (z.B. mongodb://user:pass@host:27017/db): ')).trim();
        if (provided) dbUrl = provided;
        rlDb.close();
        success('MongoDB URL configured');
      } else {
        rlDb.close();
        try {
          status('Starting MongoDB via Docker Compose...');
          let res = spawnSync('docker', ['compose', '-f', 'docker-compose.yml', 'up', '-d', 'mongodb'], { stdio: 'ignore' });
          if (res.status !== 0) {
            res = spawnSync('docker-compose', ['-f', 'docker-compose.yml', 'up', '-d', 'mongodb'], { stdio: 'ignore' });
          }
          if (res.status === 0) {
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
    } catch (err) {}

    // .env setup
    try {
        const envPath = path.join(projectPath, '.env');
        const examplePath = path.join(projectPath, '.env.example');
        let contents = '';
        if (fs.existsSync(examplePath)) contents = fs.readFileSync(examplePath, 'utf8');
        
        if (dbUrl) {
             if (/^\s*DATABASE_URL\s*=.*$/m.test(contents)) {
                contents = contents.replace(/^\s*DATABASE_URL\s*=.*$/m, `DATABASE_URL="${dbUrl}"`);
             } else {
                contents += `\nDATABASE_URL="${dbUrl}"\n`;
             }
        }

        const secret = crypto.randomBytes(32).toString('base64');
        const secretLine = `BETTER_AUTH_SECRET="${secret}"`;
        if (/^\s*BETTER_AUTH_SECRET\s*=.*$/m.test(contents)) {
             contents = contents.replace(/^\s*BETTER_AUTH_SECRET\s*=.*$/m, secretLine);
        } else {
             contents += `\n${secretLine}\n`;
        }
        
        fs.writeFileSync(envPath, contents, 'utf8');
        success('.env configured');
    } catch(e) { warn('Could not configure .env'); }

    // Prisma & Install
    try {
        status('Installing dependencies & setting up database...');
        execSync('npm install', { stdio: 'ignore' });
        
        try {
             execSync('npx prisma generate', { stdio: 'ignore' });
             execSync('npx prisma db push', { stdio: 'ignore' });
             success('Database setup complete');
        } catch(e) { warn('Database setup failed (Prisma)'); }
        
        try {
             execSync('node scripts/generate-translations.js', { stdio: 'ignore' });
        } catch(e) {}
        
    } catch (e) { warn('Dependency install failed'); }
    
    // Start Dev Server & Admin Setup
    try {
        status('Starting dev server to run admin script...');
        let dev;
        if (process.platform === 'win32') {
           dev = spawn('cmd', ['/c', 'start', '""', 'npm', 'run', 'dev'], { stdio: 'ignore', detached: true });
        } else {
           dev = spawn('npm', ['run', 'dev'], { stdio: 'ignore', detached: true });
        }
        if (dev && typeof dev.unref === 'function') dev.unref();
        
        await new Promise((resolve) => setTimeout(resolve, 3000));
        
        // Admin prompt
        const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
        const ask = (q) => new Promise((resolve) => rl.question(q, resolve));
        
        console.log('');
        const email = (await ask(`${colors.bright}Admin Setup${colors.reset}\nAdmin E-Mail (leer = überspringen): `)).trim();
        if (email) {
            const password = (await ask('Admin Passwort: ')).trim();
            const name = (await ask('Admin Name (optional): ')).trim();
            rl.close();
            
            const scriptPath = path.join(projectPath, 'scripts', 'create-admin-via-api.js');
            if (fs.existsSync(scriptPath)) {
                const node = process.execPath;
                spawnSync(node, [scriptPath, email, password, name||'', 'http://localhost:3000'], { stdio: 'ignore' });
                success('Admin created');
            }
        } else {
            rl.close();
        }
        
    } catch (e) {}
}


// ============================================================================
// V2 Specific Logic
// ============================================================================

function copyV2(templatePath, projectPath) {
    status('Copying V2 template files...');
    // For V2 (Clean Next.js), we copy everything except node_modules, .git, .next
    const skipNames = ['node_modules', '.git', '.next', 'package-lock.json'];
    
    // V2 is already a clean app structure in templates/v2
    copyRecursive(templatePath, projectPath, { skipNames });
    
    // Special case for .gitignore (sometimes renamed to gitignore)
    if (!fs.existsSync(path.join(projectPath, '.gitignore')) && fs.existsSync(path.join(templatePath, 'gitignore'))) {
        copyFileSync(path.join(templatePath, 'gitignore'), path.join(projectPath, '.gitignore'));
    }
}

async function setupV2(projectPath, projectName) {
     // package.json update
    const packageJsonPath = path.join(projectPath, 'package.json');
    const packageJson = readJsonFile(packageJsonPath);
    if (packageJson) {
      packageJson.name = projectName;
      packageJson.version = '0.1.0';
      writeJsonFile(packageJsonPath, packageJson);
    }
    
    process.chdir(projectPath);
    status('Installing dependencies...');
    try {
        execSync('npm install', { stdio: 'inherit' }); // inherit to show progress
        success('Dependencies installed');
    } catch(e) {
        warn('npm install failed');
    }
}

// ============================================================================
// Main
// ============================================================================


async function main() {
  clearScreen();
  section('🚀 Nexal Helper');

  // Determine Template Version
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const question = (q) => new Promise((resolve) => rl.question(q, resolve));

  console.log(`${colors.bright}Wähle eine Vorlage:${colors.reset}`);
  console.log(`1) ${colors.cyan}V1${colors.reset} - Full SaaS Starter (MongoDB, Auth, Stripe, Admin, i18n)`);
  console.log(`2) ${colors.cyan}V2${colors.reset} - Clean Next.js App (Tailwind, i18n, Sitemap) + Scraper`);
  console.log('');
  
  const answer = (await question('Auswahl [1/2]: ')).trim();
  
  let version = 'v1';
  let projectUrl = '';
  let derivedName = '';

  if (answer === '2' || answer.toLowerCase() === 'v2') {
      version = 'v2';
      projectUrl = (await question('Website URL to process: ')).trim();
      
      try {
          const hostname = new URL(projectUrl.startsWith('http') ? projectUrl : `https://${projectUrl}`).hostname;
          derivedName = hostname.replace('www.', '').split('.')[0];
      } catch (e) {
          derivedName = 'my-nexal-app';
      }
      console.log(`${colors.green}Project Name extracted: ${derivedName}${colors.reset}`);
  }
  
  rl.close();

  // If V2, use derived name. If V1, use argument or default.
  const projectName = version === 'v2' ? derivedName : (process.argv[2] || ".");
  const targetDir = path.resolve(process.cwd(), projectName);

  status(`Selected: ${version.toUpperCase()}`);
  
  if (projectName !== "." && fs.existsSync(targetDir)) {
    console.error(`${colors.red}✗ Error: Directory already exists: ${projectName}${colors.reset}`);
    process.exit(1);
  }
  
  ensureDir(targetDir);
  
  const templateDir = path.join(__dirname, 'templates', version);
  
  if (!fs.existsSync(templateDir)) {
      console.error(`${colors.red}Template directory not found: ${templateDir}${colors.reset}`);
      process.exit(1);
  }

  if (version === 'v1') {
      copyV1(templateDir, targetDir);
      await setupV1(targetDir, projectName);
  } else {
      copyV2(templateDir, targetDir);
      await setupV2(targetDir, projectName);
      
      // V2 Specific: Run Go Script
      console.log(`\n${colors.cyan}Running Go processing script...${colors.reset}`);
      try {
          const goDir = path.join(targetDir, 'golang');
          const goScriptPath = path.join(goDir, 'cmd', 'krebs-scraper', 'main.go');
          if (fs.existsSync(goScriptPath)) {
               console.log(`Executing: go run cmd/krebs-scraper/main.go -url ${projectUrl}`);
               execSync(`go run cmd/krebs-scraper/main.go -url ${projectUrl}`, { cwd: goDir, stdio: 'inherit' });
          } else {
               console.log(`${colors.yellow}Go script not found at ${goScriptPath}, skipping.${colors.reset}`);
          }
      } catch (e) {
           console.log(`${colors.red}Go execution failed: ${e.message}${colors.reset}`);
      }
  }

  section('✅ Setup Complete!');
  console.log(`\n${colors.bright}Next steps:${colors.reset}`);
  console.log(`  cd ${projectName}`);
  console.log('  npm run dev\n');
}

main().catch(e => {
    console.error(e);
    process.exit(1);
});