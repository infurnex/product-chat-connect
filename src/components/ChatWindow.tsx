
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Send, Paperclip, CheckCircle } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { useMessages, useCreateMessage } from "@/hooks/useMessages";
import { useCreateChat } from "@/hooks/useChats";
import { Message } from "@/types/database";
import AiLoader from "./ui/aiLoader";

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
  const [image, setImage] = useState<File | null>(null);
  const [waitingForAI, setWaitingForAI] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const handleSend = async () => {
    if (!message.trim() && !image) return;
    
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
      // If image is attached, create a message with image filename and emoji
      if (image) {
        await createMessageMutation.mutateAsync({
          chatId: currentChatId,
          role: 'user',
          content: `${image.name}📷`,
        });
      }
      
      // Add text message if present
      if (message.trim()) {
        await createMessageMutation.mutateAsync({
          chatId: currentChatId,
          role: 'user',
          content: message,
        });
      }

      setWaitingForAI(true);

      // fetching results from ai agent
      const formData = new FormData();
      formData.append("chatId", currentChatId);
      formData.append("text", message);
      if (image) {
        formData.append("image", image);
      }
      formData.append("imageAttached", image ? "true" : "false");
      
      setMessage("");
      setImage(null);
      
      const AIresponse = await fetch("https://infur.app.n8n.cloud/webhook/agent", {
        method: "POST",
        body: formData,
      });

      if(!AIresponse.ok) {
        throw new Error("Failed to fetch AI response");
      }

      const aimessage = await AIresponse.text() || "something went wrong";

      await createMessageMutation.mutateAsync({
        chatId: currentChatId,
        role: 'assistant',
        content: aimessage,
      });

      setWaitingForAI(false);

    } catch (error) {
      console.error('Error creating user message:', error);
      setWaitingForAI(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
    }
  };

  const removeImage = () => {
    setImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
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
  const displayMessages = ( formattedMessages.length === 0 && !isLoading ) ? [
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
            {waitingForAI && <AiLoader/>}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Image preview */}
      {image && (
        <div className="px-3 py-2 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center gap-2 p-2 bg-white rounded border border-green-200">
            <img 
              src={URL.createObjectURL(image)} 
              alt="Preview" 
              className="w-8 h-8 object-cover rounded"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm text-gray-600 truncate">{image.name}</p>
              <div className="flex items-center gap-1 text-xs text-green-600">
                <CheckCircle className="w-3 h-3" />
                <span>Ready to send</span>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6 text-gray-400 hover:text-gray-600"
              onClick={removeImage}
            >
              <X className="h-3 w-3" />
            </Button>
          </div>
        </div>
      )}
            
      <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center gap-2">
        <input
          id="file-upload"
          ref={fileInputRef}
          className="hidden"
          type="file"
          accept="image/*"
          onChange={handleImageSelect}
        />
        <Button 
          variant="ghost" 
          size="icon" 
          className={`h-8 w-8 ${image ? 'text-green-600 bg-green-50' : 'text-gray-500'}`}
          onClick={() => fileInputRef.current?.click()}
        > 
          <Paperclip className="h-4 w-4" />
        </Button>

        <Input
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow border-gray-300"
          disabled={createMessageMutation.isPending || waitingForAI}
        />
        <Button
          onClick={handleSend}
          className="h-8 w-8 p-0 bg-shopping-blue hover:bg-shopping-blue-dark flex-shrink-0"
          disabled={createMessageMutation.isPending || waitingForAI || (!message.trim() && !image)}
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default ChatWindow;
