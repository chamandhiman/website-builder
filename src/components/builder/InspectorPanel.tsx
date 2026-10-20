"use client";

import { useState, useEffect, useMemo } from "react";
import { useBuilder, pageOf } from "@/lib/builder/store";
import { findSectionInProject } from "@/lib/builder/sharedChrome";
import { getWidgetChildItems, buildNormalizedChildData, setWidgetChildItems, findGridColumnIdForChild } from "@/components/builder/widgets/childWidgetUtils";
import { createWidgetInstance, getWidgetPropertiesComponent } from "@/components/builder/widgets/widgetRegistry";
import { SelectedElementInspector } from "./SelectedElementInspector";
import { PropertiesPanel } from "./PropertiesPanel";
import { MousePointerClick, X } from "lucide-react";

export function InspectorPanel() {
  const project = useBuilder((s) => (s.currentProjectId ? s.projects[s.currentProjectId] : null));
  const selectedId = useBuilder((s) => s.selectedSectionId);
  const selectedElement = useBuilder((s) => s.selectedElement);
  const selectElement = useBuilder((s) => s.selectElement);

  const section = selectedId ? findSectionInProject(project, selectedId, pageOf(project)) : null;

  if (!section) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-[#171717] p-6 text-center">
        <div className="mb-3 rounded-full bg-[#202020] p-3 text-[#A1A1AA] border border-[#2B2B2B]">
          <MousePointerClick className="h-5 w-5" />
        </div>
        <h4 className="text-xs font-semibold text-[#F4F4F5] mb-1">No Element Selected</h4>
        <p className="text-[11px] text-[#71717A] max-w-[210px] leading-relaxed">
          Click any element, heading, button, or image on the canvas to inspect and edit its properties.
        </p>
      </div>
    );
  }

  // When an individual element is selected, show its properties only (never for custom HTML placeholder, embedded widgets, or generic section div wrappers)
  const isEmbedOrMediaWidget = Boolean(
    (section?.widgetInstance &&
      ["youtube", "vimeo", "map", "store_locator", "google-reviews", "custom-html"].includes(section.widgetInstance.type)) ||
    (selectedElement?.widgetType &&
      ["youtube", "vimeo", "map", "store_locator", "google-reviews", "custom-html"].includes(selectedElement.widgetType)) ||
    ["section-youtube", "section-vimeo", "section-map", "section-google-reviews", "section-store-locator", "section-custom-html", "youtube-v1", "vimeo-v1", "map-v1", "google-reviews-v1", "store_locator-v1", "custom-html-v1"].includes(section?.templateId || "") ||
    /wto-(youtube|vimeo|map|store-locator|custom-html|google-reviews)/i.test(section?.html || "")
  );

  const isCustomHtmlOrPlaceholder = Boolean(
    selectedElement?.widgetType === "custom-html" ||
    selectedElement?.textContent?.includes("Add your widget here") ||
    selectedElement?.elementKey?.includes("custom_html") ||
    selectedElement?.elementType === "custom-html"
  );

  const isGenericDivWithoutChild = Boolean(
    selectedElement && (selectedElement.kind === "container" || selectedElement.tag === "div") && !selectedElement.childId
  );

  if (selectedElement && selectedElement.kind !== "section" && !isCustomHtmlOrPlaceholder && !isEmbedOrMediaWidget && !isGenericDivWithoutChild) {
    return (
      <SelectedElementInspector
        selectedElement={selectedElement}
        sectionName={section.name}
        onClose={() => selectElement(null)}
      />
    );
  }

  // Otherwise show section properties
  return (
    <div className="h-full overflow-hidden bg-[#171717]">
      <PropertiesPanel />
    </div>
  );
}
