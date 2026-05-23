import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { type FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout';
import { Alert } from '@/Components/ui/Alert';
import { Button } from '@/Components/ui/Button';
import type { PageProps } from '@/types';

export default function VerifyEmail({ status }: { status?: string }) {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const { post, processing } = useForm({});

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    return (
        <GuestLayout>
            <Head title={t('auth.verify_title')} />
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h1 className="text-2xl font-semibold text-slate-900">
                    {t('auth.verify_title')}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    {t('auth.verify_body', { email: auth.user?.email ?? '' })}
                </p>

                {status === 'verification-link-sent' ? (
                    <div className="mt-4">
                        <Alert tone="success">{t('auth.verify_sent')}</Alert>
                    </div>
                ) : null}

                <form onSubmit={submit} className="mt-6">
                    <Button type="submit" className="w-full" size="lg" isLoading={processing}>
                        {t('auth.verify_resend')}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    <Link
                        href="/logout"
                        method="post"
                        as="button"
                        className="font-medium text-brand-600 hover:text-brand-700"
                    >
                        {t('nav.logout')}
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
