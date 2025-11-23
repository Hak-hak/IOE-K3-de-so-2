import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  ...props 
}) => {
  const baseStyles = "inline-flex items-center justify-center font-bold transition-all duration-200 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transform active:scale-95";
  
  const variants = {
    primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/30 focus:ring-blue-500 border border-transparent",
    secondary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30 focus:ring-emerald-500 border border-transparent",
    danger: "bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/30 focus:ring-rose-500 border border-transparent",
    outline: "bg-white border-2 border-slate-300 text-slate-600 hover:border-blue-500 hover:text-blue-600 shadow-slate-200/50"
  };

  const sizes = {
    sm: "px-4 py-1.5 text-sm",
    md: "px-6 py-3 text-base",
    lg: "px-8 py-4 text-lg"
  };

  return (
    <button 
      className={cn(baseStyles, variants[variant], sizes[size], className)} 
      {...props}
    >
      {children}
    </button>
  );
};