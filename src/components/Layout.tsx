
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Menu, X, User, LogOut } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { categories } from "@/data/products";
import { User as SupabaseUser } from '@supabase/supabase-js';

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  onToggleChat: () => void;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  user: SupabaseUser | null;
  onSignOut: () => void;
  onSignIn: () => void;
}

const Layout = ({ 
  children, 
  sidebar, 
  onToggleChat, 
  selectedCategory,
  onCategoryChange,
  user,
  onSignOut,
  onSignIn
}: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="flex h-screen w-full bg-white overflow-hidden">
      {/* Mobile sidebar overlay */}
      {isMobile && sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
      
      {/* Sidebar */}
      <div 
        className={`${
          isMobile 
            ? `fixed inset-y-0 left-0 z-30 w-72 transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`
            : 'w-72'
        } transition-transform duration-200 ease-in-out`}
      >
        {sidebar}
      </div>
      
      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 p-4 flex justify-between items-center">
          <div className="flex items-center">
            {isMobile && (
              <Button variant="ghost" size="icon" onClick={toggleSidebar} className="mr-2">
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            )}
            <h1 className="text-xl font-bold">Shopping Assistant</h1>
          </div>
          
          <div className="flex items-center gap-2">
            <Select value={selectedCategory} onValueChange={onCategoryChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Products" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Products</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={onSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button variant="outline" onClick={onSignIn}>
                Sign In
              </Button>
            )}
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto bg-gray-50">
          {children}
        </main>
        
        {/* Chat button (mobile only) */}
        {isMobile && (
          <Button 
            onClick={onToggleChat}
            className="fixed bottom-4 right-4 h-12 w-12 rounded-full bg-shopping-blue hover:bg-shopping-blue-dark shadow-lg p-0"
          >
            <MessageSquare className="h-6 w-6" />
          </Button>
        )}
        
        {/* Chat button (desktop) */}
        {!isMobile && (
          <Button 
            onClick={onToggleChat}
            className="fixed bottom-4 right-4 bg-shopping-blue hover:bg-shopping-blue-dark shadow-lg"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            {user ? 'Chat with Assistant' : 'Sign In to Chat'}
          </Button>
        )}
      </div>
    </div>
  );
};

export default Layout;
