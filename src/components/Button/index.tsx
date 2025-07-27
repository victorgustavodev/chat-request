'use client';

import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`cursor-pointer hover:scale-[1.01] px-6 py-5 rounded-2xl border-2 font-medium transition-all ${className}`}
    >
      {children}
    </button>
  );
}
