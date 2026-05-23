import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, useState } from 'react';
import { Building2, Save, UploadCloud } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Button } from '@/Components/ui/Button';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';
import type { PageProps } from '@/types';

interface CompanyData {
    id: number;
    name: string;
    email: string;
    locale: string;
    is_active: boolean;
    is_verified: boolean;
    company_name: string;
    company_size: string | null;
    industry: string | null;
    website: string | null;
    vat_number: string | null;
    country: string | null;
    description: string | null;
    logo_url: string | null;
    jobs_count: number;
}

interface Props extends PageProps {
    company: CompanyData | null;
}

interface CompanyForm {
    name: string;
    email: string;
    password: string;
    locale: string;
    is_active: boolean;
    is_verified: boolean;
    company_name: string;
    company_size: string;
    industry: string;
    website: string;
    vat_number: string;
    country: string;
    description: string;
    logo: File | null;
    _method?: 'post';
}

const selectClass =
    'block h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

export default function CompanyFormPage() {
    const { t } = useTranslation();
    const { company } = usePage<Props>().props;
    const isEdit = company !== null;
    const [logoPreview, setLogoPreview] = useState<string | null>(company?.logo_url ?? null);

    const { data, setData, post, processing, errors } = useForm<CompanyForm>({
        name: company?.name ?? '',
        email: company?.email ?? '',
        password: '',
        locale: company?.locale ?? 'en',
        is_active: company?.is_active ?? true,
        is_verified: company?.is_verified ?? false,
        company_name: company?.company_name ?? '',
        company_size: company?.company_size ?? '',
        industry: company?.industry ?? '',
        website: company?.website ?? '',
        vat_number: company?.vat_number ?? '',
        country: company?.country ?? '',
        description: company?.description ?? '',
        logo: null,
        _method: isEdit ? 'post' : undefined,
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEdit && company) {
            post(`/admin/companies/${company.id}`, {
                forceFormData: true,
                preserveScroll: true,
            });
            return;
        }
        post('/admin/companies', { preserveScroll: true });
    };

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <AdminLayout
            title={isEdit ? t('admin.companies.edit_title') : t('admin.companies.create_title')}
            subtitle={t('admin.companies.form_subtitle')}
            breadcrumbs={[
                { label: t('admin.nav.dashboard'), href: '/admin' },
                { label: t('admin.nav.companies'), href: '/admin/companies' },
                { label: isEdit ? company.company_name : t('admin.companies.add') },
            ]}
        >
            <Head title={isEdit ? t('admin.companies.edit_title') : t('admin.companies.create_title')} />

            <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3" encType="multipart/form-data">
                <div className="surface-panel space-y-4 p-6 lg:col-span-2">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        <Building2 className="size-5" />
                        {t('admin.companies.section_company')}
                    </h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField id="company_name" label={t('auth.company_name')} required error={errors.company_name}>
                            <Input id="company_name" value={data.company_name} onChange={(e) => setData('company_name', e.target.value)} />
                        </FormField>
                        <FormField id="industry" label={t('profile.employer_industry')} error={errors.industry}>
                            <Input id="industry" value={data.industry} onChange={(e) => setData('industry', e.target.value)} />
                        </FormField>
                        <FormField id="company_size" label={t('profile.employer_company_size')} error={errors.company_size}>
                            <Input id="company_size" value={data.company_size} onChange={(e) => setData('company_size', e.target.value)} placeholder="51-200" />
                        </FormField>
                        <FormField id="country" label={t('auth.country')} error={errors.country}>
                            <Input id="country" value={data.country} onChange={(e) => setData('country', e.target.value.toUpperCase())} maxLength={2} placeholder="DE" />
                        </FormField>
                        <FormField id="website" label={t('profile.employer_website')} error={errors.website}>
                            <Input id="website" type="url" value={data.website} onChange={(e) => setData('website', e.target.value)} />
                        </FormField>
                        <FormField id="vat_number" label={t('profile.employer_vat')} error={errors.vat_number}>
                            <Input id="vat_number" value={data.vat_number} onChange={(e) => setData('vat_number', e.target.value)} />
                        </FormField>
                    </div>
                    <FormField id="description" label={t('profile.employer_description')} error={errors.description}>
                        <textarea
                            id="description"
                            rows={5}
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            className={selectClass}
                        />
                    </FormField>
                </div>

                <div className="space-y-6">
                    <div className="surface-panel space-y-4 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {t('admin.companies.section_account')}
                        </h2>
                        <FormField id="name" label={t('auth.name')} required error={errors.name}>
                            <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                        </FormField>
                        <FormField id="email" label={t('auth.email')} required error={errors.email}>
                            <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        </FormField>
                        {!isEdit ? (
                            <FormField id="password" label={t('auth.password')} required error={errors.password}>
                                <Input id="password" type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                            </FormField>
                        ) : null}
                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <input type="checkbox" checked={data.is_active} onChange={(e) => setData('is_active', e.target.checked)} className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                            {t('common.active')}
                        </label>
                        <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <input type="checkbox" checked={data.is_verified} onChange={(e) => setData('is_verified', e.target.checked)} className="rounded border-slate-300 text-brand-600 focus:ring-brand-500" />
                            {t('admin.companies.verified')}
                        </label>
                    </div>

                    {isEdit ? (
                        <div className="surface-panel space-y-4 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {t('profile.employer_logo')}
                            </h2>
                            {logoPreview ? (
                                <img src={logoPreview} alt="" className="size-20 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700" />
                            ) : null}
                            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-default px-4 py-3 text-sm text-muted hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <UploadCloud className="size-4" />
                                {t('admin.settings.logo')}
                                <input type="file" accept="image/*" className="sr-only" onChange={handleLogoChange} />
                            </label>
                        </div>
                    ) : null}

                    <Button type="submit" disabled={processing} className="w-full">
                        <Save className="size-4" />
                        {isEdit ? t('common.save') : t('admin.companies.create_button')}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
