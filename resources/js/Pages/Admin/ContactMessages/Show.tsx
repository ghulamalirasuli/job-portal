import { Head, Link, router, usePage } from '@inertiajs/react';
import { ArrowLeft, Mail, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/Button';
import type { PageProps } from '@/types';

interface Props extends PageProps {
    message: {
        id: number;
        name: string;
        email: string;
        subject: string;
        message: string;
        status: string;
        ip_address: string | null;
        created_at: string | null;
        read_at: string | null;
    };
}

export default function ContactMessageShow() {
    const { t } = useTranslation();
    const { message } = usePage<Props>().props;

    const destroy = () => {
        if (!window.confirm(t('admin.contact.delete_confirm'))) return;
        router.delete(`/admin/contact-messages/${message.id}`);
    };

    return (
        <AdminLayout
            title={message.subject}
            subtitle={t('admin.contact.show_subtitle')}
            breadcrumbs={[
                { label: t('admin.nav.dashboard'), href: '/admin' },
                { label: t('admin.nav.contact'), href: '/admin/contact-messages' },
                { label: message.subject },
            ]}
            actions={
                <Button type="button" variant="outline" onClick={destroy}>
                    <Trash2 className="size-4" /> {t('common.delete')}
                </Button>
            }
        >
            <Head title={message.subject} />

            <div className="surface-panel max-w-3xl space-y-6 p-6">
                <Link href="/admin/contact-messages" className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline dark:text-brand-400">
                    <ArrowLeft className="size-4" /> {t('admin.contact.back')}
                </Link>
                <div>
                    <p className="text-sm text-muted">{t('admin.contact.headers.from')}</p>
                    <p className="font-semibold text-slate-900 dark:text-slate-100">{message.name}</p>
                    <a href={`mailto:${message.email}`} className="inline-flex items-center gap-1 text-sm text-brand-700 hover:underline dark:text-brand-400">
                        <Mail className="size-4" /> {message.email}
                    </a>
                </div>
                <div>
                    <p className="text-sm text-muted">{t('admin.contact.headers.received')}</p>
                    <p className="text-slate-800 dark:text-slate-200">{message.created_at ? new Date(message.created_at).toLocaleString() : '—'}</p>
                </div>
                <div>
                    <p className="text-sm text-muted">{t('contact.message')}</p>
                    <div className="mt-2 whitespace-pre-line rounded-lg bg-slate-50 p-4 text-slate-800 dark:bg-slate-800/50 dark:text-slate-200">{message.message}</div>
                </div>
            </div>
        </AdminLayout>
    );
}
