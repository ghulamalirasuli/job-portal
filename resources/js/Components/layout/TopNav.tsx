import { Link, usePage } from '@inertiajs/react';
import { Briefcase, LogOut, Settings, ShieldCheck, User as UserIcon, FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { Avatar } from '@/Components/ui/Avatar';
import { LanguageSwitcher } from '@/Components/LanguageSwitcher';
import { ThemeToggle } from '@/Components/ThemeToggle';
import { Button } from '@/Components/ui/Button';
import type { PageProps } from '@/types';
import { cn } from '@/lib/utils';

export function TopNav() {
    const { t } = useTranslation();
    const { auth, siteSettings } = usePage<PageProps>().props;
    const user = auth.user;
    const brandName = siteSettings?.service_name ?? t('app.name');
    const logoUrl = siteSettings?.logo_url ?? null;

    return (
        <header className="sticky top-0 z-30 border-b border-default bg-white/90 backdrop-blur dark:bg-slate-950/90">
            <div className="container-page flex h-16 items-center justify-between gap-4">
                <div className="flex items-center gap-6">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100"
                    >
                        <span className="inline-flex size-9 items-center justify-center overflow-hidden rounded-lg bg-brand-600 text-white">
                            {logoUrl ? (
                                <img
                                    src={logoUrl}
                                    alt={brandName}
                                    className="size-9 object-cover"
                                />
                            ) : (
                                <Briefcase className="size-5" aria-hidden="true" />
                            )}
                        </span>
                        <span>{brandName}</span>
                    </Link>
                    <nav className="hidden items-center gap-1 md:flex">
                        <NavItem href="/jobs">{t('nav.jobs')}</NavItem>
                        <NavItem href="/companies">{t('nav.companies')}</NavItem>
                        <NavItem href="/employers">{t('nav.for_employers')}</NavItem>
                        <NavItem href="/about">{t('nav.about')}</NavItem>
                        <NavItem href="/contact">{t('footer.contact')}</NavItem>
                    </nav>
                </div>

                <div className="flex items-center gap-2">
                    <ThemeToggle variant="default" />
                    <LanguageSwitcher />
                    {user ? (
                        <Menu as="div" className="relative">
                            <MenuButton className="inline-flex items-center gap-2 rounded-full p-1 text-sm hover:bg-slate-100 dark:hover:bg-slate-800">
                                <Avatar name={user.name} src={user.avatar_url ?? undefined} size="sm" />
                                <span className="hidden pr-2 font-medium text-slate-700 dark:text-slate-200 sm:inline">
                                    {user.name}
                                </span>
                            </MenuButton>
                            <MenuItems
                                anchor="bottom end"
                                className="z-50 mt-2 w-56 origin-top-right rounded-lg bg-white p-1 shadow-lg ring-1 ring-slate-200 focus:outline-none dark:bg-slate-900 dark:ring-slate-700"
                            >
                                <MenuItem>
                                    {({ focus }) => (
                                        <Link
                                            href="/dashboard"
                                            className={cn(
                                                'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
                                                focus ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300',
                                            )}
                                        >
                                            <UserIcon className="size-4" />
                                            {t('nav.dashboard')}
                                        </Link>
                                    )}
                                </MenuItem>
                                {user.role === 'job_seeker' ? (
                                    <MenuItem>
                                        {({ focus }) => (
                                            <Link
                                                href="/seeker/resume"
                                                className={cn(
                                                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
                                                    focus ? 'bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100' : 'text-slate-700 dark:text-slate-300',
                                                )}
                                            >
                                                <FileText className="size-4" />
                                                {t('nav.resume_builder')}
                                            </Link>
                                        )}
                                    </MenuItem>
                                ) : null}
                                {user.role === 'admin' ? (
                                    <MenuItem>
                                        {({ focus }) => (
                                            <Link
                                                href="/admin"
                                                className={cn(
                                                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
                                                    focus ? 'bg-slate-100 text-slate-900' : 'text-slate-700',
                                                )}
                                            >
                                                <ShieldCheck className="size-4" />
                                                Admin panel
                                            </Link>
                                        )}
                                    </MenuItem>
                                ) : null}
                                <MenuItem>
                                    {({ focus }) => (
                                        <Link
                                            href="/profile"
                                            className={cn(
                                                'flex items-center gap-2 rounded-md px-3 py-2 text-sm',
                                                focus ? 'bg-slate-100 text-slate-900' : 'text-slate-700',
                                            )}
                                        >
                                            <Settings className="size-4" />
                                            {t('nav.settings')}
                                        </Link>
                                    )}
                                </MenuItem>
                                <div className="my-1 border-t border-slate-100" />
                                <MenuItem>
                                    {({ focus }) => (
                                        <Link
                                            href="/logout"
                                            method="post"
                                            as="button"
                                            className={cn(
                                                'flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm',
                                                focus ? 'bg-slate-100 text-slate-900' : 'text-slate-700',
                                            )}
                                        >
                                            <LogOut className="size-4" />
                                            {t('nav.logout')}
                                        </Link>
                                    )}
                                </MenuItem>
                            </MenuItems>
                        </Menu>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Link href="/login">
                                <Button variant="ghost" size="sm">
                                    {t('nav.login')}
                                </Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm">{t('nav.register')}</Button>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}

function NavItem({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="rounded-md px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-slate-100"
        >
            {children}
        </Link>
    );
}
