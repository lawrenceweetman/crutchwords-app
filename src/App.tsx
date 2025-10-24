import { useTranslation } from 'react-i18next';

import APP_CONFIG from '@/config/app.config';

/**
 * Main application component for the Fluent app.
 * This is the root component that renders the entire application.
 * @returns {JSX.Element} The rendered App component.
 */
function App(): JSX.Element {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-center min-h-screen">
      <header className="text-center">
        <h1 className="text-4xl font-bold text-text-primary mb-4">
          {t('app.welcome', { appName: APP_CONFIG.name })}
        </h1>
        <p className="text-lg text-text-secondary">{t('onboarding.subtitle')}</p>
      </header>
    </div>
  );
}

export default App;
