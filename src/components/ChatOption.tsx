import React from "react";

type ChatOptionProps = {
  label: string;
  onClick: () => void;
};

export const ChatOption: React.FC<ChatOptionProps> = ({ label, onClick }) => {
  return (
    <button
      className="bg-dark-green text-white cursor-pointer py-3 px-4 rounded-full w-full mb-2 text-center font-medium hover:brightness-90 transition-all"
      onClick={onClick}
    >
      <p>{label}</p>
    </button>
  );
}; 