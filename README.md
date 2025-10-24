# Fluent App

**"A world where everyone can communicate their ideas with clarity and confidence."**

Fluent is an application designed to help users identify and reduce their use of filler words in speech. Using real-time speech recognition, the app provides immediate feedback and coaching to help users develop more confident communication habits.

## 📋 Project Status

This repository contains the complete project documentation and requirements. The actual application development is just beginning.

**Current Phase: P0 - The Walking Skeleton**
- ✅ Project documentation committed
- 🔄 Setting up development environment (React, TypeScript, Vite)
- 📝 Next: Implement core application shell

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

*"Fillers are not a flaw. They're your brain working! This app helps you build awareness and replace them with confident, powerful pauses."*
