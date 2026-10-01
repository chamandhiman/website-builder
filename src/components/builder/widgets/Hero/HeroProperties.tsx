import { defaultHeroWidgetData, getVariantDefaultData, isHeroWidgetData } from "./HeroTypes";
import { PropertyPanel } from "@/components/builder/property-panel/PropertyPanel";
import type { WidgetData } from "../widgetRegistry";
import { SelectControl, TextControl, ColorControl, SliderControl, ToggleControl, SpacingControl, AlignmentControl, TextAreaControl, ImageControl } from "@/components/builder/property-controls";
import { BackgroundProperties } from "../BackgroundProperties";
import { SectionWidthProperties } from "../BaseWidget";
import { resolveHeroLayoutMargin, resolveHeroLayoutPadding } from "../spacing";

export interface HeroPropertiesProps {
  value: WidgetData;
  onChange: (nextValue: WidgetData) => void;
  onClose?: () => void;
}

function resolveDefaultStyle(variant: string): Record<string, unknown> {
  const defaults = getVariantDefaultData(variant);
  return defaults.style as Record<string, unknown>;
}

export function HeroProperties({ value = defaultHeroWidgetData, onChange, onClose }: HeroPropertiesProps) {
  const heroValue = isHeroWidgetData(value) ? value : defaultHeroWidgetData;
  const variant = heroValue.variant ?? "Image Background";
  const style = heroValue.style as Record<string, unknown>;
  const layout = heroValue.layout as Record<string, unknown>;
  const defaults = resolveDefaultStyle(variant);

  const updateStyle = (patch: Partial<typeof heroValue.style>) => onChange({ ...heroValue, style: { ...heroValue.style, ...patch } });
  const updateLayout = (patch: Partial<typeof heroValue.layout>) => onChange({ ...heroValue, layout: { ...heroValue.layout, ...patch } });
  const updateResponsive = (patch: Partial<typeof heroValue.responsive>) => onChange({ ...heroValue, responsive: { ...heroValue.responsive, ...patch } });
  const updateAnimation = (patch: Partial<typeof heroValue.animation>) => onChange({ ...heroValue, animation: { ...heroValue.animation, ...patch } });
  const updateAdvanced = (patch: Partial<typeof heroValue.advanced>) => onChange({ ...heroValue, advanced: { ...heroValue.advanced, ...patch } });

  const renderVariantSpecific = () => {
    switch (variant) {
      case "Image Background":
        return (
          <>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-600">
              Select a child element inside the hero to edit its text, button, or image.
              <div className="mt-2 text-[11px] text-slate-500">Use the + Add Element toolbar to add heading, paragraph, button, or image children.</div>
            </div>
            <ImageControl
              label="Background Image"
              value={String(style.backgroundImage || "")}
              onChange={(next) => updateStyle({ backgroundImage: next })}
            />
            <SelectControl
              label="Background Position"
              value={String(style.backgroundPosition || "center")}
              options={[
                { label: "Center", value: "center" },
                { label: "Top", value: "top" },
                { label: "Bottom", value: "bottom" },
                { label: "Left", value: "left" },
                { label: "Right", value: "right" },
                { label: "Top Left", value: "top left" },
                { label: "Top Right", value: "top right" },
                { label: "Bottom Left", value: "bottom left" },
                { label: "Bottom Right", value: "bottom right" },
              ]}
              onChange={(next) => updateStyle({ backgroundPosition: next })}
            />
            <SelectControl
              label="Background Size"
              value={String(style.backgroundSize || "cover")}
              options={[
                { label: "Cover", value: "cover" },
                { label: "Contain", value: "contain" },
                { label: "Auto", value: "auto" },
              ]}
              onChange={(next) => updateStyle({ backgroundSize: next })}
            />
            <ToggleControl label="Overlay Enabled" checked={style.overlayEnabled ?? true} onChange={(next) => updateStyle({ overlayEnabled: next })} />
            <ColorControl label="Overlay Color" value={String(style.overlayColor || "#000000")} onChange={(next) => updateStyle({ overlayColor: next })} />
            <SliderControl label="Overlay Opacity" value={Number(style.overlayOpacity ?? 0.45)} min={0} max={1} step={0.05} onChange={(next) => updateStyle({ overlayOpacity: next })} />
            <SelectControl
              label="Content Alignment"
              value={String(layout.align || "center")}
              options={[
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
              ]}
              onChange={(next) => updateLayout({ align: next })}
            />
            <TextControl label="Content Max Width" value={String(style.contentMaxWidth || "")} onChange={(next) => updateStyle({ contentMaxWidth: next })} />
            <TextControl label="Hero Min Height" value={String(style.heroMinHeight || "560px")} onChange={(next) => updateStyle({ heroMinHeight: next })} />
            <TextControl label="Heading Font Size" value={String(style.headingFontSize || "48px")} onChange={(next) => updateStyle({ headingFontSize: next })} />
            <ColorControl label="Text Color" value={String(style.textColor || "#cbd5e1")} onChange={(next) => updateStyle({ textColor: next })} />
            <ColorControl label="Button Color" value={String(style.buttonColor || "#2F80ED")} onChange={(next) => updateStyle({ buttonColor: next })} />
            <TextControl label="Button Radius" value={String(style.buttonRadius || "999px")} onChange={(next) => updateStyle({ buttonRadius: next })} />
          </>
        );

      case "Split Layout":
        return (
          <>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-600">
              Select a child element inside the hero to edit its text, button, or image.
              <div className="mt-2 text-[11px] text-slate-500">Use the + Add Element toolbar to add heading, paragraph, button, or image children.</div>
            </div>
            <SelectControl
              label="Image Position"
              value={String(style.splitImagePosition || layout.imagePosition || "right")}
              options={[
                { label: "Right", value: "right" },
                { label: "Left", value: "left" },
              ]}
              onChange={(next) => {
                updateStyle({ splitImagePosition: next });
                updateLayout({ imagePosition: next });
              }}
            />
            <SelectControl
              label="Image Fit"
              value={String(style.imageFit || "cover")}
              options={[
                { label: "Cover", value: "cover" },
                { label: "Contain", value: "contain" },
                { label: "Fill", value: "fill" },
              ]}
              onChange={(next) => updateStyle({ imageFit: next })}
            />
            <TextControl label="Image Width" value={String(style.imageWidth || "100%")} onChange={(next) => updateStyle({ imageWidth: next })} />
            <TextControl label="Image Radius" value={String(style.imageRadius || "0px")} onChange={(next) => updateStyle({ imageRadius: next })} />
            <ColorControl label="Background Color" value={String(style.backgroundColor || "#ffffff")} onChange={(next) => updateStyle({ backgroundColor: next })} />
            <SelectControl
              label="Content Alignment"
              value={String(layout.align || "left")}
              options={[
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
              ]}
              onChange={(next) => updateLayout({ align: next })}
            />
            <TextControl label="Section Height" value={String(style.heroMinHeight || "520px")} onChange={(next) => updateStyle({ heroMinHeight: next })} />
            <TextControl label="Heading Font Size" value={String(style.headingFontSize || "48px")} onChange={(next) => updateStyle({ headingFontSize: next })} />
            <ColorControl label="Text Color" value={String(style.textColor || "#475569")} onChange={(next) => updateStyle({ textColor: next })} />
            <ColorControl label="Button Color" value={String(style.buttonColor || "#2F80ED")} onChange={(next) => updateStyle({ buttonColor: next })} />
          </>
        );

      case "Centered":
        return (
          <>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-600">
              This is a true centered hero. Content is centered horizontally and vertically over a full-width background image.
            </div>
            <ImageControl
              label="Background Image"
              value={String(style.backgroundImage || "")}
              onChange={(next) => updateStyle({ backgroundImage: next })}
            />
            <SelectControl
              label="Background Position"
              value={String(style.backgroundPosition || "center")}
              options={[
                { label: "Center", value: "center" },
                { label: "Top", value: "top" },
                { label: "Bottom", value: "bottom" },
                { label: "Left", value: "left" },
                { label: "Right", value: "right" },
              ]}
              onChange={(next) => updateStyle({ backgroundPosition: next })}
            />
            <SelectControl
              label="Background Size"
              value={String(style.backgroundSize || "cover")}
              options={[
                { label: "Cover", value: "cover" },
                { label: "Contain", value: "contain" },
                { label: "Auto", value: "auto" },
              ]}
              onChange={(next) => updateStyle({ backgroundSize: next })}
            />
            <ToggleControl label="Overlay Enabled" checked={style.overlayEnabled ?? true} onChange={(next) => updateStyle({ overlayEnabled: next })} />
            <ColorControl label="Overlay Color" value={String(style.overlayColor || "#000000")} onChange={(next) => updateStyle({ overlayColor: next })} />
            <SliderControl label="Overlay Opacity" value={Number(style.overlayOpacity ?? 0.5)} min={0} max={1} step={0.05} onChange={(next) => updateStyle({ overlayOpacity: next })} />
            <SelectControl
              label="Vertical Alignment"
              value={String(style.verticalAlignment || "center")}
              options={[
                { label: "Top", value: "top" },
                { label: "Center", value: "center" },
                { label: "Bottom", value: "bottom" },
              ]}
              onChange={(next) => updateStyle({ verticalAlignment: next })}
            />
            <TextControl label="Content Max Width" value={String(style.contentMaxWidth || "720px")} onChange={(next) => updateStyle({ contentMaxWidth: next })} />
            <TextControl label="Hero Height" value={String(style.heroHeight || "100vh")} onChange={(next) => updateStyle({ heroHeight: next })} />
            <TextControl label="Hero Min Height" value={String(style.heroMinHeight || "560px")} onChange={(next) => updateStyle({ heroMinHeight: next })} />
            <TextControl label="Heading Font Size" value={String(style.headingFontSize || "52px")} onChange={(next) => updateStyle({ headingFontSize: next })} />
            <ColorControl label="Text Color" value={String(style.textColor || "#cbd5e1")} onChange={(next) => updateStyle({ textColor: next })} />
            <ColorControl label="Button Color" value={String(style.buttonColor || "#2F80ED")} onChange={(next) => updateStyle({ buttonColor: next })} />
            <TextControl label="Button Radius" value={String(style.buttonRadius || "999px")} onChange={(next) => updateStyle({ buttonRadius: next })} />
          </>
        );

      case "Video Background":
        return (
          <>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-600">
              This hero uses a real video background. Content stays centered above the video and overlay.
            </div>
            <SelectControl
              label="Background Type"
              value={String(style.videoType || "uploaded")}
              options={[
                { label: "Uploaded Video", value: "uploaded" },
                { label: "YouTube", value: "youtube" },
                { label: "Vimeo", value: "vimeo" },
              ]}
              onChange={(next) => updateStyle({ videoType: next })}
            />
            {style.videoType === "youtube" && (
              <TextControl
                label="YouTube URL"
                value={String(style.youtubeUrl || "")}
                onChange={(next) => updateStyle({ youtubeUrl: next })}
                placeholder="https://www.youtube.com/watch?v=..."
              />
            )}
            {style.videoType === "vimeo" && (
              <TextControl
                label="Vimeo URL"
                value={String(style.vimeoUrl || "")}
                onChange={(next) => updateStyle({ vimeoUrl: next })}
                placeholder="https://vimeo.com/..."
              />
            )}
            {style.videoType === "uploaded" && (
              <TextControl
                label="Video File URL"
                value={String(style.videoSrc || "")}
                onChange={(next) => updateStyle({ videoSrc: next })}
                placeholder="https://example.com/video.mp4"
              />
            )}
            <TextControl
              label="Video Poster"
              value={String(style.videoPoster || "")}
              onChange={(next) => updateStyle({ videoPoster: next })}
              placeholder="https://example.com/poster.jpg"
            />
            <div className="grid grid-cols-2 gap-2">
              <ToggleControl label="Autoplay" checked={style.videoAutoplay ?? true} onChange={(next) => updateStyle({ videoAutoplay: next })} />
              <ToggleControl label="Muted" checked={style.videoMuted ?? true} onChange={(next) => updateStyle({ videoMuted: next })} />
              <ToggleControl label="Loop" checked={style.videoLoop ?? true} onChange={(next) => updateStyle({ videoLoop: next })} />
              <ToggleControl label="Controls" checked={style.videoShowControls ?? false} onChange={(next) => updateStyle({ videoShowControls: next })} />
            </div>
            <ToggleControl label="Overlay Enabled" checked={style.overlayEnabled ?? true} onChange={(next) => updateStyle({ overlayEnabled: next })} />
            <ColorControl label="Overlay Color" value={String(style.overlayColor || "#000000")} onChange={(next) => updateStyle({ overlayColor: next })} />
            <SliderControl label="Overlay Opacity" value={Number(style.overlayOpacity ?? 0.55)} min={0} max={1} step={0.05} onChange={(next) => updateStyle({ overlayOpacity: next })} />
            <SelectControl
              label="Vertical Alignment"
              value={String(style.verticalAlignment || "center")}
              options={[
                { label: "Top", value: "top" },
                { label: "Center", value: "center" },
                { label: "Bottom", value: "bottom" },
              ]}
              onChange={(next) => updateStyle({ verticalAlignment: next })}
            />
            <TextControl label="Hero Height" value={String(style.heroHeight || "100vh")} onChange={(next) => updateStyle({ heroHeight: next })} />
            <TextControl label="Hero Min Height" value={String(style.heroMinHeight || "560px")} onChange={(next) => updateStyle({ heroMinHeight: next })} />
            <TextControl label="Content Max Width" value={String(style.contentMaxWidth || "720px")} onChange={(next) => updateStyle({ contentMaxWidth: next })} />
            <TextControl label="Heading Font Size" value={String(style.headingFontSize || "52px")} onChange={(next) => updateStyle({ headingFontSize: next })} />
            <ColorControl label="Text Color" value={String(style.textColor || "#cbd5e1")} onChange={(next) => updateStyle({ textColor: next })} />
            <ColorControl label="Button Color" value={String(style.buttonColor || "#2F80ED")} onChange={(next) => updateStyle({ buttonColor: next })} />
            <TextControl label="Button Radius" value={String(style.buttonRadius || "999px")} onChange={(next) => updateStyle({ buttonRadius: next })} />
          </>
        );

      case "Gradient":
        return (
          <>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-600">
              This hero uses a real gradient background with a foreground image on the right.
            </div>
            <SelectControl
              label="Gradient Type"
              value={String(style.gradientType || "linear")}
              options={[
                { label: "Linear", value: "linear" },
                { label: "Radial", value: "radial" },
              ]}
              onChange={(next) => updateStyle({ gradientType: next })}
            />
            <TextControl label="Gradient Direction" value={String(style.gradientDirection || "135deg")} onChange={(next) => updateStyle({ gradientDirection: next })} placeholder="135deg" />
            <ColorControl label="Gradient Start Color" value={String(style.gradientStart || "#0f172a")} onChange={(next) => updateStyle({ gradientStart: next })} />
            <ColorControl label="Gradient Mid Color" value={String(style.gradientMid || "#1e3a8a")} onChange={(next) => updateStyle({ gradientMid: next })} />
            <ColorControl label="Gradient End Color" value={String(style.gradientEnd || "#2563eb")} onChange={(next) => updateStyle({ gradientEnd: next })} />
            <SliderControl label="Gradient Opacity" value={Number(style.gradientOpacity ?? 1)} min={0} max={1} step={0.05} onChange={(next) => updateStyle({ gradientOpacity: next })} />
            <ImageControl
              label="Right Side Image"
              value={String(style.backgroundImage || "")}
              onChange={(next) => updateStyle({ backgroundImage: next })}
            />
            <SelectControl
              label="Image Fit"
              value={String(style.imageFit || "contain")}
              options={[
                { label: "Contain", value: "contain" },
                { label: "Cover", value: "cover" },
                { label: "Fill", value: "fill" },
              ]}
              onChange={(next) => updateStyle({ imageFit: next })}
            />
            <TextControl label="Image Radius" value={String(style.imageRadius || "24px")} onChange={(next) => updateStyle({ imageRadius: next })} />
            <SelectControl
              label="Content Alignment"
              value={String(layout.align || "left")}
              options={[
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
              ]}
              onChange={(next) => updateLayout({ align: next })}
            />
            <TextControl label="Content Max Width" value={String(style.contentMaxWidth || "")} onChange={(next) => updateStyle({ contentMaxWidth: next })} />
            <TextControl label="Heading Font Size" value={String(style.headingFontSize || "48px")} onChange={(next) => updateStyle({ headingFontSize: next })} />
            <ColorControl label="Text Color" value={String(style.textColor || "#e2e8f0")} onChange={(next) => updateStyle({ textColor: next })} />
            <ColorControl label="Button Color" value={String(style.buttonColor || "#2F80ED")} onChange={(next) => updateStyle({ buttonColor: next })} />
            <TextControl label="Section Min Height" value={String(style.heroMinHeight || "560px")} onChange={(next) => updateStyle({ heroMinHeight: next })} />
          </>
        );

      case "Dark":
        return (
          <>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-600">
              A deliberate dark modern hero. Use glow and accent colors to create visual interest.
            </div>
            <ColorControl label="Background Color" value={String(style.backgroundColor || "#050505")} onChange={(next) => updateStyle({ backgroundColor: next })} />
            <ColorControl label="Accent Color" value={String(style.accentColor || "#2F80ED")} onChange={(next) => updateStyle({ accentColor: next })} />
            <ColorControl label="Glow Color A" value={String(style.glowColorA || "rgba(56,189,248,0.35)")} onChange={(next) => updateStyle({ glowColorA: next })} />
            <ColorControl label="Glow Color B" value={String(style.glowColorB || "rgba(124,58,237,0.45)")} onChange={(next) => updateStyle({ glowColorB: next })} />
            <SliderControl label="Glow Opacity" value={Number(style.glowOpacity ?? 0.9)} min={0} max={1} step={0.05} onChange={(next) => updateStyle({ glowOpacity: next })} />
            <ToggleControl label="Show Glow" checked={style.glowVisible ?? true} onChange={(next) => updateStyle({ glowVisible: next })} />
            <SelectControl
              label="Content Alignment"
              value={String(layout.align || "left")}
              options={[
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
              ]}
              onChange={(next) => updateLayout({ align: next })}
            />
            <TextControl label="Section Height" value={String(style.heroMinHeight || "560px")} onChange={(next) => updateStyle({ heroMinHeight: next })} />
            <TextControl label="Heading Font Size" value={String(style.headingFontSize || "48px")} onChange={(next) => updateStyle({ headingFontSize: next })} />
            <ColorControl label="Heading Color" value={String(style.headingColor || "#ffffff")} onChange={(next) => updateStyle({ headingColor: next })} />
            <ColorControl label="Text Color" value={String(style.textColor || "#94a3b8")} onChange={(next) => updateStyle({ textColor: next })} />
            <ColorControl label="Button Color" value={String(style.buttonColor || "#2F80ED")} onChange={(next) => updateStyle({ buttonColor: next })} />
          </>
        );

      case "Product/SaaS":
        return (
          <>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-600">
              A modern SaaS hero with a badge, headline, description, CTAs, and a large product image below.
            </div>
            <ColorControl label="Background Color" value={String(style.backgroundColor || "#ffffff")} onChange={(next) => updateStyle({ backgroundColor: next })} />
            <ColorControl label="Accent Color" value={String(style.accentColor || "#2F80ED")} onChange={(next) => updateStyle({ accentColor: next })} />
            <ImageControl
              label="Product Image"
              value={String(style.backgroundImage || "")}
              onChange={(next) => updateStyle({ backgroundImage: next })}
            />
            <TextControl label="Image Radius" value={String(style.productImageRadius || "24px")} onChange={(next) => updateStyle({ productImageRadius: next })} />
            <TextControl label="Image Shadow" value={String(style.productImageShadow || "0 40px 100px rgba(0,0,0,0.12)")} onChange={(next) => updateStyle({ productImageShadow: next })} />
            <SelectControl
              label="Content Alignment"
              value={String(layout.align || "left")}
              options={[
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
              ]}
              onChange={(next) => updateLayout({ align: next })}
            />
            <TextControl label="Section Min Height" value={String(style.heroMinHeight || "560px")} onChange={(next) => updateStyle({ heroMinHeight: next })} />
            <TextControl label="Heading Font Size" value={String(style.headingFontSize || "44px")} onChange={(next) => updateStyle({ headingFontSize: next })} />
            <ColorControl label="Heading Color" value={String(style.headingColor || "#0f172a")} onChange={(next) => updateStyle({ headingColor: next })} />
            <ColorControl label="Text Color" value={String(style.textColor || "#475569")} onChange={(next) => updateStyle({ textColor: next })} />
            <ColorControl label="Button Color" value={String(style.buttonColor || "#2F80ED")} onChange={(next) => updateStyle({ buttonColor: next })} />
          </>
        );

      case "Personal/Portfolio":
        return (
          <>
            <div className="rounded-md border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-600">
              A modern personal portfolio hero with a profile image on the right.
            </div>
            <ColorControl label="Background Color" value={String(style.backgroundColor || "#f8fafc")} onChange={(next) => updateStyle({ backgroundColor: next })} />
            <ColorControl label="Accent Color" value={String(style.accentColor || "#2F80ED")} onChange={(next) => updateStyle({ accentColor: next })} />
            <ImageControl
              label="Profile Image"
              value={String(style.backgroundImage || "")}
              onChange={(next) => updateStyle({ backgroundImage: next })}
            />
            <SelectControl
              label="Profile Image Shape"
              value={String(style.profileImageShape || "circle")}
              options={[
                { label: "Circle", value: "circle" },
                { label: "Rounded", value: "rounded" },
                { label: "Square", value: "square" },
              ]}
              onChange={(next) => updateStyle({ profileImageShape: next })}
            />
            <TextControl label="Profile Image Size" value={String(style.imageWidth || "320px")} onChange={(next) => updateStyle({ imageWidth: next })} />
            <SelectControl
              label="Content Alignment"
              value={String(layout.align || "left")}
              options={[
                { label: "Left", value: "left" },
                { label: "Center", value: "center" },
                { label: "Right", value: "right" },
              ]}
              onChange={(next) => updateLayout({ align: next })}
            />
            <TextControl label="Section Min Height" value={String(style.heroMinHeight || "560px")} onChange={(next) => updateStyle({ heroMinHeight: next })} />
            <TextControl label="Heading Font Size" value={String(style.headingFontSize || "48px")} onChange={(next) => updateStyle({ headingFontSize: next })} />
            <ColorControl label="Heading Color" value={String(style.headingColor || "#0f172a")} onChange={(next) => updateStyle({ headingColor: next })} />
            <ColorControl label="Text Color" value={String(style.textColor || "#475569")} onChange={(next) => updateStyle({ textColor: next })} />
            <ColorControl label="Button Color" value={String(style.buttonColor || "#2F80ED")} onChange={(next) => updateStyle({ buttonColor: next })} />
          </>
        );

      default:
        return null;
    }
  };

  return (
    <PropertyPanel
      title="Hero"
      onClose={onClose}
      content={
        <div className="space-y-3">
          {renderVariantSpecific()}
        </div>
      }
      background={
        <BackgroundProperties
          background={heroValue.style as any}
          onChange={(next) => updateStyle(next)}
        />
      }
      backgroundSummary={!heroValue.style?.type || heroValue.style.type === "none" ? "None" : String(heroValue.style.type)}
      style={
        <div className="space-y-2.5">
          <ColorControl label="Heading Color" value={String(heroValue.style.headingColor ?? "")} onChange={(next) => updateStyle({ headingColor: next })} />
          <ColorControl label="Text Color" value={String(heroValue.style.textColor ?? "")} onChange={(next) => updateStyle({ textColor: next })} />
          <SelectControl
            label="Button Style"
            value={String(heroValue.style.buttonStyle ?? "solid")}
            options={[
              { label: "Solid", value: "solid" },
              { label: "Outline", value: "outline" },
              { label: "Ghost", value: "ghost" },
            ]}
            onChange={(next) => updateStyle({ buttonStyle: next as any })}
          />
          <ColorControl label="Button Color" value={String(heroValue.style.buttonColor ?? "")} onChange={(next) => updateStyle({ buttonColor: next })} />
        </div>
      }
      layout={
        <div className="space-y-2">
          <SectionWidthProperties layout={heroValue.layout} onChange={(patch) => updateLayout(patch)} />
          <AlignmentControl label="Alignment" value={heroValue.layout.align as any} onChange={(next) => updateLayout({ align: next as typeof heroValue.layout.align })} />
          <SelectControl
            label="Container Width"
            value={String(heroValue.layout.containerWidth ?? "standard")}
            options={[
              { label: "Narrow", value: "narrow" },
              { label: "Standard", value: "standard" },
              { label: "Wide", value: "wide" },
            ]}
            onChange={(next) => updateLayout({ containerWidth: next as any })}
          />
          <SelectControl
            label="Content Width"
            value={String(heroValue.layout.contentWidth ?? "standard")}
            options={[
              { label: "Narrow", value: "narrow" },
              { label: "Standard", value: "standard" },
              { label: "Wide", value: "wide" },
            ]}
            onChange={(next) => updateLayout({ contentWidth: next as any })}
          />
          {variant !== "Centered" && variant !== "Video Background" && (
            <SelectControl
              label="Image Position"
              value={String(heroValue.layout.imagePosition ?? "right")}
              options={[
                { label: "Right", value: "right" },
                { label: "Left", value: "left" },
                { label: "Bottom", value: "bottom" },
              ]}
              onChange={(next) => updateLayout({ imagePosition: next as any })}
            />
          )}
          <SpacingControl label="Padding" value={resolveHeroLayoutPadding(heroValue.layout.padding) as any} onChange={(next) => updateLayout({ padding: next as any })} />
          <SpacingControl label="Margin" value={resolveHeroLayoutMargin(heroValue.layout.margin) as any} onChange={(next) => updateLayout({ margin: next as any })} />
        </div>
      }
      responsive={
        <div className="space-y-2">
          {variant !== "Centered" && variant !== "Video Background" && (
            <ToggleControl label="Hide Image on Mobile" checked={heroValue.responsive.hideImageOnMobile ?? false} onChange={(next) => updateResponsive({ hideImageOnMobile: next })} />
          )}
          <ToggleControl label="Stack Layout" checked={heroValue.responsive.mobileStack ?? false} onChange={(next) => updateResponsive({ mobileStack: next })} />
          <SpacingControl label="Mobile Padding" value={heroValue.responsive.mobilePadding} onChange={(next) => updateResponsive({ mobilePadding: next as any })} />
        </div>
      }
      animation={
        <div className="space-y-2">
          <SelectControl
            label="Animation Type"
            value={String(heroValue.animation.type ?? "none")}
            options={[
              { label: "None", value: "none" },
              { label: "Fade", value: "fade" },
              { label: "Slide up", value: "slide-up" },
              { label: "Zoom", value: "zoom" },
            ]}
            onChange={(next) => updateAnimation({ type: next as any })}
          />
          <SliderControl label="Duration" value={heroValue.animation.duration ?? 400} min={100} max={2000} onChange={(next) => updateAnimation({ duration: next })} />
          <SliderControl label="Delay" value={heroValue.animation.delay ?? 0} min={0} max={1000} onChange={(next) => updateAnimation({ delay: next })} />
        </div>
      }
      advanced={
        <div className="space-y-2">
          <TextControl label="CSS Class" value={String(heroValue.advanced.className ?? "")} onChange={(next) => updateAdvanced({ className: next })} />
          <TextControl label="HTML ID" value={String(heroValue.advanced.id ?? "")} onChange={(next) => updateAdvanced({ id: next })} />
          <ToggleControl label="Visibility" checked={heroValue.advanced.visibility ?? true} onChange={(next) => updateAdvanced({ visibility: next })} />
        </div>
      }
    />
  );
}
