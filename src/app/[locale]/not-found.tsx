import { Link } from '@/src/i18n/navigation';
import { getTranslations } from 'next-intl/server';

export default async function NotFound() {
  const t = await getTranslations('NotFound');

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center">
      <h1 className="text-9xl font-black text-gray-200 dark:text-gray-800 select-none">404</h1>
      <div className="absolute mt-8 flex flex-col items-center">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100 sm:text-5xl">
          {t('title')}
        </h2>
        <p className="mt-4 text-base text-gray-600 dark:text-gray-400 max-w-md">
          {t('description')}
        </p>
        <div className="mt-10 flex justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-primary px-3.5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors"
          >
            {t('goHome')}
          </Link>
        </div>
      </div>
    </div>
  );
}
