# Features Directory

This directory contains **feature-specific "smart" components** that implement complete application features.

## Purpose

Feature components here should:

- **Be feature-complete**: Implement entire user-facing features
- **Manage state**: Use hooks and global state (Zustand)
- **Orchestrate logic**: Compose smaller components and hooks
- **Handle side effects**: API calls, data persistence, etc.

## Examples (Future Implementation)

- `SpeechRecorder/` - Complete speech recording interface (P1)
  - `SpeechRecorder.tsx` - Main component
  - `SpeechRecorder.test.tsx` - Tests
  - `TranscriptDisplay.tsx` - Subcomponent for transcript
- `SessionHistory/` - Session history and management (P2)
  - `SessionHistory.tsx` - Main component
  - `SessionList.tsx` - List of sessions
  - `SessionDetail.tsx` - Individual session view

- `Dashboard/` - Analytics dashboard (P3)
  - `Dashboard.tsx` - Main dashboard
  - `StatsChart.tsx` - Statistics visualization
  - `GoalTracker.tsx` - Goal tracking component

## Structure

Each feature should have its own directory with:

- Main component file
- Test file(s)
- Sub-components (if needed)
- Feature-specific types (if complex)

```
features/
├── SpeechRecorder/
│   ├── SpeechRecorder.tsx
│   ├── SpeechRecorder.test.tsx
│   ├── TranscriptDisplay.tsx
│   └── AnalysisPanel.tsx
```

## Guidelines

1. Keep features self-contained in their own directories
2. Use absolute imports (`@/`) for dependencies
3. Connect to global state via Zustand store
4. Use service layer for data operations
5. Write comprehensive tests including integration tests

## Usage Example

```tsx
import { SpeechRecorder } from '@/features/SpeechRecorder';

function App() {
  return (
    <main>
      <SpeechRecorder />
    </main>
  );
}
```

See [Product Requirements Document](../../development-docs/product-requirements-document.md) for feature roadmap.
