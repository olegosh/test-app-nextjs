import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isValidMarket } from '@product-portal/constants';
import type { Market } from '@product-portal/constants';
import { PaymentPage } from '@product-portal/ui';

export const metadata: Metadata = {
  title: 'Payment — ProjectB',
  robots: { index: false },
};

interface Props {
  params: Promise<{ market: string }>;
}

async function PaymentInner({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  if (!isValidMarket(market)) notFound();
  return <PaymentPage market={market as Market} />;
}

export default function PaymentRoute({ params }: Props) {
  return (
    <Suspense>
      <PaymentInner params={params} />
    </Suspense>
  );
}
