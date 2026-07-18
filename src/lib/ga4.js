// Google Analytics 4 (gtag.js). Only loads when VITE_GA_MEASUREMENT_ID is
// set, so local/dev environments without a real GA4 property never send
// traffic to Google. See .env.example for setup.
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;

export function initGA4() {
  if (!MEASUREMENT_ID || initialized) return;
  initialized = true;

  const script = document.createElement('script');
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  script.async = true;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() { window.dataLayer.push(arguments); };
  window.gtag('js', new Date());
  // send_page_view is off here — this is a client-rendered SPA, so the
  // automatic pageview on init would only ever fire once. Page views are
  // sent manually on every route change instead (see trackPageView).
  window.gtag('config', MEASUREMENT_ID, { send_page_view: false });
}

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
