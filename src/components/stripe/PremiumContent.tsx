'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useSession } from '@/src/lib/auth-client';
import Link from 'next/link';

interface PremiumContentProps {
  children: ReactNode;
  fallbackContent?: ReactNode;
  loadingContent?: ReactNode;
}

export default function PremiumContent({ 
  children, 
  fallbackContent,
  loadingContent 
}: PremiumContentProps) {
  const { data: session, isPending } = useSession();
  const [hasAccess, setHasAccess] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isPending) return;
    
    if (!session) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    checkSubscription();
  }, [session, isPending]);

  const checkSubscription = async () => {
    if (!session?.user?.id) {
      setHasAccess(false);
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/user/subscriptions?userId=${session.user.id}`);
      const data = await res.json();
      
      const activeSubscription = (data.subscriptions || []).find(
        (sub: any) => sub.status === 'active' || sub.status === 'trialing'
      );

      setHasAccess(!!activeSubscription);
    } catch (error) {
      console.error('Error checking subscription:', error);
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (isPending || loading) {
    if (loadingContent) {
      return <>{loadingContent}</>;
    }
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center transition-colors">
          <p className="text-muted">Loading...</p>
        </div>
      );
  }

  if (!hasAccess) {
    if (fallbackContent) {
      return <>{fallbackContent}</>;
    }

    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center px-4 transition-colors">
          <div className="max-w-md text-center">
            <div className="bg-card rounded-lg p-8 border border-card shadow-md dark:shadow-none transition-colors">
            <div className="text-6xl mb-4">🔒</div>
            <h1 className="text-3xl font-bold mb-4">Premium Content</h1>
            <p className="text-muted mb-6">
              This content is only available to subscribers. Subscribe now to unlock exclusive features!
            </p>
            <div className="space-y-3">
              <Link
                href="/subscribe"
                className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold transition-colors"
              >
                View Subscription Plans
              </Link>
              <Link href="/" className="block w-full px-6 py-3 bg-card text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-card">Back to Home</Link>
            </div>
          </div>
        </div>
      </div>
    );
  }


  return <>{children}</>;
}
