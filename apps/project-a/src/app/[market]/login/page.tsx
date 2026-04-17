import { Suspense } from 'react';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import type { Metadata } from 'next';
import { LoginForm } from '@product-portal/ui';
import { isValidMarket } from '@product-portal/constants';
import type { Market } from '@product-portal/constants';
import { signSession, findCredential, SESSION_COOKIE_NAME, SESSION_MAX_AGE } from '../../../lib/auth';

interface Props {
  params: Promise<{ market: string }>;
  searchParams: Promise<{ redirect?: string }>;
}

export const metadata: Metadata = {
  title: 'Sign In — ProjectA',
  robots: { index: false },
};

async function LoginContent({ market, searchParams }: { market: Market; searchParams: Promise<{ redirect?: string }> }) {
  const { redirect: redirectTo } = await searchParams;

  async function loginAction(formData: FormData): Promise<{ error?: string }> {
    'use server';
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;
    const credential = findCredential(username, password);

    if (!credential || (credential.role !== 'admin' && credential.market !== market)) {
      return { error: 'Invalid credentials for this market' };
    }

    const token = await signSession({
      username: credential.username,
      market: credential.market,
      displayName: credential.displayName,
      role: credential.role,
    });

    (await cookies()).set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });

    redirect(redirectTo ?? `/${market}/products`);
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-gray-50">
      <div className="w-full max-w-sm bg-white rounded-xl border border-gray-200 shadow-sm p-8">
        <h1 className="text-2xl font-bold mb-2 text-center text-gray-900">Sign in</h1>
        <p className="text-sm text-gray-500 text-center mb-6">ProjectA · {market.toUpperCase()} Market</p>
        <LoginForm market={market} action={loginAction} />
      </div>
    </main>
  );
}

async function LoginInner({ params, searchParams }: Props) {
  const { market } = await params;
  if (!isValidMarket(market)) redirect('/en');
  return <LoginContent market={market} searchParams={searchParams} />;
}

export default function LoginPage({ params, searchParams }: Props) {
  return (
    <Suspense>
      <LoginInner params={params} searchParams={searchParams} />
    </Suspense>
  );
}
