export type BrandId = 'project-a' | 'project-b';

export type ProductCardLayout = 'vertical' | 'horizontal';
export type MenuPosition = 'top' | 'side' | 'bottom';

export interface ProductCardConfig {
  layout: ProductCardLayout;
  titlePosition: 'top-right' | 'bottom-left';
  showCategoryTag: boolean;
  buttonVariant: 'green' | 'red';
  addToCartMessage: string;
}

export interface BrandTheme {
  primaryColor: string;
  fontFamily: string;
  menuPosition: MenuPosition;
}

export type ProductDetailLayout = 'side-by-side' | 'stacked';

export interface ProductDetailConfig {
  layout: ProductDetailLayout;
  showCategoryTag: boolean;
  showBrandTag: boolean;
  memberSectionStyle: 'list' | 'cards';
}

export interface BrandConfig {
  id: BrandId;
  displayName: string;
  theme: BrandTheme;
  productCard: ProductCardConfig;
  productDetail: ProductDetailConfig;
}
