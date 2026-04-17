import { Suspense } from 'react';
import type { ReactNode } from 'react';
import { notFound, redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { isValidMarket } from '@product-portal/constants';

import { Navigation } from '@product-portal/ui';
import { projectBConfig } from '../../brand/config';
import { verifySession, SESSION_COOKIE_NAME } from '../../lib/auth';

interface Props {
  children: ReactNode;
  params: Promise<{ market: string }>;
}

async function AuthNav({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  if (!isValidMarket(market)) notFound();

  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;
  const session = token ? await verifySession(token) : null;
  const user = session
    ? { displayName: session.displayName, username: session.username, role: session.role }
    : null;

  async function logoutAction() {
    'use server';
    (await cookies()).delete(SESSION_COOKIE_NAME);
    redirect(`/${market}`);
  }

  return <Navigation market={market} user={user} logoutAction={logoutAction} />;
}

// ProjectB uses side menu — layout direction is known statically from brand config
const isHorizontalMenu =
  projectBConfig.theme.menuPosition === 'top' ||
  projectBConfig.theme.menuPosition === 'bottom';

export default function MarketLayout({ children, params }: Props) {
  return (
    <div className={`min-h-screen ${isHorizontalMenu ? 'flex flex-col' : 'flex flex-row'}`}>
      <Suspense fallback={<nav className={isHorizontalMenu ? 'h-14 border-b border-gray-200 bg-white' : 'w-50 border-r border-gray-200 bg-white'} />}>
        <AuthNav params={params} />
      </Suspense>
      <div className="flex-1">{children}</div>
    </div>
  );
}
