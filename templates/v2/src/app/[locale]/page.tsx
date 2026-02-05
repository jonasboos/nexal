import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Hero');
  const tFeatures = useTranslations('Features');
  const tLogo = useTranslations('LogoWall');
  const tStats = useTranslations('Stats');
  const tProcess = useTranslations('Process');
  const tTestimonials = useTranslations('Testimonials');
  const tFaq = useTranslations('Faq');
  const tCta = useTranslations('Cta');

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex flex-1 flex-col px-4 pb-16 pt-24 sm:px-6">
        <div className="mx-auto grid w-full max-w-5xl gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
          <div className="space-y-6 text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-default bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-muted animate-fade-up">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[color:var(--accent)] opacity-70"></span>
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[color:var(--accent)]"></span>
              </span>
              {t('badge')}
            </div>

            <h1
              className="font-display text-4xl leading-tight text-foreground animate-fade-up animate-delay-1 sm:text-5xl"
              dangerouslySetInnerHTML={{
                __html: t.raw('title')
                  .replace('<highlight>', '<span class="text-accent">')
                  .replace('</highlight>', '</span>')
              }}
            />

            <p className="max-w-xl text-base text-muted animate-fade-up animate-delay-2 sm:text-lg">
              {t('description')}
            </p>

            <div className="flex flex-col items-start gap-3 pt-2 animate-fade-up animate-delay-3 sm:flex-row">
              <Link
                href="/contact"
                className="group inline-flex w-full items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-semibold transition-all hover:translate-y-[-1px] hover:shadow-[var(--shadow-card)] sm:w-auto"
              >
                {t('getStarted')}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/about"
                className="inline-flex w-full items-center justify-center rounded-full border border-default bg-card px-6 py-3 text-sm font-semibold text-foreground transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)] sm:w-auto"
              >
                {t('learnMore')}
              </Link>
            </div>
          </div>

          <div className="space-y-4">
            {[
              { icon: Zap, title: tFeatures('title1'), description: tFeatures('desc1') },
              { icon: Shield, title: tFeatures('title2'), description: tFeatures('desc2') },
              { icon: Globe, title: tFeatures('title3'), description: tFeatures('desc3') }
            ].map((feature, index) => (
              <div
                key={feature.title}
                className={`rounded-2xl border border-default bg-card p-5 shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 ${
                  index === 1 ? "lg:translate-x-6" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent">
                    <feature.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-foreground">{feature.title}</h3>
                    <p className="mt-1 text-sm text-muted">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Logo Wall */}
      <section className="w-full border-t border-default bg-card py-12">
        <div className="mx-auto flex max-w-5xl flex-col gap-8 px-4 sm:px-6">
          <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">{tLogo('eyebrow')}</p>
              <h2 className="font-display text-2xl text-foreground sm:text-3xl">{tLogo('heading')}</h2>
            </div>
            <p className="max-w-sm text-sm text-muted">{tLogo('summary')}</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[tLogo('item1'), tLogo('item2'), tLogo('item3'), tLogo('item4')].map((logo) => (
              <div key={logo} className="rounded-2xl border border-default bg-muted px-4 py-3 text-center text-xs font-semibold uppercase tracking-[0.26em] text-muted">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="w-full border-t border-default bg-muted py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">{tStats('eyebrow')}</p>
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">{tStats('heading')}</h2>
            </div>
            <p className="max-w-sm text-sm text-muted">{tStats('summary')}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { value: tStats('value1'), label: tStats('label1') },
              { value: tStats('value2'), label: tStats('label2') },
              { value: tStats('value3'), label: tStats('label3') },
              { value: tStats('value4'), label: tStats('label4') }
            ].map((stat) => (
              <div key={stat.label} className="rounded-3xl border border-default bg-card p-6 shadow-[var(--shadow-card)]">
                <p className="font-display text-3xl text-foreground">{stat.value}</p>
                <p className="mt-2 text-sm text-muted">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="w-full border-t border-default bg-card py-16">
        <div className="mx-auto grid max-w-5xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">{tProcess('eyebrow')}</p>
            <h2 className="font-display mt-3 text-3xl text-foreground sm:text-4xl">{tProcess('heading')}</h2>
            <p className="mt-4 text-sm text-muted">{tProcess('summary')}</p>
          </div>
          <div className="space-y-4">
            {[
              { title: tProcess('step1Title'), text: tProcess('step1Text') },
              { title: tProcess('step2Title'), text: tProcess('step2Text') },
              { title: tProcess('step3Title'), text: tProcess('step3Text') }
            ].map((step, index) => (
              <div key={step.title} className="rounded-3xl border border-default bg-muted p-6">
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-muted">0{index + 1}</p>
                <h3 className="mt-2 text-lg font-semibold text-foreground">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="w-full border-t border-default bg-muted py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">{tFeatures('eyebrow')}</p>
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">{tFeatures('heading')}</h2>
            </div>
            <p className="max-w-sm text-sm text-muted">{tFeatures('summary')}</p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: Zap, title: tFeatures('title1'), description: tFeatures('desc1') },
              { icon: Shield, title: tFeatures('title2'), description: tFeatures('desc2') },
              { icon: Globe, title: tFeatures('title3'), description: tFeatures('desc3') },
            ].map((feature, i) => (
              <div
                key={i}
                className="group rounded-3xl border border-default bg-card p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-card)]"
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-accent-soft text-accent transition-transform group-hover:-rotate-2">
                  <feature.icon className="h-4 w-4" />
                </div>
                <h3 className="mb-2 text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="w-full border-t border-default bg-card py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">{tTestimonials('eyebrow')}</p>
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">{tTestimonials('heading')}</h2>
            </div>
            <p className="max-w-sm text-sm text-muted">{tTestimonials('summary')}</p>
          </div>
          <div className="grid gap-5 lg:grid-cols-3">
            {[
              { quote: tTestimonials('quote1'), name: tTestimonials('name1'), role: tTestimonials('role1') },
              { quote: tTestimonials('quote2'), name: tTestimonials('name2'), role: tTestimonials('role2') },
              { quote: tTestimonials('quote3'), name: tTestimonials('name3'), role: tTestimonials('role3') }
            ].map((item) => (
              <div key={item.name} className="rounded-3xl border border-default bg-muted p-6">
                <p className="text-sm text-foreground">"{item.quote}"</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-xs font-semibold text-accent">
                    {item.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.name}</p>
                    <p className="text-xs text-muted">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="w-full border-t border-default bg-muted py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="mb-10 flex flex-col items-start gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">{tFaq('eyebrow')}</p>
              <h2 className="font-display text-3xl text-foreground sm:text-4xl">{tFaq('heading')}</h2>
            </div>
            <p className="max-w-sm text-sm text-muted">{tFaq('summary')}</p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {[
              { q: tFaq('q1'), a: tFaq('a1') },
              { q: tFaq('q2'), a: tFaq('a2') },
              { q: tFaq('q3'), a: tFaq('a3') },
              { q: tFaq('q4'), a: tFaq('a4') }
            ].map((item) => (
              <div key={item.q} className="rounded-3xl border border-default bg-card p-6">
                <p className="text-sm font-semibold text-foreground">{item.q}</p>
                <p className="mt-2 text-sm text-muted">{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="w-full border-t border-default bg-card py-16">
        <div className="mx-auto flex max-w-5xl flex-col items-start gap-6 px-4 sm:px-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-muted">{tCta('eyebrow')}</p>
            <h2 className="font-display mt-3 text-3xl text-foreground sm:text-4xl">{tCta('heading')}</h2>
            <p className="mt-3 max-w-xl text-sm text-muted">{tCta('summary')}</p>
          </div>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-full bg-accent px-7 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-card)]"
          >
            {tCta('button')}
          </Link>
        </div>
      </section>

    </div>
  );
}
