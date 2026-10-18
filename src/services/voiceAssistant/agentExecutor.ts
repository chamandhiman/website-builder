/**
 * Free-Form Agent Executor
 * Implements the autonomous Observe-Plan-Act-Verify execution loop.
 * Sequences generic UI interaction tools, verifies outcome states,
 * and maintains safety guardrails.
 */

import { uiEngine } from "./uiInteractionEngine";
import { agentPlanner } from "./agentPlanner";
import { useBuilder } from "@/lib/builder/store";
import { SECTION_LIBRARY } from "@/lib/builder/sections";
import type {
  AgentPlan,
  AgentStep,
  AgentExecutionLog,
  EditorContextState,
  AssistantConfirmation,
} from "./voiceTypes";

export class AgentExecutor {
  private isCancelled = false;

  public cancel() {
    this.isCancelled = true;
  }

  /**
   * Executes the full Observe-Plan-Act-Verify loop for a natural language request.
   */
  public async execute(
    userInstruction: string,
    callbacks: {
      onLog: (log: AgentExecutionLog) => void;
      onStateChange: (state: any) => void;
      onConfirmationRequired: (confirmation: AssistantConfirmation) => void;
    }
  ): Promise<{ success: boolean; message: string; logs: AgentExecutionLog[] }> {
    this.isCancelled = false;
    const logs: AgentExecutionLog[] = [];

    const emitLog = (logItem: Omit<AgentExecutionLog, "id" | "timestamp">) => {
      const fullLog: AgentExecutionLog = {
        ...logItem,
        id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        timestamp: Date.now(),
      };
      logs.push(fullLog);
      callbacks.onLog(fullLog);
    };

    // -------------------------------------------------------------------------
    // 1. OBSERVE
    // -------------------------------------------------------------------------
    callbacks.onStateChange("observing");
    emitLog({
      type: "observe",
      title: "Observing current screen and application state...",
    });

    const context = uiEngine.inspectCurrentState();
    const visibleElements = uiEngine.inspectInterface();

    emitLog({
      type: "observe",
      title: `Located ${visibleElements.length} visible interactive elements on ${context.currentRoute}`,
    });

    // -------------------------------------------------------------------------
    // 2. PLAN
    // -------------------------------------------------------------------------
    callbacks.onStateChange("planning");
    const plan = agentPlanner.plan(userInstruction, context, visibleElements);

    emitLog({
      type: "plan",
      title: plan.thought,
      details: plan.isMultiStep ? `Plan contains ${plan.steps.length} sequential steps` : undefined,
    });

    // -------------------------------------------------------------------------
    // 3. ACT & VERIFY LOOP
    // -------------------------------------------------------------------------
    callbacks.onStateChange("executing");
    const totalSteps = plan.steps.length;

    for (let i = 0; i < totalSteps; i++) {
      if (this.isCancelled) {
        emitLog({
          type: "system",
          title: "Execution cancelled by user.",
          success: false,
        });
        return { success: false, message: "Action cancelled.", logs };
      }

      const step = plan.steps[i];
      step.status = "running";

      emitLog({
        type: "action",
        stepNumber: i + 1,
        totalSteps,
        title: step.description,
      });

      // Safety Guardrail: Check for confirmation before destructive execution
      if (step.requiresConfirmation) {
        callbacks.onStateChange("confirming");
        return new Promise((resolve) => {
          callbacks.onConfirmationRequired({
            title: "Confirm Critical Action",
            description: step.confirmationMessage || "Are you sure you want to proceed with this action?",
            confirmLabel: "Proceed",
            cancelLabel: "Cancel",
            onConfirm: async () => {
              callbacks.onStateChange("executing");
              const res = await this.executeStepAction(step, context);
              if (res.success) {
                step.status = "completed";
                emitLog({
                  type: "verify",
                  stepNumber: i + 1,
                  totalSteps,
                  title: `Completed: ${res.message}`,
                  success: true,
                });
                resolve({ success: true, message: res.message, logs });
              } else {
                step.status = "failed";
                emitLog({
                  type: "error",
                  stepNumber: i + 1,
                  totalSteps,
                  title: `Failed: ${res.message}`,
                  success: false,
                });
                resolve({ success: false, message: res.message, logs });
              }
            },
            onCancel: () => {
              emitLog({
                type: "system",
                title: "Action was cancelled.",
                success: false,
              });
              resolve({ success: false, message: "Action was cancelled.", logs });
            },
          });
        });
      }

      // Execute action
      const actionResult = await this.executeStepAction(step, context);

      if (!actionResult.success) {
        step.status = "failed";
        emitLog({
          type: "error",
          stepNumber: i + 1,
          totalSteps,
          title: `Step ${i + 1} failed: ${actionResult.message}`,
          success: false,
        });

        return {
          success: false,
          message: actionResult.message,
          logs,
        };
      }

      step.status = "completed";

      // -------------------------------------------------------------------------
      // 4. VERIFY STEP
      // -------------------------------------------------------------------------
      callbacks.onStateChange("verifying");
      if (step.expectedOutcome) {
        const verifyRes = await uiEngine.verifyActionResult(step.expectedOutcome, context);
        emitLog({
          type: "verify",
          stepNumber: i + 1,
          totalSteps,
          title: verifyRes.message,
          success: verifyRes.verified,
        });
      }

      // Brief settling pause between multiple steps
      if (i < totalSteps - 1) {
        await uiEngine.waitForUiUpdate(250);
      }
    }

    callbacks.onStateChange("success");
    const completionMessage =
      totalSteps > 1
        ? `Successfully completed all ${totalSteps} steps for "${userInstruction}".`
        : plan.steps[0]?.resultMessage || `Done! "${userInstruction}"`;

    emitLog({
      type: "verify",
      title: completionMessage,
      success: true,
    });

    return {
      success: true,
      message: completionMessage,
      logs,
    };
  }

  private async executeStepAction(
    step: AgentStep,
    context: EditorContextState
  ): Promise<{ success: boolean; message: string }> {
    const store = useBuilder.getState();

    try {
      switch (step.action) {
        case "CLICK_ELEMENT": {
          if (step.targetElement) {
            return await uiEngine.clickElement(step.targetElement);
          }
          if (step.targetQuery) {
            return await uiEngine.clickElement(step.targetQuery);
          }
          return { success: false, message: "Target element not specified." };
        }

        case "TYPE_TEXT": {
          const text = step.parameters?.text || "";
          return await uiEngine.typeText(step.targetElement || step.targetQuery || "input", text);
        }

        case "SELECT_OPTION": {
          const val = step.parameters?.value || "";
          return await uiEngine.selectOption(step.targetElement || step.targetQuery || "select", val);
        }

        case "SCROLL_TO_ELEMENT": {
          return await uiEngine.scrollToElement(step.targetElement || step.targetQuery || "body");
        }

        case "SCROLL_WINDOW": {
          const direction = step.parameters?.direction || "down";
          const amount = step.parameters?.amount || 420;
          const deltaY = direction === "up" ? -amount : amount;

          // 1. Scroll window and document
          window.scrollBy({ top: deltaY, left: 0, behavior: "smooth" });
          if (document.documentElement) {
            document.documentElement.scrollBy({ top: deltaY, left: 0, behavior: "smooth" });
          }
          if (document.body) {
            document.body.scrollBy({ top: deltaY, left: 0, behavior: "smooth" });
          }

          // 2. Also scroll any inner scrollable containers (e.g. templates catalog, main, canvas)
          const scrollables = Array.from(
            document.querySelectorAll<HTMLElement>(
              'main, #builder-canvas, [data-scrollable="true"], .overflow-y-auto, .overflow-y-scroll, [role="main"]'
            )
          );
          for (const el of scrollables) {
            if (el.scrollHeight > el.clientHeight) {
              el.scrollBy({ top: deltaY, left: 0, behavior: "smooth" });
            }
          }

          return {
            success: true,
            message: step.resultMessage ?? "",
          };
        }

        case "NAVIGATE_BACK": {
          window.history.back();
          return { success: true, message: "Going back." };
        }

        case "NAVIGATE_TO_ROUTE": {
          const route = step.parameters?.route;
          if (!route) return { success: false, message: "Route parameter missing." };
          return await uiEngine.navigateToRoute(route);
        }

        case "WAIT_FOR_UI_UPDATE": {
          await uiEngine.waitForUiUpdate(step.parameters?.ms || 250);
          return { success: true, message: "Wait completed." };
        }

        case "SWITCH_DEVICE": {
          const dev = step.parameters?.device || "desktop";
          store.setDevice(dev);
          return { success: true, message: `Switched preview mode to ${dev.toUpperCase()}.` };
        }

        case "BUILDER_SET_LAYOUT": {
          const curPage = store.currentPage();
          const sections = curPage?.sections || [];
          const sectionId =
            step.parameters?.sectionId || store.selectedSectionId || (sections[0] ? sections[0].id : null);

          if (!sectionId) {
            return { success: false, message: "No section selected to expand width." };
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
          return { success: true, message: "Section has been expanded to full width." };
        }

        case "BUILDER_SET_BACKGROUND": {
          const color = step.parameters?.color;
          const curPage = store.currentPage();
          const sections = curPage?.sections || [];
          const sectionId =
            step.parameters?.sectionId || store.selectedSectionId || (sections[0] ? sections[0].id : null);

          if (!sectionId) {
            return { success: false, message: "Please select a section on the canvas first." };
          }

          const section = sections.find((s) => s.id === sectionId);
          const currentStyle = section?.style || {};
          store.updateSection(sectionId, {
            style: {
              ...currentStyle,
              backgroundColor: color,
            },
          });
          return { success: true, message: `Updated background color to ${color}.` };
        }

        case "BUILDER_ADD_SECTION": {
          const widgetType = (step.parameters?.widgetType || "hero").toLowerCase();
          const match = SECTION_LIBRARY.find(
            (t) => t.category.toLowerCase().includes(widgetType) || t.name.toLowerCase().includes(widgetType)
          ) || SECTION_LIBRARY[0];

          const newId = store.addSection(match);
          store.selectSection(newId);
          return { success: true, message: `Added "${match.name}" section to page.` };
        }

        case "BUILDER_DELETE_SECTION": {
          const curPage = store.currentPage();
          const sections = curPage?.sections || [];
          const sectionId =
            step.parameters?.sectionId || store.selectedSectionId || (sections[0] ? sections[0].id : null);

          if (!sectionId) {
            return { success: false, message: "No section found to delete." };
          }
          store.removeSection(sectionId);
          return { success: true, message: "Section deleted." };
        }

        case "BUILDER_UNDO": {
          if (store.historyIndex <= 0) {
            return { success: false, message: "Nothing to undo in history." };
          }
          store.undo();
          return { success: true, message: "Undid the last action." };
        }

        case "BUILDER_REDO": {
          if (store.historyIndex >= store.history.length - 1) {
            return { success: false, message: "Nothing to redo in history." };
          }
          store.redo();
          return { success: true, message: "Redid the previous action." };
        }

        case "BUILDER_SAVE": {
          store.persistWithStatus();
          void store.saveProjectToCloud();
          return { success: true, message: "Website changes saved successfully." };
        }

        case "BUILDER_PREVIEW": {
          const currentProject =
            (store.currentProjectId ? store.projects[store.currentProjectId] : null) ||
            Object.values(store.projects)[0];

          if (!currentProject) {
            return { success: false, message: "No project found to preview." };
          }
          const currentPage = store.currentPage() || currentProject.pages[0];
          store.persist();

          const slugName = (currentProject.name || "project")
            .trim()
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-") || "project";
          const previewSlug = `${slugName}-${currentProject.id}`;
          const previewUrl = `${window.location.origin}/demo/${encodeURIComponent(previewSlug)}?page=${encodeURIComponent(
            currentPage.slug
          )}`;

          window.open(previewUrl, "_blank");
          return { success: true, message: "Opening preview." };
        }

        case "BUILDER_PUBLISH": {
          const visibleElements = uiEngine.inspectInterface();
          const publishBtn = uiEngine.findElement("publish", visibleElements);
          if (publishBtn) {
            return await uiEngine.clickElement(publishBtn);
          }
          const currentProjId = store.currentProjectId || Object.keys(store.projects)[0];
          if (currentProjId) {
            store.publishProject(currentProjId);
            store.persistWithStatus();
            return { success: true, message: "Website published successfully." };
          }
          return { success: false, message: "No active website project found to publish." };
        }

        case "DISCOVER_AND_OPEN_WIDGET": {
          const widgetQuery = step.parameters?.widgetQuery || step.targetQuery || "";
          return await uiEngine.smartDiscoverAndOpenWidget(widgetQuery);
        }

        case "SMART_SEARCH_AND_FILTER": {
          const domain = step.parameters?.domain || "templates";
          if (domain === "widgets") {
            return await uiEngine.smartSearchWidgets(step.parameters?.query || "");
          }
          return await uiEngine.smartSearchAndFilterTemplates(step.parameters || {});
        }

        case "ASK_CLARIFICATION": {
          return {
            success: false,
            message: step.resultMessage || "Please clarify your request.",
          };
        }

        default:
          return { success: false, message: `Unsupported action type: ${step.action}` };
      }
    } catch (err: any) {
      return { success: false, message: err?.message || "Execution error" };
    }
  }
}

export const agentExecutor = new AgentExecutor();
