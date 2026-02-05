"use client";

import { Link, usePathname, useRouter, routing } from "@/i18n/routing";
import { Moon, Sun, ChevronDown, Menu, X } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { useTranslations, useLocale } from "next-intl";

const languageMeta: Record<string, { label: string; short: string; flag?: string }> = {
  de: { label: "Deutsch", short: "DE", flag: "🇩🇪" },
  en: { label: "English", short: "EN", flag: "🇬🇧" },
  fr: { label: "Francais", short: "FR", flag: "🇫🇷" }
};

export function NavBar() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setLangOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  const switchLocale = (newLocale: string) => {
    const currentPath = pathname || '/';
    router.push(currentPath, { locale: newLocale });
    setLangOpen(false);
    setMobileOpen(false);
  };

  const currentLang = languageMeta[locale] || {
    label: locale.toUpperCase(),
    short: locale.toUpperCase()
  };

  const locales = routing.locales;
  const isDark = resolvedTheme === "dark";

  const navLinks = [
    { href: "/about", label: t('about') },
    { href: "/#features", label: t('services') },
    { href: "/contact", label: t('contact') },
  ];

  return (
    <>
      <header className="sticky top-5 z-50 mx-auto w-full max-w-5xl px-4 animate-fade-up">
        <nav className="flex h-14 items-center justify-between rounded-full border border-default bg-card px-3 shadow-[var(--shadow-elev)] backdrop-blur-xl">
          {/* Logo */}
          <Link href="/" className="pl-3 text-sm font-semibold tracking-[0.2em] text-foreground">
            LUMINA
          </Link>

          {/* Desktop Nav - Center */}
          <div className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full px-3 py-1.5 text-sm text-muted transition-colors hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Actions - Right */}
          <div className="flex items-center">
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex h-9 items-center gap-1.5 rounded-full px-2.5 text-sm text-muted transition-colors hover:bg-muted hover:text-foreground"
                aria-expanded={langOpen}
                aria-haspopup="listbox"
              >
                {currentLang.flag ? <span>{currentLang.flag}</span> : null}
                <span className="text-xs tracking-[0.18em]">{currentLang.short}</span>
                <ChevronDown className={`h-3 w-3 transition-transform duration-200 ${langOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {langOpen && (
                <div className="absolute right-0 mt-2 w-36 rounded-2xl border border-default bg-card py-1 shadow-[var(--shadow-card)] animate-scale-in" role="listbox">
                  {locales.map((lang) => {
                    const meta = languageMeta[lang] || {
                      label: lang.toUpperCase(),
                      short: lang.toUpperCase()
                    };
                    return (
                    <button
                      key={lang}
                      onClick={() => switchLocale(lang)}
                      className={`flex w-full items-center justify-between gap-2 px-3 py-2 text-sm transition-colors ${
                        locale === lang
                          ? 'bg-muted text-foreground'
                          : 'text-muted hover:bg-muted'
                      }`}
                      role="option"
                      aria-selected={locale === lang}
                    >
                      <span className="flex items-center gap-2">
                        {meta.flag ? <span>{meta.flag}</span> : null}
                        <span>{meta.label}</span>
                      </span>
                      <span className="text-xs tracking-[0.18em] text-muted">{meta.short}</span>
                    </button>
                  );
                  })}
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(isDark ? "light" : "dark")}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Toggle theme"
            >
              {mounted && (isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />)}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-muted transition-colors hover:bg-muted hover:text-foreground md:hidden"
              aria-label="Toggle menu"
            >
              {mobileOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-[color:var(--background)] pt-24 animate-fade-in md:hidden">
          <nav className="flex flex-1 flex-col items-center justify-center gap-6">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`text-xl font-medium text-foreground animate-fade-up animate-delay-${i + 1}`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          
          <div className="border-t border-default p-6">
            <div className="flex flex-wrap justify-center gap-2">
              {locales.map((lang) => {
                const meta = languageMeta[lang] || {
                  label: lang.toUpperCase(),
                  short: lang.toUpperCase()
                };
                return (
                <button
                  key={lang}
                  onClick={() => switchLocale(lang)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    locale === lang
                      ? 'bg-accent text-[color:var(--accent-foreground)]'
                      : 'bg-muted text-muted hover:bg-muted'
                  }`}
                >
                  {meta.flag ? `${meta.flag} ` : ""}{meta.label}
                </button>
              );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
