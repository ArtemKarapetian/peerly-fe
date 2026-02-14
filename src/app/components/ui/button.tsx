import {ButtonHTMLAttributes, ReactNode} from 'react';
import {Loader2} from 'lucide-react';
import {cva, type VariantProps} from 'class-variance-authority';
import {cn} from './utils';

export const buttonVariants = cva(
    `inline-flex items-center justify-center gap-2
   font-medium transition-all
   disabled:opacity-50 disabled:cursor-not-allowed
   focus:outline-none focus:ring-2 focus:ring-offset-2`,
    {
        variants: {
            variant: {
                primary: `
                bg-[var(--brand-primary)] text-white 
                hover:bg-[var(--brand-primary-hover)] 
                focus:ring-[var(--brand-primary)]/50
                `,
                secondary: `
                bg-[var(--surface)] text-[var(--text-primary)] border border-[var(--surface-border)] 
                hover:bg-[var(--surface-hover)] 
                focus:ring-[var(--brand-primary)]/30
                `,
                ghost: `
                bg-transparent text-[var(--text-primary)] 
                hover:bg-[var(--surface-hover)] 
                focus:ring-[var(--brand-primary)]/30
                `,
                danger: `
                bg-[var(--error)] text-white 
                hover:bg-[var(--error)]/90 
                focus:ring-[var(--error)]/50
                `,
                outline: `
                bg-transparent text-[var(--brand-primary)] border border-[var(--brand-primary)] 
                hover:bg-[var(--brand-primary)] 
                hover:text-white 
                focus:ring-[var(--brand-primary)]/50
                `,
            },
            size: {
                sm: 'px-3 py-1.5 text-sm rounded-[var(--radius-sm)]',
                md: 'px-4 py-2.5 text-base rounded-[var(--radius-md)]',
                lg: 'px-6 py-3 text-lg rounded-[var(--radius-lg)]',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
);

interface ButtonProps
    extends ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    children: ReactNode;
    leftIcon?: ReactNode;
    rightIcon?: ReactNode;
    fullWidth?: boolean;
    isLoading?: boolean;
}

export function Button({
                           variant,
                           size,
                           children,
                           leftIcon,
                           rightIcon,
                           className = '',
                           disabled,
                           fullWidth = false,
                           isLoading = false,
                           ...props
                       }: ButtonProps) {
    return (
        <button
            className={cn(
                buttonVariants({variant, size}),
                fullWidth && 'w-full',
                className
            )}
            disabled={disabled || isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin"/>}
            {!isLoading && leftIcon && <span className="flex-shrink-0">{leftIcon}</span>}
            {children}
            {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
        </button>
    );
}
