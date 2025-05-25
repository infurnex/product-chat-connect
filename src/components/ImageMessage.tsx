
import { Image } from "lucide-react";

interface ImageMessageProps {
  filename: string;
  timestamp: Date;
  isUser: boolean;
}

const ImageMessage = ({ filename, timestamp, isUser }: ImageMessageProps) => {
  return (
    <div className={`flex items-center gap-2 p-2 rounded-lg border ${
      isUser ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'
    }`}>
      <div className={`p-2 rounded-full ${
        isUser ? 'bg-blue-100' : 'bg-gray-100'
      }`}>
        <Image className={`h-4 w-4 ${
          isUser ? 'text-blue-600' : 'text-gray-600'
        }`} />
      </div>
      <div className="flex-1">
        <div className="text-sm font-medium text-gray-900">
          Image attached
        </div>
        <div className="text-xs text-gray-500 truncate">
          {filename}
        </div>
      </div>
    </div>
  );
};

export default ImageMessage;
