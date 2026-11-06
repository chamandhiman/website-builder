import { normalizeFontSizeToPx } from "@/components/builder/widgets/fontSize";

export interface FontSizeControlProps {
  label?: string;
  value?: string | number | null;
  onChange: (next: string) => void;
  allowEmpty?: boolean;
  placeholder?: string;
}

export function FontSizeControl({
  label = "Font Size",
  value,
  onChange,
  allowEmpty = true,
  placeholder = "Inherit",
}: FontSizeControlProps) {
  const normalized = normalizeFontSizeToPx(value);
  const numericValue = normalized ? String(Number.parseInt(normalized, 10)) : "";

  return (
    <div className="space-y-1">
      <label className="text-[11px] font-medium text-[#000000] font-bold">{label}</label>
      <input
        type="number"
        inputMode="numeric"
        min={1}
        step={1}
        value={numericValue}
        placeholder={placeholder}
        onChange={(event) => {
          const next = event.target.value.trim();
          if (!next) {
            if (allowEmpty) onChange("");
            return;
          }
          const parsed = Number(next);
          if (!Number.isFinite(parsed) || parsed <= 0) return;
          onChange(Math.round(parsed) + "px");
        }}
        className="h-8 w-full rounded-md border border-[#CBD5E1] bg-white px-2.5 text-[13px] text-[#000000] outline-none transition focus:border-[#7137D8] focus:ring-1 focus:ring-[#7137D8]/20"
      />
    </div>
  );
}
