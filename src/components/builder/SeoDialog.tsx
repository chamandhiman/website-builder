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
      <DialogContent className="max-w-2xl border border-[#E2E8F0] bg-white p-0 text-[#000000] shadow-2xl">
        <div className="max-h-[90vh] overflow-y-auto">
          <DialogHeader className="border-b border-[#E2E8F0] bg-[#F8FAFC] px-6 py-5">
            <DialogTitle className="text-[#000000]">
              SEO Settings
            </DialogTitle>
            <DialogDescription className="text-[#64748B]">
              Configure page SEO metadata.
            </DialogDescription>
          </DialogHeader>

          <div className="p-6">
            <SeoSettingsPanel
              page={page}
              project={project}
            />
          </div>

          <DialogFooter className="border-t border-[#E2E8F0] bg-[#F8FAFC] px-6 py-4 flex justify-end gap-2">
            <DialogClose asChild>
              <button className="rounded-lg border border-[#CBD5E1] bg-white px-4 py-2 text-sm font-semibold text-[#475569] transition hover:bg-[#F1F5F9] hover:text-[#000000]">
                Close
              </button>
            </DialogClose>
            <button
              onClick={onClose}
              className="rounded-lg bg-[#7137D8] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#5b2ab5]"
            >
              Save
            </button>
          </DialogFooter>
        </div>
      </DialogContent>

    </Dialog>
  );
}