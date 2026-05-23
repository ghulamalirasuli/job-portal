import { Head, useForm, usePage } from '@inertiajs/react';
import { type FormEvent } from 'react';
import { Mail, MapPin, MessageSquare, Phone, Send, Smartphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/Layouts/PublicLayout';
import { Alert } from '@/Components/ui/Alert';
import { Button } from '@/Components/ui/Button';
import { FormField } from '@/Components/ui/FormField';
import { Input } from '@/Components/ui/Input';
import type { PageProps } from '@/types';

interface ContactForm {
    name: string;
    email: string;
    subject: string;
    message: string;
}

const textareaClass =
    'block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 focus:border-brand-500 focus:ring-2 focus:ring-brand-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100';

export default function Contact() {
    const { t } = useTranslation();
    const { siteSettings, flash, auth } = usePage<PageProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm<ContactForm>({
        name: auth.user?.name ?? '',
        email: auth.user?.email ?? '',
        subject: '',
        message: '',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post('/contact', {
            preserveScroll: true,
            onSuccess: () => reset('subject', 'message'),
        });
    };

    return (
        <PublicLayout
            header={
                <section className="border-b border-default bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <div className="container-page py-14">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {t('contact.title')}
                        </h1>
                        <p className="mt-3 max-w-2xl text-lg text-muted">{t('contact.subtitle')}</p>
                    </div>
                </section>
            }
        >
            <Head title={t('contact.title')} />

            <section className="container-page py-12">
                {flash?.success ? (
                    <div className="mb-6">
                        <Alert tone="success">{flash.success}</Alert>
                    </div>
                ) : null}

                <div className="grid gap-8 lg:grid-cols-5">
                    <div className="space-y-4 lg:col-span-2">
                        <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                            {t('contact.direct_title')}
                        </h2>
                        <p className="text-sm text-muted">{t('contact.direct_body')}</p>
                        <div className="grid gap-3">
                            {siteSettings.contact_email ? (
                                <ContactInfo
                                    icon={<Mail className="size-5" />}
                                    label={t('auth.email')}
                                    value={siteSettings.contact_email}
                                    href={`mailto:${siteSettings.contact_email}`}
                                />
                            ) : null}
                            {siteSettings.phone ? (
                                <ContactInfo
                                    icon={<Phone className="size-5" />}
                                    label={t('admin.settings.phone')}
                                    value={siteSettings.phone}
                                    href={`tel:${siteSettings.phone}`}
                                />
                            ) : null}
                            {siteSettings.whatsapp ? (
                                <ContactInfo
                                    icon={<Smartphone className="size-5" />}
                                    label={t('admin.settings.whatsapp')}
                                    value={siteSettings.whatsapp}
                                    href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                                />
                            ) : null}
                            {siteSettings.address ? (
                                <ContactInfo
                                    icon={<MapPin className="size-5" />}
                                    label={t('admin.settings.address')}
                                    value={siteSettings.address}
                                />
                            ) : null}
                        </div>
                    </div>

                    <form onSubmit={submit} className="surface-panel space-y-4 p-6 lg:col-span-3">
                        <div className="flex items-center gap-2">
                            <MessageSquare className="size-5 text-brand-600" />
                            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                                {t('contact.form_title')}
                            </h2>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <FormField id="name" label={t('auth.name')} required error={errors.name}>
                                <Input id="name" value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            </FormField>
                            <FormField id="email" label={t('auth.email')} required error={errors.email}>
                                <Input id="email" type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            </FormField>
                        </div>
                        <FormField id="subject" label={t('contact.subject')} required error={errors.subject}>
                            <Input id="subject" value={data.subject} onChange={(e) => setData('subject', e.target.value)} />
                        </FormField>
                        <FormField id="message" label={t('contact.message')} required error={errors.message}>
                            <textarea
                                id="message"
                                rows={6}
                                value={data.message}
                                onChange={(e) => setData('message', e.target.value)}
                                className={textareaClass}
                                placeholder={t('contact.message_placeholder')}
                            />
                        </FormField>
                        <Button type="submit" disabled={processing} className="w-full sm:w-auto">
                            <Send className="size-4" />
                            {t('contact.send')}
                        </Button>
                    </form>
                </div>
            </section>
        </PublicLayout>
    );
}

function ContactInfo({
    icon,
    label,
    value,
    href,
}: {
    icon: React.ReactNode;
    label: string;
    value: string;
    href?: string;
}) {
    const inner = (
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 ring-1 ring-slate-200 dark:bg-slate-900 dark:ring-slate-700">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">
                {icon}
            </span>
            <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted">{label}</p>
                <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{value}</p>
            </div>
        </div>
    );
    return href ? (
        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="block hover:opacity-90">
            {inner}
        </a>
    ) : (
        inner
    );
}
