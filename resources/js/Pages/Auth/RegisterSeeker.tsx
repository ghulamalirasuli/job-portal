import { Head, Link, useForm } from '@inertiajs/react';
import { type FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/Components/ui/Button';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';

export default function RegisterSeeker() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        terms: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register/seeker', {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <GuestLayout>
            <Head title={t('auth.register_as_seeker')} />
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <div className="mb-1 text-xs font-medium uppercase tracking-wider text-brand-600">
                    {t('auth.register_as_seeker')}
                </div>
                <h1 className="text-2xl font-semibold text-slate-900">
                    {t('auth.register_title')}
                </h1>

                <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
                    <FormField id="name" label={t('auth.name')} required error={errors.name}>
                        <Input
                            id="name"
                            name="name"
                            autoComplete="name"
                            value={data.name}
                            invalid={Boolean(errors.name)}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                            autoFocus
                        />
                    </FormField>

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

                    <FormField id="password" label={t('auth.password')} required error={errors.password}>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="new-password"
                            value={data.password}
                            invalid={Boolean(errors.password)}
                            onChange={(e) => setData('password', e.target.value)}
                            required
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

                    <label className="flex items-start gap-2 text-sm text-slate-600">
                        <input
                            type="checkbox"
                            name="terms"
                            checked={data.terms}
                            onChange={(e) => setData('terms', e.target.checked)}
                            className="mt-0.5 size-4 rounded border-slate-300 text-brand-600 focus:ring-brand-500"
                        />
                        <span>
                            I agree to the{' '}
                            <Link href="/terms" className="text-brand-600 hover:text-brand-700">
                                Terms
                            </Link>{' '}
                            and{' '}
                            <Link href="/privacy" className="text-brand-600 hover:text-brand-700">
                                Privacy Policy
                            </Link>
                            .
                        </span>
                    </label>
                    {errors.terms ? (
                        <p className="text-xs text-red-600">{errors.terms}</p>
                    ) : null}

                    <Button type="submit" className="w-full" size="lg" isLoading={processing}>
                        {t('auth.submit_register')}
                    </Button>
                </form>

                <p className="mt-6 text-center text-sm text-slate-500">
                    {t('auth.have_account')}{' '}
                    <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
                        {t('auth.log_in')}
                    </Link>
                </p>
            </div>
        </GuestLayout>
    );
}
