import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { useAppStore } from '@/store/useAppStore';
import { logger } from '@/utils/logger';

/**
 * Props for the OnboardingModal component
 */
interface OnboardingModalProps {
  /** Whether the modal is open */
  isOpen: boolean;
  /** Callback when modal is closed */
  onClose: () => void;
  /** Whether this is the first time the user is seeing the app */
  isFirstTime?: boolean;
}

/**
 * OnboardingModal component - Welcome modal for first-time users
 *
 * Features:
 * - Displays welcoming message from onboarding copy
 * - Option to skip or dismiss permanently
 * - Responsive design
 * - Accessible modal implementation
 */
export function OnboardingModal({
  isOpen,
  onClose,
  isFirstTime = true,
}: OnboardingModalProps): JSX.Element | null {
  const { t } = useTranslation();
  const { updateSettings } = useAppStore();
  const [dontShowAgain, setDontShowAgain] = useState(false);

  if (!isOpen) {
    return null;
  }

  /**
   * Handle getting started - close modal and continue to app
   */
  const handleGetStarted = () => {
    logger.info('User clicked get started from onboarding');

    if (dontShowAgain) {
      // Update settings to not show onboarding again
      updateSettings({ showOnboarding: false });
      logger.info('User opted not to show onboarding again');
    }

    onClose();
  };

  /**
   * Handle skip - close modal without updating settings
   */
  const handleSkip = () => {
    logger.info('User skipped onboarding');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            {t('onboarding.title', 'Welcome to Fluent!')}
          </h2>
        </div>

        {/* Modal Body */}
        <div className="px-6 py-4">
          <div className="text-gray-700 leading-relaxed whitespace-pre-line">
            {t('onboarding.subtitle')}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
          {/* Don't show again checkbox */}
          {isFirstTime && (
            <label className="flex items-center mb-4 text-sm text-gray-600">
              <input
                type="checkbox"
                checked={dontShowAgain}
                onChange={(e) => setDontShowAgain(e.target.checked)}
                className="mr-2 rounded border-gray-300 text-primary focus:ring-primary"
              />
              {t('onboarding.dontShowAgain', "Don't show this again")}
            </label>
          )}

          {/* Action buttons */}
          <div className="flex gap-3 justify-end">
            <button
              onClick={handleSkip}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            >
              {t('onboarding.skip', 'Skip for now')}
            </button>
            <button
              onClick={handleGetStarted}
              className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {t('onboarding.getStarted', "Let's Go")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
