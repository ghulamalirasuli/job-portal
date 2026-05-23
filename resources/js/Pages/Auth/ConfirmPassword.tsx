import { Head, useForm } from '@inertiajs/react';
import { type FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/Components/ui/Button';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';

export default function ConfirmPassword() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/confirm-password', {
            onFinish: () => reset('password'),
        });
    };

    return (
        <GuestLayout>
            <Head title="Confirm password" />
            <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200">
                <h1 className="text-xl font-semibold text-slate-900">
                    Confirm your password
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    This is a secure area of the application. Please confirm your password before continuing.
                </p>

                <form onSubmit={submit} className="mt-6 space-y-4" noValidate>
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
                            autoFocus
                        />
                    </FormField>

                    <Button type="submit" className="w-full" size="lg" isLoading={processing}>
                        Confirm
                    </Button>
                </form>
            </div>
        </GuestLayout>
    );
}
