'use client';

import { useSession } from '@/src/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login?redirect=/dashboard');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="flex h-[calc(100vh-6rem)] items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[10%] w-[70vw] h-[70vw] rounded-full bg-primary/5 blur-[100px]" />
        <div className="absolute top-[40%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-blue-500/5 blur-[100px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10 pt-24">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session.user.name || session.user.email}</p>
          </div>
        </motion.header>

        {/* Example Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-2xl font-bold text-foreground mb-4">Your Content</h2>
          <div className="bg-card/50 backdrop-blur-sm text-card-foreground rounded-xl shadow-sm border border-border p-8 text-center">
            <p className="text-muted-foreground mb-4">You haven&apos;t created any content yet.</p>
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
              Create New Project
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
