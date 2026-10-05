import React, { useState } from "react";
import { useBuilder } from "@/lib/builder/store";
import type { WidgetPropertyComponentProps } from "../widgetRegistry";
import { defaultTestimonialsWidgetData, isTestimonialsWidgetData, type TestimonialItem, type TestimonialsWidgetData } from "./TestimonialsTypes";
import { Plus, Trash2, ChevronDown, ChevronUp, LayoutGrid, Sliders } from "lucide-react";
import { nanoid } from "nanoid";

export function TestimonialsProperties({ widgetId }: WidgetPropertyComponentProps) {
  const currentProject = useBuilder((s) => s.currentProject());
  const updateWidgetInstance = useBuilder((s) => s.updateWidgetInstance);

  const currentPage = currentProject?.pages.find((p) => p.id === currentProject.currentPageId) ?? currentProject?.pages[0];
  const section = currentPage?.sections.find((sec) => sec.widgetInstance?.id === widgetId);
  const widget = section?.widgetInstance;

  const d: TestimonialsWidgetData = widget && isTestimonialsWidgetData(widget) ? widget : defaultTestimonialsWidgetData;
  const [activeTab, setActiveTab] = useState<"items" | "style">("items");
  const [expandedId, setExpandedId] = useState<string | null>(d.content.items[0]?.id ?? null);

  const upContent = (partial: Partial<TestimonialsWidgetData["content"]>) => {
    if (!widget) return;
    updateWidgetInstance(widgetId, { ...d, content: { ...d.content, ...partial } } as any);
  };
  const upStyle = (partial: Partial<TestimonialsWidgetData["style"]>) => {
    if (!widget) return;
    updateWidgetInstance(widgetId, { ...d, style: { ...d.style, ...partial } } as any);
  };

  const handleModeChange = (mode: "static" | "carousel") => {
    if (!widget) return;
    updateWidgetInstance(widgetId, { ...d, variant: mode === "carousel" ? "Carousel Slider" : "Static Grid", style: { ...d.style, mode } } as any);
  };

  const handleAdd = () => {
    const item: TestimonialItem = {
      id: nanoid(6),
      name: "New Client",
      role: "Satisfied Customer",
      quote: "An exceptional experience from start to finish. Highly recommended to anyone looking for quality and expertise.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
      rating: 5,
    };
    upContent({ items: [...d.content.items, item] });
    setExpandedId(item.id);
  };

  const handleRemove = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (d.content.items.length <= 1) return;
    upContent({ items: d.content.items.filter((i) => i.id !== id) });
  };

  const handleUpdate = (id: string, upd: Partial<TestimonialItem>) => {
    upContent({ items: d.content.items.map((i) => (i.id === id ? { ...i, ...upd } : i)) });
  };

  const currentMode = d.style.mode || (d.variant?.toLowerCase().includes("carousel") ? "carousel" : "static");

  return (
    <div className="flex flex-col space-y-4 p-3 text-xs text-[#D4D4D8]">
      {/* Mode toggle */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">Layout Format</label>
        <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-[#27272A] bg-[#18181B] p-1">
          <button type="button" onClick={() => handleModeChange("static")} className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition ${currentMode === "static" ? "bg-[#FACC15] text-[#111111]" : "text-[#A1A1AA] hover:text-[#FAFAFA]"}`}>
            <LayoutGrid className="h-3.5 w-3.5" /> Static Grid
          </button>
          <button type="button" onClick={() => handleModeChange("carousel")} className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition ${currentMode === "carousel" ? "bg-[#FACC15] text-[#111111]" : "text-[#A1A1AA] hover:text-[#FAFAFA]"}`}>
            <Sliders className="h-3.5 w-3.5" /> Carousel
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-md border border-[#27272A] bg-[#18181B] p-0.5">
        <button type="button" onClick={() => setActiveTab("items")} className={`flex-1 rounded py-1 text-center font-medium ${activeTab === "items" ? "bg-[#27272A] text-[#FACC15]" : "text-[#71717A]"}`}>
          Reviews ({d.content.items.length})
        </button>
        <button type="button" onClick={() => setActiveTab("style")} className={`flex-1 rounded py-1 text-center font-medium ${activeTab === "style" ? "bg-[#27272A] text-[#FACC15]" : "text-[#71717A]"}`}>
          Styling
        </button>
      </div>

      {activeTab === "items" ? (
        <div className="space-y-3">
          {/* Section header fields */}
          <div className="space-y-2 rounded-lg border border-[#27272A] bg-[#18181B] p-3">
            <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Section Header</span>
            {(["eyebrow", "heading", "description"] as const).map((key) => (
              <div key={key}>
                <label className="text-[10px] text-[#71717A] capitalize">{key}</label>
                {key === "description" ? (
                  <textarea rows={2} value={d.content[key] || ""} onChange={(e) => upContent({ [key]: e.target.value })} className="mt-1 w-full rounded border border-[#27272A] bg-[#111113] px-2 py-1 text-xs text-[#FAFAFA] outline-none" />
                ) : (
                  <input type="text" value={d.content[key] || ""} onChange={(e) => upContent({ [key]: e.target.value })} className="mt-1 w-full rounded border border-[#27272A] bg-[#111113] px-2 py-1 text-xs text-[#FAFAFA] outline-none" />
                )}
              </div>
            ))}
          </div>

          {/* Items */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Testimonials</span>
            <button type="button" onClick={handleAdd} className="flex items-center gap-1 rounded bg-[#FACC15] px-2 py-0.5 text-[11px] font-semibold text-[#111111]">
              <Plus className="h-3 w-3" /> Add
            </button>
          </div>
          <div className="space-y-2">
            {d.content.items.map((item) => {
              const isOpen = expandedId === item.id;
              return (
                <div key={item.id} className="rounded-lg border border-[#27272A] bg-[#18181B] overflow-hidden">
                  <div className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-[#202024]" onClick={() => setExpandedId(isOpen ? null : item.id)}>
                    <div className="flex items-center gap-2">
                      <img src={item.avatar} alt="" className="h-7 w-7 rounded-full object-cover border border-[#3F3F46]" />
                      <div>
                        <div className="font-semibold text-[#FAFAFA]">{item.name}</div>
                        <div className="text-[10px] text-[#A1A1AA]">{item.role}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {d.content.items.length > 1 && (
                        <button type="button" onClick={(e) => handleRemove(item.id, e)} className="p-1 text-[#71717A] hover:text-red-400">
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {isOpen ? <ChevronUp className="h-4 w-4 text-[#71717A]" /> : <ChevronDown className="h-4 w-4 text-[#71717A]" />}
                    </div>
                  </div>
                  {isOpen && (
                    <div className="space-y-2.5 border-t border-[#27272A] p-3 bg-[#111113]">
                      {(["name", "role", "company"] as const).map((f) => (
                        <div key={f}>
                          <label className="text-[10px] text-[#71717A] capitalize">{f}</label>
                          <input type="text" value={(item as any)[f] || ""} onChange={(e) => handleUpdate(item.id, { [f]: e.target.value })} className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none" />
                        </div>
                      ))}
                      <div>
                        <label className="text-[10px] text-[#71717A]">Quote Text</label>
                        <textarea rows={3} value={item.quote} onChange={(e) => handleUpdate(item.id, { quote: e.target.value })} className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#71717A]">Avatar Photo URL</label>
                        <input type="text" value={item.avatar} onChange={(e) => handleUpdate(item.id, { avatar: e.target.value })} className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none" />
                      </div>
                      <div>
                        <label className="text-[10px] text-[#71717A]">Star Rating (1-5)</label>
                        <input type="number" min={1} max={5} value={item.rating ?? 5} onChange={(e) => handleUpdate(item.id, { rating: Number(e.target.value) })} className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {currentMode === "static" && (
            <div className="rounded-lg border border-[#27272A] bg-[#18181B] p-3 space-y-2">
              <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Grid Columns</span>
              <div className="flex gap-2">
                {[2, 3, 4].map((n) => (
                  <button key={n} type="button" onClick={() => upStyle({ desktopColumns: n })} className={`flex-1 rounded py-1.5 font-semibold text-xs transition ${d.style.desktopColumns === n ? "bg-[#FACC15] text-[#111111]" : "bg-[#27272A] text-[#A1A1AA]"}`}>{n} Cols</button>
                ))}
              </div>
            </div>
          )}
          {currentMode === "carousel" && (
            <div className="rounded-lg border border-[#27272A] bg-[#18181B] p-3 space-y-2">
              <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Slider Options</span>
              {([["autoplay", "Enable Autoplay"], ["loop", "Infinite Loop"], ["showArrows", "Navigation Arrows"], ["showDots", "Pagination Dots"]] as const).map(([k, label]) => (
                <label key={k} className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={(d.style as any)[k] !== false && Boolean((d.style as any)[k] || k !== "autoplay")} onChange={(e) => upStyle({ [k]: e.target.checked })} className="rounded text-[#FACC15]" />
                  <span>{label}</span>
                </label>
              ))}
            </div>
          )}
          <div className="rounded-lg border border-[#27272A] bg-[#18181B] p-3 space-y-3">
            <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Colors</span>
            {([["backgroundColor", "Section BG"], ["cardBackgroundColor", "Card BG"], ["nameColor", "Name Color"], ["starColor", "Star / Accent Color"]] as const).map(([k, label]) => (
              <div key={k}>
                <label className="text-[10px] text-[#71717A]">{label}</label>
                <div className="flex items-center gap-2 mt-1">
                  <input type="color" value={(d.style as any)[k] || "#000000"} onChange={(e) => upStyle({ [k]: e.target.value })} className="h-6 w-7 rounded cursor-pointer border-0 bg-transparent" />
                  <span className="text-[11px] font-mono">{(d.style as any)[k]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
