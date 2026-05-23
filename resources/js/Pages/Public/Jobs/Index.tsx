import { Head, router, usePage } from '@inertiajs/react';
import { type FormEvent, useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/Layouts/PublicLayout';
import { JobCard, type JobCardData } from '@/Components/jobs/JobCard';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import type { PageProps } from '@/types';

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props extends PageProps {
    jobs: Paginated<JobCardData>;
    filters: {
        q: string;
        location: string;
        country: string;
        remote_type: string;
        employment_type: string;
    };
    total_active: number;
}

const selectClass =
    'block h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

export default function JobsIndex() {
    const { t } = useTranslation();
    const { jobs, filters, total_active } = usePage<Props>().props;
    const [q, setQ] = useState(filters.q ?? '');
    const [location, setLocation] = useState(filters.location ?? '');
    const [remoteType, setRemoteType] = useState(filters.remote_type ?? '');

    const applyFilters = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        router.get(
            '/jobs',
            {
                q: q || undefined,
                location: location || undefined,
                remote_type: remoteType || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    return (
        <PublicLayout
            header={
                <section className="border-b border-default bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <div className="container-page py-12">
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 md:text-4xl">
                            {t('public.jobs_title')}
                        </h1>
                        <p className="mt-2 text-muted">
                            {t('public.jobs_subtitle', { count: total_active })}
                        </p>
                        <form onSubmit={applyFilters} className="mt-6 grid gap-2 md:grid-cols-[1fr_1fr_auto_auto]">
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('home.search_placeholder')} className="pl-9" />
                            </div>
                            <Input value={location} onChange={(e) => setLocation(e.target.value)} placeholder={t('home.location_placeholder')} />
                            <select value={remoteType} onChange={(e) => setRemoteType(e.target.value)} className={selectClass}>
                                <option value="">{t('public.all_work_types')}</option>
                                <option value="on_site">On-site</option>
                                <option value="hybrid">Hybrid</option>
                                <option value="remote">Remote</option>
                            </select>
                            <Button type="submit"><Filter className="size-4" /> {t('common.filters')}</Button>
                        </form>
                    </div>
                </section>
            }
        >
            <Head title={t('nav.jobs')} />
            <section className="container-page py-10">
                {jobs.data.length > 0 ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {jobs.data.map((job) => (
                            <JobCard key={job.id} job={job} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-2xl border border-dashed border-default py-16 text-center text-muted">
                        {t('public.no_jobs')}
                    </div>
                )}

                {jobs.last_page > 1 ? (
                    <div className="mt-8 flex justify-center gap-1">
                        {jobs.links.map((link, i) => (
                            <button
                                key={`${link.label}-${i}`}
                                type="button"
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url, {}, { preserveState: true })}
                                className={`min-w-[2rem] rounded-md px-2 py-1 text-xs ${link.active ? 'bg-brand-600 text-white' : 'text-muted hover:bg-slate-100 dark:hover:bg-slate-800'} ${!link.url ? 'opacity-40' : ''}`}
                                dangerouslySetInnerHTML={{ __html: link.label }}
                            />
                        ))}
                    </div>
                ) : null}
            </section>
        </PublicLayout>
    );
}
