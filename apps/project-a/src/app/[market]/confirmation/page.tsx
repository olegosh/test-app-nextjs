import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { isValidMarket } from '@product-portal/constants';
import type { Market } from '@product-portal/constants';
import { ConfirmationPage } from '@product-portal/ui';

export const metadata: Metadata = {
  title: 'Order Confirmed — ProjectA',
  robots: { index: false },
};

interface Props {
  params: Promise<{ market: string }>;
}

async function ConfirmationInner({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  if (!isValidMarket(market)) notFound();
  return <ConfirmationPage market={market as Market} />;
}

export default function ConfirmationRoute({ params }: Props) {
  return (
    <Suspense>
      <ConfirmationInner params={params} />
    </Suspense>
  );
}
