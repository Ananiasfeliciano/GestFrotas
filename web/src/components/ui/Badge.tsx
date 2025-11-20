import React from 'react';
import { cn } from './Button';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'success' | 'warning';
}

export function Badge({ className, variant = 'default', ...props }: BadgeProps) {
    const variants = {
        default: 'border-transparent bg-brand-600 text-white hover:bg-brand-700',
        secondary: 'border-transparent bg-brand-100 text-brand-900 hover:bg-brand-200',
        destructive: 'border-transparent bg-red-500 text-white hover:bg-red-600',
        outline: 'text-gray-950 border-gray-200',
        success: 'border-transparent bg-green-500 text-white hover:bg-green-600',
        warning: 'border-transparent bg-yellow-500 text-white hover:bg-yellow-600',
    };

    return (
        <span
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2",
                variants[variant],
                className
            )}
            {...props}
        />
    );
}
