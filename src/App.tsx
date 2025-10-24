import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import ErrorBoundary from '@/components/ErrorBoundary';
import { OnboardingModal } from '@/components/OnboardingModal';
import APP_CONFIG from '@/config/app.config';
import { SpeechRecorder } from '@/features/SpeechRecorder';
import { useAuth } from '@/hooks/useAuth';
import { useAppStore } from '@/store/useAppStore';
import { logger } from '@/utils/logger';

/**
 * Main application component for the Fluent app.
 * This is the root component that renders the entire application.
 * @returns {JSX.Element} The rendered App component.
 */
function App(): JSX.Element {
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const { error: appError, settings, setError } = useAppStore();

  const [showOnboarding, setShowOnboarding] = useState(false);

  /**
   * Handle onboarding modal visibility
   */
  useEffect(() => {
    // Show onboarding for new users or when explicitly enabled
    if (isAuthenticated && settings.showOnboarding) {
      // Show onboarding if user is anonymous (first time) or if explicitly enabled
      const shouldShow = !user || user.isAnonymous;
      setShowOnboarding(shouldShow);
    }
  }, [isAuthenticated, settings.showOnboarding, user]);

  /**
   * Handle session completion
   */
  const handleSessionComplete = (
    transcript: string,
    analysis: { totalWordCount: number; totalFillerCount: number }
  ) => {
    logger.info('Session completed', {
      transcriptLength: transcript.length,
      wordCount: analysis.totalWordCount,
      fillerCount: analysis.totalFillerCount,
    });

    // Could add session saving logic here for P2
  };

  /**
   * Handle onboarding close
   */
  const handleOnboardingClose = () => {
    setShowOnboarding(false);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-900">{t('app.name', 'Fluent')}</h1>
                <p className="text-sm text-gray-600">
                  {t('app.description', 'Speak with Confidence')}
                </p>
              </div>

              {/* User info */}
              {isAuthenticated && user && (
                <div className="text-right">
                  <div className="text-sm text-gray-600">
                    {user.isAnonymous ? 'Anonymous User' : 'User'}
                  </div>
                  <div className="text-xs text-gray-500">ID: {user.id.slice(0, 8)}...</div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8">
          {/* Error Display */}
          {appError && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    {t('common.error', 'An error occurred')}
                  </h3>
                  <div className="mt-2 text-sm text-red-700">{appError}</div>
                  <div className="mt-4">
                    <div className="-mx-2 -my-1.5 flex">
                      <button
                        onClick={() => setError(null)}
                        className="bg-red-50 px-2 py-1.5 rounded-md text-sm font-medium text-red-800 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-red-50 focus:ring-red-600"
                      >
                        {t('common.close', 'Close')}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Welcome Message for New Users */}
          {!isAuthenticated && (
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                {t('app.welcome', { appName: APP_CONFIG.name })}
              </h2>
              <p className="text-gray-600 max-w-2xl mx-auto">{t('onboarding.subtitle')}</p>
            </div>
          )}

          {/* Speech Recorder */}
          <SpeechRecorder
            onSessionComplete={handleSessionComplete}
            language="en-US"
            className="mb-8"
          />

          {/* Tips Section */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-lg font-semibold text-blue-900 mb-4">💡 Quick Tip</h2>
            <p className="text-blue-800 leading-relaxed">{t('tips.awareness')}</p>
          </div>
        </main>

        {/* Onboarding Modal */}
        <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingClose} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
