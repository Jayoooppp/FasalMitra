'use client';
import { createContext, useContext, ReactNode } from 'react';
import translations, { Language, LANG_MAP } from '@/i18n/translations';
import { useAuth } from './AuthContext';

type TranslateFn = (key: string) => string;

const LanguageContext = createContext<TranslateFn>((key) => key);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const { user } = useAuth();

    const lang = user?.preferredLanguage as Language | undefined;
    const code = lang ? LANG_MAP[lang] || 'en' : 'en';
    const dict = translations[code] || translations.en;

    const t: TranslateFn = (key: string) => dict[key] ?? translations.en[key] ?? key;

    return (
        <LanguageContext.Provider value={t}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useTranslation(): TranslateFn {
    return useContext(LanguageContext);
}
