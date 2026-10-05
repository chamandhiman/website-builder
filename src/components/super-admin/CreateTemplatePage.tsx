"use client";

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { ArrowLeft, Layers, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useBuilder } from "@/lib/builder/store";

const TEMPLATE_CATEGORIES = [
  "Business",
  "Agency",
  "Freelancer",
  "SaaS & Technology",
  "Healthcare",
  "Fitness & Gym",
  "Restaurant & Café",
  "Real Estate",
  "Education",
  "Driving School",
  "Beauty & Salon",
  "Construction",
  "Automotive",
  "Photography",
  "Portfolio",
  "Law Firm",
  "Finance",
  "Travel & Hotel",
  "E-commerce",
  "Personal / Resume",
];

export function CreateTemplatePage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const effectiveCategory = category === "__custom__" ? customCategory : category;

  const handleCreate = () => {
    const trimmedName = name.trim();
    const trimmedCategory = effectiveCategory.trim();

    if (!trimmedName) {
      toast.error("Please enter a template name.");
      return;
    }
    if (!trimmedCategory) {
      toast.error("Please select or enter a category.");
      return;
    }

    setLoading(true);
    try {
      const projectId = useBuilder.getState().createTemplateProject(trimmedName);
      navigate({
        to: "/editor/$projectId",
        params: { projectId },
        search: {
          templateMode: "true",
          templateName: trimmedName,
          templateCategory: trimmedCategory,
        } as any,
      });
    } catch (err: any) {
      console.error("[CreateTemplatePage] Failed to create project:", err);
      toast.error("Failed to initialise builder. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-full bg-[#171717] p-6 text-[#F5F5F5]">
      <div className="mx-auto max-w-xl space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate({ to: "/super-admin/templates" })}
            className="h-9 w-9 border-[#363636] bg-[#1F1F1F] text-[#D0D0D0] hover:bg-[#242424] hover:text-[#F5F5F5]"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-[#F5F5F5]">Create New Template</h1>
            <p className="mt-0.5 text-xs text-[#969696]">
              Name your template, pick a category, then design it in the builder.
            </p>
          </div>
        </div>

        <div className="rounded-xl border border-[#363636] bg-[#1F1F1F] p-6 shadow-xl space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="template-name"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D0D0D0]"
            >
              <Pencil className="h-3.5 w-3.5 text-[#FACC15]" />
              Template Name <span className="text-[#FACC15]">*</span>
            </label>
            <Input
              id="template-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Freelancer Premium, Luxury Real Estate"
              className="h-10 rounded-lg border-[#363636] bg-[#171717] text-sm text-[#F5F5F5] placeholder:text-[#646464] focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/10"
              onKeyDown={(e) => e.key === "Enter" && handleCreate()}
              autoFocus
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="template-category"
              className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#D0D0D0]"
            >
              <Layers className="h-3.5 w-3.5 text-[#FACC15]" />
              Category <span className="text-[#FACC15]">*</span>
            </label>
            <select
              id="template-category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="h-10 w-full rounded-lg border border-[#363636] bg-[#171717] px-3 text-sm text-[#F5F5F5] outline-none focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/10"
            >
              <option value="" disabled>Select a category...</option>
              {TEMPLATE_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
              <option value="__custom__">Other (type below)</option>
            </select>

            {category === "__custom__" && (
              <Input
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                placeholder="Enter custom category"
                className="h-10 rounded-lg border-[#363636] bg-[#171717] text-sm text-[#F5F5F5] placeholder:text-[#646464] focus:border-[#FACC15] focus:ring-2 focus:ring-[#FACC15]/10"
                autoFocus
              />
            )}
          </div>

          <div className="rounded-lg border border-[#FACC15]/20 bg-[#FACC15]/5 px-4 py-3 text-xs space-y-1">
            <p className="font-semibold text-[#C8A800]">What happens next?</p>
            <ul className="list-disc list-inside space-y-0.5 text-[#969696]">
              <li>A blank project opens in the full builder.</li>
              <li>Add widgets from the left sidebar.</li>
              <li>Configure each widget with the Properties panel.</li>
              <li>
                Click <strong className="text-[#F5F5F5]">Save as Template</strong> in the toolbar when done.
              </li>
              <li>Then publish it from the Templates list.</li>
            </ul>
          </div>

          <div className="flex items-center justify-end gap-3 pt-1">
            <Button
              variant="outline"
              onClick={() => navigate({ to: "/super-admin/templates" })}
              className="h-10 border-[#363636] bg-transparent text-xs font-medium text-[#D0D0D0] hover:bg-[#242424] hover:text-[#F5F5F5]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={loading || !name.trim() || !effectiveCategory.trim()}
              className="h-10 gap-2 bg-[#FACC15] px-6 text-xs font-semibold text-[#111111] shadow-lg transition hover:bg-[#FDE047] disabled:opacity-50"
            >
              {loading ? "Opening Builder..." : "Open Builder \u2192"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
