let stripeInstance: any = null;

export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return !!key && (key.startsWith("sk_test_") || key.startsWith("sk_live_"));
}

export async function getStripe() {
  if (stripeInstance) return stripeInstance;
  if (!isStripeConfigured()) return null;

  const { default: Stripe } = await import("stripe");
  stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2025-03-31.basil" as any,
  });
  return stripeInstance;
}
