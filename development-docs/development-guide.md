# **Development Guide: "Fluent" App**

This document outlines the core principles and standards for developing the "Fluent" application. Adhering to these guidelines from day one will ensure a high-quality, maintainable, and scalable codebase.

**⚠️ AI AGENTS:** See [instructions-for-AI-agents.md](./instructions-for-AI-agents.md) for specific guidance on non-blocking command execution and efficient development workflows.

## **1\. Core Principles**

### **1.1. Test-Driven Development (TDD)**

- **Principle:** We practice Test-Driven Development. No feature is considered complete until it has comprehensive tests.
- **Workflow:**
  1. Write a failing test that defines a new feature or improvement.
  2. Write the minimum code necessary to make the test pass.
  3. Refactor the code to meet our quality standards.
- **Gating:** All tests **must** pass before any code is committed. This will be enforced by pre-commit hooks and the CI/CD pipeline. We will use a testing framework like **Jest**, **React Testing Library**, and **jest-axe** (for accessibility).

### **1.2. Clean Code & Organization**

- **Principle:** We follow "Clean Code" principles. Readability, simplicity, and maintainability are prioritized over cleverness.
- **Guidelines:**
  - **DRY (Don't Repeat Yourself):** Abstract and reuse code where it makes sense.
  - **Single Responsibility Principle:** Components and functions should do one thing and do it well.
  - **Meaningful Naming:** Variables, functions, and components will be named clearly and descriptively.
  - **Good Organization:** The project structure (see section 2.4) will be followed to keep concerns separated.
  - **Clear Documentation:** All new functions, components, and types/interfaces will have JSDoc-style comments explaining their purpose, parameters, and return values. This is critical for both human and AI understanding.

### **1.3. Deploy Early, Deploy Often**

- **Principle:** We will get a "walking skeleton" (the absolute bare-minimum app) deployable as soon as possible and keep it in a working state.
- **Technology:** We will use **Firebase Hosting** for deployment. It's fast, has a global CDN, and integrates perfectly with a React app.
- **Automation:** We will set up a **GitHub Action** (CI/CD) _immediately_. This action will:
  1. Trigger on every push to the main (or develop) branch.
  2. Install dependencies.
  3. Run the linter (npm run lint).
  4. Run all tests (npm test).
  5. (If all pass) Build the production app (npm run build).
  6. (If build passes) Deploy the build directory to Firebase Hosting.
  7. We will also add a step to report on bundle size to prevent performance regressions.

## **2\. Early Setup (The "Don't Retrofit Later" List)**

This section covers technical setup items that are far more time-consuming to retrofit than to implement from the start.

### **2.1. Code Consistency (Linting & Formatting)**

- **Problem:** Inconsistent code styles ("tabs vs. spaces") and simple errors clutter the codebase and make pull requests noisy.
- **Solution:**
  - **ESLint:** To find and fix problems in code.
  - **Prettier:** To automatically format all code with a consistent style.
  - **husky & lint-staged:** To set up a **pre-commit hook**. This will automatically run Prettier and ESLint _only_ on the files being committed, ensuring no bad code ever enters the repository.

### **2.2. Environment Variable Management**

- **Problem:** Hardcoding API keys or Firebase configuration into the source code is a security risk and makes it difficult to switch between dev and production.
- **Solution:**
  - All Firebase config and any future API keys will be placed in a .env.local file (which will be added to .gitignore).
  - The GitHub Action will use **GitHub Secrets** to securely inject the production keys/config at build time.
  - React (via Vite) exposes these as import.meta.env.VITE\_....

### **2.3. Modular Firebase Configuration**

- **Problem:** Initializing Firebase in App.tsx or multiple other files becomes unmanageable when you add new services (like Auth, Firestore, or Storage).
- **Solution:**
  - Create a single file: src/firebase/config.ts.
  - This file will read the environment variables, initialize the Firebase app, and export the services (e.g., export const auth \= getAuth(app)).
  - Any component that needs a Firebase service will import it from this central file.

### **2.4. Absolute Imports & Folder Structure**

- **Problem:** Relative path "hell" (e.g., import { analyze } from '../../../utils/analysis') makes moving files a nightmare.
- **Solution:**
  - We will configure **absolute imports** using tsconfig.json.
  - This allows us to write imports relative to the src directory (e.g., import { analyze } from '@/utils/analysis').
  - This will be paired with the following initial folder structure:

src/  
├── components/ (Reusable, "dumb" UI elements: Button.tsx, Modal.tsx)  
├── hooks/ (Custom hooks: useSpeechRecognition.ts)  
├── features/ (Feature-specific "smart" components: e.g., SpeechRecorder.tsx)  
├── utils/ (Helper functions: analysis.ts, constants.ts, logger.ts)  
├── services/ (Data logic: firestoreService.ts, analysisService.ts)  
├── store/ (Global state: useAppStore.ts)  
├── firebase/ (Firebase config: config.ts)  
├── styles/ (Global CSS, Tailwind config)  
├── @types/ (Global type definitions: main.d.ts)  
├── tests/ (Test files)  
└── App.tsx (Main application container)

### **2.5. Static Typing with TypeScript**

- **Problem:** JavaScript's dynamic typing makes it easy to pass incorrect props or data, leading to runtime errors that are hard to debug.
- **Solution:** The project will be set up with **TypeScript** from day one. All new code will be written in .tsx or .ts files. We will define clear interface or type definitions for all data structures (e.g., AnalysisResults) and component props.

### **2.6. Structured Error Handling**

- **Problem:** Unhandled promise rejections or errors crash the app or fail silently, leaving the user confused and the developer blind.
- **Solution:** We will implement a simple, global error handling strategy from the start.
  - All async calls or potentially failing logic (like the Speech API) **must** be wrapped in try...catch blocks.
  - Caught errors will be passed to a central logging utility (see 2.7).
  - A global ErrorBoundary component will be set up to catch rendering errors.
  - A user-facing Notification or Alert component will be created to display user-friendly error messages (e.g., "Sorry, speech recognition failed to start.").

### **2.7. Intentional Logging**

- **Problem:** console.log statements are left scattered during debugging, and when a _real_ problem happens in production, there's no information.
- **Solution:** We will create a tiny src/utils/logger.ts utility.
  - It will expose simple methods: logger.info(), logger.warn(), logger.error(), logger.debug().
  - logger.error() will _always_ be used in catch blocks.
  - logger.info() will be used for key user actions (e.g., "Recording started," "Analysis complete").
  - logger.debug() will be used for state changes or data dumps.
  - This allows us to strip debug and info logs from production builds while keeping error logs.

### **2.8. Accessibility (a11y) First**

- **Problem:** Accessibility is a nightmare to retrofit and is often forgotten.
- **Solution:** We will build with a11y in mind from the start.
  - **Semantic HTML:** Use \<button\>, \<main\>, \<label\> correctly. Avoid divs with onClick handlers.
  - **Keyboard Navigation:** Ensure the entire app is usable with only the keyboard (tab order, focus states).
  - **ARIA Roles:** Add aria-labels to all icon-only buttons.
  - **Testing:** We will add jest-axe to our TDD workflow (see 1.1) to automatically catch accessibility violations in our tests.

### **2.9. Internationalization (i18n) Stubbing**

- **Problem:** Adding other languages later requires manually finding and replacing every single text string in the app.
- **Solution:** We will use a lightweight i18n library (like i18next) from the start, even if we only support English.
  - All user-facing strings (e.g., "Start Recording") will be stored in a public/locales/en/translation.json file.
  - Text in components will be rendered using a hook: const { t } \= useTranslation(); ... \<button\>{t('recorder.start')}\</button\>.
  - This makes adding a es/translation.json file (and thus, Spanish) a simple translation task, not a massive refactoring project.

### **2.10. Global State Management**

- **Problem:** Relying only on useState and useContext leads to prop-drilling and complex state-sharing as the app grows (e.g., to share user settings, or session history).
- **Solution:** We will use **Zustand** for global state from day one.
  - A central store will be created in src/store/useAppStore.ts.
  - This will hold global state like isAuthenticated, userSettings, etc.
  - It's minimal, hook-based, and avoids the need for wrapping the app in \<Provider\> components, making it very low-cost to implement.

### **2.11. API Service Layer**

- **Problem:** Components making direct calls to Firebase (e.g., getDoc, setDoc) are hard to test and tightly couple the UI to the database implementation.
- **Solution:** We will create an abstraction layer in src/services/.
  - Example: src/services/firestoreService.ts will export functions like savePracticeSession(sessionData) or getUserSessions(userId).
  - Components will call _these_ service functions, not Firestore directly.
  - This makes components cleaner and allows us to easily mock the service layer in our TDD workflow.

### **2.12. Theming & Design Tokens**

- **Problem:** Hardcoding design values (e.g., bg-blue-500, text-sm) leads to an inconsistent UI and is a find-and-replace nightmare during a redesign.
- **Solution:** We will formally define our design system in tailwind.config.js.
  - We will extend the default Tailwind theme with our own "design tokens."
  - **Colors:** colors: { primary: '\#FF5733', 'primary-dark': '...' }
  - **Fonts:** fontFamily: { sans: \['Inter', 'sans-serif'\] }
  - **Spacing:** spacing: { 'sidebar': '20rem' }
  - Components will use these tokens (bg-primary, font-sans) instead of magic numbers.

### **2.13. Secure Content Rendering**

- **Problem:** The tech spec mentions dangerouslySetInnerHTML to render highlighted transcripts. This is a massive XSS (Cross-Site Scripting) security risk.
- **Solution:** We will **forbid** the use of dangerouslySetInnerHTML.
  - The analysis function will not return an HTML string. Instead, it will return a data structure, e.g., an array of objects:  
    \[{ text: "Hello, ", isFiller: false }, { text: "um", isFiller: true }, ...\]
  - The React component will then .map() over this array to render the content safely:  
    transcriptData.map((segment, index) \=\> (  
     \<span key={index} className={segment.isFiller ? 'bg-yellow-200' : 'text-inherit'}\>  
     {segment.text}  
     \</span\>  
    ))

  - This achieves the same highlighting goal with zero security risk.

## **3\. Additional notes**

### **3.1 Github details:**

- The Github repository is at https://github.com/lawrenceweetman/crutchwords-app
- Git should be set up as soon as possible, including with actions to deploy to firebase, etc.
- We will commit to Git frequently. Before doing so, ensure you run at least lint and unit tests locally. These failing in the Github action is unacceptable, but I won't always explicitly ask you to do this testing when I ask you to commit and push!

### **3.2 Terminal Command Best Practices:**

When running terminal commands as an AI assistant, always use **non-blocking execution**:

- **Testing:** Use `npm test --run` instead of `npm test` to avoid watch mode
- **Development server:** Use `npm run dev` only when explicitly needed for testing, and run it in background if necessary
- **Linting/Formatting:** Use `npm run lint`, `npm run format` for one-time execution
- **Build commands:** Use `npm run build` for production builds, not development mode
- **CI/CD verification:** Run commands individually and sequentially, not in watch mode or parallel when verification is needed

This ensures commands complete quickly and don't block subsequent operations or create hanging processes.

### **3.3 Documentation updates:**

- Update documentation (including this development documentation) as we go.
- Ensure documentation always reflects the decisions we've made and the reality we've deliberately created.

### **3.4 The app name:**

- The app name is currently `Fluent App`
- We should make it **very easy** to change the app name. As per the Github URL, for now I'm calling it `crutchwords-app` in technical places like firebase and the parent directory of this project. Externalise uses of the app name so it can effectively be chanfged in config!
