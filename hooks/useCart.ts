/**
 * Cart state (Zustand). Client-only; server validates price on checkout.
 */

import { create } from "zustand";
import type { CartItem, SelectedOptions } from "@/types";

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "unitPriceCents">) => void;
  removeItem: (productId: string, selectedOptions: SelectedOptions) => void;
  updateQuantity: (productId: string, selectedOptions: SelectedOptions, quantity: number) => void;
  clear: () => void;
}

function itemKey(productId: string, selectedOptions: SelectedOptions): string {
  return productId + "|" + JSON.stringify(selectedOptions);
}

export const useCart = create<CartStore>((set) => ({
  items: [],
  addItem: (item) =>
    set((state) => {
      const key = itemKey(item.productId, item.selectedOptions);
      const existing = state.items.find(
        (i) => itemKey(i.productId, i.selectedOptions) === key
      );
      if (existing) {
        return {
          items: state.items.map((i) =>
            itemKey(i.productId, i.selectedOptions) === key
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, { ...item }] };
    }),
  removeItem: (productId, selectedOptions) =>
    set((state) => ({
      items: state.items.filter(
        (i) => itemKey(i.productId, i.selectedOptions) !== itemKey(productId, selectedOptions)
      ),
    })),
  updateQuantity: (productId, selectedOptions, quantity) =>
    set((state) => ({
      items: state.items.map((i) =>
        itemKey(i.productId, i.selectedOptions) === itemKey(productId, selectedOptions)
          ? { ...i, quantity: quantity <= 0 ? 0 : quantity }
          : i
      ).filter((i) => i.quantity > 0),
    })),
  clear: () => set({ items: [] }),
}));
