# Services Directory

This directory contains **service layer abstractions** for data operations and external APIs.

## Purpose

Services here should:

- **Abstract external dependencies**: Hide implementation details of Firebase, APIs
- **Provide clean APIs**: Simple, testable functions
- **Handle errors**: Proper error handling and logging
- **Be framework-agnostic**: Pure TypeScript, no React dependencies

## Examples (Future Implementation)

- `firestoreService.ts` - Firestore data operations (P2)

  ```typescript
  export async function savePracticeSession(userId: string, session: SessionData): Promise<void>;
  export async function getUserSessions(userId: string): Promise<SessionData[]>;
  export async function deleteSession(userId: string, sessionId: string): Promise<void>;
  ```

- `analysisService.ts` - Speech analysis logic (P1)

  ```typescript
  export function getHighlightedTranscript(text: string): TranscriptSegment[];
  export function getSessionAnalysis(text: string, duration: number): AnalysisResult;
  ```

- `authService.ts` - Authentication operations (P1)
  ```typescript
  export async function signInAnonymously(): Promise<User>;
  export async function linkGoogleAccount(): Promise<User>;
  export async function signOut(): Promise<void>;
  ```

## Guidelines

1. Export pure functions, not classes (unless truly needed)
2. All functions should be async where appropriate
3. Use try-catch blocks and log errors via `logger.error()`
4. Return typed results, not raw Firebase/API objects
5. Write comprehensive unit tests with mocked dependencies
6. Document all parameters and return types with JSDoc

## Testing Pattern

Services should be easy to mock in component tests:

```typescript
// In test setup
vi.mock('@/services/firestoreService', () => ({
  savePracticeSession: vi.fn(),
  getUserSessions: vi.fn(() => Promise.resolve([])),
}));
```

## Usage Example

```tsx
import { savePracticeSession } from '@/services/firestoreService';

async function handleSave(session: SessionData) {
  try {
    await savePracticeSession(userId, session);
    showSuccessMessage();
  } catch (error) {
    showErrorMessage();
  }
}
```

See [Development Guide](../../development-docs/development-guide.md) section 2.11 (API Service Layer) and [Technical Architecture Guide](../../development-docs/technical-architecture-guide.md) for more details.
