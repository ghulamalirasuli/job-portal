import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Check, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { router } from '@inertiajs/react';
import axios from 'axios';
import { SUPPORTED_LOCALES, type LocaleCode } from '@/lib/i18n';
import { cn } from '@/lib/utils';

interface Props {
    variant?: 'light' | 'dark';
}

export function LanguageSwitcher({ variant = 'light' }: Props) {
    const { i18n, t } = useTranslation();
    const current = (i18n.resolvedLanguage ?? 'en') as LocaleCode;
    const currentLocale =
        SUPPORTED_LOCALES.find((l) => l.code === current) ?? SUPPORTED_LOCALES[0];

    const handleChange = async (code: LocaleCode) => {
        if (code === current) return;
        await i18n.changeLanguage(code);
        try {
            await axios.post('/locale', { locale: code });
        } catch {
            // Non-blocking — client-side change still takes effect.
        }
        router.reload({ only: ['locale'] });
    };

    return (
        <Menu as="div" className="relative">
            <MenuButton
                className={cn(
                    'inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                    variant === 'light'
                        ? 'text-slate-700 hover:bg-slate-100'
                        : 'text-slate-200 hover:bg-white/10',
                )}
                aria-label={t('common.language_switcher_label')}
            >
                <Globe className="size-4" aria-hidden="true" />
                <span className="uppercase">{currentLocale.code}</span>
            </MenuButton>
            <MenuItems
                anchor="bottom end"
                className="z-50 mt-2 w-44 origin-top-right rounded-lg bg-white p-1 shadow-lg ring-1 ring-slate-200 focus:outline-none"
            >
                {SUPPORTED_LOCALES.map((locale) => (
                    <MenuItem key={locale.code}>
                        {({ focus }) => (
                            <button
                                type="button"
                                onClick={() => handleChange(locale.code)}
                                className={cn(
                                    'flex w-full items-center justify-between rounded-md px-3 py-2 text-sm',
                                    focus
                                        ? 'bg-slate-100 text-slate-900'
                                        : 'text-slate-700',
                                )}
                            >
                                <span>{locale.label}</span>
                                {locale.code === current ? (
                                    <Check className="size-4 text-brand-600" aria-hidden="true" />
                                ) : null}
                            </button>
                        )}
                    </MenuItem>
                ))}
            </MenuItems>
        </Menu>
    );
}
