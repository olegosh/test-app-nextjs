import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isValidMarket } from '@product-portal/constants';
import type { Market } from '@product-portal/constants';
import { fetchProductsPage } from '../../../lib/products';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const market = searchParams.get('market') ?? 'en';
  const page = parseInt(searchParams.get('page') ?? '1', 10);

  if (!isValidMarket(market)) {
    return NextResponse.json({ error: 'Invalid market' }, { status: 400 });
  }

  const start = Date.now();
  const products = await fetchProductsPage(market as Market, page);
  const duration = Date.now() - start;

  console.log(
    `[API] /api/products market=${market} page=${page} — ${duration}ms ${duration < 5 ? '(cache hit)' : '(cache miss)'}`,
  );

  return NextResponse.json({ products, hasMore: products.length > 0 });
}
