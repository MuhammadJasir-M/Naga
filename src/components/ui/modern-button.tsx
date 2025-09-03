import React from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ModernButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'premium' | 'glow' | 'outline-modern';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  children: React.ReactNode;
  className?: string;
}

export function ModernButton({ 
  variant = 'premium',
  size = 'md', 
  isLoading = false, 
  children, 
  className,
  ...props 
}: ModernButtonProps) {
  const sizeStyles = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-3 text-base',
    lg: 'px-8 py-4 text-lg',
    xl: 'px-10 py-5 text-xl'
  };

  const variantStyles = {
    premium: 'premium-button text-white font-semibold rounded-xl shadow-glow hover:shadow-premium',
    glow: 'bg-gradient-primary text-white font-medium rounded-lg animate-glow hover:animate-pulse-glow',
    'outline-modern': 'border-2 border-primary/30 bg-transparent text-foreground hover:bg-primary/10 hover:border-primary rounded-xl backdrop-blur-sm'
  };

  return (
    <button
      className={cn(
        'relative overflow-hidden transition-all duration-500 ease-smooth transform-gpu',
        'focus:outline-none focus:ring-4 focus:ring-primary/30',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      disabled={isLoading}
      {...props}
    >
      {isLoading && (
        <Loader2 className="animate-spin mr-2 h-4 w-4" />
      )}
      <span className="relative z-10">
        {children}
      </span>
    </button>
  );
}