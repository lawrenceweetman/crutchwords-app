# **Technical Architecture Guide: "Fluent" App**

This document outlines the high-level technical stack and data flow for the "Fluent" application.

## **1\. Core Technology Stack**

- **Frontend:** React (Vite) with mobile-first responsive design
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom responsive breakpoints
- **Speech Recognition:** Browser-native **Web Speech API** (SpeechRecognition) with mobile optimization
- **Database:** **Firestore** (for user session history).
- **Authentication:** **Firebase Authentication** (starting with anonymous auth, then upgrading to Google).
- **Deployment:** **Firebase Hosting** with GitHub Actions for CI/CD.
- **Mobile Experience:** Progressive Web App (PWA) capabilities for native-like mobile experience

## **2\. Core Data Flow (Real-Time Analysis \- P1)**

This is the most critical architectural component.

1. **User Action:** User clicks "Start Recording."
2. **React Hook (useSpeechRecognition.ts):**
   - Requests microphone permissions.
   - Initializes a new SpeechRecognition instance.
   - Sets continuous \= true and interimResults \= true.
   - Attaches an onresult event listener.
3. **Event Firing (onresult):** As the user speaks, the API fires events. The hook extracts the transcript string from the event.
4. **State Update:** The hook updates a React state variable (or preferably, the Zustand store) with the latest interimTranscript.
5. **Re-render:** The main component (SpeechRecorder.tsx) re-renders, displaying the new transcript.
6. **Real-time Analysis:**
   - A useEffect hook (or a memoized function) is triggered by the transcript change.
   - It passes the interimTranscript and language code to: analysisService.getHighlightedTranscript(transcript, language).
   - **\[NEW\]** This analysisService **must not** use dangerouslySetInnerHTML. It must return a _data structure_ as defined in the Dev Guide (Section 2.13).
   - The React component maps over this data structure to render the highlighted spans _safely_.
   - The service filters the internationalized lexicon by language using BCP 47 tags before processing.

## **3\. Analysis Engine (src/services/analysisService.ts)**

This service is responsible for all text processing and supports internationalization.

- **Internationalized Lexicon (src/utils/lexicon.json):**
  - The app's single source of truth for filler words is a JSON file containing an array of LexiconEntry objects.
  - Each entry has: category ('FILLED_PAUSE' | 'DISCOURSE_MARKER' | 'PLACATING_TAG'), term, language, bcp47Tags, and notes.
  - The bcp47Tags field contains an array of BCP 47 language tags that specify which languages and regions the term applies to (e.g., "en-US", "en-GB", "fr-FR").
  - The analysisService filters this master lexicon by language code before processing, matching against any BCP 47 tag in the array.
  - Example structure:
    ```json
    [
      {
        "category": "FILLED_PAUSE",
        "term": "um",
        "language": "en",
        "bcp47Tags": ["en-US"],
        "notes": "A common nasal-final filled pause in American English."
      },
      {
        "category": "FILLED_PAUSE",
        "term": "er",
        "language": "en",
        "bcp47Tags": ["en-GB", "en-AU", "en-NZ"],
        "notes": "The primary non-nasal filled pause in British, Australian, and New Zealand English."
      }
    ]
    ```
- **getHighlightedTranscript(text: string, language?: string):**
  - Takes raw text and optional language code (defaults to 'en').
  - Filters the lexicon by the provided language, matching against BCP 47 tags.
  - Returns an array: Array\<{ text: string, isFiller: boolean, category: string | null }\>
  - Example output: \[{ text: "Hello ", isFiller: false, category: null }, { text: "like", isFiller: true, category: 'DISCOURSE_MARKER' }, ...\]
- **getSessionAnalysis(text: string, duration: number, language?: string):**
  - Takes the _final_ transcript, speech duration in minutes, and optional language code (defaults to 'en').
  - Filters the lexicon by the provided language before analysis, matching against BCP 47 tags.
  - Returns a structured analysis object:
  - Example output:
    {
    "totalWordCount": 150,
    "totalFillerCount": 7,
    "fillerDensityPercent": 4.6, // (7 / 150) \* 100
    "fillersPerMinute": 5.0, // (Assuming a 1.4 min speech)
    "categoryCounts": {
    "FILLED_PAUSE": 3,
    "DISCOURSE_MARKER": 4,
    "PLACATING_TAG": 0
    }
    }

## **4\. Data Persistence (Firestore \- P2)**

- **Authentication:** On P1, the app will use signInAnonymously(auth) to get a stable userId.
- **Data Model:** Firestore will be used to save session history.
- **Collection Path:** /artifacts/{appId}/users/{userId}/sessions
- **Document Schema (sessions/{sessionId}):**  
  {  
   "createdAt": "2025-10-24T14:30:00Z",  
   "fullTranscript": "Hello like um... this is my speech.",  
   "analysis": {  
   "totalWordCount": 150,  
   "totalFillerCount": 7,  
   "fillerDensityPercent": 4.6,  
   "fillersPerMinute": 5.0,  
   "categoryCounts": {
  "FILLED_PAUSE": 3,
  "DISCOURSE_MARKER": 4,
  "PLACATING_TAG": 0
  }  
   }  
  }
