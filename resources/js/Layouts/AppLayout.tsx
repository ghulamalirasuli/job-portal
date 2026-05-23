import { usePage } from '@inertiajs/react';
import { type PropsWithChildren, type ReactNode, useEffect } from 'react';
import { TopNav } from '@/Components/layout/TopNav';
import { SiteFooter } from '@/Components/layout/SiteFooter';
import { Alert } from '@/Components/ui/Alert';
import type { PageProps } from '@/types';

interface Props {
    header?: ReactNode;
}

export default function AppLayout({ header, children }: PropsWithChildren<Props>) {
    const { flash } = usePage<PageProps>().props;

    useEffect(() => {
        // Reserved for analytics/page-view ping; intentionally empty in Phase 1.
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-slate-50 dark:bg-slate-950">
            <TopNav />
            {header ? (
                <div className="border-b border-default bg-white dark:bg-slate-900">
                    <div className="container-page py-6">{header}</div>
                </div>
            ) : null}
            <main className="flex-1">
                <div className="container-page py-8">
                    {flash?.success ? (
                        <div className="mb-4">
                            <Alert tone="success">{flash.success}</Alert>
                        </div>
                    ) : null}
                    {flash?.error ? (
                        <div className="mb-4">
                            <Alert tone="error">{flash.error}</Alert>
                        </div>
                    ) : null}
                    {children}
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
