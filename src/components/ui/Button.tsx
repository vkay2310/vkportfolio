import { ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {

    const variants = {
      primary: cn(
        "relative overflow-hidden",
        "bg-accent text-white",
        "border border-accent",
        "before:absolute before:inset-0 before:bg-white/10 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100",
        "depth-1 glow-accent",
        "transition-all duration-200"
      ),
      outline: cn(
        "relative overflow-hidden",
        "bg-transparent text-foreground",
        "border border-border",
        "before:absolute before:inset-0 before:bg-foreground/5 before:opacity-0 before:transition-opacity before:duration-200 hover:before:opacity-100",
        "glass-light depth-1",
        "hover:border-foreground/30 transition-all duration-200"
      ),
      ghost: cn(
        "bg-transparent text-foreground",
        "relative group",
        "hover:text-accent transition-colors duration-300",
        "p-0"
      ),
    };

    const sizes = {
      sm: variant === 'ghost' ? "text-sm" : "px-5 py-2.5 text-sm",
      md: variant === 'ghost' ? "text-base" : "px-8 py-4 text-base",
      lg: variant === 'ghost' ? "text-lg" : "px-12 py-5 text-lg",
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: 0.96, y: 1 }}
        transition={{ duration: 0.08, ease: 'easeOut' }}
        className={cn(
          "font-sans uppercase tracking-[0.12em] font-semibold",
          "flex items-center justify-center cursor-pointer",
          "select-none",
          variants[variant],
          sizes[size],
          className
        )}
        {...(props as React.ComponentProps<typeof motion.button>)}
      >
        {children}
        {variant === 'ghost' && (
          <span className="absolute -bottom-0.5 left-0 w-full h-[1px] bg-accent scale-x-0 group-hover:scale-x-100 transition-transform duration-400 origin-left" />
        )}
      </motion.button>
    );
  }
);
Button.displayName = 'Button';