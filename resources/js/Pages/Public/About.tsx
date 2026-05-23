import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import { ArrowRight, FileText, ShieldCheck, Sparkles, Target, Users } from 'lucide-react';
import PublicLayout from '@/Layouts/PublicLayout';
import { Button } from '@/Components/ui/Button';
import type { PageProps } from '@/types';

export default function About() {
    const { t } = useTranslation();
    const { siteSettings } = usePage<PageProps>().props;

    return (
        <PublicLayout
            header={
                <section className="border-b border-default bg-gradient-to-b from-brand-50 to-white dark:from-slate-900 dark:to-slate-950">
                    <div className="container-page py-16">
                        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                            {t('about.title', { name: siteSettings.service_name })}
                        </h1>
                        <p className="mt-4 max-w-3xl whitespace-pre-line text-lg text-muted">
                            {siteSettings.about_us || t('about.default_body', { name: siteSettings.service_name })}
                        </p>
                    </div>
                </section>
            }
        >
            <Head title={t('nav.about')} />

            <section className="container-page py-16">
                <h2 className="text-center text-2xl font-semibold text-slate-900 dark:text-slate-100">{t('about.pillars_title')}</h2>
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    <Pillar icon={<Target className="size-6" />} title={t('about.pillar_jobs_title')} body={t('about.pillar_jobs_body')} />
                    <Pillar icon={<Users className="size-6" />} title={t('about.pillar_people_title')} body={t('about.pillar_people_body')} />
                    <Pillar icon={<ShieldCheck className="size-6" />} title={t('about.pillar_trust_title')} body={t('about.pillar_trust_body')} />
                </div>
            </section>

            <section className="border-y border-default bg-slate-50 dark:bg-slate-900/50">
                <div className="container-page grid gap-8 py-14 md:grid-cols-2">
                    <div className="surface-panel p-8">
                        <Sparkles className="size-8 text-brand-600" />
                        <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">{t('about.resume_title')}</h3>
                        <p className="mt-2 text-muted">{t('about.resume_body')}</p>
                        <Link href="/register?role=job_seeker" className="mt-4 inline-flex items-center gap-2 font-semibold text-brand-700 hover:underline dark:text-brand-400">
                            {t('about.resume_cta')} <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    <div className="surface-panel p-8">
                        <FileText className="size-8 text-brand-600" />
                        <h3 className="mt-4 text-xl font-semibold text-slate-900 dark:text-slate-100">{t('about.contact_title')}</h3>
                        <p className="mt-2 text-muted">{t('about.contact_body')}</p>
                        <Link href="/contact">
                            <Button className="mt-4">{t('footer.contact')}</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </PublicLayout>
    );
}

function Pillar({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
    return (
        <div className="surface-panel p-6 text-center">
            <span className="mx-auto inline-flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{icon}</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="mt-2 text-sm text-muted">{body}</p>
        </div>
    );
}
