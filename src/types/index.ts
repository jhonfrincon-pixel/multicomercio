export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  shortDescription: string;
  images: string[];
  features: string[];
  benefits: Benefit[];
  specifications: Record<string, string>;
  reviews: Review[];
  rating: number;
  reviewCount: number;
  inStock: number;
  tags: string[];
  badge?: string;
}

export interface Benefit {
  title: string;
  description: string;
  icon: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  verified: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FooterSettings {
  id?: string;
  quick_links: {
    enlaces_rapidos: string;
    sobre_nosotros: string;
    catalogo_productos: string;
    ofertas_especiales: string;
    blog_decoracion: string;
    preguntas_frecuentes: string;
    atencion_cliente: string;
    mi_cuenta: string;
    seguimiento_pedidos: string;
    politica_devoluciones: string;
    terminos_condiciones: string;
    politica_privacidad: string;
    contacto: string;
  };
  contact_info: {
    direccion: string;
    telefono: string;
    email: string;
  };
  created_at?: string;
  updated_at?: string;
}

export type View = 
  | 'home' 
  | 'product' 
  | 'cart' 
  | 'checkout'
  | 'crm'
  | 'crm-customers'
  | 'crm-orders'
  | 'crm-automations'
  | 'crm-campaigns'
  | 'crm-analytics'
  | 'crm-settings'
  | 'crm-footer';
