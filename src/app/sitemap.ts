import fs from "fs";
import path from "path";
import { routing } from "@/src/i18n/routing";
import { MetadataRoute } from "next";

const APP_DIR = path.join(process.cwd(), "src", "app");
const LOCALE_DIR = path.join(APP_DIR, "[locale]");

function isPageFile(name: string) {
  return name === "page.tsx" || name === "page.ts" || name === "page.jsx" || name === "page.js";
}

function walkPages(dir: string, pages: string[], baseDir: string) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const e of entries) {
    const fullPath = path.join(dir, e.name);
    if (e.isDirectory()) {
      // Skip special folders
      if (e.name.startsWith("_") || e.name === "api" || e.name === "components") {
        continue;
      }
      // Recurse
      walkPages(fullPath, pages, baseDir);
    } else if (e.isFile() && isPageFile(e.name)) {
      const relDir = path.relative(baseDir, dir);
      // Clean up route groups from the path
      // e.g. "(auth)/login" -> "login"
      const parts = relDir.split(path.sep).filter(p => !(p.startsWith("(") && p.endsWith(")")));
      const route = parts.join('/');
      pages.push(route === "" ? "" : `/${route}`);
    }
  }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const rawBaseUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3000";
  const baseUrl = rawBaseUrl.replace(/\/+$/, "");

  const pageRoutes: string[] = [];
  // Walk the [locale] directory to find all routes
  walkPages(LOCALE_DIR, pageRoutes, LOCALE_DIR);

  const sitemapEntries: MetadataRoute.Sitemap = [];

  for (const route of pageRoutes) {
    for (const locale of routing.locales) {
       sitemapEntries.push({
         url: `${baseUrl}/${locale}${route}`,
         lastModified: new Date(),
         changeFrequency: 'daily',
         priority: route === '' ? 1 : 0.8,
       });
    }
  }

  return sitemapEntries;
}
