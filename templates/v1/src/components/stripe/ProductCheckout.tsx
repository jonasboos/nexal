'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  currency: string;
}

interface ProductCheckoutProps {
  userId?: string;
  onCheckoutStart?: () => void;
  onCheckoutError?: (error: string) => void;
}

export default function ProductCheckout({ userId, onCheckoutStart, onCheckoutError }: ProductCheckoutProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingProductId, setProcessingProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuy = async (productId: string) => {
    try {
      setProcessingProductId(productId);
      onCheckoutStart?.();

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          userId: userId || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        onCheckoutError?.(data.error || 'Checkout failed');
        setProcessingProductId(null);
        return;
      }

      const stripe = await stripePromise;
      if (!stripe) {
        onCheckoutError?.('Stripe failed to load');
        setProcessingProductId(null);
        return;
      }

      const { error } = await stripe.redirectToCheckout({
        sessionId: data.sessionId,
      });

      if (error) {
        onCheckoutError?.(error.message || 'Checkout failed');
        setProcessingProductId(null);
      }
    } catch (error) {
      console.error('Error initiating checkout:', error);
      onCheckoutError?.('Failed to start checkout');
      setProcessingProductId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-lg text-muted">Loading products...</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted mb-4">No products available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div
          key={product.id}
          className="bg-card rounded-lg shadow-md border border-card p-6 flex flex-col transition-colors"
        >
          <h2 className="text-2xl font-bold mb-2 text-foreground">{product.name}</h2>
          {product.description && (
            <p className="text-muted mb-4 grow">
              {product.description}
            </p>
          )}

          <div className="mt-auto">
            <div className="text-3xl font-bold mb-4 text-foreground">
              {product.price.toFixed(2)}{' '}
              <span className="text-lg text-muted">
                {product.currency.toUpperCase()}
              </span>
            </div>
            <button
              onClick={() => handleBuy(product.id)}
              disabled={processingProductId === product.id}
              className="w-full px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {processingProductId === product.id
                ? 'Processing...'
                : 'Buy Now'}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

