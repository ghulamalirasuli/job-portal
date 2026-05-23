import { Head, Link } from '@inertiajs/react';
import { ArrowRight, BadgeCheck, Building2, CreditCard, ShieldCheck, Users } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import PublicLayout from '@/Layouts/PublicLayout';
import { Button } from '@/Components/ui/Button';

export default function ForEmployers() {
    const { t } = useTranslation();

    return (
        <PublicLayout
            header={
                <section className="border-b border-default bg-gradient-to-br from-slate-900 via-slate-800 to-brand-900 text-white">
                    <div className="container-page py-16">
                        <h1 className="max-w-3xl text-4xl font-bold md:text-5xl">{t('public.employers_hero_title')}</h1>
                        <p className="mt-4 max-w-2xl text-lg text-slate-300">{t('public.employers_hero_body')}</p>
                        <div className="mt-8 flex flex-wrap gap-3">
                            <Link href="/register?role=employer"><Button size="lg">{t('home.cta_employer')}</Button></Link>
                            <Link href="/contact"><Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20">{t('footer.contact')}</Button></Link>
                        </div>
                    </div>
                </section>
            }
        >
            <Head title={t('nav.for_employers')} />
            <section className="container-page py-16">
                <h2 className="text-center text-2xl font-semibold text-slate-900 dark:text-slate-100">{t('public.employers_pillars_title')}</h2>
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                    <Pillar icon={<ShieldCheck className="size-6" />} title={t('public.pillar_verified_title')} body={t('public.pillar_verified_body')} />
                    <Pillar icon={<CreditCard className="size-6" />} title={t('public.pillar_billing_title')} body={t('public.pillar_billing_body')} />
                    <Pillar icon={<Users className="size-6" />} title={t('public.pillar_talent_title')} body={t('public.pillar_talent_body')} />
                </div>
            </section>
            <section className="border-y border-default bg-slate-50 dark:bg-slate-900/50">
                <div className="container-page flex flex-col items-center gap-4 py-14 text-center">
                    <Building2 className="size-10 text-brand-600" />
                    <h2 className="text-2xl font-semibold text-slate-900 dark:text-slate-100">{t('public.employers_cta_title')}</h2>
                    <p className="max-w-xl text-muted">{t('public.employers_cta_body')}</p>
                    <Link href="/register?role=employer" className="inline-flex items-center gap-2 font-semibold text-brand-700 hover:underline dark:text-brand-400">
                        {t('home.cta_employer')} <ArrowRight className="size-4" />
                    </Link>
                </div>
            </section>
        </PublicLayout>
    );
}

function Pillar({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
    return (
        <div className="surface-panel p-6">
            <span className="inline-flex size-12 items-center justify-center rounded-xl bg-brand-100 text-brand-700 dark:bg-brand-900/40 dark:text-brand-300">{icon}</span>
            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
            <p className="mt-2 text-sm text-muted">{body}</p>
        </div>
    );
}
