import { Head, Link, router, usePage } from '@inertiajs/react';
import { Mail, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Badge } from '@/Components/ui/Badge';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';

interface MessageRow {
    id: number;
    name: string;
    email: string;
    subject: string;
    message: string;
    status: string;
    is_unread: boolean;
    created_at: string | null;
}

interface Props extends PageProps {
    messages: {
        data: MessageRow[];
        links: Array<{ url: string | null; label: string; active: boolean }>;
        last_page: number;
    };
    filters: { status: string };
    counts: { new: number; total: number };
}

export default function ContactMessagesIndex() {
    const { t } = useTranslation();
    const { messages, filters, counts } = usePage<Props>().props;

    const setFilter = (status: string) => {
        router.get('/admin/contact-messages', { status: status === 'all' ? undefined : status }, { preserveState: true, replace: true });
    };

    return (
        <AdminLayout
            title={t('admin.contact.title')}
            subtitle={t('admin.contact.subtitle')}
            breadcrumbs={[
                { label: t('admin.nav.dashboard'), href: '/admin' },
                { label: t('admin.nav.contact') },
            ]}
        >
            <Head title={t('admin.contact.title')} />

            <div className="mb-4 flex flex-wrap gap-2">
                {(['all', 'new', 'read'] as const).map((status) => (
                    <button
                        key={status}
                        type="button"
                        onClick={() => setFilter(status)}
                        className={cn(
                            'rounded-full px-4 py-2 text-sm font-medium',
                            (filters.status || 'all') === status
                                ? 'bg-brand-600 text-white'
                                : 'bg-white text-slate-700 ring-1 ring-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:ring-slate-700',
                        )}
                    >
                        {status === 'all' ? t('common.all') : status === 'new' ? t('admin.contact.new') : t('admin.contact.read')}
                        {status === 'new' ? ` (${counts.new})` : status === 'all' ? ` (${counts.total})` : ''}
                    </button>
                ))}
            </div>

            <div className="surface-panel overflow-hidden">
                <table className="min-w-full divide-y divide-default text-sm">
                    <thead className="surface-muted text-left text-xs font-medium uppercase tracking-wider text-muted">
                        <tr>
                            <th className="px-5 py-3">{t('admin.contact.headers.from')}</th>
                            <th className="px-5 py-3">{t('admin.contact.headers.subject')}</th>
                            <th className="px-5 py-3">{t('admin.contact.headers.status')}</th>
                            <th className="px-5 py-3">{t('admin.contact.headers.received')}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-default">
                        {messages.data.map((m) => (
                            <tr key={m.id} className={cn('hover:bg-slate-50 dark:hover:bg-slate-800/50', m.is_unread && 'bg-brand-50/40 dark:bg-brand-950/20')}>
                                <td className="px-5 py-3">
                                    <Link href={`/admin/contact-messages/${m.id}`} className="block">
                                        <p className="font-medium text-slate-900 dark:text-slate-100">{m.name}</p>
                                        <p className="text-xs text-muted">{m.email}</p>
                                    </Link>
                                </td>
                                <td className="px-5 py-3">
                                    <Link href={`/admin/contact-messages/${m.id}`} className="font-medium text-slate-800 dark:text-slate-200">{m.subject}</Link>
                                    <p className="mt-1 line-clamp-1 text-xs text-muted">{m.message}</p>
                                </td>
                                <td className="px-5 py-3">
                                    <Badge tone={m.is_unread ? 'warning' : 'default'}>{m.is_unread ? t('admin.contact.new') : t('admin.contact.read')}</Badge>
                                </td>
                                <td className="px-5 py-3 text-muted">{m.created_at ? new Date(m.created_at).toLocaleString() : '—'}</td>
                            </tr>
                        ))}
                        {messages.data.length === 0 ? (
                            <tr><td colSpan={4} className="px-5 py-12 text-center text-muted">{t('admin.contact.empty')}</td></tr>
                        ) : null}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}
