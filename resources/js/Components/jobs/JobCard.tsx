import { Link } from '@inertiajs/react';
import { BadgeCheck, Briefcase, Clock, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Badge } from '@/Components/ui/Badge';
import { cn } from '@/lib/utils';

export interface JobCardData {
    id: number;
    title: string;
    slug: string;
    location: string | null;
    country: string | null;
    remote_label: string;
    employment_label: string;
    salary_label: string | null;
    expires_at: string | null;
    published_at: string | null;
    company_name: string;
    company_logo: string | null;
    company_verified: boolean;
    industry: string | null;
}

interface Props {
    job: JobCardData;
    className?: string;
}

export function JobCard({ job, className }: Props) {
    const { t } = useTranslation();
    const location = [job.location, job.country].filter(Boolean).join(', ');

    return (
        <Link
            href={`/jobs/${job.slug}`}
            className={cn(
                'group flex flex-col rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition-all hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900 dark:ring-slate-700',
                className,
            )}
        >
            <div className="flex items-start gap-3">
                {job.company_logo ? (
                    <img
                        src={job.company_logo}
                        alt=""
                        className="size-12 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                    />
                ) : (
                    <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                        <Briefcase className="size-5" />
                    </span>
                )}
                <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate text-sm font-medium text-slate-600 dark:text-slate-400">
                            {job.company_name}
                        </p>
                        {job.company_verified ? (
                            <Badge tone="brand" className="gap-1">
                                <BadgeCheck className="size-3" />
                                {t('public.verified')}
                            </Badge>
                        ) : null}
                    </div>
                    <h3 className="mt-1 text-lg font-semibold text-slate-900 group-hover:text-brand-700 dark:text-slate-100 dark:group-hover:text-brand-400">
                        {job.title}
                    </h3>
                </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {location ? (
                    <span className="inline-flex items-center gap-1 text-xs text-muted">
                        <MapPin className="size-3.5" />
                        {location}
                    </span>
                ) : null}
                <Badge tone="default">{job.remote_label}</Badge>
                <Badge tone="default">{job.employment_label}</Badge>
            </div>

            {job.salary_label ? (
                <p className="mt-3 text-sm font-medium text-slate-800 dark:text-slate-200">
                    {job.salary_label}
                </p>
            ) : null}

            <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted">
                {job.industry ? <span>{job.industry}</span> : <span />}
                {job.expires_at ? (
                    <span className="inline-flex items-center gap-1">
                        <Clock className="size-3.5" />
                        {t('public.closes')} {new Date(job.expires_at).toLocaleDateString()}
                    </span>
                ) : null}
            </div>
        </Link>
    );
}
