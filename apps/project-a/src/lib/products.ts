import { cacheLife, cacheTag } from 'next/cache';
import type { Product, ProductsApiResponse } from '@product-portal/types';
import type { Market } from '@product-portal/constants';
import {
  DUMMYJSON_BASE_URL,
  PRODUCTS_LIMIT,
  SHUFFLE_COUNT,
} from '@product-portal/constants';

function deriveSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

/** ProjectA market offsets: EN starts at 0, CA starts at 30 */
export const MARKET_SKIP: Record<Market, number> = {
  en: 0,
  ca: 30,
};

async function fetchProductsRaw(skip: number, limit: number): Promise<Product[]> {
  const res = await fetch(
    `${DUMMYJSON_BASE_URL}/products?limit=${limit}&skip=${skip}`,
  );
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  const data: ProductsApiResponse = await res.json();
  return data.products.map((p) => ({ ...p, slug: deriveSlug(p.title) }));
}

/** Cached initial product fetch for SSR — uses 'use cache' for Next.js 16 PPR */
export async function fetchProducts(market: Market): Promise<Product[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag(`products-${market}`);

  const skip = MARKET_SKIP[market];
  const products = await fetchProductsRaw(skip, PRODUCTS_LIMIT);

  console.log(
    `[Cache] fetchProducts(${market}) at ${new Date().toISOString()} — ${products.length} products, skip=${skip}`,
  );

  return products;
}

/** Cached paginated fetch for infinite scroll — serves from Next.js cache on repeat requests */
export async function fetchProductsPage(market: Market, page: number): Promise<Product[]> {
  'use cache';
  cacheLife('minutes');
  cacheTag(`products-${market}-page-${page}`);

  const baseSkip = MARKET_SKIP[market];
  const skip = baseSkip + page * PRODUCTS_LIMIT;
  const products = await fetchProductsRaw(skip, PRODUCTS_LIMIT);

  console.log(
    `[Cache] fetchProductsPage(${market}, page=${page}) at ${new Date().toISOString()} — ${products.length} products, skip=${skip}`,
  );

  return products;
}

export function shuffleFirst(products: Product[]): Product[] {
  const head = [...products.slice(0, SHUFFLE_COUNT)];
  const tail = products.slice(SHUFFLE_COUNT);

  // Fisher-Yates shuffle on the first SHUFFLE_COUNT items
  for (let i = head.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const tmp = head[i]!;
    head[i] = head[j]!;
    head[j] = tmp;
  }

  console.log(
    `[ISG] Products regenerated at ${new Date().toISOString()}. First ${SHUFFLE_COUNT} shuffled:`,
    head.map((p) => p.title),
  );

  return [...head, ...tail];
}

export async function fetchProductBySlug(market: Market, slug: string): Promise<Product | null> {
  const all = await fetchProducts(market);
  return all.find((p) => p.slug === slug) ?? null;
}
