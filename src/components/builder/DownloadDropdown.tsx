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
    "inline-flex h-8 items-center gap-1.5 rounded-md border border-[#E2E8F0] bg-white px-3 text-sm font-bold text-[#000000] transition hover:border-[#7137D8] hover:text-[#7137D8] shadow-xs disabled:opacity-50 disabled:cursor-not-allowed";

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
              <Loader2 className="w-4 h-4 animate-spin text-[#7137D8]" />
            ) : (
              <Download className="w-4 h-4 text-[#7137D8]" />
            )}
            <span className="inline font-bold text-[#000000]">Download</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#64748B] transition-transform duration-200 ${
                open ? "rotate-180 text-[#7137D8]" : ""
              }`}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          sideOffset={6}
          className="w-56 rounded-xl border border-[#E2E8F0] bg-white p-1.5 text-[#000000] shadow-xl z-50 animate-in fade-in-0 zoom-in-95"
        >
          <DropdownMenuItem
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#000000] transition hover:bg-[#F1F5F9] hover:text-[#7137D8] focus:bg-[#F1F5F9] focus:text-[#7137D8] cursor-pointer"
            onClick={handleDownloadHtml}
            disabled={isBusy}
          >
            {downloadingHtml ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#7137D8] shrink-0" />
            ) : (
              <FileCode className="w-4 h-4 text-[#7137D8] shrink-0" />
            )}
            <div className="flex flex-col text-left">
              <span className="font-bold text-[#000000]">Download HTML</span>
              <span className="text-[10px] text-[#64748B]">Static HTML, CSS & JS zip</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs font-semibold text-[#000000] transition hover:bg-[#F1F5F9] hover:text-[#7137D8] focus:bg-[#F1F5F9] focus:text-[#7137D8] cursor-pointer mt-0.5"
            onClick={handleDownloadReact}
            disabled={isBusy}
          >
            {downloadingReact ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#3478F6] shrink-0" />
            ) : (
              <Code2 className="w-4 h-4 text-[#3478F6] shrink-0" />
            )}
            <div className="flex flex-col text-left">
              <span className="font-bold text-[#000000]">Download React Version</span>
              <span className="text-[10px] text-[#64748B]">Standalone Vite + React project</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
