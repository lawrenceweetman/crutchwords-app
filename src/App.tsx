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
    <div className="flex items-center justify-center min-h-screen p-4 xs:p-6">
      <header className="text-center max-w-2xl w-full">
        <h1 className="text-2xl xs:text-3xl md:text-4xl font-bold text-text-primary mb-4 xs:mb-6">
          {t('app.welcome', { appName: APP_CONFIG.name })}
        </h1>
        <p className="text-base xs:text-lg text-text-secondary mb-6 xs:mb-8">
          {t('onboarding.subtitle')}
        </p>
      </header>
    </div>
  );
}

export default App;
