'use client';

import Link from 'next/link';

interface CheckoutResultProps {
  success: boolean;
  sessionId?: string | null;
  returnUrl?: string;
  returnLabel?: string;
}

export default function CheckoutResult({ 
  success, 
  sessionId, 
  returnUrl = '/',
  returnLabel = 'Go to Homepage'
}: CheckoutResultProps) {
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center transition-colors">
          <div className="mb-6">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-green-600 dark:text-green-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Payment Successful!
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              Your purchase has been completed successfully.
            </p>
          </div>

          {sessionId && (
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded mb-6 transition-colors">
              <p className="text-sm text-gray-600 dark:text-gray-300">Session ID:</p>
              <p className="text-xs font-mono text-gray-800 dark:text-gray-200 break-all">
                {sessionId}
              </p>
            </div>
          )}

          <div className="space-y-3">
            <Link
              href={returnUrl}
              className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {returnLabel}
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 transition-colors">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md max-w-md w-full text-center transition-colors">
        <div className="mb-6">
          <div className="w-16 h-16 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-yellow-600 dark:text-yellow-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Payment Cancelled
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Your payment was cancelled. No charges were made.
          </p>
        </div>

        <div className="space-y-3">
          <Link
            href={returnUrl}
            className="block w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {returnLabel}
          </Link>
        </div>
      </div>
    </div>
  );
}

