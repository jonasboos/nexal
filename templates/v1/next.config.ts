import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

// Hinweis: Die Datenbankwahl wurde entfernt; MongoDB ist standardmäßig konfiguriert.

const nextConfig: NextConfig = {
  /* config options here */
};

export default withNextIntl(nextConfig);
