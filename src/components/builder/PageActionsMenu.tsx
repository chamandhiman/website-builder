"use client";

import { useEffect, useState } from "react";
import { Copy, Edit2, MoreVertical, Settings, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { slugify } from "@/lib/builder/store";
import type { Page } from "@/lib/builder/store";

interface PageActionsMenuProps {
  page: Page;
  pageCount: number;
  onRename: (id: string, name: string) => void;
  onSetSlug: (id: string, slug: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
  onSeo: (id: string) => void;
  triggerClassName?: string;
}

export function PageActionsMenu({ page, pageCount, onRename, onSetSlug, onDuplicate, onDelete, onSeo, triggerClassName }: PageActionsMenuProps) {
  const [renameOpen, setRenameOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState(page.name);
  const [slug, setSlug] = useState(page.slug);
  const [slugTouched, setSlugTouched] = useState(false);

  useEffect(() => {
    if (renameOpen) {
      setName(page.name);
      setSlug(page.slug);
      setSlugTouched(false);
    }
  }, [renameOpen, page.name, page.slug]);

  const handleRenameSave = () => {
    const trimmed = name.trim();
    if (trimmed && trimmed !== page.name) {
      onRename(page.id, trimmed);
    }
    if (slug && slug !== page.slug) {
      onSetSlug(page.id, slug);
    }
    setRenameOpen(false);
  };

  return (
    <div className="flex items-center" onClick={(e) => e.stopPropagation()}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className={
              triggerClassName ||
              "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-[#E2E8F0] bg-white text-[#64748B] transition hover:border-[#7137D8] hover:bg-[#EDE9FE] hover:text-[#7137D8]"
            }
            aria-label="Page actions"
          >
            <MoreVertical className="h-3.5 w-3.5" />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent sideOffset={6} align="end" className="w-[12rem] rounded-xl border border-[#E2E8F0] bg-white p-1 text-[#000000] shadow-xl">
          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#000000] hover:bg-[#F1F5F9] hover:text-[#7137D8] focus:bg-[#F1F5F9] focus:text-[#7137D8]"
            onSelect={() => setRenameOpen(true)}
          >
            <Edit2 className="h-3.5 w-3.5 text-[#64748B]" />
            Rename
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#000000] hover:bg-[#F1F5F9] hover:text-[#7137D8] focus:bg-[#F1F5F9] focus:text-[#7137D8]"
            onSelect={() => onDuplicate(page.id)}
          >
            <Copy className="h-3.5 w-3.5 text-[#64748B]" />
            Duplicate
          </DropdownMenuItem>

          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#000000] hover:bg-[#F1F5F9] hover:text-[#7137D8] focus:bg-[#F1F5F9] focus:text-[#7137D8] disabled:cursor-not-allowed disabled:opacity-40"
            onSelect={() => setDeleteOpen(true)}
            disabled={pageCount <= 1}
          >
            <Trash2 className="h-3.5 w-3.5 text-[#64748B]" />
            Delete
          </DropdownMenuItem>

          <DropdownMenuSeparator className="my-1 border-t border-[#E2E8F0] bg-transparent" />

          <DropdownMenuItem
            className="flex cursor-pointer items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs text-[#000000] hover:bg-[#F1F5F9] hover:text-[#7137D8] focus:bg-[#F1F5F9] focus:text-[#7137D8]"
            onSelect={() => onSeo(page.id)}
          >
            <Settings className="h-3.5 w-3.5 text-[#64748B]" />
            SEO Settings
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={renameOpen} onOpenChange={setRenameOpen}>
        <DialogContent className="max-w-md border border-[#E2E8F0] bg-white text-[#000000] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-[#000000]">Rename page</DialogTitle>
            <DialogDescription className="text-[#64748B]">Update the page name without changing the page content.</DialogDescription>
          </DialogHeader>

          <div className="mt-4 space-y-2">
            <label className="text-sm font-medium text-[#64748B]" htmlFor="page-rename-input">
              Page name
            </label>
            <Input
              id="page-rename-input"
              value={name}
              onChange={(event) => {
                const nextName = event.target.value;
                setName(nextName);
                if (!slugTouched) {
                  setSlug(slugify(nextName));
                }
              }}
              autoFocus
            />
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium text-[#64748B]" htmlFor="page-slug-input">
              Page slug
            </label>
            <Input
              id="page-slug-input"
              value={slug}
              onChange={(event) => {
                setSlugTouched(true);
                setSlug(slugify(event.target.value));
              }}
            />
          </div>

          <DialogFooter className="mt-6">
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-md border border-[#CBD5E1] bg-white px-4 text-sm font-semibold text-[#475569] transition hover:bg-[#F1F5F9] hover:text-[#000000]"
              onClick={() => setRenameOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-md bg-[#FACC15] px-4 text-sm text-[#111111] transition hover:bg-[#FDE047]"
              onClick={handleRenameSave}
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent className="border border-[#E2E8F0] bg-white text-[#000000] shadow-2xl">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#000000]">Delete page?</AlertDialogTitle>
            <AlertDialogDescription className="text-[#64748B]">
              This will permanently remove the page from your project. You can only delete a page when your project has more than one page.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="border border-[#363636] bg-[#242424] text-[#D0D0D0] hover:bg-[#2A2A2A] hover:text-[#FFFFFF]"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-[#EF4444] text-white hover:bg-[#DC2626]"
              onClick={(e: any) => {
                try { e?.preventDefault(); } catch (_) {}
                onDelete(page.id);
                setDeleteOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
