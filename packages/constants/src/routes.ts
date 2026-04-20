export const MARKETS = ['en', 'ca'] as const;
export type Market = (typeof MARKETS)[number];

export function isValidMarket(market: string): market is Market {
  return (MARKETS as readonly string[]).includes(market);
}

export const routes = {
  home: (market: Market) => `/${market}`,
  login: (market: Market) => `/${market}/login`,
  products: (market: Market) => `/${market}/products`,
  product: (market: Market, slug: string) => `/${market}/product/${slug}`,
  cart: (market: Market) => `/${market}/cart`,
  checkout: (market: Market) => `/${market}/checkout`,
  payment: (market: Market) => `/${market}/payment`,
  confirmation: (market: Market) => `/${market}/confirmation`,
  admin: (market: Market) => `/${market}/admin`,
} as const;
