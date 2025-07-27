import Image from "next/image";
import React from "react";

type ChatMessageProps = {
  isBot: boolean;
  message: string;
  showAvatar?: boolean;
  children?: React.ReactNode;
};

export const ChatMessage: React.FC<ChatMessageProps> = ({
  isBot,
  message,
  showAvatar = true,
  children,
}) => {
  if (isBot) {
    return (
      <div className="flex gap-4 items-start mb-4">
        {showAvatar && (
          <div className="w-12 h-12 flex-shrink-0 mt-2">
            <Image
              src="/aligator-70.svg"
              alt="Bot mascot"
              width={48}
              height={48}
              priority
            />
          </div>
        )}
        <div className="bg-emerald-500 text-white p-5 rounded-lg max-w-[90%]">
          <p className="text-sm mb-4">{message}</p>
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-end mb-4">
      <div className="bg-[#002415] p-3 rounded-lg max-w-[80%]">
        <p className="text-sm">{message}</p>
      </div>
    </div>
  );
}; 