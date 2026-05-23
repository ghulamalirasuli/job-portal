import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    CheckCircle2,
    Eye,
    Filter,
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

interface UserRow {
    id: number;
    name: string;
    email: string;
    role: string;
    is_active: boolean;
    email_verified: boolean;
    avatar_url: string | null;
    created_at: string | null;
    last_login_at: string | null;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface UsersIndexProps extends PageProps {
    users: Paginated<UserRow>;
    filters: {
        q: string;
        role: string;
        status: string;
    };
    roles: string[];
}

const ROLE_TONE: Record<string, 'brand' | 'warning' | 'default'> = {
    admin: 'brand',
    employer: 'warning',
    job_seeker: 'default',
};

export default function UsersIndex() {
    const { t } = useTranslation();
    const { users, filters, roles, auth } = usePage<UsersIndexProps>().props;
    const me = auth.user;

    const [q, setQ] = useState(filters.q ?? '');
    const [role, setRole] = useState(filters.role ?? '');
    const [status, setStatus] = useState(filters.status ?? '');

    const applyFilters = (e?: FormEvent<HTMLFormElement>) => {
        e?.preventDefault();
        router.get(
            '/admin/users',
            {
                q: q || undefined,
                role: role || undefined,
                status: status || undefined,
            },
            { preserveState: true, replace: true },
        );
    };

    const resetFilters = () => {
        setQ('');
        setRole('');
        setStatus('');
        router.get('/admin/users', {}, { preserveState: true, replace: true });
    };

    const toggleActive = (user: UserRow) => {
        const message = user.is_active
            ? t('admin.users.confirm_deactivate')
            : t('admin.users.confirm_activate');
        if (!window.confirm(message)) return;
        router.patch(
            `/admin/users/${user.id}/toggle-active`,
            {},
            { preserveScroll: true },
        );
    };

    const softDelete = (user: UserRow) => {
        if (!window.confirm(t('admin.users.soft_delete_body'))) return;
        router.delete(`/admin/users/${user.id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout
            title={t('admin.users.title')}
            subtitle={t('admin.users.subtitle')}
            breadcrumbs={[
                { label: t('admin.nav.dashboard'), href: '/admin' },
                { label: t('admin.nav.users') },
            ]}
        >
            <Head title={t('admin.users.title')} />

            <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                {/* Filter bar */}
                <form
                    onSubmit={applyFilters}
                    className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:flex-row sm:items-center"
                >
                    <div className="relative flex-1">
                        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                        <Input
                            value={q}
                            onChange={(e) => setQ(e.target.value)}
                            placeholder={t('admin.users.search_placeholder')}
                            className="pl-9"
                        />
                    </div>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="block h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">{t('admin.users.filter_role')}: {t('common.all')}</option>
                        {roles.map((r) => (
                            <option key={r} value={r}>
                                {r.replace('_', ' ')}
                            </option>
                        ))}
                    </select>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="block h-10 rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500"
                    >
                        <option value="">{t('admin.users.filter_status')}: {t('common.all')}</option>
                        <option value="active">{t('common.active')}</option>
                        <option value="inactive">{t('common.inactive')}</option>
                        <option value="unverified">Unverified</option>
                    </select>
                    <div className="flex gap-2">
                        <Button type="submit" size="md" variant="primary">
                            <Filter className="size-4" /> {t('common.filters')}
                        </Button>
                        {(q || role || status) ? (
                            <Button
                                type="button"
                                size="md"
                                variant="outline"
                                onClick={resetFilters}
                            >
                                <X className="size-4" /> {t('common.reset')}
                            </Button>
                        ) : null}
                    </div>
                </form>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-5 py-3">{t('admin.users.headers.user')}</th>
                                <th className="px-5 py-3">{t('admin.users.headers.role')}</th>
                                <th className="px-5 py-3">{t('admin.users.headers.status')}</th>
                                <th className="px-5 py-3">{t('admin.users.headers.registered')}</th>
                                <th className="px-5 py-3">{t('admin.users.headers.last_login')}</th>
                                <th className="px-5 py-3 text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 bg-white">
                            {users.data.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                    <td className="px-5 py-3">
                                        <Link
                                            href={`/admin/users/${u.id}`}
                                            className="flex items-center gap-3"
                                        >
                                            <Avatar
                                                name={u.name}
                                                src={u.avatar_url ?? undefined}
                                                size="sm"
                                            />
                                            <div>
                                                <p className="font-medium text-slate-900">
                                                    {u.name}
                                                </p>
                                                <p className="text-xs text-slate-500">
                                                    {u.email}
                                                </p>
                                            </div>
                                        </Link>
                                    </td>
                                    <td className="px-5 py-3">
                                        <Badge tone={ROLE_TONE[u.role] ?? 'default'}>
                                            {u.role.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3">
                                        <StatusToggle
                                            active={u.is_active}
                                            disabled={me?.id === u.id}
                                            onToggle={() => toggleActive(u)}
                                        />
                                    </td>
                                    <td className="px-5 py-3 text-slate-500">
                                        {u.created_at
                                            ? new Date(u.created_at).toLocaleDateString()
                                            : '—'}
                                    </td>
                                    <td className="px-5 py-3 text-slate-500">
                                        {u.last_login_at
                                            ? new Date(u.last_login_at).toLocaleString()
                                            : '—'}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Link
                                                href={`/admin/users/${u.id}`}
                                                className="inline-flex size-9 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                                                title={t('common.view')}
                                            >
                                                <Eye className="size-4" />
                                            </Link>
                                            <button
                                                type="button"
                                                onClick={() => softDelete(u)}
                                                disabled={me?.id === u.id}
                                                className="inline-flex size-9 items-center justify-center rounded-md text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                title={t('admin.users.soft_delete_title')}
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={6}
                                        className="px-5 py-12 text-center text-slate-500"
                                    >
                                        {t('admin.users.no_users')}
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {users.last_page > 1 ? (
                    <div className="flex items-center justify-between border-t border-slate-100 px-5 py-3 text-sm text-slate-600">
                        <span>
                            {users.total} total · Page {users.current_page} /{' '}
                            {users.last_page}
                        </span>
                        <div className="flex gap-1">
                            {users.links.map((link, i) => (
                                <button
                                    key={`${link.label}-${i}`}
                                    type="button"
                                    disabled={!link.url}
                                    onClick={() =>
                                        link.url &&
                                        router.get(
                                            link.url,
                                            {},
                                            { preserveState: true, preserveScroll: true },
                                        )
                                    }
                                    className={cn(
                                        'min-w-[2rem] rounded-md px-2 py-1 text-xs',
                                        link.active
                                            ? 'bg-brand-600 text-white'
                                            : 'text-slate-700 hover:bg-slate-100',
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

function StatusToggle({
    active,
    disabled,
    onToggle,
}: {
    active: boolean;
    disabled: boolean;
    onToggle: () => void;
}) {
    const { t } = useTranslation();
    return (
        <button
            type="button"
            disabled={disabled}
            onClick={onToggle}
            className={cn(
                'group inline-flex items-center gap-2 rounded-full px-1 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            )}
            title={
                disabled
                    ? 'You cannot deactivate your own account'
                    : active
                      ? t('common.deactivate')
                      : t('common.activate')
            }
        >
            <span
                className={cn(
                    'relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors',
                    active ? 'bg-emerald-500' : 'bg-slate-300',
                )}
            >
                <span
                    className={cn(
                        'inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform',
                        active ? 'translate-x-4' : 'translate-x-0.5',
                    )}
                />
            </span>
            <span
                className={cn(
                    'inline-flex items-center gap-1',
                    active ? 'text-emerald-700' : 'text-slate-500',
                )}
            >
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

