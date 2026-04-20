# Product Portal

A scalable, multi-brand product portal monorepo built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and Turborepo. Demonstrates DRY architecture, config-driven brand customization, SSR/ISG/PPR, JWT auth, cart with feature flags, and a shared component library.

## Project Structure

```
product-portal/
├── apps/
│   ├── project-a/          # ProjectA — green theme, vertical cards, top nav (port 3000)
│   └── project-b/          # ProjectB — red theme, horizontal cards, side nav (port 3001)
├── packages/
│   ├── config/             # Shared tsconfig, eslint, tailwind configs
│   ├── types/              # Shared TypeScript interfaces (zero runtime)
│   ├── constants/          # Runtime constants, route builders, credentials
│   └── ui/                 # Shared React component library
├── Dockerfile              # Multi-stage build (single file, both apps)
├── docker-compose.yml      # Run both apps in containers
└── turbo.json              # Turborepo task pipeline
```

## Prerequisites

- **Node.js** 22+
- **pnpm** 9+
- **Docker** (optional, for containerized deployment)

## Setup

```bash
# Install dependencies
pnpm install

# Create environment files
cp apps/project-a/.env.example apps/project-a/.env.local
cp apps/project-b/.env.example apps/project-b/.env.local

# Set JWT_SECRET in each .env.local (min 32 characters)
```

## CLI Commands

All commands support per-brand execution via `:a` / `:b` suffixes.

| Command | Description |
|---------|-------------|
| `pnpm dev` | Dev both apps concurrently |
| `pnpm dev:a` | Dev ProjectA only (port 3000) |
| `pnpm dev:b` | Dev ProjectB only (port 3001) |
| `pnpm build` | Build both apps |
| `pnpm build:a` | Build ProjectA only |
| `pnpm build:b` | Build ProjectB only |
| `pnpm start` | Start both in production mode |
| `pnpm start:a` | Start ProjectA production |
| `pnpm start:b` | Start ProjectB production |
| `pnpm test` | Run all tests |
| `pnpm test:a` | Test ProjectA only |
| `pnpm lint` | Lint both apps |
| `pnpm type-check` | TypeScript type checking |
| `pnpm format` | Format all files with Prettier |

## Routes

| Route | Access | Description |
|-------|--------|-------------|
| `/[market]` | Public | Welcome page (market-specific content) |
| `/[market]/login` | Public | Login with demo credentials |
| `/[market]/products` | Public | Product list with infinite scroll (ISG + cache) |
| `/[market]/product/[slug]` | Auth required | Product detail with reviews (SSR) |
| `/[market]/cart` | Public | Shopping cart |
| `/[market]/checkout` | Public | Shipping details form with autofill |
| `/[market]/payment` | Public | Payment method selection with demo card |
| `/[market]/confirmation` | Public | Order confirmation with order ID |
| `/[market]/admin` | Admin only | PPR dashboard with cached data sections |

Markets: `/en` (English) and `/ca` (Canadian) — each serves different products.

## Login Credentials

Stored in [`packages/constants/src/credentials.json`](packages/constants/src/credentials.json).

| Market | Username | Password | Role |
|--------|----------|----------|------|
| EN | `user-en` | `pass-en-123` | user |
| CA | `user-ca` | `pass-ca-123` | user |
| All | `admin` | `admin-123` | admin |

## Architecture Decisions

### Config-Driven Brand Composition

The core pattern: each app provides a `BrandConfig` object injected via React Context. Shared components read brand decisions from this config — **zero** `if (brand === 'x')` conditionals in shared code.

```typescript
// packages/types/src/brand.ts — the contract
interface BrandConfig {
  id: BrandId;
  theme: BrandTheme;              // primaryColor, fontFamily, menuPosition
  productCard: ProductCardConfig; // layout, grid, buttonVariant, showCategoryTag
  productDetail: ProductDetailConfig; // layout, memberSectionStyle
  cart: CartConfig;               // layout, checkoutLabel
  featureFlags: FeatureFlags;     // cartMarketSeparation
}
```

Each app satisfies this interface with its own values:

| Config | ProjectA | ProjectB |
|--------|----------|----------|
| Theme | Green (#22c55e), Inter | Red (#dc2626), Playfair Display |
| Menu | Top (sticky) | Side (sticky) |
| Product cards | Vertical, 280px min | Horizontal, 450px min |
| Product detail | Side-by-side, list member section | Stacked hero, card stats |
| Cart | List layout | Compact layout |
| Cart market separation | Disabled | Enabled |

Adding a third brand = create a new `BrandConfig` object + new app directory. Shared components are never touched.

### Responsive Grid

Product grid uses CSS `repeat(auto-fill, minmax(minCardWidth, 1fr))` driven by the brand config's `grid.minCardWidth`. No hardcoded breakpoints — the browser calculates columns automatically based on available width and minimum card size.

### Rendering Strategies

- **ISG** — Products list page uses `fetchProducts()` with `'use cache'` + `cacheLife('minutes')`. First 10 products shuffled on each regeneration with `console.log` evidence.
- **SSR** — Product detail page reads auth state server-side to conditionally render member-only content.
- **PPR** — Admin dashboard demonstrates Partial Pre-Rendering: static shell renders instantly, 4 data sections stream independently via `<Suspense>` with different cache strategies (`minutes`, `hours`, `days`, `dynamic`).
- **Infinite Scroll** — Products page loads 30 items server-side, then fetches more via `/api/products` on scroll. Paginated fetches are cached server-side with `'use cache'` + `cacheTag`.

### Authentication

- **JWT** via `jose` (Web Standards-compatible, works in Next.js 16 proxy)
- **HttpOnly cookie** — unique per app (`pp_session_a`, `pp_session_b`) to prevent cross-app conflicts on the same domain. Set via Server Actions.
- **Proxy** (`src/proxy.ts`) — validates JWT on protected routes, enforces admin role for `/admin`
- **Market restriction** — Product detail pages show a "Market Restricted" notice when a user accesses another market's product (admin bypasses)
- **SEO** — Products page sets `robots: index` for public visitors, `robots: noindex` for authenticated users

### Cart & Feature Flags

Cart uses React Context + `useReducer` with `localStorage` persistence. The `featureFlags.cartMarketSeparation` flag demonstrates market-based feature toggles:

- **ProjectA** (flag off) — all products from any market appear in cart
- **ProjectB** (flag on) — authenticated users only see their market's products in cart; admin sees all

### Mocked API

`/api/reviews/[productId]` simulates an unreleased backend endpoint. Returns deterministic fake reviews (seeded by product ID), with simulated latency. The response includes `_mock: true` to document it as a placeholder. Reviews display on the product detail page with brand-colored star ratings.

## Shared Component Architecture

All UI components live in `packages/ui/` and are consumed by both apps via the `@product-portal/ui` workspace package. Components never contain brand-specific conditionals — they read everything from `BrandConfig` via React Context.

| Component | Purpose |
|-----------|---------|
| `BrandProvider` | React Context provider for brand config |
| `CartProvider` | Cart state management with `useReducer` + localStorage |
| `Navigation` | Responsive nav (top/side/bottom) with auth state, market selector, cart badge |
| `ProductCard` | Config-driven card (vertical/horizontal layout, auto-fill grid) |
| `ProductGrid` | Responsive grid with infinite scroll and auth modal |
| `ProductDetail` | Config-driven detail page (side-by-side/stacked) with market restriction |
| `CartPage` | Full cart with quantity controls, totals, proceed to checkout |
| `CheckoutPage` | Shipping details form with demo autofill, order comment |
| `PaymentPage` | Payment method selection (card/PayPal/Apple Pay) with demo card autofill |
| `ConfirmationPage` | Order confirmation with ID, next steps, continue shopping |
| `LoginForm` | Auth form with demo credentials table loaded from JSON |
| `MarketSelector` | Custom dropdown with inline SVG flag icons, auto-disabled on detail pages |
| `AuthModal` | Native `<dialog>` for unauthenticated product detail access |
| `ScrollToTop` | Brand-colored scroll-to-top button |
| `ReviewsSection` | Client-side reviews from mocked API with star ratings |
| `UsersTable`, `RecentPosts`, `QuotesWidget`, `LiveTodos` | PPR admin dashboard sections with `'use cache'` |

### Package Dependency Graph

```
packages/config   (no deps)
      |
packages/types    (no runtime deps)
      |
packages/constants --> packages/types
      |
packages/ui       --> packages/types, packages/constants
      |
apps/*            --> all packages
```

This is a strict DAG — Turborepo requires it for correct build ordering.

## Testing

```bash
pnpm test        # All tests (35 total)
pnpm test:a      # ProjectA tests only
pnpm test:b      # ProjectB tests only
```

- **ProductCard unit tests** (14) — brand-specific layout, button colors, category tags, cart integration, auth modal, Details link
- **ProductDetail unit tests** (17) — both layouts, member sections (list vs cards), tags, auth states
- **Login integration tests** (4) — form submission, error handling, pending state, credentials from JSON

## Docker

```bash
# Build and run both apps
docker compose up --build

# Build a single app
docker build --build-arg APP_NAME=project-a -t product-portal-a .
docker build --build-arg APP_NAME=project-b -t product-portal-b .

# Run individually
docker run -p 3000:3000 -e JWT_SECRET=your-secret product-portal-a
```

The Dockerfile uses a 4-stage multi-stage build with `turbo prune` for minimal images. Adding a new app = add one service block to `docker-compose.yml` with a different `APP_NAME` arg.

## Trade-offs

| Decision | Rationale |
|----------|-----------|
| Raw TS in packages + `transpilePackages` | No build step in packages; Next.js transpiles. Not suitable for non-Next.js consumers. |
| Credentials in JSON file | Task requirement for demo. Production: env vars or secrets manager. |
| Custom JWT (no next-auth) | Simpler, no adapter config. `jose` works in Edge/Node runtimes. |
| React Context for cart (not Redux) | Zero dependencies, fits existing provider pattern. |
| `output: 'standalone'` | Self-contained production server for Docker. No node_modules at runtime. |
| CSS `auto-fill` grid (not breakpoints) | Config-driven responsive layout via `minCardWidth`. No media queries. |
| Single parameterized Dockerfile | DRY. Scales to N apps without Dockerfile duplication. |
| Tailwind v4 CSS-first theming | Idiomatic `@theme` blocks instead of JS config. Brand tokens via CSS variables. |
