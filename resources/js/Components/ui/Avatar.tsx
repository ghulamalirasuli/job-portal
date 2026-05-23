import { initials, cn } from '@/lib/utils';

interface AvatarProps {
    name: string | null | undefined;
    src?: string | null;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

const sizes = {
    sm: 'size-8 text-xs',
    md: 'size-10 text-sm',
    lg: 'size-14 text-base',
};

export function Avatar({ name, src, size = 'md', className }: AvatarProps) {
    const dim = sizes[size];
    if (src) {
        return (
            <img
                src={src}
                alt={name ?? 'avatar'}
                className={cn('rounded-full object-cover ring-1 ring-slate-200', dim, className)}
            />
        );
    }
    return (
        <span
            aria-hidden="true"
            className={cn(
                'inline-flex items-center justify-center rounded-full bg-brand-100 font-semibold text-brand-700 ring-1 ring-brand-200',
                dim,
                className,
            )}
        >
            {initials(name)}
        </span>
    );
}
