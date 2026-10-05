import React, { useState } from "react";
import { useBuilder } from "@/lib/builder/store";
import type { WidgetPropertyComponentProps } from "../widgetRegistry";
import { defaultTeamWidgetData, isTeamWidgetData, type TeamMember, type TeamWidgetData } from "./TeamTypes";
import { Plus, Trash2, ChevronDown, ChevronUp, Users, Sliders, Palette, LayoutGrid } from "lucide-react";
import { nanoid } from "nanoid";

export function TeamProperties({ widgetId }: WidgetPropertyComponentProps) {
  const currentProject = useBuilder((s) => s.currentProject());
  const updateWidgetInstance = useBuilder((s) => s.updateWidgetInstance);

  const currentPage = currentProject?.pages.find((p) => p.id === currentProject.currentPageId) ?? currentProject?.pages[0];
  const section = currentPage?.sections.find((sec) => sec.widgetInstance?.id === widgetId);
  const widget = section?.widgetInstance;

  const teamData: TeamWidgetData = widget && isTeamWidgetData(widget) ? widget : defaultTeamWidgetData;
  const [activeTab, setActiveTab] = useState<"content" | "style">("content");
  const [expandedMemberId, setExpandedMemberId] = useState<string | null>(teamData.content.members[0]?.id ?? null);

  const updateContent = (partialContent: Partial<TeamWidgetData["content"]>) => {
    if (!widget) return;
    updateWidgetInstance(widgetId, {
      ...teamData,
      content: {
        ...teamData.content,
        ...partialContent,
      },
    } as any);
  };

  const updateStyle = (partialStyle: Partial<TeamWidgetData["style"]>) => {
    if (!widget) return;
    updateWidgetInstance(widgetId, {
      ...teamData,
      style: {
        ...teamData.style,
        ...partialStyle,
      },
    } as any);
  };

  const handleModeChange = (mode: "static" | "carousel") => {
    if (!widget) return;
    updateWidgetInstance(widgetId, {
      ...teamData,
      variant: mode === "carousel" ? "Carousel Slider" : "Static Grid",
      style: {
        ...teamData.style,
        mode,
      },
    } as any);
  };

  const handleAddMember = () => {
    const newMember: TeamMember = {
      id: nanoid(6),
      name: "New Team Member",
      role: "Associate Consultant",
      bio: "Passionate specialist committed to delivering exceptional client satisfaction.",
      photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80",
      linkedin: "https://linkedin.com",
    };
    updateContent({
      members: [...teamData.content.members, newMember],
    });
    setExpandedMemberId(newMember.id);
  };

  const handleRemoveMember = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (teamData.content.members.length <= 1) return;
    updateContent({
      members: teamData.content.members.filter((m) => m.id !== id),
    });
  };

  const handleUpdateMember = (id: string, updates: Partial<TeamMember>) => {
    updateContent({
      members: teamData.content.members.map((m) => (m.id === id ? { ...m, ...updates } : m)),
    });
  };

  const currentMode = teamData.style.mode || (teamData.variant?.toLowerCase().includes("carousel") ? "carousel" : "static");

  return (
    <div className="flex flex-col space-y-4 p-3 text-xs text-[#D4D4D8]">
      {/* Mode Switcher: Static vs Carousel */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-semibold text-[#A1A1AA] uppercase tracking-wider">Layout Format</label>
        <div className="grid grid-cols-2 gap-1.5 rounded-lg border border-[#27272A] bg-[#18181B] p-1">
          <button
            type="button"
            onClick={() => handleModeChange("static")}
            className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition ${
              currentMode === "static" ? "bg-[#FACC15] text-[#111111]" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
            }`}
          >
            <LayoutGrid className="h-3.5 w-3.5" />
            Static Grid
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("carousel")}
            className={`flex items-center justify-center gap-1.5 rounded-md py-1.5 font-medium transition ${
              currentMode === "carousel" ? "bg-[#FACC15] text-[#111111]" : "text-[#A1A1AA] hover:text-[#FAFAFA]"
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            Carousel Slider
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex rounded-md border border-[#27272A] bg-[#18181B] p-0.5">
        <button
          type="button"
          onClick={() => setActiveTab("content")}
          className={`flex-1 rounded py-1 text-center font-medium ${
            activeTab === "content" ? "bg-[#27272A] text-[#FACC15]" : "text-[#71717A] hover:text-[#E4E4E7]"
          }`}
        >
          Members ({teamData.content.members.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("style")}
          className={`flex-1 rounded py-1 text-center font-medium ${
            activeTab === "style" ? "bg-[#27272A] text-[#FACC15]" : "text-[#71717A] hover:text-[#E4E4E7]"
          }`}
        >
          Styling & Settings
        </button>
      </div>

      {activeTab === "content" ? (
        <div className="space-y-4">
          {/* Section Heading */}
          <div className="space-y-2 rounded-lg border border-[#27272A] bg-[#18181B] p-3">
            <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Section Header</span>
            <div>
              <label className="text-[10px] text-[#71717A]">Eyebrow Badge</label>
              <input
                type="text"
                value={teamData.content.eyebrow || ""}
                onChange={(e) => updateContent({ eyebrow: e.target.value })}
                className="mt-1 w-full rounded border border-[#27272A] bg-[#111113] px-2.5 py-1.5 text-xs text-[#FAFAFA] focus:border-[#FACC15] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#71717A]">Title Heading</label>
              <input
                type="text"
                value={teamData.content.heading || ""}
                onChange={(e) => updateContent({ heading: e.target.value })}
                className="mt-1 w-full rounded border border-[#27272A] bg-[#111113] px-2.5 py-1.5 text-xs text-[#FAFAFA] focus:border-[#FACC15] outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-[#71717A]">Description</label>
              <textarea
                rows={2}
                value={teamData.content.description || ""}
                onChange={(e) => updateContent({ description: e.target.value })}
                className="mt-1 w-full rounded border border-[#27272A] bg-[#111113] px-2.5 py-1.5 text-xs text-[#FAFAFA] focus:border-[#FACC15] outline-none"
              />
            </div>
          </div>

          {/* Members List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Team Members</span>
              <button
                type="button"
                onClick={handleAddMember}
                className="flex items-center gap-1 rounded bg-[#FACC15] px-2 py-0.5 text-[11px] font-semibold text-[#111111] hover:bg-[#FDE047]"
              >
                <Plus className="h-3 w-3" /> Add Member
              </button>
            </div>

            <div className="space-y-2">
              {teamData.content.members.map((member, idx) => {
                const isExpanded = expandedMemberId === member.id;
                return (
                  <div key={member.id} className="rounded-lg border border-[#27272A] bg-[#18181B] overflow-hidden">
                    <div
                      className="flex items-center justify-between p-2.5 cursor-pointer hover:bg-[#202024]"
                      onClick={() => setExpandedMemberId(isExpanded ? null : member.id)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={typeof member.photo === "string" ? member.photo : ""}
                          alt=""
                          className="h-7 w-7 rounded-full object-cover border border-[#3F3F46]"
                        />
                        <div>
                          <div className="font-semibold text-[#FAFAFA]">{member.name || `Member ${idx + 1}`}</div>
                          <div className="text-[10px] text-[#A1A1AA]">{member.role}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        {teamData.content.members.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => handleRemoveMember(member.id, e)}
                            className="p-1 text-[#71717A] hover:text-red-400"
                            title="Delete member"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                        {isExpanded ? <ChevronUp className="h-4 w-4 text-[#71717A]" /> : <ChevronDown className="h-4 w-4 text-[#71717A]" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="space-y-2.5 border-t border-[#27272A] p-3 bg-[#111113]">
                        <div>
                          <label className="text-[10px] text-[#71717A]">Full Name</label>
                          <input
                            type="text"
                            value={member.name}
                            onChange={(e) => handleUpdateMember(member.id, { name: e.target.value })}
                            className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#71717A]">Role / Job Title</label>
                          <input
                            type="text"
                            value={member.role}
                            onChange={(e) => handleUpdateMember(member.id, { role: e.target.value })}
                            className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#71717A]">Photo Image URL</label>
                          <input
                            type="text"
                            value={typeof member.photo === "string" ? member.photo : ""}
                            onChange={(e) => handleUpdateMember(member.id, { photo: e.target.value })}
                            className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-[#71717A]">Short Bio</label>
                          <textarea
                            rows={2}
                            value={member.bio || ""}
                            onChange={(e) => handleUpdateMember(member.id, { bio: e.target.value })}
                            className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[10px] text-[#71717A]">LinkedIn URL</label>
                            <input
                              type="text"
                              value={member.linkedin || ""}
                              onChange={(e) => handleUpdateMember(member.id, { linkedin: e.target.value })}
                              placeholder="https://..."
                              className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                            />
                          </div>
                          <div>
                            <label className="text-[10px] text-[#71717A]">Twitter URL</label>
                            <input
                              type="text"
                              value={member.twitter || ""}
                              onChange={(e) => handleUpdateMember(member.id, { twitter: e.target.value })}
                              placeholder="https://..."
                              className="mt-1 w-full rounded border border-[#27272A] bg-[#18181B] px-2 py-1 text-xs text-[#FAFAFA] outline-none"
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Columns (for static mode) */}
          {currentMode === "static" && (
            <div className="space-y-2 rounded-lg border border-[#27272A] bg-[#18181B] p-3">
              <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Grid Columns</span>
              <div className="flex gap-2">
                {[2, 3, 4].map((cols) => (
                  <button
                    key={cols}
                    type="button"
                    onClick={() => updateStyle({ desktopColumns: cols })}
                    className={`flex-1 rounded py-1.5 font-semibold text-xs transition ${
                      teamData.style.desktopColumns === cols ? "bg-[#FACC15] text-[#111111]" : "bg-[#27272A] text-[#A1A1AA] hover:text-[#FAFAFA]"
                    }`}
                  >
                    {cols} Cols
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Carousel Settings */}
          {currentMode === "carousel" && (
            <div className="space-y-2.5 rounded-lg border border-[#27272A] bg-[#18181B] p-3">
              <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Slider Options</span>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={teamData.style.autoplay ?? false}
                  onChange={(e) => updateStyle({ autoplay: e.target.checked })}
                  className="rounded text-[#FACC15]"
                />
                <span>Enable Autoplay</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={teamData.style.loop !== false}
                  onChange={(e) => updateStyle({ loop: e.target.checked })}
                  className="rounded text-[#FACC15]"
                />
                <span>Infinite Loop</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={teamData.style.showArrows !== false}
                  onChange={(e) => updateStyle({ showArrows: e.target.checked })}
                  className="rounded text-[#FACC15]"
                />
                <span>Show Navigation Arrows</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={teamData.style.showDots !== false}
                  onChange={(e) => updateStyle({ showDots: e.target.checked })}
                  className="rounded text-[#FACC15]"
                />
                <span>Show Pagination Dots</span>
              </label>
            </div>
          )}

          {/* Color & Card Styling */}
          <div className="space-y-3 rounded-lg border border-[#27272A] bg-[#18181B] p-3">
            <span className="text-[11px] font-semibold text-[#A1A1AA] uppercase">Colors & Appearance</span>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] text-[#71717A]">Section BG</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={teamData.style.backgroundColor || "#ffffff"}
                    onChange={(e) => updateStyle({ backgroundColor: e.target.value })}
                    className="h-6 w-7 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono">{teamData.style.backgroundColor}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[#71717A]">Card BG</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={teamData.style.cardBackgroundColor || "#f8fafc"}
                    onChange={(e) => updateStyle({ cardBackgroundColor: e.target.value })}
                    className="h-6 w-7 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono">{teamData.style.cardBackgroundColor}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[#71717A]">Name Color</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={teamData.style.nameColor || "#0f172a"}
                    onChange={(e) => updateStyle({ nameColor: e.target.value })}
                    className="h-6 w-7 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono">{teamData.style.nameColor}</span>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-[#71717A]">Role Color</label>
                <div className="flex items-center gap-2 mt-1">
                  <input
                    type="color"
                    value={teamData.style.roleColor || "#d97706"}
                    onChange={(e) => updateStyle({ roleColor: e.target.value })}
                    className="h-6 w-7 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <span className="text-[11px] font-mono">{teamData.style.roleColor}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
