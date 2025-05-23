
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { AuthModal } from "@/components/AuthModal";
import Layout from "@/components/Layout";
import ChatSidebar from "@/components/ChatSidebar";
import ChatWindow from "@/components/ChatWindow";
import ProductCard from "@/components/ProductCard";
import { categories } from "@/data/products";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index = () => {
  const { user, loading } = useAuth();
  const [showAuth, setShowAuth] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  
  const toggleChat = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setShowChat(!showChat);
  };
  
  const handleNewChat = () => {
    if (!user) {
      setShowAuth(true);
      return;
    }
    setSelectedChatId(null);
    setShowChat(true);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully!');
  };
  
  // Get products based on selected category
  const displayedProducts = selectedCategory === "all" 
    ? categories.flatMap(cat => cat.products)
    : categories.find(cat => cat.id === selectedCategory)?.products || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }
  
  return (
    <>
      <Layout 
        sidebar={<ChatSidebar onNewChat={handleNewChat} selectedChatId={selectedChatId} onSelectChat={setSelectedChatId} />}
        onToggleChat={toggleChat}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        user={user}
        onSignOut={handleSignOut}
        onSignIn={() => setShowAuth(true)}
      >
        <div className="container py-8">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-sm text-gray-500 mb-2">
                Showing {displayedProducts.length} products
              </p>
              <h2 className="text-2xl font-bold">
                {selectedCategory === "all" 
                  ? "All Products" 
                  : categories.find(cat => cat.id === selectedCategory)?.name || "Products"}
              </h2>
            </div>
            {!user && (
              <Button onClick={() => setShowAuth(true)} className="bg-shopping-blue hover:bg-shopping-blue-dark">
                Sign In to Chat
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
        
        {showChat && user && (
          <ChatWindow 
            onClose={() => setShowChat(false)} 
            chatId={selectedChatId}
            onChatCreated={setSelectedChatId}
          />
        )}
      </Layout>
      
      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
};

export default Index;
