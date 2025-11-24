'use client';

import { useState, useEffect } from 'react';
import { useSession } from '@/src/lib/auth-client';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
  billingInterval: string;
  trialPeriodDays: number | null;
  active: boolean;
}

interface SubscriptionPlansProps {
  onSubscribeStart?: () => void;
  onSubscribeError?: (error: string) => void;
}

export default function SubscriptionPlans({ onSubscribeStart, onSubscribeError }: SubscriptionPlansProps) {
  const { data: session } = useSession();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      const activeProducts = (data.products || []).filter(
        (p: Product) => p.active
      );
      setProducts(activeProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async (productId: string, appliedCoupon?: string) => {
    if (!session?.user?.id) {
      onSubscribeError?.('Please log in to subscribe');
      return;
    }

    try {
      onSubscribeStart?.();
      
      const stripe = await stripePromise;
      if (!stripe) {
        onSubscribeError?.('Stripe not loaded');
        return;
      }

      const res = await fetch('/api/stripe/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: session.user.id,
          couponCode: appliedCoupon || undefined,
        }),
      });

      const data = await res.json();

      if (data.error) {
        onSubscribeError?.(data.error);
        return;
      }

      const result = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (result.error) {
        onSubscribeError?.(result.error.message || 'Checkout failed');
      }
    } catch (error) {
      console.error('Error creating subscription:', error);
      onSubscribeError?.('Failed to create subscription');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-muted">Loading subscription plans...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-card rounded-lg p-8 text-center shadow-sm border border-card">
        <p className="text-muted">No subscription plans available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-card rounded-lg p-8 border-2 border-card hover:border-primary transition-colors shadow-sm"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{product.name}</h2>
          
          {product.trialPeriodDays && product.trialPeriodDays > 0 && (
            <div className="mb-4 px-3 py-1 bg-green-100 dark:bg-green-600/20 border border-green-600 rounded-full text-green-700 dark:text-green-400 text-sm text-center">
              🎁 {product.trialPeriodDays} days free trial
            </div>
          )}
          
            <div className="mb-6">
            <span className="text-4xl font-bold text-foreground">
              {product.price.toFixed(2)}
            </span>
            <span className="text-muted ml-2">
              {product.currency.toUpperCase()} / {product.billingInterval === 'year' ? 'year' : 'month'}
            </span>
          </div>

          {product.description && (
            <p className="text-muted mb-6">{product.description}</p>
          )}

          {selectedProduct === product.id ? (
            <div className="mb-4">
                <label className="block text-sm text-muted mb-2">
                Have a coupon code?
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="COUPON CODE"
                  className="flex-1 px-3 py-2 bg-transparent border border-card rounded text-foreground placeholder:text-gray-400 dark:placeholder:text-gray-500 uppercase"
                />
                <button
                  onClick={() => {
                    setSelectedProduct(null);
                    setCouponCode('');
                  }}
                  className="px-3 py-2 bg-transparent text-muted rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  ✕
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setSelectedProduct(product.id)}
              className="w-full mb-3 text-sm text-primary hover:text-primary/80"
            >
              + Add coupon code
            </button>
          )}

          <button
            onClick={() => handleSubscribe(product.id, selectedProduct === product.id ? couponCode : undefined)}
            className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold transition-colors"
          >
            Subscribe Now
          </button>
        </div>
      ))}
    </div>
  );
}

