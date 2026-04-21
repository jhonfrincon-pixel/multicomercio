import { create } from 'zustand';
import { supabase } from '@/lib/supabase';
import type { FooterSettings } from '@/types';

interface FooterSettingsState {
  settings: FooterSettings | null;
  isLoading: boolean;
  error: string | null;
  loadSettings: () => Promise<void>;
  updateSettings: (settings: Partial<FooterSettings>) => Promise<void>;
  createSettings: (settings: FooterSettings) => Promise<void>;
  resetError: () => void;
}

const DEFAULT_SETTINGS: FooterSettings = {
  quick_links: {
    enlaces_rapidos: '#',
    sobre_nosotros: '#',
    catalogo_productos: '#',
    ofertas_especiales: '#',
    blog_decoracion: '#',
    preguntas_frecuentes: '#',
    atencion_cliente: '#',
    mi_cuenta: '#',
    seguimiento_pedidos: '#',
    politica_devoluciones: '#',
    terminos_condiciones: '#',
    politica_privacidad: '#',
    contacto: '#',
  },
  contact_info: {
    direccion: 'Av. Principal 1234',
    telefono: '+52 (55) 1234-5678',
    email: 'hola@livo.com',
  },
};

export const useFooterSettingsStore = create<FooterSettingsState>((set) => ({
  settings: null,
  isLoading: false,
  error: null,

  resetError: () => set({ error: null }),

  loadSettings: async () => {
    if (!supabase) {
      set({ settings: DEFAULT_SETTINGS, isLoading: false });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('footer_settings')
        .select('*')
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        set({ settings: data, isLoading: false });
      } else {
        set({ settings: DEFAULT_SETTINGS, isLoading: false });
      }
    } catch (error) {
      console.error('Error loading footer settings:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar configuración',
        isLoading: false 
      });
    }
  },

  updateSettings: async (updatedSettings) => {
    if (!supabase) {
      set({ error: 'Supabase no está configurado' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const { data: existingSettings } = await supabase
        .from('footer_settings')
        .select('id')
        .single();

      let result;
      
      if (existingSettings) {
        // Update existing record
        result = await supabase
          .from('footer_settings')
          .update(updatedSettings)
          .eq('id', existingSettings.id)
          .select()
          .single();
      } else {
        // Create new record
        result = await supabase
          .from('footer_settings')
          .insert({ ...DEFAULT_SETTINGS, ...updatedSettings })
          .select()
          .single();
      }

      if (result.error) {
        throw result.error;
      }

      set({ 
        settings: result.data, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error updating footer settings:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error al actualizar configuración',
        isLoading: false 
      });
    }
  },

  createSettings: async (settings) => {
    if (!supabase) {
      set({ error: 'Supabase no está configurado' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const { data, error } = await supabase
        .from('footer_settings')
        .insert(settings)
        .select()
        .single();

      if (error) {
        throw error;
      }

      set({ 
        settings: data, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error creating footer settings:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error al crear configuración',
        isLoading: false 
      });
    }
  },
}));
