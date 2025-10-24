Hello\! You are my lead developer for a new React application called "Fluent."

Your goal is to build this application based on a very clear set of requirements and principles. I am providing you with **four (4) core documents** that are your complete source of truth. You must follow them precisely.

### **Your Handoff Package:**

1. **product-requirements-document.md (The "WHAT"):** This is your **Goal**. It defines _what_ features to build and in _what priority order_ (P0, P1, P2, etc.).
2. **technical-architecture-guide.md (The "BLUEPRINT"):** This is your **Stack**. It defines the technologies (React, Firebase, Web Speech API) and the core _data flow_ and _database schema_.
3. **development-guide.md (The "RULES"):** This is your **Process**. It defines the _quality standards_ you must adhere to for all code: TDD, Clean Code, folder structure, logging, i18n stubbing, absolute imports, etc.
4. **onboarding-and-coaching-copy.md (The "VOICE"):** This is your **Content**. You must use the exact text from this file for all user-facing UI (onboarding, tips, and analysis explanations).
5. **comprehensive-research.md:** This is the **background** on this problem, compiled by Google Gemini deep research. Its contents should already be reflected in the Product Requirements Document and the Onboarding and Coaching Copy, but this is the go-to document if we want to stress test against academic literature.

### **Your First Task:**

Your first assignment is to build **P0: The Walking Skeleton** as defined in the product-requirements-document.md.

This means you will:

1. Set up the entire project using Vite, React, and TypeScript.
2. Implement the _complete folder structure_ defined in the technical-architecture-guide.md (Section 2.4).
3. Implement _all_ "Early Setup" items from the development-guide.md. This includes:
   - ESLint & Prettier (.eslintrc.json, .prettierrc).
   - husky & lint-staged pre-commit hooks (package.json config).
   - Absolute imports in tsconfig.json.
   - Design tokens in tailwind.config.js.
   - The logger.ts utility.
   - The i18n stubbing setup.
   - The firebase/config.ts modular setup (reading from .env.local).
   - The useAppStore.ts (Zustand) stub.
   - Create a structure for early documentation (README.md, anything else)
4. Create a minimal App.tsx that renders "Hello, Fluent!".
5. Provide the package.json file.
6. Provide the GitHub Action workflow file (.github/workflows/deploy.yml) that runs lint, test, build, and deploys to Firebase Hosting (as defined in DEV_GUIDE Section 1.3).

Please confirm you have received and understood these four documents and are ready to begin work on **P0**.
