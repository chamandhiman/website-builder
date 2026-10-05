import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faArrowUp, faArrowDown } from "@fortawesome/free-solid-svg-icons";
import { PropertyPanel } from "@/components/builder/property-panel/PropertyPanel";
import {
  ColorControl,
  NumberControl,
  SelectControl,
  TextControl,
  TextAreaControl,
  ToggleControl,
} from "@/components/builder/property-controls";
import type { WidgetData } from "../widgetRegistry";
import {
  defaultContactWidgetData,
  isContactWidgetData,
  type ContactWidgetData,
  type ContactInfoItem,
} from "./ContactTypes";

const ICON_OPTIONS = [
  { label: "Map Pin", value: "map-pin" },
  { label: "Phone", value: "phone" },
  { label: "Mail", value: "mail" },
  { label: "Clock", value: "clock" },
];

const VARIANT_OPTIONS = [
  { label: "Split Info + Form", value: "Split Info + Form" },
  { label: "Centered Form", value: "Centered Form" },
  { label: "Dark Side-by-Side", value: "Dark Side-by-Side" },
  { label: "Minimal Card", value: "Minimal Card" },
];

function toPx(v: unknown, fallback: number): number {
  const s = String(v ?? "").replace("px", "");
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}

export function ContactProperties({
  value = defaultContactWidgetData,
  onChange,
  onClose,
}: {
  value: WidgetData;
  onChange: (next: WidgetData) => void;
  onClose?: () => void;
}) {
  const d: ContactWidgetData = isContactWidgetData(value) ? value : defaultContactWidgetData;
  const [selectedItemIdx, setSelectedItemIdx] = useState(0);

  const setContent = (patch: Partial<ContactWidgetData["content"]>) =>
    onChange({ ...d, content: { ...d.content, ...patch } });
  const setStyle = (patch: Partial<ContactWidgetData["style"]>) =>
    onChange({ ...d, style: { ...d.style, ...patch } });
  const setLayout = (patch: Partial<ContactWidgetData["layout"]>) =>
    onChange({ ...d, layout: { ...d.layout, ...patch } });
  const setResponsive = (patch: Partial<ContactWidgetData["responsive"]>) =>
    onChange({ ...d, responsive: { ...d.responsive, ...patch } });
  const setAdvanced = (patch: Partial<ContactWidgetData["advanced"]>) =>
    onChange({ ...d, advanced: { ...d.advanced, ...patch } });

  const items: ContactInfoItem[] = Array.isArray(d.content.infoItems) ? (d.content.infoItems as ContactInfoItem[]) : [];
  const dropdownOptions: string[] = Array.isArray(d.content.dropdownOptions) ? (d.content.dropdownOptions as string[]) : [];

  const setItem = (idx: number, patch: Partial<ContactInfoItem>) => {
    const next = items.map((it, i) => (i === idx ? { ...it, ...patch } : it));
    setContent({ infoItems: next });
  };
  const addItem = () => {
    const next = [...items, { icon: "mail" as const, label: "New Contact", value: "contact@example.com" }];
    setContent({ infoItems: next });
    setSelectedItemIdx(next.length - 1);
  };
  const removeItem = (idx: number) => {
    const next = items.filter((_, i) => i !== idx);
    setContent({ infoItems: next });
    setSelectedItemIdx(Math.max(0, idx - 1));
  };
  const moveItem = (idx: number, dir: -1 | 1) => {
    const next = [...items];
    const target = idx + dir;
    if (target < 0 || target >= next.length) return;
    [next[idx], next[target]] = [next[target], next[idx]];
    setContent({ infoItems: next });
    setSelectedItemIdx(target);
  };

  const selItem = items[selectedItemIdx];

  const labelClass = "text-xs font-medium text-[#707070] uppercase tracking-wide";
  const sectionClass = "space-y-3 border-t border-[#2A2A2A] pt-3 mt-3";

  return (
    <PropertyPanel title="Contact" icon={null} onClose={onClose}>
      {/* ── Variant ── */}
      <div className="space-y-3 px-3 py-3">
        <div className={labelClass}>Variant</div>
        <SelectControl
          value={d.variant}
          options={VARIANT_OPTIONS}
          onChange={(v) => onChange({ ...d, variant: v })}
        />
      </div>

      {/* ── Header Content ── */}
      <div className={`${sectionClass} px-3`}>
        <div className={labelClass}>Header</div>
        <ToggleControl label="Show Eyebrow" value={Boolean(d.content.showEyebrow)} onChange={(v) => setContent({ showEyebrow: v })} />
        {d.content.showEyebrow && (
          <TextControl label="Eyebrow" value={String(d.content.eyebrow ?? "")} onChange={(v) => setContent({ eyebrow: v })} />
        )}
        <TextControl label="Heading" value={String(d.content.heading ?? "")} onChange={(v) => setContent({ heading: v })} />
        <TextAreaControl label="Description" value={String(d.content.description ?? "")} onChange={(v) => setContent({ description: v })} />
      </div>

      {/* ── Info Items ── */}
      <div className={`${sectionClass} px-3`}>
        <div className="flex items-center justify-between">
          <div className={labelClass}>Contact Info Items</div>
          <button
            type="button"
            onClick={addItem}
            className="inline-flex items-center gap-1 rounded-md bg-[#2A2A2A] px-2 py-1 text-[10px] text-[#D0D0D0] hover:bg-[#363636]"
          >
            <FontAwesomeIcon icon={faPlus} className="h-2.5 w-2.5" /> Add
          </button>
        </div>
        <ToggleControl label="Show Info Items" value={Boolean(d.content.showInfoItems)} onChange={(v) => setContent({ showInfoItems: v })} />

        {/* Item tabs */}
        <div className="flex flex-wrap gap-1">
          {items.map((item, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setSelectedItemIdx(idx)}
              className={`rounded-md px-2.5 py-1 text-xs transition ${idx === selectedItemIdx ? "bg-[#FACC15] text-[#111]" : "bg-[#2A2A2A] text-[#D0D0D0] hover:bg-[#363636]"}`}
            >
              {item.label || `Item ${idx + 1}`}
            </button>
          ))}
        </div>

        {/* Selected item editor */}
        {selItem && (
          <div className="space-y-2 rounded-lg border border-[#363636] bg-[#1A1A1A] p-3">
            <div className="flex items-center justify-between">
              <span className="text-xs text-[#969696]">Item {selectedItemIdx + 1}</span>
              <div className="flex gap-1">
                <button type="button" onClick={() => moveItem(selectedItemIdx, -1)} className="p-1 text-[#707070] hover:text-[#D0D0D0]"><FontAwesomeIcon icon={faArrowUp} className="h-3 w-3" /></button>
                <button type="button" onClick={() => moveItem(selectedItemIdx, 1)} className="p-1 text-[#707070] hover:text-[#D0D0D0]"><FontAwesomeIcon icon={faArrowDown} className="h-3 w-3" /></button>
                <button type="button" onClick={() => removeItem(selectedItemIdx)} disabled={items.length <= 1} className="p-1 text-[#EF4444] hover:text-red-400 disabled:opacity-30"><FontAwesomeIcon icon={faTrash} className="h-3 w-3" /></button>
              </div>
            </div>
            <SelectControl label="Icon" value={selItem.icon} options={ICON_OPTIONS} onChange={(v) => setItem(selectedItemIdx, { icon: v as ContactInfoItem["icon"] })} />
            <TextControl label="Label" value={selItem.label} onChange={(v) => setItem(selectedItemIdx, { label: v })} />
            <TextControl label="Value" value={selItem.value} onChange={(v) => setItem(selectedItemIdx, { value: v })} />
          </div>
        )}
      </div>

      {/* ── Form Settings ── */}
      <div className={`${sectionClass} px-3`}>
        <div className={labelClass}>Form Configuration</div>
        <SelectControl
          label="Form Mode"
          value={String(d.content.formType ?? "standard")}
          options={[
            { label: "Built-in Contact Form", value: "standard" },
            { label: "Custom Embed (Jotform / Third-Party)", value: "custom_embed" },
          ]}
          onChange={(v) => setContent({ formType: v as any })}
        />

        {d.content.formType === "custom_embed" ? (
          <div className="space-y-3 mt-2">
            <div className="text-[11px] text-[#909090] leading-relaxed">
              Paste the <code className="text-[#FACC15] bg-[#222] px-1 py-0.5 rounded">&lt;iframe&gt;</code>, script, or form URL from Jotform, Typeform, etc.:
            </div>
            <TextAreaControl
              label="Embed Code or Form URL"
              value={String(d.content.customEmbedCode ?? "")}
              onChange={(v) => setContent({ customEmbedCode: v })}
            />
            <NumberControl
              label="Form Height (px)"
              value={toPx(d.content.customEmbedHeight, 520)}
              onChange={(v) => setContent({ customEmbedHeight: `${v}px` })}
              min={250}
              max={1200}
            />
            <div className="rounded-md border border-[#333] bg-[#161616] p-2.5 text-[11px] text-[#808080] space-y-1">
              <div className="font-semibold text-[#FACC15]">💡 How to get Jotform code:</div>
              <div>1. Open your form in Jotform.</div>
              <div>2. Click <strong>Publish</strong> &rarr; <strong>Embed</strong> (or <strong>Iframe</strong>).</div>
              <div>3. Click <strong>Copy Code</strong> and paste it here.</div>
            </div>
          </div>
        ) : (
          <>
            <TextControl label="Form Title" value={String(d.content.formTitle ?? "")} onChange={(v) => setContent({ formTitle: v })} />
            <TextAreaControl label="Form Subtitle" value={String(d.content.formSubtitle ?? "")} onChange={(v) => setContent({ formSubtitle: v })} />
            <ToggleControl label="Name Field" value={Boolean(d.content.showNameField)} onChange={(v) => setContent({ showNameField: v })} />
            <ToggleControl label="Email Field" value={Boolean(d.content.showEmailField)} onChange={(v) => setContent({ showEmailField: v })} />
            <ToggleControl label="Phone Field" value={Boolean(d.content.showPhoneField)} onChange={(v) => setContent({ showPhoneField: v })} />
            <ToggleControl label="Dropdown Field" value={Boolean(d.content.showDropdown)} onChange={(v) => setContent({ showDropdown: v })} />
            {d.content.showDropdown && (
              <>
                <TextControl label="Dropdown Label" value={String(d.content.dropdownLabel ?? "")} onChange={(v) => setContent({ dropdownLabel: v })} />
                <div>
                  <div className="mb-1 text-xs text-[#707070]">Options (one per line)</div>
                  <TextAreaControl
                    label=""
                    value={dropdownOptions.join("\n")}
                    onChange={(v) => setContent({ dropdownOptions: v.split("\n").map((s) => s.trim()).filter(Boolean) })}
                  />
                </div>
              </>
            )}
            <ToggleControl label="Message Field" value={Boolean(d.content.showMessageField)} onChange={(v) => setContent({ showMessageField: v })} />
            <TextControl label="Submit Button Label" value={String(d.content.submitLabel ?? "")} onChange={(v) => setContent({ submitLabel: v })} />
          </>
        )}
      </div>

      {/* ── Colors ── */}
      <div className={`${sectionClass} px-3`}>
        <div className={labelClass}>Colors</div>
        <ColorControl label="Section Background" value={String(d.style.backgroundColor ?? "#ffffff")} onChange={(v) => setStyle({ backgroundColor: v })} />
        <ColorControl label="Info Background" value={String(d.style.infoBgColor ?? "#ffffff")} onChange={(v) => setStyle({ infoBgColor: v })} />
        <ColorControl label="Form Background" value={String(d.style.formBgColor ?? "#ffffff")} onChange={(v) => setStyle({ formBgColor: v })} />
        <ColorControl label="Eyebrow Color" value={String(d.style.eyebrowColor ?? "#FACC15")} onChange={(v) => setStyle({ eyebrowColor: v })} />
        <ColorControl label="Heading Color" value={String(d.style.headingColor ?? "#111827")} onChange={(v) => setStyle({ headingColor: v })} />
        <ColorControl label="Description Color" value={String(d.style.descriptionColor ?? "#4b5563")} onChange={(v) => setStyle({ descriptionColor: v })} />
        <ColorControl label="Icon Color" value={String(d.style.infoIconColor ?? "#FACC15")} onChange={(v) => setStyle({ infoIconColor: v })} />
        <ColorControl label="Submit Button Color" value={String(d.style.submitBgColor ?? "#FACC15")} onChange={(v) => setStyle({ submitBgColor: v })} />
        <ColorControl label="Submit Text Color" value={String(d.style.submitTextColor ?? "#111111")} onChange={(v) => setStyle({ submitTextColor: v })} />
        <ToggleControl label="Form Shadow" value={Boolean(d.style.formShadow)} onChange={(v) => setStyle({ formShadow: v })} />
      </div>

      {/* ── Layout ── */}
      <div className={`${sectionClass} px-3`}>
        <div className={labelClass}>Layout</div>
        <NumberControl label="Padding Top (px)" value={toPx(d.layout.paddingTop, 80)} onChange={(v) => setLayout({ paddingTop: `${v}px` })} min={0} max={200} />
        <NumberControl label="Padding Bottom (px)" value={toPx(d.layout.paddingBottom, 80)} onChange={(v) => setLayout({ paddingBottom: `${v}px` })} min={0} max={200} />
        <NumberControl label="Padding X (px)" value={toPx(d.layout.paddingX, 24)} onChange={(v) => setLayout({ paddingX: `${v}px` })} min={0} max={120} />
      </div>

      {/* ── Responsive ── */}
      <div className={`${sectionClass} px-3`}>
        <div className={labelClass}>Responsive</div>
        <ToggleControl label="Hide on Mobile" value={Boolean(d.responsive.hideOnMobile)} onChange={(v) => setResponsive({ hideOnMobile: v })} />
        <ToggleControl label="Hide on Tablet" value={Boolean(d.responsive.hideOnTablet)} onChange={(v) => setResponsive({ hideOnTablet: v })} />
        <ToggleControl label="Hide on Desktop" value={Boolean(d.responsive.hideOnDesktop)} onChange={(v) => setResponsive({ hideOnDesktop: v })} />
      </div>

      {/* ── Advanced ── */}
      <div className={`${sectionClass} px-3 pb-4`}>
        <div className={labelClass}>Advanced</div>
        <TextControl label="Custom ID" value={String(d.advanced.id ?? "")} onChange={(v) => setAdvanced({ id: v })} />
        <TextControl label="Custom Class" value={String(d.advanced.className ?? "")} onChange={(v) => setAdvanced({ className: v })} />
        <ToggleControl label="Visible" value={d.advanced.visibility !== false} onChange={(v) => setAdvanced({ visibility: v })} />
      </div>
    </PropertyPanel>
  );
}
