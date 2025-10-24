# Speech-to-Text Service Research Findings

**Date:** October 24, 2025  
**Status:** Project on hold pending STT service validation  
**Critical Issue:** Need to verify which STT services actually preserve disfluencies

---

## Executive Summary

During P0/P1 development, we discovered that the browser's native Web Speech API is **unsuitable** for filler word detection because it filters out critical filled pause disfluencies ("um," "ah," "uh").

We pivoted to a backend STT architecture but **have not yet validated** that commercial STT services (Google, AWS, Azure, etc.) actually preserve these disfluencies either. This is a **critical blocker** that must be resolved before P1 implementation.

---

## Web Speech API Test Results

### Test Conducted

- **Date:** October 24, 2025
- **Method:** Created test component with live comparison of interim vs. final results
- **Test Phrase:** "Um, hello, like, this is, ah, a test with, you know, some filler words"

### Findings

#### ✅ Preserved (Discourse Markers)

- **"like"** - PRESERVED
- **"you know"** - PRESERVED
- **"so"** - PRESERVED (inferred)

#### ❌ Filtered (Filled Pauses)

- **"um"** - COMPLETELY REMOVED
- **"ah"** - COMPLETELY REMOVED
- **"uh"** - COMPLETELY REMOVED (inferred)

### Conclusion

The Web Speech API is designed for **dictation**, not **transcription**. It actively filters the most unconscious and common type of filler word (filled pauses) to produce "clean" text. This makes it **fundamentally unsuitable** for our app's core purpose.

**Impact:** Filled pauses are arguably the most important filler words to detect - they're the most unconscious and common. Missing these would make the app only partially functional.

---

## Commercial STT Services - Unvalidated Assumptions ⚠️

### The Problem

Our architectural pivot documentation assumed that commercial STT services like Google Cloud Speech-to-Text would preserve disfluencies if we disabled certain settings. However, upon further research, **this assumption is not validated**.

### What We Don't Know

1. **Google Cloud Speech-to-Text**
   - `enableAutomaticPunctuation: false` controls punctuation (periods, commas), **not** disfluency filtering
   - We have not found explicit documentation confirming that "um," "ah," "uh" appear in raw transcripts
   - Most Google STT documentation focuses on "clean transcription" use cases

2. **AWS Transcribe**
   - Similar uncertainty about disfluency preservation
   - Marketed primarily for dictation/transcription, not linguistic analysis

3. **Azure Speech Services**
   - Same concerns as above

4. **AssemblyAI**
   - Markets itself as more research/analysis-friendly
   - May have explicit disfluency detection features
   - **Needs investigation**

### The Core Issue

**All major commercial STT services are optimized for "clean transcription" (dictation, meeting notes, captions)**. They are not designed for linguistic analysis or speech coaching. They may filter or minimize disfluencies by default, regardless of API settings.

---

## Promising Alternatives to Investigate

### 1. OpenAI Whisper ⭐ (Most Promising)

**Description:** Open-source speech recognition model designed for research and general-purpose transcription.

**Why it might work:**

- Designed for **research** and **accurate transcription**, not just dictation
- Known to preserve more natural speech patterns
- Used in academic/linguistic research contexts
- Can be self-hosted OR accessed via API

**Deployment options:**

- **Self-hosted:** Run Whisper model in our own backend (Firebase Functions may be too limited; would need Cloud Run or similar)
- **Third-party API:** Services like Replicate, AssemblyAI (which uses Whisper), or Groq offer Whisper API access
- **Hybrid:** Use Whisper.cpp for efficient server-side processing

**Next steps:**

- Test Whisper with audio containing "um," "ah," "uh"
- Verify disfluencies appear in transcripts
- Evaluate latency for real-time use case
- Assess cost vs. self-hosting complexity

**Cost (estimated):**

- Self-hosted on Cloud Run: ~$0.05-0.15 per minute (compute + storage)
- Third-party APIs: ~$0.006-0.024 per minute (similar to Google STT)

---

### 2. AssemblyAI with Disfluency Detection

**Description:** Modern STT API designed for developers, with explicit features for analysis.

**Why it might work:**

- Markets itself as "STT for developers" not just dictation
- May have explicit disfluency or filler word detection features
- Good documentation and support

**Next steps:**

- Check if AssemblyAI has a "disfluencies" or "raw transcript" mode
- Test with sample audio
- Review pricing and free tier options

**Cost:**

- No free tier
- ~$0.015-0.028 per minute depending on features

---

### 3. Hybrid Approach: Audio Analysis + STT

**Description:** Use MediaRecorder + basic audio analysis to detect "um" sounds directly, supplementing any STT service.

**Why it might work:**

- "Um," "ah," "uh" have distinct acoustic signatures (formant patterns, frequency ranges)
- Can be detected with relatively simple signal processing
- Gives us full control over detection
- Can supplement any STT service (even Web Speech API) for other filler types

**Technical approach:**

- Capture audio with MediaRecorder
- Use Web Audio API to analyze frequency spectrum
- Detect characteristic "um" patterns (mid-frequency, nasal resonance)
- Combine with STT for discourse markers ("like," "you know")

**Challenges:**

- More complex implementation
- Need to tune detection for accuracy (false positives/negatives)
- May not work as well across different accents/voices
- Adds computational overhead

**Next steps:**

- Research filled pause acoustic signatures
- Prototype basic detector with Web Audio API
- Test accuracy across diverse speakers

---

### 4. Specialized Speech Analysis APIs

**Services to investigate:**

- **Deepgram:** Markets itself as real-time STT with advanced features
- **Rev.ai:** Professional transcription service, may preserve disfluencies
- **Speechmatics:** Research-grade STT with linguistic features

**Next steps:**

- Survey these services for disfluency preservation features
- Request trials/demos with disfluency-heavy audio
- Compare pricing and integration complexity

---

## Recommended Path Forward

### Phase 1: Rapid Validation (1-2 days)

**Goal:** Determine which STT service(s) actually work for our use case.

1. **Create test audio file** with known disfluencies:
   - Clear recording with: "Um, hello. My name is, uh, John. I'm, like, really excited, you know, to test this. Ah, it's great."
   - Count known instances: X "ums", Y "uhs", Z "likes", etc.

2. **Test services in parallel:**
   - Google Cloud Speech-to-Text (standard model, all settings tested)
   - OpenAI Whisper (via Replicate or Groq API)
   - AssemblyAI (standard + any disfluency features)
   - Deepgram (if API access available)

3. **Compare results:**
   - Which service preserves the most disfluencies?
   - How accurate are the preserved disfluencies?
   - What's the latency for real-time use?
   - What's the cost?

4. **Make architecture decision:**
   - If ONE service works well → proceed with that architecture
   - If NONE work well → pivot to hybrid approach (audio analysis + STT)
   - If MULTIPLE work → choose based on cost/latency/ease of integration

### Phase 2: Architecture Implementation (P1)

**Only proceed after Phase 1 validation.**

Based on Phase 1 results:

- Update technical architecture guide with validated service
- Implement backend STT integration (or audio analysis)
- Update frontend to use MediaRecorder API
- Test end-to-end with real users

---

## Documentation Updated

The following documentation has been updated to reflect the backend STT architecture (pending validation):

- ✅ `technical-architecture-guide.md` - Documents MediaRecorder + backend STT approach
- ✅ `product-requirements-document.md` - Updates P1 requirements and privacy principles
- ⚠️ **Both documents assume STT services preserve disfluencies** - this is NOT yet validated

---

## Why This Matters

**The core value proposition of Fluent is helping users identify ALL filler words, especially unconscious filled pauses.**

If we launch with an STT service that filters "um" and "ah," the app would:

- Only detect ~50% of filler words (discourse markers but not filled pauses)
- Miss the most unconscious and common type of disfluency
- Provide inaccurate feedback to users
- Fail to deliver on our core promise

**This is a P0 blocker.** We cannot proceed with P1 implementation until we validate an STT solution that works for our use case.

---

## Next Steps (When Project Resumes)

1. **Allocate 1-2 days for STT service testing** (Phase 1 above)
2. **Create test audio files** with known disfluencies
3. **Test Whisper first** (most promising based on research use cases)
4. **Test AssemblyAI second** (explicit research/analysis positioning)
5. **Test Google/AWS/Azure third** (document findings for reference)
6. **Make go/no-go decision** on architecture
7. **Update documentation** with validated service and real test results
8. **Proceed with P1 implementation**

---

## References

- Web Speech API Test Component: `src/tests/webspeech-test.tsx` (deleted after testing, can be recreated from git history)
- Test Results: Browser console logs from October 24, 2025 testing session
- Architecture Documentation: `technical-architecture-guide.md`, `product-requirements-document.md`

---

## Open Questions

1. Does Whisper preserve "um," "ah," "uh" in transcripts?
2. What's Whisper's latency for real-time streaming use cases?
3. Can we self-host Whisper cost-effectively on Cloud Run?
4. Do any commercial STT services have explicit "preserve disfluencies" modes?
5. How accurate is audio-based detection of filled pauses?
6. What's the user tolerance for latency in "real-time" feedback? (2s? 5s? 10s?)

---

## Contact / Resumption

When resuming this project:

1. Review this document
2. Review updated architecture docs
3. Start with Phase 1 validation testing
4. Update this document with findings
5. Make architecture decision before implementing P1

**Status:** On hold until STT service validation completed.
