export interface CartItem {
  productId: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
  market: string;
}

export interface CartState {
  items: CartItem[];
}
