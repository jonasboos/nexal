import { useTranslations } from 'next-intl';

export default function ImprintPage() {
  const t = useTranslations('Legal');
  const tExtras = useTranslations('ImprintExtras');

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-display mb-8 text-3xl text-foreground sm:text-4xl">
          {t('imprintTitle')}
        </h1>
        
        <div className="mb-10 grid gap-4 sm:grid-cols-3">
          {[
            { value: tExtras('stat1Value'), label: tExtras('stat1Label') },
            { value: tExtras('stat2Value'), label: tExtras('stat2Label') },
            { value: tExtras('stat3Value'), label: tExtras('stat3Label') }
          ].map((stat) => (
            <div key={stat.label} className="rounded-3xl border border-default bg-muted p-6">
              <p className="font-display text-2xl text-foreground">{stat.value}</p>
              <p className="mt-2 text-sm text-muted">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {[
            {
              title: t('company'),
              body: (
                <>
                  Lumina GmbH<br />
                  Musterstraße 123<br />
                  12345 Berlin<br />
                  Germany
                </>
              )
            },
            { title: t('represented'), body: <>Max Mustermann (CEO)</> },
            {
              title: t('contactInfo'),
              body: (
                <>
                  E-Mail: hello@lumina.inc<br />
                  Telefon: +49 123 456 789
                </>
              )
            },
            {
              title: t('registry'),
              body: (
                <>
                  Amtsgericht Berlin-Charlottenburg<br />
                  HRB 123456
                </>
              )
            },
            { title: t('vatId'), body: <>DE123456789</> }
          ].map((block) => (
            <div key={block.title} className="rounded-3xl border border-default bg-card p-6 shadow-[var(--shadow-card)]">
              <h2 className="mb-2 text-lg font-semibold text-foreground">{block.title}</h2>
              <p className="text-muted">{block.body}</p>
            </div>
          ))}
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
              href="mailto:hello@lumina.inc"
            >
              {tExtras('ctaButton')}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
