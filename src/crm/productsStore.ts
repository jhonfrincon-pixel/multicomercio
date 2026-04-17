import { create } from 'zustand';
import { supabase } from '@/crm/supabase';
import type { Product } from '@/types';

interface ProductsState {
  products: Product[];
  isLoading: boolean;
  fetchProducts: () => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  isLoading: false,

  fetchProducts: async () => {
    if (!supabase) return;
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching products:', error);
        throw error;
      }
      set({ products: data || [] });
    } finally {
      set({ isLoading: false });
    }
  },

  addProduct: async (product) => {
    if (!supabase) return;
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('products')
        .insert([product])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        set((state) => ({ products: [...state.products, data as Product] }));
      }
    } finally {
      set({ isLoading: false });
    }
  },

  updateProduct: async (id, updates) => {
    if (!supabase) return;
    set({ isLoading: true });
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        set((state) => ({
          products: state.products.map((p) => (p.id === id ? (data as Product) : p)),
        }));
      }
    } finally {
      set({ isLoading: false });
    }
  },

  deleteProduct: async (id) => {
    if (!supabase) return;
    set({ isLoading: true });
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      set((state) => ({
        products: state.products.filter((p) => p.id !== id),
      }));
    } finally {
      set({ isLoading: false });
    }
  },
}));