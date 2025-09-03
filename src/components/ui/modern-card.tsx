import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface ModernCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'glass' | 'premium' | 'stats';
  animated?: boolean;
}

export function ModernCard({ 
  children, 
  className, 
  variant = 'default',
  animated = true
}: ModernCardProps) {
  const variantStyles = {
    default: 'modern-card',
    glass: 'glass-morphism',
    premium: 'modern-card shadow-premium border-primary/20',
    stats: 'stat-card'
  };

  return (
    <Card 
      className={cn(
        variantStyles[variant],
        animated && 'transition-all duration-500 hover:scale-[1.02]',
        className
      )}
    >
      {children}
    </Card>
  );
}

interface ModernCardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernCardHeader({ children, className }: ModernCardHeaderProps) {
  return (
    <CardHeader className={cn('relative', className)}>
      {children}
    </CardHeader>
  );
}

interface ModernCardContentProps {
  children: React.ReactNode;
  className?: string;
}

export function ModernCardContent({ children, className }: ModernCardContentProps) {
  return (
    <CardContent className={cn('relative', className)}>
      {children}
    </CardContent>
  );
}