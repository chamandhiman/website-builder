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
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#707070]">{label}</div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setDevice("desktop")}
            className={`rounded-md p-1.5 transition ${
              device === "desktop"
                ? "border border-[#FACC15] bg-[#FACC15]/10 text-[#FACC15]"
                : "border border-transparent text-[#707070] hover:bg-[#252525] hover:text-[#D0D0D0]"
            }`}
          >
            <FontAwesomeIcon icon={faDesktop} className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("tablet")}
            className={`rounded-md p-1.5 transition ${
              device === "tablet"
                ? "border border-[#FACC15] bg-[#FACC15]/10 text-[#FACC15]"
                : "border border-transparent text-[#707070] hover:bg-[#252525] hover:text-[#D0D0D0]"
            }`}
          >
            <FontAwesomeIcon icon={faTablet} className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setDevice("mobile")}
            className={`rounded-md p-1.5 transition ${
              device === "mobile"
                ? "border border-[#FACC15] bg-[#FACC15]/10 text-[#FACC15]"
                : "border border-transparent text-[#707070] hover:bg-[#252525] hover:text-[#D0D0D0]"
            }`}
          >
            <FontAwesomeIcon icon={faMobile} className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div>
          <input
            className={`h-9 w-full min-w-0 rounded-md border px-2 text-[13px] text-[#F5F5F5] outline-none transition focus:border-[#FACC15] ${
              inherited ? "border-dashed border-[#404040] bg-[#161616]" : "border-[#363636] bg-[#171717]"
            }`}
            value={String(activeValue.top)}
            onChange={(e) => handleChangeSide("top", e.target.value)}
          />
          <div className="mt-1 text-[11px] text-[#707070]">Top</div>
        </div>
        <div>
          <input
            className={`h-9 w-full min-w-0 rounded-md border px-2 text-[13px] text-[#F5F5F5] outline-none transition focus:border-[#FACC15] ${
              inherited ? "border-dashed border-[#404040] bg-[#161616]" : "border-[#363636] bg-[#171717]"
            }`}
            value={String(activeValue.right)}
            onChange={(e) => handleChangeSide("right", e.target.value)}
          />
          <div className="mt-1 text-[11px] text-[#707070]">Right</div>
        </div>
        <div>
          <input
            className={`h-9 w-full min-w-0 rounded-md border px-2 text-[13px] text-[#F5F5F5] outline-none transition focus:border-[#FACC15] ${
              inherited ? "border-dashed border-[#404040] bg-[#161616]" : "border-[#363636] bg-[#171717]"
            }`}
            value={String(activeValue.bottom)}
            onChange={(e) => handleChangeSide("bottom", e.target.value)}
          />
          <div className="mt-1 text-[11px] text-[#707070]">Bottom</div>
        </div>
        <div>
          <input
            className={`h-9 w-full min-w-0 rounded-md border px-2 text-[13px] text-[#F5F5F5] outline-none transition focus:border-[#FACC15] ${
              inherited ? "border-dashed border-[#404040] bg-[#161616]" : "border-[#363636] bg-[#171717]"
            }`}
            value={String(activeValue.left)}
            onChange={(e) => handleChangeSide("left", e.target.value)}
          />
          <div className="mt-1 text-[11px] text-[#707070]">Left</div>
        </div>
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-2">
        <select
          value={activeValue.unit}
          onChange={(e) => handleUnitChange(e.target.value)}
          className="h-9 min-w-[84px] rounded-md border border-[#363636] bg-[#171717] px-2 text-[13px] text-[#F5F5F5] outline-none focus:border-[#FACC15]"
        >
          <option value="px">px</option>
          <option value="rem">rem</option>
          <option value="%">%</option>
        </select>
        <button
          type="button"
          onClick={() => setLinked((s) => !s)}
          className="inline-flex h-9 items-center justify-center rounded-md border border-[#363636] bg-[#1F1F1F] p-2 text-[#969696] transition hover:bg-[#282828] hover:text-[#D0D0D0]"
        >
          <FontAwesomeIcon icon={linked ? faLink : faLinkSlash} className="h-4 w-4" />
        </button>
      </div>
      {inherited ? <div className="mt-2 text-[11px] text-[#888888]">Inherited from the previous breakpoint.</div> : null}
    </div>
  );
}
