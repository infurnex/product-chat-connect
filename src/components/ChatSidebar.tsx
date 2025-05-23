
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, MessageSquare, Settings, User } from "lucide-react";
import { useChats, useCreateChat } from "@/hooks/useChats";
import { useAuth } from "./AuthProvider";
import { format, isToday, isYesterday } from "date-fns";

interface ChatSidebarProps {
  onNewChat: () => void;
  selectedChatId: string | null;
  onSelectChat: (chatId: string) => void;
}

const ChatSidebar = ({ onNewChat, selectedChatId, onSelectChat }: ChatSidebarProps) => {
  const { user } = useAuth();
  const { data: chats = [], isLoading } = useChats();
  const createChatMutation = useCreateChat();

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

  if (!user) {
    return (
      <div className="w-full h-full bg-gray-50 border-r border-gray-200 flex flex-col items-center justify-center p-4">
        <MessageSquare className="h-12 w-12 text-gray-400 mb-4" />
        <p className="text-gray-500 text-center">Sign in to access your chat history</p>
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
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {isLoading ? (
            <div className="p-4 text-center text-gray-500">Loading chats...</div>
          ) : chats.length === 0 ? (
            <div className="p-4 text-center text-gray-500">No chats yet</div>
          ) : (
            chats.map(chat => (
              <div 
                key={chat.id}
                className={`flex items-start gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors mb-1 ${
                  selectedChatId === chat.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => onSelectChat(chat.id)}
              >
                <MessageSquare className="h-5 w-5 mt-1 text-gray-500 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline">
                    <h3 className="font-medium text-sm truncate">{chat.title}</h3>
                    <span className="text-xs text-gray-500">{formatDate(chat.created_at)}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </ScrollArea>
      
      <div className="border-t border-gray-200 p-2">
        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100 mb-1">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
        <Button variant="ghost" className="w-full justify-start text-gray-600 hover:text-gray-900 hover:bg-gray-100">
          <User className="mr-2 h-4 w-4" />
          Account
        </Button>
      </div>
    </div>
  );
};

export default ChatSidebar;
