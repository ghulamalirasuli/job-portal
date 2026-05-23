import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark';

const STORAGE_KEY = 'europa-jobs.theme';

function getInitialTheme(): ThemeMode {
    if (typeof window === 'undefined') {
        return 'light';
    }
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
        return stored;
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

function applyTheme(mode: ThemeMode): void {
    if (typeof document === 'undefined') {
        return;
    }
    document.documentElement.classList.toggle('dark', mode === 'dark');
    document.documentElement.style.colorScheme = mode;
}

interface ThemeState {
    mode: ThemeMode;
    setMode: (mode: ThemeMode) => void;
    toggle: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
    mode: getInitialTheme(),
    setMode: (mode) => {
        window.localStorage.setItem(STORAGE_KEY, mode);
        applyTheme(mode);
        set({ mode });
    },
    toggle: () => {
        const next = get().mode === 'dark' ? 'light' : 'dark';
        get().setMode(next);
    },
}));

export function initTheme(): void {
    applyTheme(getInitialTheme());
}
