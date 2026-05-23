import { Moon, Sun } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useThemeStore } from '@/lib/theme';
import { cn } from '@/lib/utils';

interface Props {
    variant?: 'default' | 'admin' | 'ghost';
    className?: string;
}

export function ThemeToggle({ variant = 'default', className }: Props) {
    const { t } = useTranslation();
    const { mode, toggle } = useThemeStore();
    const isDark = mode === 'dark';

    return (
        <button
            type="button"
            onClick={toggle}
            aria-label={isDark ? t('theme.switch_light') : t('theme.switch_dark')}
            title={isDark ? t('theme.switch_light') : t('theme.switch_dark')}
            className={cn(
                'inline-flex size-10 items-center justify-center rounded-lg transition-colors',
                variant === 'admin' &&
                    'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                variant === 'ghost' &&
                    'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-white/10',
                variant === 'default' &&
                    'text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
                className,
            )}
        >
            {isDark ? (
                <Sun className="size-5" aria-hidden="true" />
            ) : (
                <Moon className="size-5" aria-hidden="true" />
            )}
        </button>
    );
}
