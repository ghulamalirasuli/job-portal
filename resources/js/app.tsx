import '../css/app.css';
import './bootstrap';
import '@/lib/i18n';
import { initTheme } from '@/lib/theme';

initTheme();

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { type PropsWithChildren, StrictMode, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { usePage } from '@inertiajs/react';
import type { PageProps } from '@/types';

const appName = import.meta.env.VITE_APP_NAME ?? 'Europa Jobs';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 30_000,
            retry: 1,
            refetchOnWindowFocus: false,
        },
    },
});

function LocaleSync({ children }: PropsWithChildren) {
    const { locale } = usePage<PageProps>().props;
    const { i18n } = useTranslation();
    useEffect(() => {
        if (locale && i18n.resolvedLanguage !== locale) {
            void i18n.changeLanguage(locale);
        }
    }, [locale, i18n]);
    return <>{children}</>;
}

void createInertiaApp({
    title: (title) => (title ? `${title} · ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx'),
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(
            <StrictMode>
                <QueryClientProvider client={queryClient}>
                    <App {...props}>
                        {({ Component, props: pageProps, key }) => (
                            <LocaleSync>
                                <Component key={key} {...pageProps} />
                            </LocaleSync>
                        )}
                    </App>
                </QueryClientProvider>
            </StrictMode>,
        );
    },
    progress: { color: '#2563eb' },
});
