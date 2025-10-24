# **AI Agent Development Instructions**

This document provides comprehensive guidance for AI assistants working on the **Fluent** application - a React-based tool to help users identify and reduce filler words in speech.

## **📚 Project Context & Documentation**

**Your Mission:** Build a world where everyone can communicate their ideas with clarity and confidence through an accessible, private, and effective speech coaching application.

**Your Core Documents (6 pillars of truth):**

1. **product-requirements-document.md (The "WHAT"):** Your **Goal**. Defines _what_ features to build and in _what priority order_ (P0, P1, P2, etc.).

2. **technical-architecture-guide.md (The "BLUEPRINT"):** Your **Stack**. Defines the technologies (React, Firebase, Web Speech API) and the core _data flow_ and _database schema_.

3. **development-guide.md (The "RULES"):** Your **Process**. Defines the _quality standards_ you must adhere to for all code: TDD, Clean Code, folder structure, logging, i18n stubbing, absolute imports, etc.

4. **instructions-for-AI-agents.md (The "HOW"):** This document - defines **efficient AI development workflows**. Follow these guidelines for non-blocking terminal commands, proper testing procedures, and optimal development practices.

5. **onboarding-and-coaching-copy.md (The "VOICE"):** Your **Content**. You must use the exact text from this file for all user-facing UI (onboarding, tips, and analysis explanations).

6. **comprehensive-research.md:** The **background** on verbal disfluencies, compiled by Google Gemini deep research. Use this to stress test against academic literature.

**⚠️ CRITICAL:** You must follow these documents precisely. They are your complete source of truth.

## **🎯 Development Philosophy**

- **Quality First:** Test-Driven Development (TDD), Clean Code principles, and comprehensive testing
- **Deploy Early, Deploy Often:** Get features working and deployed quickly, then iterate
- **Privacy by Design:** Audio processing happens in-browser, minimal data collection
- **Accessibility First:** Semantic HTML, keyboard navigation, screen reader support
- **User-Centered:** Coach, not critic - supportive and encouraging tone throughout
- **Research-Backed:** All features based on cognitive psychology and linguistics research

---

This document provides specific guidance for AI assistants working on the Fluent application. Follow these instructions to ensure efficient, non-blocking development workflows.

## **🚫 Non-Blocking Command Execution**

**CRITICAL:** Always run terminal commands in non-blocking mode to avoid hanging processes and ensure efficient development.

### **Testing Commands**

```bash
# ✅ CORRECT - Non-blocking, one-time execution
npm test --run
npm run test:coverage

# ❌ WRONG - Will block in watch mode
npm test
npm run test:ui
```

### **Development Server**

```bash
# ✅ CORRECT - Run only when explicitly needed for testing
npm run dev &
# Then test the server, then kill it

# ❌ WRONG - Don't run dev server unless specifically testing UI
npm run dev  # (without background)
```

### **Linting and Formatting**

```bash
# ✅ CORRECT - One-time execution
npm run lint          # general lint
npm run lint:ci       # stricter CI lint (warnings suppressed with --quiet)
npm run format
npm run type-check

# ❌ WRONG - Don't use interactive or watch modes
npm run lint:fix  # (use sparingly, may change code)
```

#### Import Order & ESLint plugins

- Import order is enforced. Group order:
  1. builtin/external 2) internal (`@/**`) 3) parent/sibling/index 4) type-only
- Newlines between groups, alphabetical within groups.
- Additional plugins enabled (warn-first): import, unicorn, sonarjs, security.

### **Build Commands**

```bash
# ✅ CORRECT - Production builds only
npm run build

# ❌ WRONG - Don't use preview unless specifically testing builds
npm run preview
```

## **📋 Command Patterns for AI Agents**

### **Verification Sequence** (Run these before committing)

```bash
# Always run these in sequence, non-blocking:
npm run type-check    # Check TypeScript compilation
npm run lint          # Check code quality
npm test --run        # Run tests once
npm run build         # Verify production build
```

### **Development Workflow**

```bash
# 1. Make code changes
# 2. Verify with non-blocking commands
npm run type-check && npm run lint && npm test --run

# 3. If all pass, commit
git add .
git commit -m "feat: description of changes"
git push
```

## **⚡ Quick Reference Shortcuts**

### **For Testing**

- `npm test --run` - Run tests once (non-blocking)
- `npm run test:coverage` - Run with coverage report

### **For Quality Checks**

- `npm run lint` - ESLint check
- `npm run type-check` - TypeScript check
- `npm run format` - Format code

### **For Building**

- `npm run build` - Production build
- `npm run preview` - Preview build (use sparingly)

## **🔧 Troubleshooting Hanging Processes**

If a command gets stuck in watch mode:

```bash
# Find and kill hanging processes
ps aux | grep -E "(vitest|vite|node)" | grep -v grep
kill -9 <process_id>

# Or kill all Node processes
pkill -f "node.*vitest" || pkill -f "node.*vite"
```

## **📊 CI/CD Integration**

The GitHub Actions workflow is configured for non-blocking execution:

- Tests run with `--run --coverage` flags
- All commands complete and exit cleanly
- No watch modes or interactive processes

## **🎯 Best Practices for AI Development**

1. **Always use `--run` flag** for test commands
2. **Run commands individually** rather than in parallel when verification is needed
3. **Kill background processes** after testing UI features
4. **Verify before committing** using the verification sequence above
5. **Don't leave hanging processes** - always clean up

## **🚨 Common Mistakes to Avoid**

- ❌ Running `npm test` without `--run` (blocks indefinitely)
- ❌ Leaving `npm run dev` running in foreground (blocks terminal)
- ❌ Using `npm run test:ui` (interactive mode blocks)
- ❌ Running multiple watch processes simultaneously
- ❌ Not killing background processes after testing

## **✅ Success Indicators**

- All commands return to prompt within seconds
- No "Waiting for file changes..." messages
- No hanging Node processes
- Clean commit history with passing CI/CD
- Fast, efficient development cycles

## **🚀 Starting New Features (P1, P2, etc.)**

When implementing new features from the Product Requirements Document:

1. **Read the PRD** to understand the feature requirements and user stories
2. **Check the Tech Architecture Guide** for implementation patterns and data flow
3. **Review existing code** to understand current patterns and avoid duplication
4. **Write tests first** (TDD) - define the expected behavior before implementation
5. **Implement incrementally** - small, testable changes with frequent commits
6. **Verify thoroughly** - use `npm run verify` before committing
7. **Update documentation** - keep README and guides current as features evolve

**Feature Implementation Checklist:**

- [ ] Read PRD requirements for the feature
- [ ] Review technical architecture constraints
- [ ] Write failing tests (TDD approach)
- [ ] Implement minimum viable solution
- [ ] Pass all tests and quality checks
- [ ] Commit with descriptive message
- [ ] Verify CI/CD passes

## **🔄 Maintenance and Updates**

For ongoing maintenance and dependency updates:

Prior to pushing any changes to Github, take the opportunity to check to see if any maintenance tasks can be carried out and do so.

1. **Check for vulnerabilities:** `npm audit`
2. **Update dependencies carefully:** Use `npm outdated` to see available updates: there should be low tolerance for deprecated and unsupported dependencies, and extremely low tolerance for vulnerabilities or dependencies with known issues such as memory leaks
3. **Test thoroughly:** Full verification after any dependency changes
4. **Update documentation:** Keep setup instructions current
5. **Consider migration impact:** Major version updates may require code changes

## **Final important note**

You should follow these rules at all times, but I do not ask you to follow them blindly.

If anything in these instructions seems like it would be contrary - or not condicive towards - great, best-practice, modern software development then flag it with me **immediately** to highlight the issue so that we can review the rules and instructions together.

The same applies to any other instructions in development-guide.md, technical-architecture-guide.md, README.md, or any other project documentation.
