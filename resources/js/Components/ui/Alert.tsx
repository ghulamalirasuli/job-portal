import type { ReactNode } from 'react';
import { AlertCircle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

type Tone = 'success' | 'error' | 'info' | 'warning';

interface AlertProps {
    tone?: Tone;
    title?: string;
    children?: ReactNode;
    className?: string;
}

const toneStyles: Record<Tone, { wrap: string; icon: ReactNode }> = {
    success: {
        wrap: 'bg-green-50 text-green-800 ring-green-200',
        icon: <CheckCircle2 className="size-5 text-green-600" />,
    },
    error: {
        wrap: 'bg-red-50 text-red-800 ring-red-200',
        icon: <XCircle className="size-5 text-red-600" />,
    },
    info: {
        wrap: 'bg-brand-50 text-brand-800 ring-brand-200',
        icon: <Info className="size-5 text-brand-600" />,
    },
    warning: {
        wrap: 'bg-amber-50 text-amber-800 ring-amber-200',
        icon: <AlertCircle className="size-5 text-amber-600" />,
    },
};

export function Alert({ tone = 'info', title, children, className }: AlertProps) {
    const { wrap, icon } = toneStyles[tone];
    return (
        <div
            role="alert"
            className={cn(
                'flex gap-3 rounded-lg p-4 text-sm ring-1',
                wrap,
                className,
            )}
        >
            <div className="shrink-0">{icon}</div>
            <div className="space-y-1">
                {title ? <p className="font-medium">{title}</p> : null}
                {children ? <div className="text-sm/relaxed">{children}</div> : null}
            </div>
        </div>
    );
}
