import React from "react";

type HeaderProps = {
  onMenuClick?: () => void;
};

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-emerald-500 text-white px-4 py-3 flex justify-between items-center lg:hidden">
      <button className="p-1" onClick={onMenuClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      <div className="font-bold text-xl">IFPE</div>
    </header>
  );
}; 