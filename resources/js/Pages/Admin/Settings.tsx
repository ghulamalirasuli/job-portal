import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEvent, useState } from 'react';
import {
    Briefcase,
    FileText,
    Image as ImageIcon,
    Mail,
    MapPin,
    Phone,
    Save,
    Smartphone,
    Trash2,
    UploadCloud,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Alert } from '@/Components/ui/Alert';
import { Button } from '@/Components/ui/Button';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';
import type { PageProps } from '@/types';

interface SettingsProps extends PageProps {
    settings: {
        service_name: string;
        contact_email: string | null;
        whatsapp: string | null;
        phone: string | null;
        address: string | null;
        about_us: string | null;
        logo_url: string | null;
    };
}

interface SettingsForm {
    service_name: string;
    contact_email: string;
    whatsapp: string;
    phone: string;
    address: string;
    about_us: string;
    logo: File | null;
    remove_logo: boolean;
    _method: 'post';
}

export default function AdminSettings() {
    const { t } = useTranslation();
    const { settings, flash } = usePage<SettingsProps>().props;
    const [logoPreview, setLogoPreview] = useState<string | null>(settings.logo_url);

    const { data, setData, post, processing, errors, reset } = useForm<SettingsForm>({
        service_name: settings.service_name ?? '',
        contact_email: settings.contact_email ?? '',
        whatsapp: settings.whatsapp ?? '',
        phone: settings.phone ?? '',
        address: settings.address ?? '',
        about_us: settings.about_us ?? '',
        logo: null,
        remove_logo: false,
        _method: 'post',
    });

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('logo', file);
        setData('remove_logo', false);
        if (file) {
            const reader = new FileReader();
            reader.onload = (ev) => setLogoPreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const removeLogo = () => {
        setData('logo', null);
        setData('remove_logo', true);
        setLogoPreview(null);
    };

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/admin/settings', {
            forceFormData: true,
            preserveScroll: true,
            onSuccess: () => reset('logo'),
        });
    };

    return (
        <AdminLayout
            title={t('admin.settings.title')}
            subtitle={t('admin.settings.subtitle')}
            breadcrumbs={[
                { label: t('admin.nav.dashboard'), href: '/admin' },
                { label: t('admin.nav.settings') },
            ]}
        >
            <Head title={t('admin.settings.title')} />

            <form
                onSubmit={submit}
                className="grid gap-6 lg:grid-cols-3"
                encType="multipart/form-data"
            >
                {/* Branding */}
                <SettingsCard
                    title={t('admin.settings.section_branding')}
                    body={t('admin.settings.section_branding_help')}
                    icon={<Briefcase className="size-5" />}
                >
                    <FormField
                        id="service_name"
                        label={t('admin.settings.service_name')}
                        required
                        error={errors.service_name}
                    >
                        <Input
                            id="service_name"
                            value={data.service_name}
                            onChange={(e) => setData('service_name', e.target.value)}
                            required
                        />
                    </FormField>

                    <div className="mt-4">
                        <label
                            htmlFor="logo"
                            className="block text-sm font-medium text-slate-700"
                        >
                            {t('admin.settings.logo')}
                        </label>
                        <div className="mt-2 flex items-center gap-4">
                            <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-dashed border-slate-300 bg-slate-50">
                                {logoPreview ? (
                                    <img
                                        src={logoPreview}
                                        alt="Logo preview"
                                        className="size-20 object-cover"
                                    />
                                ) : (
                                    <ImageIcon className="size-8 text-slate-400" />
                                )}
                            </div>
                            <div className="flex flex-1 flex-col gap-2">
                                <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                                    <UploadCloud className="size-4" />
                                    Choose file
                                    <input
                                        id="logo"
                                        type="file"
                                        accept="image/png,image/jpeg,image/svg+xml,image/webp"
                                        className="sr-only"
                                        onChange={handleLogoChange}
                                    />
                                </label>
                                {logoPreview ? (
                                    <button
                                        type="button"
                                        onClick={removeLogo}
                                        className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="size-3.5" />
                                        {t('admin.settings.logo_remove')}
                                    </button>
                                ) : null}
                                <p className="text-xs text-slate-500">
                                    {t('admin.settings.logo_help')}
                                </p>
                                {errors.logo ? (
                                    <p className="text-xs text-red-600">{errors.logo}</p>
                                ) : null}
                            </div>
                        </div>
                    </div>
                </SettingsCard>

                {/* Contact */}
                <SettingsCard
                    title={t('admin.settings.section_contact')}
                    body={t('admin.settings.section_contact_help')}
                    icon={<Mail className="size-5" />}
                >
                    <FormField
                        id="contact_email"
                        label={t('admin.settings.contact_email')}
                        error={errors.contact_email}
                    >
                        <div className="relative">
                            <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                            <Input
                                id="contact_email"
                                type="email"
                                value={data.contact_email}
                                onChange={(e) => setData('contact_email', e.target.value)}
                                className="pl-9"
                                placeholder="hello@europa.jobs"
                            />
                        </div>
                    </FormField>

                    <div className="mt-4">
                        <FormField
                            id="whatsapp"
                            label={t('admin.settings.whatsapp')}
                            hint={t('admin.settings.whatsapp_help')}
                            error={errors.whatsapp}
                        >
                            <div className="relative">
                                <Smartphone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="whatsapp"
                                    value={data.whatsapp}
                                    onChange={(e) => setData('whatsapp', e.target.value)}
                                    className="pl-9"
                                    placeholder="+33 6 12 34 56 78"
                                />
                            </div>
                        </FormField>
                    </div>

                    <div className="mt-4">
                        <FormField
                            id="phone"
                            label={t('admin.settings.phone')}
                            error={errors.phone}
                        >
                            <div className="relative">
                                <Phone className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="phone"
                                    value={data.phone}
                                    onChange={(e) => setData('phone', e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </FormField>
                    </div>

                    <div className="mt-4">
                        <FormField
                            id="address"
                            label={t('admin.settings.address')}
                            error={errors.address}
                        >
                            <div className="relative">
                                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    id="address"
                                    value={data.address}
                                    onChange={(e) => setData('address', e.target.value)}
                                    className="pl-9"
                                    placeholder="Rue de la Loi 200, 1040 Brussels, BE"
                                />
                            </div>
                        </FormField>
                    </div>
                </SettingsCard>

                {/* About */}
                <SettingsCard
                    title={t('admin.settings.section_about')}
                    body={t('admin.settings.section_about_help')}
                    icon={<FileText className="size-5" />}
                    full
                >
                    <FormField
                        id="about_us"
                        label={t('admin.settings.about_us')}
                        error={errors.about_us}
                    >
                        <textarea
                            id="about_us"
                            value={data.about_us}
                            onChange={(e) => setData('about_us', e.target.value)}
                            rows={6}
                            className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                            placeholder="A short description of the service…"
                        />
                    </FormField>
                </SettingsCard>

                <div className="lg:col-span-3">
                    {flash?.success ? (
                        <div className="mb-4">
                            <Alert tone="success">{flash.success}</Alert>
                        </div>
                    ) : null}
                    <div className="flex justify-end">
                        <Button type="submit" isLoading={processing} size="lg">
                            <Save className="size-4" />
                            {t('admin.settings.save_button')}
                        </Button>
                    </div>
                </div>
            </form>
        </AdminLayout>
    );
}

function SettingsCard({
    title,
    body,
    icon,
    children,
    full,
}: {
    title: string;
    body: string;
    icon: React.ReactNode;
    children: React.ReactNode;
    full?: boolean;
}) {
    return (
        <div
            className={
                full
                    ? 'lg:col-span-3 rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200'
                    : 'rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200'
            }
        >
            <div className="mb-4 flex items-start gap-3">
                <span className="inline-flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                    {icon}
                </span>
                <div>
                    <h3 className="text-base font-semibold text-slate-900">{title}</h3>
                    <p className="text-sm text-slate-500">{body}</p>
                </div>
            </div>
            {children}
        </div>
    );
}
