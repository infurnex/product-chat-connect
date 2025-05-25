
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, MessageSquare, Settings, User, Pencil } from "lucide-react";
import { useChats, useCreateChat } from "@/hooks/useChats";
import { useAuth } from "./AuthProvider";
import { format, isToday, isYesterday } from "date-fns";
import { useState } from "react";
import { EditChatModal } from "./EditChatModal";
import SettingsModal from "./SettingsModal";
import { useIsMobile } from "@/hooks/use-mobile";

interface ChatSidebarProps {
  onNewChat: () => void;
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
  isCollapsed?: boolean;
}

const ChatSidebar = ({ onNewChat, selectedChatId, onSelectChat, isCollapsed = false }: ChatSidebarProps) => {
  const { user } = useAuth();
  const { data: chats = [], isLoading } = useChats();
  const createChatMutation = useCreateChat();
  const [editingChat, setEditingChat] = useState<{ id: string; title: string } | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const isMobile = useIsMobile();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return format(date, "MMM d");
    }
  };

  const handleNewChat = async () => {
    if (!user) {
      onNewChat();
      return;
    }
    
    try {
      const newChat = await createChatMutation.mutateAsync("New Chat");
      onSelectChat(newChat.id);
      onNewChat();
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const handleEditChat = (e: React.MouseEvent, chat: { id: string; title: string }) => {
    e.stopPropagation();
    setEditingChat(chat);
  };

  if (!user) {
    return (
      <div className="w-full h-full bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center p-4">
        {isCollapsed ? (
          <MessageSquare className="h-8 w-8 text-gray-400" />
        ) : (
          <>
            <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 text-center">Sign in to access your chat history</p>
          </>
        )}
      </div>
    );
  }

  if (isCollapsed) {
    return (
      <div className="w-full h-full bg-gray-50 border-r border-gray-200 flex flex-col">
        <div className="p-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNewChat}
            disabled={createChatMutation.isPending}
            className="w-full"
          >
            <PlusCircle className="h-5 w-5" />
          </Button>
        </div>
        
        <ScrollArea className="flex-1">
          <div className="flex flex-col items-center gap-2 px-2">
            {chats.slice(0, 5).map(chat => (
              <Button
                key={chat.id}
                variant="ghost"
                size="icon"
                className={`w-8 h-8 ${selectedChatId === chat.id ? 'bg-gray-100' : ''}`}
                onClick={() => onSelectChat(chat.id)}
                title={chat.title}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
            ))}
          </div>
        </ScrollArea>
        
        <div className="border-t border-gray-200 p-2 flex flex-col gap-1">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => setShowSettings(true)}
            title="Settings"
          >
            <Settings className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            title="Account"
          >
            <User className="h-4 w-4" />
          </Button>
        </div>

        <SettingsModal
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
        />
      </div>
    );
  }

  return (
    <div className="w-full h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="font-semibold text-lg">Chat History</h2>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={handleNewChat}
          disabled={createChatMutation.isPending}
        >
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1 min-h-0">
        <div className="p-2">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No chats yet</div>
          ) : (
            chats.map(chat => (
              <div 
                key={chat.id}
                className={`flex items-start gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors mb-1 group ${
                  selectedChatId === chat.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquare className="h-5 w-5 mt-1 text-gray-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-sm truncate pr-2">{chat.title}</h3>
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-500">{formatDate(chat.created_at)}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => handleEditChat(e, chat)}
                      >
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <div className="border-t border-gray-200 p-2 mt-auto">
        <Button 
          variant="ghost" 
          className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 mb-1"
          onClick={() => setShowSettings(true)}
        >
          <Settings className="mr-2 h-4 w-4" />
          Preferences
        </Button>
      </div>

      {editingChat && (
        <EditChatModal
          isOpen={true}
          onClose={() => setEditingChat(null)}
          chatId={editingChat.id}
          currentTitle={editingChat.title}
        />
      )}

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
};

export default ChatSidebar;
