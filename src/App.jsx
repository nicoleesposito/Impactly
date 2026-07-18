import { RouterProvider } from 'react-router-dom';
import { AppProviders } from './context/index.jsx';
import { router } from './routes/index.jsx';
import { initGA4, trackPageView } from './lib/ga4.js';

initGA4();
trackPageView(window.location.pathname, document.title);
let lastTrackedPath = window.location.pathname;
router.subscribe((state) => {
  if (state.location.pathname === lastTrackedPath) return;
  lastTrackedPath = state.location.pathname;
  // Wait a frame so the destination page's own useEffect has set
  // document.title before we report it.
  requestAnimationFrame(() => {
    trackPageView(state.location.pathname, document.title);
  });
});

export default function App() {
  return (
    <AppProviders>
      <RouterProvider router={router} />
    </AppProviders>
  );
}
