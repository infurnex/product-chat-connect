import React from 'react';

const AiLoader = () => {
  return (
    <div className="flex flex-row gap-2">
      <div className="w-3 h-3 rounded-full bg-blue-700 animate-bounce" />
      <div className="w-3 h-3 rounded-full bg-blue-700 animate-bounce [animation-delay:-.3s]" />
      <div className="w-3 h-3 rounded-full bg-blue-700 animate-bounce [animation-delay:-.5s]" />
    </div>
  );
}

export default AiLoader;
