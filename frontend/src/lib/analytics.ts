type AnalyticsEventName =
  | 'city_added'
  | 'date_time_changed'
  | 'meeting_time_viewed'
  | 'calendar_export'
  | 'share_link_copied'
  | 'share_text_copied'
  | 'preset_saved'
  | 'my_cities_saved'
  | 'poll_created'
  | 'poll_voted'
  | 'embed_code_copied'
  | 'pwa_install_prompted';

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

/** Thin wrapper around gtag. Safe on the server and when GA is not configured. */
export function trackEvent(name: AnalyticsEventName, params?: EventParams): void {
  if (typeof window === 'undefined' || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}
