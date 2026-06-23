import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    
    // Bold Typography Button Styles
    const variants = {
      primary: "bg-accent text-accent-foreground hover:bg-foreground hover:text-background border-2 border-transparent transition-colors duration-300 shadow-none",
      outline: "bg-transparent border-2 border-foreground hover:bg-foreground hover:text-background transition-colors duration-300",
      ghost: "bg-transparent text-foreground hover:text-accent relative group transition-colors duration-300 p-0",
    };

    const sizes = {
      sm: variant === 'ghost' ? "text-sm" : "px-4 py-2 text-sm",
      md: variant === 'ghost' ? "text-base" : "px-8 py-4 text-base",
      lg: variant === 'ghost' ? "text-lg" : "px-12 py-5 text-lg",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "font-sans uppercase tracking-[0.1em] font-semibold flex items-center justify-center cursor-pointer",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
        {/* Animated Underline for Ghost style */}
        {variant === 'ghost' && (
          <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
        )}
      </button>
    );
  }
);
Button.displayName = 'Button';
