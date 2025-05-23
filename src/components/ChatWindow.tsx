
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Paperclip } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { ChatMessage as ChatMessageType } from "@/types";

interface ChatWindowProps {
  onClose: () => void;
}

const ChatWindow = ({ onClose }: ChatWindowProps) => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: "1",
      content: "Hello! I'm your product assistant. How can I help you today?",
      sender: "assistant",
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = () => {
    if (!message.trim()) return;
    
    // Add user message
    const userMessage: ChatMessageType = {
      id: String(Date.now()),
      content: message,
      sender: "user",
      timestamp: new Date()
    };
    
    setMessages([...messages, userMessage]);
    setMessage("");
    
    // Simulate assistant response after a short delay
    setTimeout(() => {
      const assistantMessage: ChatMessageType = {
        id: String(Date.now() + 1),
        content: "I'm looking into that for you. Is there anything specific you're interested in?",
        sender: "assistant",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);
    }, 1000);
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

  return (
    <div className="fixed bottom-0 right-6 w-full max-w-[400px] bg-white rounded-t-lg shadow-lg z-10 border border-gray-200 animate-slide-in">
      <div className="bg-shopping-blue text-white p-3 rounded-t-lg flex justify-between items-center">
        <h3 className="font-medium">Shopping Assistant</h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-white hover:bg-shopping-blue-dark">
          <X className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="h-[350px] overflow-y-auto p-4 bg-white">
        {messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center gap-2">
        <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0 text-gray-500">
          <Paperclip className="h-4 w-4" />
        </Button>
        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow border-gray-300"
        />
        <Button
          onClick={handleSend}
          className="h-8 w-8 p-0 bg-shopping-blue hover:bg-shopping-blue-dark flex-shrink-0"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
