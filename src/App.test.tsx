import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('App', () => {
  it('renders the welcome message', () => {
    render(<App />);

    expect(screen.getByText('Hello, Fluent!')).toBeInTheDocument();
    expect(
      screen.getByText('Your journey to confident communication starts here.')
    ).toBeInTheDocument();
  });
});
