import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function NotFound() {
  const t = useTranslations('NotFound');

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <span className="font-display text-7xl text-muted sm:text-9xl">404</span>
      <h1 className="mt-4 text-2xl font-semibold text-foreground sm:text-3xl">
        {t('title')}
      </h1>
      <p className="mt-2 max-w-md text-muted">
        {t('description')}
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-accent px-6 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
      >
        {t('back')}
      </Link>
    </div>
  );
}
