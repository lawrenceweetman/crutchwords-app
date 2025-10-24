# Hooks Directory

This directory contains **custom React hooks** that encapsulate reusable logic.

## Purpose

Custom hooks here should:

- **Encapsulate logic**: Extract complex component logic into reusable hooks
- **Follow hook rules**: Use the `use` prefix, follow React hook guidelines
- **Be testable**: Include comprehensive tests
- **Have clear APIs**: Well-defined inputs and outputs

## Examples (Future P1 Implementation)

- `useSpeechRecognition.ts` - Hook for Web Speech API integration
- `useFirebaseAuth.ts` - Hook for authentication state
- `useSessionHistory.ts` - Hook for managing practice session data
- `useLocalStorage.ts` - Hook for persistent local storage

## Guidelines

1. Name hooks with the `use` prefix (e.g., `useCustomHook`)
2. Document hook parameters and return values with JSDoc
3. Handle cleanup in `useEffect` return functions
4. Write comprehensive tests including edge cases
5. Keep hooks focused on a single responsibility

## Usage Example

```tsx
import { useSpeechRecognition } from '@/hooks/useSpeechRecognition';

function RecordingComponent() {
  const { isRecording, transcript, startRecording, stopRecording } = useSpeechRecognition();

  return (
    <div>
      <button onClick={startRecording}>Start</button>
      <p>{transcript}</p>
    </div>
  );
}
```

See [Development Guide](../../development-docs/development-guide.md) and [Technical Architecture Guide](../../development-docs/technical-architecture-guide.md) for more details.
