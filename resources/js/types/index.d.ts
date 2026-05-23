import type { UserRoleValue } from '@/lib/enums';

export interface User {
    id: number;
    name: string;
    email: string;
    role: UserRoleValue;
    locale: string;
    is_active: boolean;
    avatar_url: string | null;
    email_verified_at?: string | null;
}

export interface FlashMessages {
    success?: string;
    error?: string;
    info?: string;
}

export interface SiteSettings {
    service_name: string;
    logo_url: string | null;
    contact_email: string | null;
    whatsapp: string | null;
    phone: string | null;
    address: string | null;
    about_us: string | null;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>,
> = T & {
    auth: {
        user: User | null;
    };
    flash: FlashMessages;
    locale: string;
    availableLocales: string[];
    siteSettings: SiteSettings;
    ziggy: {
        location: string;
        url: string;
        port: number | null;
        defaults: Record<string, unknown>;
        routes: Record<string, unknown>;
    };
};
