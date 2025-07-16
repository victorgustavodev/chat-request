'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`px-6 py-3 rounded-2xl border-2 border-[#002415] font-medium hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-emerald-50 disabled:bg-emerald-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out ${className}`}
    >
      {children}
    </button>
  );
}
