'use client';

import { useSession } from '@/src/lib/auth-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import SubscriptionsList from '@/src/components/stripe/SubscriptionsList';

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.push('/login?redirect=/profile');
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
    return null;
  }

  return (
    <div className="min-h-screen bg-background p-8 pt-24">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Account Settings</h1>
        </div>

        {/* User Profile Card */}
        <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Profile Information</h2>
            <p className="text-sm text-muted-foreground mt-1">Manage your personal details</p>
          </div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <div className="p-3 bg-muted/50 rounded-md border border-border text-foreground">
                  {session.user.name || 'Not set'}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <div className="p-3 bg-muted/50 rounded-md border border-border text-foreground">
                  {session.user.email}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">User ID</label>
                <div className="p-3 bg-muted/50 rounded-md border border-border text-foreground font-mono text-xs">
                  {session.user.id}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Account Created</label>
                <div className="p-3 bg-muted/50 rounded-md border border-border text-foreground">
                  {new Date(session.user.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Subscription Status Card */}
        <div className="bg-card text-card-foreground rounded-xl shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border">
            <h2 className="text-xl font-semibold">Subscription Management</h2>
            <p className="text-sm text-muted-foreground mt-1">View and manage your active plan</p>
          </div>
          <div className="p-6">
            <SubscriptionsList />
          </div>
        </div>
      </div>
    </div>
  );
}
