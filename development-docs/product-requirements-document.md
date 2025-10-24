# **Product Requirements Document (PRD): "Fluent"**

This document outlines the product requirements for "Fluent," an application designed to help users identify and reduce their use of filler words in speech.

## **1\. Vision & Mission**

- **Vision:** A world where everyone can communicate their ideas with clarity and confidence.
- **Mission:** To provide an accessible, private, and effective tool that helps users practice speaking, identify filler words in real-time, and track their improvement over time.

## **2\. The Problem**

Public speaking and effective communication are critical skills, but many people undermine their own message by using verbal fillers (e.g., "um," "ah," "like," "you know"). These habits are hard to break because they are unconscious. Existing solutions are often expensive (coaches), high-pressure (Toastmasters), or non-existent (no simple practice tool).

## **3\. Core Principles**

- **Privacy First:** Audio is processed in the browser. Only user-approved final transcripts are saved.
- **Coach, Not Critic:** Based on research, we understand fillers are a _natural part of cognition_, not a "flaw." The app's voice must be supportive and encouraging, focused on awareness and replacement (with pauses), not "elimination."
- **Actionable Feedback:** Don't just report—provide clear, real-time feedback the user can act on.
- **Low Friction:** The tool should be instantly usable. Open the app and start talking.
- **Mobile-First Design:** The app will be designed to work seamlessly on mobile devices, tablets, and desktop, with touch-friendly interfaces and responsive layouts.

## **4\. Feature Roadmap (AI-Native Order)**

The roadmap is prioritized to tackle the most architecturally complex "retrofit nightmares" _first_.

### **P0: The Walking Skeleton (The Foundation)** ✅ **COMPLETE**

- **Goal:** Create a minimal, deployable application shell with all foundational development principles in place. This is the first PR for the AI to create.
- **User Stories:** ✅ **All Complete**
  - ✅ As a Developer, the project is set up with Vite, React, and TypeScript.
  - ✅ As a Developer, the folder structure from the Dev Guide (src/components, src/hooks, etc.) is created.
  - ✅ As a Developer, all "Early Setup" items from the Dev Guide are implemented (ESLint, Prettier, Husky, tsconfig.json absolute paths, tailwind.config.js tokens).
  - ✅ As a Developer, a minimal App.tsx component renders "Hello, Fluent\!".
  - ✅ As a Developer, the CI/CD pipeline (GitHub Actions) is set up.
  - ✅ As a Developer, the app is ready for deployment to Firebase Hosting (infrastructure complete).

**P0 Completion Summary:**

- Complete project foundation established with modern development tools
- All quality assurance systems (linting, testing, formatting) operational
- CI/CD pipeline ready for automated deployments
- Production build verified and optimized (194KB gzipped)
- Comprehensive documentation and AI development workflows in place
- Ready for P1 implementation: Real-Time Analysis & Core User Auth

### **P1: Real-Time Analysis & Core User Auth**

- **Goal:** Build the core architectural components: real-time speech processing and user data persistence. This is the most complex refactor, so we do it first.
- **User Stories:**
  - As a User, I can see a "Start Recording" button.
  - As a User, when I click "Start," the browser asks for microphone permission.
  - As a User, as I speak, I can see my words transcribed onto the screen in real-time.
  - As a User, as I speak, any filler words I say (e.g., "um," "like") are **immediately highlighted** (e.g., with a yellow background) in the live transcript.
  - As a User, I can click "Stop Recording" to end my session.
  - As a User, when I first visit the app, I am automatically and anonymously signed into Firebase Authentication (this provides a stable userId for P2 features).
  - As a User, when I stop, I can see a simple summary report (e.g., "5 filler words in 60 seconds").
  - As a User, I can "discard" this session.
  - **\[NEW\]** As a User, the app uses the "Onboarding Copy" (from the Onboarding_And_Coaching_Copy.md file) for any first-time-use modals or tooltips.

### **PRD Addendum: P1.5 - Practice Topic Generator**

This feature is pulled forward from the original P5.5 ("Prompt Library") as it is a core component of the initial user experience, reducing friction and making the app immediately useful.

- **Research Basis:** Practicing transitions and structuring thoughts on demand is a key remediation technique. Providing a topic removes the cognitive load of "what to talk about."
- **Technical Foundation:** This feature introduces a new JSON data file, `src/utils/practice_topics.json`, and requires the `analysisService` or a new `topicService` to be language-aware.
- **User Stories:**
  - As a User, on the main practice screen (P1), I can see a "Get Topic" button.
  - As a User, when I click the "Get Topic" button, the app will display a random topic from the practice_topics.json file.
  - As a User (Developer), the app will filter the topics based on my currently selected language (from the i18n context).
  - As a User, I can click the button again to "shuffle" and get a new topic.
  - As a User, I can start my practice session, and the app will record and analyze my speech based on this topic.

### **P2: Session Saving & History**

- **Goal:** Allow users to persist their results and track progress.
- **User Stories:**
  - As a User, after a session, I can click a "Save Session" button.
  - As a User, my saved session (containing the final transcript, filler word count, and date) is saved to my personal Firestore collection (keyed by my userId).
  - As a User, I can access a "History" page or sidebar.
  - As a User, on the History page, I can see a list of all my past saved sessions (e.g., "Oct 24, 2025 \- 5 fillers").
  - As a User, I can click on a past session to view its full transcript and analysis.
  - As a User, I can delete a session from my history.

### **P3: Advanced Statistics & User Dashboard**

- **Goal:** Provide deeper insights to help users identify patterns.
- **User Stories:**
  - As a User, I can see a "Dashboard" page.
  - As a User, on the dashboard, I can see a graph of my **"Filler Density"** (e.g., fillers per minute or per 100 words) over time.
  - **\[NEW\]** As a User, I can see a **Categorized Breakdown** of my most-used fillers (e.g., "Filled Pauses: 40%, Discourse Markers: 60%").
  - As a User, I can see my total practice time.
  - As a User, I can set a personal goal (e.g., "fewer than 3 fillers per minute").
  - As a User, the dashboard uses the "Coaching Copy" (from the Onboarding*And_Coaching_Copy.md file) to explain \_what* these categories mean.

### **P4: Full User Accounts (Future)**

- **Goal:** Allow users to sign in and sync history across devices.
- **User Stories:**
  - As an Anonymous User, I am prompted to "link" my account by signing in with Google.
  - As a User, I can sign in with a Google account.
  - As a User, my anonymous session history is seamlessly merged with my new "full" account.
  - As a User, I can log out.

## **P5.1: The "Pacing" Trainer (Slowing Down)**

- **Research Basis:** The technique of "slowing down" to allow cognitive load to catch up with speech.
- **User Stories:**
  - As a User, I can start a "Pacing Practice" mode.
  - As a User, in this mode, I can see a simple visual metronome on the screen (e.g., a pulsating circle).
  - As a User, I can set the desired pace (e.g., "Slow," "Medium," "Fast") to practice speaking more deliberately.
  - As a User, the app will provide a simple score at the end on how well I matched the target pace.

## **P5.2: The "Pause" Trainer (The Silent Pause)**

- **Research Basis:** The core technique of replacing a filled pause ("um") with a silent pause.
- **User Stories:**
  - As a User, I can start a "Pause Practice" mode.
  - As a User, the app will present me with a series of short prompts or questions (e.g., "What did you do this weekend?").
  - As a User, I must practice pausing for 1-2 seconds (a "confident pause") before I begin speaking.
  - As a User, the app will give me feedback on whether I started speaking immediately (a "rush") or successfully used the silent pause.

## **P5.3: The "Awareness" Trainer (Live Feedback)**

- **Research Basis:** Building visceral, real-time awareness of the habit as it occurs.
- **User Stories:**
  - As a User, I can enable an "Awareness" mode during any practice session.
  - As a User, in this mode, the app will provide an immediate, non-intrusive feedback signal the instant it detects a filler word.
  - As a User, I can choose my feedback signal (e.g., a subtle audio "click," a gentle haptic buzz on mobile, or a brief red flash on the screen).

## **P5.4: The "Warm-Up" Library (Anxiety Reduction)**

- **Research Basis:** Reducing the cognitive load and anxiety that causes fillers before speaking.
- **User Stories:**
  - As a User, I can access a "Warm-Up Library" before starting a session.
  - As a User, I can select a 1- or 2-minute guided exercise.
  - As a User, I can be guided through a simple "Belly Breathing" exercise to reduce nerves.
  - As a User, I can be guided through a "Vocal Warm-Up" (e.g., lip trills, sirens) to prepare my voice.

## **P5.5: The "Prompt" Library (Transition Practice) - MOVED**

- **Note:** This feature has been pulled forward into the core MVP as P1.5: Practice Topic Generator. It is no longer part of the P5 roadmap, as it is now a foundational feature.
