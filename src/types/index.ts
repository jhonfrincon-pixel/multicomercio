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
  | 'crm-settings';
