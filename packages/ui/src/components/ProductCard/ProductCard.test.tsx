import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductCard } from './ProductCard';
import { BrandProvider } from '../../providers/BrandProvider';
import { CartProvider } from '../../context/CartContext';
import type { BrandConfig, Product } from '@product-portal/types';

jest.mock('next/image', () => ({
  __esModule: true,
  default: ({ src, alt }: { src: string; alt: string }) => (
    <img src={src} alt={alt} />
  ),
}));

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ href, children, ...props }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...props}>{children}</a>
  ),
}));

const mockProduct: Product = {
  id: 1,
  title: 'Test Product',
  description: 'A test product description',
  price: 29.99,
  discountPercentage: 10,
  rating: 4.5,
  stock: 100,
  brand: 'TestBrand',
  category: 'electronics',
  thumbnail: 'https://cdn.dummyjson.com/products/images/1/thumbnail.png',
  images: [],
  slug: 'test-product',
};

const projectAConfig: BrandConfig = {
  id: 'project-a',
  displayName: 'ProjectA',
  theme: { primaryColor: '#22c55e', fontFamily: 'Inter', menuPosition: 'top' },
  productCard: {
    layout: 'vertical',
    titlePosition: 'top-right',
    showCategoryTag: false,
    buttonVariant: 'green',
    addToCartMessage: 'Hello from Green Project',
  },
  productDetail: {
    layout: 'side-by-side',
    showCategoryTag: false,
    showBrandTag: false,
    memberSectionStyle: 'list',
  },
  cart: {
    layout: 'list',
    checkoutLabel: 'Proceed to Checkout',
  },
  featureFlags: {
    cartMarketSeparation: false,
  },
};

const projectBConfig: BrandConfig = {
  id: 'project-b',
  displayName: 'ProjectB',
  theme: { primaryColor: '#dc2626', fontFamily: 'Georgia', menuPosition: 'side' },
  productCard: {
    layout: 'horizontal',
    titlePosition: 'bottom-left',
    showCategoryTag: true,
    buttonVariant: 'red',
    addToCartMessage: 'Hello from Red Project',
  },
  productDetail: {
    layout: 'stacked',
    showCategoryTag: true,
    showBrandTag: true,
    memberSectionStyle: 'cards',
  },
  cart: {
    layout: 'compact',
    checkoutLabel: 'Checkout Now',
  },
  featureFlags: {
    cartMarketSeparation: true,
  },
};

const mockOnRequestAuth = jest.fn();

function renderWithBrand(config: BrandConfig, isAuthenticated = false) {
  return render(
    <BrandProvider config={config}>
      <CartProvider>
        <ProductCard product={mockProduct} market="en" isAuthenticated={isAuthenticated} onRequestAuth={mockOnRequestAuth} />
      </CartProvider>
    </BrandProvider>,
  );
}

beforeEach(() => {
  localStorage.clear();
});

describe('ProductCard', () => {
  describe('ProjectA — vertical layout, green button, no category tag', () => {
    it('renders the product title', () => {
      renderWithBrand(projectAConfig);
      expect(screen.getByRole('heading', { name: /test product/i })).toBeInTheDocument();
    });

    it('renders the product price', () => {
      renderWithBrand(projectAConfig);
      expect(screen.getByText('$29.99')).toBeInTheDocument();
    });

    it('renders as an article element', () => {
      renderWithBrand(projectAConfig);
      expect(screen.getByRole('article')).toBeInTheDocument();
    });

    it('does NOT show the category tag', () => {
      renderWithBrand(projectAConfig);
      expect(screen.queryByText('electronics')).not.toBeInTheDocument();
    });

    it('renders Add to Cart and Details buttons', () => {
      renderWithBrand(projectAConfig);
      expect(screen.getByRole('button', { name: /add to cart/i })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /details/i })).toBeInTheDocument();
    });

    it('logs message to console on Add to Cart click', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
      renderWithBrand(projectAConfig);
      fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('EN product'));
      logSpy.mockRestore();
    });

    it('applies green background to Add to Cart button', () => {
      renderWithBrand(projectAConfig);
      const btn = screen.getByRole('button', { name: /add to cart/i });
      expect(btn.style.backgroundColor).toBe('rgb(34, 197, 94)');
    });

    it('calls onRequestAuth when clicking Details while unauthenticated', () => {
      mockOnRequestAuth.mockClear();
      renderWithBrand(projectAConfig, false);
      fireEvent.click(screen.getByRole('button', { name: /details/i }));
      expect(mockOnRequestAuth).toHaveBeenCalledTimes(1);
    });

    it('renders Details as a link when authenticated', () => {
      renderWithBrand(projectAConfig, true);
      const detailsLink = screen.getByRole('link', { name: /details/i });
      expect(detailsLink).toHaveAttribute('href', '/en/product/test-product');
    });
  });

  describe('ProjectB — horizontal layout, red button, category tag', () => {
    it('renders the product title', () => {
      renderWithBrand(projectBConfig);
      expect(screen.getByRole('heading', { name: /test product/i })).toBeInTheDocument();
    });

    it('shows the category tag', () => {
      renderWithBrand(projectBConfig);
      expect(screen.getByText('electronics')).toBeInTheDocument();
    });

    it('logs message to console on Add to Cart click', () => {
      const logSpy = jest.spyOn(console, 'log').mockImplementation(() => undefined);
      renderWithBrand(projectBConfig);
      fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
      expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('EN product'));
      logSpy.mockRestore();
    });

    it('applies red background to Add to Cart button', () => {
      renderWithBrand(projectBConfig);
      const btn = screen.getByRole('button', { name: /add to cart/i });
      expect(btn.style.backgroundColor).toBe('rgb(220, 38, 38)');
    });

    it('does NOT show category tag for ProjectA config', () => {
      renderWithBrand(projectAConfig);
      expect(screen.queryByText('electronics')).not.toBeInTheDocument();
    });
  });
});
