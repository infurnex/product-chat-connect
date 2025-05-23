
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  source: "Amazon" | "Flipkart" | "eBay";
}

export interface Category {
  id: string;
  name: string;
  products: Product[];
}

export interface ChatMessage {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export interface ChatHistory {
  id: string;
  title: string;
  date: Date;
  lastMessage: string;
}
