// src/stores/useCartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface CartVariant {
  variantId: string;
  colour: string;
  colourHex?: string;
  size: string;
  sku: string;
  stock: number;
}

export interface CartItem {
  id: string; // cartItem id (local uuid)
  productId: string;
  productName: string;
  slug: string;
  imageUrl: string;
  variant: CartVariant;
  quantity: number;
  unitType: "PIECE" | "METRE";
  unitPrice: number;
}

interface CartStore {
  items: CartItem[];
  couponCode: string | null;
  discountAmount: number;
  isOpen: boolean;

  // Actions
  addItem: (item: Omit<CartItem, "id">) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, qty: number) => void;
  applyCoupon: (code: string, discount: number) => void;
  removeCoupon: () => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Computed (derived in selectors)
  subtotal: () => number;
  itemCount: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      discountAmount: 0,
      isOpen: false,

      addItem: (newItem) => {
        const existing = get().items.find(
          (i) =>
            i.productId === newItem.productId &&
            i.variant.variantId === newItem.variant.variantId
        );
        if (existing) {
          set((s) => ({
            items: s.items.map((i) =>
              i.id === existing.id
                ? { ...i, quantity: i.quantity + newItem.quantity }
                : i
            ),
          }));
        } else {
          set((s) => ({
            items: [
              ...s.items,
              { ...newItem, id: crypto.randomUUID() },
            ],
          }));
        }
        set({ isOpen: true });
      },

      removeItem: (cartItemId) =>
        set((s) => ({ items: s.items.filter((i) => i.id !== cartItemId) })),

      updateQuantity: (cartItemId, qty) => {
        if (qty <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set((s) => ({
          items: s.items.map((i) =>
            i.id === cartItemId ? { ...i, quantity: qty } : i
          ),
        }));
      },

      applyCoupon: (code, discount) =>
        set({ couponCode: code, discountAmount: discount }),

      removeCoupon: () => set({ couponCode: null, discountAmount: 0 }),

      clearCart: () =>
        set({ items: [], couponCode: null, discountAmount: 0 }),

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),

      subtotal: () =>
        get().items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0),

      itemCount: () =>
        get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    {
      name: "bb-cart",
      partialize: (s) => ({
        items: s.items,
        couponCode: s.couponCode,
        discountAmount: s.discountAmount,
      }),
    }
  )
);
