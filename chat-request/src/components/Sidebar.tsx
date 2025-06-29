import React from "react";

export const Sidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex flex-col bg-emerald-500 h-full w-64 p-6 text-white">
      <div className="mt-16 mb-8">
        <h2 className="text-lg font-bold">IFPE CAMPUS IGARASSU</h2>
      </div>
      <div className="flex items-center gap-2">
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
        <span>Acesso CRAD/T</span>
      </div>
    </div>
  );
}; 