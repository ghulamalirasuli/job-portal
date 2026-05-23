import { Head, useForm } from '@inertiajs/react';
import { type FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/Components/ui/Button';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';

interface Props {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: Props) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/reset-password', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('auth.reset_title')} />
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h1 className="text-2xl font-semibold text-slate-900">
                    {t('auth.reset_title')}
                </h1>

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
                        />
                    </FormField>

                    <FormField
                        id="password"
                        label={t('auth.password')}
                        required
                        error={errors.password}
                    >
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={data.password}
                            invalid={Boolean(errors.password)}
                            onChange={(e) => setData('password', e.target.value)}
                            required
                            autoFocus
                        />
                    </FormField>

                    <FormField
                        id="password_confirmation"
                        label={t('auth.password_confirmation')}
                        required
                        error={errors.password_confirmation}
                    >
                        <Input
                            id="password_confirmation"
                            name="password_confirmation"
                            type="password"
                            autoComplete="new-password"
                            value={data.password_confirmation}
                            invalid={Boolean(errors.password_confirmation)}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            required
                        />
                    </FormField>

                    <Button type="submit" className="w-full" size="lg" isLoading={processing}>
                        {t('auth.reset_submit')}
                    </Button>
                </form>
            </div>
        </GuestLayout>
    );
}
