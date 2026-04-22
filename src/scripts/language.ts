/**
 * Client-side Language System
 * Switches language without page reload
 */

export type Language = 'en' | 'id';

const LANGUAGE_STORAGE_KEY = 'portfolio-language';

/**
 * Get stored language
 */
export function getStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  if (stored === 'en' || stored === 'id') {
    return stored;
  }
  
  return null;
}

/**
 * Get browser language
 */
export function getBrowserLanguage(): Language {
  if (typeof window === 'undefined') return 'en';
  
  const browserLang = navigator.language.toLowerCase();
  return browserLang.startsWith('id') ? 'id' : 'en';
}

/**
 * Get current language
 */
export function getCurrentLanguage(): Language {
  return getStoredLanguage() || getBrowserLanguage();
}

/**
 * Set language
 */
export function setLanguage(lang: Language): void {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  document.documentElement.setAttribute('lang', lang);
  
  // Dispatch event for components to update
  window.dispatchEvent(new CustomEvent('languagechange', {
    detail: { language: lang }
  }));
}

/**
 * Toggle language
 */
export function toggleLanguage(): Language {
  const current = getCurrentLanguage();
  const next: Language = current === 'en' ? 'id' : 'en';
  setLanguage(next);
  return next;
}

/**
 * Initialize language
 */
export function initLanguage(): void {
  if (typeof window === 'undefined') return;
  
  const lang = getCurrentLanguage();
  document.documentElement.setAttribute('lang', lang);
}

// Auto-initialize
if (typeof window !== 'undefined') {
  initLanguage();
}
