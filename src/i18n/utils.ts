/**
 * i18n Utilities
 * Helper functions for internationalization
 */

import en from './en.json';
import id from './id.json';

export const languages = {
  en: 'English',
  id: 'Bahasa Indonesia',
};

export const defaultLang = 'en';

export const ui = {
  en,
  id,
} as const;

export type Language = keyof typeof ui;

/**
 * Get translation for a key
 */
export function useTranslations(lang: Language) {
  return function t(key: string): string {
    const keys = key.split('.');
    let value: any = ui[lang];
    
    for (const k of keys) {
      value = value?.[k];
    }
    
    return value || key;
  };
}

/**
 * Get language from URL pathname
 */
export function getLangFromUrl(url: URL): Language {
  const [, lang] = url.pathname.split('/');
  if (lang in ui) return lang as Language;
  return defaultLang;
}

/**
 * Get localized path
 */
export function getLocalizedPath(path: string, lang: Language): string {
  // Remove leading slash
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  
  // For default language (en), don't add prefix
  if (lang === defaultLang) {
    return `/${cleanPath}`;
  }
  
  // For other languages, add language prefix
  return `/${lang}/${cleanPath}`;
}

/**
 * Get alternate language path
 */
export function getAlternateLangPath(currentUrl: URL, targetLang: Language): string {
  const currentLang = getLangFromUrl(currentUrl);
  let path = currentUrl.pathname;
  
  // Remove current language prefix if exists
  if (currentLang !== defaultLang) {
    path = path.replace(`/${currentLang}`, '');
  }
  
  // Add target language prefix if not default
  if (targetLang !== defaultLang) {
    path = `/${targetLang}${path}`;
  }
  
  // Ensure path starts with /
  if (!path.startsWith('/')) {
    path = `/${path}`;
  }
  
  return path;
}
