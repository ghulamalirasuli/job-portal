import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en/common.json';
import fr from '@/locales/fr/common.json';
import de from '@/locales/de/common.json';
import es from '@/locales/es/common.json';
import it from '@/locales/it/common.json';
import nl from '@/locales/nl/common.json';
import pl from '@/locales/pl/common.json';
import pt from '@/locales/pt/common.json';

export const SUPPORTED_LOCALES = [
    { code: 'en', label: 'English', flag: 'GB' },
    { code: 'fr', label: 'Français', flag: 'FR' },
    { code: 'de', label: 'Deutsch', flag: 'DE' },
    { code: 'es', label: 'Español', flag: 'ES' },
    { code: 'it', label: 'Italiano', flag: 'IT' },
    { code: 'nl', label: 'Nederlands', flag: 'NL' },
    { code: 'pl', label: 'Polski', flag: 'PL' },
    { code: 'pt', label: 'Português', flag: 'PT' },
] as const;

export type LocaleCode = (typeof SUPPORTED_LOCALES)[number]['code'];

void i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources: {
            en: { common: en },
            fr: { common: fr },
            de: { common: de },
            es: { common: es },
            it: { common: it },
            nl: { common: nl },
            pl: { common: pl },
            pt: { common: pt },
        },
        fallbackLng: 'en',
        defaultNS: 'common',
        supportedLngs: SUPPORTED_LOCALES.map((l) => l.code),
        interpolation: { escapeValue: false },
        detection: {
            order: ['cookie', 'localStorage', 'navigator'],
            caches: ['cookie', 'localStorage'],
            lookupCookie: 'locale',
            lookupLocalStorage: 'locale',
            cookieMinutes: 60 * 24 * 365,
        },
    });

export default i18n;
