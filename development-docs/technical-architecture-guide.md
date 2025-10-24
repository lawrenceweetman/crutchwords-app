# **Technical Architecture Guide: "Fluent" App**

This document outlines the high-level technical stack and data flow for the "Fluent" application.

## **1\. Core Technology Stack**

* **Frontend:** React (Vite)  
* **Language:** TypeScript  
* **Styling:** Tailwind CSS  
* **Speech Recognition:** Browser-native **Web Speech API** (SpeechRecognition).  
* **Database:** **Firestore** (for user session history).  
* **Authentication:** **Firebase Authentication** (starting with anonymous auth, then upgrading to Google).  
* **Deployment:** **Firebase Hosting** with GitHub Actions for CI/CD.

## **2\. Core Data Flow (Real-Time Analysis \- P1)**

This is the most critical architectural component.

1. **User Action:** User clicks "Start Recording."  
2. **React Hook (useSpeechRecognition.ts):**  
   * Requests microphone permissions.  
   * Initializes a new SpeechRecognition instance.  
   * Sets continuous \= true and interimResults \= true.  
   * Attaches an onresult event listener.  
3. **Event Firing (onresult):** As the user speaks, the API fires events. The hook extracts the transcript string from the event.  
4. **State Update:** The hook updates a React state variable (or preferably, the Zustand store) with the latest interimTranscript.  
5. **Re-render:** The main component (SpeechRecorder.tsx) re-renders, displaying the new transcript.  
6. **Real-time Analysis:**  
   * A useEffect hook (or a memoized function) is triggered by the transcript change.  
   * It passes the interimTranscript to a utility function: analysisService.getHighlightedTranscript(transcript).  
   * **\[NEW\]** This analysisService **must not** use dangerouslySetInnerHTML. It must return a *data structure* as defined in the Dev Guide (Section 2.13).  
   * The React component maps over this data structure to render the highlighted spans *safely*.

## **3\. Analysis Engine (src/services/analysisService.ts)**

This service is responsible for all text processing.

* **\[NEW\]** **Filler Categorization:**  
  * A config file (e.g., src/utils/analysis.config.ts) will define the filler words in categories.  
  * export const FILLER\_CATEGORIES: Record\<string, string\[\]\> \= { 'PAUSE': \['um', 'uh', 'ah', 'er'\], 'MARKER': \['like', 'so', 'well', 'basically', 'actually'\], 'PLACATING': \['you know', 'right?', 'you see'\] }  
* **getHighlightedTranscript(text: string):**  
  * Takes raw text.  
  * Returns an array: Array\<{ text: string, isFiller: boolean, category: string | null }\>  
  * Example output: \[{ text: "Hello ", isFiller: false, category: null }, { text: "like", isFiller: true, category: 'MARKER' }, ...\]  
* **getSessionAnalysis(text: string):**  
  * Takes the *final* transcript.  
  * Returns a structured analysis object:  
  * Example output:  
    {  
      "totalWordCount": 150,  
      "totalFillerCount": 7,  
      "fillerDensityPercent": 4.6, // (7 / 150\) \* 100  
      "fillersPerMinute": 5.0, // (Assuming a 1.4 min speech)  
      "categoryCounts": {  
        "PAUSE": 3,  
        "MARKER": 4,  
        "PLACATING": 0  
      }  
    }

## **4\. Data Persistence (Firestore \- P2)**

* **Authentication:** On P1, the app will use signInAnonymously(auth) to get a stable userId.  
* **Data Model:** Firestore will be used to save session history.  
* **Collection Path:** /artifacts/{appId}/users/{userId}/sessions  
* **Document Schema (sessions/{sessionId}):**  
  {  
    "createdAt": "2025-10-24T14:30:00Z",  
    "fullTranscript": "Hello like um... this is my speech.",  
    "analysis": {  
      "totalWordCount": 150,  
      "totalFillerCount": 7,  
      "fillerDensityPercent": 4.6,  
      "fillersPerMinute": 5.0,  
      "categoryCounts": {  
        "PAUSE": 3,  
        "MARKER": 4,  
        "PLACATING": 0  
      }  
    }  
  }  
