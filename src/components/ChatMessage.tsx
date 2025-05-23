
import { ChatMessage as ChatMessageType } from "@/types";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === "user";
  
  return (
    <div className={cn(
      "flex w-full mb-4",
      isUser ? "justify-end" : "justify-start"
    )}>
      <div className={cn(
        "max-w-[80%] rounded-lg px-4 py-2",
        isUser ? "bg-shopping-blue text-white" : "bg-gray-100 text-gray-800"
      )}>
        <p className="text-sm">{message.content}</p>
        <div className={cn(
          "text-xs mt-1",
          isUser ? "text-blue-100" : "text-gray-500"
        )}>
          {format(message.timestamp, "h:mm a")}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
