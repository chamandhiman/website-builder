import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Check, Copy, ExternalLink, Globe, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface PublishSuccessModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  url: string;
  slug: string;
  isFirstPublish?: boolean;
  publishedAt?: number;
}

export function PublishSuccessModal({
  open,
  onOpenChange,
  url,
  slug,
  isFirstPublish = false,
  publishedAt,
}: PublishSuccessModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(url);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = url;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      toast.success("Published URL copied to clipboard!", { position: "top-center" });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy URL to clipboard.");
    }
  };

  const handleVisit = () => {
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const formattedTime = publishedAt
    ? new Date(publishedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "Just now";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-[#E2E8F0] bg-white text-[#000000] p-6 shadow-2xl rounded-2xl">
        <DialogHeader className="text-center sm:text-left space-y-2">
          <div className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#EDE9FE] text-[#7137D8]">
              <Sparkles className="h-4 w-4" />
            </span>
            <span className="inline-flex items-center rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              {isFirstPublish ? "Live on the Web" : "Updated & Live"}
            </span>
          </div>

          <DialogTitle className="text-xl font-bold text-[#000000]">
            {isFirstPublish ? "Your website is now published!" : "Website updated successfully!"}
          </DialogTitle>

          <DialogDescription className="text-xs text-[#64748B]">
            Anyone around the world can now visit and browse your website through your unique subdomain.
          </DialogDescription>
        </DialogHeader>

        {/* URL Card */}
        <div className="mt-4 rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-[#64748B] flex items-center gap-1.5">
              <Globe className="h-3.5 w-3.5 text-[#7137D8]" />
              Public URL
            </span>
            <span className="text-[11px] text-[#666666]">
              Subdomain: <code className="text-[#7137D8] font-bold font-mono">{slug}</code>
            </span>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-[#CBD5E1] bg-white px-3 py-2.5 shadow-xs">
            <input
              type="text"
              readOnly
              value={url}
              className="flex-1 bg-transparent font-mono text-xs text-[#000000] font-semibold select-all outline-none"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 rounded-md bg-[#F1F5F9] px-2.5 py-1 text-xs font-semibold text-[#000000] transition hover:bg-[#EDE9FE] hover:text-[#7137D8]"
              title="Copy link"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex flex-col sm:flex-row items-center gap-2">
          <button
            type="button"
            onClick={handleVisit}
            className="flex-1 w-full inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-[#7137D8] px-4 text-sm font-semibold text-white transition hover:bg-[#5b2ab5] shadow-xs active:scale-[0.99]"
          >
            <ExternalLink className="h-4 w-4" />
            Visit Website
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="flex-1 w-full inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#000000] transition hover:bg-[#F8FAFC] shadow-xs"
          >
            {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
            {copied ? "Copied to Clipboard" : "Copy Link"}
          </button>
        </div>

        {/* Notice */}
        <div className="mt-3 rounded-lg border border-[#E2E8F0] bg-[#F8FAFC] p-2.5 text-[11px] text-[#64748B] leading-relaxed">
          <p>
            <strong className="text-[#000000] font-bold">Permanent URL:</strong> This subdomain is permanently assigned to this project. When you edit and re-publish, your changes will always update at this exact link without changing the URL.
          </p>
          <div className="mt-1 text-[10px] text-[#666666]">
            Last published: {formattedTime}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
