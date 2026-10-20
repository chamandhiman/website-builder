import type { WidgetExportContext } from "../widgetRegistry";
import {
  type StoreLocatorWidgetData,
  defaultStoreLocatorWidgetData,
  isStoreLocatorWidgetData,
} from "./StoreLocatorTypes";

export function buildStoreLocatorBootstrapMarkup(
  data: any,
  context?: WidgetExportContext
): string {
  const d: StoreLocatorWidgetData = isStoreLocatorWidgetData(data)
    ? data
    : defaultStoreLocatorWidgetData;

  const {
    heading,
    subheading,
    mapAddress,
    layout,
    widthMode,
    maxWidth,
    mapHeight,
    borderRadius,
    paddingTop,
    paddingBottom,
    stores,
  } = d.content;

  const query = encodeURIComponent(mapAddress || (stores[0]?.address || "New York, NY"));
  const mapEmbedUrl = `https://maps.google.com/maps?q=${query}&t=&z=13&ie=UTF8&iwloc=&output=embed`;

  const storesHtml = (stores || [])
    .map(
      (store, idx) => `
      <div style="background: #18181B; border: 1px solid #27272A; border-radius: 12px; padding: 18px; transition: border-color 0.2s;">
        <div style="display: flex; align-items: flex-start; justify-content: space-between; gap: 8px;">
          <div>
            <span style="display: inline-block; font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #10B981; margin-bottom: 4px;">Location #${idx + 1}</span>
            <h4 style="font-size: 15px; font-weight: 700; color: #F4F4F5; margin: 0 0 6px 0;">${store.name || "Store Location"}</h4>
          </div>
        </div>
        <p style="font-size: 13px; color: #A1A1AA; margin: 0 0 8px 0; line-height: 1.45;">${store.address || "Address not specified"}</p>
        ${store.phone ? `<p style="font-size: 12px; color: #D4D4D8; margin: 0 0 6px 0;">📞 <a href="tel:${store.phone.replace(/[^0-9+]/g, "")}" style="color: inherit; text-decoration: none;">${store.phone}</a></p>` : ""}
        ${store.hours ? `<p style="font-size: 11px; color: #71717A; margin: 0 0 12px 0;">🕒 ${store.hours}</p>` : ""}
        <div style="display: flex; gap: 8px; margin-top: 10px;">
          <a
            href="https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(store.address || store.name)}"
            target="_blank"
            rel="noreferrer"
            style="display: inline-flex; align-items: center; gap: 6px; background: #27272A; color: #F4F4F5; padding: 6px 14px; border-radius: 6px; font-size: 11px; font-weight: 600; text-decoration: none; transition: background 0.2s;"
            onmouseover="this.style.background='#3F3F46'"
            onmouseout="this.style.background='#27272A'"
          >
            <span>Get Directions →</span>
          </a>
        </div>
      </div>
    `
    )
    .join("");

  return `
    <section class="wto-store-locator-section" style="padding-top: ${paddingTop}px; padding-bottom: ${paddingBottom}px; width: 100%; background: transparent; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div class="container" style="max-width: ${widthMode === "full" ? "100%" : maxWidth}; margin: 0 auto; padding: 0 16px;">
        ${
          heading || subheading
            ? `
          <div style="text-align: center; margin-bottom: 32px;">
            ${heading ? `<h2 style="font-size: 28px; font-weight: 800; color: #F4F4F5; margin: 0 0 8px 0; letter-spacing: -0.02em;">${heading}</h2>` : ""}
            ${subheading ? `<p style="font-size: 14px; color: #A1A1AA; max-width: 600px; margin: 0 auto; line-height: 1.5;">${subheading}</p>` : ""}
          </div>
        `
            : ""
        }

        <div style="display: grid; grid-template-columns: ${layout === "split" ? "repeat(auto-fit, minmax(320px, 1fr))" : "1fr"}; gap: 24px; align-items: start;">
          <!-- Map Column -->
          <div style="position: relative; height: ${mapHeight}; border-radius: ${borderRadius}px; overflow: hidden; box-shadow: 0 12px 36px rgba(0,0,0,0.3); border: 1px solid #27272A; background: #18181B;">
            <iframe
              src="${mapEmbedUrl}"
              title="Store Locations Map"
              style="width: 100%; height: 100%; border: none; ${context?.editorMode ? "pointer-events: none;" : ""}"
              allowfullscreen
              loading="lazy"
            ></iframe>
          </div>

          <!-- Locations Column -->
          <div style="display: flex; flex-direction: column; gap: 14px; max-height: ${layout === "split" ? mapHeight : "none"}; overflow-y: ${layout === "split" ? "auto" : "visible"}; padding-right: 4px;">
            ${storesHtml || `<p style="color: #71717A; font-size: 13px;">No store locations added yet.</p>`}
          </div>
        </div>
      </div>
    </section>
  `;
}
