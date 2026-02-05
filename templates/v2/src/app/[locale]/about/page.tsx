import { useTranslations } from 'next-intl';
import { Target, Eye, Heart, Lightbulb, Rocket } from 'lucide-react';

export default function AboutPage() {
  const t = useTranslations('About');
  const tExtra = useTranslations('AboutExtra');
  const valueStyles = [
    { icon: Lightbulb, title: t('value1Title'), text: t('value1Text'), className: "bg-accent-soft text-accent" },
    { icon: Heart, title: t('value2Title'), text: t('value2Text'), className: "bg-muted text-foreground" },
    { icon: Rocket, title: t('value3Title'), text: t('value3Text'), className: "bg-[color:var(--accent)] text-[color:var(--accent-foreground)]" }
  ];

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

      {/* Studios */}
      <section className="border-t border-default bg-card px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">{tExtra('studioEyebrow')}</p>
            <h2 className="font-display mt-3 text-3xl text-foreground sm:text-4xl">{tExtra('studioHeading')}</h2>
            <p className="mt-4 text-sm text-muted">{tExtra('studioSummary')}</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { title: tExtra('studioItem1Title'), text: tExtra('studioItem1Text') },
              { title: tExtra('studioItem2Title'), text: tExtra('studioItem2Text') },
              { title: tExtra('studioItem3Title'), text: tExtra('studioItem3Text') },
              { title: tExtra('studioItem4Title'), text: tExtra('studioItem4Text') }
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-default bg-muted p-6">
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-t border-default bg-muted px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10">
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">{tExtra('timelineEyebrow')}</p>
            <h2 className="font-display mt-3 text-3xl text-foreground sm:text-4xl">{tExtra('timelineHeading')}</h2>
          </div>
          <div className="grid gap-4 lg:grid-cols-3">
            {[
              { title: tExtra('timeline1Title'), text: tExtra('timeline1Text'), year: tExtra('timeline1Year') },
              { title: tExtra('timeline2Title'), text: tExtra('timeline2Text'), year: tExtra('timeline2Year') },
              { title: tExtra('timeline3Title'), text: tExtra('timeline3Text'), year: tExtra('timeline3Year') }
            ].map((item) => (
              <div key={item.title} className="rounded-3xl border border-default bg-card p-6 shadow-[var(--shadow-card)]">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">{item.year}</p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-2">
          <div className="rounded-3xl border border-default bg-card p-7 shadow-[var(--shadow-card)]">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-accent-soft text-accent">
              <Target className="h-5 w-5" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-foreground">{t('mission')}</h2>
            <p className="text-muted">{t('missionText')}</p>
          </div>
          <div className="rounded-3xl border border-default bg-card p-7 shadow-[var(--shadow-card)]">
            <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-muted text-foreground">
              <Eye className="h-5 w-5" />
            </div>
            <h2 className="mb-2 text-lg font-semibold text-foreground">{t('vision')}</h2>
            <p className="text-muted">{t('visionText')}</p>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-default bg-muted px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl text-foreground sm:text-4xl">{t('values')}</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-3">
            {valueStyles.map((value) => (
              <div key={value.title} className="rounded-3xl border border-default bg-card p-6 shadow-[var(--shadow-card)]">
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl ${value.className}`}>
                  <value.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 text-base font-semibold text-foreground">{value.title}</h3>
                <p className="text-sm text-muted">{value.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="border-t border-default bg-card px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">{tExtra('teamEyebrow')}</p>
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">{tExtra('teamHeading')}</h2>
            </div>
            <p className="max-w-sm text-sm text-muted">{tExtra('teamSummary')}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { name: tExtra('team1Name'), role: tExtra('team1Role') },
              { name: tExtra('team2Name'), role: tExtra('team2Role') },
              { name: tExtra('team3Name'), role: tExtra('team3Role') },
              { name: tExtra('team4Name'), role: tExtra('team4Role') }
            ].map((member) => (
              <div key={member.name} className="rounded-3xl border border-default bg-muted p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-sm font-semibold text-accent">
                  {member.name
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </div>
                <h3 className="mt-4 text-base font-semibold text-foreground">{member.name}</h3>
                <p className="text-sm text-muted">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
