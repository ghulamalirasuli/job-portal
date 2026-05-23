import { type PropsWithChildren, type ReactNode } from 'react';
import { TopNav } from '@/Components/layout/TopNav';
import { SiteFooter } from '@/Components/layout/SiteFooter';

interface Props {
    header?: ReactNode;
}

export default function PublicLayout({ header, children }: PropsWithChildren<Props>) {
    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
            <TopNav />
            {header}
            <main className="flex-1">{children}</main>
            <SiteFooter />
        </div>
    );
}
