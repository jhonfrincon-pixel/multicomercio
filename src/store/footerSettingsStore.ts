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

      if (data && data.quick_links && data.contact_info) {
        // Validar que los datos tengan la estructura correcta
        const validatedData: FooterSettings = {
          id: data.id,
          quick_links: {
            enlaces_rapidos: data.quick_links.enlaces_rapidos || '#',
            sobre_nosotros: data.quick_links.sobre_nosotros || '#',
            catalogo_productos: data.quick_links.catalogo_productos || '#',
            ofertas_especiales: data.quick_links.ofertas_especiales || '#',
            blog_decoracion: data.quick_links.blog_decoracion || '#',
            preguntas_frecuentes: data.quick_links.preguntas_frecuentes || '#',
            atencion_cliente: data.quick_links.atencion_cliente || '#',
            mi_cuenta: data.quick_links.mi_cuenta || '#',
            seguimiento_pedidos: data.quick_links.seguimiento_pedidos || '#',
            politica_devoluciones: data.quick_links.politica_devoluciones || '',
            terminos_condiciones: data.quick_links.terminos_condiciones || '',
            politica_privacidad: data.quick_links.politica_privacidad || '',
            contacto: data.quick_links.contacto || '#',
          },
          contact_info: {
            direccion: data.contact_info.direccion || 'Av. Principal 1234',
            telefono: data.contact_info.telefono || '+52 (55) 1234-5678',
            email: data.contact_info.email || 'hola@livo.com',
          },
          created_at: data.created_at,
          updated_at: data.updated_at,
        };
        set({ settings: validatedData, isLoading: false });
      } else {
        set({ settings: DEFAULT_SETTINGS, isLoading: false });
      }
    } catch (error) {
      console.error('Error loading footer settings:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Error al cargar configuración',
        settings: DEFAULT_SETTINGS,
        isLoading: false 
      });
    }
  },

  updateSettings: async (updatedSettings) => {
    if (!supabase) {
      console.error('Supabase client is null or undefined');
      set({ error: 'Supabase no está configurado' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      console.log('Attempting to upsert footer settings:', updatedSettings);
      
      const result = await supabase
        .from('footer_settings')
        .upsert({ 
          id: 1, // ID fijo para asegurar una sola fila
          ...DEFAULT_SETTINGS, 
          ...updatedSettings 
        }, {
          onConflict: 'id'
        })
        .select()
        .single();

      if (result.error) {
        console.error('Supabase upsert error:', result.error);
        console.error('Error details:', {
          message: result.error.message,
          details: result.error.details,
          hint: result.error.hint,
          code: result.error.code
        });
        throw result.error;
      }

      console.log('Upsert successful:', result.data);
      set({ 
        settings: result.data, 
        isLoading: false 
      });
    } catch (error) {
      console.error('Error updating footer settings:', error);
      console.error('Error type:', typeof error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace'
      });
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
