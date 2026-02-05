import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";

export function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="w-full border-t border-default bg-card py-12">
      <div className="mx-auto grid w-full max-w-5xl gap-8 px-4 sm:grid-cols-[1.2fr_0.8fr] sm:px-6">
        <div className="flex flex-col gap-3">
          <span className="text-xs font-semibold tracking-[0.32em] text-foreground">LUMINA</span>
          <p className="max-w-md text-sm text-muted">{t('tagline')}</p>
          <span className="text-xs text-muted">© {new Date().getFullYear()} {t('description')}</span>
        </div>

        <div className="flex flex-col gap-4 sm:items-end">
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/imprint" className="text-xs text-muted transition-colors hover:text-foreground">
              {t('imprint')}
            </Link>
            <Link href="/privacy" className="text-xs text-muted transition-colors hover:text-foreground">
              {t('privacy')}
            </Link>
            <Link href="/terms" className="text-xs text-muted transition-colors hover:text-foreground">
              {t('terms')}
            </Link>
          </div>
          <div className="rounded-full border border-default bg-muted px-4 py-2 text-xs text-muted">
            {t('emailLabel')} hello@lumina.inc
          </div>
        </div>
      </div>
    </footer>
  );
}
