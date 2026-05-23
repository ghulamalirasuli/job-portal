import { Head, Link, usePage } from '@inertiajs/react';
import {
    ActivitySquare,
    ArrowRight,
    Briefcase,
    CheckCircle2,
    Clock3,
    ShieldCheck,
    Trash2,
    UserMinus,
    Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { type ReactNode } from 'react';
import AdminLayout from '@/Layouts/AdminLayout';
import { Avatar } from '@/Components/ui/Avatar';
import { Badge } from '@/Components/ui/Badge';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';

interface AdminDashboardProps extends PageProps {
    totals: {
        users: number;
        seekers: number;
        employers: number;
        admins: number;
        active: number;
        inactive: number;
        in_trash: number;
        new_this_week: number;
        jobs_active: number;
        jobs_pending: number;
        contact_new: number;
    };
    recentSignups: Array<{
        id: number;
        name: string;
        email: string;
        role: string;
        is_active: boolean;
        avatar_url: string | null;
        created_at: string | null;
    }>;
}

const ROLE_TONE: Record<string, 'brand' | 'warning' | 'default'> = {
    admin: 'brand',
    employer: 'warning',
    job_seeker: 'default',
};

export default function AdminDashboard() {
    const { t } = useTranslation();
    const { totals, recentSignups } = usePage<AdminDashboardProps>().props;

    return (
        <AdminLayout
            title={t('admin.dashboard.title')}
            subtitle={t('admin.dashboard.subtitle')}
            breadcrumbs={[
                { label: t('admin.nav.dashboard'), href: '/admin' },
            ]}
        >
            <Head title={t('admin.dashboard.title')} />

            <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <Kpi
                    label={t('admin.dashboard.kpi_total_users')}
                    value={totals.users}
                    icon={<Users className="size-6" />}
                    tone="brand"
                />
                <Kpi
                    label={t('admin.dashboard.kpi_seekers')}
                    value={totals.seekers}
                    icon={<Briefcase className="size-6" />}
                    tone="emerald"
                />
                <Kpi
                    label={t('admin.dashboard.kpi_employers')}
                    value={totals.employers}
                    icon={<ShieldCheck className="size-6" />}
                    tone="amber"
                />
                <Kpi
                    label={t('admin.dashboard.kpi_new_this_week')}
                    value={totals.new_this_week}
                    icon={<Clock3 className="size-6" />}
                    tone="rose"
                />
            </section>

            <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <SmallStat label={t('admin.dashboard.kpi_jobs_active')} value={totals.jobs_active} icon={<Briefcase className="size-5 text-brand-600" />} />
                <SmallStat label={t('admin.dashboard.kpi_jobs_pending')} value={totals.jobs_pending} icon={<Clock3 className="size-5 text-amber-600" />} />
                <SmallStat label={t('admin.dashboard.kpi_contact_new')} value={totals.contact_new} icon={<ActivitySquare className="size-5 text-rose-600" />} />
                <SmallStat label={t('admin.dashboard.kpi_admins')} value={totals.admins} icon={<ShieldCheck className="size-5 text-brand-600" />} />
            </section>

            <section className="mt-6 grid gap-6 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-xl bg-white p-0 shadow-sm ring-1 ring-slate-200">
                    <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                        <div className="flex items-center gap-2">
                            <ActivitySquare className="size-5 text-brand-600" />
                            <h2 className="text-base font-semibold text-slate-900">
                                {t('admin.dashboard.recent_signups')}
                            </h2>
                        </div>
                        <Link
                            href="/admin/users"
                            className="inline-flex items-center gap-1 text-sm font-medium text-brand-600 hover:text-brand-700"
                        >
                            {t('admin.nav.users')}
                            <ArrowRight className="size-4" />
                        </Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-slate-100 text-sm">
                            <thead className="bg-slate-50 text-left text-xs font-medium uppercase tracking-wider text-slate-500">
                                <tr>
                                    <th className="px-5 py-3">{t('admin.users.headers.user')}</th>
                                    <th className="px-5 py-3">{t('admin.users.headers.role')}</th>
                                    <th className="px-5 py-3">{t('admin.users.headers.status')}</th>
                                    <th className="px-5 py-3">{t('admin.users.headers.registered')}</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {recentSignups.map((u) => (
                                    <tr key={u.id} className="hover:bg-slate-50">
                                        <td className="px-5 py-3">
                                            <Link
                                                href={`/admin/users/${u.id}`}
                                                className="flex items-center gap-3"
                                            >
                                                <Avatar
                                                    name={u.name}
                                                    src={u.avatar_url ?? undefined}
                                                    size="sm"
                                                />
                                                <div>
                                                    <p className="font-medium text-slate-900">
                                                        {u.name}
                                                    </p>
                                                    <p className="text-xs text-slate-500">
                                                        {u.email}
                                                    </p>
                                                </div>
                                            </Link>
                                        </td>
                                        <td className="px-5 py-3">
                                            <Badge tone={ROLE_TONE[u.role] ?? 'default'}>
                                                {u.role.replace('_', ' ')}
                                            </Badge>
                                        </td>
                                        <td className="px-5 py-3">
                                            {u.is_active ? (
                                                <Badge tone="success">
                                                    {t('common.active')}
                                                </Badge>
                                            ) : (
                                                <Badge tone="danger">
                                                    {t('common.inactive')}
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-5 py-3 text-slate-500">
                                            {u.created_at
                                                ? new Date(u.created_at).toLocaleDateString()
                                                : '—'}
                                        </td>
                                    </tr>
                                ))}
                                {recentSignups.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan={4}
                                            className="px-5 py-10 text-center text-slate-500"
                                        >
                                            {t('admin.users.no_users')}
                                        </td>
                                    </tr>
                                ) : null}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="space-y-4">
                    <QuickLink href="/admin/jobs" title={t('admin.nav.jobs')} body={t('admin.jobs.subtitle')} icon={<Briefcase className="size-5" />} />
                    <QuickLink href="/admin/contact-messages" title={t('admin.nav.contact')} body={t('admin.contact.subtitle')} icon={<ActivitySquare className="size-5" />} />
                    <QuickLink href="/admin/companies" title={t('admin.nav.companies')} body={t('admin.companies.subtitle')} icon={<ShieldCheck className="size-5" />} />
                </div>
            </section>
        </AdminLayout>
    );
}

const KPI_TONES: Record<
    'brand' | 'emerald' | 'amber' | 'rose',
    { bg: string; iconBg: string; iconColor: string }
> = {
    brand: {
        bg: 'bg-gradient-to-br from-brand-600 to-brand-700 text-white',
        iconBg: 'bg-white/15',
        iconColor: 'text-white',
    },
    emerald: {
        bg: 'bg-gradient-to-br from-emerald-500 to-emerald-600 text-white',
        iconBg: 'bg-white/15',
        iconColor: 'text-white',
    },
    amber: {
        bg: 'bg-gradient-to-br from-amber-500 to-amber-600 text-white',
        iconBg: 'bg-white/15',
        iconColor: 'text-white',
    },
    rose: {
        bg: 'bg-gradient-to-br from-rose-500 to-rose-600 text-white',
        iconBg: 'bg-white/15',
        iconColor: 'text-white',
    },
};

function Kpi({
    label,
    value,
    icon,
    tone,
}: {
    label: string;
    value: number;
    icon: ReactNode;
    tone: keyof typeof KPI_TONES;
}) {
    const styles = KPI_TONES[tone];
    return (
        <div
            className={cn(
                'relative overflow-hidden rounded-xl p-5 shadow-sm',
                styles.bg,
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-white/80">
                        {label}
                    </p>
                    <p className="mt-2 text-3xl font-bold">{value.toLocaleString()}</p>
                </div>
                <span
                    className={cn(
                        'inline-flex size-12 items-center justify-center rounded-lg',
                        styles.iconBg,
                        styles.iconColor,
                    )}
                >
                    {icon}
                </span>
            </div>
        </div>
    );
}

function SmallStat({
    label,
    value,
    icon,
}: {
    label: string;
    value: number;
    icon: ReactNode;
}) {
    return (
        <div className="flex items-center gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
            <span className="inline-flex size-10 items-center justify-center rounded-lg bg-slate-50 ring-1 ring-slate-200">
                {icon}
            </span>
            <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    {label}
                </p>
                <p className="text-xl font-semibold text-slate-900">
                    {value.toLocaleString()}
                </p>
            </div>
        </div>
    );
}

function QuickLink({
    href,
    title,
    body,
    icon,
}: {
    href: string;
    title: string;
    body: string;
    icon: ReactNode;
}) {
    return (
        <Link
            href={href}
            className="group flex items-start gap-3 rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200 transition-shadow hover:shadow-md"
        >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700 ring-1 ring-brand-100">
                {icon}
            </span>
            <div className="min-w-0">
                <p className="font-semibold text-slate-900 group-hover:text-brand-700">
                    {title}
                </p>
                <p className="text-sm text-slate-500">{body}</p>
            </div>
            <ArrowRight className="ml-auto size-4 shrink-0 self-center text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-brand-600" />
        </Link>
    );
}
