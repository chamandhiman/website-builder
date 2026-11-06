import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAlignLeft, faAlignCenter, faAlignRight } from "@fortawesome/free-solid-svg-icons";

export interface AlignmentControlProps {
  label?: string;
  value?: "left" | "center" | "right";
  onChange?: (next: "left" | "center" | "right") => void;
}

export function AlignmentControl({ label = "Alignment", value = "left", onChange }: AlignmentControlProps) {
  const choices: Array<{ key: "left" | "center" | "right"; icon: any; label: string }> = [
    { key: "left", icon: faAlignLeft, label: "Left" },
    { key: "center", icon: faAlignCenter, label: "Center" },
    { key: "right", icon: faAlignRight, label: "Right" },
  ];

  return (
    <label className="flex flex-col gap-1.5 text-sm text-[#000000]">
      <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#64748B]">{label}</span>
      <div className="flex items-center gap-2">
        {choices.map((c) => {
          const active = value === c.key;
          return (
            <button
              key={c.key}
              type="button"
              aria-label={c.label}
              onClick={() => onChange?.(c.key)}
              className={`flex h-8 w-8 items-center justify-center rounded border transition ${
                active
                  ? "border-[#7137D8] bg-[#FACC15]/10 text-[#7137D8]"
                  : "border-[#CBD5E1] bg-white text-[#000000] font-bold hover:bg-[#F1F5F9] hover:text-[#000000]"
              }`}
            >
              <FontAwesomeIcon icon={c.icon} className="h-3.5 w-3.5" />
            </button>
          );
        })}
      </div>
    </label>
  );
}
