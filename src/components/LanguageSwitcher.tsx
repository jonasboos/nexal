"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/src/i18n/navigation";
import { useTransition, useState } from "react";
import { ChevronDown } from "lucide-react";

// Supported languages - must match those in generate-translations.js
const LANGUAGES = {
  en: { name: "English", flag: "🇺🇸" },
  de: { name: "Deutsch", flag: "🇩🇪" },
  fr: { name: "Français", flag: "🇫🇷" },
  es: { name: "Español", flag: "🇪🇸" },
  it: { name: "Italiano", flag: "🇮🇹" },
  pt: { name: "Português", flag: "🇵🇹" },
  nl: { name: "Nederlands", flag: "🇳🇱" },
  pl: { name: "Polski", flag: "🇵🇱" },
  ru: { name: "Русский", flag: "🇷🇺" },
  ja: { name: "日本語", flag: "🇯🇵" },
  zh: { name: "中文", flag: "🇨🇳" },
};

export default function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);

  const onSelectChange = (newLocale: string) => {
    startTransition(() => {
      router.replace(pathname, { locale: newLocale });
    });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isPending}
        className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-foreground hover:text-primary transition-colors disabled:opacity-50 rounded-md hover:bg-accent/50"
        aria-label="Select language"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span>{LANGUAGES[locale as keyof typeof LANGUAGES]?.flag}</span>
        <span className="hidden sm:inline">{LANGUAGES[locale as keyof typeof LANGUAGES]?.name}</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-card border border-border rounded-lg shadow-lg z-50 min-w-48 py-1">
          {Object.entries(LANGUAGES).map(([lang, { name, flag }]) => (
            <button
              key={lang}
              onClick={() => onSelectChange(lang)}
              disabled={isPending}
              className={`w-full px-4 py-2 text-left text-sm transition-colors flex items-center gap-2 ${
                locale === lang
                  ? "bg-primary text-primary-foreground"
                  : "hover:bg-accent text-foreground"
              } disabled:opacity-50`}
            >
              <span>{flag}</span>
              <span>{name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}