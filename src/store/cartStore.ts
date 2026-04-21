import { create } from 'zustand';
import { supabase, CartItem, Product } from '../lib/supabase';

interface CartStore {
  items: (CartItem & { product: Product })[];
  isLoading: boolean;
  itemCount: number;
  subtotal: number;

  fetchCart: (userId: string) => Promise<void>;
  addToCart: (userId: string, productId: string, quantity?: number, size?: string) => Promise<{ error: string | null }>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: (userId: string) => Promise<void>;
  clearLocalCart: () => void;
}

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],
  isLoading: false,
  itemCount: 0,
  subtotal: 0,

  fetchCart: async (userId: string) => {
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('cart_items')
      .select(`
        *,
        product:products(*)
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data) {
      const items = data as (CartItem & { product: Product })[];
      const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);
      const subtotal = items.reduce((sum, i) => sum + i.quantity * i.product.price, 0);
      set({ items, itemCount, subtotal });
    }
    set({ isLoading: false });
  },

  addToCart: async (userId: string, productId: string, quantity = 1, size?: string) => {
    const { data: existing } = await supabase
      .from('cart_items')
      .select('*')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .eq('size', size || null)
      .maybeSingle();

    let error;
    if (existing) {
      const { error: updateError } = await supabase
        .from('cart_items')
        .update({ quantity: existing.quantity + quantity })
        .eq('id', existing.id);
      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({ user_id: userId, product_id: productId, quantity, size: size || null });
      error = insertError;
    }

    if (!error) {
      await get().fetchCart(userId);
    }
    return { error: error?.message || null };
  },

  removeFromCart: async (itemId: string) => {
    const item = get().items.find(i => i.id === itemId);
    await supabase.from('cart_items').delete().eq('id', itemId);
    set(state => {
      const items = state.items.filter(i => i.id !== itemId);
      return {
        items,
        itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: items.reduce((sum, i) => sum + i.quantity * i.product.price, 0),
      };
    });
  },

  updateQuantity: async (itemId: string, quantity: number) => {
    if (quantity < 1) return;
    await supabase.from('cart_items').update({ quantity }).eq('id', itemId);
    set(state => {
      const items = state.items.map(i =>
        i.id === itemId ? { ...i, quantity } : i
      );
      return {
        items,
        itemCount: items.reduce((sum, i) => sum + i.quantity, 0),
        subtotal: items.reduce((sum, i) => sum + i.quantity * i.product.price, 0),
      };
    });
  },

  clearCart: async (userId: string) => {
    await supabase.from('cart_items').delete().eq('user_id', userId);
    set({ items: [], itemCount: 0, subtotal: 0 });
  },

  clearLocalCart: () => {
    set({ items: [], itemCount: 0, subtotal: 0 });
  },
}));
