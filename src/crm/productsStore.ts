import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
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
    set({ isLoading: true });
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('Error fetching products:', error);
      set({ isLoading: false });
      throw error;
    }
    set({ products: data || [], isLoading: false });
  },

  addProduct: async (product) => {
    const { error } = await supabase
      .from('products')
      .insert([product]);
    
    if (error) throw error;
    set((state) => ({ products: [...state.products, product] }));
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
    const { error } = await supabase
      .from('products')
      .update(updates)
      .eq('id', id);
    
    if (error) throw error;
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    }));
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
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    set((state) => ({
      products: state.products.filter((p) => p.id !== id),
    }));
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