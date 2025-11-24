'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-background font-sans text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 py-24 relative z-10">
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-clip-text text-transparent bg-linear-to-r from-foreground to-foreground/70">
              Next.js Template
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              A complete starter template with Authentication, Stripe Subscriptions, and MongoDB.
            </p>
            
            <div className="flex gap-4 justify-center">
              <Link
                href="/dashboard"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 transition-all shadow-lg hover:shadow-primary/25"
              >
                Get Started
              </Link>
              <Link
                href="/subscribe"
                className="px-8 py-3 bg-card border border-border text-foreground rounded-xl font-medium hover:bg-accent transition-all"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
