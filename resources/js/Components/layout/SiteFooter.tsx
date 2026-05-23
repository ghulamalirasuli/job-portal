import { useTranslation } from 'react-i18next';
import { Link, usePage } from '@inertiajs/react';
import { Mail, MapPin, Phone, Smartphone } from 'lucide-react';
import type { PageProps } from '@/types';

export function SiteFooter() {
    const { t } = useTranslation();
    const { siteSettings } = usePage<PageProps>().props;
    const year = new Date().getFullYear();
    const brandName = siteSettings?.service_name ?? t('app.name');

    const hasContact =
        !!(siteSettings?.contact_email ||
            siteSettings?.phone ||
            siteSettings?.whatsapp ||
            siteSettings?.address);

    return (
        <footer className="border-t border-default bg-white dark:bg-slate-900">
            {hasContact ? (
                <div className="container-page grid gap-6 border-b border-default py-8 sm:grid-cols-2 md:grid-cols-4">
                    {siteSettings.contact_email ? (
                        <FooterContact
                            icon={<Mail className="size-4" />}
                            label="Email"
                            value={siteSettings.contact_email}
                            href={`mailto:${siteSettings.contact_email}`}
                        />
                    ) : null}
                    {siteSettings.whatsapp ? (
                        <FooterContact
                            icon={<Smartphone className="size-4" />}
                            label="WhatsApp"
                            value={siteSettings.whatsapp}
                            href={`https://wa.me/${siteSettings.whatsapp.replace(/[^0-9]/g, '')}`}
                        />
                    ) : null}
                    {siteSettings.phone ? (
                        <FooterContact
                            icon={<Phone className="size-4" />}
                            label="Phone"
                            value={siteSettings.phone}
                            href={`tel:${siteSettings.phone}`}
                        />
                    ) : null}
                    {siteSettings.address ? (
                        <FooterContact
                            icon={<MapPin className="size-4" />}
                            label="Address"
                            value={siteSettings.address}
                        />
                    ) : null}
                </div>
            ) : null}

            <div className="container-page flex flex-col gap-4 py-6 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
                <p>
                    © {year} {brandName}. All rights reserved.
                </p>
                <nav className="flex flex-wrap items-center gap-4">
                    <Link href="/about" className="hover:text-slate-900 dark:hover:text-slate-100">
                        {t('nav.about')}
                    </Link>
                    <Link href="/contact" className="hover:text-slate-900 dark:hover:text-slate-100">
                        {t('footer.contact')}
                    </Link>
                    <Link href="/privacy" className="hover:text-slate-900 dark:hover:text-slate-100">
                        {t('footer.privacy')}
                    </Link>
                    <Link href="/terms" className="hover:text-slate-900 dark:hover:text-slate-100">
                        {t('footer.terms')}
                    </Link>
                    <Link href="/imprint" className="hover:text-slate-900 dark:hover:text-slate-100">
                        {t('footer.imprint')}
                    </Link>
                    <Link href="/gdpr" className="hover:text-slate-900 dark:hover:text-slate-100">
                        {t('footer.gdpr')}
                    </Link>
                </nav>
            </div>
        </footer>
    );
}

function FooterContact({
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
        <>
            <span className="inline-flex size-8 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                {icon}
            </span>
            <div className="min-w-0">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                    {label}
                </p>
                <p className="truncate text-sm text-slate-800 dark:text-slate-200">{value}</p>
            </div>
        </>
    );
    return href ? (
        <a
            href={href}
            target={href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className="flex items-center gap-3 hover:text-slate-900"
        >
            {inner}
        </a>
    ) : (
        <div className="flex items-center gap-3">{inner}</div>
    );
}
