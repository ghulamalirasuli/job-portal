import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Check,
    Edit,
    Filter,
    Plus,
    Search,
    Trash2,
    X,
    XCircle,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';

interface JobRow {
    id: number;
    title: string;
    slug: string;
    company_name: string;
    company_id: number;
    location: string | null;
    country: string | null;
    remote_type: string;
    employment_type: string;
    status: string;
    status_label: string;
    is_active: boolean;
    payment_amount: string | null;
    payment_currency: string;
    payment_status: string;
    payment_status_label: string;
    payment_method: string | null;
    salary_label: string | null;
    expires_at: string | null;
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
    jobs: Paginated<JobRow>;
    filters: { q: string; status: string; payment_status: string };
    statuses: string[];
    paymentStatuses: string[];
}

const selectClass =
    'block h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

const STATUS_TONE: Record<string, 'brand' | 'warning' | 'default' | 'danger'> = {
    draft: 'default',
    pending_approval: 'warning',
    approved: 'brand',
    rejected: 'danger',
    closed: 'default',
};

const PAYMENT_TONE: Record<string, 'brand' | 'warning' | 'default' | 'danger'> = {
    unpaid: 'danger',
    pending: 'warning',
    paid: 'brand',
    refunded: 'default',
};

export default function JobsIndex() {
    const { t } = useTranslation();
    const { jobs, filters, statuses, paymentStatuses } = usePage<Props>().props;
    const [q, setQ] = useState(filters.q ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [paymentStatus, setPaymentStatus] = useState(filters.payment_status ?? '');

    const applyFilters = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        router.get(
            '/admin/jobs',
            {
                q: q || undefined,
                status: status || undefined,
                payment_status: paymentStatus || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const resetFilters = () => {
        setQ('');
        setStatus('');
        setPaymentStatus('');
        router.get('/admin/jobs', {}, { preserveState: true, replace: true });
    };

    const approve = (row: JobRow) => {
        if (!window.confirm(t('admin.jobs.confirm_approve'))) return;
        router.patch(`/admin/jobs/${row.id}/approve`, {}, { preserveScroll: true });
    };

    const reject = (row: JobRow) => {
        const reason = window.prompt(t('admin.jobs.reject_reason_prompt'));
        if (reason === null || reason.trim() === '') return;
        router.patch(`/admin/jobs/${row.id}/reject`, { rejection_reason: reason.trim() }, { preserveScroll: true });
    };

    const toggleActive = (row: JobRow) => {
        router.patch(`/admin/jobs/${row.id}/toggle-active`, {}, { preserveScroll: true });
    };

    const softDelete = (row: JobRow) => {
        if (!window.confirm(t('admin.jobs.soft_delete_body'))) return;
        router.delete(`/admin/jobs/${row.id}`, { preserveScroll: true });
    };

    const formatPayment = (row: JobRow) => {
        if (row.payment_amount === null) return '—';
        return `${Number(row.payment_amount).toLocaleString(undefined, { minimumFractionDigits: 2 })} ${row.payment_currency}`;
    };

    return (
        <AdminLayout
            title={t('admin.jobs.title')}
            subtitle={t('admin.jobs.subtitle')}
            breadcrumbs={[
                { label: t('admin.nav.dashboard'), href: '/admin' },
                { label: t('admin.nav.jobs') },
            ]}
            actions={
                <Link href="/admin/jobs/create">
                    <Button size="md">
                        <Plus className="size-4" /> {t('admin.jobs.add')}
                    </Button>
                </Link>
            }
        >
            <Head title={t('admin.jobs.title')} />

            <div className="surface-panel overflow-hidden">
                <form
                    onSubmit={applyFilters}
                    className="flex flex-col gap-3 border-b border-default p-4 lg:flex-row lg:items-center"
                >
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted" />
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder={t('admin.jobs.search_placeholder')}
                            className="pl-9"
                        />
                    </div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                        <option value="">{t('admin.jobs.filter_status')}: {t('common.all')}</option>
                        {statuses.map((s) => (
                            <option key={s} value={s}>
                                {s.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                    <select value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)} className={selectClass}>
                        <option value="">{t('admin.jobs.filter_payment')}: {t('common.all')}</option>
                        {paymentStatuses.map((s) => (
                            <option key={s} value={s}>
                                {s.replace(/_/g, ' ')}
                            </option>
                        ))}
                    </select>
                    <div className="flex gap-2">
                        <Button type="submit" size="md" variant="primary">
                            <Filter className="size-4" /> {t('common.filters')}
                        </Button>
                        {q || status || paymentStatus ? (
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
                                <th className="px-5 py-3">{t('admin.jobs.headers.job')}</th>
                                <th className="px-5 py-3">{t('admin.jobs.headers.company')}</th>
                                <th className="px-5 py-3">{t('admin.jobs.headers.payment')}</th>
                                <th className="px-5 py-3">{t('admin.jobs.headers.status')}</th>
                                <th className="px-5 py-3">{t('admin.jobs.headers.published')}</th>
                                <th className="px-5 py-3">{t('admin.jobs.headers.posted')}</th>
                                <th className="px-5 py-3 text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-default">
                            {jobs.data.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-5 py-3">
                                        <p className="font-medium text-slate-900 dark:text-slate-100">{row.title}</p>
                                        <p className="text-xs text-muted">
                                            {[row.location, row.country, row.remote_type.replace('_', ' ')].filter(Boolean).join(' · ')}
                                        </p>
                                        {row.salary_label ? (
                                            <p className="mt-1 text-xs text-slate-600 dark:text-slate-400">{row.salary_label}</p>
                                        ) : null}
                                    </td>
                                    <td className="px-5 py-3">
                                        <p className="font-medium text-slate-900 dark:text-slate-100">{row.company_name}</p>
                                    </td>
                                    <td className="px-5 py-3">
                                        <p className="font-medium text-slate-900 dark:text-slate-100">{formatPayment(row)}</p>
                                        <Badge tone={PAYMENT_TONE[row.payment_status] ?? 'default'} className="mt-1">
                                            {row.payment_status_label}
                                        </Badge>
                                        {row.payment_method ? (
                                            <p className="mt-1 text-xs text-muted">{row.payment_method}</p>
                                        ) : null}
                                    </td>
                                    <td className="px-5 py-3">
                                        <Badge tone={STATUS_TONE[row.status] ?? 'default'}>{row.status_label}</Badge>
                                        {row.status === 'approved' ? (
                                            <button
                                                type="button"
                                                onClick={() => toggleActive(row)}
                                                className="mt-2 block text-xs font-medium text-brand-700 hover:underline dark:text-brand-400"
                                            >
                                                {row.is_active ? t('admin.jobs.unpublish') : t('admin.jobs.publish')}
                                            </button>
                                        ) : null}
                                    </td>
                                    <td className="px-5 py-3">
                                        {row.is_active ? (
                                            <Badge tone="brand">{t('common.active')}</Badge>
                                        ) : (
                                            <Badge tone="default">{t('common.inactive')}</Badge>
                                        )}
                                    </td>
                                    <td className="px-5 py-3 text-muted">
                                        {row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            {row.status === 'pending_approval' ? (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() => approve(row)}
                                                        className="inline-flex size-9 items-center justify-center rounded-md text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                                        title={t('admin.jobs.approve')}
                                                    >
                                                        <Check className="size-4" />
                                                    </button>
                                                    <button
                                                        type="button"
                                                        onClick={() => reject(row)}
                                                        className="inline-flex size-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                        title={t('admin.jobs.reject')}
                                                    >
                                                        <XCircle className="size-4" />
                                                    </button>
                                                </>
                                            ) : null}
                                            <Link
                                                href={`/admin/jobs/${row.id}/edit`}
                                                className="inline-flex size-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                                title={t('common.edit')}
                                            >
                                                <Edit className="size-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => softDelete(row)}
                                                className="inline-flex size-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                title={t('admin.jobs.soft_delete_title')}
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {jobs.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-muted">
                                        {t('admin.jobs.no_jobs')}
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                {jobs.last_page > 1 ? (
                    <div className="flex items-center justify-between border-t border-default px-5 py-3 text-sm text-muted">
                        <span>
                            {jobs.total} total · Page {jobs.current_page} / {jobs.last_page}
                        </span>
                        <div className="flex gap-1">
                            {jobs.links.map((link, i) => (
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
                ) : null}
            </div>
        </AdminLayout>
    );
}
