import {
  type MapWidgetData,
  type MapVariant,
  extractMapSrc,
  DEFAULT_MAP_URL,
} from "./MapTypes";

type ExportContext = { editorMode?: boolean };

function escapeAttr(val: string): string {
  return val.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function getFilterStyle(filter?: string): string {
  switch (filter) {
    case "grayscale":
      return "filter: grayscale(100%) contrast(1.05);";
    case "contrast":
      return "filter: contrast(125%) saturate(1.1);";
    case "dark":
      return "filter: invert(90%) hue-rotate(180deg) contrast(1.1);";
    default:
      return "";
  }
}

function renderInfoCard(data: MapWidgetData): string {
  const c = data.content;
  const s = data.style;

  // If card is explicitly hidden or disabled
  if (c.showCard === false) return "";
  if (c.showCard === undefined && data.variant === "Full Width Clean") return "";

  const showAddress = c.showAddress !== false;
  const showPhone = c.showPhone !== false;
  const showHours = c.showHours !== false;
  const showButton = c.showButton !== false;

  const hasTitle = Boolean(c.cardTitle && String(c.cardTitle).trim());
  const hasAddress = Boolean(showAddress && c.cardAddress && String(c.cardAddress).trim());
  const hasPhone = Boolean(showPhone && c.cardPhone && String(c.cardPhone).trim());
  const hasHours = Boolean(showHours && c.cardHours && String(c.cardHours).trim());
  const hasButton = Boolean(showButton && c.cardButtonText && String(c.cardButtonText).trim() && c.cardButtonUrl);

  // If all fields were deleted or are empty, don't show an empty floating box!
  if (!hasTitle && !hasAddress && !hasPhone && !hasHours && !hasButton) {
    return "";
  }

  const pos = c.cardPosition || "bottom-left";
  const posStyle =
    pos === "top-left"
      ? "top: 32px; left: 32px;"
      : pos === "top-right"
        ? "top: 32px; right: 32px;"
        : pos === "bottom-right"
          ? "bottom: 32px; right: 32px;"
          : "bottom: 32px; left: 32px;";

  const shadow = s.cardShadow !== false ? "box-shadow: 0 12px 36px rgba(0, 0, 0, 0.18);" : "";
  const bg = s.cardBg || "rgba(255, 255, 255, 0.95)";
  const textCol = s.cardTextColor || "#111827";
  const subCol = s.cardSubtitleColor || "#4b5563";
  const accentCol = s.cardAccentColor || "#FACC15";

  return `
    <div class="wto-map-card wto-map-card-${data.id}" data-wto-card="1" data-element-key="card" style="position: absolute; ${posStyle} z-index: 10; max-width: 380px; width: calc(100% - 64px); background: ${bg}; backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border-radius: ${s.cardBorderRadius || "14px"}; padding: 24px; ${shadow} border: 1px solid rgba(255, 255, 255, 0.3);">
      ${hasTitle ? `<h4 style="margin: 0 0 8px 0; font-size: 18px; font-weight: 700; color: ${textCol};">${c.cardTitle}</h4>` : ""}
      ${hasAddress ? `<div style="display: flex; gap: 8px; margin-bottom: 8px; font-size: 13px; color: ${subCol};"><span style="color: ${accentCol};">📍</span><span>${c.cardAddress}</span></div>` : ""}
      ${hasPhone ? `<div style="display: flex; gap: 8px; margin-bottom: 8px; font-size: 13px; color: ${subCol};"><span style="color: ${accentCol};">📞</span><span>${c.cardPhone}</span></div>` : ""}
      ${hasHours ? `<div style="display: flex; gap: 8px; margin-bottom: 14px; font-size: 13px; color: ${subCol};"><span style="color: ${accentCol};">🕒</span><span>${c.cardHours}</span></div>` : ""}
      ${
        hasButton
          ? `<a href="${c.cardButtonUrl}" target="_blank" rel="noopener noreferrer" style="display: inline-flex; align-items: center; justify-content: center; gap: 6px; width: 100%; padding: 10px 16px; background: ${accentCol}; color: #111111; font-weight: 600; font-size: 13px; text-decoration: none; border-radius: 8px; transition: opacity 0.2s;" onmouseover="this.style.opacity='0.9'" onmouseout="this.style.opacity='1'">${c.cardButtonText} ↗</a>`
          : ""
      }
    </div>
  `;
}

function renderEditorOverlay(
  widgetId: string,
  currentEmbedCode: string,
  currentSrc: string,
  isCardVisible: boolean,
  isAddressVisible: boolean,
): string {
  const modalId = `wto-map-modal-${widgetId}`;
  const textareaId = `wto-map-input-${widgetId}`;
  const iframeId = `wto-map-iframe-${widgetId}`;
  const cardCheckboxId = `wto-map-card-check-${widgetId}`;
  const addressCheckboxId = `wto-map-addr-check-${widgetId}`;

  return `
    <div class="wto-map-hover-bar" style="position: absolute; top: 18px; left: 50%; transform: translateX(-50%); z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.2s ease, transform 0.2s ease;">
      <button type="button" onclick="(function(e){ e.stopPropagation(); var m=document.getElementById('${modalId}'); if(m) m.style.display='flex'; })(event)" style="display: inline-flex; align-items: center; gap: 8px; padding: 9px 18px; background: #0f172a; color: #ffffff; border: 1.5px solid #FACC15; border-radius: 30px; font-size: 13px; font-weight: 600; cursor: pointer; box-shadow: 0 8px 24px rgba(0,0,0,0.35); pointer-events: auto; backdrop-filter: blur(8px);">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#FACC15" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        <span>Add / Edit Google Map (Paste Embed Code)</span>
      </button>
    </div>

    <!-- Interactive Embed Code Modal in Canvas -->
    <div id="${modalId}" style="display: none; position: fixed; inset: 0; z-index: 999999; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); align-items: center; justify-content: center; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" onclick="if(event.target===this) this.style.display='none';">
      <div style="background: #18181b; border: 1px solid #3f3f46; border-radius: 16px; width: 100%; max-width: 560px; box-shadow: 0 24px 60px rgba(0,0,0,0.6); overflow: hidden;" onclick="event.stopPropagation();">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #27272a; background: #09090b;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FACC15" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 15px; color: #fafafa;">Google Map Settings</div>
              <div style="font-size: 12px; color: #a1a1aa;">Paste Google Maps embed code & toggle location card</div>
            </div>
          </div>
          <button type="button" onclick="document.getElementById('${modalId}').style.display='none';" style="border: 0; background: transparent; color: #a1a1aa; font-size: 20px; cursor: pointer; padding: 4px 8px; line-height: 1;">&times;</button>
        </div>

        <div style="padding: 22px; max-height: calc(85vh - 120px); overflow-y: auto;">
          <label style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #d4d4d8; margin-bottom: 8px;">
            Embed HTML Code or Map Link
          </label>
          <textarea id="${textareaId}" rows="4" placeholder="&lt;iframe src=&quot;https://www.google.com/maps/embed?...&quot; ...&gt;&lt;/iframe&gt;" style="width: 100%; box-sizing: border-box; background: #09090b; border: 1px solid #3f3f46; border-radius: 10px; color: #fafafa; font-family: monospace; font-size: 12px; padding: 12px; resize: vertical; outline: none;">${escapeAttr(currentEmbedCode)}</textarea>

          <!-- Address Card Visibility Toggles -->
          <div style="margin-top: 16px; background: #27272a; border-radius: 12px; padding: 14px 16px; display: flex; flex-direction: column; gap: 12px;">
            <label style="display: flex; align-items: center; justify-content: space-between; cursor: pointer; user-select: none;">
              <div>
                <div style="font-weight: 600; font-size: 13px; color: #fafafa;">Show Address Card on Map</div>
                <div style="font-size: 11px; color: #a1a1aa;">Display or hide the floating location details card</div>
              </div>
              <input type="checkbox" id="${cardCheckboxId}" ${isCardVisible ? "checked" : ""} style="width: 18px; height: 18px; accent-color: #FACC15; cursor: pointer;" onchange="(function(cb){ var addrRow = document.getElementById('addr-row-${widgetId}'); if(addrRow) addrRow.style.display = cb.checked ? 'flex' : 'none'; })(this)" />
            </label>

            <div id="addr-row-${widgetId}" style="display: ${isCardVisible ? "flex" : "none"}; align-items: center; justify-content: space-between; padding-top: 8px; border-top: 1px solid #3f3f46; cursor: pointer; user-select: none;">
              <div>
                <div style="font-weight: 500; font-size: 12px; color: #d4d4d8;">Show Address Text</div>
                <div style="font-size: 11px; color: #a1a1aa;">Show street address inside the card</div>
              </div>
              <input type="checkbox" id="${addressCheckboxId}" ${isAddressVisible ? "checked" : ""} style="width: 17px; height: 17px; accent-color: #FACC15; cursor: pointer;" />
            </div>
          </div>

          <div style="margin-top: 14px; background: rgba(250, 204, 21, 0.08); border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #a1a1aa; line-height: 1.5;">
            <strong style="color: #FACC15;">How to get Google Map embed code:</strong>
            <ol style="margin: 6px 0 0 0; padding-left: 18px; color: #d4d4d8;">
              <li>Go to <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: underline;">Google Maps</a> and search your place.</li>
              <li>Click <strong>Share</strong> &rarr; Click <strong>Embed a map</strong>.</li>
              <li>Click <strong>COPY HTML</strong> and paste it into the box above.</li>
            </ol>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding: 14px 22px; border-top: 1px solid #27272a; background: #09090b;">
          <button type="button" onclick="document.getElementById('${modalId}').style.display='none';" style="padding: 8px 16px; background: transparent; border: 1px solid #3f3f46; border-radius: 8px; color: #d4d4d8; font-size: 13px; font-weight: 500; cursor: pointer;">Cancel</button>
          <button type="button" onclick="(function(){
            var input = document.getElementById('${textareaId}').value.trim();
            var isCardChecked = document.getElementById('${cardCheckboxId}').checked;
            var isAddrChecked = document.getElementById('${addressCheckboxId}') ? document.getElementById('${addressCheckboxId}').checked : true;
            var extractedSrc = '';
            var match = input.match(/src=[&quot;']([^&quot;']+)[\&quot;']/i);
            if (match && match[1]) {
              extractedSrc = match[1];
            } else if (input.startsWith('http://') || input.startsWith('https://') || input.startsWith('//')) {
              extractedSrc = input;
            } else {
              extractedSrc = '${DEFAULT_MAP_URL}';
            }
            var frame = document.getElementById('${iframeId}');
            if (frame) {
              frame.src = extractedSrc;
            }
            var cardEl = document.querySelector('.wto-map-card-${widgetId}');
            if (cardEl) {
              cardEl.style.display = isCardChecked ? 'block' : 'none';
            }
            try {
              window.parent.postMessage({
                __wto: true,
                type: 'map-embed-update',
                payload: {
                  widgetId: '${widgetId}',
                  embedCode: input,
                  mapUrl: extractedSrc,
                  showCard: isCardChecked,
                  showAddress: isAddrChecked
                }
              }, '*');
            } catch(e) {}
            document.getElementById('${modalId}').style.display = 'none';
          })()" style="padding: 8px 20px; background: #FACC15; border: 0; border-radius: 8px; color: #09090b; font-size: 13px; font-weight: 600; cursor: pointer;">Save & Update Map</button>
        </div>
      </div>
    </div>
  `;
}

export function buildMapBootstrapMarkup(data: MapWidgetData, context?: ExportContext): string {
  if (data.advanced?.visibility === false) return "";

  const isEditor = !!context?.editorMode;
  const c = data.content;
  const s = data.style;
  const l = data.layout;
  const variant = (data.variant as MapVariant) || "Full Width Clean";

  const mapSrc = extractMapSrc(c.embedCode || c.mapUrl);
  const height = c.height || "480px";
  const filterStyle = getFilterStyle(s.filter);
  const iframeId = `wto-map-iframe-${data.id}`;

  const isFluid = l.containerMode === "fluid" || variant === "Full Width Clean" || variant === "Dark Mode Map";
  const maxWidth = isFluid ? "100%" : (l.maxWidth || "1200px");
  const containerPadding = isFluid ? "0" : (l.paddingX || "24px");
  const sectionBorderRadius = variant === "Rounded Boxed" ? (s.borderRadius || "18px") : (s.borderRadius || "0px");

  const isCardVisible = c.showCard === true || (c.showCard !== false && variant === "Split with Card");
  const isAddressVisible = c.showAddress !== false;

  const editorOverlay = isEditor
    ? renderEditorOverlay(data.id, c.embedCode || "", mapSrc, isCardVisible, isAddressVisible)
    : "";
  const infoCard = renderInfoCard(data);

  const hoverStyle = isEditor
    ? `
      <style>
        .wto-map-container-${data.id}:hover .wto-map-hover-bar {
          opacity: 1 !important;
          pointer-events: auto !important;
          transform: translateX(-50%) translateY(4px) !important;
        }
      </style>
    `
    : "";

  return `
    ${hoverStyle}
    <section class="wto-map-section wto-map-container-${data.id}" style="position: relative; width: 100%; background: ${s.backgroundColor || "#ffffff"}; padding-top: ${l.paddingTop || "0px"}; padding-bottom: ${l.paddingBottom || "0px"}; overflow: hidden;">
      <div style="max-width: ${maxWidth}; margin: 0 auto; padding-left: ${containerPadding}; padding-right: ${containerPadding}; position: relative;">
        <div style="position: relative; width: 100%; height: ${height}; border-radius: ${sectionBorderRadius}; overflow: hidden; background: #e5e7eb;">
          <iframe
            id="${iframeId}"
            src="${escapeAttr(mapSrc)}"
            width="100%"
            height="100%"
            style="border: 0; width: 100%; height: 100%; display: block; ${filterStyle}"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
            title="Google Map Location"
          ></iframe>

          ${infoCard}
          ${editorOverlay}
        </div>
      </div>
    </section>
  `;
}
