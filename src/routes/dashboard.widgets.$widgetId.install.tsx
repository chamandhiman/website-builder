import { createFileRoute, useNavigate, useParams } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import { getWidget, type WidgetInstanceRecord } from "@/services/widgetService";
import { renderCountdownHtml, renderGoogleReviewsHtml } from "@/lib/widget-runtime/wtoWidgetRuntime";
import {
  CheckCircle2,
  Copy,
  Check,
  Code2,
  ArrowLeft,
  ExternalLink,
  Edit3,
  Layers,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/dashboard/widgets/$widgetId/install")({
  component: WidgetInstallPage,
});

function WidgetInstallPage() {
  const { widgetId } = useParams({ from: "/dashboard/widgets/$widgetId/install" });
  const navigate = useNavigate();

  const [widget, setWidget] = useState<WidgetInstanceRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const data = await getWidget(widgetId);
        if (data) {
          setWidget(data);
        } else {
          toast.error("Widget not found");
          navigate({ to: "/dashboard/widgets" as any });
        }
      } catch (err) {
        toast.error("Error loading widget");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [widgetId, navigate]);

  const embedCode = useMemo(() => {
    return `<div data-wto-widget="${widgetId}"></div>\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;
  }, [widgetId]);

  const handleCopy = () => {
    navigator.clipboard.writeText(embedCode);
    setCopied(true);
    toast.success("Embed code copied to clipboard!");
    setTimeout(() => setCopied(false), 2200);
  };

  if (loading || !widget) {
    return (
      <div className="min-h-screen bg-[#18181b] flex items-center justify-center text-zinc-400">
        <div className="w-8 h-8 border-2 border-amber-400 border-t-transparent rounded-full animate-spin mr-3"></div>
        Loading installation details…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#18181b] text-zinc-100 p-6 md:p-10 ml-0 md:ml-[180px]">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Top Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/widgets" as any })}
            className="p-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Install Widget</h1>
            <p className="text-sm text-zinc-400 mt-0.5">Your widget is ready to embed on any website.</p>
          </div>
        </div>

        {/* Success Card */}
        <div className="p-6 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-6">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">{widget.name}</h3>
                <span className="text-xs text-zinc-400">
                  {widget.type === "countdown"
                    ? `Countdown Timer • Mode: ${(widget.config as any)?.timerMode || "date"}`
                    : widget.type === "announcement_popup"
                    ? `Announcement & Popup • Mode: ${(widget.config as any)?.displayMode === "popup" ? "Popup Modal" : "Announcement Bar"}`
                    : widget.type === "faq_accordion"
                    ? `FAQ Accordion • Template: ${(widget.config as any)?.template || "classic_accordion"}`
                    : `Business: ${widget.source?.businessName || "Connected Source"}`}
                </span>
              </div>
            </div>

            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Published
            </span>
          </div>

          <div className="p-3 rounded-lg bg-zinc-950/60 border border-zinc-850 flex items-center justify-between text-xs">
            <span className="text-zinc-500">Widget ID:</span>
            <span className="font-mono text-amber-300 font-semibold">{widget.id}</span>
          </div>

          {/* Embed Code Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Code2 className="w-4 h-4 text-amber-400" />
                HTML Embed Code
              </label>

              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-amber-400 hover:bg-amber-300 text-black text-xs font-bold transition-all shadow-md active:scale-95"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Code"}</span>
              </button>
            </div>

            <pre className="p-4 rounded-xl bg-black border border-zinc-800 text-zinc-300 font-mono text-xs overflow-x-auto leading-relaxed select-all">
              {embedCode}
            </pre>
          </div>

          {/* Installation Instructions */}
          <div className="pt-4 border-t border-zinc-800/80 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">How to embed this widget:</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-zinc-400">
              <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-850 space-y-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  1. In WebToolOcean Builder
                </span>
                <p className="leading-relaxed">
                  Open your page, add a <strong>Custom HTML</strong> element or <strong>Widget</strong> placeholder, and paste this embed code.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-zinc-950/40 border border-zinc-850 space-y-1.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  2. On Any External Website
                </span>
                <p className="leading-relaxed">
                  Paste this snippet directly into your HTML, WordPress, Shopify, or Webflow page where you want the widget to appear.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              const route = widget.type === "countdown"
                ? `/dashboard/widgets/countdown/${widget.id}`
                : widget.type === "announcement_popup"
                ? `/dashboard/widgets/announcement-popup/${widget.id}`
                : widget.type === "faq_accordion"
                ? `/dashboard/widgets/faq-accordion/${widget.id}`
                : `/dashboard/widgets/google-reviews/${widget.id}`;
              navigate({ to: route as any });
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold border border-zinc-700 transition-colors"
          >
            <Edit3 className="w-4 h-4 text-amber-400" />
            <span>Open in Widget Studio</span>
          </button>

          <button
            type="button"
            onClick={() => navigate({ to: "/dashboard/widgets" as any })}
            className="text-xs text-zinc-400 hover:text-white transition-colors"
          >
            Back to My Widgets
          </button>
        </div>
      </div>
    </div>
  );
}
