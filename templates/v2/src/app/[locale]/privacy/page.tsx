import { useTranslations } from 'next-intl';

export default function PrivacyPage() {
  const t = useTranslations('Legal');
  const tExtras = useTranslations('PrivacyExtras');

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display mb-4 text-3xl text-foreground sm:text-4xl">
          {t('privacyTitle')}
        </h1>
        <p className="mb-8 text-muted">{t('privacyIntro')}</p>

        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { title: tExtras('card1Title'), text: tExtras('card1Text') },
            { title: tExtras('card2Title'), text: tExtras('card2Text') },
            { title: tExtras('card3Title'), text: tExtras('card3Text') }
          ].map((card) => (
            <div key={card.title} className="rounded-3xl border border-default bg-muted p-5">
              <h3 className="text-sm font-semibold text-foreground">{card.title}</h3>
              <p className="mt-2 text-sm text-muted">{card.text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-default bg-card p-8 shadow-[var(--shadow-card)]">
          <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Data Collection</h2>
          <p>We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support.</p>
          
          <h2>2. Use of Information</h2>
          <p>We use the information we collect to provide, maintain, and improve our services, process transactions, and send you related information.</p>
          
          <h2>3. Data Sharing</h2>
          <p>We do not sell, trade, or otherwise transfer your personal information to outside parties except as described in this policy.</p>
          
          <h2>4. Cookies</h2>
          <p>We use cookies and similar technologies to collect information about your browsing activities and to personalize your experience.</p>
          
          <h2>5. Security</h2>
          <p>We implement appropriate technical and organizational measures to protect your personal information against unauthorized access or disclosure.</p>
          
          <h2>6. Contact</h2>
          <p>If you have questions about this Privacy Policy, please contact us at privacy@lumina.inc.</p>
          </div>
        </div>

        <div className="mt-10 rounded-3xl border border-default bg-muted p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">{tExtras('ctaEyebrow')}</p>
              <p className="mt-2 text-sm font-semibold text-foreground">{tExtras('ctaHeading')}</p>
              <p className="mt-2 text-sm text-muted">{tExtras('ctaSummary')}</p>
            </div>
            <a
              className="inline-flex items-center rounded-full bg-accent px-5 py-2.5 text-xs font-semibold text-[color:var(--accent-foreground)]"
              href="mailto:privacy@lumina.inc"
            >
              {tExtras('ctaButton')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
