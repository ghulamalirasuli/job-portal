import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, BadgeCheck, Briefcase, Clock, ExternalLink, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/Layouts/PublicLayout';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import type { PageProps } from '@/types';

interface Props extends PageProps {
    job: {
        id: number;
        title: string;
        slug: string;
        description: string;
        requirements: string | null;
        benefits: string | null;
        location: string | null;
        country: string | null;
        remote_label: string;
        employment_label: string;
        salary_label: string | null;
        expires_at: string | null;
        published_at: string | null;
        views_count: number;
        company: {
            id: number;
            name: string;
            logo_url: string | null;
            industry: string | null;
            website: string | null;
            is_verified: boolean;
            country: string | null;
        };
    };
}

export default function JobShow() {
    const { t } = useTranslation();
    const { job } = usePage<Props>().props;
    const location = [job.location, job.country].filter(Boolean).join(', ');

    return (
        <PublicLayout>
            <Head title={job.title} />
            <section className="border-b border-default bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950">
                <div className="container-page py-10">
                    <Link href="/jobs" className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline dark:text-brand-400">
                        <ArrowLeft className="size-4" /> {t('public.back_to_jobs')}
                    </Link>
                    <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge tone="default">{job.remote_label}</Badge>
                                <Badge tone="default">{job.employment_label}</Badge>
                                {job.salary_label ? <Badge tone="brand">{job.salary_label}</Badge> : null}
                            </div>
                            <h1 className="mt-3 text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">{job.title}</h1>
                            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
                                {location ? (
                                    <span className="inline-flex items-center gap-1"><MapPin className="size-4" />{location}</span>
                                ) : null}
                                {job.expires_at ? (
                                    <span className="inline-flex items-center gap-1"><Clock className="size-4" />{t('public.closes')} {new Date(job.expires_at).toLocaleDateString()}</span>
                                ) : null}
                            </div>
                        </div>
                        <Button size="lg">{t('public.apply_now')}</Button>
                    </div>
                </div>
            </section>

            <section className="container-page grid gap-8 py-10 lg:grid-cols-3">
                <div className="space-y-8 lg:col-span-2">
                    <Article title={t('public.description')} body={job.description} />
                    {job.requirements ? <Article title={t('admin.jobs.requirements')} body={job.requirements} /> : null}
                    {job.benefits ? <Article title={t('admin.jobs.benefits')} body={job.benefits} /> : null}
                </div>
                <aside className="surface-panel h-fit space-y-4 p-6">
                    <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{t('public.about_company')}</h2>
                    <div className="flex items-center gap-3">
                        {job.company.logo_url ? (
                            <img src={job.company.logo_url} alt="" className="size-14 rounded-xl object-cover" />
                        ) : (
                            <span className="inline-flex size-14 items-center justify-center rounded-xl bg-brand-100 text-brand-700"><Briefcase className="size-6" /></span>
                        )}
                        <div>
                            <Link href={`/companies/${job.company.id}`} className="font-semibold text-slate-900 hover:text-brand-700 dark:text-slate-100">
                                {job.company.name}
                            </Link>
                            {job.company.is_verified ? (
                                <p className="mt-1 inline-flex items-center gap-1 text-xs text-brand-700 dark:text-brand-400">
                                    <BadgeCheck className="size-3.5" /> {t('public.verified_employer')}
                                </p>
                            ) : null}
                        </div>
                    </div>
                    {job.company.industry ? <p className="text-sm text-muted">{job.company.industry}</p> : null}
                    {job.company.website ? (
                        <a href={job.company.website} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline dark:text-brand-400">
                            {t('profile.employer_website')} <ExternalLink className="size-3.5" />
                        </a>
                    ) : null}
                    <Link href={`/companies/${job.company.id}`}>
                        <Button variant="outline" className="w-full">{t('public.view_company_jobs')}</Button>
                    </Link>
                </aside>
            </section>
        </PublicLayout>
    );
}

function Article({ title, body }: { title: string; body: string }) {
    return (
        <div className="surface-panel p-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h2>
            <div className="prose prose-sm mt-4 max-w-none whitespace-pre-line text-slate-700 dark:prose-invert dark:text-slate-300">{body}</div>
        </div>
    );
}
