import { Suspense } from 'react';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import { isValidMarket, routes } from '@product-portal/constants';
import type { Market } from '@product-portal/constants';

interface Props {
  params: Promise<{ market: string }>;
}

const marketContent: Record<Market, { headline: string; body: string }> = {
  en: {
    headline: 'Welcome to ProjectA',
    body: 'Browse our curated selection of products, exclusively for our English-speaking customers.',
  },
  ca: {
    headline: 'Bienvenue sur ProjectA',
    body: 'Découvrez notre sélection exclusive de produits pour nos clients canadiens.',
  },
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { market } = await params;
  if (!isValidMarket(market)) return {};
  return {
    title: `${marketContent[market].headline} — ProjectA`,
    description: marketContent[market].body,
  };
}

async function WelcomeContent({ params }: { params: Promise<{ market: string }> }) {
  const { market } = await params;
  if (!isValidMarket(market)) notFound();
  const content = marketContent[market];

  return (
    <main className="max-w-2xl mx-auto px-6 py-24">
      <div className="inline-block rounded-full bg-green-50 border border-green-200 px-3 py-1 text-xs font-medium text-green-700 mb-6">
        {market.toUpperCase()} Market
      </div>
      <h1 className="text-5xl font-bold mb-6 tracking-tight text-gray-900">
        {content.headline}
      </h1>
      <p className="text-lg text-gray-500 leading-relaxed mb-8">{content.body}</p>
      <Link
        href={routes.products(market)}
        className="inline-flex items-center gap-2 rounded-lg bg-green-600 px-6 py-3 text-sm font-semibold text-white hover:bg-green-700 transition-colors"
      >
        Browse products →
      </Link>
    </main>
  );
}

export default function WelcomePage({ params }: Props) {
  return (
    <Suspense>
      <WelcomeContent params={params} />
    </Suspense>
  );
}
