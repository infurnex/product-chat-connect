
export interface Chat {
  id: string;
  user_id: string;
  title: string;
  created_at: string;
}

export interface Message {
  id: string;
  chat_id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

export interface Category {
  id: string;
  chat_id: string;
  name: string;
}

export interface Product {
  id: string;
  category_id: string;
  name: string;
  seller: string;
  reviews: number | null;
  ratings: number | null;
  description: string | null;
  image_url: string | null;
  price: number;
  source: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  gender?: string;
  country?: string;
  language: string;
  created_at: string;
  updated_at: string;
}
