export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  shortDescription: string;
  description: string;
  images: string[];
  features: string[];
  benefits: { title: string; description: string; icon: string }[];
  specifications: { [key: string]: string };
  reviews: {
    id: string;
    author: string;
    avatar: string;
    rating: number;
    date: string;
    title: string;
    content: string;
    verified: boolean;
  }[];
  rating: number;
  reviewCount: number;
  inStock: number;
  tags: string[];
  badge?: string;
  // Nuevos campos para la lógica de embudo (funnel)
  tripwirePrice?: number;
  orderBump?: {
    name: string;
    price: number;
    originalPrice?: number;
  };
  upsell?: {
    name: string;
    price: number;
    originalPrice?: number;
    discount?: number;
  };
}

// Definición de tipos para las vistas de navegación
export type View = 
  | 'home' 
  | 'product' 
  | 'cart' 
  | 'checkout' 
  | 'sobre-nosotros' 
  | 'crm-dashboard' // Ejemplo de vistas CRM
  | 'crm-settings'
  | 'crm-products'
  | 'crm-orders'
  | 'crm-users'
  | 'crm-brand-settings'
  | 'crm-footer-settings';