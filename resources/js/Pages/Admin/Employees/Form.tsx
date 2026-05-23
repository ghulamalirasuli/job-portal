import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, useState } from 'react';
import { Save, UploadCloud, User } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Avatar } from '@/Components/ui/Avatar';
import { Button } from '@/Components/ui/Button';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';
import type { PageProps } from '@/types';

interface EmployeeData {
    id: number;
    name: string;
    email: string;
    locale: string;
    is_active: boolean;
    headline: string | null;
    location: string | null;
    country: string | null;
    phone: string | null;
    summary: string | null;
    visibility: string;
    avatar_url: string | null;
}

interface Props extends PageProps {
    employee: EmployeeData | null;
}

interface EmployeeForm {
    name: string;
    email: string;
    password: string;
    locale: string;
    is_active: boolean;
    headline: string;
    location: string;
    country: string;
    phone: string;
    summary: string;
    visibility: 'public' | 'private';
    avatar: File | null;
    _method?: 'post';
}

const selectClass =
    'block h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

export default function EmployeeFormPage() {
    const { t } = useTranslation();
    const { employee } = usePage<Props>().props;
    const isEdit = employee !== null;
    const [avatarPreview, setAvatarPreview] = useState<string | null>(employee?.avatar_url ?? null);

    const { data, setData, post, processing, errors } = useForm<EmployeeForm>({
        name: employee?.name ?? '',
        email: employee?.email ?? '',
        password: '',
        locale: employee?.locale ?? 'en',
        is_active: employee?.is_active ?? true,
        headline: employee?.headline ?? '',
        location: employee?.location ?? '',
        country: employee?.country ?? '',
        phone: employee?.phone ?? '',
        summary: employee?.summary ?? '',
        visibility: (employee?.visibility as 'public' | 'private') ?? 'private',
        avatar: null,
        _method: isEdit ? 'post' : undefined,
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEdit && employee) {
            post(`/admin/employees/${employee.id}`, {
                forceFormData: true,
                preserveScroll: true,
            });
            return;
        }
        post('/admin/employees', { preserveScroll: true });
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('avatar', file);
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setAvatarPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    return (
        <AdminLayout
            title={isEdit ? t('admin.employees.edit_title') : t('admin.employees.create_title')}
            subtitle={t('admin.employees.form_subtitle')}
            breadcrumbs={[
                { label: t('admin.nav.dashboard'), href: '/admin' },
                { label: t('admin.nav.employees'), href: '/admin/employees' },
                { label: isEdit ? employee.name : t('admin.employees.add') },
            ]}
        >
            <Head title={isEdit ? t('admin.employees.edit_title') : t('admin.employees.create_title')} />

            <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3" encType="multipart/form-data">
                <div className="surface-panel space-y-4 p-6 lg:col-span-2">
                    <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                        <User className="size-5" />
                        {t('profile.seeker_profile')}
                    </h2>
                    <FormField id="headline" label={t('profile.seeker_headline')} error={errors.headline}>
                        <Input id="headline" value={data.headline} onChange={(e) => setData('headline', e.target.value)} />
                    </FormField>
                    <div className="grid gap-4 sm:grid-cols-2">
                        <FormField id="location" label={t('profile.seeker_location')} error={errors.location}>
                            <Input id="location" value={data.location} onChange={(e) => setData('location', e.target.value)} />
                        </FormField>
                        <FormField id="country" label={t('auth.country')} error={errors.country}>
                            <Input id="country" value={data.country} onChange={(e) => setData('country', e.target.value.toUpperCase())} maxLength={2} />
                        </FormField>
                        <FormField id="phone" label={t('profile.seeker_phone')} error={errors.phone}>
                            <Input id="phone" value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        </FormField>
                        <FormField id="visibility" label={t('profile.seeker_visibility')} error={errors.visibility}>
                            <select
                                id="visibility"
                                value={data.visibility}
                                onChange={(e) => setData('visibility', e.target.value as 'public' | 'private')}
                                className={selectClass}
                            >
                                <option value="public">{t('profile.seeker_visibility_public')}</option>
                                <option value="private">{t('profile.seeker_visibility_private')}</option>
                            </select>
                        </FormField>
                    </div>
                    <FormField id="summary" label={t('profile.seeker_summary')} error={errors.summary}>
                        <textarea
                            id="summary"
                            rows={5}
                            value={data.summary}
                            onChange={(e) => setData('summary', e.target.value)}
                            className={selectClass}
                        />
                    </FormField>
                </div>

                <div className="space-y-6">
                    <div className="surface-panel space-y-4 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {t('admin.employees.section_account')}
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
                    </div>

                    {isEdit ? (
                        <div className="surface-panel space-y-4 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {t('profile.seeker_avatar')}
                            </h2>
                            <Avatar name={data.name} src={avatarPreview ?? undefined} size="lg" />
                            <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-dashed border-default px-4 py-3 text-sm text-muted hover:bg-slate-50 dark:hover:bg-slate-800/50">
                                <UploadCloud className="size-4" />
                                {t('profile.seeker_avatar')}
                                <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
                            </label>
                        </div>
                    ) : null}

                    <Button type="submit" disabled={processing} className="w-full">
                        <Save className="size-4" />
                        {isEdit ? t('common.save') : t('admin.employees.create_button')}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
