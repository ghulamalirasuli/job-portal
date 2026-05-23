import { Head, Link, useForm, usePage, router } from '@inertiajs/react';
import { type FormEventHandler, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/Layouts/AppLayout';
import { Alert } from '@/Components/ui/Alert';
import { Button } from '@/Components/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';
import { SUPPORTED_LOCALES } from '@/lib/i18n';
import type { PageProps } from '@/types';

interface EditProps extends PageProps {
    mustVerifyEmail: boolean;
    status?: string;
}

export default function Edit() {
    const { t } = useTranslation();
    const { auth, mustVerifyEmail, status } = usePage<EditProps>().props;
    const user = auth.user;

    return (
        <AppLayout
            header={
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{t('profile.title')}</h1>
                </div>
            }
        >
            <Head title={t('profile.title')} />

            {mustVerifyEmail ? (
                <div className="mb-4">
                    <Alert tone="warning">
                        {t('auth.verify_body', { email: user?.email ?? '' })}{' '}
                        <Link
                            href="/email/verification-notification"
                            method="post"
                            as="button"
                            className="font-medium underline"
                        >
                            {t('auth.verify_resend')}
                        </Link>
                    </Alert>
                </div>
            ) : null}

            {status === 'verification-link-sent' ? (
                <div className="mb-4">
                    <Alert tone="success">{t('auth.verify_sent')}</Alert>
                </div>
            ) : null}

            <div className="space-y-6">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('profile.account')}</CardTitle>
                        <CardDescription>{t('profile.account_info')}</CardDescription>
                    </CardHeader>
                    <UpdateAccountForm />
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('profile.update_password')}</CardTitle>
                        <CardDescription>
                            {t('profile.update_password_body')}
                        </CardDescription>
                    </CardHeader>
                    <UpdatePasswordForm />
                </Card>

                <Card className="ring-red-200">
                    <CardHeader>
                        <CardTitle>{t('profile.delete_title')}</CardTitle>
                        <CardDescription>{t('profile.delete_body')}</CardDescription>
                    </CardHeader>
                    <DeleteAccountForm />
                </Card>
            </div>
        </AppLayout>
    );
}

function UpdateAccountForm() {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const { data, setData, patch, processing, errors, recentlySuccessful } = useForm({
        name: auth.user?.name ?? '',
        email: auth.user?.email ?? '',
        locale: auth.user?.locale ?? 'en',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch('/profile');
    };

    return (
        <form onSubmit={submit} className="space-y-4" noValidate>
            <FormField id="name" label={t('auth.name')} required error={errors.name}>
                <Input
                    id="name"
                    value={data.name}
                    invalid={Boolean(errors.name)}
                    onChange={(e) => setData('name', e.target.value)}
                />
            </FormField>
            <FormField id="email" label={t('auth.email')} required error={errors.email}>
                <Input
                    id="email"
                    type="email"
                    value={data.email}
                    invalid={Boolean(errors.email)}
                    onChange={(e) => setData('email', e.target.value)}
                />
            </FormField>
            <FormField id="locale" label={t('profile.language')} error={errors.locale}>
                <select
                    id="locale"
                    value={data.locale}
                    onChange={(e) => setData('locale', e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                >
                    {SUPPORTED_LOCALES.map((l) => (
                        <option key={l.code} value={l.code}>
                            {l.label}
                        </option>
                    ))}
                </select>
            </FormField>
            <div className="flex items-center gap-3">
                <Button type="submit" isLoading={processing}>
                    {t('common.save')}
                </Button>
                {recentlySuccessful ? (
                    <span className="text-sm text-green-600">{t('profile.saved')}</span>
                ) : null}
            </div>
        </form>
    );
}

function UpdatePasswordForm() {
    const { t } = useTranslation();
    const { data, setData, put, processing, errors, reset, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put('/password', {
            preserveScroll: true,
            onSuccess: () => reset(),
        });
    };

    return (
        <form onSubmit={submit} className="space-y-4" noValidate>
            <FormField
                id="current_password"
                label={t('profile.current_password')}
                required
                error={errors.current_password}
            >
                <Input
                    id="current_password"
                    type="password"
                    autoComplete="current-password"
                    value={data.current_password}
                    invalid={Boolean(errors.current_password)}
                    onChange={(e) => setData('current_password', e.target.value)}
                />
            </FormField>
            <FormField
                id="password"
                label={t('profile.new_password')}
                required
                error={errors.password}
            >
                <Input
                    id="password"
                    type="password"
                    autoComplete="new-password"
                    value={data.password}
                    invalid={Boolean(errors.password)}
                    onChange={(e) => setData('password', e.target.value)}
                />
            </FormField>
            <FormField
                id="password_confirmation"
                label={t('profile.confirm_new_password')}
                required
                error={errors.password_confirmation}
            >
                <Input
                    id="password_confirmation"
                    type="password"
                    autoComplete="new-password"
                    value={data.password_confirmation}
                    invalid={Boolean(errors.password_confirmation)}
                    onChange={(e) => setData('password_confirmation', e.target.value)}
                />
            </FormField>
            <div className="flex items-center gap-3">
                <Button type="submit" isLoading={processing}>
                    {t('common.save')}
                </Button>
                {recentlySuccessful ? (
                    <span className="text-sm text-green-600">{t('profile.saved')}</span>
                ) : null}
            </div>
        </form>
    );
}

function DeleteAccountForm() {
    const { t } = useTranslation();
    const [confirming, setConfirming] = useState(false);
    const { data, setData, processing, errors, reset } = useForm({
        password: '',
        confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        router.delete('/profile', {
            data,
            preserveScroll: true,
            onError: () => {
                /* errors will surface via shared props */
            },
            onFinish: () => reset('password', 'confirmation'),
        });
    };

    if (!confirming) {
        return (
            <div>
                <Button variant="danger" onClick={() => setConfirming(true)}>
                    {t('profile.delete_button')}
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={submit} className="space-y-4" noValidate>
            <FormField
                id="delete_password"
                label={t('auth.password')}
                required
                error={errors.password}
            >
                <Input
                    id="delete_password"
                    type="password"
                    autoComplete="current-password"
                    value={data.password}
                    invalid={Boolean(errors.password)}
                    onChange={(e) => setData('password', e.target.value)}
                />
            </FormField>
            <FormField
                id="confirmation"
                label={t('profile.delete_confirm_label')}
                required
                error={errors.confirmation}
            >
                <Input
                    id="confirmation"
                    value={data.confirmation}
                    invalid={Boolean(errors.confirmation)}
                    onChange={(e) => setData('confirmation', e.target.value)}
                    placeholder={t('profile.delete_confirm_phrase')}
                />
            </FormField>
            <div className="flex items-center gap-2">
                <Button type="submit" variant="danger" isLoading={processing}>
                    {t('profile.delete_button')}
                </Button>
                <Button type="button" variant="outline" onClick={() => setConfirming(false)}>
                    {t('common.cancel')}
                </Button>
            </div>
        </form>
    );
}
