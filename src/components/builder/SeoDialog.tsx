import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

import { SeoSettingsPanel } from "./SeoSettingsPanel";
import type { Page } from "@/lib/builder/store";

interface SeoDialogProps {
  page: Page | null;
  project: any;
  open: boolean;
  onClose: () => void;
}

export function SeoDialog({
  page,
  project,
  open,
  onClose,
}: SeoDialogProps) {
  if (!page) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) onClose();
      }}
    >
      <DialogContent className="max-w-2xl border border-[#363636] bg-[#1A1A1A] p-0 text-[#F5F5F5]">
        <div className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-[#2A2A2A] px-6 py-5">
            <DialogTitle className="text-[#F5F5F5]">
              SEO Settings
            </DialogTitle>
            <DialogDescription className="text-[#969696]">
              Configure page SEO metadata.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6">
            <SeoSettingsPanel
              page={page}
              project={project}
            />
          </div>

          <DialogFooter className="border-t border-[#2A2A2A] px-6 py-4 flex justify-end gap-2">
            <DialogClose asChild>
              <button className="rounded-lg border border-[#363636] bg-[#242424] px-4 py-2 text-sm text-[#D0D0D0] transition hover:bg-[#2A2A2A] hover:text-[#FFFFFF]">
                Close
              </button>
            </DialogClose>
            <button
              onClick={onClose}
              className="rounded-lg bg-[#FACC15] px-4 py-2 text-sm font-medium text-[#111111] transition hover:bg-[#FDE047]"
            >
              Save
            </button>
          </DialogFooter>
        </div>
      </DialogContent>

    </Dialog>
  );
}