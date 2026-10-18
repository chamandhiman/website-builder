/**
 * Free-Form AI Agent Planner
 * Interprets natural language instructions (English, Hindi, Hinglish),
 * decomposes multi-step instructions, resolves contextual references,
 * and compiles actionable execution plans for the UIInteractionEngine.
 */

import type {
  AgentPlan,
  AgentStep,
  EditorContextState,
  InteractiveElement,
  GenericAgentActionType,
} from "./voiceTypes";
import { uiEngine } from "./uiInteractionEngine";

function clean(str: string): string {
  return str.toLowerCase().replace(/[.,/#!$%^&*;:{}=\-_`~()?]/g, " ").replace(/\s+/g, " ").trim();
}

/**
 * Extracts color hex from natural language (including Hindi/Hinglish).
 */
export function extractColor(input: string): string | null {
  const t = clean(input);
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
    indigo: "#6366f1",
    gray: "#6b7280",
    grey: "#6b7280",
    transparent: "transparent",
    orange: "#f97316",
    pink: "#ec4899",
    cyan: "#06b6d4",
  };

  for (const [name, hex] of Object.entries(colorMap)) {
    if (new RegExp(`\\b${name}\\b`, "i").test(t)) {
      return hex;
    }
  }

  const hexMatch = input.match(/#([0-9a-f]{3}|[0-9a-f]{6})\b/i);
  return hexMatch ? hexMatch[0] : null;
}

export class AgentPlanner {
  public lastTargetElement: InteractiveElement | null = null;
  public lastActionType: string | null = null;
  public lastScrollDirection: "down" | "up" = "down";

  public setLastTarget(element: InteractiveElement | null, actionType?: string) {
    this.lastTargetElement = element;
    if (actionType) this.lastActionType = actionType;
  }

  /**
   * Plans a multi-step or single-step execution based on natural language and visible UI.
   */
  public plan(
    userInstruction: string,
    context: EditorContextState,
    visibleElements: InteractiveElement[]
  ): AgentPlan {
    const raw = userInstruction.trim();
    const t = clean(raw);
    const planId = `plan-${Date.now()}`;

    // -------------------------------------------------------------------------
    // 1. COMPOUND / MULTI-STEP DETECTION
    // Handles phrases connected with "and then", "then", "aur phir", commas, etc.
    // -------------------------------------------------------------------------
    const stepSeparators = /\b(?:and then|then|and next|aur phir|aur|ke baad|after that)\b|,/i;
    if (stepSeparators.test(raw)) {
      const parts = raw.split(stepSeparators).map((p) => p.trim()).filter((p) => p.length > 2);
      if (parts.length > 1) {
        const aggregatedSteps: AgentStep[] = [];
        for (let i = 0; i < parts.length; i++) {
          const subPlan = this.planSingleStep(parts[i], context, visibleElements, i + 1);
          aggregatedSteps.push(...subPlan.steps);
        }

        return {
          id: planId,
          userGoal: raw,
          thought: "Sure.",
          steps: aggregatedSteps,
          isMultiStep: true,
        };
      }
    }

    // Single step or built-in macro plan
    return this.planSingleStep(raw, context, visibleElements, 1);
  }

  private planSingleStep(
    instruction: string,
    context: EditorContextState,
    visibleElements: InteractiveElement[],
    stepIndex: number
  ): AgentPlan {
    const planId = `plan-step-${stepIndex}-${Date.now()}`;
    const t = clean(instruction);

    // -------------------------------------------------------------------------
    // 0A. CONTINUOUS SCROLLING & FOLLOW-UP COMMANDS ("scroll down", "more", "a little more")
    // Silent execution as requested: silence is preferred while scrolling
    // -------------------------------------------------------------------------
    const isScrollFollowUp =
      /^(a little more|scroll a little more|more|further|a bit more|aur|aur niche|aur scroll karo|keep scrolling|thoda aur)$/i.test(t);
    const isScrollDown =
      /\b(scroll down|niche jao|niche scroll|scroll downward|down a little|scroll niche)\b/i.test(t) ||
      (isScrollFollowUp && this.lastScrollDirection === "down");
    const isScrollUp =
      /\b(scroll up|upar jao|upar scroll|scroll upward|up a little|scroll upar)\b/i.test(t) ||
      (isScrollFollowUp && this.lastScrollDirection === "up");

    if (isScrollDown || isScrollUp) {
      const direction: "down" | "up" = isScrollUp ? "up" : "down";
      this.lastActionType = "SCROLL";
      this.lastScrollDirection = direction;
      const isShort = isScrollFollowUp || /\b(a little|little|bit|thoda)\b/i.test(t);
      const amount = isShort ? 320 : 520;

      return {
        id: planId,
        userGoal: instruction,
        thought: "", // Silent execution for scrolling
        isMultiStep: false,
        steps: [
          {
            id: `step-scroll`,
            action: "SCROLL_WINDOW",
            description: `Scroll ${direction} by ${amount}px`,
            parameters: { direction, amount },
            resultMessage: "",
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // 0B. NAVIGATION BACK ("go back", "back", "wapas jao")
    // -------------------------------------------------------------------------
    if (/^(go back|back|wapas jao|previous page|go back to previous page)$/i.test(t)) {
      this.lastActionType = "BACK";
      return {
        id: planId,
        userGoal: instruction,
        thought: "Going back.",
        isMultiStep: false,
        steps: [
          {
            id: `step-back`,
            action: "NAVIGATE_BACK",
            description: "Go back to previous page",
            resultMessage: "Going back.",
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // 0C. SELECT THIS TEMPLATE / USE TEMPLATE
    // "select this template", "choose template", "use template", "click use template"
    // -------------------------------------------------------------------------
    if (
      /\b(select this template|choose this template|use template|click use template|select template|select that|choose that)\b/i.test(t)
    ) {
      this.lastActionType = "SELECT_TEMPLATE";
      const templateBtn =
        uiEngine.findElement("Use Template", visibleElements) ||
        uiEngine.findElement("Select", visibleElements) ||
        uiEngine.findElement("Preview", visibleElements) ||
        uiEngine.findElement("template", visibleElements);

      return {
        id: planId,
        userGoal: instruction,
        thought: "I've selected the template.",
        isMultiStep: false,
        steps: [
          templateBtn
            ? {
                id: `step-select-tpl`,
                action: "CLICK_ELEMENT",
                description: `Click ${templateBtn.accessibleName || "template"}`,
                targetElement: templateBtn,
                resultMessage: "I've selected the template.",
                status: "pending",
              }
            : {
                id: `step-select-tpl-fallback`,
                action: "ASK_CLARIFICATION",
                description: "Find template",
                resultMessage: "I couldn't locate a template to select on this page.",
                status: "failed",
              },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // 0D. PREVIEW IT ("preview it", "preview this", "preview", "now preview it")
    // -------------------------------------------------------------------------
    if (/^(preview it|preview this|open preview|preview|now preview it|preview dikhao)$/i.test(t)) {
      this.lastActionType = "PREVIEW";
      const previewBtn = uiEngine.findElement("preview", visibleElements);
      return {
        id: planId,
        userGoal: instruction,
        thought: "Opening the preview.",
        isMultiStep: false,
        steps: [
          previewBtn
            ? {
                id: `step-click-prev`,
                action: "CLICK_ELEMENT",
                description: `Click ${previewBtn.accessibleName || "Preview"}`,
                targetElement: previewBtn,
                resultMessage: "Opening the preview.",
                status: "pending",
              }
            : {
                id: `step-builder-prev`,
                action: "BUILDER_PREVIEW",
                description: "Open live website preview",
                resultMessage: "Opening the preview.",
                status: "pending",
              },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // 0E. PUBLISH IT (Safety Confirmation Flow)
    // -------------------------------------------------------------------------
    if (/\b(publish it|publish website|publish this website|publish|publish karo)\b/i.test(t)) {
      this.lastActionType = "PUBLISH";
      return {
        id: planId,
        userGoal: instruction,
        thought: "Ready to publish. Please confirm.",
        isMultiStep: false,
        steps: [
          {
            id: `step-publish`,
            action: "BUILDER_PUBLISH",
            description: "Publish website to production",
            requiresConfirmation: true,
            confirmationMessage: "Ready to publish this website. Are you sure you want to proceed?",
            resultMessage: "Website published successfully.",
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // A. "CLICK THE PROFILE ICON AND (THEN) OPEN DASHBOARD"
    // -------------------------------------------------------------------------
    if (
      (/\bprofile\b/i.test(t) || /\buser\b/i.test(t) || /\bavatar\b/i.test(t)) &&
      /\bdashboard\b/i.test(t) &&
      (/\bclick\b/i.test(t) || /\bopen\b/i.test(t))
    ) {
      return {
        id: planId,
        userGoal: instruction,
        thought: "Opening your profile menu, then selecting Dashboard.",
        isMultiStep: true,
        steps: [
          {
            id: `step-1`,
            action: "CLICK_ELEMENT",
            description: "Click user profile icon to open account menu",
            targetQuery: "profile",
            status: "pending",
          },
          {
            id: `step-2`,
            action: "WAIT_FOR_UI_UPDATE",
            description: "Wait for profile dropdown menu to expand",
            parameters: { ms: 250 },
            status: "pending",
          },
          {
            id: `step-3`,
            action: "CLICK_ELEMENT",
            description: "Select Dashboard option from menu",
            targetQuery: "Dashboard",
            expectedOutcome: "dashboard",
            resultMessage: "Sure, here's your Dashboard.",
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // B. GLOBAL NAVIGATION: DASHBOARD / HOME / MAIN SCREEN
    // -------------------------------------------------------------------------
    if (
      /\b(go to dashboard|open dashboard|take me to dashboard|dashboard kholo|back to dashboard|main screen|home screen|return to dashboard)\b/i.test(
        t
      ) ||
      (t === "dashboard" || t === "go to the dashboard" || t === "dashboard par jao")
    ) {
      const dashboardElement = uiEngine.findElement("dashboard", visibleElements);

      return {
        id: planId,
        userGoal: instruction,
        thought: "Sure, here's your Dashboard.",
        isMultiStep: false,
        steps: [
          dashboardElement
            ? {
                id: `step-dash-click`,
                action: "CLICK_ELEMENT",
                description: "Click Dashboard button in navigation",
                targetElement: dashboardElement,
                targetQuery: "Dashboard",
                expectedOutcome: "dashboard",
                resultMessage: "Sure, here's your Dashboard.",
                status: "pending",
              }
            : {
                id: `step-dash-nav`,
                action: "NAVIGATE_TO_ROUTE",
                description: "Navigate to Dashboard route (/dashboard)",
                parameters: { route: "/dashboard" },
                expectedOutcome: "dashboard",
                resultMessage: "Sure, here's your Dashboard.",
                status: "pending",
              },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // C. NATURAL-LANGUAGE SEARCH & FILTERING FOR TEMPLATES & THEMES
    // -------------------------------------------------------------------------
    const isTemplateSearchOrFilter =
      /\b(theme|themes|template|templates)\b/i.test(t) ||
      /\b(freelance|portfolio|business|single page|multi page|free templates|premium templates)\b/i.test(t) ||
      (context.currentRoute.includes("template") && /\b(filter|search|show|find)\b/i.test(t));

    if (isTemplateSearchOrFilter) {
      // 1. Check if user wants to see all / reset
      const isShowAll = /\b(show all|show me all|all templates|all themes|reset filter|all results|matching results)\b/i.test(t);

      // 2. Extract type filter ("Free templates", "Single page", "Multi page", "Premium templates")
      let typeFilter: string | undefined = undefined;
      if (/\b(free|free templates|free themes)\b/i.test(t)) {
        typeFilter = "Free templates";
      } else if (/\b(premium|paid|pro)\b/i.test(t)) {
        typeFilter = "Premium templates";
      } else if (/\b(single page|one page|single-page)\b/i.test(t)) {
        typeFilter = "Single page";
      } else if (/\b(multi page|multiple pages|multi-page)\b/i.test(t)) {
        typeFilter = "Multi page";
      }

      // 3. Extract category
      let category: string | undefined = undefined;
      const categoryMap: Record<string, string> = {
        freelance: "Freelancer",
        freelancer: "Freelancer",
        portfolio: "Portfolio",
        business: "Business",
        driving: "Driving School",
        agency: "Agency",
        healthcare: "Healthcare",
        clinic: "Healthcare",
        medical: "Healthcare",
        fitness: "Fitness & Gym",
        gym: "Fitness & Gym",
        ecommerce: "E-commerce",
        shop: "E-commerce",
        store: "E-commerce",
        saas: "SaaS",
        restaurant: "Restaurant",
        food: "Restaurant",
        blog: "Blog",
        photography: "Photography",
      };

      for (const [key, catVal] of Object.entries(categoryMap)) {
        if (new RegExp(`\\b${key}\\b`, "i").test(t)) {
          category = catVal;
          break;
        }
      }

      // 4. Extract free-form search query terms (excluding control words)
      let query: string | undefined = undefined;
      if (!category && !typeFilter && !isShowAll) {
        const cleanedQuery = t
          .replace(/\b(show me|show|find|search for|search|all|matching|the|templates|template|themes|theme|website|websites|results)\b/gi, "")
          .trim();
        if (cleanedQuery.length > 1) {
          query = cleanedQuery;
        }
      } else if (category && /\bmodern\b/i.test(t)) {
        query = "modern";
      }

      // If user is just saying "open templates" or "go to templates" without any search or filter
      const isPlainOpen =
        /^(open templates|go to templates|templates|templates page|explore templates|show templates)$/i.test(t);

      if (!isPlainOpen || typeFilter || category || query || isShowAll) {
        return {
          id: planId,
          userGoal: instruction,
          thought: "Searching and filtering templates.",
          isMultiStep: false,
          steps: [
            {
              id: `step-tpl-search-filter`,
              action: "SMART_SEARCH_AND_FILTER",
              description: `Search & filter templates: ${category || ""} ${typeFilter || ""} ${query || ""}`.trim(),
              parameters: {
                domain: "templates",
                query,
                category,
                typeFilter,
                showAll: isShowAll,
              },
              resultMessage: "Here are the matching templates.",
              status: "pending",
            },
          ],
        };
      } else {
        const templateEl = uiEngine.findElement("templates", visibleElements);
        return {
          id: planId,
          userGoal: instruction,
          thought: "Opening Templates now.",
          isMultiStep: false,
          steps: [
            templateEl
              ? {
                  id: `step-tpl-click`,
                  action: "CLICK_ELEMENT",
                  description: "Click Templates menu item",
                  targetElement: templateEl,
                  targetQuery: "Templates",
                  expectedOutcome: "templates",
                  resultMessage: "Opening Templates now.",
                  status: "pending",
                }
              : {
                  id: `step-tpl-nav`,
                  action: "NAVIGATE_TO_ROUTE",
                  description: "Navigate to Templates page (/dashboard/templates or /templates)",
                  parameters: {
                    route: context.currentRoute.includes("dashboard") ? "/dashboard/templates" : "/templates",
                  },
                  expectedOutcome: "templates",
                  resultMessage: "Opening Templates now.",
                  status: "pending",
                },
          ],
        };
      }
    }

    // -------------------------------------------------------------------------
    // D. GLOBAL NAVIGATION: ACCOUNT / PROFILE SETTINGS
    // -------------------------------------------------------------------------
    if (/\b(account settings|profile settings|settings|user settings|profile kholo)\b/i.test(t)) {
      return {
        id: planId,
        userGoal: instruction,
        thought: "Opening your account settings.",
        isMultiStep: true,
        steps: [
          {
            id: `step-settings-1`,
            action: "CLICK_ELEMENT",
            description: "Click profile menu button",
            targetQuery: "profile",
            status: "pending",
          },
          {
            id: `step-settings-2`,
            action: "WAIT_FOR_UI_UPDATE",
            description: "Wait for dropdown",
            parameters: { ms: 200 },
            status: "pending",
          },
          {
            id: `step-settings-3`,
            action: "CLICK_ELEMENT",
            description: "Select Profile Settings",
            targetQuery: "Settings",
            resultMessage: "Opened account settings.",
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // E. SMART WIDGET DISCOVERY, SEARCH & OPENING
    // -------------------------------------------------------------------------
    const isWidgetRequest =
      /\b(widget|widgets|toolbar|chat widget|reviews widget|countdown widget|faq widget|announcement widget)\b/i.test(t) ||
      /\b(accessibility|whatsapp|countdown|google reviews|faq accordion)\b/i.test(t);

    if (isWidgetRequest) {
      // Check if it's a search command: e.g. "search for whatsapp widgets"
      const isSearchWidget = /\b(search|search for|dhoondo)\b/i.test(t);

      // Extract target widget name
      let widgetTarget = "";
      if (/\b(accessibility|a11y|toolbar)\b/i.test(t)) {
        widgetTarget = "Accessibility";
      } else if (/\b(whatsapp|whats app|chat)\b/i.test(t)) {
        widgetTarget = "WhatsApp";
      } else if (/\b(google reviews|reviews|review)\b/i.test(t)) {
        widgetTarget = "Google Reviews";
      } else if (/\b(countdown|timer)\b/i.test(t)) {
        widgetTarget = "Countdown";
      } else if (/\b(faq|accordion)\b/i.test(t)) {
        widgetTarget = "FAQ Accordion";
      } else if (/\b(announcement|popup)\b/i.test(t)) {
        widgetTarget = "Announcement";
      } else {
        // Generic extract: e.g. "open the [X] widget"
        const match = t.match(/(?:open|find|search for|locate)\s+(?:the\s+)?(.+?)\s*(?:widget|toolbar)?$/i);
        if (match && match[1]) {
          widgetTarget = match[1].trim();
        }
      }

      if (isSearchWidget && widgetTarget) {
        return {
          id: planId,
          userGoal: instruction,
          thought: `Searching for ${widgetTarget} widgets.`,
          isMultiStep: false,
          steps: [
            {
              id: `step-search-widgets`,
              action: "SMART_SEARCH_AND_FILTER",
              description: `Search widgets for "${widgetTarget}"`,
              parameters: { domain: "widgets", query: widgetTarget },
              resultMessage: `Here are the matching ${widgetTarget} widgets.`,
              status: "pending",
            },
          ],
        };
      }

      if (widgetTarget) {
        return {
          id: planId,
          userGoal: instruction,
          thought: `Locating and opening the ${widgetTarget} widget.`,
          isMultiStep: false,
          steps: [
            {
              id: `step-discover-open-widget`,
              action: "DISCOVER_AND_OPEN_WIDGET",
              description: `Locate and open "${widgetTarget}" widget`,
              parameters: { widgetQuery: widgetTarget },
              resultMessage: `Opened ${widgetTarget} widget.`,
              status: "pending",
            },
          ],
        };
      }

      // Plain widgets navigation
      const widgetEl = uiEngine.findElement("widgets", visibleElements);
      return {
        id: planId,
        userGoal: instruction,
        thought: "Opening Widgets now.",
        isMultiStep: false,
        steps: [
          widgetEl
            ? {
                id: `step-wgt-click`,
                action: "CLICK_ELEMENT",
                description: "Click Widgets tab",
                targetElement: widgetEl,
                resultMessage: "Opening Widgets now.",
                status: "pending",
              }
            : {
                id: `step-wgt-nav`,
                action: "NAVIGATE_TO_ROUTE",
                description: "Navigate to Widgets catalog (/dashboard/widgets)",
                parameters: { route: "/dashboard/widgets" },
                resultMessage: "Opening Widgets now.",
                status: "pending",
              },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // F. RETURN TO EDITOR
    // -------------------------------------------------------------------------
    if (/\b(return to the editor|return to editor|back to editor|go to editor|open editor)\b/i.test(t)) {
      const latestProj = context.allProjects[0] || (context.currentProjectId ? { id: context.currentProjectId } : null);
      const editorRoute = latestProj ? `/editor/${latestProj.id}` : "/editor";
      return {
        id: planId,
        userGoal: instruction,
        thought: "Done.",
        isMultiStep: false,
        steps: [
          {
            id: `step-back-editor`,
            action: "NAVIGATE_TO_ROUTE",
            description: "Return to editor",
            parameters: { route: editorRoute },
            resultMessage: "Done.",
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // F2. OPEN SETTINGS
    // -------------------------------------------------------------------------
    if (/\b(open settings|settings|project settings|general settings|settings kholo)\b/i.test(t)) {
      const settingsEl = uiEngine.findElement("settings", visibleElements);
      return {
        id: planId,
        userGoal: instruction,
        thought: "Done.",
        isMultiStep: false,
        steps: [
          settingsEl
            ? {
                id: `step-settings-click`,
                action: "CLICK_ELEMENT",
                description: "Open settings",
                targetElement: settingsEl,
                resultMessage: "Done.",
                status: "pending",
              }
            : {
                id: `step-settings-nav`,
                action: "NAVIGATE_TO_ROUTE",
                description: "Navigate to settings",
                parameters: { route: "/dashboard" },
                resultMessage: "Done.",
                status: "pending",
              },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // F3. PROJECT ACTIONS WHEN NO PROJECT IS ACTIVE
    // E.g. "make section full width" while on dashboard
    // -------------------------------------------------------------------------
    const isEditorSectionAction =
      /\b(make this section full width|section background|delete section)\b/i.test(t);

    if (isEditorSectionAction && !context.currentProjectId && !context.currentRoute.includes("editor")) {
      const latestProject = context.allProjects[0];
      if (latestProject) {
        return {
          id: planId,
          userGoal: instruction,
          thought: "Done.",
          isMultiStep: true,
          steps: [
            {
              id: `step-open-project`,
              action: "NAVIGATE_TO_ROUTE",
              description: `Open latest project "${latestProject.name}" in editor`,
              parameters: { route: `/editor/${latestProject.id}` },
              status: "pending",
            },
            {
              id: `step-wait-editor`,
              action: "WAIT_FOR_UI_UPDATE",
              description: "Wait for editor to load",
              parameters: { ms: 600 },
              status: "pending",
            },
          ],
        };
      }

      return {
        id: planId,
        userGoal: instruction,
        thought: "Please open a website project first.",
        isMultiStep: false,
        steps: [
          {
            id: `step-no-proj`,
            action: "ASK_CLARIFICATION",
            description: "Prompt user to select or create a project first",
            resultMessage: "Please open a website project first.",
            status: "failed",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // G. EDITOR: DEVICE PREVIEWS (Mobile, Tablet, Desktop)
    // -------------------------------------------------------------------------
    if (/\b(mobile|mobile view|phone preview|phone view|mobile preview)\b/i.test(t)) {
      return {
        id: planId,
        userGoal: instruction,
        thought: "Switched to mobile.",
        isMultiStep: false,
        steps: [
          {
            id: `step-dev-mob`,
            action: "SWITCH_DEVICE",
            description: "Switch viewport to mobile",
            parameters: { device: "mobile" },
            resultMessage: "Switched to mobile.",
            status: "pending",
          },
        ],
      };
    }

    if (/\b(tablet|tablet view|ipad view)\b/i.test(t)) {
      return {
        id: planId,
        userGoal: instruction,
        thought: "Switched to tablet.",
        isMultiStep: false,
        steps: [
          {
            id: `step-dev-tab`,
            action: "SWITCH_DEVICE",
            description: "Switch viewport to tablet",
            parameters: { device: "tablet" },
            resultMessage: "Switched to tablet.",
            status: "pending",
          },
        ],
      };
    }

    if (/\b(desktop|desktop view|desktop preview|laptop view)\b/i.test(t)) {
      return {
        id: planId,
        userGoal: instruction,
        thought: "Switched to desktop.",
        isMultiStep: false,
        steps: [
          {
            id: `step-dev-desk`,
            action: "SWITCH_DEVICE",
            description: "Switch viewport to desktop",
            parameters: { device: "desktop" },
            resultMessage: "Switched to desktop.",
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // H. EDITOR: SECTION FULL WIDTH
    // -------------------------------------------------------------------------
    if (/\b(full width|stretch width|make this section full width|poori width)\b/i.test(t)) {
      return {
        id: planId,
        userGoal: instruction,
        thought: "Done.",
        isMultiStep: false,
        steps: [
          {
            id: `step-full-width`,
            action: "BUILDER_SET_LAYOUT",
            description: "Set section layout width to 100%",
            parameters: { layout: "fullWidth", sectionId: context.selectedSectionId },
            resultMessage: "Done.",
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // I. EDITOR: BACKGROUND COLOR
    // -------------------------------------------------------------------------
    const color = extractColor(instruction);
    if (color && /\b(background|bg|color|colour|rang)\b/i.test(t)) {
      return {
        id: planId,
        userGoal: instruction,
        thought: `Updating section background color to ${color}.`,
        isMultiStep: false,
        steps: [
          {
            id: `step-bg-color`,
            action: "BUILDER_SET_BACKGROUND",
            description: `Change section background to ${color}`,
            parameters: { color, sectionId: context.selectedSectionId },
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // J. EDITOR: UNDO & REDO
    // -------------------------------------------------------------------------
    if (/\b(undo|piche jao|peeche jao|revert)\b/i.test(t) && !/\bredo\b/i.test(t)) {
      return {
        id: planId,
        userGoal: instruction,
        thought: "Undone.",
        isMultiStep: false,
        steps: [
          {
            id: `step-undo`,
            action: "BUILDER_UNDO",
            description: "Undo last editor change",
            resultMessage: "Undone.",
            status: "pending",
          },
        ],
      };
    }

    if (/\b(redo|aage jao|reapply)\b/i.test(t)) {
      return {
        id: planId,
        userGoal: instruction,
        thought: "Redone.",
        isMultiStep: false,
        steps: [
          {
            id: `step-redo`,
            action: "BUILDER_REDO",
            description: "Redo action",
            resultMessage: "Redone.",
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // K. EDITOR: SAVE
    // -------------------------------------------------------------------------
    if (/\b(save|save website|save project|save changes|save karo)\b/i.test(t)) {
      return {
        id: planId,
        userGoal: instruction,
        thought: "Saved your changes.",
        isMultiStep: false,
        steps: [
          {
            id: `step-save`,
            action: "BUILDER_SAVE",
            description: "Save website state",
            resultMessage: "Saved your changes.",
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // L. EDITOR: PREVIEW
    // -------------------------------------------------------------------------
    if (/\b(preview|view site|preview website|preview kholo|preview dikhao)\b/i.test(t)) {
      return {
        id: planId,
        userGoal: instruction,
        thought: "Opening interactive full-screen preview.",
        isMultiStep: false,
        steps: [
          {
            id: `step-prev`,
            action: "BUILDER_PREVIEW",
            description: "Open live website preview",
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // M. EDITOR: DELETE SECTION (Destructive -> Requires Confirmation)
    // -------------------------------------------------------------------------
    if (/\b(delete section|remove section|is section ko delete karo|hatao)\b/i.test(t)) {
      return {
        id: planId,
        userGoal: instruction,
        thought: "Deleting the selected section.",
        isMultiStep: false,
        steps: [
          {
            id: `step-del-sec`,
            action: "BUILDER_DELETE_SECTION",
            description: "Delete section",
            requiresConfirmation: true,
            confirmationMessage: "Are you sure you want to delete this section? This action will remove its content.",
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // N. GENERIC DOM INTERACTION FALLBACK
    // If user says "Click [something]" or "Tap [something]"
    // -------------------------------------------------------------------------
    const clickMatch = instruction.match(/(?:click|tap|press|select|dabaao)\s+(?:on\s+)?(?:the\s+)?(.+)/i);
    if (clickMatch && clickMatch[1]) {
      const targetQuery = clickMatch[1].trim();
      const targetEl = uiEngine.findElement(targetQuery, visibleElements);

      return {
        id: planId,
        userGoal: instruction,
        thought: `Finding and clicking "${targetQuery}".`,
        isMultiStep: false,
        steps: [
          {
            id: `step-click-generic`,
            action: "CLICK_ELEMENT",
            description: `Click ${targetQuery}`,
            targetElement: targetEl || undefined,
            targetQuery,
            status: "pending",
          },
        ],
      };
    }

    // -------------------------------------------------------------------------
    // O. ADDING WIDGET OR SECTION (Hero, Testimonials, Pricing, FAQ, Contact, etc.)
    // -------------------------------------------------------------------------
    if (/\b(add|insert|create|banao|lagao)\b/i.test(t)) {
      const categories = [
        "hero", "navbar", "testimonials", "pricing", "faq", "contact",
        "services", "about", "gallery", "carousel", "team", "footer"
      ];
      for (const cat of categories) {
        if (t.includes(cat)) {
          return {
            id: planId,
            userGoal: instruction,
            thought: `Adding new ${cat.toUpperCase()} section to your page.`,
            isMultiStep: false,
            steps: [
              {
                id: `step-add-sec`,
                action: "BUILDER_ADD_SECTION",
                description: `Add ${cat} section`,
                parameters: { widgetType: cat },
                status: "pending",
              },
            ],
          };
        }
      }
    }

    // -------------------------------------------------------------------------
    // P. DEFAULT FALLBACK: Free-Form Semantic Search on Visible Elements
    // -------------------------------------------------------------------------
    const fuzzyMatch = uiEngine.findElement(instruction, visibleElements);
    if (fuzzyMatch) {
      return {
        id: planId,
        userGoal: instruction,
        thought: `Located matching UI control "${fuzzyMatch.accessibleName}". Clicking it.`,
        isMultiStep: false,
        steps: [
          {
            id: `step-fuzzy-click`,
            action: "CLICK_ELEMENT",
            description: `Click ${fuzzyMatch.accessibleName}`,
            targetElement: fuzzyMatch,
            status: "pending",
          },
        ],
      };
    }

    // Truly unknown
    return {
      id: planId,
      userGoal: instruction,
      thought: `I could not locate an action matching "${instruction}". You can ask me to navigate pages, click buttons, or edit website sections.`,
      isMultiStep: false,
      steps: [
        {
          id: `step-unrec`,
          action: "ASK_CLARIFICATION",
          description: "Unrecognized command",
          resultMessage: `I heard "${instruction}", but could not find a matching element or action. Try "Go to Dashboard" or "Open Templates".`,
          status: "failed",
        },
      ],
    };
  }
}

export const agentPlanner = new AgentPlanner();
