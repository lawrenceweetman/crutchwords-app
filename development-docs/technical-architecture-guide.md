# **Technical Architecture Guide: "Fluent" App**

This document outlines the high-level technical stack and data flow for the "Fluent" application.

## **1\. Core Technology Stack**

- **Frontend:** React (Vite) with mobile-first responsive design
- **Language:** TypeScript
- **Styling:** Tailwind CSS with custom responsive breakpoints
- **Audio Capture:** Browser-native **MediaRecorder API** for raw audio recording
- **Speech-to-Text:** **Firebase Cloud Function** (`transcribeAudio`) acting as secure proxy to **Google Cloud Speech-to-Text API**
- **Backend:** **Firebase Cloud Functions** for secure API key management and STT processing
- **Database:** **Firestore** (for user session history).
- **Authentication:** **Firebase Authentication** (starting with anonymous auth, then upgrading to Google).
- **Deployment:** **Firebase Hosting** with GitHub Actions for CI/CD.
- **Mobile Experience:** Progressive Web App (PWA) capabilities for native-like mobile experience

### **⚠️ Architecture Decision: Why Not Web Speech API?**

Initial testing revealed that the browser's native Web Speech API (SpeechRecognition) is **unsuitable** for filler word detection:

- **Problem:** The Web Speech API is designed for dictation, not transcription. It actively filters out filled pauses ("um," "ah," "uh," "er") to produce clean text.
- **Test Results:** While discourse markers ("like," "you know") are preserved, critical filled pause disfluencies are completely removed from both interim and final results.
- **Impact:** This would render the app's core functionality non-operational for the most common type of filler word.
- **Solution:** Professional STT service (Google Cloud Speech-to-Text) with disfluency preservation enabled.

## **2\. Core Data Flow (Real-Time Analysis \- P1)**

This is the most critical architectural component.

1. **User Action:** User clicks "Start Recording."
2. **Frontend Audio Capture (speechService.ts):**
   - Requests microphone permissions via `navigator.mediaDevices.getUserMedia()`.
   - Initializes MediaRecorder with the microphone stream.
   - Configures MediaRecorder to capture audio chunks every ~5 seconds (configurable).
   - Sets up event handlers for `ondataavailable` to capture audio blobs.
3. **Audio Chunk Transmission:**
   - As MediaRecorder fires `ondataavailable` events, speechService captures the audio blob (WebM/Opus format).
   - The blob is sent via `fetch()` to the Firebase Cloud Function endpoint: `/transcribeAudio`.
   - Request includes: audio blob, language code, and any session metadata.
4. **Backend Processing (transcribeAudio Cloud Function):**
   - Receives the audio blob from the frontend.
   - Forwards the audio to Google Cloud Speech-to-Text API with critical configuration:
     - `enableAutomaticPunctuation: false` (preserves disfluencies)
     - `enableWordTimeOffsets: true` (for future features)
     - `languageCode: <user-selected-language>`
   - Receives raw transcript array from Google STT (with all "um," "ah," "like" preserved).
   - Returns the raw transcript to the frontend.
5. **State Update:** The frontend receives the transcript and updates the React state (via Zustand store) with the new transcript segment.
6. **Re-render:** The main component (SpeechRecorder.tsx) re-renders, displaying the new transcript.
7. **Real-time Analysis:**
   - A useEffect hook (or a memoized function) is triggered by the transcript change.
   - It passes the transcript and language code to: `analysisService.getHighlightedTranscript(transcript, language)`.
   - **\[NEW\]** This analysisService **must not** use dangerouslySetInnerHTML. It must return a _data structure_ as defined in the Dev Guide (Section 2.13).
   - The React component maps over this data structure to render the highlighted spans _safely_.
   - The service filters the internationalized lexicon by language using BCP 47 tags before processing.

## **2.5\. Backend Architecture (Firebase Cloud Functions)**

### **transcribeAudio Cloud Function**

**Purpose:** Secure proxy between frontend and Google Cloud Speech-to-Text API.

**Why Backend?**

- API keys must never be exposed to the client (security requirement).
- Google Cloud STT requires server-side authentication.
- Allows us to control STT configuration (disfluency preservation) reliably.

**Function Specification:**

```typescript
// functions/src/transcribeAudio.ts
export const transcribeAudio = functions.https.onCall(async (data, context) => {
  // Input validation
  const { audioData, languageCode, sampleRateHertz } = data;

  // Call Google Cloud Speech-to-Text
  const request = {
    audio: { content: audioData },
    config: {
      encoding: 'WEBM_OPUS',
      sampleRateHertz: sampleRateHertz || 48000,
      languageCode: languageCode || 'en-US',
      enableAutomaticPunctuation: false, // CRITICAL: Preserves disfluencies
      enableWordTimeOffsets: true, // For future features
      model: 'default',
      useEnhanced: false, // Standard model for natural speech
    },
  };

  const [response] = await speechClient.recognize(request);
  return { transcript: response.results };
});
```

**Configuration Details:**

- **Input:** Audio blob (WebM/Opus format), language code, sample rate
- **Output:** Raw transcript array with all disfluencies preserved
- **Critical Config:**
  - `enableAutomaticPunctuation: false` - Ensures "um," "ah," "like" are NOT filtered
  - `enableWordTimeOffsets: true` - Returns timing data (for future "Awareness Trainer" P5.3)
  - `useEnhanced: false` - Standard model is sufficient and more cost-effective
- **Security:** API keys stored in Firebase Functions environment variables, never exposed to client
- **Error Handling:** Graceful fallback with clear error messages to frontend
- **Cost Management:**
  - Free tier: 60 minutes/month
  - Paid tier: ~$0.024/minute (~$1.44/hour)
  - Rate limiting recommended for production

**Environment Setup:**

```bash
# Set Google Cloud credentials
firebase functions:config:set google.cloud_api_key="YOUR_API_KEY"

# Or use service account (recommended)
firebase functions:config:set google.service_account="path/to/serviceAccount.json"
```

## **3\. Analysis Engine (src/services/analysisService.ts)**

This service is responsible for all text processing and supports internationalization.

**Note:** This service now receives transcripts from the backend STT service rather than the Web Speech API.

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
