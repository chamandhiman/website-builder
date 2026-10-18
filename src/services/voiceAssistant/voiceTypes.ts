import type { WidgetInstance } from "@/components/builder/widgets/widgetRegistry";
import type { PageSection, Page } from "@/lib/builder/store";

export type AssistantState =
  | "idle"
  | "listening"
  | "observing"
  | "planning"
  | "executing"
  | "speaking"
  | "resuming"
  | "verifying"
  | "confirming"
  | "paused"
  | "success"
  | "error";

export type AssistantLanguage = "en" | "hi";

export interface InteractiveElement {
  id: string;
  tagName: string;
  role?: string;
  accessibleName: string;
  visibleText: string;
  type?: string;
  placeholder?: string;
  title?: string;
  href?: string;
  ariaLabel?: string;
  ariaExpanded?: boolean;
  disabled?: boolean;
  checked?: boolean;
  rect: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  selector: string;
  domElement?: HTMLElement;
}

export type SessionMode = "standby" | "active";

export type GenericAgentActionType =
  | "INSPECT_INTERFACE"
  | "FIND_ELEMENT"
  | "CLICK_ELEMENT"
  | "TYPE_TEXT"
  | "SELECT_OPTION"
  | "TOGGLE_CONTROL"
  | "SCROLL_TO_ELEMENT"
  | "SCROLL_WINDOW"
  | "NAVIGATE_TO_ROUTE"
  | "NAVIGATE_BACK"
  | "SWITCH_DEVICE"
  | "BUILDER_ADD_SECTION"
  | "BUILDER_SELECT_SECTION"
  | "BUILDER_DELETE_SECTION"
  | "BUILDER_MOVE_SECTION"
  | "BUILDER_SET_LAYOUT"
  | "BUILDER_SET_BACKGROUND"
  | "BUILDER_EDIT_CONTENT"
  | "BUILDER_UNDO"
  | "BUILDER_REDO"
  | "BUILDER_SAVE"
  | "BUILDER_PREVIEW"
  | "BUILDER_PUBLISH"
  | "WAIT_FOR_UI_UPDATE"
  | "ASK_CLARIFICATION"
  | "SMART_SEARCH_AND_FILTER"
  | "DISCOVER_AND_OPEN_WIDGET"
  | "CUSTOM";

export interface AgentStep {
  id: string;
  action: GenericAgentActionType;
  description: string;
  targetQuery?: string;
  targetElement?: InteractiveElement;
  parameters?: Record<string, any>;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  expectedOutcome?: string;
  status: "pending" | "running" | "completed" | "failed" | "skipped";
  resultMessage?: string;
}

export interface AgentPlan {
  id: string;
  userGoal: string;
  thought: string;
  steps: AgentStep[];
  isMultiStep: boolean;
}

export interface AgentExecutionLog {
  id: string;
  timestamp: number;
  stepNumber?: number;
  totalSteps?: number;
  type: "observe" | "plan" | "action" | "verify" | "system" | "error";
  title: string;
  details?: string;
  success?: boolean;
}

export interface CommandHistoryItem {
  id: string;
  timestamp: number;
  transcript: string;
  commandType: string;
  success: boolean;
  message: string;
  stepsCount?: number;
}

export interface AssistantConfirmation {
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  onConfirm: () => Promise<void> | void;
  onCancel: () => void;
}

export type CommandActionType =
  | "UNDO"
  | "REDO"
  | "SAVE_PROJECT"
  | "OPEN_PREVIEW"
  | "SWITCH_DEVICE"
  | "OPEN_TAB"
  | "CLOSE_PANEL"
  | "ADD_SECTION"
  | "DELETE_SECTION"
  | "SELECT_SECTION"
  | "MOVE_SECTION"
  | "NAVIGATE_PAGE"
  | "UPDATE_SECTION_STYLE"
  | "UNKNOWN"
  | string;

export interface ParsedCommand {
  type: CommandActionType;
  rawTranscript: string;
  confidence: number;
  parameters: Record<string, any>;
  explanation?: string;
  requiresConfirmation?: boolean;
  confirmationMessage?: string;
  targetReference?: string;
}

export interface EditorContextState {
  currentRoute: string;
  currentProjectId: string | null;
  projectName: string;
  currentPageId: string | null;
  currentPageName: string;
  pageCount: number;
  pages: { id: string; name: string; slug: string }[];
  selectedSectionId: string | null;
  selectedSectionName?: string;
  sectionCount: number;
  selectedElementKind?: string;
  device: "desktop" | "tablet" | "mobile";
  hasUnsavedChanges: boolean;
  canUndo: boolean;
  canRedo: boolean;
  activePanel: "widgets" | "properties" | "pages" | "layers" | null;
  allProjects: { id: string; name: string; updatedAt: number }[];
  userEmail?: string;
  userName?: string;
}

export interface SuggestedCommand {
  category: "navigation" | "widget" | "section" | "project";
  english: string;
  hinglish: string;
  description: string;
}
