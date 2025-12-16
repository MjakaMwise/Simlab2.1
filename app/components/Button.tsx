import { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

export default function Button({ variant = 'primary', children, className = '', disabled, ...props }: ButtonProps) {
  const baseClass = variant === 'primary' ? 'btn-primary' : 'btn-secondary';

  return (
    <button className={`${baseClass} ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} disabled={disabled} {...props}>
      {children}
    </button>
  );
}
