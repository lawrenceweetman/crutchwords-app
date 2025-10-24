# Components Directory

This directory contains **reusable, "dumb" UI components** that are used throughout the application.

## Purpose

Components here should be:

- **Presentational**: Focus on how things look
- **Reusable**: Can be used in multiple places
- **Props-driven**: Behavior controlled by props, not internal state
- **Pure**: Given the same props, render the same output

## Examples

- `Button.tsx` - Reusable button component with variants
- `Modal.tsx` - Generic modal dialog
- `Input.tsx` - Form input components
- `Card.tsx` - Card container components
- `ErrorBoundary.tsx` - Global error boundary (currently implemented)

## Guidelines

1. Keep components simple and focused on a single responsibility
2. Use TypeScript interfaces for props
3. Include JSDoc comments explaining purpose and usage
4. Write tests for each component
5. Use Tailwind CSS classes with design tokens from `tailwind.config.js`

## Usage Example

```tsx
import { Button } from '@/components/Button';

function MyFeature() {
  return (
    <Button variant="primary" onClick={handleClick}>
      Click me
    </Button>
  );
}
```

See [Development Guide](../../development-docs/development-guide.md) for more details.
