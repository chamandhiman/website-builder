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
  defaultMapWidgetData,
  isMapWidgetData,
  extractMapSrc,
  type MapWidgetData,
} from "./MapTypes";

const VARIANT_OPTIONS = [
  { label: "Full Width Clean", value: "Full Width Clean" },
  { label: "Split with Card", value: "Split with Card" },
  { label: "Dark Mode Map", value: "Dark Mode Map" },
  { label: "Rounded Boxed", value: "Rounded Boxed" },
];

const FILTER_OPTIONS = [
  { label: "Standard / Default", value: "none" },
  { label: "Modern Grayscale", value: "grayscale" },
  { label: "Dark Mode / Inverted", value: "dark" },
  { label: "High Contrast", value: "contrast" },
];

const CARD_POSITIONS = [
  { label: "Bottom Left", value: "bottom-left" },
  { label: "Bottom Right", value: "bottom-right" },
  { label: "Top Left", value: "top-left" },
  { label: "Top Right", value: "top-right" },
];

function toPx(v: unknown, fallback: number): number {
  const s = String(v ?? "").replace("px", "");
  const n = Number(s);
  return Number.isFinite(n) ? n : fallback;
}

export function MapProperties({
  value = defaultMapWidgetData,
  onChange,
  onClose,
}: {
  value: WidgetData;
  onChange: (next: WidgetData) => void;
  onClose?: () => void;
}) {
  const d: MapWidgetData = isMapWidgetData(value) ? value : defaultMapWidgetData;
  const isCardVisible = d.content.showCard === true || (d.content.showCard !== false && d.variant === "Split with Card");

  const setContent = (patch: Partial<MapWidgetData["content"]>) =>
    onChange({ ...d, content: { ...d.content, ...patch } });
  const setStyle = (patch: Partial<MapWidgetData["style"]>) =>
    onChange({ ...d, style: { ...d.style, ...patch } });
  const setLayout = (patch: Partial<MapWidgetData["layout"]>) =>
    onChange({ ...d, layout: { ...d.layout, ...patch } });
  const setResponsive = (patch: Partial<MapWidgetData["responsive"]>) =>
    onChange({ ...d, responsive: { ...d.responsive, ...patch } });
  const setAdvanced = (patch: Partial<MapWidgetData["advanced"]>) =>
    onChange({ ...d, advanced: { ...d.advanced, ...patch } });

  const labelClass = "text-xs font-medium text-[#707070] uppercase tracking-wide";
  const sectionClass = "space-y-3 border-t border-[#2A2A2A] pt-3 mt-3";

  const handleEmbedChange = (embedCode: string) => {
    const mapUrl = extractMapSrc(embedCode);
    setContent({ embedCode, mapUrl });
  };

  return (
    <PropertyPanel title="Google Map" icon={null} onClose={onClose}>
      {/* ── Variant ── */}
      <div className="space-y-3 px-3 py-3">
        <div className={labelClass}>Variant</div>
        <SelectControl
          value={d.variant}
          options={VARIANT_OPTIONS}
          onChange={(v) => {
            const nextVariant = v as MapWidgetData["variant"];
            const nextStyle = { ...d.style };
            if (nextVariant === "Dark Mode Map") {
              nextStyle.filter = "dark";
            }
            onChange({ ...d, variant: nextVariant, style: nextStyle });
          }}
        />
      </div>

      {/* ── Google Map Embed Code ── */}
      <div className={`${sectionClass} px-3`}>
        <div className={labelClass}>Google Map Embed</div>
        <div className="text-[11px] text-[#909090] leading-relaxed">
          Paste the <code className="text-[#FACC15] bg-[#222] px-1 py-0.5 rounded">&lt;iframe&gt;</code> embed HTML or link copied from Google Maps:
        </div>
        <TextAreaControl
          label="Embed Code or URL"
          value={String(d.content.embedCode ?? "")}
          onChange={handleEmbedChange}
        />
        <div className="rounded-md border border-[#333] bg-[#161616] p-2.5 text-[11px] text-[#808080] space-y-1">
          <div className="font-semibold text-[#FACC15]">💡 How to get Google Map code:</div>
          <div>1. Search your place on Google Maps.</div>
          <div>2. Click <strong>Share</strong> &rarr; <strong>Embed a map</strong>.</div>
          <div>3. Click <strong>COPY HTML</strong> and paste it here.</div>
        </div>
      </div>

      {/* ── Map Dimensions & Style ── */}
      <div className={`${sectionClass} px-3`}>
        <div className={labelClass}>Map Display</div>
        <NumberControl
          label="Map Height (px)"
          value={toPx(d.content.height, 480)}
          onChange={(v) => setContent({ height: `${v}px` })}
          min={200}
          max={900}
        />
        <SelectControl
          label="Visual Filter"
          value={String(d.style.filter ?? "none")}
          options={FILTER_OPTIONS}
          onChange={(v) => setStyle({ filter: v as MapWidgetData["style"]["filter"] })}
        />
      </div>

      {/* ── Location Info Card ── */}
      <div className={`${sectionClass} px-3`}>
        <div className="flex items-center justify-between">
          <div className={labelClass}>Location Info Card</div>
          {isCardVisible && (
            <button
              type="button"
              onClick={() => setContent({ showCard: false })}
              className="text-[11px] text-red-400 hover:text-red-300 transition"
            >
              Hide Card
            </button>
          )}
        </div>
        <ToggleControl
          label="Show Address Card on Map"
          value={isCardVisible}
          onChange={(v) => setContent({ showCard: v })}
        />

        {isCardVisible && (
          <div className="space-y-3 mt-3">
            <ToggleControl
              label="Show Address on Map"
              value={d.content.showAddress !== false}
              onChange={(v) => setContent({ showAddress: v })}
            />
            {d.content.showAddress !== false && (
              <TextControl
                label="Address Text"
                value={String(d.content.cardAddress ?? "")}
                onChange={(v) => setContent({ cardAddress: v })}
              />
            )}

            <ToggleControl
              label="Show Phone"
              value={d.content.showPhone !== false}
              onChange={(v) => setContent({ showPhone: v })}
            />
            {d.content.showPhone !== false && (
              <TextControl
                label="Phone Number"
                value={String(d.content.cardPhone ?? "")}
                onChange={(v) => setContent({ cardPhone: v })}
              />
            )}

            <ToggleControl
              label="Show Working Hours"
              value={d.content.showHours !== false}
              onChange={(v) => setContent({ showHours: v })}
            />
            {d.content.showHours !== false && (
              <TextControl
                label="Working Hours"
                value={String(d.content.cardHours ?? "")}
                onChange={(v) => setContent({ cardHours: v })}
              />
            )}

            <ToggleControl
              label="Show Directions Button"
              value={d.content.showButton !== false}
              onChange={(v) => setContent({ showButton: v })}
            />
            {d.content.showButton !== false && (
              <>
                <TextControl
                  label="Button Text"
                  value={String(d.content.cardButtonText ?? "")}
                  onChange={(v) => setContent({ cardButtonText: v })}
                />
                <TextControl
                  label="Directions Link URL"
                  value={String(d.content.cardButtonUrl ?? "")}
                  onChange={(v) => setContent({ cardButtonUrl: v })}
                />
              </>
            )}

            <SelectControl
              label="Card Position"
              value={String(d.content.cardPosition ?? "bottom-left")}
              options={CARD_POSITIONS}
              onChange={(v) => setContent({ cardPosition: v as any })}
            />
            <TextControl
              label="Title"
              value={String(d.content.cardTitle ?? "")}
              onChange={(v) => setContent({ cardTitle: v })}
            />
            <ColorControl
              label="Card Background"
              value={String(d.style.cardBg ?? "rgba(255, 255, 255, 0.95)")}
              onChange={(v) => setStyle({ cardBg: v })}
            />
            <ColorControl
              label="Card Text Color"
              value={String(d.style.cardTextColor ?? "#111827")}
              onChange={(v) => setStyle({ cardTextColor: v })}
            />
            <ColorControl
              label="Accent / Button Color"
              value={String(d.style.cardAccentColor ?? "#FACC15")}
              onChange={(v) => setStyle({ cardAccentColor: v })}
            />
          </div>
        )}
      </div>

      {/* ── Spacing ── */}
      <div className={`${sectionClass} px-3`}>
        <div className={labelClass}>Spacing</div>
        <NumberControl
          label="Padding Top (px)"
          value={toPx(d.layout.paddingTop, 0)}
          onChange={(v) => setLayout({ paddingTop: `${v}px` })}
          min={0}
          max={150}
        />
        <NumberControl
          label="Padding Bottom (px)"
          value={toPx(d.layout.paddingBottom, 0)}
          onChange={(v) => setLayout({ paddingBottom: `${v}px` })}
          min={0}
          max={150}
        />
      </div>

      {/* ── Responsive ── */}
      <div className={`${sectionClass} px-3`}>
        <div className={labelClass}>Responsive</div>
        <ToggleControl
          label="Hide on Mobile"
          value={Boolean(d.responsive.hideOnMobile)}
          onChange={(v) => setResponsive({ hideOnMobile: v })}
        />
        <ToggleControl
          label="Hide on Tablet"
          value={Boolean(d.responsive.hideOnTablet)}
          onChange={(v) => setResponsive({ hideOnTablet: v })}
        />
        <ToggleControl
          label="Hide on Desktop"
          value={Boolean(d.responsive.hideOnDesktop)}
          onChange={(v) => setResponsive({ hideOnDesktop: v })}
        />
      </div>

      {/* ── Advanced ── */}
      <div className={`${sectionClass} px-3 pb-4`}>
        <div className={labelClass}>Advanced</div>
        <TextControl
          label="Custom ID"
          value={String(d.advanced.id ?? "")}
          onChange={(v) => setAdvanced({ id: v })}
        />
        <TextControl
          label="Custom Class"
          value={String(d.advanced.className ?? "")}
          onChange={(v) => setAdvanced({ className: v })}
        />
        <ToggleControl
          label="Visible"
          value={d.advanced.visibility !== false}
          onChange={(v) => setAdvanced({ visibility: v })}
        />
      </div>
    </PropertyPanel>
  );
}
