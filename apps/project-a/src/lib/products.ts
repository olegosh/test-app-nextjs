import type { Product, ProductsApiResponse } from '@product-portal/types';
import type { Market } from '@product-portal/constants';
import {
  DUMMYJSON_BASE_URL,
  PRODUCTS_LIMIT,
  REVALIDATE_SECONDS,
  SHUFFLE_COUNT,
} from '@product-portal/constants';

function deriveSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]/g, '');
}

/** ProjectA market offsets: EN starts at 0, CA starts at 30 */
const MARKET_SKIP: Record<Market, number> = {
  en: 0,
  ca: 30,
};

export async function fetchProducts(market: Market): Promise<Product[]> {
  const skip = MARKET_SKIP[market];
  const res = await fetch(
    `${DUMMYJSON_BASE_URL}/products?limit=${PRODUCTS_LIMIT}&skip=${skip}`,
    { next: { revalidate: REVALIDATE_SECONDS } },
  );
  if (!res.ok) throw new Error(`Failed to fetch products: ${res.status}`);
  const data: ProductsApiResponse = await res.json();
  return data.products.map((p) => ({ ...p, slug: deriveSlug(p.title) }));
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
