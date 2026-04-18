'use client';

import { createContext, useContext, useReducer, useEffect, type ReactNode } from 'react';
import type { CartItem, CartState } from '@product-portal/types';

const STORAGE_KEY = 'pp_cart';

type CartAction =
  | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE_ITEM'; payload: { productId: number } }
  | { type: 'UPDATE_QUANTITY'; payload: { productId: number; quantity: number } }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; payload: CartState };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existing = state.items.find((i) => i.productId === action.payload.productId);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.productId === action.payload.productId
              ? { ...i, quantity: i.quantity + 1 }
              : i,
          ),
        };
      }
      return { items: [...state.items, { ...action.payload, quantity: 1 }] };
    }
    case 'REMOVE_ITEM':
      return { items: state.items.filter((i) => i.productId !== action.payload.productId) };
    case 'UPDATE_QUANTITY': {
      if (action.payload.quantity <= 0) {
        return { items: state.items.filter((i) => i.productId !== action.payload.productId) };
      }
      return {
        items: state.items.map((i) =>
          i.productId === action.payload.productId
            ? { ...i, quantity: action.payload.quantity }
            : i,
        ),
      };
    }
    case 'CLEAR':
      return { items: [] };
    case 'HYDRATE':
      return action.payload;
    default:
      return state;
  }
}

interface CartContextValue {
  state: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getItemQuantity: (productId: number) => number;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error('useCart must be used inside CartProvider');
  }
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as CartState;
        dispatch({ type: 'HYDRATE', payload: parsed });
      }
    } catch {
      // Ignore parse errors
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Ignore storage errors
    }
  }, [state]);

  const addItem = (item: Omit<CartItem, 'quantity'>) =>
    dispatch({ type: 'ADD_ITEM', payload: item });

  const removeItem = (productId: number) =>
    dispatch({ type: 'REMOVE_ITEM', payload: { productId } });

  const updateQuantity = (productId: number, quantity: number) =>
    dispatch({ type: 'UPDATE_QUANTITY', payload: { productId, quantity } });

  const clearCart = () => dispatch({ type: 'CLEAR' });

  const getItemQuantity = (productId: number): number =>
    state.items.find((i) => i.productId === productId)?.quantity ?? 0;

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{ state, addItem, removeItem, updateQuantity, clearCart, getItemQuantity, totalItems, totalPrice }}
    >
      {children}
    </CartContext.Provider>
  );
}
