import { Link, router, usePage } from '@inertiajs/react';
import {
    type PropsWithChildren,
    type ReactNode,
    useEffect,
    useState,
} from 'react';
import {
    Briefcase,
    Building2,
    ChevronLeft,
    LayoutDashboard,
    LogOut,
    Mail,
    Menu as MenuIcon,
    Settings as SettingsIcon,
    ShieldCheck,
    Trash2,
    UserCircle,
    Users,
    X,
} from 'lucide-react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { useTranslation } from 'react-i18next';
import { Alert } from '@/Components/ui/Alert';
import { Avatar } from '@/Components/ui/Avatar';
import { LanguageSwitcher } from '@/Components/LanguageSwitcher';
import { ThemeToggle } from '@/Components/ThemeToggle';
import { cn } from '@/lib/utils';
import type { PageProps } from '@/types';

interface NavItem {
    label: string;
    href: string;
    icon: ReactNode;
    match: (path: string) => boolean;
}

interface Props {
    title?: string;
    subtitle?: string;
    breadcrumbs?: Array<{ label: string; href?: string }>;
    actions?: ReactNode;
}

export default function AdminLayout({
    title,
    subtitle,
    breadcrumbs,
    actions,
    children,
}: PropsWithChildren<Props>) {
    const { auth, flash, siteSettings, ziggy } = usePage<PageProps>().props;
    const user = auth.user;
    const { t } = useTranslation();

    const [collapsed, setCollapsed] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        return window.localStorage.getItem('admin.sidebar.collapsed') === '1';
    });
    const [mobileOpen, setMobileOpen] = useState<boolean>(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.localStorage.setItem(
                'admin.sidebar.collapsed',
                collapsed ? '1' : '0',
            );
        }
    }, [collapsed]);

    useEffect(() => {
        setMobileOpen(false);
    }, [ziggy.location]);

    const currentPath = (() => {
        try {
            return new URL(ziggy.location).pathname;
        } catch {
            return '/';
        }
    })();

    const nav: NavItem[] = [
        {
            label: t('admin.nav.dashboard'),
            href: '/admin',
            icon: <LayoutDashboard className="size-5" />,
            match: (p) => p === '/admin',
        },
        {
            label: t('admin.nav.users'),
            href: '/admin/users',
            icon: <Users className="size-5" />,
            match: (p) => p.startsWith('/admin/users'),
        },
        {
            label: t('admin.nav.companies'),
            href: '/admin/companies',
            icon: <Building2 className="size-5" />,
            match: (p) => p.startsWith('/admin/companies'),
        },
        {
            label: t('admin.nav.employees'),
            href: '/admin/employees',
            icon: <UserCircle className="size-5" />,
            match: (p) => p.startsWith('/admin/employees'),
        },
        {
            label: t('admin.nav.jobs'),
            href: '/admin/jobs',
            icon: <Briefcase className="size-5" />,
            match: (p) => p.startsWith('/admin/jobs'),
        },
        {
            label: t('admin.nav.contact'),
            href: '/admin/contact-messages',
            icon: <Mail className="size-5" />,
            match: (p) => p.startsWith('/admin/contact-messages'),
        },
        {
            label: t('admin.nav.trash'),
            href: '/admin/trash',
            icon: <Trash2 className="size-5" />,
            match: (p) => p.startsWith('/admin/trash'),
        },
        {
            label: t('admin.nav.settings'),
            href: '/admin/settings',
            icon: <SettingsIcon className="size-5" />,
            match: (p) => p.startsWith('/admin/settings'),
        },
    ];

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-slate-100 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            {/* Mobile backdrop */}
            {mobileOpen ? (
                <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-0 z-30 bg-slate-900/60 backdrop-blur-sm lg:hidden"
                />
            ) : null}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-40 flex flex-col border-r border-slate-800 bg-slate-900 text-slate-100 transition-all duration-200 ease-in-out',
                    collapsed ? 'lg:w-20' : 'lg:w-64',
                    mobileOpen
                        ? 'w-64 translate-x-0'
                        : '-translate-x-full lg:translate-x-0',
                )}
            >
                {/* Brand */}
                <div
                    className={cn(
                        'flex h-16 items-center gap-3 border-b border-slate-800 px-4',
                        collapsed && 'lg:justify-center lg:px-2',
                    )}
                >
                    <span className="inline-flex size-10 shrink-0 items-center justify-center rounded-lg bg-brand-600 text-white shadow-md">
                        {siteSettings.logo_url ? (
                            <img
                                src={siteSettings.logo_url}
                                alt={siteSettings.service_name}
                                className="size-10 rounded-lg object-cover"
                            />
                        ) : (
                            <Briefcase className="size-5" aria-hidden="true" />
                        )}
                    </span>
                    <div
                        className={cn(
                            'flex min-w-0 flex-1 flex-col',
                            collapsed && 'lg:hidden',
                        )}
                    >
                        <span className="truncate text-sm font-semibold">
                            {siteSettings.service_name}
                        </span>
                        <span className="text-xs text-slate-400">
                            {t('admin.brand_tag')}
                        </span>
                    </div>
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        className="ml-auto inline-flex size-9 items-center justify-center rounded-md text-slate-300 hover:bg-slate-800 lg:hidden"
                        aria-label="Close menu"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                {/* Nav */}
                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    <ul className="space-y-1">
                        {nav.map((item) => {
                            const active = item.match(currentPath);
                            return (
                                <li key={item.href}>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                                            active
                                                ? 'bg-brand-600 text-white shadow-sm'
                                                : 'text-slate-300 hover:bg-slate-800 hover:text-white',
                                            collapsed && 'lg:justify-center lg:px-2',
                                        )}
                                        title={collapsed ? item.label : undefined}
                                    >
                                        <span className="shrink-0">{item.icon}</span>
                                        <span className={cn(collapsed && 'lg:hidden')}>
                                            {item.label}
                                        </span>
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                {/* Bottom user card */}
                <div className="border-t border-slate-800 p-3">
                    <div
                        className={cn(
                            'flex items-center gap-3 rounded-lg bg-slate-800/60 p-2',
                            collapsed && 'lg:justify-center lg:p-1',
                        )}
                    >
                        <Avatar
                            name={user?.name ?? 'A'}
                            src={user?.avatar_url ?? undefined}
                            size="sm"
                        />
                        <div
                            className={cn(
                                'min-w-0 flex-1',
                                collapsed && 'lg:hidden',
                            )}
                        >
                            <p className="truncate text-sm font-medium text-white">
                                {user?.name}
                            </p>
                            <p className="truncate text-xs text-slate-400">
                                {user?.email}
                            </p>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Content area */}
            <div
                className={cn(
                    'flex min-h-screen flex-col transition-[padding] duration-200',
                    'lg:pl-64',
                    collapsed && 'lg:pl-20',
                )}
            >
                {/* Topbar */}
                <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-default bg-white px-4 shadow-sm dark:bg-slate-900 sm:px-6">
                    <button
                        type="button"
                        onClick={() => setMobileOpen(true)}
                        className="inline-flex size-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
                        aria-label="Open menu"
                    >
                        <MenuIcon className="size-5" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setCollapsed((v) => !v)}
                        className="hidden size-10 items-center justify-center rounded-md text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:inline-flex"
                        aria-label={
                            collapsed ? 'Expand sidebar' : 'Collapse sidebar'
                        }
                    >
                        <ChevronLeft
                            className={cn(
                                'size-5 transition-transform',
                                collapsed && 'rotate-180',
                            )}
                        />
                    </button>

                    {breadcrumbs && breadcrumbs.length > 0 ? (
                        <nav className="hidden flex-1 items-center gap-1 text-sm text-muted md:flex">
                            {breadcrumbs.map((b, i) => (
                                <span key={`${b.label}-${i}`} className="flex items-center gap-1">
                                    {i > 0 ? (
                                        <span className="text-slate-300">/</span>
                                    ) : null}
                                    {b.href ? (
                                        <Link
                                            href={b.href}
                                            className="hover:text-slate-900 dark:hover:text-slate-100"
                                        >
                                            {b.label}
                                        </Link>
                                    ) : (
                                        <span className="font-medium text-slate-700 dark:text-slate-200">
                                            {b.label}
                                        </span>
                                    )}
                                </span>
                            ))}
                        </nav>
                    ) : (
                        <div className="flex-1" />
                    )}

                    <div className="ml-auto flex items-center gap-2">
                        <ThemeToggle variant="admin" />
                        <LanguageSwitcher />
                        <Link
                            href="/"
                            className="hidden rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100 sm:inline-flex"
                        >
                            {t('admin.view_site')}
                        </Link>
                        <Menu as="div" className="relative">
                            <MenuButton className="inline-flex items-center gap-2 rounded-full p-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Avatar
                                    name={user?.name ?? 'A'}
                                    src={user?.avatar_url ?? undefined}
                                    size="sm"
                                />
                                <span className="hidden pr-2 font-medium text-slate-700 dark:text-slate-200 sm:inline">
                                    {user?.name}
                                </span>
                            </MenuButton>
                            <MenuItems
                                anchor="bottom end"
                                className="z-50 mt-2 w-56 origin-top-right rounded-lg bg-white p-1 shadow-lg ring-1 ring-slate-200 focus:outline-none dark:bg-slate-900 dark:ring-slate-700"
                            >
                                <div className="border-b border-slate-100 px-3 py-2 dark:border-slate-800">
                                    <p className="text-xs text-muted">
                                        {t('admin.signed_in_as')}
                                    </p>
                                    <p className="truncate text-sm font-medium text-slate-900 dark:text-slate-100">
                                        {user?.email}
                                    </p>
                                    <p className="mt-1 flex items-center gap-1 text-xs text-brand-700">
                                        <ShieldCheck className="size-3.5" />
                                        {t('admin.admin_role')}
                                    </p>
                                </div>
                                <MenuItem>
                                    {({ focus }) => (
                                        <Link
                                            href="/profile"
                                            className={cn(
                                                'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
                                                focus
                                                    ? 'bg-slate-100 text-slate-900'
                                                    : 'text-slate-700',
                                            )}
                                        >
                                            <SettingsIcon className="size-4" />
                                            {t('nav.profile')}
                                        </Link>
                                    )}
                                </MenuItem>
                                <MenuItem>
                                    {({ focus }) => (
                                        <button
                                            type="button"
                                            onClick={handleLogout}
                                            className={cn(
                                                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm',
                                                focus
                                                    ? 'bg-slate-100 text-slate-900'
                                                    : 'text-slate-700',
                                            )}
                                        >
                                            <LogOut className="size-4" />
                                            {t('nav.logout')}
                                        </button>
                                    )}
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    </div>
                </header>

                {/* Page header */}
                {(title || actions) && (
                    <div className="border-b border-default bg-white px-4 py-5 dark:bg-slate-900 sm:px-6 lg:px-8">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                {title ? (
                                    <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 sm:text-2xl">
                                        {title}
                                    </h1>
                                ) : null}
                                {subtitle ? (
                                    <p className="mt-1 text-sm text-muted">
                                        {subtitle}
                                    </p>
                                ) : null}
                            </div>
                            {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
                        </div>
                    </div>
                )}

                {/* Main */}
                <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
                    {flash?.success ? (
                        <div className="mb-4">
                            <Alert tone="success">{flash.success}</Alert>
                        </div>
                    ) : null}
                    {flash?.error ? (
                        <div className="mb-4">
                            <Alert tone="error">{flash.error}</Alert>
                        </div>
                    ) : null}
                    {children}
                </main>

                <footer className="border-t border-default bg-white px-4 py-4 text-center text-xs text-muted dark:bg-slate-900 sm:px-6 lg:px-8">
                    {t('footer.copyright', { year: new Date().getFullYear() })}
                </footer>
            </div>
        </div>
    );
}
