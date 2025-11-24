'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from '@/src/lib/auth-client';
import Link from 'next/link';

interface Subscription {
  id: string;
  status: string;
  currentPeriodEnd: string;
  cancelAtPeriodEnd: boolean;
  product: {
    name: string;
    description: string | null;
    price: number;
    currency: string;
  };
}

interface SubscriptionsListProps {
  onCancelSuccess?: () => void;
  onCancelError?: (error: string) => void;
}

export default function SubscriptionsList({ onCancelSuccess, onCancelError }: SubscriptionsListProps) {
  const { data: session } = useSession();
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSubscriptions = useCallback(async () => {
    if (!session?.user?.id) return;

    try {
      const res = await fetch(`/api/user/subscriptions?userId=${session.user.id}`);
      const data = await res.json();
      setSubscriptions(data.subscriptions || []);
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
    } finally {
      setLoading(false);
    }
  }, [session?.user?.id]);

  useEffect(() => {
    if (session?.user?.id) {
      fetchSubscriptions();
    }
  }, [session?.user?.id, fetchSubscriptions]);

  

  const handleCancelSubscription = async (subscriptionId: string) => {
    if (!confirm('Are you sure you want to cancel this subscription? It will remain active until the end of the billing period.')) {
      return;
    }

    try {
      const res = await fetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionId,
          userId: session?.user?.id,
        }),
      });

      if (res.ok) {
        onCancelSuccess?.();
        fetchSubscriptions();
      } else {
        const data = await res.json();
        onCancelError?.(data.error || 'Failed to cancel subscription');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      onCancelError?.('Failed to cancel subscription');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted">Loading subscriptions...</p>
      </div>
    );
  }

  const hasActiveSubscription = subscriptions.some(
    (sub) => sub.status === 'active' || sub.status === 'trialing'
  );

  if (!hasActiveSubscription && subscriptions.length > 0) {
    return (
      <>
        <div className="bg-card rounded-lg p-6 mb-8 transition-colors border border-yellow-200 dark:border-yellow-700">
          <h2 className="text-xl font-semibold text-yellow-800 dark:text-yellow-400 mb-2">
            No Active Subscription
          </h2>
            <p className="text-muted mb-4">
            You don&apos;t have an active subscription. Subscribe to access premium content!
          </p>
          <Link
            href="/subscribe"
            className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            View Subscription Plans
          </Link>
        </div>
        {renderSubscriptionList()}
      </>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="bg-card rounded-lg p-8 text-center shadow-sm border border-card transition-colors">
        <p className="text-muted mb-4">You have no subscriptions yet.</p>
        <Link
          href="/subscribe"
          className="inline-block px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
        >
          Browse Plans
        </Link>
      </div>
    );
  }

  function renderSubscriptionList() {
    return (
      <div className="space-y-4">
        {subscriptions.map((subscription) => (
          <div
            key={subscription.id}
            className="bg-card rounded-lg p-6 border border-card shadow-sm transition-colors"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-2">
                  {subscription.product.name}
                </h3>
                {subscription.product.description && (
                  <p className="text-muted">
                    {subscription.product.description}
                  </p>
                )}
              </div>
              <span
                className={`px-3 py-1 rounded text-sm font-medium ${
                  subscription.status === 'active'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : subscription.status === 'trialing'
                    ? 'bg-primary/10 text-primary'
                    : subscription.status === 'canceled'
                    ? 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}
              >
                {subscription.status.charAt(0).toUpperCase() +
                  subscription.status.slice(1)}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-muted">
                <span className="font-semibold">Price:</span>{' '}
                {subscription.product.price.toFixed(2)}{' '}
                {subscription.product.currency.toUpperCase()} / month
              </p>
              <p className="text-muted">
                <span className="font-semibold">Renews on:</span>{' '}
                {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
              </p>
            </div>

            {subscription.cancelAtPeriodEnd && (
              <div className="bg-card border border-yellow-200 dark:border-yellow-700 rounded p-3 mb-4 transition-colors">
                <p className="text-yellow-800 dark:text-yellow-400 text-sm">
                  This subscription will be canceled on{' '}
                  {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                </p>
              </div>
            )}

            {(subscription.status === 'active' ||
              subscription.status === 'trialing') &&
              !subscription.cancelAtPeriodEnd && (
                <button
                  onClick={() => handleCancelSubscription(subscription.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                  Cancel Subscription
                </button>
              )}
          </div>
        ))}
      </div>
    );
  }


  return renderSubscriptionList();
}
