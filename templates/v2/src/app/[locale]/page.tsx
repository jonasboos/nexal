import { ArrowRight, Zap, Shield, Globe } from "lucide-react";
import { Link } from '@/i18n/routing';
import { Footer } from "@/components/footer";
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('Hero');
  const tFeatures = useTranslations('Features');

  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="flex w-full flex-col items-center justify-center space-y-10 py-24 px-4 text-center sm:px-8 md:py-32 lg:py-40">
         <div className="inline-flex items-center rounded-full border border-zinc-200 bg-white/50 px-3 py-1 text-sm font-medium text-zinc-800 backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/50 dark:text-zinc-200">
           <span className="mr-2 flex h-2 w-2 relative">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
           </span>
           {t('badge')}
         </div>
        
        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-zinc-900 sm:text-6xl lg:text-7xl dark:text-zinc-50"
            dangerouslySetInnerHTML={{ __html: t.raw('title').replace('<highlight>', '<span class="text-blue-600 dark:text-blue-500">').replace('</highlight>', '</span>') }}
        />
        
        <p className="max-w-2xl text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
          {t('description')}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/contact"
            className="flex items-center justify-center rounded-lg bg-zinc-900 px-8 py-3 text-sm font-medium text-white transition-all hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            {t('getStarted')} <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
          <Link
            href="/about"
            className="flex items-center justify-center rounded-lg border border-zinc-200 bg-white px-8 py-3 text-sm font-medium text-zinc-900 transition-all hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100 dark:hover:bg-zinc-900"
          >
            {t('learnMore')}
          </Link>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="container mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3 sm:px-8">
        {[
          {
            icon: Zap,
            title: tFeatures('title1'),
            description: tFeatures('desc1'),
          },
          {
            icon: Shield,
            title: tFeatures('title2'),
            description: tFeatures('desc2'),
          },
          {
            icon: Globe,
            title: tFeatures('title3'),
            description: tFeatures('desc3'),
          },
        ].map((feature, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-zinc-200 bg-white p-8 transition-shadow hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
          >
            <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 dark:bg-zinc-800">
              <feature.icon className="h-5 w-5 text-zinc-900 dark:text-zinc-100" />
            </div>
            <h3 className="mb-2 text-lg font-semibold text-zinc-900 dark:text-zinc-100">{feature.title}</h3>
            <p className="text-zinc-600 dark:text-zinc-400">{feature.description}</p>
          </div>
        ))}
      </section>

      <Footer />
    </div>
  );
}
