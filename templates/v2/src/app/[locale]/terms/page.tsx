import { useTranslations } from 'next-intl';

export default function TermsPage() {
  const t = useTranslations('Legal');
  const tExtras = useTranslations('TermsExtras');

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display mb-4 text-3xl text-foreground sm:text-4xl">
          {t('termsTitle')}
        </h1>
        <p className="mb-8 text-muted">{t('termsIntro')}</p>

        <div className="mb-10 grid gap-4 sm:grid-cols-2">
          {[
            { title: tExtras('point1Title'), text: tExtras('point1Text') },
            { title: tExtras('point2Title'), text: tExtras('point2Text') },
            { title: tExtras('point3Title'), text: tExtras('point3Text') },
            { title: tExtras('point4Title'), text: tExtras('point4Text') }
          ].map((item) => (
            <div key={item.title} className="rounded-3xl border border-default bg-muted p-6">
              <h3 className="text-sm font-semibold text-foreground">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.text}</p>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-default bg-card p-8 shadow-[var(--shadow-card)]">
          <div className="prose prose-zinc dark:prose-invert max-w-none">
          <h2>1. Acceptance of Terms</h2>
          <p>By accessing and using our services, you accept and agree to be bound by the terms and provisions of this agreement.</p>
          
          <h2>2. Use License</h2>
          <p>Permission is granted to temporarily use our services for personal, non-commercial transitory viewing only.</p>
          
          <h2>3. Disclaimer</h2>
          <p>The materials on our website are provided on an 'as is' basis. We make no warranties, expressed or implied.</p>
          
          <h2>4. Limitations</h2>
          <p>In no event shall we be liable for any damages arising out of the use or inability to use the materials on our website.</p>
          
          <h2>5. Revisions</h2>
          <p>We may revise these terms of service at any time without notice. By using this website you agree to be bound by the current version.</p>
          
          <h2>6. Governing Law</h2>
          <p>These terms and conditions are governed by and construed in accordance with the laws of Switzerland.</p>
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
              href="mailto:legal@lumina.inc"
            >
              {tExtras('ctaButton')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
