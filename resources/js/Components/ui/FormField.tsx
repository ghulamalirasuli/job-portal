import type { ReactNode } from 'react';
import { Label } from './Label';

interface FormFieldProps {
    id: string;
    label: string;
    required?: boolean;
    hint?: string;
    error?: string;
    children: ReactNode;
}

export function FormField({
    id,
    label,
    required,
    hint,
    error,
    children,
}: FormFieldProps) {
    return (
        <div className="space-y-1.5">
            <Label htmlFor={id} required={required}>
                {label}
            </Label>
            {children}
            {hint && !error ? (
                <p className="text-xs text-slate-500">{hint}</p>
            ) : null}
            {error ? (
                <p className="text-xs text-red-600" role="alert">
                    {error}
                </p>
            ) : null}
        </div>
    );
}
