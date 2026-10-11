import React, { useState, useEffect } from "react";
import { useBuilder } from "@/lib/builder/store";
import type { WidgetData } from "../widgetRegistry";
import {
  defaultGoogleReviewsWidgetData,
  isGoogleReviewsWidgetData,
  type GoogleReviewsWidgetData,
} from "./GoogleReviewsTypes";
import {
  getAllWidgets,
  createNewGoogleReviewsWidget,
  saveWidget,
  type WidgetInstanceRecord,
} from "@/services/widgetService";
import {
  Star,
  ExternalLink,
  Code2,
  Edit3,
  CheckCircle2,
  RefreshCw,
  Plus,
  HelpCircle,
} from "lucide-react";
import { toast } from "sonner";

interface GoogleReviewsPropertiesProps {
  value?: WidgetData;
  onChange?: (nextValue: WidgetData) => void;
  widgetId?: string;
  onClose?: () => void;
}

export function GoogleReviewsProperties({ value, onChange, widgetId }: GoogleReviewsPropertiesProps) {
  const currentProject = useBuilder((s) => s.currentProject());
  const updateWidgetInstance = useBuilder((s) => s.updateWidgetInstance);

  const resolvedWidget: GoogleReviewsWidgetData =
    value && isGoogleReviewsWidgetData(value)
      ? value
      : defaultGoogleReviewsWidgetData;

  const currentWgtId = (resolvedWidget.content?.widgetId as string) || "wgt_google_default";
  const [widgetsList, setWidgetsList] = useState<WidgetInstanceRecord[]>([]);
  const [loadingWidgets, setLoadingWidgets] = useState(false);
  const [currentRecord, setCurrentRecord] = useState<WidgetInstanceRecord | null>(null);

  useEffect(() => {
    async function fetchList() {
      setLoadingWidgets(true);
      try {
        const list = await getAllWidgets();
        setWidgetsList(list);
        const matched = list.find((w) => w.id === currentWgtId);
        if (matched) setCurrentRecord(matched);
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingWidgets(false);
      }
    }
    fetchList();
  }, [currentWgtId]);

  const updateWidget = (nextContent: Partial<GoogleReviewsWidgetData["content"]>) => {
    const updated: GoogleReviewsWidgetData = {
      ...resolvedWidget,
      content: {
        ...resolvedWidget.content,
        ...nextContent,
      },
    };
    if (onChange) {
      onChange(updated);
    } else if (widgetId) {
      updateWidgetInstance(widgetId, updated as any);
    }
  };

  const handleSelectWidget = (selectedId: string) => {
    const found = widgetsList.find((w) => w.id === selectedId);
    if (found) {
      setCurrentRecord(found);
      updateWidget({
        widgetId: found.id,
        widgetName: found.name,
        status: found.status,
      });
      toast.success(`Attached widget "${found.name}"`);
    }
  };

  const handleCreateNew = async () => {
    try {
      const newWidget = createNewGoogleReviewsWidget("My New Google Reviews");
      await saveWidget(newWidget);
      setWidgetsList((prev) => [newWidget, ...prev]);
      setCurrentRecord(newWidget);
      updateWidget({
        widgetId: newWidget.id,
        widgetName: newWidget.name,
        status: newWidget.status,
      });
      toast.success("Created new widget instance");
    } catch (err) {
      toast.error("Failed to create new widget");
    }
  };

  const isPublished = currentRecord?.status === "published";

  return (
    <div className="flex flex-col h-full bg-[#18181b] text-zinc-200 text-xs select-none p-4 space-y-5">
      {/* Widget Header Banner */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-white p-1.5 shadow-sm flex items-center justify-center flex-shrink-0">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z" fill="#4285F4"/>
            <path d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z" fill="#34A853"/>
            <path d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z" fill="#FBBC05"/>
            <path d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.93 6.72-4.93z" fill="#EA4335"/>
          </svg>
        </div>
        <div>
          <h4 className="font-bold text-white text-sm">Google Reviews</h4>
          <span className="text-[11px] text-zinc-400">Dynamic Widget Embed</span>
        </div>
      </div>

      {/* Selected Widget Info Card */}
      <div className="p-4 rounded-xl bg-zinc-900 border border-zinc-800 space-y-3">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase tracking-wider font-semibold block">Attached Widget</span>
          <h5 className="font-bold text-white text-sm mt-0.5">
            {currentRecord?.name || resolvedWidget.content?.widgetName || "Google Reviews"}
          </h5>
        </div>

        <div className="flex items-center justify-between text-[11px] pt-2 border-t border-zinc-800/80">
          <span className="text-zinc-400">Status:</span>
          <span
            className={`font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 ${
              isPublished
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isPublished ? "bg-emerald-400" : "bg-amber-400"}`}></span>
            {isPublished ? "Published" : "Draft"}
          </span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">Widget ID:</span>
          <span className="font-mono text-zinc-300 text-[10px]">{currentWgtId}</span>
        </div>

        <div className="flex items-center justify-between text-[11px]">
          <span className="text-zinc-400">Connected Business:</span>
          <span className="text-zinc-200 font-medium truncate max-w-[130px]">
            {currentRecord?.source?.businessName || "Netsmartz Infotech"}
          </span>
        </div>
      </div>

      {/* Primary Action: Edit in Studio */}
      <div className="space-y-2">
        <a
          href={`/dashboard/widgets/google-reviews/${currentWgtId}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2.5 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-black font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit in Widget Studio</span>
          <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
        </a>

        <a
          href={`/dashboard/widgets/${currentWgtId}/install`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full py-2 px-3 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold text-xs flex items-center justify-center gap-2 border border-zinc-700 transition-colors"
        >
          <Code2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Open Install Code</span>
          <ExternalLink className="w-3 h-3 ml-auto opacity-70" />
        </a>
      </div>

      {/* Change Attached Widget */}
      <div className="space-y-2 pt-3 border-t border-zinc-800">
        <label className="text-[11px] font-semibold text-zinc-300 block">Change Widget</label>
        <select
          value={currentWgtId}
          onChange={(e) => handleSelectWidget(e.target.value)}
          className="w-full px-2.5 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-white text-xs focus:outline-none focus:border-amber-400"
        >
          <option value={currentWgtId}>
            Current: {currentRecord?.name || currentWgtId}
          </option>
          {widgetsList
            .filter((w) => w.id !== currentWgtId)
            .map((w) => (
              <option key={w.id} value={w.id}>
                {w.name} ({w.status})
              </option>
            ))}
        </select>

        <button
          type="button"
          onClick={handleCreateNew}
          className="w-full py-1.5 px-2 rounded bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white text-[11px] font-medium border border-zinc-800 flex items-center justify-center gap-1 transition-colors"
        >
          <Plus className="w-3 h-3" />
          <span>Create Another Widget</span>
        </button>
      </div>

      {/* Architecture Explanation Note */}
      <div className="p-3 rounded-lg bg-zinc-900/50 border border-zinc-800/80 text-[11px] text-zinc-400 space-y-1 leading-relaxed">
        <div className="flex items-center gap-1 text-zinc-300 font-semibold">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>Dynamic Architecture</span>
        </div>
        <p>
          Google Reviews configuration (layout, Google business connection, selected reviews, styling) is managed centrally in the <strong>Widget Studio</strong>.
        </p>
        <p>
          Whenever you publish updates in the Studio, they automatically update on your live website without having to re-edit this page.
        </p>
      </div>
    </div>
  );
}
