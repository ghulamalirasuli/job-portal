import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { describe, expect, it, vi, beforeAll } from 'vitest';

vi.mock('@inertiajs/react', () => ({
    router: { reload: vi.fn() },
}));

vi.mock('axios', () => ({
    default: { post: vi.fn().mockResolvedValue({}) },
}));

import { LanguageSwitcher } from '@/Components/LanguageSwitcher';

beforeAll(async () => {
    if (!i18n.isInitialized) {
        await i18n.use(initReactI18next).init({
            lng: 'en',
            fallbackLng: 'en',
            resources: {
                en: { common: { common: { language_switcher_label: 'Language' } } },
            },
            defaultNS: 'common',
        });
    }
});

function renderWithI18n(ui: React.ReactNode) {
    return render(<I18nextProvider i18n={i18n}>{ui}</I18nextProvider>);
}

describe('<LanguageSwitcher />', () => {
    it('shows the current language code', () => {
        renderWithI18n(<LanguageSwitcher />);
        expect(screen.getByRole('button')).toHaveTextContent(/en/i);
    });

    it('opens the menu and lists all supported locales', async () => {
        const user = userEvent.setup();
        renderWithI18n(<LanguageSwitcher />);

        await user.click(screen.getByRole('button'));

        for (const label of ['English', 'Français', 'Deutsch', 'Español']) {
            expect(screen.getByText(label)).toBeInTheDocument();
        }
    });
});
