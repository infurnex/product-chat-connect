
import { Category, Product } from "../types";

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Laptop Pro",
    description: "High-performance laptop with 16GB RAM and 512GB SSD",
    price: 1299.99,
    image: "/placeholder.svg",
    source: "Amazon"
  },
  {
    id: "2",
    name: "Ultra Slim Notebook",
    description: "Lightweight notebook perfect for travel and everyday use",
    price: 899.99,
    image: "/placeholder.svg",
    source: "Flipkart"
  },
  {
    id: "3",
    name: "Gaming Powerhouse X",
    description: "Ultimate gaming laptop with RTX graphics and high refresh rate",
    price: 1899.99,
    image: "/placeholder.svg",
    source: "eBay"
  },
  {
    id: "4",
    name: "Office Productivity Laptop",
    description: "Perfect for business and productivity tasks with long battery life",
    price: 799.99,
    image: "/placeholder.svg",
    source: "Amazon"
  },
  {
    id: "5",
    name: "Student Budget Notebook",
    description: "Affordable laptop for students with essential features",
    price: 499.99,
    image: "/placeholder.svg",
    source: "Flipkart"
  },
  {
    id: "6",
    name: "Creator Studio Pro",
    description: "High-color accuracy display with powerful CPU for content creation",
    price: 1599.99,
    image: "/placeholder.svg",
    source: "eBay"
  }
];

export const categories: Category[] = [
  {
    id: "laptops",
    name: "Laptops",
    products: products.slice(0, 6)
  },
  {
    id: "smartphones",
    name: "Smartphones",
    products: [
      {
        id: "7",
        name: "UltraPhone 15",
        description: "Latest flagship smartphone with advanced camera system",
        price: 999.99,
        image: "/placeholder.svg",
        source: "Amazon"
      },
      {
        id: "8",
        name: "Galaxy Supreme",
        description: "Stunning display with all-day battery life",
        price: 899.99,
        image: "/placeholder.svg",
        source: "Flipkart"
      },
      {
        id: "9",
        name: "Budget Phone Pro",
        description: "Affordable smartphone with premium features",
        price: 399.99,
        image: "/placeholder.svg",
        source: "eBay"
      }
    ]
  },
  {
    id: "accessories",
    name: "Accessories",
    products: [
      {
        id: "10",
        name: "Wireless Earbuds Pro",
        description: "Premium sound quality with active noise cancellation",
        price: 149.99,
        image: "/placeholder.svg",
        source: "Amazon"
      },
      {
        id: "11",
        name: "Smart Watch Elite",
        description: "Track your fitness and stay connected",
        price: 249.99,
        image: "/placeholder.svg",
        source: "Flipkart"
      },
      {
        id: "12",
        name: "Premium Laptop Sleeve",
        description: "Protect your laptop in style",
        price: 39.99,
        image: "/placeholder.svg",
        source: "eBay"
      }
    ]
  }
];

export const chatHistories = [
  {
    id: "1",
    title: "Shopping Assistant",
    date: new Date(),
    lastMessage: "How can I help you today?"
  },
  {
    id: "2",
    title: "Furniture Recommendations",
    date: new Date(Date.now() - 86400000), // yesterday
    lastMessage: "Here are some sofa options for your living room"
  },
  {
    id: "3",
    title: "Tech Gadgets Search",
    date: new Date(Date.now() - 86400000 * 3), // 3 days ago
    lastMessage: "I found these wireless earbuds on sale"
  },
  {
    id: "4",
    title: "Gift Ideas for Mom",
    date: new Date(Date.now() - 86400000 * 5), // 5 days ago
    lastMessage: "These would make perfect Mother's Day gifts"
  },
  {
    id: "5",
    title: "Kitchen Appliances",
    date: new Date(Date.now() - 86400000 * 8), // 8 days ago
    lastMessage: "Check out this air fryer with great reviews"
  },
  {
    id: "6",
    title: "Outdoor Equipment",
    date: new Date(Date.now() - 86400000 * 15), // 15 days ago
    lastMessage: "These camping tents are on sale this week"
  },
  {
    id: "7",
    title: "Home Office Setup",
    date: new Date(Date.now() - 86400000 * 25), // 25 days ago
    lastMessage: "This standing desk is highly recommended"
  }
];
