'use client';

import { useSession } from '@/src/lib/auth-client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SubscriptionsList from '@/src/components/stripe/SubscriptionsList';

export default function DashboardPage() {
  const { data: session, isPending, error } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login');
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {session.user.name || session.user.email}</p>
          </div>
          <Link 
            href="/subscribe" 
            className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors"
          >
            Upgrade Plan
          </Link>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* User Profile Card */}
          <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6">
            <h2 className="text-xl font-semibold mb-4">Profile</h2>
            <div className="space-y-2">
              <p><span className="font-medium text-muted-foreground">Name:</span> {session.user.name}</p>
              <p><span className="font-medium text-muted-foreground">Email:</span> {session.user.email}</p>
              <p><span className="font-medium text-muted-foreground">ID:</span> <span className="text-xs font-mono bg-muted px-1 rounded">{session.user.id}</span></p>
            </div>
          </div>

          {/* Subscription Status Card */}
          <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-6 md:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Subscription</h2>
            <SubscriptionsList />
          </div>
        </div>

        {/* Example Content Section */}
        <div className="mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Your Content</h2>
          <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border p-8 text-center">
            <p className="text-muted-foreground mb-4">You haven't created any content yet.</p>
            <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
              Create New Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
