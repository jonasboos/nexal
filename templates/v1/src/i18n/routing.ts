import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  // A list of all locales that are supported
  // Must match LANGUAGES in LanguageSwitcher.tsx and SUPPORTED_LANGUAGES in generate-translations.js
  locales: ['en', 'de', 'fr', 'es', 'it', 'pt', 'nl', 'pl', 'ru', 'ja', 'zh'],
 
  // Used when no locale matches
  defaultLocale: 'en'
});