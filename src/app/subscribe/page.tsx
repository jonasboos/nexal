'use client';

import SubscriptionPlans from '@/src/components/stripe/SubscriptionPlans';
import Link from 'next/link';

export default function SubscribePage() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-8">
            ← Back to Dashboard
          </Link>
          <h1 className="text-4xl font-extrabold text-foreground sm:text-5xl sm:tracking-tight lg:text-6xl">
            Choose your plan
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-muted-foreground">
            Unlock the full potential of your application with our premium plans.
          </p>
        </div>

        <div className="mt-12">
          <SubscriptionPlans />
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">
            Have questions? <a href="#" className="text-primary hover:underline">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
}
