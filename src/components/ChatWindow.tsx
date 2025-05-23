
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Paperclip } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useMessages, useCreateMessage } from "@/hooks/useMessages";
import { useCreateChat } from "@/hooks/useChats";
import { Message } from "@/types/database";

interface ChatWindowProps {
  onClose: () => void;
  chatId: string | null;
  onChatCreated: (chatId: string) => void;
}

const ChatWindow = ({ onClose, chatId, onChatCreated }: ChatWindowProps) => {
  const [message, setMessage] = useState("");
  const { data: messages = [], isLoading } = useMessages(chatId);
  const createMessageMutation = useCreateMessage();
  const createChatMutation = useCreateChat();
  const [image, setImage] = useState<any>();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!message.trim()) return;
    
    let currentChatId = chatId;
    
    // Create new chat if none exists
    if (!currentChatId) {
      try {
        const newChat = await createChatMutation.mutateAsync(message.slice(0, 50) + (message.length > 50 ? '...' : ''));
        currentChatId = newChat.id;
        onChatCreated(newChat.id);
      } catch (error) {
        console.error('Error creating chat:', error);
        return;
      }
    }
    
    // Add user message
    try {
      await createMessageMutation.mutateAsync({
        chatId: currentChatId,
        role: 'user',
        content: message,
      });

      // fetching results from ai agent
      const formData = new FormData();
      formData.append("text", message);
      formData.append("image", image);
      formData.append("chatId", currentChatId);
      
      setMessage("");
      setImage("");
      
      const AIresponse = await fetch("http://localhost:5678/webhook-test/agent", {
        method: "POST",
        body: formData,
      });

      console.log("ai's", AIresponse);
      await createMessageMutation.mutateAsync({
        chatId: currentChatId,
        role: 'assistant',
        content: "I'm looking into that for you. Is there anything specific you're interested in?",
      });

    } catch (error) {
      console.error('Error creating user message:', error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  // Scroll to the bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Convert database messages to component format
  const formattedMessages = messages.map((msg: Message) => ({
    id: msg.id,
    content: msg.content,
    sender: msg.role,
    timestamp: new Date(msg.timestamp),
  }));

  // Add welcome message if no messages exist
  const displayMessages = formattedMessages.length === 0 ? [
    {
      id: "welcome",
      content: "Hello! I'm your product assistant. How can I help you today?",
      sender: "assistant" as const,
      timestamp: new Date()
    }
  ] : formattedMessages;

  return (
    <div className="fixed bottom-0 right-6 w-full max-w-[400px] bg-white rounded-t-lg shadow-lg z-10 border border-gray-200 animate-slide-in">
      <div className="bg-shopping-blue text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className="font-medium">Shopping Assistant</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white hover:bg-shopping-blue-dark">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="h-[350px] overflow-y-auto p-4 bg-white">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500">Loading messages...</div>
          </div>
        ) : (
          <>
            {displayMessages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          className="mt-1"
          onChange={(e) => setImage(e.target.files[0])}
        />
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-gray-500">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow border-gray-300"
          disabled={createMessageMutation.isPending}
        />
        <Button
          onClick={handleSend}
          className="h-8 w-8 p-0 bg-shopping-blue hover:bg-shopping-blue-dark flex-shrink-0"
          disabled={createMessageMutation.isPending || !message.trim()}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
