import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { axe, toHaveNoViolations } from 'jest-axe';
import App from './App';

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

describe('App', () => {
  it('renders the welcome message', () => {
    render(<App />);

    expect(screen.getByText('Hello, Fluent!')).toBeInTheDocument();
    expect(
      screen.getByText('Your journey to confident communication starts here.')
    ).toBeInTheDocument();
  });

  it('renders the app name from config', () => {
    render(<App />);

    // Verify the app name is dynamically rendered from config
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('Hello, Fluent!');
  });

  it('should not have any accessibility violations', async () => {
    const { container } = render(<App />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
