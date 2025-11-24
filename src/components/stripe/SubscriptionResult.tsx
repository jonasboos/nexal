'use client';

import Link from 'next/link';

interface SubscriptionResultProps {
  success: boolean;
  sessionId?: string | null;
}

export default function SubscriptionResult({ success, sessionId }: SubscriptionResultProps) {
  if (success) {
    return (
      <div className="h-[calc(100vh-6rem)] flex items-center justify-center bg-background text-foreground px-4 transition-colors">
        <div className="max-w-md text-center">
          <div className="bg-card rounded-lg p-8 border border-green-200 dark:border-green-700 shadow-md dark:shadow-none transition-colors">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-3xl font-bold mb-4 text-green-600 dark:text-green-400">
              Subscription Successful!
            </h1>
            <p className="text-muted mb-6">
              Thank you for subscribing! Your subscription is now active and you have access to all premium content.
            </p>
            {sessionId && (
              <p className="text-sm text-muted mb-6">
                Session ID: {sessionId}
              </p>
            )}
            <div className="space-y-3">
              <Link
                href="/premium"
                className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold transition-colors"
              >
                Access Premium Content
              </Link>
              <Link href="/subscriptions" className="block w-full px-6 py-3 bg-card text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-card">
                View My Subscriptions
              </Link>
              <Link
                href="/"
                className="block w-full px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

    return (
      <div className="h-[calc(100vh-6rem)] flex items-center justify-center bg-background text-foreground px-4 transition-colors">
      <div className="max-w-md text-center">
        <div className="bg-card rounded-lg p-8 border border-yellow-200 dark:border-yellow-700 shadow-md dark:shadow-none transition-colors">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-3xl font-bold mb-4 text-yellow-600 dark:text-yellow-400">
            Subscription Canceled
          </h1>
          <p className="text-muted mb-6">
            Your subscription process was canceled. No charges were made to your account.
          </p>
          <div className="space-y-3">
            <Link
              href="/subscribe"
              className="block w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold transition-colors"
            >
              Try Again
            </Link>
            <Link href="/" className="block w-full px-6 py-3 bg-card text-muted rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border border-card">Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

