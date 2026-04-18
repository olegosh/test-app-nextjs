import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ProductDetail } from './ProductDetail';
import { BrandProvider } from '../../providers/BrandProvider';
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
  title: 'Test Sneakers',
  description: 'A great pair of sneakers for testing',
  price: 99.99,
  discountPercentage: 15,
  rating: 4.2,
  stock: 42,
  brand: 'TestBrand',
  category: 'shoes',
  thumbnail: 'https://cdn.dummyjson.com/products/images/1/thumbnail.png',
  images: [],
  slug: 'test-sneakers',
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
    grid: { minCardWidth: '280px', gap: '1.5rem' },
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
    grid: { minCardWidth: '450px', gap: '1.5rem' },
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

function renderWithBrand(config: BrandConfig, isAuthenticated = false) {
  return render(
    <BrandProvider config={config}>
      <ProductDetail product={mockProduct} market="en" isAuthenticated={isAuthenticated} />
    </BrandProvider>,
  );
}

describe('ProductDetail', () => {
  describe('Common behavior', () => {
    it('renders the product title', () => {
      renderWithBrand(projectAConfig);
      expect(screen.getByRole('heading', { name: /test sneakers/i })).toBeInTheDocument();
    });

    it('renders the product price', () => {
      renderWithBrand(projectAConfig);
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    it('renders the product description', () => {
      renderWithBrand(projectAConfig);
      expect(screen.getByText(/great pair of sneakers/i)).toBeInTheDocument();
    });

    it('renders the product image', () => {
      renderWithBrand(projectAConfig);
      expect(screen.getByAltText('Test Sneakers')).toBeInTheDocument();
    });

    it('renders a back link to products page', () => {
      renderWithBrand(projectAConfig);
      const backLink = screen.getByRole('link', { name: /back to products/i });
      expect(backLink).toHaveAttribute('href', '/en/products');
    });

    it('renders star rating', () => {
      renderWithBrand(projectAConfig);
      expect(screen.getByText('4.2/5')).toBeInTheDocument();
    });
  });

  describe('ProjectA — side-by-side layout, list member section', () => {
    it('does NOT show category tag', () => {
      renderWithBrand(projectAConfig);
      expect(screen.queryByText('shoes')).not.toBeInTheDocument();
    });

    it('does NOT show brand tag', () => {
      renderWithBrand(projectAConfig);
      const brandTags = screen.queryAllByText('TestBrand');
      expect(brandTags).toHaveLength(0);
    });

    it('does NOT show member details when unauthenticated', () => {
      renderWithBrand(projectAConfig, false);
      expect(screen.queryByText('Member Details')).not.toBeInTheDocument();
    });

    it('shows member details as a list when authenticated', () => {
      renderWithBrand(projectAConfig, true);
      expect(screen.getByText('Member Details')).toBeInTheDocument();
      expect(screen.getByText(/42 units available/)).toBeInTheDocument();
      expect(screen.getByText(/15% off/)).toBeInTheDocument();
      expect(screen.getByText(/Brand: TestBrand/)).toBeInTheDocument();
    });

    it('does NOT show stat cards when authenticated (uses list style)', () => {
      renderWithBrand(projectAConfig, true);
      expect(screen.queryByText('In Stock')).not.toBeInTheDocument();
    });
  });

  describe('ProjectB — stacked layout, cards member section', () => {
    it('shows category tag', () => {
      renderWithBrand(projectBConfig);
      expect(screen.getByText('shoes')).toBeInTheDocument();
    });

    it('shows brand tag', () => {
      renderWithBrand(projectBConfig);
      expect(screen.getByText('TestBrand')).toBeInTheDocument();
    });

    it('shows discount badge', () => {
      renderWithBrand(projectBConfig);
      expect(screen.getByText('-15% off')).toBeInTheDocument();
    });

    it('does NOT show member stat cards when unauthenticated', () => {
      renderWithBrand(projectBConfig, false);
      expect(screen.queryByText('In Stock')).not.toBeInTheDocument();
      expect(screen.queryByText('Discount')).not.toBeInTheDocument();
    });

    it('shows member stat cards when authenticated', () => {
      renderWithBrand(projectBConfig, true);
      expect(screen.getByText('In Stock')).toBeInTheDocument();
      expect(screen.getByText('Rating')).toBeInTheDocument();
      expect(screen.getByText('Discount')).toBeInTheDocument();
      expect(screen.getByText('42')).toBeInTheDocument();
    });

    it('does NOT show member list section (uses cards style)', () => {
      renderWithBrand(projectBConfig, true);
      expect(screen.queryByText('Member Details')).not.toBeInTheDocument();
    });
  });
});
