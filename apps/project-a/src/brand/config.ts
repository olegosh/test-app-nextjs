import type { BrandConfig } from '@product-portal/types';

export const projectAConfig: BrandConfig = {
  id: 'project-a',
  displayName: 'ProjectA',
  theme: {
    primaryColor: '#22c55e',
    fontFamily: 'Inter, system-ui, sans-serif',
    menuPosition: 'top',
  },
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
