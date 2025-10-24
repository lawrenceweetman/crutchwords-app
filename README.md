# Fluent App

**"A world where everyone can communicate their ideas with clarity and confidence."**

Fluent is an application designed to help users identify and reduce their use of filler words in speech. Using real-time speech recognition, the app provides immediate feedback and coaching to help users develop more confident communication habits.

## 📋 Project Status

This repository contains the complete project documentation and requirements. The actual application development is just beginning.

**Current Phase: P0 - The Walking Skeleton** ✅ **COMPLETE**

- ✅ Project documentation committed
- ✅ Development environment setup (React, TypeScript, Vite)
- ✅ Core application shell implemented
- ✅ GitHub Actions CI/CD pipeline configured
- ✅ All quality assurance systems operational
- ✅ Production build ready (194KB gzipped)
- 📝 **Next: P1 - Real-time speech analysis and user authentication**

## 📚 Documentation

The project is built on a comprehensive set of requirements and guidelines:

- **[Product Requirements Document](./development-docs/product-requirements-document.md)** - The complete feature roadmap and user stories
- **[Technical Architecture Guide](./development-docs/technical-architecture-guide.md)** - Technology stack and data flow specifications
- **[Development Guide](./development-docs/development-guide.md)** - Code standards, TDD practices, and development processes
- **[Onboarding and Coaching Copy](./development-docs/onboarding-and-coaching-copy.md)** - All user-facing text and coaching content
- **[Research Background](./background-docs/comprehensive-research.md)** - Academic research on verbal disfluencies and remediation strategies

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Firebase account and CLI
- Git

### Development Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/lawrenceweetman/crutchwords-app.git
   cd crutchwords-app
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Add your Firebase configuration
   ```

4. **Start development server**

   ```bash
   npm run dev
   ```

5. **Set up Firebase (when ready)**
   ```bash
   firebase login
   firebase init hosting
   ```

## 🔥 Firebase Setup

The application is configured for Firebase Hosting deployment with automated CI/CD. To set up Firebase:

1. **Create a Firebase project** at [https://console.firebase.google.com](https://console.firebase.google.com)

2. **Enable Hosting** in your Firebase project

3. **Install Firebase CLI** (if not already installed):

   ```bash
   npm install -g firebase-tools
   ```

4. **Login to Firebase**:

   ```bash
   firebase login
   ```

5. **Initialize Firebase in the project** (if not already done):

   ```bash
   firebase init hosting
   ```

6. **Set up environment variables**:
   Create a `.env.local` file in the project root with your Firebase configuration:

   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
   VITE_FIREBASE_APP_ID=1:123456789:web:abcdef123456
   ```

7. **Set up GitHub Secrets** for CI/CD:
   - Go to your GitHub repository Settings > Secrets and variables > Actions
   - Add these secrets:
     - `FIREBASE_SERVICE_ACCOUNT`: Your Firebase service account JSON
     - `FIREBASE_PROJECT_ID`: Your Firebase project ID

8. **Deploy manually** (or wait for automatic deployment on push):
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

## 🏗️ Project Structure

The application follows a clean, modular architecture:

```
src/
├── components/     # Reusable UI components
├── hooks/         # Custom React hooks
├── features/      # Feature-specific components
├── utils/         # Helper functions and constants
├── services/      # Data services and API layers
├── store/         # Global state management (Zustand)
├── firebase/      # Firebase configuration
├── styles/        # Global styles and Tailwind config
└── @types/        # TypeScript type definitions
```

## 📦 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint code quality checks
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking
- `npm test` - Run test suite
- `npm run test:coverage` - Run tests with coverage report

### **🤖 AI Agent Scripts** (Non-blocking, efficient workflows)

- `npm run test:quick` - Run tests once (non-blocking)
- `npm run test:ci` - Run tests with coverage for CI
- `npm run verify` - Run full verification (type-check + lint + tests)
- `npm run check` - Quick quality check (type-check + lint)
- `npm run build:verify` - Verify and build in one command

**Note:** See [instructions-for-AI-agents.md](./development-docs/instructions-for-AI-agents.md) for detailed AI development guidance.

## 🔧 Technology Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom design tokens
- **State Management**: Zustand
- **Speech Recognition**: Web Speech API
- **Database**: Firestore
- **Authentication**: Firebase Auth
- **Deployment**: Firebase Hosting with GitHub Actions CI/CD
- **Testing**: Jest, React Testing Library, jest-axe
- **Code Quality**: ESLint, Prettier, Husky pre-commit hooks

## 🚀 CI/CD Pipeline

The project includes a comprehensive GitHub Actions workflow that:

- **Triggers** on pushes to `master` and pull requests
- **Runs** linting, type checking, and tests on every change
- **Generates** test coverage reports
- **Builds** the production application
- **Checks** bundle size for performance monitoring
- **Deploys** automatically to Firebase Hosting on successful builds

The pipeline ensures code quality and automates deployment, following the "Deploy Early, Deploy Often" principle.

## 📝 Development Principles

- **Test-Driven Development (TDD)** - All features built with comprehensive tests
- **Clean Code** - Readable, maintainable, and well-documented code
- **Accessibility First** - WCAG compliant with semantic HTML and keyboard navigation
- **Privacy by Design** - Speech processing happens in-browser, minimal data collection
- **Progressive Enhancement** - Works without JavaScript, enhanced with it

## 🤝 Contributing

This project follows strict development guidelines:

1. **Read the documentation** - All requirements and standards are documented
2. **Follow TDD** - Write tests before implementing features
3. **Code reviews** - All changes require review before merging
4. **Deploy early, deploy often** - Regular deployments to catch issues early

## 📄 License

This project is developed for educational and research purposes to help people improve their communication skills.

## 📞 Support

For questions about the project requirements or development approach, refer to the documentation in the `development-docs/` directory.

---

_"Fillers are not a flaw. They're your brain working! This app helps you build awareness and replace them with confident, powerful pauses."_
