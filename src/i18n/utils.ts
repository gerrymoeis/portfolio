export const defaultLang = 'en';

export function getLangFromUrl(url: URL): string {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en' || lang === 'id') return lang;
  return defaultLang;
}
