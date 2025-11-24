export interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingInterval: string;
  stripePriceId: string;
  active: boolean;
  features: string[];
  trialPeriodDays?: number;
}

export const PLANS: Plan[] = [
  {
    id: 'pro',
    name: 'Pro Plan',
    description: 'Unbegrenzter Zugriff auf alle Features',
    price: 29.99,
    currency: 'EUR',
    billingInterval: 'month',
    stripePriceId: process.env.NEXT_PUBLIC_STRIPE_PRO_PRICE_ID || '',
    active: true,
    features: [
      'Unbegrenzte Projekte',
      'Priorisierter Support',
      'Erweiterte Analysen',
      'Team-Kollaboration'
    ]
  }
];

export const getPlanById = (id: string): Plan | undefined => {
  return PLANS.find(plan => plan.id === id);
};
