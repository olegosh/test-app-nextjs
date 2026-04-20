import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isValidMarket } from '@product-portal/constants';
import type { Market } from '@product-portal/constants';
import { CheckoutPage } from '@product-portal/ui';

export const metadata: Metadata = {
  title: 'Checkout — ProjectA',
  robots: { index: false },
};

interface Props {
  params: Promise<{ market: string }>;
}

async function CheckoutInner({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  if (!isValidMarket(market)) notFound();
  return <CheckoutPage market={market as Market} />;
}

export default function CheckoutRoute({ params }: Props) {
  return (
    <Suspense>
      <CheckoutInner params={params} />
    </Suspense>
  );
}
