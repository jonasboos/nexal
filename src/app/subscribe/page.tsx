'use client';

import { useState } from 'react';
import { useSession } from '@/src/lib/auth-client';
import { loadStripe } from '@stripe/stripe-js';
import { PLANS } from '@/src/lib/plans';
import Link from 'next/link';
import { Check, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/src/lib/utils'; // Assuming utils exists, if not I'll use clsx directly or create it.
// If utils doesn't exist, I'll just use template literals.

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

export default function SubscribePage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubscribe = async (productId: string) => {
    if (!session?.user?.id) {
      // Redirect to login if not logged in
      window.location.href = `/login?redirect=/subscribe`;
      return;
    }

    try {
      setLoading(productId);
      setError(null);
      
      const stripe = await stripePromise;
      if (!stripe) throw new Error('Stripe not loaded');

      const res = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: session.user.id,
        }),
      });

      const data = await res.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch (err: any) {
      console.error('Error:', err);
      setError(err.message || 'Failed to start subscription');
    } finally {
      setLoading(null);
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/5 blur-[100px] animate-pulse" />
        <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* 3D Object Placeholder - CSS Animated */}
      <div className="absolute top-20 right-10 md:right-20 lg:right-40 w-32 h-32 md:w-48 md:h-48 opacity-20 md:opacity-40 pointer-events-none z-0 perspective-1000">
        <motion.div
          animate={{ 
            rotateX: [0, 180, 360],
            rotateY: [0, 180, 360],
            y: [0, -20, 0]
          }}
          transition={{ 
            duration: 20, 
            repeat: Infinity, 
            ease: "linear" 
          }}
          className="w-full h-full relative transform-style-3d"
        >
          <div className="absolute inset-0 border-2 border-primary/30 rounded-3xl transform rotate-45" />
          <div className="absolute inset-0 border-2 border-primary/30 rounded-full transform -rotate-45 scale-75" />
          <div className="absolute inset-0 border border-primary/20 rounded-lg transform rotate-12 scale-50" />
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8 transition-colors">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your needs. Upgrade anytime.
            </p>
          </motion.div>
        </div>

        <motion.div 
          variants={container}
          initial="hidden"
          animate="show"
          className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto items-start"
        >
          {/* Free Plan */}
          <motion.div variants={item} className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-8 hover:border-primary/50 transition-all duration-300">
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Free</h3>
              <p className="text-muted-foreground">Perfect for getting started</p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold">€0</span>
              <span className="text-muted-foreground">/month</span>
            </div>
            <ul className="space-y-4 mb-8">
              {['Basic Features', 'Community Support', '1 Project', 'Basic Analytics'].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm">
                  <Check className="w-5 h-5 text-primary" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
            <button 
              disabled
              className="w-full py-3 px-6 rounded-xl bg-secondary text-secondary-foreground font-medium cursor-default opacity-70"
            >
              Current Plan
            </button>
          </motion.div>

          {/* Pro Plan */}
          {PLANS.map((plan) => (
            <motion.div 
              key={plan.id} 
              variants={item}
              className="bg-card border-2 border-primary/20 rounded-2xl p-8 relative shadow-2xl shadow-primary/10 hover:border-primary transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-linear-to-r from-primary to-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2 shadow-lg">
                <Sparkles className="w-4 h-4" />
                Most Popular
              </div>
              
              <div className="mb-8">
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className="text-muted-foreground">{plan.description}</p>
              </div>
              
              <div className="mb-8">
                <span className="text-5xl font-bold">{plan.price}€</span>
                <span className="text-muted-foreground">/{plan.billingInterval}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-3 text-sm">
                    <div className="bg-primary/10 p-1 rounded-full">
                      <Check className="w-4 h-4 text-primary" />
                    </div>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleSubscribe(plan.id)}
                disabled={loading === plan.id}
                className="w-full py-4 px-6 rounded-xl bg-primary text-primary-foreground font-bold text-lg hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25 flex items-center justify-center gap-2"
              >
                {loading === plan.id ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Upgrade to Pro'
                )}
              </button>
              
              {error && (
                <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
              )}
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-20 text-center">
          <p className="text-muted-foreground text-sm">
            Secure payment via Stripe. Cancel anytime.
          </p>
        </div>
      </div>
    </div>
  );
}

