import { ReactNode } from 'react';

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function GlassCard({ children, className = '', hover = true, onClick }: GlassCardProps) {
  return (
    <div
      className={`glass-card p-6 ${hover ? 'hover:scale-105 hover:shadow-glow-cyan transition-all duration-300' : ''} ${onClick ? 'cursor-pointer' : ''} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
