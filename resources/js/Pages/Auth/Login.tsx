import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout';
import { Alert } from '@/Components/ui/Alert';
import { Button } from '@/Components/ui/Button';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';

interface Props {
    canResetPassword: boolean;
    status?: string;
}

export default function Login({ canResetPassword, status }: Props) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('auth.login_title')} />
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h1 className="text-2xl font-semibold text-slate-900">
                    {t('auth.login_title')}
                </h1>

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

                    <FormField id="password" label={t('auth.password')} required error={errors.password}>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            value={data.password}
                            invalid={Boolean(errors.password)}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                        />
                    </FormField>

                    <div className="flex items-center justify-between text-sm">
                        <label className="inline-flex items-center gap-2 text-slate-600">
                            <input
                                type="checkbox"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                                className="size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                            />
                            {t('auth.remember')}
                        </label>
                        {canResetPassword ? (
                            <Link
                                href="/forgot-password"
                                className="font-medium text-brand-600 hover:text-brand-700"
                            >
                                {t('auth.forgot')}
                            </Link>
                        ) : null}
                    </div>

                    <Button type="submit" className="w-full" size="lg" isLoading={processing}>
                        {t('auth.submit_login')}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    {t('auth.no_account')}{' '}
                    <Link href="/register" className="font-medium text-brand-600 hover:text-brand-700">
                        {t('auth.sign_up')}
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
