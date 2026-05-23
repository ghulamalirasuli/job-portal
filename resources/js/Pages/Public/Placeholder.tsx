import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, Briefcase, Building2, Sparkles, Users } from 'lucide-react';
import { type ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { TopNav } from '@/Components/layout/TopNav';
import { SiteFooter } from '@/Components/layout/SiteFooter';
import { Button } from '@/Components/ui/Button';
import type { PageProps } from '@/types';

interface PlaceholderProps extends PageProps {
    slug: 'jobs' | 'companies' | 'for_employers';
}

const CONFIG: Record<
    PlaceholderProps['slug'],
    { titleKey: string; bodyKey: string; icon: ReactNode; cta?: { href: string; labelKey: string } }
> = {
    jobs: {
        titleKey: 'placeholder.jobs_title',
        bodyKey: 'placeholder.jobs_body',
        icon: <Briefcase className="size-7" />,
    },
    companies: {
        titleKey: 'placeholder.companies_title',
        bodyKey: 'placeholder.companies_body',
        icon: <Building2 className="size-7" />,
    },
    for_employers: {
        titleKey: 'placeholder.for_employers_title',
        bodyKey: 'placeholder.for_employers_body',
        icon: <Users className="size-7" />,
        cta: { href: '/register/employer', labelKey: 'home.cta_employer' },
    },
};

export default function Placeholder() {
    const { t } = useTranslation();
    const { slug } = usePage<PlaceholderProps>().props;
    const cfg = CONFIG[slug];

    return (
        <div className="flex min-h-screen flex-col bg-white">
            <Head title={t(cfg.titleKey)} />
            <TopNav />
            <main className="flex-1">
                <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
                    <div className="container-page py-20">
                        <div className="mx-auto max-w-2xl text-center">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-200">
                                <Sparkles className="size-3.5" />
                                Coming soon
                            </span>
                            <div className="mx-auto mt-6 inline-flex size-16 items-center justify-center rounded-2xl bg-brand-600 text-white shadow-lg shadow-brand-200">
                                {cfg.icon}
                            </div>
                            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-slate-900">
                                {t(cfg.titleKey)}
                            </h1>
                            <p className="mt-4 text-pretty text-lg text-slate-600">
                                {t(cfg.bodyKey)}
                            </p>
                            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
                                <Link href="/">
                                    <Button variant="outline" size="lg">
                                        <ArrowLeft className="size-4" />
                                        Back to home
                                    </Button>
                                </Link>
                                {cfg.cta ? (
                                    <Link href={cfg.cta.href}>
                                        <Button size="lg">{t(cfg.cta.labelKey)}</Button>
                                    </Link>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <SiteFooter />
        </div>
    );
}
