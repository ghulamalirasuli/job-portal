import { Head, router, useForm, usePage } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { Briefcase, Check, Save, XCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Alert } from '@/Components/ui/Alert';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';
import type { PageProps } from '@/types';

interface CompanyOption {
    id: number;
    label: string;
}

interface JobData {
    id: number;
    title: string;
    employer_profile_id: number;
    description: string;
    requirements: string | null;
    benefits: string | null;
    location: string | null;
    country: string | null;
    remote_type: string;
    employment_type: string;
    salary_min: number | null;
    salary_max: number | null;
    salary_period: string;
    status: string;
    status_label: string;
    payment_amount: string | null;
    payment_currency: string;
    payment_status: string;
    payment_reference: string | null;
    payment_method: string | null;
    rejection_reason: string | null;
    is_active: boolean;
    expires_at: string | null;
    contact_name: string;
    contact_email: string;
    views_count: number;
}

interface Props extends PageProps {
    job: JobData | null;
    companies: CompanyOption[];
    remoteTypes: string[];
    employmentTypes: string[];
    statuses: string[];
    paymentStatuses: string[];
}

interface JobForm {
    employer_profile_id: string;
    title: string;
    description: string;
    requirements: string;
    benefits: string;
    location: string;
    country: string;
    remote_type: string;
    employment_type: string;
    salary_min: string;
    salary_max: string;
    salary_currency: string;
    salary_period: string;
    status: string;
    payment_amount: string;
    payment_currency: string;
    payment_status: string;
    payment_reference: string;
    payment_method: string;
    expires_at: string;
    _method?: 'post';
}

const selectClass =
    'block h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

export default function JobFormPage() {
    const { t } = useTranslation();
    const { job, companies, remoteTypes, employmentTypes, statuses, paymentStatuses } =
        usePage<Props>().props;
    const isEdit = job !== null;

    const { data, setData, post, processing, errors } = useForm<JobForm>({
        employer_profile_id: job?.employer_profile_id?.toString() ?? '',
        title: job?.title ?? '',
        description: job?.description ?? '',
        requirements: job?.requirements ?? '',
        benefits: job?.benefits ?? '',
        location: job?.location ?? '',
        country: job?.country ?? '',
        remote_type: job?.remote_type ?? 'on_site',
        employment_type: job?.employment_type ?? 'full_time',
        salary_min: job?.salary_min?.toString() ?? '',
        salary_max: job?.salary_max?.toString() ?? '',
        salary_currency: 'EUR',
        salary_period: job?.salary_period ?? 'yearly',
        status: job?.status ?? 'pending_approval',
        payment_amount: job?.payment_amount ?? '',
        payment_currency: job?.payment_currency ?? 'EUR',
        payment_status: job?.payment_status ?? 'unpaid',
        payment_reference: job?.payment_reference ?? '',
        payment_method: job?.payment_method ?? '',
        expires_at: job?.expires_at ? job.expires_at.slice(0, 10) : '',
        _method: isEdit ? 'post' : undefined,
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (isEdit && job) {
            post(`/admin/jobs/${job.id}`, { preserveScroll: true });
            return;
        }
        post('/admin/jobs', { preserveScroll: true });
    };

    const approve = () => {
        if (!job || !window.confirm(t('admin.jobs.confirm_approve'))) return;
        router.patch(`/admin/jobs/${job.id}/approve`, {}, { preserveScroll: true });
    };

    const reject = () => {
        if (!job) return;
        const reason = window.prompt(t('admin.jobs.reject_reason_prompt'));
        if (reason === null || reason.trim() === '') return;
        router.patch(`/admin/jobs/${job.id}/reject`, { rejection_reason: reason.trim() }, { preserveScroll: true });
    };

    return (
        <AdminLayout
            title={isEdit ? t('admin.jobs.edit_title') : t('admin.jobs.create_title')}
            subtitle={t('admin.jobs.form_subtitle')}
            breadcrumbs={[
                { label: t('admin.nav.dashboard'), href: '/admin' },
                { label: t('admin.nav.jobs'), href: '/admin/jobs' },
                { label: isEdit ? job.title : t('admin.jobs.add') },
            ]}
            actions={
                isEdit && job?.status === 'pending_approval' ? (
                    <div className="flex gap-2">
                        <Button type="button" variant="primary" onClick={approve}>
                            <Check className="size-4" /> {t('admin.jobs.approve')}
                        </Button>
                        <Button type="button" variant="outline" onClick={reject}>
                            <XCircle className="size-4" /> {t('admin.jobs.reject')}
                        </Button>
                    </div>
                ) : null
            }
        >
            <Head title={isEdit ? t('admin.jobs.edit_title') : t('admin.jobs.create_title')} />

            {isEdit && job?.rejection_reason ? (
                <div className="mb-4">
                    <Alert tone="error">
                        {t('admin.jobs.rejection_reason')}: {job.rejection_reason}
                    </Alert>
                </div>
            ) : null}

            <form onSubmit={submit} className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <div className="surface-panel space-y-4 p-6">
                        <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-900 dark:text-slate-100">
                            <Briefcase className="size-5" />
                            {t('admin.jobs.section_details')}
                        </h2>
                        <FormField id="employer_profile_id" label={t('admin.jobs.company')} required error={errors.employer_profile_id}>
                            <select
                                id="employer_profile_id"
                                value={data.employer_profile_id}
                                onChange={(e) => setData('employer_profile_id', e.target.value)}
                                className={selectClass}
                            >
                                <option value="">{t('admin.jobs.select_company')}</option>
                                {companies.map((c) => (
                                    <option key={c.id} value={c.id}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </FormField>
                        <FormField id="title" label={t('admin.jobs.job_title')} required error={errors.title}>
                            <Input id="title" value={data.title} onChange={(e) => setData('title', e.target.value)} />
                        </FormField>
                        <FormField id="description" label={t('admin.jobs.description')} required error={errors.description}>
                            <textarea id="description" rows={6} value={data.description} onChange={(e) => setData('description', e.target.value)} className={selectClass} />
                        </FormField>
                        <FormField id="requirements" label={t('admin.jobs.requirements')} error={errors.requirements}>
                            <textarea id="requirements" rows={4} value={data.requirements} onChange={(e) => setData('requirements', e.target.value)} className={selectClass} />
                        </FormField>
                        <FormField id="benefits" label={t('admin.jobs.benefits')} error={errors.benefits}>
                            <textarea id="benefits" rows={3} value={data.benefits} onChange={(e) => setData('benefits', e.target.value)} className={selectClass} />
                        </FormField>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField id="location" label={t('admin.jobs.location')} error={errors.location}>
                                <Input id="location" value={data.location} onChange={(e) => setData('location', e.target.value)} />
                            </FormField>
                            <FormField id="country" label={t('auth.country')} error={errors.country}>
                                <Input id="country" value={data.country} onChange={(e) => setData('country', e.target.value.toUpperCase())} maxLength={2} />
                            </FormField>
                            <FormField id="remote_type" label={t('admin.jobs.remote_type')} error={errors.remote_type}>
                                <select id="remote_type" value={data.remote_type} onChange={(e) => setData('remote_type', e.target.value)} className={selectClass}>
                                    {remoteTypes.map((v) => (
                                        <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                            </FormField>
                            <FormField id="employment_type" label={t('admin.jobs.employment_type')} error={errors.employment_type}>
                                <select id="employment_type" value={data.employment_type} onChange={(e) => setData('employment_type', e.target.value)} className={selectClass}>
                                    {employmentTypes.map((v) => (
                                        <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>
                                    ))}
                                </select>
                            </FormField>
                        </div>
                    </div>

                    <div className="surface-panel space-y-4 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {t('admin.jobs.section_salary')}
                        </h2>
                        <div className="grid gap-4 sm:grid-cols-3">
                            <FormField id="salary_min" label={t('admin.jobs.salary_min')} error={errors.salary_min}>
                                <Input id="salary_min" type="number" value={data.salary_min} onChange={(e) => setData('salary_min', e.target.value)} />
                            </FormField>
                            <FormField id="salary_max" label={t('admin.jobs.salary_max')} error={errors.salary_max}>
                                <Input id="salary_max" type="number" value={data.salary_max} onChange={(e) => setData('salary_max', e.target.value)} />
                            </FormField>
                            <FormField id="salary_period" label={t('admin.jobs.salary_period')} error={errors.salary_period}>
                                <select id="salary_period" value={data.salary_period} onChange={(e) => setData('salary_period', e.target.value)} className={selectClass}>
                                    <option value="yearly">Yearly</option>
                                    <option value="monthly">Monthly</option>
                                    <option value="hourly">Hourly</option>
                                </select>
                            </FormField>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {isEdit && job ? (
                        <div className="surface-panel space-y-3 p-6">
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                                {t('admin.jobs.section_review')}
                            </h2>
                            <Badge tone={job.status === 'approved' ? 'brand' : job.status === 'rejected' ? 'danger' : 'warning'}>
                                {job.status_label}
                            </Badge>
                            <p className="text-sm text-muted">
                                {t('admin.jobs.posted_by')}: {job.contact_name} ({job.contact_email})
                            </p>
                            <p className="text-sm text-muted">
                                {t('admin.jobs.views')}: {job.views_count}
                            </p>
                        </div>
                    ) : null}

                    <div className="surface-panel space-y-4 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {t('admin.jobs.section_payment')}
                        </h2>
                        <FormField id="payment_amount" label={t('admin.jobs.payment_amount')} error={errors.payment_amount}>
                            <Input id="payment_amount" type="number" step="0.01" value={data.payment_amount} onChange={(e) => setData('payment_amount', e.target.value)} />
                        </FormField>
                        <FormField id="payment_status" label={t('admin.jobs.payment_status')} error={errors.payment_status}>
                            <select id="payment_status" value={data.payment_status} onChange={(e) => setData('payment_status', e.target.value)} className={selectClass}>
                                {paymentStatuses.map((v) => (
                                    <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                        </FormField>
                        <FormField id="payment_method" label={t('admin.jobs.payment_method')} error={errors.payment_method}>
                            <Input id="payment_method" value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)} placeholder="stripe, bank_transfer" />
                        </FormField>
                        <FormField id="payment_reference" label={t('admin.jobs.payment_reference')} error={errors.payment_reference}>
                            <Input id="payment_reference" value={data.payment_reference} onChange={(e) => setData('payment_reference', e.target.value)} />
                        </FormField>
                    </div>

                    <div className="surface-panel space-y-4 p-6">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                            {t('admin.jobs.section_moderation')}
                        </h2>
                        <FormField id="status" label={t('admin.jobs.moderation_status')} error={errors.status}>
                            <select id="status" value={data.status} onChange={(e) => setData('status', e.target.value)} className={selectClass}>
                                {statuses.map((v) => (
                                    <option key={v} value={v}>{v.replace(/_/g, ' ')}</option>
                                ))}
                            </select>
                        </FormField>
                        <FormField id="expires_at" label={t('admin.jobs.expires_at')} error={errors.expires_at}>
                            <Input id="expires_at" type="date" value={data.expires_at} onChange={(e) => setData('expires_at', e.target.value)} />
                        </FormField>
                    </div>

                    <Button type="submit" disabled={processing} className="w-full">
                        <Save className="size-4" />
                        {isEdit ? t('common.save') : t('admin.jobs.create_button')}
                    </Button>
                </div>
            </form>
        </AdminLayout>
    );
}
