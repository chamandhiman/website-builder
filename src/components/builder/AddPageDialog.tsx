import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/builder/store";

interface AddPageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddPage: (name: string, slug: string) => string;
}

export function AddPageDialog({ open, onOpenChange, onAddPage }: AddPageDialogProps) {
  const [name, setName] = useState("New Page");
  const [slug, setSlug] = useState(slugify("New Page"));
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (open) {
      setName("New Page");
      setSlug(slugify("New Page"));
      setSlugTouched(false);
    }
  }, [open]);

  const handleNameChange = (nextName: string) => {
    setName(nextName);
    if (!slugTouched) {
      setSlug(slugify(nextName));
    }
  };

  const handleSlugChange = (nextSlug: string) => {
    setSlugTouched(true);
    setSlug(slugify(nextSlug));
  };

  const handleAdd = () => {
    const trimmedName = name.trim() || "New Page";
    const trimmedSlug = slug.trim() || slugify(trimmedName);
    const id = onAddPage(trimmedName, trimmedSlug);
    if (id) {
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md border border-[#E2E8F0] bg-white text-[#000000] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#000000]">Add new page</DialogTitle>
          <DialogDescription className="text-[#64748B]">Create a new page for your website. The slug will be auto-generated from the page name.</DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#64748B]" htmlFor="add-page-name">
              Page name
            </label>
            <Input
              id="add-page-name"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              className="border-[#CBD5E1] bg-white text-[#000000] focus:border-[#7137D8] focus:ring-1 focus:ring-[#7137D8]"
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-[#64748B]" htmlFor="add-page-slug">
              Page slug
            </label>
            <Input
              id="add-page-slug"
              value={slug}
              onChange={(e) => handleSlugChange(e.target.value)}
              className="border-[#CBD5E1] bg-white text-[#000000] focus:border-[#7137D8] focus:ring-1 focus:ring-[#7137D8]"
            />
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-md border border-[#E2E8F0] bg-white px-4 text-sm text-[#475569] transition hover:bg-[#F1F5F9] hover:text-[#000000]"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center justify-center rounded-md bg-[#7137D8] px-4 text-sm font-semibold text-white transition hover:bg-[#5b2ab5]"
            onClick={handleAdd}
          >
            Add Page
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
