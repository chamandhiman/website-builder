import React, { useState } from "react";
import { Download, ChevronDown, FileCode, Code2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DownloadDropdownProps {
  onDownloadHtml: () => Promise<void> | void;
  onDownloadReact: () => Promise<void> | void;
  className?: string;
  buttonClassName?: string;
}

export function DownloadDropdown({
  onDownloadHtml,
  onDownloadReact,
  className = "",
  buttonClassName = "",
}: DownloadDropdownProps) {
  const [open, setOpen] = useState(false);
  const [downloadingHtml, setDownloadingHtml] = useState(false);
  const [downloadingReact, setDownloadingReact] = useState(false);

  const isBusy = downloadingHtml || downloadingReact;

  const handleDownloadHtml = async () => {
    if (isBusy) return;
    setOpen(false);
    setDownloadingHtml(true);
    try {
      await onDownloadHtml();
    } finally {
      setDownloadingHtml(false);
    }
  };

  const handleDownloadReact = async () => {
    if (isBusy) return;
    setOpen(false);
    setDownloadingReact(true);
    try {
      await onDownloadReact();
    } finally {
      setDownloadingReact(false);
    }
  };

  const defaultBtnClass =
    "inline-flex h-8 items-center gap-1.5 rounded-md border border-[#363636] bg-[#1F1F1F] px-3 text-sm font-medium text-[#F5F5F5] transition hover:border-[#FACC15] hover:text-[#FACC15] focus:outline-none focus:ring-1 focus:ring-[#FACC15]/40 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className={`relative inline-flex items-center ${className}`}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            disabled={isBusy}
            className={buttonClassName || defaultBtnClass}
            title="Download website"
            aria-label="Download options"
          >
            {isBusy ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#FACC15]" />
            ) : (
              <Download className="w-4 h-4 text-[#FACC15]" />
            )}
            <span className="inline font-medium">Download</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#969696] transition-transform duration-200 ${
                open ? "rotate-180 text-[#FACC15]" : ""
              }`}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="w-56 rounded-xl border border-[#363636] bg-[#1F1F1F] p-1.5 text-[#D0D0D0] shadow-2xl z-50 animate-in fade-in-0 zoom-in-95"
        >
          <DropdownMenuItem
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#E5E5E5] transition hover:bg-[#2A2A2A] hover:text-[#FACC15] focus:bg-[#2A2A2A] focus:text-[#FACC15] cursor-pointer"
            onClick={handleDownloadHtml}
            disabled={isBusy}
          >
            {downloadingHtml ? (
              <Loader2 className="w-4 h-4 animate-spin text-orange-400 shrink-0" />
            ) : (
              <FileCode className="w-4 h-4 text-orange-400 shrink-0" />
            )}
            <div className="flex flex-col text-left">
              <span className="font-semibold text-[#F5F5F5]">Download HTML</span>
              <span className="text-[10px] text-[#969696]">Static HTML, CSS & JS zip</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-medium text-[#E5E5E5] transition hover:bg-[#2A2A2A] hover:text-[#FACC15] focus:bg-[#2A2A2A] focus:text-[#FACC15] cursor-pointer mt-0.5"
            onClick={handleDownloadReact}
            disabled={isBusy}
          >
            {downloadingReact ? (
              <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
            ) : (
              <Code2 className="w-4 h-4 text-cyan-400 shrink-0" />
            )}
            <div className="flex flex-col text-left">
              <span className="font-semibold text-[#F5F5F5]">Download React Version</span>
              <span className="text-[10px] text-[#969696]">Standalone Vite + React project</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
