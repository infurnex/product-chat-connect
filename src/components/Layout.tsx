
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { MessageSquare, Menu, X, User, LogOut, ChevronLeft, ChevronRight } from "lucide-react";
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
import { Category } from "@/types/database";
import { User as SupabaseUser } from '@supabase/supabase-js';

interface LayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactElement;
  onToggleChat: () => void;
  selectedChatID?: string | null;
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  categories: Category[];
  user: SupabaseUser | null;
  onSignOut: () => void;
  onSignIn: () => void;
}

const Layout = ({ 
  children, 
  sidebar, 
  onToggleChat,
  selectedChatID, 
  selectedCategory,
  onCategoryChange,
  categories,
  user,
  onSignOut,
  onSignIn
}: LayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const isMobile = useIsMobile();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const toggleSidebarCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Clone the sidebar element and pass the collapsed prop
  const sidebarWithProps = React.cloneElement(sidebar, { isCollapsed: sidebarCollapsed && !isMobile });
  
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
            : `${sidebarCollapsed ? 'w-16' : 'w-72'}`
        } transition-all duration-200 ease-in-out relative`}
      >
        {/* Desktop collapse button */}
        {!isMobile && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebarCollapse}
            className="absolute -right-3 top-4 z-40 h-6 w-6 rounded-full border bg-white shadow-md hover:bg-gray-50"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        )}
        
        <div className={`${sidebarCollapsed && !isMobile ? 'overflow-hidden' : ''}`}>
          {sidebarWithProps}
        </div>
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
            <h1 className="text-xl font-bold">AI Shopping Assistant</h1>
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
            
            {user && (
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
        {!isMobile && selectedChatID &&(
          <Button 
            onClick={onToggleChat}
            className="fixed bottom-4 right-4 bg-shopping-blue hover:bg-shopping-blue-dark shadow-lg"
          >
            <MessageSquare className="h-5 w-5 mr-2" />
            Chat with Assistant
          </Button>
        )}
      </div>
    </div>
  );
};

export default Layout;
