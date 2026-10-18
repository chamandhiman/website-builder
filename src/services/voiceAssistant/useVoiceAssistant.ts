import { useState, useEffect, useRef, useCallback } from "react";
import { toast } from "sonner";
import { SpeechEngine } from "./speechEngine";
import { agentExecutor } from "./agentExecutor";
import type {
  AssistantState,
  AssistantLanguage,
  SessionMode,
  CommandHistoryItem,
  AssistantConfirmation,
  AgentExecutionLog,
} from "./voiceTypes";

const HISTORY_STORAGE_KEY = "wto_voice_assistant_history";
const INACTIVITY_TIMEOUT_MS = 5000;
const WAKE_WORD_REGEX = /^(?:hey\s+siri|siri|ok\s+siri|hey\s+assistant)[,\s]*(.*)$/i;

export function useVoiceAssistant() {
  const [sessionMode, setSessionMode] = useState<SessionMode>("standby");
  const [state, setState] = useState<AssistantState>("idle");
  const [language, setLanguage] = useState<AssistantLanguage>("en");
  const [transcript, setTranscript] = useState<string>("");
  const [interimTranscript, setInterimTranscript] = useState<string>("");
  const [statusMessage, setStatusMessage] = useState<string>("Standby — say 'Hey Siri'");
  const [waveformLevels, setWaveformLevels] = useState<number[]>([15, 25, 45, 60, 45, 25, 15]);
  const [speechFeedbackEnabled, setSpeechFeedbackEnabled] = useState<boolean>(true);
  const [panelOpen, setPanelOpen] = useState<boolean>(false);
  const [confirmation, setConfirmation] = useState<AssistantConfirmation | null>(null);
  const [spokenTooltip, setSpokenTooltip] = useState<string>("");
  const [agentLogs, setAgentLogs] = useState<AgentExecutionLog[]>([]);
  const [history, setHistory] = useState<CommandHistoryItem[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const engineRef = useRef<SpeechEngine | null>(null);
  const confirmationRef = useRef<AssistantConfirmation | null>(null);
  confirmationRef.current = confirmation;

  const sessionModeRef = useRef<SessionMode>("standby");
  sessionModeRef.current = sessionMode;

  const inactivityTimerRef = useRef<any>(null);
  const isBusyRef = useRef<boolean>(false);

  // Clear 5-second inactivity timer
  const clearInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
  }, []);

  // Arm 5-second inactivity timer (called ONLY after command + TTS completely finish)
  const armInactivityTimer = useCallback(() => {
    clearInactivityTimer();
    if (sessionModeRef.current !== "active" || isBusyRef.current) return;

    inactivityTimerRef.current = setTimeout(() => {
      // Return to standby after genuine 5 seconds of silence
      if (sessionModeRef.current === "active" && !isBusyRef.current) {
        sessionModeRef.current = "standby";
        setSessionMode("standby");
        setState("idle");
        setStatusMessage("Standby — say 'Hey Siri'");
      }
    }, INACTIVITY_TIMEOUT_MS);
  }, [clearInactivityTimer]);

  // Save history to localStorage
  const addHistoryItem = useCallback((item: Omit<CommandHistoryItem, "id" | "timestamp">) => {
    setHistory((prev) => {
      const newItem: CommandHistoryItem = {
        ...item,
        id: Math.random().toString(36).substring(2, 9),
        timestamp: Date.now(),
      };
      const updated = [newItem, ...prev.slice(0, 19)];
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });
  }, []);

  // Autonomous Agent Instruction Pipeline
  const handleProcessInstruction = useCallback(
    async (rawText: string) => {
      if (!rawText.trim()) return;
      const cleanCmd = rawText.trim().toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, "").trim();

      // Clear any pending inactivity timer during active execution
      clearInactivityTimer();
      isBusyRef.current = true;

      // -----------------------------------------------------------------------
      // 1. EXPLICIT STOP COMMANDS ("I'm done", "Stop listening", "Go to sleep", etc.)
      // -----------------------------------------------------------------------
      const STOP_PATTERNS =
        /^(i am done|i'm done|stop listening|stop|turn off the assistant|turn off|go to sleep|end voice session|end session|band karo|so jao|bas ho gaya|goodbye|bye|quit)$/i;

      if (STOP_PATTERNS.test(cleanCmd)) {
        sessionModeRef.current = "standby";
        setSessionMode("standby");
        setState("idle");
        setStatusMessage("Standby — say 'Hey Siri'");
        setSpokenTooltip("Alright.");
        isBusyRef.current = false;
        clearInactivityTimer();

        if (speechFeedbackEnabled && engineRef.current) {
          engineRef.current.speak("Alright.", language, () => {
            setTimeout(() => setSpokenTooltip(""), 1200);
          });
        } else {
          setTimeout(() => setSpokenTooltip(""), 1200);
        }
        return;
      }

      // -----------------------------------------------------------------------
      // 2. PAUSE COMMANDS ("pause listening", "hold on", "wait a minute", etc.)
      // -----------------------------------------------------------------------
      const PAUSE_PATTERNS =
        /^(pause listening|pause|hold on|wait a minute|ruko|thoda ruko|pause assistant)$/i;

      if (PAUSE_PATTERNS.test(cleanCmd)) {
        sessionModeRef.current = "standby";
        setSessionMode("standby");
        setState("paused");
        setStatusMessage("Paused.");
        setSpokenTooltip("Paused.");
        isBusyRef.current = false;
        clearInactivityTimer();

        if (speechFeedbackEnabled && engineRef.current) {
          engineRef.current.speak("Paused.", language, () => {
            setTimeout(() => setSpokenTooltip(""), 1200);
          });
        } else {
          setTimeout(() => setSpokenTooltip(""), 1200);
        }
        return;
      }

      // -----------------------------------------------------------------------
      // 3. HANDS-FREE CONFIRMATION VOICE FLOW
      // -----------------------------------------------------------------------
      const currentConfirmation = confirmationRef.current;
      if (currentConfirmation) {
        const isAffirmative =
          /\b(yes|yeah|yep|sure|confirm|proceed|publish|do it|haan|karo|theek hai)\b/i.test(cleanCmd);
        const isNegative =
          /\b(no|nope|cancel|stop|don't|dont|nahi|ruk jao|band karo)\b/i.test(cleanCmd);

        if (isAffirmative) {
          setConfirmation(null);
          setState("executing");
          setStatusMessage("Executing...");
          try {
            await currentConfirmation.onConfirm();
            isBusyRef.current = false;
            if (speechFeedbackEnabled && engineRef.current) {
              setSpokenTooltip("Done.");
              setState("speaking");
              engineRef.current.speak("Done.", language, () => {
                setSpokenTooltip("");
                if (sessionModeRef.current === "active") {
                  setState("listening");
                  setStatusMessage("Listening…");
                  armInactivityTimer();
                } else {
                  setState("idle");
                }
              });
            } else if (sessionModeRef.current === "active") {
              setState("listening");
              setStatusMessage("Listening…");
              armInactivityTimer();
            }
          } catch (e: any) {
            isBusyRef.current = false;
            toast.error(e?.message || "Action failed");
            armInactivityTimer();
          }
          return;
        } else if (isNegative) {
          setConfirmation(null);
          currentConfirmation.onCancel();
          isBusyRef.current = false;
          setState("listening");
          setStatusMessage("Cancelled.");
          setSpokenTooltip("Cancelled.");
          if (speechFeedbackEnabled && engineRef.current) {
            setState("speaking");
            engineRef.current.speak("Cancelled.", language, () => {
              setSpokenTooltip("");
              if (sessionModeRef.current === "active") {
                setState("listening");
                setStatusMessage("Listening…");
                armInactivityTimer();
              }
            });
          } else {
            armInactivityTimer();
          }
          return;
        } else {
          setSpokenTooltip("Say yes or cancel.");
          if (speechFeedbackEnabled && engineRef.current) {
            setState("speaking");
            engineRef.current.speak("Say yes or cancel.", language, () => {
              setTimeout(() => setSpokenTooltip(""), 1500);
              if (sessionModeRef.current === "active") {
                setState("confirming");
              }
            });
          }
          return;
        }
      }

      // -----------------------------------------------------------------------
      // 4. REGULAR AUTONOMOUS AGENT PIPELINE
      // -----------------------------------------------------------------------
      setState("observing");
      setStatusMessage("Interpreting...");
      setAgentLogs([]);

      try {
        const result = await agentExecutor.execute(rawText.trim(), {
          onLog: (log) => {
            setAgentLogs((prev) => [...prev, log]);
            setStatusMessage(log.title);
          },
          onStateChange: (newState) => {
            setState(newState);
          },
          onConfirmationRequired: (confirmItem) => {
            setConfirmation(confirmItem);
            setSpokenTooltip(confirmItem.description);
            if (speechFeedbackEnabled && engineRef.current) {
              setState("speaking");
              engineRef.current.speak(confirmItem.description, language, () => {
                setState("confirming");
              });
            }
          },
        });

        // ---------------------------------------------------------------------
        // 5. RESULT HANDLING & AUTOMATIC 5-SECOND INACTIVITY ARMING
        // ---------------------------------------------------------------------
        if (result.success) {
          setStatusMessage(result.message);

          addHistoryItem({
            transcript: rawText,
            commandType: "AGENT_EXECUTION",
            success: true,
            message: result.message,
            stepsCount: result.logs.length,
          });

          if (result.message && speechFeedbackEnabled && engineRef.current) {
            setSpokenTooltip(result.message);
            setState("speaking");
            engineRef.current.speak(result.message, language, () => {
              isBusyRef.current = false;
              setSpokenTooltip("");
              if (sessionModeRef.current === "active") {
                setState("listening");
                setStatusMessage("Listening…");
                armInactivityTimer();
              } else {
                setState("idle");
              }
            });
          } else {
            // Silent execution (scrolling, etc.)
            isBusyRef.current = false;
            setSpokenTooltip("");
            if (sessionModeRef.current === "active") {
              setState("listening");
              setStatusMessage("Listening…");
              engineRef.current?.resumeSession();
              armInactivityTimer();
            } else {
              setState("idle");
            }
          }
        } else {
          // Recovery from error
          setStatusMessage(result.message);

          addHistoryItem({
            transcript: rawText,
            commandType: "AGENT_EXECUTION",
            success: false,
            message: result.message,
          });

          if (result.message && speechFeedbackEnabled && engineRef.current) {
            setSpokenTooltip(result.message);
            setState("speaking");
            engineRef.current.speak(result.message, language, () => {
              isBusyRef.current = false;
              setSpokenTooltip("");
              if (sessionModeRef.current === "active") {
                setState("listening");
                setStatusMessage("Listening…");
                armInactivityTimer();
              } else {
                setState("idle");
              }
            });
          } else {
            isBusyRef.current = false;
            setSpokenTooltip("");
            if (sessionModeRef.current === "active") {
              setState("listening");
              setStatusMessage("Listening…");
              engineRef.current?.resumeSession();
              armInactivityTimer();
            } else {
              setState("idle");
            }
          }
        }
      } catch (err: any) {
        isBusyRef.current = false;
        const errMsg = err?.message || "Agent execution encountered an error.";
        setStatusMessage(errMsg);
        toast.error(errMsg);

        if (speechFeedbackEnabled && engineRef.current) {
          setState("speaking");
          engineRef.current.speak(errMsg, language, () => {
            if (sessionModeRef.current === "active") {
              setState("listening");
              setStatusMessage(language === "hi" ? "Sun raha hoon…" : "Listening…");
              armInactivityTimer();
            } else {
              setState("idle");
            }
          });
        } else if (sessionModeRef.current === "active") {
          armInactivityTimer();
        }
      }
    },
    [language, speechFeedbackEnabled, addHistoryItem, clearInactivityTimer, armInactivityTimer]
  );

  // High-level incoming utterance processor (handles Wake Word & Mode Transitions)
  const handleIncomingUtterance = useCallback(
    (utterance: string) => {
      const trimmed = utterance.trim();
      if (!trimmed) return;

      clearInactivityTimer();

      // CASE A: Standby Mode
      if (sessionModeRef.current === "standby") {
        const wakeMatch = trimmed.match(WAKE_WORD_REGEX);
        if (!wakeMatch) {
          // Ignore background speech while in standby
          return;
        }

        // Wake word recognized! Enter active session
        sessionModeRef.current = "active";
        setSessionMode("active");
        const trailingCommand = wakeMatch[1] ? wakeMatch[1].trim() : "";

        if (!trailingCommand) {
          // User just said "Hey Siri"
          setState("speaking");
          isBusyRef.current = true;
          setSpokenTooltip("I'm listening.");
          if (speechFeedbackEnabled && engineRef.current) {
            engineRef.current.speak("I'm listening.", language, () => {
              isBusyRef.current = false;
              setSpokenTooltip("");
              setState("listening");
              setStatusMessage("Listening…");
              armInactivityTimer();
            });
          } else {
            isBusyRef.current = false;
            setState("listening");
            setStatusMessage("Listening…");
            armInactivityTimer();
          }
          return;
        }

        // User said "Hey Siri, [instruction]"
        void handleProcessInstruction(trailingCommand);
        return;
      }

      // CASE B: Active Mode
      // Check if command begins with wake word (e.g. "Hey Siri, find the WhatsApp widget")
      const wakeMatch = trimmed.match(WAKE_WORD_REGEX);
      const commandToRun = wakeMatch && wakeMatch[1] ? wakeMatch[1].trim() : trimmed;
      void handleProcessInstruction(commandToRun);
    },
    [clearInactivityTimer, armInactivityTimer, handleProcessInstruction, language, speechFeedbackEnabled]
  );

  // Initialize SpeechEngine once and listen continuously
  useEffect(() => {
    const engine = new SpeechEngine();
    engineRef.current = engine;

    engine.onStart = () => {
      if (sessionModeRef.current === "active") {
        setState("listening");
        setStatusMessage(language === "hi" ? "Sun raha hoon…" : "Listening…");
      }
    };

    engine.onEnd = () => {
      if (!engine.isSessionActive) {
        setState("idle");
      }
    };

    engine.onStateChange = (engState) => {
      if (engState === "listening") {
        if (sessionModeRef.current === "active") {
          setState("listening");
          setStatusMessage(language === "hi" ? "Sun raha hoon…" : "Listening…");
        } else {
          setState("idle");
          setStatusMessage("Standby — say 'Hey Siri'");
        }
      } else if (engState === "speaking") {
        setState("speaking");
      } else if (engState === "resuming") {
        if (sessionModeRef.current === "active") {
          setState("resuming");
          setStatusMessage("Resuming mic…");
        }
      } else if (engState === "idle" && !engine.isSessionActive) {
        setState("idle");
        setStatusMessage("Standby — say 'Hey Siri'");
      }
    };

    engine.onInterimResult = (interim) => {
      // User speech detected: reset inactivity countdown
      clearInactivityTimer();
      setInterimTranscript(interim);
    };

    engine.onFinalResult = (finalText) => {
      clearInactivityTimer();
      setTranscript(finalText);
      setInterimTranscript("");
      handleIncomingUtterance(finalText);
    };

    engine.onError = (err) => {
      if (err.type === "not-allowed") {
        setState("error");
        setStatusMessage("Microphone access denied. Please allow microphone permissions.");
        toast.error("Microphone access denied.");
      } else if (err.type !== "no-speech" && err.type !== "aborted") {
        setStatusMessage(`Speech: ${err.message}`);
      }
    };

    engine.onWaveformChange = (levels) => {
      setWaveformLevels(levels);
    };

    // Auto-start continuous standby background listening if supported
    try {
      if (engine.isSpeechSupported()) {
        engine.startSession(language);
      }
    } catch (_) {}

    return () => {
      clearInactivityTimer();
      engine.stopSession();
    };
  }, [language, clearInactivityTimer, handleIncomingUtterance]);

  // Activate session manually
  const startListening = useCallback(() => {
    clearInactivityTimer();
    sessionModeRef.current = "active";
    setSessionMode("active");
    setPanelOpen(true);
    setState("listening");
    setStatusMessage("Listening…");

    if (engineRef.current) {
      if (!engineRef.current.isSessionActive) {
        engineRef.current.startSession(language);
      } else {
        engineRef.current.resumeSession();
      }
    }
    armInactivityTimer();
  }, [language, clearInactivityTimer, armInactivityTimer]);

  // Return to standby mode
  const stopListening = useCallback(() => {
    clearInactivityTimer();
    sessionModeRef.current = "standby";
    setSessionMode("standby");
    setState("idle");
    setStatusMessage("Standby — say 'Hey Siri'");
  }, [clearInactivityTimer]);

  // Cancel ongoing action or dismiss confirmation
  const cancelAction = useCallback(() => {
    clearInactivityTimer();
    agentExecutor.cancel();
    if (confirmation) {
      confirmation.onCancel();
      setConfirmation(null);
    }
    if (sessionModeRef.current === "active") {
      setState("listening");
      setStatusMessage("Action cancelled. Listening…");
      armInactivityTimer();
    } else {
      setState("idle");
      setStatusMessage("Action cancelled");
    }
  }, [confirmation, clearInactivityTimer, armInactivityTimer]);

  // Execute manual typed command
  const executeTextCommand = useCallback(
    (text: string) => {
      sessionModeRef.current = "active";
      setSessionMode("active");
      setTranscript(text);
      setInterimTranscript("");
      void handleProcessInstruction(text);
    },
    [handleProcessInstruction]
  );

  // Clear command history
  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {}
  }, []);

  // Global keyboard shortcut: Alt + V to toggle Active <-> Standby
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === "v" || e.key === "V")) {
        e.preventDefault();
        if (sessionModeRef.current === "active") {
          stopListening();
        } else {
          startListening();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startListening, stopListening]);

  return {
    sessionMode,
    state,
    language,
    setLanguage,
    isSpeechSupported: engineRef.current?.isSpeechSupported() ?? false,
    transcript,
    interimTranscript,
    statusMessage,
    waveformLevels,
    speechFeedbackEnabled,
    setSpeechFeedbackEnabled,
    panelOpen,
    setPanelOpen,
    confirmation,
    spokenTooltip,
    agentLogs,
    history,
    startListening,
    stopListening,
    cancelAction,
    executeTextCommand,
    clearHistory,
  };
}
