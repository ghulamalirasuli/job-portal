import { Head, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { TopNav } from '@/Components/layout/TopNav';
import { SiteFooter } from '@/Components/layout/SiteFooter';
import type { PageProps } from '@/types';

interface LegalProps extends PageProps {
    slug: 'privacy' | 'terms' | 'imprint' | 'gdpr';
}

const TITLES: Record<LegalProps['slug'], string> = {
    privacy: 'footer.privacy',
    terms: 'footer.terms',
    imprint: 'footer.imprint',
    gdpr: 'footer.gdpr',
};

export default function Legal() {
    const { t } = useTranslation();
    const { slug } = usePage<LegalProps>().props;
    const title = t(TITLES[slug]);

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Head title={title} />
            <TopNav />
            <main className="flex-1">
                <div className="container-page py-16">
                    <h1 className="text-3xl font-semibold text-slate-900">{title}</h1>
                    <p className="mt-3 max-w-2xl text-slate-600">
                        This page is a placeholder. The full legal copy will be added in Phase 8 (Multilingual & EU Compliance).
                    </p>
                </div>
            </main>
            <SiteFooter />
        </div>
    );
}
