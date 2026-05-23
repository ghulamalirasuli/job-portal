import { Head, Link, usePage } from '@inertiajs/react';
import { ArrowLeft, BadgeCheck, Briefcase, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/Layouts/PublicLayout';
import { JobCard, type JobCardData } from '@/Components/jobs/JobCard';
import type { PageProps } from '@/types';

interface Props extends PageProps {
    company: {
        id: number;
        company_name: string;
        industry: string | null;
        country: string | null;
        company_size: string | null;
        logo_url: string | null;
        description: string | null;
        website: string | null;
        is_verified: boolean;
    };
    jobs: JobCardData[];
}

export default function CompanyShow() {
    const { t } = useTranslation();
    const { company, jobs } = usePage<Props>().props;

    return (
        <PublicLayout>
            <Head title={company.company_name} />
            <section className="border-b border-default bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950">
                <div className="container-page py-10">
                    <Link href="/companies" className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline dark:text-brand-400">
                        <ArrowLeft className="size-4" /> {t('public.back_to_companies')}
                    </Link>
                    <div className="mt-6 flex items-start gap-5">
                        {company.logo_url ? (
                            <img src={company.logo_url} alt="" className="size-20 rounded-2xl object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                        ) : (
                            <span className="inline-flex size-20 items-center justify-center rounded-2xl bg-brand-100 text-brand-700"><Briefcase className="size-8" /></span>
                        )}
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">{company.company_name}</h1>
                            <p className="mt-1 text-muted">{[company.industry, company.country, company.company_size].filter(Boolean).join(' · ')}</p>
                            {company.is_verified ? (
                                <p className="mt-2 inline-flex items-center gap-1 text-sm text-brand-700 dark:text-brand-400"><BadgeCheck className="size-4" />{t('public.verified_employer')}</p>
                            ) : null}
                            {company.website ? (
                                <a href={company.website} target="_blank" rel="noreferrer" className="mt-2 inline-flex items-center gap-1 text-sm text-brand-700 hover:underline dark:text-brand-400">
                                    {company.website} <ExternalLink className="size-3.5" />
                                </a>
                            ) : null}
                        </div>
                    </div>
                    {company.description ? <p className="mt-6 max-w-3xl whitespace-pre-line text-slate-700 dark:text-slate-300">{company.description}</p> : null}
                </div>
            </section>
            <section className="container-page py-10">
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t('public.open_positions')}</h2>
                {jobs.length > 0 ? (
                    <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {jobs.map((job) => <JobCard key={job.id} job={job} />)}
                    </div>
                ) : (
                    <p className="mt-4 text-muted">{t('public.no_open_roles')}</p>
                )}
            </section>
        </PublicLayout>
    );
}
