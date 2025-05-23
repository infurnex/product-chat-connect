
import { useState } from "react";
import Layout from "@/components/Layout";
import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";

const Index = () => {
  const [showChat, setShowChat] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  
  const handleNewChat = () => {
    setShowChat(true);
  };
  
  // Get products based on selected category
  const displayedProducts = selectedCategory === "all" 
    ? categories.flatMap(cat => cat.products)
    : categories.find(cat => cat.id === selectedCategory)?.products || [];
  
  return (
    <Layout 
      sidebar={<ChatSidebar onNewChat={handleNewChat} />}
      onToggleChat={toggleChat}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
    >
      <div className="container py-8">
        <p className="text-sm text-gray-500 mb-6">
          Showing {displayedProducts.length} products
        </p>
        
        <h2 className="text-2xl font-bold mb-6">
          {selectedCategory === "all" 
            ? "All Products" 
            : categories.find(cat => cat.id === selectedCategory)?.name || "Products"}
        </h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      
      {showChat && <ChatWindow onClose={() => setShowChat(false)} />}
    </Layout>
  );
};

export default Index;
