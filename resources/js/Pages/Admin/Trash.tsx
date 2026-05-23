import { Head, router, usePage } from '@inertiajs/react';
import { RotateCcw, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';

interface TrashRow {
    id: number;
    name: string;
    email: string;
    role: string;
    deleted_at: string | null;
}

interface Paginated<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface TrashProps extends PageProps {
    users: Paginated<TrashRow>;
}

const ROLE_TONE: Record<string, 'brand' | 'warning' | 'default'> = {
    admin: 'brand',
    employer: 'warning',
    job_seeker: 'default',
};

export default function AdminTrash() {
    const { t } = useTranslation();
    const { users } = usePage<TrashProps>().props;

    const restore = (id: number) => {
        if (!window.confirm(t('admin.trash.restore_confirm'))) return;
        router.post(`/admin/trash/${id}/restore`, {}, { preserveScroll: true });
    };

    const forceDelete = (id: number) => {
        if (!window.confirm(t('admin.trash.force_delete_body'))) return;
        router.delete(`/admin/trash/${id}`, { preserveScroll: true });
    };

    return (
        <AdminLayout
            title={t('admin.trash.title')}
            subtitle={t('admin.trash.subtitle')}
            breadcrumbs={[
                { label: t('admin.nav.dashboard'), href: '/admin' },
                { label: t('admin.nav.trash') },
            ]}
        >
            <Head title={t('admin.trash.title')} />

            <div className="rounded-xl bg-white shadow-sm ring-1 ring-slate-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-100 text-sm">
                        <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                            <tr>
                                <th className="px-5 py-3">{t('admin.users.headers.user')}</th>
                                <th className="px-5 py-3">{t('admin.users.headers.role')}</th>
                                <th className="px-5 py-3">{t('admin.trash.deleted_at')}</th>
                                <th className="px-5 py-3 text-right">{t('common.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {users.data.map((u) => (
                                <tr key={u.id} className="hover:bg-slate-50">
                                    <td className="px-5 py-3">
                                        <div>
                                            <p className="font-medium text-slate-900">{u.name}</p>
                                            <p className="text-xs text-slate-500">{u.email}</p>
                                        </div>
                                    </td>
                                    <td className="px-5 py-3">
                                        <Badge tone={ROLE_TONE[u.role] ?? 'default'}>
                                            {u.role.replace('_', ' ')}
                                        </Badge>
                                    </td>
                                    <td className="px-5 py-3 text-slate-500">
                                        {u.deleted_at
                                            ? new Date(u.deleted_at).toLocaleString()
                                            : '—'}
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => restore(u.id)}
                                            >
                                                <RotateCcw className="size-4" />
                                                {t('common.restore')}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="danger"
                                                onClick={() => forceDelete(u.id)}
                                            >
                                                <Trash2 className="size-4" />
                                                {t('common.delete_forever')}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {users.data.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-5 py-12 text-center text-slate-500">
                                        {t('admin.trash.empty')}
                                    </td>
                                </tr>
                            ) : null}
                        </tbody>
                    </table>
                </div>

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
