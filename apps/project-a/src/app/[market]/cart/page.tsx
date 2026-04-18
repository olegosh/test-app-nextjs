import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { isValidMarket } from '@product-portal/constants';
import type { Market } from '@product-portal/constants';
import { SESSION_COOKIE_NAME } from '@product-portal/constants';
import { CartPage } from '@product-portal/ui';
import { verifySession } from '../../../lib/auth';

export const metadata: Metadata = {
  title: 'Cart — ProjectA',
  robots: { index: false },
};

interface Props {
  params: Promise<{ market: string }>;
}

async function CartInner({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  if (!isValidMarket(market)) notFound();

  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;

  return (
    <CartPage
      market={market as Market}
      userMarket={session?.market}
      isAdmin={session?.role === 'admin'}
    />
  );
}

export default function CartRoute({ params }: Props) {
  return (
    <Suspense>
      <CartInner params={params} />
    </Suspense>
  );
}
