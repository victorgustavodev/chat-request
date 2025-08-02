'use client';

import React from 'react';
import { ButtonProps } from './type';

function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`cursor-pointer hover:scale-[1.01] px-6 py-5 rounded-2xl border-2 font-medium transition-all ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
