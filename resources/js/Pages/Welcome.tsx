import { Head, Link, usePage } from '@inertiajs/react';
import { useTranslation } from 'react-i18next';
import {
    ArrowRight,
    BadgeCheck,
    Briefcase,
    Building2,
    MapPin,
    Search,
    ShieldCheck,
    Sparkles,
} from 'lucide-react';
import { TopNav } from '@/Components/layout/TopNav';
import { SiteFooter } from '@/Components/layout/SiteFooter';
import { JobCard, type JobCardData } from '@/Components/jobs/JobCard';
import { Button } from '@/Components/ui/Button';
import { Input } from '@/Components/ui/Input';
import type { PageProps } from '@/types';

interface WelcomeProps extends PageProps {
    stats: {
        jobs: number;
        companies: number;
        countries: number;
    };
    featuredJobs: JobCardData[];
}

export default function Welcome() {
    const { t } = useTranslation();
    const { stats, featuredJobs = [] } = usePage<WelcomeProps>().props;

    return (
        <div className="flex min-h-screen flex-col bg-white dark:bg-slate-950">
            <Head title={t('app.tagline')} />
            <TopNav />

            <main className="flex-1">
                {/* Hero */}
                <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 via-white to-white">
                    <div className="container-page py-16 md:py-24">
                        <div className="mx-auto max-w-3xl text-center">
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-100 px-3 py-1 text-xs font-medium text-brand-700 ring-1 ring-brand-200">
                                <Sparkles className="size-3.5" aria-hidden="true" />
                                {t('app.tagline')}
                            </span>
                            <h1 className="mt-6 text-balance text-4xl font-bold tracking-tight text-slate-900 md:text-6xl">
                                {t('home.hero_title')}
                            </h1>
                            <p className="mt-4 text-pretty text-lg text-slate-600">
                                {t('home.hero_subtitle')}
                            </p>
                        </div>

                        {/* Search bar */}
                        <form
                            action="/jobs"
                            method="get"
                            className="mx-auto mt-10 grid max-w-4xl grid-cols-1 gap-2 rounded-2xl bg-white p-2 shadow-lg ring-1 ring-slate-200 md:grid-cols-[1fr_1fr_auto]"
                        >
                            <div className="relative">
                                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    name="q"
                                    placeholder={t('home.search_placeholder')}
                                    className="h-12 border-0 pl-9 shadow-none focus:ring-0"
                                />
                            </div>
                            <div className="relative">
                                <MapPin className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                                <Input
                                    name="location"
                                    placeholder={t('home.location_placeholder')}
                                    className="h-12 border-0 pl-9 shadow-none focus:ring-0 md:border-l md:border-slate-200"
                                />
                            </div>
                            <Button size="lg" type="submit" className="h-12">
                                <Search className="size-4" />
                                {t('home.search_button')}
                            </Button>
                        </form>

                        {/* Quick stats */}
                        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-3 gap-4 text-center">
                            <Stat value={stats.jobs} label={t('nav.jobs')} />
                            <Stat value={stats.companies} label={t('nav.companies')} />
                            <Stat value={stats.countries} label="EU" />
                        </div>
                    </div>
                </section>

                {/* Featured jobs — inspired by jobs.af active listings */}
                {featuredJobs.length > 0 ? (
                    <section className="container-page py-16">
                        <div className="flex items-end justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">{t('home.featured_jobs_title')}</h2>
                                <p className="mt-1 text-muted">{t('home.featured_jobs_subtitle')}</p>
                            </div>
                            <Link href="/jobs" className="inline-flex items-center gap-1 text-sm font-semibold text-brand-700 hover:underline dark:text-brand-400">
                                {t('home.view_all_jobs')} <ArrowRight className="size-4" />
                            </Link>
                        </div>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {featuredJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    </section>
                ) : null}

                {/* Resume builder CTA — inspired by jobs.af resume section */}
                <section className="border-y border-default bg-slate-900 text-white">
                    <div className="container-page grid items-center gap-8 py-16 md:grid-cols-2">
                        <div>
                            <h2 className="text-3xl font-bold">{t('home.resume_title')}</h2>
                            <p className="mt-3 text-slate-300">{t('home.resume_body')}</p>
                            <Link href="/register?role=job_seeker" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-100">
                                {t('home.resume_cta')} <ArrowRight className="size-4" />
                            </Link>
                        </div>
                        <div className="rounded-2xl bg-white/10 p-6 ring-1 ring-white/20">
                            <p className="text-sm uppercase tracking-wider text-slate-400">{t('home.resume_preview')}</p>
                            <p className="mt-3 text-xl font-semibold">{t('home.resume_sample_name')}</p>
                            <p className="text-brand-200">{t('home.resume_sample_role')}</p>
                            <ul className="mt-4 space-y-2 text-sm text-slate-300">
                                <li>• {t('home.resume_point_1')}</li>
                                <li>• {t('home.resume_point_2')}</li>
                                <li>• {t('home.resume_point_3')}</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* Two-column CTAs */}
                <section className="container-page py-16">
                    <div className="grid gap-6 md:grid-cols-2">
                        <CtaCard
                            icon={<Briefcase className="size-6" />}
                            title={t('home.for_seekers_title')}
                            body={t('home.for_seekers_body')}
                            cta={t('home.cta_seeker')}
                            href="/register?role=job_seeker"
                            tone="brand"
                        />
                        <CtaCard
                            icon={<Building2 className="size-6" />}
                            title={t('home.for_employers_title')}
                            body={t('home.for_employers_body')}
                            cta={t('home.cta_employer')}
                            href="/register?role=employer"
                            tone="slate"
                        />
                    </div>
                </section>

                {/* Trust strip */}
                <section className="border-y border-slate-200 bg-slate-50/60">
                    <div className="container-page grid gap-8 py-12 sm:grid-cols-3">
                        <TrustItem
                            icon={<ShieldCheck className="size-5" />}
                            title="GDPR-first"
                            body="Your data is processed inside the EU with deletion on demand."
                        />
                        <TrustItem
                            icon={<BadgeCheck className="size-5" />}
                            title="Verified employers"
                            body="Every hiring company is reviewed before they post."
                        />
                        <TrustItem
                            icon={<Sparkles className="size-5" />}
                            title="24 languages"
                            body="Browse roles in your language across all 27 EU member states."
                        />
                    </div>
                </section>
            </main>

            <SiteFooter />
        </div>
    );
}

function Stat({ value, label }: { value: number; label: string }) {
    return (
        <div>
            <p className="text-2xl font-bold text-slate-900 md:text-3xl">
                {value.toLocaleString()}+
            </p>
            <p className="mt-1 text-sm text-slate-500">{label}</p>
        </div>
    );
}

interface CtaCardProps {
    icon: React.ReactNode;
    title: string;
    body: string;
    cta: string;
    href: string;
    tone: 'brand' | 'slate';
}

function CtaCard({ icon, title, body, cta, href, tone }: CtaCardProps) {
    const isBrand = tone === 'brand';
    return (
        <div
            className={
                isBrand
                    ? 'rounded-2xl bg-brand-600 p-8 text-white shadow-lg'
                    : 'rounded-2xl bg-slate-900 p-8 text-white shadow-lg'
            }
        >
            <div
                className={
                    isBrand
                        ? 'inline-flex size-12 items-center justify-center rounded-xl bg-white/15 text-white'
                        : 'inline-flex size-12 items-center justify-center rounded-xl bg-white/10 text-white'
                }
            >
                {icon}
            </div>
            <h3 className="mt-5 text-2xl font-semibold">{title}</h3>
            <p className="mt-2 text-white/80">{body}</p>
            <Link
                href={href}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 hover:bg-slate-100"
            >
                {cta}
                <ArrowRight className="size-4" />
            </Link>
        </div>
    );
}

function TrustItem({
    icon,
    title,
    body,
}: {
    icon: React.ReactNode;
    title: string;
    body: string;
}) {
    return (
        <div className="flex gap-3">
            <span className="mt-0.5 inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-700">
                {icon}
            </span>
            <div>
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="text-sm text-slate-600">{body}</p>
            </div>
        </div>
    );
}
