import { Link } from '@inertiajs/react';
import { Briefcase } from 'lucide-react';
import { type PropsWithChildren } from 'react';
import { useTranslation } from 'react-i18next';
import { LanguageSwitcher } from '@/Components/LanguageSwitcher';
import { ThemeToggle } from '@/Components/ThemeToggle';
import { SiteFooter } from '@/Components/layout/SiteFooter';

export default function GuestLayout({ children }: PropsWithChildren) {
    const { t } = useTranslation();
    return (
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            <header className="container-page flex items-center justify-between py-6">
                <Link href="/" className="inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100">
                    <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-600 text-white">
                        <Briefcase className="size-5" aria-hidden="true" />
                    </span>
                    <span>{t('app.name')}</span>
                </Link>
                <div className="flex items-center gap-2">
                    <ThemeToggle variant="ghost" />
                    <LanguageSwitcher />
                </div>
            </header>
            <main className="container-page flex flex-1 items-center justify-center py-12">
                <div className="w-full max-w-md">{children}</div>
            </main>
            <SiteFooter />
        </div>
    );
}
