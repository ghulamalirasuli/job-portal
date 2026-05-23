import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    invalid?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, invalid, type = 'text', ...props }, ref) => (
        <input
            ref={ref}
            type={type}
            className={cn(
                'block w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 shadow-sm',
                'placeholder:text-slate-400',
                'focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500',
                'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500',
                invalid
                    ? 'border-red-400 focus:border-red-500 focus:ring-red-500'
                    : 'border-slate-300',
                className,
            )}
            {...props}
        />
    ),
);
Input.displayName = 'Input';
