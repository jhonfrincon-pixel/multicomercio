import { create } from 'zustand';
import { supabase } from '@/lib/supabase';

interface BrandConfig {
  name: string;
  slogan: string;
  primary_color: string;
  whatsapp: string;
  logo_url: string;
  favicon_url: string;
  color_palette: {
    monochromatic: string[];
    contrast: string;
  };
}

interface BrandState {
  config: BrandConfig;
  isLoading: boolean;
  loadBrandConfig: () => Promise<void>;
  updateBrandConfig: (newConfig: Partial<BrandConfig>) => Promise<void>;
}

const DEFAULT_CONFIG: BrandConfig = {
  name: 'Livo',
  slogan: 'Hazlo simple, hazlo Livo',
  primary_color: '#d97706',
  whatsapp: '+521234567890',
  logo_url: '',
  favicon_url: '',
  color_palette: {
    monochromatic: ['#fbbf24', '#d97706', '#92400e'],
    contrast: '#1e293b'
  }
};

export const useBrandStore = create<BrandState>((set, get) => ({
  config: DEFAULT_CONFIG,
  isLoading: false,
  loadBrandConfig: async () => {
    set({ isLoading: true });
    try {
      if (!supabase) return;
      const { data, error } = await supabase
        .from('store_config')
        .select('*')
        .single();

      if (data && !error) {
        set({ config: data });
      }
    } catch (err) {
      console.error('Error loading brand config:', err);
    } finally {
      set({ isLoading: false });
    }
  },
  updateBrandConfig: async (newConfig) => {
    const updatedConfig = { ...get().config, ...newConfig };
    set({ config: updatedConfig });

    if (supabase) {
      try {
        const { error } = await supabase
          .from('store_config')
          .upsert({ id: 1, ...updatedConfig });
        
        if (error) throw error;
      } catch (err) {
        console.error('Error updating brand config:', err);
      }
    }
  }
}));