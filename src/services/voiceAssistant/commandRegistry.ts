import { useBuilder, type PageSection, type Page } from "@/lib/builder/store";
import { SECTION_LIBRARY } from "@/lib/builder/sections";
import { getAllWidgetRegistrations } from "@/components/builder/widgets/widgetRegistry";
import type {
  CommandActionType,
  ParsedCommand,
  EditorContextState,
  SuggestedCommand,
} from "./voiceTypes";

export const SUGGESTED_COMMANDS: SuggestedCommand[] = [
  {
    category: "navigation",
    english: "Switch to mobile preview",
    hinglish: "Mobile view kholo",
    description: "Preview how your site looks on mobile devices",
  },
  {
    category: "navigation",
    english: "Open Widgets tab",
    hinglish: "Widgets panel kholo",
    description: "Browse and add pre-designed components",
  },
  {
    category: "section",
    english: "Add a testimonial section",
    hinglish: "Testimonial section lagao",
    description: "Insert customer quotes and reviews block",
  },
  {
    category: "section",
    english: "Add hero section",
    hinglish: "Hero section add karo",
    description: "Insert a high-converting banner headline",
  },
  {
    category: "section",
    english: "Make this section full width",
    hinglish: "Is section ko full width karo",
    description: "Expand section boundaries to 100% viewport",
  },
  {
    category: "section",
    english: "Change background color to white",
    hinglish: "Background color white karo",
    description: "Update the background styling of the active section",
  },
  {
    category: "section",
    english: "Move this section up",
    hinglish: "Is section ko upar karo",
    description: "Reorder section upwards on the page",
  },
  {
    category: "widget",
    english: "Add pricing table",
    hinglish: "Pricing widget lagao",
    description: "Add a tier-based pricing comparison table",
  },
  {
    category: "widget",
    english: "Duplicate this widget",
    hinglish: "Is widget ko duplicate karo",
    description: "Clone the selected element or section",
  },
  {
    category: "project",
    english: "Save my website",
    hinglish: "Website save karo",
    description: "Persist all edits locally and to the cloud",
  },
  {
    category: "project",
    english: "Preview the website",
    hinglish: "Preview dikhao",
    description: "Open full-screen interactive preview in a new tab",
  },
  {
    category: "project",
    english: "Undo the last change",
    hinglish: "Undo karo",
    description: "Revert the most recent action in history",
  },
];

/**
 * Normalizes user text by lowercasing, stripping excessive punctuation and trim.
 */
function cleanText(text: string): string {
  return text
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

/**
 * Maps color names to CSS colors including Hindi / Hinglish color names.
 */
function parseColor(input: string): string | null {
  const t = cleanText(input);
  const colorMap: Record<string, string> = {
    white: "#ffffff",
    safed: "#ffffff",
    black: "#111827",
    kala: "#111827",
    red: "#ef4444",
    lal: "#ef4444",
    blue: "#3b82f6",
    neela: "#3b82f6",
    green: "#10b981",
    hara: "#10b981",
    yellow: "#f59e0b",
    peela: "#f59e0b",
    purple: "#8b5cf6",
    baingani: "#8b5cf6",
    indigo: "#6366f1",
    gray: "#6b7280",
    grey: "#6b7280",
    "dark gray": "#1f2937",
    "light gray": "#f3f4f6",
    transparent: "transparent",
    orange: "#f97316",
    pink: "#ec4899",
    rose: "#f43f5e",
    cyan: "#06b6d4",
    amber: "#f59e0b",
    emerald: "#10b981",
    teal: "#14b8a6",
    slate: "#334155",
    zinc: "#27272a",
    neutral: "#262626",
    stone: "#292524",
  };

  // Direct match in map
  for (const [name, hex] of Object.entries(colorMap)) {
    if (new RegExp(`\\b${name}\\b`, "i").test(t)) {
      return hex;
    }
  }

  // Hex color match
  const hexMatch = input.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
  if (hexMatch) {
    return hexMatch[0];
  }

  return null;
}

/**
 * Extract active editor context snapshot from the Zustand store.
 */
export function getEditorContext(): EditorContextState {
  const state = useBuilder.getState();
  const currentProject = state.currentProjectId ? state.projects[state.currentProjectId] : null;
  const currentPage = currentProject ? state.currentPage() : null;
  const sections = currentPage?.sections || [];
  const selectedSection = sections.find((s) => s.id === state.selectedSectionId);

  return {
    currentRoute: typeof window !== "undefined" ? window.location.pathname : "/",
    currentProjectId: state.currentProjectId,
    projectName: currentProject?.name || "Untitled Project",
    currentPageId: currentPage?.id || null,
    currentPageName: currentPage?.name || "Home",
    pageCount: currentProject?.pages?.length || 0,
    pages: (currentProject?.pages || []).map((p) => ({ id: p.id, name: p.name, slug: p.slug })),
    selectedSectionId: state.selectedSectionId,
    selectedSectionName: selectedSection?.name,
    sectionCount: sections.length,
    selectedElementKind: state.selectedElement?.kind,
    device: state.device,
    hasUnsavedChanges: state.saveStatus === "idle" || state.saveStatus === "saving",
    canUndo: state.historyIndex > 0,
    canRedo: state.historyIndex < state.history.length - 1,
    activePanel: (state.leftPanelOpen as any) || "widgets",
    allProjects: Object.values(state.projects || {}).map((p) => ({
      id: p.id,
      name: p.name,
      updatedAt: p.updatedAt || Date.now(),
    })),
  };
}

/**
 * Natural language intent parser for English and Hindi/Hinglish.
 */
export function parseVoiceCommand(rawTranscript: string, context: EditorContextState): ParsedCommand {
  const t = cleanText(rawTranscript);

  // 1. PROJECT LEVEL: UNDO / REDO
  if (
    /\b(undo|undo karo|undo that|piche jao|peeche jao|revert)\b/i.test(t) &&
    !/\brendo\b/i.test(t)
  ) {
    return {
      type: "UNDO",
      rawTranscript,
      confidence: 0.98,
      parameters: {},
      explanation: "Revert the last editor action.",
    };
  }

  if (/\b(redo|redo karo|aage jao|redo that)\b/i.test(t)) {
    return {
      type: "REDO",
      rawTranscript,
      confidence: 0.98,
      parameters: {},
      explanation: "Reapply the previously undone action.",
    };
  }

  // 2. PROJECT LEVEL: SAVE
  if (/\b(save|save karo|save project|save website|save my site|save changes|save kar do)\b/i.test(t)) {
    return {
      type: "SAVE_PROJECT",
      rawTranscript,
      confidence: 0.95,
      parameters: {},
      explanation: "Save the current website state.",
    };
  }

  // 3. PROJECT LEVEL: PREVIEW
  if (
    /\b(preview|preview website|preview site|preview kholo|open preview|preview dikhao|show preview)\b/i.test(t)
  ) {
    return {
      type: "OPEN_PREVIEW",
      rawTranscript,
      confidence: 0.95,
      parameters: {},
      explanation: "Open full interactive site preview.",
    };
  }

  // 4. PROJECT LEVEL: PUBLISH (Destructive / Public Action -> Requires Confirmation)
  if (/\b(publish|publish site|publish website|website publish karo|site publish karo)\b/i.test(t)) {
    return {
      type: "PUBLISH_PROJECT",
      rawTranscript,
      confidence: 0.92,
      parameters: {},
      requiresConfirmation: true,
      confirmationMessage:
        "Publishing will make your website live to the public web. Would you like to proceed with publishing?",
      explanation: "Publish the project to live hosting.",
    };
  }

  // 5. NAVIGATION: DEVICE PREVIEW MODES
  if (/\b(mobile|mobile view|mobile preview|phone view|mobile mode|phone mode|mobile kholo)\b/i.test(t)) {
    return {
      type: "SWITCH_DEVICE",
      rawTranscript,
      confidence: 0.96,
      parameters: { device: "mobile" },
      explanation: "Switch canvas viewport to Mobile view (390px).",
    };
  }

  if (/\b(tablet|tablet view|tablet preview|ipad view|tablet mode|tablet kholo)\b/i.test(t)) {
    return {
      type: "SWITCH_DEVICE",
      rawTranscript,
      confidence: 0.96,
      parameters: { device: "tablet" },
      explanation: "Switch canvas viewport to Tablet view (768px).",
    };
  }

  if (
    /\b(desktop|desktop view|desktop preview|desktop mode|full screen view|laptop view|computer view)\b/i.test(
      t
    )
  ) {
    return {
      type: "SWITCH_DEVICE",
      rawTranscript,
      confidence: 0.96,
      parameters: { device: "desktop" },
      explanation: "Switch canvas viewport to Desktop view (100%).",
    };
  }

  // 6. NAVIGATION: PANELS & TABS
  if (/\b(open dashboard|go to dashboard|dashboard kholo|dashboard par jao)\b/i.test(t)) {
    return {
      type: "OPEN_DASHBOARD",
      rawTranscript,
      confidence: 0.95,
      parameters: {},
      explanation: "Navigate to the project dashboard.",
    };
  }

  if (/\b(open widgets|widgets tab|show widgets|widgets panel|widgets kholo|widget list)\b/i.test(t)) {
    return {
      type: "NAVIGATE_TAB",
      rawTranscript,
      confidence: 0.94,
      parameters: { tab: "widgets" },
      explanation: "Open the Widgets component sidebar.",
    };
  }

  if (
    /\b(open properties|show properties|settings tab|widget settings|properties panel|properties kholo|settings kholo)\b/i.test(
      t
    )
  ) {
    return {
      type: "NAVIGATE_TAB",
      rawTranscript,
      confidence: 0.94,
      parameters: { tab: "properties" },
      explanation: "Open the active item Properties inspector.",
    };
  }

  if (/\b(open pages|show pages|pages tab|pages panel|pages kholo)\b/i.test(t)) {
    return {
      type: "NAVIGATE_TAB",
      rawTranscript,
      confidence: 0.94,
      parameters: { tab: "pages" },
      explanation: "Open the Pages drawer.",
    };
  }

  // 7. THEME: DARK MODE
  if (/\b(dark mode|toggle dark|dark theme|light mode|theme badlo|toggle theme)\b/i.test(t)) {
    return {
      type: "TOGGLE_DARK_MODE",
      rawTranscript,
      confidence: 0.9,
      parameters: {},
      explanation: "Toggle editor theme between Dark and Light mode.",
    };
  }

  // 8. SECTION & WIDGET MANIPULATION: DELETE (Requires Confirmation)
  if (
    /\b(delete this section|remove this section|delete section|is section ko delete karo|section hatao|delete widget|remove widget|is widget ko hatao)\b/i.test(
      t
    )
  ) {
    const targetName = context.selectedSectionName || "the currently selected section";
    return {
      type: "DELETE_SECTION",
      rawTranscript,
      confidence: 0.94,
      parameters: { sectionId: context.selectedSectionId },
      targetReference: "this",
      requiresConfirmation: true,
      confirmationMessage: `Are you sure you want to delete ${targetName}?`,
      explanation: `Delete section "${targetName}".`,
    };
  }

  // 9. SECTION & WIDGET MANIPULATION: DUPLICATE
  if (
    /\b(duplicate this section|duplicate section|duplicate this widget|duplicate widget|is section ko duplicate karo|copy section)\b/i.test(
      t
    )
  ) {
    return {
      type: "DUPLICATE_SECTION",
      rawTranscript,
      confidence: 0.94,
      parameters: { sectionId: context.selectedSectionId },
      targetReference: "this",
      explanation: "Duplicate the currently selected section.",
    };
  }

  // 10. SECTION & WIDGET MANIPULATION: MOVE UP / DOWN
  if (/\b(move up|move this section up|upar karo|upar le jao|move section up|shift up)\b/i.test(t)) {
    return {
      type: "MOVE_SECTION",
      rawTranscript,
      confidence: 0.93,
      parameters: { direction: "up", sectionId: context.selectedSectionId },
      targetReference: "this",
      explanation: "Move current section one position higher.",
    };
  }

  if (/\b(move down|move this section down|neeche karo|niche le jao|move section down|shift down)\b/i.test(t)) {
    return {
      type: "MOVE_SECTION",
      rawTranscript,
      confidence: 0.93,
      parameters: { direction: "down", sectionId: context.selectedSectionId },
      targetReference: "this",
      explanation: "Move current section one position lower.",
    };
  }

  // 11. SECTION STYLING: FULL WIDTH
  if (
    /\b(full width|make this section full width|full width karo|make it full width|stretch section|poori width)\b/i.test(
      t
    )
  ) {
    return {
      type: "SET_SECTION_LAYOUT",
      rawTranscript,
      confidence: 0.92,
      parameters: { layout: "fullWidth", sectionId: context.selectedSectionId },
      targetReference: "this",
      explanation: "Set section container layout to 100% full width.",
    };
  }

  // 12. SECTION STYLING: BACKGROUND COLOR
  if (
    /\b(background|background color|bg color|colour|rang)\b/i.test(t) &&
    /\b(change|set|make|badlo|karo|update)\b/i.test(t)
  ) {
    const detectedColor = parseColor(rawTranscript);
    if (detectedColor) {
      return {
        type: "SET_SECTION_BACKGROUND",
        rawTranscript,
        confidence: 0.92,
        parameters: { color: detectedColor, sectionId: context.selectedSectionId },
        targetReference: "this",
        explanation: `Change section background to ${detectedColor}.`,
      };
    }
  }

  // Also catch simple commands like "background white karo" or "background color to blue"
  const quickBgColor = parseColor(rawTranscript);
  if (quickBgColor && /\bbackground\b/i.test(t)) {
    return {
      type: "SET_SECTION_BACKGROUND",
      rawTranscript,
      confidence: 0.9,
      parameters: { color: quickBgColor, sectionId: context.selectedSectionId },
      targetReference: "this",
      explanation: `Set section background to ${quickBgColor}.`,
    };
  }

  // 13. CONTENT EDITING: HEADING
  const headingMatch = rawTranscript.match(/(?:change heading to|edit heading to|heading badlo|set heading to)\s+(.+)/i);
  if (headingMatch && headingMatch[1]) {
    return {
      type: "EDIT_HEADING",
      rawTranscript,
      confidence: 0.91,
      parameters: { text: headingMatch[1].trim() },
      targetReference: "this",
      explanation: `Update heading text to "${headingMatch[1].trim()}".`,
    };
  }

  // 14. CONTENT EDITING: BUTTON LABEL
  const buttonMatch = rawTranscript.match(
    /(?:change button text to|change button label to|button text|button badlo|set button to)\s+(.+)/i
  );
  if (buttonMatch && buttonMatch[1]) {
    return {
      type: "EDIT_BUTTON_LABEL",
      rawTranscript,
      confidence: 0.91,
      parameters: { text: buttonMatch[1].trim() },
      targetReference: "this",
      explanation: `Update button label to "${buttonMatch[1].trim()}".`,
    };
  }

  // 15. SECTION / WIDGET CREATION: ADD WIDGET OR SECTION BY NAME
  if (/\b(add|insert|create|banao|lagao|add karo|insert karo)\b/i.test(t)) {
    // Check known categories / types
    const candidates = [
      { key: "hero", names: ["hero", "banner", "main banner", "hero section"] },
      { key: "navbar", names: ["navbar", "navigation", "header", "menu", "nav bar"] },
      { key: "testimonials", names: ["testimonial", "testimonials", "reviews", "customer review"] },
      { key: "pricing", names: ["pricing", "pricing table", "plans", "price"] },
      { key: "faq", names: ["faq", "frequently asked questions", "questions", "sawal"] },
      { key: "contact", names: ["contact", "contact us", "contact form", "form"] },
      { key: "footer", names: ["footer", "bottom footer"] },
      { key: "services", names: ["services", "service", "our services"] },
      { key: "about", names: ["about", "about us", "story", "hamare baare mein"] },
      { key: "gallery", names: ["gallery", "image gallery", "photos"] },
      { key: "carousel", names: ["carousel", "slider", "image slider"] },
      { key: "team", names: ["team", "our team", "members"] },
      { key: "cta", names: ["cta", "call to action", "banner cta"] },
      { key: "button", names: ["button", "action button"] },
      { key: "heading", names: ["heading", "title"] },
      { key: "text", names: ["text", "paragraph"] },
    ];

    for (const cand of candidates) {
      if (cand.names.some((name) => new RegExp(`\\b${name}\\b`, "i").test(t))) {
        return {
          type: "ADD_SECTION",
          rawTranscript,
          confidence: 0.93,
          parameters: { widgetType: cand.key, category: cand.key },
          explanation: `Add a new ${cand.key.toUpperCase()} block to the page.`,
        };
      }
    }
  }

  // 16. SWITCH PAGE
  const pageMatch = rawTranscript.match(/(?:go to page|switch to page|open page|page kholo)\s+([a-zA-Z0-9\s-_]+)/i);
  if (pageMatch && pageMatch[1]) {
    const requestedName = pageMatch[1].trim().toLowerCase();
    const matchedPage = context.pages.find(
      (p) => p.name.toLowerCase() === requestedName || p.slug.toLowerCase() === requestedName
    );
    if (matchedPage) {
      return {
        type: "SWITCH_PAGE",
        rawTranscript,
        confidence: 0.92,
        parameters: { pageId: matchedPage.id, pageName: matchedPage.name },
        explanation: `Switch active editor view to page "${matchedPage.name}".`,
      };
    }
  }

  // Unknown fallback
  return {
    type: "UNKNOWN",
    rawTranscript,
    confidence: 0.2,
    parameters: {},
    explanation: `I heard "${rawTranscript}", but I'm not sure which editor action that corresponds to. Try "Open mobile preview" or "Save my website".`,
  };
}

/**
 * Execute parsed command safely using existing useBuilder store methods.
 */
export async function executeCommand(
  cmd: ParsedCommand,
  context: EditorContextState
): Promise<{ success: boolean; message: string }> {
  const store = useBuilder.getState();

  try {
    switch (cmd.type) {
      case "UNDO": {
        if (store.historyIndex <= 0) {
          return { success: false, message: "Nothing to undo in editor history." };
        }
        store.undo();
        return { success: true, message: "Undid the last change." };
      }

      case "REDO": {
        if (store.historyIndex >= store.history.length - 1) {
          return { success: false, message: "Nothing to redo in editor history." };
        }
        store.redo();
        return { success: true, message: "Redid the previous change." };
      }

      case "SAVE_PROJECT": {
        const localSuccess = store.persistWithStatus();
        const cloudSuccess = await store.saveProjectToCloud();
        if (localSuccess || cloudSuccess) {
          return { success: true, message: "Your website changes have been successfully saved." };
        }
        return { success: false, message: "Could not save changes at this time." };
      }

      case "OPEN_PREVIEW": {
        const currentProject = store.currentProjectId ? store.projects[store.currentProjectId] : null;
        if (!currentProject) {
          return { success: false, message: "No active project found to preview." };
        }
        const currentPage = store.currentPage() || currentProject.pages[0];
        if (!currentPage) {
          return { success: false, message: "No page available for preview." };
        }
        // Persist first
        store.persist();

        const slugName = (currentProject.name || "project")
          .trim()
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "") || "project";
        const previewSlug = `${slugName}-${currentProject.id}`;
        const previewUrl = `${window.location.origin}/demo/${encodeURIComponent(previewSlug)}?page=${encodeURIComponent(
          currentPage.slug
        )}`;

        const previewWindow = window.open(previewUrl, "_blank");
        if (!previewWindow) {
          return { success: false, message: "Pop-up blocked. Please allow pop-ups to open website preview." };
        }
        return { success: true, message: `Opened live interactive preview for ${currentPage.name}.` };
      }

      case "PUBLISH_PROJECT": {
        if (!store.currentProjectId) {
          return { success: false, message: "No active project found to publish." };
        }
        // Safe publish trigger
        store.persist();
        return {
          success: true,
          message: "Publishing initiated! Please review your custom domain or slug in the publish dialog.",
        };
      }

      case "SWITCH_DEVICE": {
        const targetDevice = cmd.parameters.device as "desktop" | "tablet" | "mobile";
        store.setDevice(targetDevice);
        return {
          success: true,
          message: `Switched preview mode to ${targetDevice.toUpperCase()} view.`,
        };
      }

      case "NAVIGATE_TAB": {
        const tab = cmd.parameters.tab;
        if (tab === "widgets") {
          store.setLeftPanelOpen("widgets");
          store.setLeftPanelView("widgets");
          // Deselect section so RightContextPanel switches to widgets tab
          store.selectSection(null);
          store.selectElement(null);
          return { success: true, message: "Opened the Widgets panel." };
        }
        if (tab === "pages") {
          store.setLeftPanelOpen("pages");
          store.setLeftPanelView("pages");
          return { success: true, message: "Opened the Pages manager." };
        }
        if (tab === "properties") {
          // If no section is selected, pick the first one to inspect
          const curPage = store.currentPage();
          if (!store.selectedSectionId && curPage && curPage.sections.length > 0) {
            store.selectSection(curPage.sections[0].id);
          }
          return { success: true, message: "Opened the Properties inspector." };
        }
        return { success: true, message: `Switched view to ${tab}.` };
      }

      case "OPEN_DASHBOARD": {
        store.setShowProjectDashboard(true);
        return { success: true, message: "Opened the project dashboard." };
      }

      case "TOGGLE_DARK_MODE": {
        store.toggleDark();
        const isDark = !store.dark;
        return { success: true, message: `Switched to ${isDark ? "Dark" : "Light"} mode.` };
      }

      case "SWITCH_PAGE": {
        const pageId = cmd.parameters.pageId;
        store.selectPage(pageId);
        return { success: true, message: `Switched to page "${cmd.parameters.pageName}".` };
      }

      case "ADD_SECTION": {
        const widgetType = (cmd.parameters.widgetType || "hero").toLowerCase();
        // 1. Try finding a matching section template
        const matchingTemplate = SECTION_LIBRARY.find((t) =>
          t.category.toLowerCase().includes(widgetType) || t.name.toLowerCase().includes(widgetType)
        ) || SECTION_LIBRARY.find((t) => t.id.toLowerCase().includes(widgetType));

        if (matchingTemplate) {
          const newSectionId = store.addSection(matchingTemplate);
          store.selectSection(newSectionId);
          return {
            success: true,
            message: `Added new "${matchingTemplate.name}" section to your page.`,
          };
        }

        // 2. Try adding via widget template
        try {
          const newSectionId = store.addTemplateWidget(widgetType);
          store.selectSection(newSectionId);
          return {
            success: true,
            message: `Added new "${widgetType}" widget to your page.`,
          };
        } catch {
          // Fallback to first available section
          const fallback = SECTION_LIBRARY[0];
          store.addSection(fallback);
          return {
            success: true,
            message: `Added new "${fallback.name}" section.`,
          };
        }
      }

      case "DELETE_SECTION": {
        const currentPage = store.currentPage();
        const sections = currentPage?.sections || [];
        const sectionId = cmd.parameters.sectionId || store.selectedSectionId || (sections[0] ? sections[0].id : null);

        if (!sectionId) {
          return { success: false, message: "No section selected to delete." };
        }

        const section = sections.find((s) => s.id === sectionId);
        const name = section?.name || "Section";
        store.removeSection(sectionId);
        store.selectSection(null);
        return { success: true, message: `Successfully deleted "${name}".` };
      }

      case "DUPLICATE_SECTION": {
        const currentPage = store.currentPage();
        const sections = currentPage?.sections || [];
        const sectionId = cmd.parameters.sectionId || store.selectedSectionId || (sections[0] ? sections[0].id : null);

        if (!sectionId) {
          return { success: false, message: "No section selected to duplicate." };
        }

        store.duplicateSection(sectionId);
        return { success: true, message: "Duplicated the section." };
      }

      case "MOVE_SECTION": {
        const currentPage = store.currentPage();
        const sections = currentPage?.sections || [];
        const sectionId = cmd.parameters.sectionId || store.selectedSectionId || (sections[0] ? sections[0].id : null);

        if (!sectionId) {
          return { success: false, message: "Please select a section to move." };
        }

        const currentIndex = sections.findIndex((s) => s.id === sectionId);
        if (currentIndex === -1) {
          return { success: false, message: "Could not locate section in current page." };
        }

        const dir = cmd.parameters.direction;
        const targetIndex = dir === "up" ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= sections.length) {
          return {
            success: false,
            message: `Section is already at the ${dir === "up" ? "top" : "bottom"} of the page.`,
          };
        }

        store.moveSection(currentIndex, targetIndex);
        return { success: true, message: `Moved section ${dir}.` };
      }

      case "SET_SECTION_LAYOUT": {
        const currentPage = store.currentPage();
        const sections = currentPage?.sections || [];
        const sectionId = cmd.parameters.sectionId || store.selectedSectionId || (sections[0] ? sections[0].id : null);

        if (!sectionId) {
          return { success: false, message: "Please select a section to modify layout." };
        }

        const section = sections.find((s) => s.id === sectionId);
        const currentStyle = section?.style || {};
        store.updateSection(sectionId, {
          style: {
            ...currentStyle,
            width: "100%",
            maxWidth: "100%",
            paddingLeft: "0",
            paddingRight: "0",
          },
        });
        return { success: true, message: "Section has been expanded to 100% full width." };
      }

      case "SET_SECTION_BACKGROUND": {
        const color = cmd.parameters.color;
        const currentPage = store.currentPage();
        const sections = currentPage?.sections || [];
        const sectionId = cmd.parameters.sectionId || store.selectedSectionId || (sections[0] ? sections[0].id : null);

        if (!sectionId) {
          return { success: false, message: "Please select a section to change background." };
        }

        const section = sections.find((s) => s.id === sectionId);
        const currentStyle = section?.style || {};
        store.updateSection(sectionId, {
          style: {
            ...currentStyle,
            backgroundColor: color,
          },
        });
        return { success: true, message: `Updated section background color to ${color}.` };
      }

      case "EDIT_HEADING": {
        const text = cmd.parameters.text;
        const selected = store.selectedElement;
        const sectionId = store.selectedSectionId;

        if (selected && selected.widgetId && sectionId) {
          store.updateWidgetElementContent(
            sectionId,
            selected.widgetId,
            selected.childId || null,
            selected.elementKey || null,
            { text }
          );
          return { success: true, message: `Updated heading text to "${text}".` };
        }

        return {
          success: false,
          message: "Please click on or select a heading element on canvas first.",
        };
      }

      case "EDIT_BUTTON_LABEL": {
        const text = cmd.parameters.text;
        const selected = store.selectedElement;
        const sectionId = store.selectedSectionId;

        if (selected && selected.widgetId && sectionId) {
          store.updateWidgetElementContent(
            sectionId,
            selected.widgetId,
            selected.childId || null,
            selected.elementKey || null,
            { label: text, text }
          );
          return { success: true, message: `Updated button label to "${text}".` };
        }

        return {
          success: false,
          message: "Please click on or select a button element on canvas first.",
        };
      }

      default: {
        return {
          success: false,
          message: cmd.explanation || "Command could not be recognized. Try 'Save my website' or 'Open mobile view'.",
        };
      }
    }
  } catch (error: any) {
    return {
      success: false,
      message: `Error executing command: ${error?.message || "Unknown error"}`,
    };
  }
}
