import type { BrandConfig } from '@product-portal/types';

export const projectBConfig: BrandConfig = {
  id: 'project-b',
  displayName: 'ProjectB',
  theme: {
    primaryColor: '#dc2626',
    fontFamily: 'Georgia, serif',
    menuPosition: 'side',
  },
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
