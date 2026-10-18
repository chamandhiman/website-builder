import React, { useState } from "react";
import {
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  X,
  History,
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ShieldAlert,
  Compass,
  Square,
  Bot,
  Activity,
  ArrowRight,
  ListOrdered,
  Eye,
} from "lucide-react";
import type {
  AssistantState,
  AssistantLanguage,
  CommandHistoryItem,
  AssistantConfirmation,
  AgentExecutionLog,
} from "@/services/voiceAssistant/voiceTypes";
import { AudioWaveform } from "./AudioWaveform";

interface VoiceAssistantPanelProps {
  state: AssistantState;
  language: AssistantLanguage;
  setLanguage: (lang: AssistantLanguage) => void;
  isSpeechSupported: boolean;
  transcript: string;
  interimTranscript: string;
  statusMessage: string;
  waveformLevels: number[];
  speechFeedbackEnabled: boolean;
  setSpeechFeedbackEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  confirmation: AssistantConfirmation | null;
  agentLogs: AgentExecutionLog[];
  history: CommandHistoryItem[];
  startListening: () => void;
  stopListening: () => void;
  cancelAction: () => void;
  executeTextCommand: (text: string) => void;
  clearHistory: () => void;
  onClose: () => void;
}

export const VoiceAssistantPanel: React.FC<VoiceAssistantPanelProps> = ({
  state,
  language,
  setLanguage,
  isSpeechSupported,
  transcript,
  interimTranscript,
  statusMessage,
  waveformLevels,
  speechFeedbackEnabled,
  setSpeechFeedbackEnabled,
  confirmation,
  agentLogs,
  history,
  startListening,
  stopListening,
  cancelAction,
  executeTextCommand,
  clearHistory,
  onClose,
}) => {
  const [inputText, setInputText] = useState("");
  const [activeTab, setActiveTab] = useState<"assistant" | "trace" | "history">("assistant");

  const isListening = state === "listening";
  const isAgentActive =
    state === "observing" ||
    state === "planning" ||
    state === "executing" ||
    state === "verifying" ||
    state === "speaking" ||
    state === "resuming";

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    executeTextCommand(inputText.trim());
    setInputText("");
  };

  const handleSuggestionClick = (cmdText: string) => {
    executeTextCommand(cmdText);
  };

  // State badge config
  const getStateBadge = () => {
    switch (state) {
      case "listening":
        return {
          label: language === "hi" ? "सुन रहा हूँ..." : "Listening...",
          badgeClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
          dotClass: "bg-cyan-400 animate-ping",
        };
      case "speaking":
        return {
          label: language === "hi" ? "बोल रहा हूँ..." : "Speaking...",
          badgeClass: "bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/30",
          dotClass: "bg-fuchsia-400 animate-pulse",
        };
      case "resuming":
        return {
          label: language === "hi" ? "माइक तैयार..." : "Resuming mic...",
          badgeClass: "bg-sky-500/20 text-sky-300 border-sky-500/30",
          dotClass: "bg-sky-400 animate-ping",
        };
      case "paused":
        return {
          label: language === "hi" ? "रोका गया" : "Paused",
          badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          dotClass: "bg-amber-400",
        };
      case "observing":
        return {
          label: "Observing Screen...",
          badgeClass: "bg-blue-500/20 text-blue-300 border-blue-500/30",
          dotClass: "bg-blue-400 animate-pulse",
        };
      case "planning":
        return {
          label: "Planning Actions...",
          badgeClass: "bg-purple-500/20 text-purple-300 border-purple-500/30",
          dotClass: "bg-purple-400 animate-spin",
        };
      case "executing":
        return {
          label: "Interacting With Screen...",
          badgeClass: "bg-indigo-500/20 text-indigo-300 border-indigo-500/30",
          dotClass: "bg-indigo-400 animate-pulse",
        };
      case "verifying":
        return {
          label: "Verifying Result...",
          badgeClass: "bg-teal-500/20 text-teal-300 border-teal-500/30",
          dotClass: "bg-teal-400 animate-ping",
        };
      case "confirming":
        return {
          label: "Confirmation Required",
          badgeClass: "bg-amber-500/20 text-amber-300 border-amber-500/30",
          dotClass: "bg-amber-400",
        };
      case "success":
        return {
          label: "Completed",
          badgeClass: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
          dotClass: "bg-emerald-400",
        };
      case "error":
        return {
          label: "Notice",
          badgeClass: "bg-rose-500/20 text-rose-300 border-rose-500/30",
          dotClass: "bg-rose-400",
        };
      case "idle":
      default:
        return {
          label: "Ready",
          badgeClass: "bg-zinc-700/40 text-zinc-300 border-zinc-600/40",
          dotClass: "bg-indigo-400",
        };
    }
  };

  const stateBadge = getStateBadge();

  return (
    <div className="relative flex flex-col w-[390px] sm:w-[440px] max-w-[94vw] h-[540px] max-h-[85vh] rounded-3xl bg-[#0c0c12]/95 backdrop-blur-2xl border border-white/10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.85),0_0_35px_rgba(99,102,241,0.22)] text-white overflow-hidden transition-all duration-300 select-none">
      {/* Top chromatic glowing accent line */}
      <div className="h-[2.5px] w-full bg-gradient-to-r from-blue-500 via-fuchsia-500 to-cyan-400" />

      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3 border-b border-white/10 bg-white/[0.02]">
        <div className="flex items-center gap-2.5">
          <div className="relative flex items-center justify-center h-7 w-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 shadow-sm">
            <Bot className="h-4 w-4 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-zinc-100 flex items-center gap-1.5">
              Siri AI Agent
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                SCREEN AWARE
              </span>
            </h3>
          </div>
        </div>

        {/* Header Controls */}
        <div className="flex items-center gap-1.5">
          {/* Language Selector */}
          <div className="flex items-center bg-black/40 rounded-lg p-0.5 border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setLanguage("en")}
              className={`px-2 py-1 rounded-md transition-all font-medium ${
                language === "en"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="English Natural Language"
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => setLanguage("hi")}
              className={`px-2 py-1 rounded-md transition-all font-medium ${
                language === "hi"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-zinc-400 hover:text-white"
              }`}
              title="Hindi & Hinglish (उदा. 'Dashboard kholo', 'Templates dikhao')"
            >
              HI / Hinglish
            </button>
          </div>

          {/* Voice Response Toggle */}
          <button
            type="button"
            onClick={() => setSpeechFeedbackEnabled((prev) => !prev)}
            className={`p-1.5 rounded-lg border transition-all ${
              speechFeedbackEnabled
                ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                : "bg-black/30 border-white/10 text-zinc-500 hover:text-zinc-300"
            }`}
            title={speechFeedbackEnabled ? "Spoken responses enabled" : "Spoken responses muted"}
            aria-label="Toggle spoken feedback"
          >
            {speechFeedbackEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
          </button>

          {/* Trace Log Tab Toggle */}
          <button
            type="button"
            onClick={() => setActiveTab((prev) => (prev === "trace" ? "assistant" : "trace"))}
            className={`p-1.5 rounded-lg border transition-all ${
              activeTab === "trace"
                ? "bg-cyan-500/20 border-cyan-500/40 text-cyan-300"
                : "bg-black/30 border-white/10 text-zinc-400 hover:text-white"
            }`}
            title="Agent Execution Trace"
            aria-label="View agent execution steps"
          >
            <ListOrdered className="h-4 w-4" />
          </button>

          {/* History Tab Toggle */}
          <button
            type="button"
            onClick={() => setActiveTab((prev) => (prev === "history" ? "assistant" : "history"))}
            className={`p-1.5 rounded-lg border transition-all ${
              activeTab === "history"
                ? "bg-indigo-500/20 border-indigo-500/40 text-indigo-300"
                : "bg-black/30 border-white/10 text-zinc-400 hover:text-white"
            }`}
            title="Command History"
            aria-label="View history"
          >
            <History className="h-4 w-4" />
          </button>

          {/* Close Panel Button */}
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
            title="Close Assistant (Esc)"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      {activeTab === "assistant" ? (
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-3.5">
          {/* Status Chip & Dynamic Waveform Bar */}
          <div className="flex items-center justify-between px-3.5 py-2 rounded-2xl bg-white/[0.03] border border-white/10">
            <div className="flex items-center gap-2">
              <span className={`h-2.5 w-2.5 rounded-full ${stateBadge.dotClass}`} />
              <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${stateBadge.badgeClass}`}>
                {stateBadge.label}
              </span>
            </div>
            <div className="flex items-center">
              <AudioWaveform levels={waveformLevels} isListening={isListening} />
            </div>
          </div>

          {/* Safety Confirmation Alert */}
          {confirmation && (
            <div className="rounded-2xl p-4 bg-amber-500/10 border border-amber-500/30 text-amber-200 animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-start gap-3">
                <ShieldAlert className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-300">
                    {confirmation.title}
                  </h4>
                  <p className="text-sm text-amber-100">{confirmation.description}</p>
                </div>
              </div>
              <div className="flex items-center justify-end gap-2.5 mt-3 pt-2 border-t border-amber-500/20">
                <button
                  type="button"
                  onClick={confirmation.onCancel}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-zinc-300 bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
                >
                  {confirmation.cancelLabel}
                </button>
                <button
                  type="button"
                  onClick={() => confirmation.onConfirm()}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-white bg-amber-600 hover:bg-amber-500 transition-colors shadow-sm"
                >
                  {confirmation.confirmLabel}
                </button>
              </div>
            </div>
          )}

          {/* Transcript / Spoken Output Box */}
          <div className="flex-1 min-h-[110px] p-3.5 rounded-2xl bg-gradient-to-b from-white/[0.05] to-transparent border border-white/10 flex flex-col justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider text-zinc-400 font-semibold mb-1 flex items-center justify-between">
                <span>User Request</span>
                {isListening ? (
                  <span className="text-cyan-400 text-[10px] animate-pulse">Capturing voice…</span>
                ) : isAgentActive ? (
                  <button
                    type="button"
                    onClick={cancelAction}
                    className="flex items-center gap-1 text-[10px] text-rose-400 hover:text-rose-300 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20 transition-colors"
                  >
                    <Square className="h-2.5 w-2.5 fill-current" /> Stop Agent
                  </button>
                ) : null}
              </div>
              <p className="text-sm sm:text-base text-zinc-100 font-medium leading-relaxed">
                {transcript || (
                  <span className="text-zinc-500 italic">
                    {isListening
                      ? "Listening to your instruction..."
                      : language === "hi"
                      ? "Boliye (उदा. 'Profile icon click karke Dashboard kholo' ya 'Templates dikhao')"
                      : "Say anything (e.g. 'Go to Dashboard', 'Click profile icon then open Dashboard', 'Make section full width')"}
                  </span>
                )}
                {interimTranscript && (
                  <span className="text-cyan-400 italic opacity-80"> {interimTranscript}</span>
                )}
              </p>
            </div>

            {/* Assistant Feedback Status */}
            <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 truncate flex-1 min-w-0">
                {state === "success" ? (
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                ) : state === "error" ? (
                  <AlertCircle className="h-4 w-4 text-rose-400 shrink-0" />
                ) : isAgentActive ? (
                  <Activity className="h-4 w-4 text-cyan-400 shrink-0 animate-pulse" />
                ) : (
                  <Compass className="h-4 w-4 text-indigo-400 shrink-0" />
                )}
                <span
                  className={`truncate ${
                    state === "success"
                      ? "text-emerald-300 font-medium"
                      : state === "error"
                      ? "text-rose-300"
                      : isAgentActive
                      ? "text-cyan-300 font-medium"
                      : "text-zinc-400"
                  }`}
                >
                  {statusMessage}
                </span>
              </div>

              {agentLogs.length > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab("trace")}
                  className="text-[10px] text-cyan-400 hover:underline shrink-0 ml-2"
                >
                  {agentLogs.length} step(s)
                </button>
              )}
            </div>
          </div>

          {/* Quick Free-Form Instructions Carousel */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-medium text-zinc-400">Natural Instructions</span>
              <span className="text-[10px] text-zinc-500">Tap to run</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                {
                  label: "Go to Dashboard",
                  sub: "Navigate to projects console",
                },
                {
                  label: "Click profile icon, then click Dashboard",
                  sub: "Multi-step UI interaction",
                },
                {
                  label: "Open Templates",
                  sub: "Explore pre-designed themes",
                },
                {
                  label: "Open Widgets tab",
                  sub: "Browse builder components",
                },
                {
                  label: "Make this section full width",
                  sub: "Expand section layout to 100%",
                },
                {
                  label: "Change background color to white",
                  sub: "Update active section styling",
                },
              ].map((sugg, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSuggestionClick(sugg.label)}
                  className="flex flex-col text-left p-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-cyan-500/40 transition-all duration-200 group"
                >
                  <span className="text-[11px] font-semibold text-zinc-200 group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {sugg.label}
                  </span>
                  <span className="text-[9px] text-zinc-500 line-clamp-1 mt-0.5">
                    {sugg.sub}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : activeTab === "trace" ? (
        /* Agent Step Trace Log View */
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-2">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
              <Activity className="h-3.5 w-3.5" />
              Agent Step Execution Trace ({agentLogs.length})
            </span>
            <button
              type="button"
              onClick={() => setActiveTab("assistant")}
              className="text-[11px] text-zinc-400 hover:text-white transition-colors"
            >
              Back
            </button>
          </div>

          {agentLogs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <Bot className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">No active execution trace</p>
              <p className="text-xs mt-1">Speak or type a command to see live agent steps.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {agentLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-start gap-2.5 text-xs"
                >
                  <div className="mt-0.5 shrink-0">
                    {log.type === "observe" ? (
                      <Eye className="h-3.5 w-3.5 text-blue-400" />
                    ) : log.type === "plan" ? (
                      <Compass className="h-3.5 w-3.5 text-purple-400" />
                    ) : log.type === "action" ? (
                      <ArrowRight className="h-3.5 w-3.5 text-indigo-400" />
                    ) : log.type === "verify" ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-zinc-200">{log.title}</p>
                    {log.details && (
                      <p className="text-[10px] text-zinc-400 mt-0.5">{log.details}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* History View */
        <div className="flex-1 flex flex-col p-4 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">
              Command History ({history.length})
            </span>
            {history.length > 0 && (
              <button
                type="button"
                onClick={clearHistory}
                className="text-[11px] text-rose-400 hover:text-rose-300 transition-colors"
              >
                Clear all
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-6 text-zinc-500">
              <History className="h-8 w-8 mb-2 opacity-40" />
              <p className="text-sm">No command history</p>
              <p className="text-xs mt-1">Commands you run will appear here.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-white/[0.03] border border-white/10 flex items-start justify-between gap-3"
                >
                  <div className="space-y-0.5 flex-1 min-w-0">
                    <p className="text-xs font-medium text-zinc-200 truncate">
                      "{item.transcript}"
                    </p>
                    <p className="text-[11px] text-zinc-400 line-clamp-1">{item.message}</p>
                    <span className="text-[9px] text-zinc-600">
                      {new Date(item.timestamp).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </span>
                  </div>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full border shrink-0 font-medium ${
                      item.success
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                        : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                    }`}
                  >
                    {item.success ? "Success" : "Failed"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Bottom Input Bar */}
      <div className="p-3 border-t border-white/10 bg-black/40">
        <form onSubmit={handleTextSubmit} className="flex items-center gap-2">
          {/* Microphone Action Button */}
          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            className={`relative p-2.5 rounded-xl flex items-center justify-center transition-all ${
              isListening
                ? "bg-rose-600 hover:bg-rose-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.6)]"
                : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]"
            }`}
            title={isListening ? "Stop listening" : "Start voice listening (Alt+V)"}
            aria-label={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? (
              <span className="relative flex items-center justify-center">
                <span className="absolute h-5 w-5 animate-ping rounded-full bg-white/40" />
                <MicOff className="h-4 w-4" />
              </span>
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>

          {/* Text Input */}
          <div className="relative flex-1">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                language === "hi"
                  ? "Instruction likhein (उदा. 'Go to Dashboard', 'Open templates')..."
                  : "Instruct agent (e.g. 'Click profile then open Dashboard')..."
              }
              className="w-full h-10 px-3.5 pr-9 text-xs rounded-xl bg-white/[0.06] border border-white/10 text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-indigo-500/80 transition-colors"
            />
            {inputText.trim() && (
              <button
                type="submit"
                className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-indigo-300 transition-colors"
                title="Send instruction to agent"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </form>

        <div className="flex items-center justify-between mt-2 px-1 text-[10px] text-zinc-500">
          <span>Shortcuts: Alt + V (Voice) • Enter (Run) • Esc (Close)</span>
          <span>{isSpeechSupported ? "Speech Active" : "Text Mode"}</span>
        </div>
      </div>
    </div>
  );
};
