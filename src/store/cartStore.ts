"use client";

import { create } from "zustand";

export type CartItem = {
  productId: string;
  name: string;
  slug: string;
  quantity: number;
  unitPriceCents: number;
  totalCents: number;
};

type CartState = {
  items: CartItem[];
  subtotalCents: number;
  isLoading: boolean;
  fetchCart: () => Promise<void>;
  setQuantity: (productId: string, quantity: number) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
};

export const useCartStore = create<CartState>((set) => ({
  items: [],
  subtotalCents: 0,
  isLoading: false,
  async fetchCart() {
    set({ isLoading: true });
    const res = await fetch("/api/cart");
    const data = await res.json();
    set({ items: data.items, subtotalCents: data.subtotalCents, isLoading: false });
  },
  async setQuantity(productId, quantity) {
    const res = await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity }),
    });
    const data = await res.json();
    set({ items: data.items, subtotalCents: data.subtotalCents });
  },
  async removeItem(productId) {
    const res = await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId }),
    });
    const data = await res.json();
    set({ items: data.items, subtotalCents: data.subtotalCents });
  },
}));
