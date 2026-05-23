import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, FileText, Heart, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/Layouts/AppLayout';
import { Card, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { Button } from '@/Components/ui/Button';
import type { PageProps } from '@/types';

interface SeekerDashboardProps extends PageProps {
    profile: {
        headline: string | null;
        summary: string | null;
        visibility: 'public' | 'private';
        is_complete: boolean;
    } | null;
}

export default function SeekerDashboard() {
    const { t } = useTranslation();
    const { auth, profile } = usePage<SeekerDashboardProps>().props;

    return (
        <AppLayout
            header={
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">
                        {t('dashboard.welcome', { name: auth.user?.name ?? '' })}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">{t('app.tagline')}</p>
                </div>
            }
        >
            <Head title={t('nav.dashboard')} />

            <div className="grid gap-6 lg:grid-cols-3">
                {profile?.is_complete !== true ? (
                    <div className="lg:col-span-3">
                        <div className="flex items-center justify-between gap-4 rounded-xl bg-brand-50 p-6 ring-1 ring-brand-200 dark:bg-brand-950/30 dark:ring-brand-800">
                            <div className="flex items-start gap-3">
                                <FileText className="mt-0.5 size-6 shrink-0 text-brand-600" />
                                <div>
                                    <p className="font-semibold text-slate-900 dark:text-slate-100">{t('dashboard.seeker_cta_complete_profile_title')}</p>
                                    <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{t('dashboard.seeker_cta_complete_profile_body')}</p>
                                </div>
                            </div>
                            <Link href="/seeker/profile" className="shrink-0"><Button>{t('dashboard.seeker_cta_complete_profile_action')}<ArrowRight className="size-4" /></Button></Link>
                        </div>
                    </div>
                ) : null}

                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-900 p-6 text-white">
                        <div>
                            <p className="font-semibold">{t('resume.title')}</p>
                            <p className="mt-1 text-sm text-slate-300">{t('resume.dashboard_cta')}</p>
                        </div>
                        <Link href="/seeker/resume" className="shrink-0"><Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">{t('resume.open_builder')}<ArrowRight className="size-4" /></Button></Link>
                    </div>
                </div>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>{t('dashboard.seeker_applications')}</CardTitle>
                        <CardDescription>
                            {t('dashboard.seeker_applications_empty')}
                        </CardDescription>
                    </CardHeader>
                    <EmptyState icon={<Search className="size-6" />} label={t('nav.jobs')} href="/jobs" />
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.seeker_saved_jobs')}</CardTitle>
                        <CardDescription>
                            {t('dashboard.seeker_saved_jobs_empty')}
                        </CardDescription>
                    </CardHeader>
                    <EmptyState icon={<Heart className="size-6" />} label={t('common.search')} href="/jobs" />
                </Card>
            </div>
        </AppLayout>
    );
}

function EmptyState({
    icon,
    label,
    href,
}: {
    icon: React.ReactNode;
    label: string;
    href: string;
}) {
    return (
        <Link
            href={href}
            className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 py-10 text-slate-500 transition hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700"
        >
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-white text-slate-400 ring-1 ring-slate-200">
                {icon}
            </span>
            <span className="text-sm font-medium">{label}</span>
        </Link>
    );
}
