
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, MessageSquare, Settings, User } from "lucide-react";
import { chatHistories } from "@/data/products";
import { format, isToday, isYesterday } from "date-fns";

interface ChatSidebarProps {
  onNewChat: () => void;
}

const ChatSidebar = ({ onNewChat }: ChatSidebarProps) => {
  const formatDate = (date: Date) => {
    if (isToday(date)) {
      return "Today";
    } else if (isYesterday(date)) {
      return "Yesterday";
    } else {
      return `May ${date.getDate()}`; // Simplified for the mockup
    }
  };

  return (
    <div className="w-full h-full bg-gray-50 border-r border-gray-200 flex flex-col">
      <div className="p-4 flex justify-between items-center border-b border-gray-200">
        <h2 className="font-semibold text-lg">Chat History</h2>
        <Button variant="ghost" size="icon" onClick={onNewChat}>
          <PlusCircle className="h-5 w-5" />
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-2">
          {chatHistories.map(chat => (
            <div 
              key={chat.id}
              className="flex items-start gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors mb-1"
            >
              <MessageSquare className="h-5 w-5 mt-1 text-gray-500 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <h3 className="font-medium text-sm truncate">{chat.title}</h3>
                  <span className="text-xs text-gray-500">{formatDate(chat.date)}</span>
                </div>
                <p className="text-xs text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))}
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
