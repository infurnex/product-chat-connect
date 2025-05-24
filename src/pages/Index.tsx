
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import Layout from "@/components/Layout";
import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import ProductCard from "@/components/ProductCard";
import { useCategoriesRealtime, useProductsRealtime } from "@/hooks/useProducts";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MessageSquare, Search } from "lucide-react";

const Index = () => {
  const { user } = useAuth();
  const [showChat, setShowChat] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  
  const { data: categories = [] } = useCategoriesRealtime(selectedChatId);
  const { data: products = [] } = useProductsRealtime(selectedCategory, selectedChatId);
  
  const toggleChat = () => {
    setShowChat(!showChat);
  };
  
  const handleNewChat = () => {
    setShowChat(true);
  };

  const handleChatSelect = (chatId: string) => {
    setSelectedChatId(chatId);
    setSelectedCategory("all"); // Reset category when switching chats
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully!');
  };

  const renderContent = () => {
    if (!selectedChatId) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
          <h2 className="text-2xl font-bold text-gray-600 mb-2">Welcome to AI Shopping Assistant</h2>
          <p className="text-gray-500 mb-6">Select a chat from the sidebar or start a new conversation to begin shopping</p>
          <Button onClick={handleNewChat} className="bg-shopping-blue hover:bg-shopping-blue-dark">
            Start New Chat
          </Button>
        </div>
      );
    }

    if (categories.length === 0 || products.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center h-full text-center p-8">
          {categories.length === 0 ? (
            <>
              <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-2">No Products Yet</h2>
              <p className="text-gray-500 mb-6">Chat with AI assistant and it will fetch products for you</p>
              <Button onClick={toggleChat} className="bg-shopping-blue hover:bg-shopping-blue-dark">
                <MessageSquare className="h-5 w-5 mr-2" />
                Chat with Assistant
              </Button>
            </>
          ) : (
            <>
              <Search className="h-16 w-16 text-gray-400 mb-4" />
              <h2 className="text-2xl font-bold text-gray-600 mb-2">No Products Found</h2>
              <p className="text-gray-500 mb-6">
                {selectedCategory === "all" 
                  ? "No products available in this chat yet" 
                  : `No products found in "${categories.find(cat => cat.id === selectedCategory)?.name}" category`}
              </p>
              <Button onClick={toggleChat} className="bg-shopping-blue hover:bg-shopping-blue-dark">
                <MessageSquare className="h-5 w-5 mr-2" />
                Ask AI for More Products
              </Button>
            </>
          )}
        </div>
      );
    }

    return (
      <>
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
      </>
    );
  };
  
  return (
    <>
      <Layout 
        sidebar={
          <ChatSidebar 
            onNewChat={handleNewChat} 
            selectedChatId={selectedChatId} 
            onSelectChat={handleChatSelect} 
          />
        }
        onToggleChat={toggleChat}
        selectedChatID = {selectedChatId}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        user={user}
        onSignOut={handleSignOut}
        onSignIn={() => {}}
      >
        <div className="container py-8 h-full">
          {renderContent()}
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
