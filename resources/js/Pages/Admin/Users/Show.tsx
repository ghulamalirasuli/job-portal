import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    Calendar,
    CheckCircle2,
    Clock3,
    Globe,
    Mail,
    MapPin,
    ShieldCheck,
    Trash2,
    UserMinus,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import AdminLayout from '@/Layouts/AdminLayout';
import { Avatar } from '@/Components/ui/Avatar';
import { Badge } from '@/Components/ui/Badge';
import { Button } from '@/Components/ui/Button';
import type { PageProps } from '@/types';

interface ShowProps extends PageProps {
    user: {
        id: number;
        name: string;
        email: string;
        role: string;
        is_active: boolean;
        locale: string;
        avatar_url: string | null;
        email_verified: boolean;
        created_at: string | null;
        last_login_at: string | null;
        last_login_ip: string | null;
        seeker_profile: null | {
            headline: string | null;
            location: string | null;
            country: string | null;
            visibility: string;
        };
        employer_profile: null | {
            company_name: string;
            company_size: string | null;
            industry: string | null;
            country: string | null;
            website: string | null;
            verified_at: string | null;
        };
    };
    auditLogs: Array<{
        id: number;
        event: string;
        ip_address: string | null;
        created_at: string;
    }>;
}

export default function AdminUserShow() {
    const { t } = useTranslation();
    const { user, auditLogs, auth } = usePage<ShowProps>().props;
    const isSelf = auth.user?.id === user.id;

    const toggleActive = () => {
        const msg = user.is_active
            ? t('admin.users.confirm_deactivate')
            : t('admin.users.confirm_activate');
        if (!window.confirm(msg)) return;
        router.patch(
            `/admin/users/${user.id}/toggle-active`,
            {},
            { preserveScroll: true },
        );
    };

    const softDelete = () => {
        if (!window.confirm(t('admin.users.soft_delete_body'))) return;
        router.delete(`/admin/users/${user.id}`);
    };

    return (
        <AdminLayout
            title={user.name}
            subtitle={user.email}
            breadcrumbs={[
                { label: t('admin.nav.dashboard'), href: '/admin' },
                { label: t('admin.nav.users'), href: '/admin/users' },
                { label: user.name },
            ]}
            actions={
                <Link
                    href="/admin/users"
                    className="inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
                >
                    <ArrowLeft className="size-4" />
                    {t('admin.users.back_to_list')}
                </Link>
            }
        >
            <Head title={user.name} />

            <div className="grid gap-6 lg:grid-cols-3">
                {/* Main column */}
                <div className="space-y-6 lg:col-span-2">
                    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div className="flex items-center gap-4">
                                <Avatar name={user.name} src={user.avatar_url ?? undefined} size="lg" />
                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <h2 className="text-lg font-semibold text-slate-900">
                                            {user.name}
                                        </h2>
                                        <Badge tone={user.role === 'admin' ? 'brand' : user.role === 'employer' ? 'warning' : 'default'}>
                                            <ShieldCheck className="size-3" />
                                            {user.role.replace('_', ' ')}
                                        </Badge>
                                        {user.is_active ? (
                                            <Badge tone="success">{t('common.active')}</Badge>
                                        ) : (
                                            <Badge tone="danger">{t('common.inactive')}</Badge>
                                        )}
                                    </div>
                                    <p className="mt-1 text-sm text-slate-500">{user.email}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button
                                    type="button"
                                    variant={user.is_active ? 'outline' : 'primary'}
                                    onClick={toggleActive}
                                    disabled={isSelf}
                                >
                                    {user.is_active ? (
                                        <>
                                            <UserMinus className="size-4" />
                                            {t('common.deactivate')}
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 className="size-4" />
                                            {t('common.activate')}
                                        </>
                                    )}
                                </Button>
                                <Button
                                    type="button"
                                    variant="danger"
                                    onClick={softDelete}
                                    disabled={isSelf}
                                >
                                    <Trash2 className="size-4" />
                                    {t('common.delete')}
                                </Button>
                            </div>
                        </div>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <Info icon={<Mail className="size-4" />} label="Email" value={user.email} />
                            <Info
                                icon={<CheckCircle2 className="size-4" />}
                                label="Verified"
                                value={user.email_verified ? t('common.yes') : t('common.no')}
                            />
                            <Info
                                icon={<Globe className="size-4" />}
                                label="Locale"
                                value={user.locale.toUpperCase()}
                            />
                            <Info
                                icon={<Calendar className="size-4" />}
                                label="Registered"
                                value={
                                    user.created_at
                                        ? new Date(user.created_at).toLocaleString()
                                        : '—'
                                }
                            />
                            <Info
                                icon={<Clock3 className="size-4" />}
                                label="Last login"
                                value={
                                    user.last_login_at
                                        ? new Date(user.last_login_at).toLocaleString()
                                        : '—'
                                }
                            />
                            <Info
                                icon={<MapPin className="size-4" />}
                                label="Last IP"
                                value={user.last_login_ip ?? '—'}
                            />
                        </div>
                    </section>

                    {user.seeker_profile ? (
                        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <h3 className="text-base font-semibold text-slate-900">
                                {t('admin.users.section_profile')} ·{' '}
                                {t('profile.seeker_profile')}
                            </h3>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <Info
                                    label={t('profile.seeker_headline')}
                                    value={user.seeker_profile.headline ?? '—'}
                                />
                                <Info
                                    label={t('profile.seeker_location')}
                                    value={user.seeker_profile.location ?? '—'}
                                />
                                <Info label="Country" value={user.seeker_profile.country ?? '—'} />
                                <Info
                                    label={t('profile.seeker_visibility')}
                                    value={user.seeker_profile.visibility}
                                />
                            </div>
                        </section>
                    ) : null}

                    {user.employer_profile ? (
                        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200">
                            <h3 className="text-base font-semibold text-slate-900">
                                {t('admin.users.section_profile')} ·{' '}
                                {t('profile.employer_profile')}
                            </h3>
                            <div className="mt-4 grid gap-3 sm:grid-cols-2">
                                <Info label="Company" value={user.employer_profile.company_name} />
                                <Info
                                    label={t('profile.employer_company_size')}
                                    value={user.employer_profile.company_size ?? '—'}
                                />
                                <Info
                                    label={t('profile.employer_industry')}
                                    value={user.employer_profile.industry ?? '—'}
                                />
                                <Info label="Country" value={user.employer_profile.country ?? '—'} />
                                <Info
                                    label={t('profile.employer_website')}
                                    value={user.employer_profile.website ?? '—'}
                                />
                                <Info
                                    label="Verified"
                                    value={
                                        user.employer_profile.verified_at
                                            ? new Date(
                                                  user.employer_profile.verified_at,
                                              ).toLocaleDateString()
                                            : t('common.no')
                                    }
                                />
                            </div>
                        </section>
                    ) : null}
                </div>

                {/* Audit log */}
                <aside className="space-y-3">
                    <h3 className="text-sm font-medium uppercase tracking-wider text-slate-500">
                        {t('admin.users.section_audit')}
                    </h3>
                    <div className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-slate-200">
                        {auditLogs.length === 0 ? (
                            <p className="py-6 text-center text-sm text-slate-500">
                                No activity yet.
                            </p>
                        ) : (
                            <ul className="-my-3 divide-y divide-slate-100">
                                {auditLogs.map((log) => (
                                    <li key={log.id} className="py-3">
                                        <p className="font-mono text-xs text-slate-700">
                                            {log.event}
                                        </p>
                                        <p className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                                            <Clock3 className="size-3" />
                                            {new Date(log.created_at).toLocaleString()}
                                            {log.ip_address ? (
                                                <>
                                                    <span>·</span>
                                                    <span>{log.ip_address}</span>
                                                </>
                                            ) : null}
                                        </p>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </aside>
            </div>
        </AdminLayout>
    );
}

function Info({
    icon,
    label,
    value,
}: {
    icon?: React.ReactNode;
    label: string;
    value: string;
}) {
    return (
        <div>
            <p className="flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-slate-500">
                {icon}
                {label}
            </p>
            <p className="mt-1 break-words text-sm text-slate-900">{value}</p>
        </div>
    );
}
