# **AI Agent Development Instructions**

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
npm run lint
npm run format
npm run type-check

# ❌ WRONG - Don't use interactive or watch modes
npm run lint:fix  # (use sparingly, may change code)
```

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
