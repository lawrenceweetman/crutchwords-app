import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary';

import './styles/index.css';
import './utils/i18n'; // Initialize i18n
import APP_CONFIG from '@/config/app.config';

/**
 * Main entry point for the Fluent application.
 *
 * This file sets up the React root, StrictMode, and the global ErrorBoundary.
 * It also ensures that the i18n service is initialized.
 */
// Set document metadata from app config
document.title = APP_CONFIG.name;
const metaDescription = document.querySelector('meta[name="description"]');
if (metaDescription) {
  metaDescription.setAttribute('content', APP_CONFIG.description);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>
);
