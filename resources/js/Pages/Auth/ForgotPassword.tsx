import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout';
import { Alert } from '@/Components/ui/Alert';
import { Button } from '@/Components/ui/Button';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';

export default function ForgotPassword({ status }: { status?: string }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({ email: '' });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/forgot-password');
    };

    return (
        <GuestLayout>
            <Head title={t('auth.forgot_title')} />
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h1 className="text-2xl font-semibold text-slate-900">
                    {t('auth.forgot_title')}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    {t('auth.forgot_body')}
                </p>

                {status ? (
                    <div className="mt-4">
                        <Alert tone="success">{status}</Alert>
                    </div>
                ) : null}

                <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
                    <FormField id="email" label={t('auth.email')} required error={errors.email}>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="username"
                            value={data.email}
                            invalid={Boolean(errors.email)}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                            autoFocus
                        />
                    </FormField>

                    <Button type="submit" className="w-full" size="lg" isLoading={processing}>
                        {t('auth.send_reset_link')}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
                        {t('auth.log_in')}
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
