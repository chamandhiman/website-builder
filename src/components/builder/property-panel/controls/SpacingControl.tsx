import React, { useEffect, useMemo, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDesktop, faTablet, faMobile, faLink, faLinkSlash } from "@fortawesome/free-solid-svg-icons";
import { createSpacingOverride, getSpacingValueForDevice, hasSpacingValueForDevice, parseSpacingValue, type SpacingDevice, type SpacingValue } from "@/components/builder/widgets/spacing";

export interface SpacingControlProps {
  label?: string;
  value?: string | Record<string, unknown> | null;
  onChange?: (value: unknown) => void;
}

function getDefaultSpacingValue(): SpacingValue {
  return { top: 0, right: 0, bottom: 0, left: 0, unit: "px" };
}

export function SpacingControl({ label = "Spacing", value = "0px", onChange }: SpacingControlProps) {
  const [device, setDevice] = useState<SpacingDevice>("desktop");
  const [linked, setLinked] = useState(true);
  const [deviceValues, setDeviceValues] = useState<Record<SpacingDevice, SpacingValue>>({
    desktop: getDefaultSpacingValue(),
    tablet: getDefaultSpacingValue(),
    mobile: getDefaultSpacingValue(),
  });

  const parsedValue = useMemo(() => parseSpacingValue(value), [value]);
  const inherited = !hasSpacingValueForDevice(value, device);
  const activeValue = deviceValues[device] ?? getDefaultSpacingValue();

  useEffect(() => {
    setDeviceValues({
      desktop: getSpacingValueForDevice(value, "desktop"),
      tablet: getSpacingValueForDevice(value, "tablet"),
      mobile: getSpacingValueForDevice(value, "mobile"),
    });
  }, [value]);

  function emit(nextSpacing: SpacingValue) {
    const nextValue = linked
      ? {
          ...parsedValue,
          desktop: nextSpacing,
          tablet: nextSpacing,
          mobile: nextSpacing,
        }
      : createSpacingOverride(value, device, nextSpacing);
    onChange?.(nextValue);
  }

  function handleChangeSide(side: "top" | "right" | "bottom" | "left", rawValue: string) {
    const num = Number(rawValue || 0);
    const nextSpacing = { ...activeValue, [side]: num };
    setDeviceValues((prev) => ({ ...prev, [device]: nextSpacing }));
    emit(nextSpacing);
  }

  function handleUnitChange(nextUnit: string) {
    const nextSpacing = { ...activeValue, unit: nextUnit };
    setDeviceValues((prev) => ({ ...prev, [device]: nextSpacing }));
    emit(nextSpacing);
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#64748B]">{label}</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`rounded-md p-1.5 transition ${
              device === "desktop"
                ? "border border-[#7137D8] bg-[#FACC15]/10 text-[#7137D8]"
                : "border border-transparent text-[#64748B] hover:bg-[#252525] hover:text-[#000000]"
            }`}
          >
            <FontAwesomeIcon icon={faDesktop} className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`rounded-md p-1.5 transition ${
              device === "tablet"
                ? "border border-[#7137D8] bg-[#FACC15]/10 text-[#7137D8]"
                : "border border-transparent text-[#64748B] hover:bg-[#252525] hover:text-[#000000]"
            }`}
          >
            <FontAwesomeIcon icon={faTablet} className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`rounded-md p-1.5 transition ${
              device === "mobile"
                ? "border border-[#7137D8] bg-[#FACC15]/10 text-[#7137D8]"
                : "border border-transparent text-[#64748B] hover:bg-[#252525] hover:text-[#000000]"
            }`}
          >
            <FontAwesomeIcon icon={faMobile} className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div>
          <input
            className={`h-9 w-full min-w-0 rounded-md border px-2 text-[13px] text-[#000000] outline-none transition focus:border-[#7137D8] ${
              inherited ? "border-dashed border-[#404040] bg-[#161616]" : "border-[#CBD5E1] bg-white"
            }`}
            value={String(activeValue.top)}
            onChange={(e) => handleChangeSide("top", e.target.value)}
          />
          <div className="mt-1 text-[11px] text-[#64748B]">Top</div>
        </div>
        <div>
          <input
            className={`h-9 w-full min-w-0 rounded-md border px-2 text-[13px] text-[#000000] outline-none transition focus:border-[#7137D8] ${
              inherited ? "border-dashed border-[#404040] bg-[#161616]" : "border-[#CBD5E1] bg-white"
            }`}
            value={String(activeValue.right)}
            onChange={(e) => handleChangeSide("right", e.target.value)}
          />
          <div className="mt-1 text-[11px] text-[#64748B]">Right</div>
        </div>
        <div>
          <input
            className={`h-9 w-full min-w-0 rounded-md border px-2 text-[13px] text-[#000000] outline-none transition focus:border-[#7137D8] ${
              inherited ? "border-dashed border-[#404040] bg-[#161616]" : "border-[#CBD5E1] bg-white"
            }`}
            value={String(activeValue.bottom)}
            onChange={(e) => handleChangeSide("bottom", e.target.value)}
          />
          <div className="mt-1 text-[11px] text-[#64748B]">Bottom</div>
        </div>
        <div>
          <input
            className={`h-9 w-full min-w-0 rounded-md border px-2 text-[13px] text-[#000000] outline-none transition focus:border-[#7137D8] ${
              inherited ? "border-dashed border-[#404040] bg-[#161616]" : "border-[#CBD5E1] bg-white"
            }`}
            value={String(activeValue.left)}
            onChange={(e) => handleChangeSide("left", e.target.value)}
          />
          <div className="mt-1 text-[11px] text-[#64748B]">Left</div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <select
          value={activeValue.unit}
          onChange={(e) => handleUnitChange(e.target.value)}
          className="h-9 min-w-[84px] rounded-md border border-[#CBD5E1] bg-white px-2 text-[13px] text-[#000000] outline-none focus:border-[#7137D8]"
        >
          <option value="px">px</option>
          <option value="rem">rem</option>
          <option value="%">%</option>
        </select>
        <button
          type="button"
          onClick={() => setLinked((s) => !s)}
          className="inline-flex h-9 items-center justify-center rounded-md border border-[#CBD5E1] bg-white p-2 text-[#000000] font-bold transition hover:bg-[#F1F5F9] hover:text-[#000000]"
        >
          <FontAwesomeIcon icon={linked ? faLink : faLinkSlash} className="h-4 w-4" />
        </button>
      </div>
      {inherited ? <div className="mt-2 text-[11px] text-[#888888]">Inherited from the previous breakpoint.</div> : null}
    </div>
  );
}
