import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';

export function Card({
    className,
    children,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('card p-6', className)} {...props}>
            {children}
        </div>
    );
}

export function CardHeader({ children }: { children: ReactNode }) {
    return <div className="mb-4 space-y-1">{children}</div>;
}

export function CardTitle({ children }: { children: ReactNode }) {
    return (
        <h3 className="text-base font-semibold text-slate-900">{children}</h3>
    );
}

export function CardDescription({ children }: { children: ReactNode }) {
    return <p className="text-sm text-slate-500">{children}</p>;
}

export function CardFooter({ children }: { children: ReactNode }) {
    return (
        <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4">
            {children}
        </div>
    );
}
