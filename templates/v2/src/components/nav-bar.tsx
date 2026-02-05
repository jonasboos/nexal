"use client";

import { Link, usePathname, useRouter } from "@/i18n/routing";
import { Moon, Sun, Languages } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";

export function NavBar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const switchLocale = () => {
    const nextLocale = locale === 'en' ? 'de' : locale === 'de' ? 'fr' : 'en';
    router.replace(pathname, {locale: nextLocale});
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
            LUMINAS
          </span>
        </Link>
        <div className="flex items-center gap-6">
          <nav className="hidden gap-6 md:flex">
            <Link
              href="/about"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {t('about')}
            </Link>
            <Link
              href="/#features"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {t('services')}
            </Link>
            <Link
              href="/contact"
              className="text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
            >
              {t('contact')}
            </Link>
          </nav>
          
          <div className="flex items-center gap-2">
              <button
                onClick={switchLocale}
                className="group flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                aria-label="Switch language"
              >
                 <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400 group-hover:text-zinc-900 dark:group-hover:text-zinc-100">
                    {locale.toUpperCase()}
                 </span>
              </button>

              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="group flex h-9 w-9 items-center justify-center rounded-md border border-zinc-200 bg-white hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:bg-zinc-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
                aria-label="Toggle theme"
              >
                {mounted ? (
                  theme === "dark" ? (
                    <Moon className="h-4 w-4 text-zinc-400 transition-colors group-hover:text-zinc-100" />
                  ) : (
                    <Sun className="h-4 w-4 text-zinc-600 transition-colors group-hover:text-zinc-900" />
                  )
                ) : (
                  <div className="h-4 w-4 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded-full" />
                )}
              </button>
          </div>
        </div>
      </div>
    </header>
  );
}
