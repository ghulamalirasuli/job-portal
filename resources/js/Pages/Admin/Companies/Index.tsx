import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Building2,
    CheckCircle2,
    Edit,
    Filter,
    Plus,
    Search,
    ShieldCheck,
    Trash2,
    UserMinus,
    X,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Avatar } from '@/Components/ui/Avatar';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';

interface CompanyRow {
    id: number;
    company_name: string;
    industry: string | null;
    country: string | null;
    logo_url: string | null;
    is_verified: boolean;
    is_active: boolean;
    contact_name: string;
    contact_email: string;
    jobs_count: number;
    created_at: string | null;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Props extends PageProps {
    companies: Paginated<CompanyRow>;
    filters: { q: string; status: string };
}

const selectClass =
    'block h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

export default function CompaniesIndex() {
    const { t } = useTranslation();
    const { companies, filters } = usePage<Props>().props;
    const [q, setQ] = useState(filters.q ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const applyFilters = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        router.get(
            '/admin/companies',
            { q: q || undefined, status: status || undefined },
            { preserveState: true, replace: true },
        );
    };

    const resetFilters = () => {
        setQ('');
        setStatus('');
        router.get('/admin/companies', {}, { preserveState: true, replace: true });
    };

    const toggleActive = (row: CompanyRow) => {
        const message = row.is_active
            ? t('admin.companies.confirm_deactivate')
            : t('admin.companies.confirm_activate');
        if (!window.confirm(message)) return;
        router.patch(`/admin/companies/${row.id}/toggle-active`, {}, { preserveScroll: true });
    };

    const toggleVerified = (row: CompanyRow) => {
        router.patch(`/admin/companies/${row.id}/toggle-verified`, {}, { preserveScroll: true });
    };

    const softDelete = (row: CompanyRow) => {
        if (!window.confirm(t('admin.companies.soft_delete_body'))) return;
        router.delete(`/admin/companies/${row.id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout
            title={t('admin.companies.title')}
            subtitle={t('admin.companies.subtitle')}
            breadcrumbs={[
                { label: t('admin.nav.dashboard'), href: '/admin' },
                { label: t('admin.nav.companies') },
            ]}
            actions={
                <Link href="/admin/companies/create">
                    <Button size="md">
                        <Plus className="size-4" /> {t('admin.companies.add')}
                    </Button>
                </Link>
            }
        >
            <Head title={t('admin.companies.title')} />

            <div className="surface-panel overflow-hidden">
                <form
                    onSubmit={applyFilters}
                    className="flex flex-col gap-3 border-b border-default p-4 sm:flex-row sm:items-center"
                >
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder={t('admin.companies.search_placeholder')}
                            className="pl-9"
                        />
                    </div>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className={selectClass}
                    >
                        <option value="">
                            {t('admin.companies.filter_status')}: {t('common.all')}
                        </option>
                        <option value="active">{t('common.active')}</option>
                        <option value="inactive">{t('common.inactive')}</option>
                        <option value="verified">{t('admin.companies.verified')}</option>
                        <option value="unverified">{t('admin.companies.unverified')}</option>
                    </select>
                    <div className="flex gap-2">
                        <Button type="submit" size="md" variant="primary">
                            <Filter className="size-4" /> {t('common.filters')}
                        </Button>
                        {q || status ? (
                            <Button type="button" size="md" variant="outline" onClick={resetFilters}>
                                <X className="size-4" /> {t('common.reset')}
                            </Button>
                        ) : null}
                    </div>
                </form>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-default text-sm">
                        <thead className="surface-muted text-left text-xs font-medium uppercase tracking-wider text-muted">
                            <tr>
                                <th className="px-5 py-3">{t('admin.companies.headers.company')}</th>
                                <th className="px-5 py-3">{t('admin.companies.headers.contact')}</th>
                                <th className="px-5 py-3">{t('admin.companies.headers.jobs')}</th>
                                <th className="px-5 py-3">{t('admin.companies.headers.verified')}</th>
                                <th className="px-5 py-3">{t('admin.companies.headers.status')}</th>
                                <th className="px-5 py-3">{t('admin.companies.headers.registered')}</th>
                                <th className="px-5 py-3 text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-default">
                            {companies.data.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            {row.logo_url ? (
                                                <img
                                                    src={row.logo_url}
                                                    alt=""
                                                    className="size-10 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                                                />
                                            ) : (
                                                <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                                                    <Building2 className="size-5" />
                                                </span>
                                            )}
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-slate-100">
                                                    {row.company_name}
                                                </p>
                                                <p className="text-xs text-muted">
                                                    {[row.industry, row.country].filter(Boolean).join(' · ') || '—'}
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <p className="font-medium text-slate-900 dark:text-slate-100">
                                            {row.contact_name}
                                        </p>
                                        <p className="text-xs text-muted">{row.contact_email}</p>
                                    </td>
                                    <td className="px-5 py-3">
                                        <Badge tone="default">{row.jobs_count}</Badge>
                                    </td>
                                    <td className="px-5 py-3">
                                        <button
                                            type="button"
                                            onClick={() => toggleVerified(row)}
                                            className="inline-flex items-center gap-1 text-xs font-medium"
                                        >
                                            {row.is_verified ? (
                                                <Badge tone="brand">
                                                    <ShieldCheck className="size-3.5" />
                                                    {t('admin.companies.verified')}
                                                </Badge>
                                            ) : (
                                                <Badge tone="default">{t('admin.companies.unverified')}</Badge>
                                            )}
                                        </button>
                                    </td>
                                    <td className="px-5 py-3">
                                        <StatusToggle
                                            active={row.is_active}
                                            onToggle={() => toggleActive(row)}
                                        />
                                    </td>
                                    <td className="px-5 py-3 text-muted">
                                        {row.created_at
                                            ? new Date(row.created_at).toLocaleDateString()
                                            : '—'}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/companies/${row.id}/edit`}
                                                className="inline-flex size-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800"
                                                title={t('common.edit')}
                                            >
                                                <Edit className="size-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => softDelete(row)}
                                                className="inline-flex size-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                title={t('admin.companies.soft_delete_title')}
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {companies.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-muted">
                                        {t('admin.companies.no_companies')}
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                {companies.last_page > 1 ? (
                    <Pagination links={companies.links} total={companies.total} page={companies.current_page} lastPage={companies.last_page} />
                ) : null}
            </div>
        </AdminLayout>
    );
}

function StatusToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
    const { t } = useTranslation();
    return (
        <button type="button" onClick={onToggle} className="inline-flex items-center gap-2 text-xs font-medium">
            <span className={cn('relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors', active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600')}>
                <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', active ? 'translate-x-4' : 'translate-x-0.5')} />
            </span>
            <span className={cn('inline-flex items-center gap-1', active ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted')}>
                {active ? (
                    <>
                        <CheckCircle2 className="size-3.5" />
                        {t('common.active')}
                    </>
                ) : (
                    <>
                        <UserMinus className="size-3.5" />
                        {t('common.inactive')}
                    </>
                )}
            </span>
        </button>
    );
}

function Pagination({
    links,
    total,
    page,
    lastPage,
}: {
    links: Array<{ url: string | null; label: string; active: boolean }>;
    total: number;
    page: number;
    lastPage: number;
}) {
    return (
        <div className="flex items-center justify-between border-t border-default px-5 py-3 text-sm text-muted">
            <span>
                {total} total · Page {page} / {lastPage}
            </span>
            <div className="flex gap-1">
                {links.map((link, i) => (
                    <button
                        key={`${link.label}-${i}`}
                        type="button"
                        disabled={!link.url}
                        onClick={() =>
                            link.url &&
                            router.get(link.url, {}, { preserveState: true, preserveScroll: true })
                        }
                        className={cn(
                            'min-w-[2rem] rounded-md px-2 py-1 text-xs',
                            link.active ? 'bg-brand-600 text-white' : 'text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800',
                            !link.url && 'opacity-40',
                        )}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    );
}
