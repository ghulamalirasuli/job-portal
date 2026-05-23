import { Head, Link } from '@inertiajs/react';
import { Briefcase, Building2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import GuestLayout from '@/Layouts/GuestLayout';

export default function RegisterChoose() {
    const { t } = useTranslation();

    return (
        <GuestLayout>
            <Head title={t('auth.register_title')} />
            <div className="text-center">
                <h1 className="text-2xl font-semibold text-slate-900">
                    {t('auth.register_title')}
                </h1>
                <p className="mt-2 text-sm text-slate-500">
                    {t('auth.register_subtitle')}
                </p>
            </div>

            <div className="mt-8 grid gap-4">
                <RoleCard
                    href="/register/seeker"
                    icon={<Briefcase className="size-5" />}
                    title={t('auth.register_as_seeker')}
                    body={t('home.for_seekers_body')}
                />
                <RoleCard
                    href="/register/employer"
                    icon={<Building2 className="size-5" />}
                    title={t('auth.register_as_employer')}
                    body={t('home.for_employers_body')}
                />
            </div>

            <p className="mt-8 text-center text-sm text-slate-500">
                {t('auth.have_account')}{' '}
                <Link href="/login" className="font-medium text-brand-600 hover:text-brand-700">
                    {t('auth.log_in')}
                </Link>
            </p>
        </GuestLayout>
    );
}

function RoleCard({
    href,
    icon,
    title,
    body,
}: {
    href: string;
    icon: React.ReactNode;
    title: string;
    body: string;
}) {
    return (
        <Link
            href={href}
            className="group flex items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 transition hover:border-brand-400 hover:shadow-md"
        >
            <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 group-hover:bg-brand-100">
                {icon}
            </span>
            <div className="text-left">
                <p className="font-semibold text-slate-900">{title}</p>
                <p className="mt-1 text-sm text-slate-500">{body}</p>
            </div>
        </Link>
    );
}
