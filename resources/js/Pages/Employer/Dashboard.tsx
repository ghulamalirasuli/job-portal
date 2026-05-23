import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowRight, BriefcaseBusiness, Plus, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/Layouts/AppLayout';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import type { PageProps } from '@/types';

interface EmployerDashboardProps extends PageProps {
    profile: {
        company_name: string;
        is_verified: boolean;
        logo_url: string | null;
    } | null;
}

export default function EmployerDashboard() {
    const { t } = useTranslation();
    const { auth, profile } = usePage<EmployerDashboardProps>().props;

    return (
        <AppLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-semibold text-slate-900">
                            {t('dashboard.welcome', { name: auth.user?.name ?? '' })}
                        </h1>
                        <p className="mt-1 text-sm text-slate-500">
                            {profile?.company_name}
                        </p>
                    </div>
                    {profile ? (
                        <Badge tone={profile.is_verified ? 'success' : 'warning'}>
                            {profile.is_verified
                                ? t('dashboard.employer_verified')
                                : t('dashboard.employer_verification_pending')}
                        </Badge>
                    ) : null}
                </div>
            }
        >
            <Head title={t('nav.dashboard')} />

            <div className="grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-3">
                    <div className="flex items-center justify-between gap-4 rounded-xl bg-slate-900 p-6 text-white">
                        <div className="flex items-start gap-3">
                            <Plus className="mt-0.5 size-6 shrink-0 text-white" />
                            <div>
                                <p className="font-semibold">
                                    {t('dashboard.employer_cta_post_job_title')}
                                </p>
                                <p className="mt-1 text-sm text-white/70">
                                    {t('dashboard.employer_cta_post_job_body')}
                                </p>
                            </div>
                        </div>
                        <Link href="/employer/jobs/create" className="shrink-0">
                            <Button variant="primary">
                                {t('dashboard.employer_cta_post_job_action')}
                                <ArrowRight className="size-4" />
                            </Button>
                        </Link>
                    </div>
                </div>

                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>{t('dashboard.employer_active_jobs')}</CardTitle>
                        <CardDescription>
                            {t('dashboard.employer_active_jobs_empty')}
                        </CardDescription>
                    </CardHeader>
                    <Empty icon={<BriefcaseBusiness className="size-6" />} />
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('dashboard.employer_recent_applicants')}</CardTitle>
                        <CardDescription>
                            {t('dashboard.employer_recent_applicants_empty')}
                        </CardDescription>
                    </CardHeader>
                    <Empty icon={<Users className="size-6" />} />
                </Card>
            </div>
        </AppLayout>
    );
}

function Empty({ icon }: { icon: React.ReactNode }) {
    return (
        <div className="flex flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-slate-200 bg-slate-50 py-10 text-slate-400">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-white ring-1 ring-slate-200">
                {icon}
            </span>
        </div>
    );
}
