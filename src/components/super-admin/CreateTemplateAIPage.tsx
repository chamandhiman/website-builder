"use client";

import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Sparkles, ArrowLeft, Wand2, Palette, Sliders, CheckCircle2, ChevronDown, ChevronUp, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { useBuilder } from "@/lib/builder/store";
import { generateAITemplate } from "@/services/aiTemplateGenerator";

const PRESET_PROMPTS = [
  {
    title: "Luxury Real Estate",
    category: "Real Estate",
    prompt:
      "Create a premium luxury real estate landing page. Use a dark elegant visual style with a large hero image, property search section, featured properties, amenities, statistics, testimonials, CTA and footer. Make it modern, spacious and responsive.",
    style: "Dark Luxury",
    color: "Dark & Gold",
    industry: "Real Estate",
  },
  {
    title: "Enterprise B2B SaaS",
    category: "SaaS & Tech",
    prompt:
      "Build a modern high-converting B2B SaaS landing page for an AI automation platform. Include a crisp header with sign up CTA, dynamic hero with product metrics, feature capability cards, customer testimonials slider, interactive FAQ accordion, bold final CTA and professional footer.",
    style: "High-Tech Gradient",
    color: "Midnight Blue & Cyan",
    industry: "SaaS",
  },
  {
    title: "Creative Design Studio",
    category: "Portfolio & Creative",
    prompt:
      "Design an avant-garde digital agency portfolio. Include a minimalist header, bold typographical hero, selected works showcase gallery, our philosophy about section, client acclaim quotes, project inquiry CTA and sleek footer.",
    style: "Modern Minimalist",
    color: "Monochrome Dark",
    industry: "Portfolio",
  },
  {
    title: "Fine Dining Restaurant",
    category: "Hospitality & Food",
    prompt:
      "Create an upscale culinary restaurant experience. Include an elegant header, ambient hero with reserve table CTA, signature tasting menu showcase, chef story split section, guest reviews slider, private dining FAQ and footer with hours and location.",
    style: "Warm & Elegant",
    color: "Dark & Gold",
    industry: "Restaurant",
  },
];

const VISUAL_STYLES = [
  "Dark Luxury",
  "Modern Minimalist",
  "High-Tech Gradient",
  "Warm & Elegant",
  "Deep Slate & Emerald",
  "Clean Corporate",
];

const COLOR_PREFERENCES = [
  "Dark & Gold",
  "Midnight Blue & Cyan",
  "Deep Slate & Emerald",
  "Cosmic Violet",
  "Clean Minimal Light",
  "Monochrome Dark",
];

const INDUSTRIES = [
  "Real Estate",
  "SaaS & Tech",
  "Portfolio & Creative",
  "Hospitality & Food",
  "Fitness & Wellness",
  "Agency & Consulting",
  "Business & Finance",
  "General",
];

const GENERATION_STEPS = [
  "Analyzing requirements & intent...",
  "Designing color palette & visual harmony...",
  "Selecting & composing widgets from registry...",
  "Synthesizing high-res imagery & copywriting...",
  "Assembling page sections for builder...",
  "Preparing editable project canvas...",
];

export function CreateTemplateAIPage() {
  const navigate = useNavigate();

  const [name, setName] = useState("Luxury Real Estate");
  const [category, setCategory] = useState("Real Estate");
  const [prompt, setPrompt] = useState(
    "Create a premium luxury real estate landing page. Use a dark elegant visual style with a large hero image, property search section, featured properties, amenities, statistics, testimonials, CTA and footer. Make it modern, spacious and responsive."
  );

  const [visualStyle, setVisualStyle] = useState("Dark Luxury");
  const [colorPreference, setColorPreference] = useState("Dark & Gold");
  const [industry, setIndustry] = useState("Real Estate");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [apiKey, setApiKey] = useState(
    () => (typeof window !== "undefined" ? localStorage.getItem("wto_ai_api_key") || "" : "")
  );

  const [generating, setGenerating] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);

  const applyPreset = (preset: (typeof PRESET_PROMPTS)[0]) => {
    setName(preset.title);
    setCategory(preset.category);
    setPrompt(preset.prompt);
    setVisualStyle(preset.style);
    setColorPreference(preset.color);
    setIndustry(preset.industry);
  };

  const handleGenerate = async () => {
    if (!name.trim()) {
      toast.error("Please enter a template name");
      return;
    }
    if (!category.trim()) {
      toast.error("Please enter or select a category");
      return;
    }
    if (!prompt.trim()) {
      toast.error("Please enter an AI prompt describing your desired template");
      return;
    }

    if (apiKey.trim()) {
      localStorage.setItem("wto_ai_api_key", apiKey.trim());
    }

    setGenerating(true);
    setStepIndex(0);

    // Progressive step indicator
    const interval = window.setInterval(() => {
      setStepIndex((curr) => (curr < GENERATION_STEPS.length - 1 ? curr + 1 : curr));
    }, 700);

    try {
      const result = await generateAITemplate({
        name: name.trim(),
        category: category.trim(),
        prompt: prompt.trim(),
        visualStyle,
        colorPreference,
        industry,
      });

      window.clearInterval(interval);
      setStepIndex(GENERATION_STEPS.length - 1);

      // Create a fresh template project in store
      const store = useBuilder.getState();
      const projectId = store.createTemplateProject(name.trim());
      const currentProject = store.projects[projectId];

      if (!currentProject) {
        throw new Error("Failed to initialize builder project");
      }

      // Populate project's page sections with the generated widgets
      const page = currentProject.pages[0];
      const updatedPages = currentProject.pages.map((p) =>
        p.id === page.id ? { ...p, sections: result.sections } : p
      );

      useBuilder.setState((s) => ({
        projects: {
          ...s.projects,
          [projectId]: {
            ...currentProject,
            name: name.trim(),
            isTemplate: true,
            pages: updatedPages,
          },
        },
      }));

      store.persist();

      toast.success("Template generated successfully! Opening builder...");

      // Navigate to existing builder in templateMode
      navigate({
        to: "/editor/$projectId",
        params: { projectId },
        search: {
          templateMode: "true",
          templateName: name.trim(),
          templateCategory: category.trim(),
        } as any,
      });
    } catch (err: any) {
      window.clearInterval(interval);
      console.error("[CreateTemplateAI] Generation failed:", err);
      toast.error(err?.message || "Failed to generate template");
      setGenerating(false);
    }
  };

  return (
    <div className="min-h-full bg-[#171717] p-6 text-[#F5F5F5]">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between">
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
              <div className="flex items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-[#F5F5F5]">AI Template Generator</h1>
                <Badge className="border-[#FACC15]/30 bg-[#FACC15]/10 text-xs font-semibold uppercase tracking-wider text-[#FACC15]">
                  Full-Page AI
                </Badge>
              </div>
              <p className="mt-0.5 text-xs text-[#969696]">
                Generate a complete, fully editable website template from a single prompt using existing widgets.
              </p>
            </div>
          </div>
        </div>

        {generating ? (
          <Card className="flex flex-col items-center justify-center border-[#363636] bg-[#1F1F1F] p-12 text-center shadow-xl">
            <div className="relative mb-6">
              <div className="h-16 w-16 animate-spin rounded-full border-4 border-[#363636] border-t-[#FACC15]" />
              <Sparkles className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-1/2 text-[#FACC15] animate-pulse" />
            </div>

            <h3 className="text-xl font-bold text-[#F5F5F5]">Generating your template...</h3>
            <p className="mt-1 text-sm text-[#969696]">Creating a cohesive, full-page design using our widget system</p>

            <div className="mt-8 w-full max-w-md space-y-3 text-left">
              {GENERATION_STEPS.map((step, idx) => (
                <div
                  key={step}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-xs transition-all ${
                    idx < stepIndex
                      ? "text-emerald-400 font-medium"
                      : idx === stepIndex
                      ? "bg-[#FACC15]/10 text-[#FACC15] font-semibold border border-[#FACC15]/30"
                      : "text-[#646464]"
                  }`}
                >
                  <CheckCircle2
                    className={`h-4 w-4 shrink-0 ${
                      idx < stepIndex
                        ? "text-emerald-400"
                        : idx === stepIndex
                        ? "text-[#FACC15] animate-spin"
                        : "text-[#424242]"
                    }`}
                  />
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <div className="space-y-6">
            {/* Quick Inspiration Presets */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#969696]">
                Inspiration Presets (Click to Load)
              </span>
              <div className="flex flex-wrap gap-2">
                {PRESET_PROMPTS.map((preset) => (
                  <button
                    key={preset.title}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                      name === preset.title
                        ? "border-[#FACC15] bg-[#FACC15]/15 text-[#FACC15]"
                        : "border-[#363636] bg-[#1F1F1F] text-[#D0D0D0] hover:border-[#525252] hover:bg-[#242424]"
                    }`}
                  >
                    <Wand2 className="h-3 w-3" />
                    <span>{preset.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Core Form Card */}
            <Card className="space-y-5 border-[#363636] bg-[#1F1F1F] p-6 shadow-lg">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#D0D0D0]">
                    Template Name <span className="text-[#FACC15]">*</span>
                  </label>
                  <Input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Luxury Real Estate"
                    className="h-10 rounded-lg border-[#363636] bg-[#171717] text-sm text-[#F5F5F5] placeholder:text-[#646464] focus:border-[#FACC15]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#D0D0D0]">
                    Category <span className="text-[#FACC15]">*</span>
                  </label>
                  <Input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g. Real Estate"
                    className="h-10 rounded-lg border-[#363636] bg-[#171717] text-sm text-[#F5F5F5] placeholder:text-[#646464] focus:border-[#FACC15]"
                  />
                </div>
              </div>

              {/* Prompt Textarea */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold uppercase tracking-wider text-[#D0D0D0]">
                    AI Prompt <span className="text-[#FACC15]">*</span>
                  </label>
                  <span className="text-[11px] text-[#969696]">Describe desired style, sections, and mood</span>
                </div>
                <Textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  rows={5}
                  placeholder="Describe your template in detail. Example: Create a premium luxury real estate landing page. Use a dark elegant visual style with a large hero image, property search section, featured properties, amenities, statistics, testimonials, CTA and footer. Make it modern, spacious and responsive."
                  className="rounded-lg border-[#363636] bg-[#171717] text-sm text-[#F5F5F5] placeholder:text-[#646464] focus:border-[#FACC15]"
                />
              </div>

              {/* Advanced / Optional Accordion */}
              <div className="border-t border-[#363636] pt-4">
                <button
                  type="button"
                  onClick={() => setShowAdvanced(!showAdvanced)}
                  className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#FACC15] hover:underline"
                >
                  <Sliders className="h-3.5 w-3.5" />
                  <span>{showAdvanced ? "Hide Design Preferences" : "Customize Style & Color (Optional)"}</span>
                  {showAdvanced ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                </button>

                {showAdvanced && (
                  <div className="mt-4 grid gap-4 rounded-xl border border-[#363636] bg-[#171717] p-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#969696]">Visual Style</label>
                      <select
                        value={visualStyle}
                        onChange={(e) => setVisualStyle(e.target.value)}
                        className="h-9 w-full rounded-lg border border-[#363636] bg-[#1F1F1F] px-3 text-xs text-[#F5F5F5] outline-none focus:border-[#FACC15]"
                      >
                        {VISUAL_STYLES.map((style) => (
                          <option key={style} value={style}>
                            {style}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#969696]">Color Preference</label>
                      <select
                        value={colorPreference}
                        onChange={(e) => setColorPreference(e.target.value)}
                        className="h-9 w-full rounded-lg border border-[#363636] bg-[#1F1F1F] px-3 text-xs text-[#F5F5F5] outline-none focus:border-[#FACC15]"
                      >
                        {COLOR_PREFERENCES.map((color) => (
                          <option key={color} value={color}>
                            {color}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-medium text-[#969696]">Industry</label>
                      <select
                        value={industry}
                        onChange={(e) => setIndustry(e.target.value)}
                        className="h-9 w-full rounded-lg border border-[#363636] bg-[#1F1F1F] px-3 text-xs text-[#F5F5F5] outline-none focus:border-[#FACC15]"
                      >
                        {INDUSTRIES.map((ind) => (
                          <option key={ind} value={ind}>
                            {ind}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="sm:col-span-3 space-y-1.5 border-t border-[#2B2B2B] pt-3">
                      <div className="flex items-center gap-1.5">
                        <Key className="h-3 w-3 text-[#969696]" />
                        <label className="text-xs font-medium text-[#969696]">
                          Custom Gemini API Key (Optional)
                        </label>
                      </div>
                      <Input
                        type="password"
                        value={apiKey}
                        onChange={(e) => setApiKey(e.target.value)}
                        placeholder="Leave blank to use built-in Neural Design Engine, or paste Gemini API key"
                        className="h-8 rounded-lg border-[#363636] bg-[#1F1F1F] text-xs text-[#F5F5F5] placeholder:text-[#646464]"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Generate Button */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => navigate({ to: "/super-admin/templates" })}
                  className="h-10 border-[#363636] bg-transparent text-xs font-medium text-[#D0D0D0] hover:bg-[#242424] hover:text-[#F5F5F5]"
                >
                  Cancel
                </Button>

                <Button
                  onClick={handleGenerate}
                  disabled={!name.trim() || !category.trim() || !prompt.trim()}
                  className="h-10 gap-2 bg-[#FACC15] px-6 text-xs font-semibold text-[#111111] shadow-lg transition hover:bg-[#FDE047] disabled:opacity-50"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Template</span>
                </Button>
              </div>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
