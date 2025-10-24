import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from './App';
import { I18nWrapper } from './tests/setup';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

describe('App', () => {
  it('renders the welcome message using i18n', () => {
    render(
      <I18nWrapper>
        <App />
      </I18nWrapper>
    );

    // Check for the translated welcome message
    expect(screen.getByText('Hello, Fluent!')).toBeInTheDocument();
    // Check for the translated subtitle
    expect(
      screen.getByText('Your journey to confident communication starts here.')
    ).toBeInTheDocument();
  });

  it('should not have any accessibility violations', async () => {
    const { container } = render(
      <I18nWrapper>
        <App />
      </I18nWrapper>
    );
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
