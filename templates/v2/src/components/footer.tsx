import {Link} from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full border-t border-zinc-200 py-12 dark:border-zinc-800 bg-white dark:bg-zinc-950">
      <div className="container mx-auto flex flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-8">
        <div className="flex flex-col gap-2">
          <span className="text-lg font-bold tracking-tight text-zinc-900 dark:text-zinc-100">LUMINA</span>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            © {new Date().getFullYear()} {t('description')}
          </p>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 sm:justify-end">
           <Link href="/imprint" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">{t('imprint')}</Link>
           <Link href="/privacy" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">{t('privacy')}</Link>
           <Link href="/terms" className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-zinc-100">{t('terms')}</Link>
        </div>
      </div>
    </footer>
  );
}
