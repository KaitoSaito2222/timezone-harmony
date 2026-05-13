/**
 * Extracts a human-readable city name from a timezone identifier.
 * e.g. "America/New_York" → "New York", "Asia/Tokyo" → "Tokyo"
 */
export function getTimezoneCity(identifier: string): string {
  return (identifier.split('/').pop() ?? identifier).replace(/_/g, ' ');
}

/**
 * Detects the current locale from the URL pathname.
 * Safe to call outside React components (e.g. Zustand stores).
 */
export function getLocaleFromPathname(): string {
  if (typeof window === 'undefined') return 'en';
  const path = window.location.pathname;
  if (path.startsWith('/ja')) return 'ja';
  if (path.startsWith('/ko')) return 'ko';
  if (path.startsWith('/zh')) return 'zh';
  if (path.startsWith('/es')) return 'es';
  if (path.startsWith('/fr')) return 'fr';
  if (path.startsWith('/hi')) return 'hi';
  if (path.startsWith('/th')) return 'th';
  return 'en';
}
