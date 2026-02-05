"use client";

import { useTranslations } from 'next-intl';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

export default function ContactPage() {
  const t = useTranslations('Contact');
  const tExtras = useTranslations('ContactExtras');
  const [sending, setSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setTimeout(() => setSending(false), 2000);
  };

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="border-b border-default px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="font-display text-4xl text-foreground sm:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-muted">
            {t('subtitle')}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-2">
          {/* Form */}
          <div className="rounded-3xl border border-default bg-card p-8 shadow-[var(--shadow-card)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t('name')}
                </label>
                <input
                  type="text"
                  required
                  className="w-full rounded-2xl border border-default bg-card px-4 py-2.5 text-foreground placeholder:text-muted focus-visible:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t('email')}
                </label>
                <input
                  type="email"
                  required
                  className="w-full rounded-2xl border border-default bg-card px-4 py-2.5 text-foreground placeholder:text-muted focus-visible:outline-none"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">
                  {t('message')}
                </label>
                <textarea
                  rows={5}
                  required
                  className="w-full resize-none rounded-2xl border border-default bg-card px-4 py-2.5 text-foreground placeholder:text-muted focus-visible:outline-none"
                />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-5 py-3 text-sm font-semibold transition-all hover:translate-y-[-1px] hover:shadow-[var(--shadow-card)] disabled:opacity-50"
              >
                {sending ? t('sending') : t('send')}
                <Send className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <div>
              <h2 className="font-display text-2xl text-foreground">{t('info')}</h2>
            </div>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-accent-soft text-accent">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t('emailLabel')}</p>
                  <p className="text-muted">hello@lumina.inc</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-muted text-foreground">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t('phoneLabel')}</p>
                  <p className="text-muted">+49 123 456 789</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-card text-foreground border border-default">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{t('addressLabel')}</p>
                  <p className="text-muted">Musterstraße 123<br />12345 Berlin</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Response Stats */}
      <section className="border-t border-default bg-muted px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">{tExtras('statsEyebrow')}</p>
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">{tExtras('statsHeading')}</h2>
            </div>
            <p className="max-w-sm text-sm text-muted">{tExtras('statsSummary')}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            {[
              { value: tExtras('stat1Value'), label: tExtras('stat1Label') },
              { value: tExtras('stat2Value'), label: tExtras('stat2Label') },
              { value: tExtras('stat3Value'), label: tExtras('stat3Label') }
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-default bg-card p-6 shadow-[var(--shadow-card)]">
                <p className="font-display text-3xl text-foreground">{stat.value}</p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Locations */}
      <section className="border-t border-default bg-card px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">{tExtras('locationsEyebrow')}</p>
            <h2 className="font-display mt-3 text-3xl text-foreground sm:text-4xl">{tExtras('locationsHeading')}</h2>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              { city: tExtras('location1City'), address: tExtras('location1Address') },
              { city: tExtras('location2City'), address: tExtras('location2Address') },
              { city: tExtras('location3City'), address: tExtras('location3Address') }
            ].map((location) => (
              <div key={location.city} className="rounded-3xl border border-default bg-muted p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">{location.city}</p>
                <p className="mt-3 text-sm text-foreground">{location.address}</p>
                <button className="mt-4 inline-flex items-center rounded-full border border-default bg-card px-4 py-2 text-xs font-semibold text-foreground">
                  {tExtras('locationButton')}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact FAQ */}
      <section className="border-t border-default bg-muted px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">{tExtras('faqEyebrow')}</p>
            <h2 className="font-display mt-3 text-3xl text-foreground sm:text-4xl">{tExtras('faqHeading')}</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {[
              { q: tExtras('faq1Q'), a: tExtras('faq1A') },
              { q: tExtras('faq2Q'), a: tExtras('faq2A') },
              { q: tExtras('faq3Q'), a: tExtras('faq3A') },
              { q: tExtras('faq4Q'), a: tExtras('faq4A') }
            ].map((item) => (
              <div key={item.q} className="rounded-3xl border border-default bg-card p-6">
                <p className="text-sm font-semibold text-foreground">{item.q}</p>
                <p className="mt-2 text-sm text-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
