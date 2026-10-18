/**
 * Continuous Hands-Free Speech Recognition and Speech Synthesis Engine
 * Features:
 * - Persistent hands-free conversational session (Siri mode)
 * - Automatic recovery & restart on browser SpeechRecognition onend / timeout
 * - Half-duplex acoustic feedback protection (pauses mic while speaking so assistant never transcribes itself)
 * - Exponential backoff for transient network errors
 * - Natural multilingual TTS (English & Hindi/Hinglish) with voice auto-selection
 * - Dynamic 7-band audio waveform visualizer simulation
 */

export interface SpeechErrorEvent {
  type: "not-allowed" | "no-speech" | "network" | "audio-capture" | "aborted" | "unsupported" | "unknown";
  message: string;
}

export class SpeechEngine {
  private recognition: any = null;
  public isSessionActive = false; // Persistent session state across commands
  public isListening = false;     // Individual recognition stream active
  public isSpeaking = false;      // Speech synthesis speaking
  public isPaused = false;        // Temporarily paused by user
  private waveformTimer: any = null;
  private restartTimer: any = null;
  private speechTimeoutTimer: any = null;
  private consecutiveErrors = 0;
  private manualStop = false;

  public currentLanguage: "en" | "hi" = "en";
  public voiceEnabled = true;
  private configuredVoice: SpeechSynthesisVoice | null = null;

  // Event handlers
  public onStart?: () => void;
  public onEnd?: () => void;
  public onInterimResult?: (transcript: string) => void;
  public onFinalResult?: (transcript: string) => void;
  public onError?: (error: SpeechErrorEvent) => void;
  public onWaveformChange?: (levels: number[]) => void;
  public onStateChange?: (state: "listening" | "speaking" | "resuming" | "idle") => void;

  constructor() {
    this.initVoice();
  }

  private initVoice() {
    if (typeof window === "undefined" || !this.isSynthesisSupported()) return;

    const selectSingleVoice = () => {
      if (this.configuredVoice) return;
      try {
        const voices = window.speechSynthesis.getVoices();
        if (!voices || voices.length === 0) return;

        // Choose exactly ONE high-quality natural voice for all assistant responses
        const chosen =
          voices.find((v) => v.lang === "en-US" && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Samantha") || v.name.includes("Jenny"))) ||
          voices.find((v) => v.lang.startsWith("en") && (v.name.includes("Natural") || v.name.includes("Google") || v.name.includes("Siri"))) ||
          voices.find((v) => v.lang.startsWith("en") && v.default) ||
          voices.find((v) => v.lang.startsWith("en")) ||
          voices[0];

        if (chosen) {
          this.configuredVoice = chosen;
        }
      } catch (_) {}
    };

    selectSingleVoice();
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = selectSingleVoice;
    }
  }

  public isSupported(): boolean {
    if (typeof window === "undefined") return false;
    return Boolean(
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition
    );
  }

  public isSpeechSupported(): boolean {
    return this.isSupported();
  }

  public isSynthesisSupported(): boolean {
    if (typeof window === "undefined") return false;
    return typeof window.speechSynthesis !== "undefined";
  }

  public setLanguage(lang: "en" | "hi") {
    this.currentLanguage = lang;
    if (this.recognition) {
      try {
        this.recognition.lang = lang === "hi" ? "hi-IN" : "en-US";
      } catch (_) {}
    }
  }

  public setVoiceEnabled(enabled: boolean) {
    this.voiceEnabled = enabled;
    if (!enabled && this.isSynthesisSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
  }

  /**
   * Starts a persistent continuous hands-free session
   */
  public startSession(lang?: "en" | "hi") {
    if (lang) this.currentLanguage = lang;
    this.isSessionActive = true;
    this.isPaused = false;
    this.manualStop = false;
    this.consecutiveErrors = 0;

    this.startRecognition();
  }

  /**
   * Legacy alias for starting session
   */
  public start(lang?: "en" | "hi") {
    this.startSession(lang);
  }

  /**
   * Stops the persistent session permanently until manually restarted
   */
  public stopSession() {
    this.isSessionActive = false;
    this.isPaused = false;
    this.manualStop = true;
    this.clearRestartTimer();
    this.stopSpeaking();
    this.stopRecognition();
  }

  /**
   * Alias for stopSession
   */
  public stop() {
    this.stopSession();
  }

  public stopListening() {
    this.stopSession();
  }

  /**
   * Temporarily pauses listening without terminating the session
   */
  public pauseSession() {
    this.isPaused = true;
    this.clearRestartTimer();
    this.stopRecognition();
  }

  /**
   * Resumes listening in an active session
   */
  public resumeSession() {
    this.isPaused = false;
    this.manualStop = false;
    if (this.isSessionActive && !this.isSpeaking) {
      this.startRecognition();
    }
  }

  private clearRestartTimer() {
    if (this.restartTimer) {
      clearTimeout(this.restartTimer);
      this.restartTimer = null;
    }
  }

  /**
   * Internal method to spin up a single browser SpeechRecognition instance.
   * If the session is active, it automatically restarts when browser onend fires.
   */
  private startRecognition() {
    this.clearRestartTimer();

    // Do not start mic while synthesizer is speaking or if session is off/paused
    if (!this.isSessionActive || this.isSpeaking || this.isPaused) {
      return;
    }

    if (!this.isSupported()) {
      this.onError?.({
        type: "unsupported",
        message: "Speech recognition is not supported in this browser. You can type commands directly.",
      });
      this.isSessionActive = false;
      return;
    }

    // Clean up existing recognition before creating a new one
    this.stopRecognition();

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      const rec = new SpeechRecognition();
      this.recognition = rec;
      rec.continuous = false; // Single utterance mode + auto restart gives perfect sentence boundaries
      rec.interimResults = true;
      rec.maxAlternatives = 1;
      rec.lang = this.currentLanguage === "hi" ? "hi-IN" : "en-US";

      let finalCaptured = "";

      rec.onstart = () => {
        // Double check we haven't been silenced while starting
        if (!this.isSessionActive || this.isSpeaking || this.isPaused) {
          try { rec.stop(); } catch (_) {}
          return;
        }
        this.isListening = true;
        this.consecutiveErrors = 0;
        this.startWaveform();
        this.onStart?.();
        this.onStateChange?.("listening");
      };

      rec.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const res = event.results[i];
          const text = res[0]?.transcript || "";
          if (res.isFinal) {
            finalCaptured += text;
          } else {
            interim += text;
          }
        }

        if (finalCaptured.trim()) {
          this.onFinalResult?.(finalCaptured.trim());
        } else if (interim.trim()) {
          this.onInterimResult?.(interim.trim());
        }
      };

      rec.onerror = (event: any) => {
        this.stopWaveform();
        this.isListening = false;
        const errType: string = event.error || "unknown";

        // "no-speech" is completely normal when user pauses. Never drop the session!
        if (errType === "no-speech") {
          if (this.isSessionActive && !this.isSpeaking && !this.isPaused && !this.manualStop) {
            this.scheduleRestart(120);
          }
          return;
        }

        // "aborted" often happens when user or speak() stops the mic
        if (errType === "aborted") {
          if (this.isSessionActive && !this.isSpeaking && !this.isPaused && !this.manualStop) {
            this.scheduleRestart(120);
          }
          return;
        }

        // Permission denied is fatal
        if (errType === "not-allowed" || errType === "permission-denied") {
          this.isSessionActive = false;
          this.onError?.({
            type: "not-allowed",
            message: "Microphone access was denied. Please allow microphone permissions in your browser.",
          });
          return;
        }

        // Network error - retry with backoff
        if (errType === "network") {
          this.consecutiveErrors++;
          const delay = Math.min(3000, 400 * Math.pow(1.5, this.consecutiveErrors));
          if (this.isSessionActive && !this.isSpeaking && !this.isPaused && !this.manualStop) {
            this.scheduleRestart(delay);
          }
          return;
        }

        // Other generic errors
        this.consecutiveErrors++;
        if (this.consecutiveErrors <= 4 && this.isSessionActive && !this.isSpeaking && !this.isPaused && !this.manualStop) {
          this.scheduleRestart(400);
        } else {
          this.onError?.({
            type: (errType as any) || "unknown",
            message: event.message || "Speech recognition encountered an issue. Resuming shortly.",
          });
          if (this.isSessionActive && !this.isSpeaking && !this.isPaused) {
            this.scheduleRestart(1000);
          }
        }
      };

      rec.onend = () => {
        this.isListening = false;
        this.stopWaveform();
        this.onEnd?.();

        // If continuous session is active and we are not speaking, restart recognition immediately
        if (this.isSessionActive && !this.isSpeaking && !this.isPaused && !this.manualStop) {
          this.scheduleRestart(100);
        }
      };

      rec.start();
    } catch (err: any) {
      this.isListening = false;
      this.stopWaveform();
      if (this.isSessionActive && !this.isSpeaking && !this.isPaused && !this.manualStop) {
        this.scheduleRestart(500);
      }
    }
  }

  /**
   * Internal scheduler to safely restart recognition
   */
  private scheduleRestart(delayMs: number) {
    this.clearRestartTimer();
    if (!this.isSessionActive || this.isSpeaking || this.isPaused || this.manualStop) {
      return;
    }
    this.restartTimer = window.setTimeout(() => {
      if (this.isSessionActive && !this.isSpeaking && !this.isPaused && !this.manualStop) {
        this.startRecognition();
      }
    }, delayMs);
  }

  /**
   * Stops just the low-level recognition instance without ending the continuous session
   */
  public stopRecognition() {
    if (this.recognition) {
      try {
        this.recognition.onstart = null;
        this.recognition.onresult = null;
        this.recognition.onerror = null;
        this.recognition.onend = null;
        this.recognition.stop();
        this.recognition.abort();
      } catch (_) {}
      this.recognition = null;
    }
    this.isListening = false;
    this.stopWaveform();
  }

  /**
   * Natural multilingual Speech Synthesis with Half-Duplex feedback protection.
   * Pauses microphone while speaking, and automatically resumes recognition when done.
   */
  public speak(text: string, lang?: "en" | "hi", onComplete?: () => void) {
    if (!this.voiceEnabled || !this.isSynthesisSupported()) {
      onComplete?.();
      return;
    }

    try {
      // 1. Half-Duplex: Pause recognition so assistant does not hear its own voice
      this.isSpeaking = true;
      this.clearRestartTimer();
      this.stopRecognition();
      this.onStateChange?.("speaking");

      // Cancel any ongoing utterance
      window.speechSynthesis.cancel();
      if (this.speechTimeoutTimer) {
        clearTimeout(this.speechTimeoutTimer);
        this.speechTimeoutTimer = null;
      }

      // Clean text: strip markdown symbols, asterisks, URLs, hashes
      const cleanText = text
        .replace(/[*#`_\[\]()]/g, "")
        .replace(/https?:\/\/\S+/g, "")
        .replace(/\s+/g, " ")
        .trim();

      if (!cleanText) {
        this.finishSpeaking(onComplete);
        return;
      }

      const utterance = new SpeechSynthesisUtterance(cleanText);
      const targetLang = lang || this.currentLanguage;
      utterance.lang = targetLang === "hi" ? "hi-IN" : "en-US";
      utterance.rate = 1.05;
      utterance.pitch = 1.0;

      // Use the single locked voice for every response
      if (!this.configuredVoice) {
        this.initVoice();
      }
      if (this.configuredVoice) {
        utterance.voice = this.configuredVoice;
      }

      let hasFinished = false;
      const handleFinish = () => {
        if (hasFinished) return;
        hasFinished = true;
        this.finishSpeaking(onComplete);
      };

      utterance.onend = handleFinish;
      utterance.onerror = handleFinish;

      // Safety timeout: prevents browser SpeechSynthesis hang bug
      const estimatedDurationMs = Math.max(3500, cleanText.length * 85);
      this.speechTimeoutTimer = window.setTimeout(handleFinish, estimatedDurationMs);

      window.speechSynthesis.speak(utterance);
    } catch (_) {
      this.finishSpeaking(onComplete);
    }
  }

  /**
   * Finalizes speech synthesis and safely restarts recognition after acoustic buffer
   */
  private finishSpeaking(onComplete?: () => void) {
    if (this.speechTimeoutTimer) {
      clearTimeout(this.speechTimeoutTimer);
      this.speechTimeoutTimer = null;
    }
    this.isSpeaking = false;
    onComplete?.();

    // If continuous session is active, resume microphone after an acoustic buffer window
    // (280ms allows room speaker echoes to dissipate so mic doesn't catch them)
    if (this.isSessionActive && !this.isPaused && !this.manualStop) {
      this.onStateChange?.("resuming");
      this.scheduleRestart(280);
    } else {
      this.onStateChange?.("idle");
    }
  }

  public stopSpeaking() {
    if (this.speechTimeoutTimer) {
      clearTimeout(this.speechTimeoutTimer);
      this.speechTimeoutTimer = null;
    }
    if (this.isSynthesisSupported()) {
      try {
        window.speechSynthesis.cancel();
      } catch (_) {}
    }
    this.isSpeaking = false;
  }

  public startWaveform() {
    this.stopWaveform();
    this.waveformTimer = setInterval(() => {
      const bars = 7;
      const levels: number[] = [];
      const baseTime = Date.now() / 140;
      for (let i = 0; i < bars; i++) {
        const sine = Math.sin(baseTime + i * 0.95);
        const rand = Math.random() * 0.3;
        const val = Math.max(15, Math.min(100, Math.round((Math.abs(sine) * 0.75 + rand) * 100)));
        levels.push(val);
      }
      this.onWaveformChange?.(levels);
    }, 75);
  }

  public stopWaveform() {
    if (this.waveformTimer) {
      clearInterval(this.waveformTimer);
      this.waveformTimer = null;
    }
    this.onWaveformChange?.([15, 25, 45, 60, 45, 25, 15]);
  }
}

export const speechEngine = new SpeechEngine();
