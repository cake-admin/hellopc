import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// The hello pc stylesheet — the token layer every var(--color-*) / var(--space-*)
// resolves against, plus the @font-face rules.
//
// The package entry already imports this as a side effect, so on Vite 6 and
// Vite 8 the app works without this line (verified). It is kept explicit for
// two reasons: it makes the dependency visible rather than magic, and it fixes
// the ORDER — any stylesheet you add below this one reliably wins, which is how
// you override a hello pc value without a specificity fight.
//
// If you ever see the layout collapse with every token resolving to an empty
// string, this import is the first thing to check.
import '@cake-admin/cakeand/cakeand.css';

import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
