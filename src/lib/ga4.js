// The base gtag.js snippet (script tag + initial config/pageview) lives
// statically in index.html — see the comment there for why. This just
// covers what a static snippet can't: SPA route changes, which never
// reload index.html, and custom event tracking.
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

export function trackPageView(path, title) {
  if (!MEASUREMENT_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: title,
    page_location: window.location.href,
  });
}

export function trackEvent(name, params = {}) {
  if (!MEASUREMENT_ID || typeof window.gtag !== 'function') return;
  window.gtag('event', name, params);
}
