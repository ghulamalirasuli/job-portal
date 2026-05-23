import { Head, Link, router, usePage } from '@inertiajs/react';
import { type FormEvent, useState } from 'react';
import { BadgeCheck, Briefcase, Building2, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/Layouts/PublicLayout';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import type { PageProps } from '@/types';

interface CompanyRow {
    id: number;
    company_name: string;
    industry: string | null;
    country: string | null;
    company_size: string | null;
    logo_url: string | null;
    description: string | null;
    website: string | null;
    active_jobs_count: number;
    is_verified: boolean;
}

interface Paginated<T> {
    data: T[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
    last_page: number;
}

interface Props extends PageProps {
    companies: Paginated<CompanyRow>;
    filters: { q: string; country: string };
}

export default function CompaniesIndex() {
    const { t } = useTranslation();
    const { companies, filters } = usePage<Props>().props;
    const [q, setQ] = useState(filters.q ?? '');

    const applyFilters = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        router.get('/companies', { q: q || undefined }, { preserveState: true, replace: true });
    };

    return (
        <PublicLayout
            header={
                <section className="border-b border-default bg-gradient-to-b from-slate-900 to-slate-800 text-white">
                    <div className="container-page py-14">
                        <h1 className="text-3xl font-bold md:text-4xl">{t('public.companies_title')}</h1>
                        <p className="mt-3 max-w-2xl text-slate-300">{t('public.companies_subtitle')}</p>
                        <form onSubmit={applyFilters} className="mt-6 flex max-w-xl gap-2">
                            <div className="relative flex-1">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder={t('public.search_companies')} className="border-0 pl-9" />
                            </div>
                            <Button type="submit">{t('common.search')}</Button>
                        </form>
                    </div>
                </section>
            }
        >
            <Head title={t('nav.companies')} />
            <section className="container-page py-10">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {companies.data.map((c) => (
                        <Link
                            key={c.id}
                            href={`/companies/${c.id}`}
                            className="surface-panel group p-6 transition hover:-translate-y-0.5 hover:shadow-md"
                        >
                            <div className="flex items-start gap-4">
                                {c.logo_url ? (
                                    <img src={c.logo_url} alt="" className="size-14 rounded-xl object-cover" />
                                ) : (
                                    <span className="inline-flex size-14 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40">
                                        <Building2 className="size-6" />
                                    </span>
                                )}
                                <div className="min-w-0">
                                    <h2 className="truncate text-lg font-semibold group-hover:text-brand-700 dark:group-hover:text-brand-400">{c.company_name}</h2>
                                    <p className="text-sm text-muted">{[c.industry, c.country].filter(Boolean).join(' · ')}</p>
                                    {c.is_verified ? (
                                        <Badge tone="brand" className="mt-2 gap-1"><BadgeCheck className="size-3" />{t('public.verified')}</Badge>
                                    ) : null}
                                </div>
                            </div>
                            {c.description ? <p className="mt-4 line-clamp-2 text-sm text-muted">{c.description}</p> : null}
                            <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-700 dark:text-brand-400">
                                <Briefcase className="size-4" /> {t('public.open_roles', { count: c.active_jobs_count })}
                            </p>
                        </Link>
                    ))}
                </div>
            </section>
        </PublicLayout>
    );
}
