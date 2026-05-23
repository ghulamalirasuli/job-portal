import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Edit,
    Filter,
    Plus,
    Search,
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

interface EmployeeRow {
    id: number;
    name: string;
    email: string;
    headline: string | null;
    location: string | null;
    country: string | null;
    visibility: string;
    is_active: boolean;
    avatar_url: string | null;
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
    employees: Paginated<EmployeeRow>;
    filters: { q: string; status: string };
}

const selectClass =
    'block h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

export default function EmployeesIndex() {
    const { t } = useTranslation();
    const { employees, filters } = usePage<Props>().props;
    const [q, setQ] = useState(filters.q ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const applyFilters = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        router.get(
            '/admin/employees',
            { q: q || undefined, status: status || undefined },
            { preserveState: true, replace: true },
        );
    };

    const resetFilters = () => {
        setQ('');
        setStatus('');
        router.get('/admin/employees', {}, { preserveState: true, replace: true });
    };

    const toggleActive = (row: EmployeeRow) => {
        const message = row.is_active
            ? t('admin.employees.confirm_deactivate')
            : t('admin.employees.confirm_activate');
        if (!window.confirm(message)) return;
        router.patch(`/admin/employees/${row.id}/toggle-active`, {}, { preserveScroll: true });
    };

    const softDelete = (row: EmployeeRow) => {
        if (!window.confirm(t('admin.employees.soft_delete_body'))) return;
        router.delete(`/admin/employees/${row.id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout
            title={t('admin.employees.title')}
            subtitle={t('admin.employees.subtitle')}
            breadcrumbs={[
                { label: t('admin.nav.dashboard'), href: '/admin' },
                { label: t('admin.nav.employees') },
            ]}
            actions={
                <Link href="/admin/employees/create">
                    <Button size="md">
                        <Plus className="size-4" /> {t('admin.employees.add')}
                    </Button>
                </Link>
            }
        >
            <Head title={t('admin.employees.title')} />

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
                            placeholder={t('admin.employees.search_placeholder')}
                            className="pl-9"
                        />
                    </div>
                    <select value={status} onChange={(e) => setStatus(e.target.value)} className={selectClass}>
                        <option value="">
                            {t('admin.employees.filter_status')}: {t('common.all')}
                        </option>
                        <option value="active">{t('common.active')}</option>
                        <option value="inactive">{t('common.inactive')}</option>
                        <option value="public">{t('profile.seeker_visibility_public')}</option>
                        <option value="private">{t('profile.seeker_visibility_private')}</option>
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
                                <th className="px-5 py-3">{t('admin.employees.headers.employee')}</th>
                                <th className="px-5 py-3">{t('admin.employees.headers.headline')}</th>
                                <th className="px-5 py-3">{t('admin.employees.headers.location')}</th>
                                <th className="px-5 py-3">{t('admin.employees.headers.visibility')}</th>
                                <th className="px-5 py-3">{t('admin.employees.headers.status')}</th>
                                <th className="px-5 py-3">{t('admin.employees.headers.registered')}</th>
                                <th className="px-5 py-3 text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-default">
                            {employees.data.map((row) => (
                                <tr key={row.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                    <td className="px-5 py-3">
                                        <div className="flex items-center gap-3">
                                            <Avatar name={row.name} src={row.avatar_url ?? undefined} size="sm" />
                                            <div>
                                                <p className="font-medium text-slate-900 dark:text-slate-100">{row.name}</p>
                                                <p className="text-xs text-muted">{row.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3 text-slate-700 dark:text-slate-300">{row.headline ?? '—'}</td>
                                    <td className="px-5 py-3 text-muted">
                                        {[row.location, row.country].filter(Boolean).join(', ') || '—'}
                                    </td>
                                    <td className="px-5 py-3">
                                        <Badge tone={row.visibility === 'public' ? 'brand' : 'default'}>
                                            {row.visibility}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3">
                                        <button type="button" onClick={() => toggleActive(row)} className="inline-flex items-center gap-2 text-xs font-medium">
                                            <span className={cn('relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors', row.is_active ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600')}>
                                                <span className={cn('inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform', row.is_active ? 'translate-x-4' : 'translate-x-0.5')} />
                                            </span>
                                            <span className={cn('inline-flex items-center gap-1', row.is_active ? 'text-emerald-700 dark:text-emerald-400' : 'text-muted')}>
                                                {row.is_active ? (
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
                                    </td>
                                    <td className="px-5 py-3 text-muted">
                                        {row.created_at ? new Date(row.created_at).toLocaleDateString() : '—'}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/employees/${row.id}/edit`}
                                                className="inline-flex size-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                                                title={t('common.edit')}
                                            >
                                                <Edit className="size-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => softDelete(row)}
                                                className="inline-flex size-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                                                title={t('admin.employees.soft_delete_title')}
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {employees.data.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-5 py-12 text-center text-muted">
                                        {t('admin.employees.no_employees')}
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                {employees.last_page > 1 ? (
                    <div className="flex items-center justify-between border-t border-default px-5 py-3 text-sm text-muted">
                        <span>
                            {employees.total} total · Page {employees.current_page} / {employees.last_page}
                        </span>
                        <div className="flex gap-1">
                            {employees.links.map((link, i) => (
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
