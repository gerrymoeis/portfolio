/**
 * Theme System
 * Handles light/dark theme toggle with localStorage persistence
 * and system preference detection
 */

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'portfolio-theme';

/**
 * Get the current theme from localStorage or system preference
 */
export function getStoredTheme(): Theme | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  
  return null;
}

/**
 * Get system preference for theme
 */
export function getSystemTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  
  return window.matchMedia('(prefers-color-scheme: light)').matches 
    ? 'light' 
    : 'dark';
}

/**
 * Get the current active theme
 */
export function getCurrentTheme(): Theme {
  if (typeof window === 'undefined') return 'dark';
  
  const stored = getStoredTheme();
  if (stored) return stored;
  
  return getSystemTheme();
}

/**
 * Apply theme to document
 */
export function applyTheme(theme: Theme): void {
  if (typeof window === 'undefined') return;
  
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_STORAGE_KEY, theme);
}

/**
 * Toggle between light and dark theme
 */
export function toggleTheme(): Theme {
  const current = getCurrentTheme();
  const next: Theme = current === 'dark' ? 'light' : 'dark';
  
  applyTheme(next);
  
  // Dispatch custom event for other components to react
  window.dispatchEvent(new CustomEvent('themechange', { 
    detail: { theme: next } 
  }));
  
  return next;
}

/**
 * Initialize theme on page load
 * This should be called as early as possible to prevent flash
 */
export function initTheme(): void {
  if (typeof window === 'undefined') return;
  
  const theme = getCurrentTheme();
  document.documentElement.setAttribute('data-theme', theme);
  
  // Listen for system theme changes
  const mediaQuery = window.matchMedia('(prefers-color-scheme: light)');
  mediaQuery.addEventListener('change', (e) => {
    // Only update if user hasn't set a preference
    if (!getStoredTheme()) {
      const newTheme = e.matches ? 'light' : 'dark';
      applyTheme(newTheme);
    }
  });
}

// Auto-initialize on script load (for inline script)
if (typeof window !== 'undefined') {
  initTheme();
}
