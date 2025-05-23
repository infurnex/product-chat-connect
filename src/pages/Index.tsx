
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Layout from "@/components/Layout";
import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import ProductCard from "@/components/ProductCard";
import { useCategories, useProducts } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  
  const { data: categories = [] } = useCategories();
  const { data: products = [] } = useProducts(selectedCategory);
  
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  
  const handleNewChat = () => {
    setSelectedChatId(null);
    setShowChat(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully!');
  };
  
  return (
    <>
      <Layout 
        sidebar={<ChatSidebar onNewChat={handleNewChat} selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />}
        onToggleChat={toggleChat}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        user={user}
        onSignOut={handleSignOut}
        onSignIn={() => {}}
      >
        <div className="container py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Showing {products.length} products
              </p>
              <h2 className="text-2xl font-bold">
                {selectedCategory === "all" 
                  ? "All Products" 
                  : categories.find(cat => cat.id === selectedCategory)?.name || "Products"}
              </h2>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        
        {showChat && (
          <ChatWindow 
            onClose={() => setShowChat(false)} 
            chatId={selectedChatId}
            onChatCreated={setSelectedChatId}
          />
        )}
      </Layout>
    </>
  );
};

export default Index;
