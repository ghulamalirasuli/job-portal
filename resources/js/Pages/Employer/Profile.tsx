import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEventHandler } from 'react';
import { useTranslation } from 'react-i18next';
import AppLayout from '@/Layouts/AppLayout';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/Components/ui/Card';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';
import type { PageProps } from '@/types';

interface EmployerProfileProps extends PageProps {
    profile: {
        company_name: string;
        company_size: string | null;
        industry: string | null;
        website: string | null;
        vat_number: string | null;
        country: string | null;
        description: string | null;
        logo_url: string | null;
        is_verified: boolean;
    };
}

const COMPANY_SIZES = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'] as const;

export default function EmployerProfilePage() {
    const { t } = useTranslation();
    const { profile } = usePage<EmployerProfileProps>().props;

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        company_name: profile.company_name ?? '',
        company_size: profile.company_size ?? '',
        industry: profile.industry ?? '',
        website: profile.website ?? '',
        vat_number: profile.vat_number ?? '',
        country: profile.country ?? '',
        description: profile.description ?? '',
        logo: null as File | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/employer/profile', { forceFormData: true });
    };

    return (
        <AppLayout
            header={
                <div className="flex flex-wrap items-center justify-between gap-3">
                    <h1 className="text-2xl font-semibold text-slate-900">{t('profile.employer_profile')}</h1>
                    <Badge tone={profile.is_verified ? 'success' : 'warning'}>
                        {profile.is_verified
                            ? t('dashboard.employer_verified')
                            : t('dashboard.employer_verification_pending')}
                    </Badge>
                </div>
            }
        >
            <Head title={t('profile.employer_profile')} />

            <Card>
                <CardHeader>
                    <CardTitle>{t('profile.employer_profile')}</CardTitle>
                    <CardDescription>{t('home.for_employers_body')}</CardDescription>
                </CardHeader>

                <form onSubmit={submit} className="space-y-5" noValidate encType="multipart/form-data">
                    <div className="flex items-center gap-4">
                        {profile.logo_url ? (
                            <img
                                src={profile.logo_url}
                                alt={profile.company_name}
                                className="size-16 rounded-lg object-cover ring-1 ring-slate-200"
                            />
                        ) : (
                            <div className="grid size-16 place-items-center rounded-lg bg-slate-100 text-slate-400 ring-1 ring-slate-200">
                                LOGO
                            </div>
                        )}
                        <div>
                            <label className="block text-sm font-medium text-slate-700">
                                {t('profile.employer_logo')}
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) =>
                                    setData('logo', e.target.files?.[0] ?? null)
                                }
                                className="mt-1 block w-full text-sm text-slate-500 file:mr-3 file:rounded-lg file:border-0 file:bg-brand-50 file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-brand-700 hover:file:bg-brand-100"
                            />
                            {errors.logo ? (
                                <p className="mt-1 text-xs text-red-600">{errors.logo}</p>
                            ) : null}
                        </div>
                    </div>

                    <FormField
                        id="company_name"
                        label={t('auth.company_name')}
                        required
                        error={errors.company_name}
                    >
                        <Input
                            id="company_name"
                            value={data.company_name}
                            invalid={Boolean(errors.company_name)}
                            onChange={(e) => setData('company_name', e.target.value)}
                        />
                    </FormField>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField
                            id="company_size"
                            label={t('profile.employer_company_size')}
                            error={errors.company_size}
                        >
                            <select
                                id="company_size"
                                value={data.company_size}
                                onChange={(e) => setData('company_size', e.target.value)}
                                className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            >
                                <option value="">—</option>
                                {COMPANY_SIZES.map((s) => (
                                    <option key={s} value={s}>
                                        {s}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                        <FormField id="industry" label={t('profile.employer_industry')} error={errors.industry}>
                            <Input
                                id="industry"
                                value={data.industry}
                                invalid={Boolean(errors.industry)}
                                onChange={(e) => setData('industry', e.target.value)}
                            />
                        </FormField>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField id="website" label={t('profile.employer_website')} error={errors.website}>
                            <Input
                                id="website"
                                type="url"
                                value={data.website}
                                invalid={Boolean(errors.website)}
                                onChange={(e) => setData('website', e.target.value)}
                                placeholder="https://"
                            />
                        </FormField>
                        <FormField id="country" label={t('auth.country')} error={errors.country}>
                            <Input
                                id="country"
                                maxLength={2}
                                value={data.country}
                                invalid={Boolean(errors.country)}
                                onChange={(e) => setData('country', e.target.value.toUpperCase())}
                                placeholder="DE"
                            />
                        </FormField>
                    </div>

                    <FormField id="vat_number" label={t('profile.employer_vat')} error={errors.vat_number}>
                        <Input
                            id="vat_number"
                            value={data.vat_number}
                            invalid={Boolean(errors.vat_number)}
                            onChange={(e) => setData('vat_number', e.target.value)}
                            placeholder="DE123456789"
                        />
                    </FormField>

                    <FormField
                        id="description"
                        label={t('profile.employer_description')}
                        error={errors.description}
                    >
                        <textarea
                            id="description"
                            rows={5}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
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
            </Card>
        </AppLayout>
    );
}
