import type { ContactWidgetData, ContactInfoItem, ContactVariant } from "./ContactTypes";

type ExportContext = { editorMode?: boolean };

function escapeAttr(val: string): string {
  return val.replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function iconSvg(icon: ContactInfoItem["icon"], color: string): string {
  const size = 18;
  const svgs: Record<string, string> = {
    "map-pin": `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`,
    phone: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.99 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.92 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 8.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    mail: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`,
    clock: `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="${color}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`,
  };
  return svgs[icon] ?? svgs["mail"];
}

function buildInfoHtml(data: ContactWidgetData): string {
  const c = data.content;
  const s = data.style;

  if (!c.showInfoItems || !c.infoItems?.length) return "";

  return (c.infoItems as ContactInfoItem[])
    .map(
      (item) => `
      <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:22px;">
        <div style="flex-shrink:0;width:40px;height:40px;border-radius:10px;background:${s.infoIconColor ?? "#FACC15"}22;display:flex;align-items:center;justify-content:center;">
          ${iconSvg(item.icon, s.infoIconColor ?? "#FACC15")}
        </div>
        <div>
          <div style="font-weight:600;font-size:14px;color:${s.infoLabelColor ?? "#111827"};margin-bottom:3px;">${item.label}</div>
          <div style="font-size:13px;color:${s.infoValueColor ?? "#6b7280"};line-height:1.5;">${item.value}</div>
        </div>
      </div>`
    )
    .join("");
}

function renderCustomFormEmbed(code: string, height: string = "520px"): string {
  const trimmed = (code || "").trim();
  if (!trimmed) {
    return `
      <div style="border: 2px dashed #d1d5db; border-radius: 12px; padding: 48px 24px; text-align: center; background: #f9fafb;">
        <div style="font-size: 32px; margin-bottom: 10px;">📋</div>
        <div style="font-size: 15px; font-weight: 700; color: #111827; margin-bottom: 6px;">Jotform / Custom Form Embed</div>
        <div style="font-size: 13px; color: #6b7280; max-width: 320px; margin: 0 auto;">No embed code added yet. Hover here or use the sidebar to paste your Jotform iframe code or form link.</div>
      </div>
    `;
  }

  // 1. If user pasted a Jotform script tag: <script ... src="https://form.jotform.com/jsform/1234567890"></script>
  const jotformScriptMatch = trimmed.match(/https?:\/\/form\.jotform\.com\/(?:jsform\/)?([a-zA-Z0-9_-]+)/i);
  if (jotformScriptMatch && jotformScriptMatch[1]) {
    const formId = jotformScriptMatch[1];
    return `
      <div class="wto-custom-form-wrapper" style="width: 100%; min-height: ${height}; overflow: hidden;">
        <iframe
          src="https://form.jotform.com/${formId}"
          width="100%"
          height="${height}"
          style="width: 100%; height: ${height}; min-height: 480px; border: none; display: block;"
          frameborder="0"
          scrolling="yes"
          allow="geolocation; microphone; camera"
          allowfullscreen="true"
          title="Jotform Contact Form"
        ></iframe>
      </div>
    `;
  }

  // 2. If user pasted a direct URL: https://form.jotform.com/... or https://typeform.com/... or https://forms.gle/...
  if (/^(https?:)?\/\/[^\s<>'"]+$/i.test(trimmed)) {
    return `
      <div class="wto-custom-form-wrapper" style="width: 100%; min-height: ${height}; overflow: hidden;">
        <iframe
          src="${escapeAttr(trimmed)}"
          width="100%"
          height="${height}"
          style="width: 100%; height: ${height}; min-height: 480px; border: none; display: block;"
          frameborder="0"
          scrolling="yes"
          allow="geolocation; microphone; camera"
          allowfullscreen="true"
          title="Embedded Form"
        ></iframe>
      </div>
    `;
  }

  // 3. If user pasted an iframe embed code
  if (/<iframe/i.test(trimmed)) {
    // Ensure width="100%" and style includes proper min-height
    let modified = trimmed;
    if (!/width=["']100%["']/i.test(modified)) {
      modified = modified.replace(/width=["'][^"']*["']/i, 'width="100%"');
    }
    return `<div class="wto-custom-form-wrapper" style="width: 100%; min-height: ${height}; overflow: hidden;">${modified}</div>`;
  }

  // 4. Raw custom HTML
  return `<div class="wto-custom-form-wrapper" style="width: 100%; min-height: ${height};">${trimmed}</div>`;
}

function buildFormHtml(data: ContactWidgetData): string {
  const c = data.content;
  const s = data.style;

  // Check if user chose custom embed (Jotform / third-party)
  if (c.formType === "custom_embed") {
    return renderCustomFormEmbed(String(c.customEmbedCode ?? ""), String(c.customEmbedHeight ?? "520px"));
  }

  const inputStyle = `width:100%;padding:10px 14px;border:1px solid ${s.inputBorderColor ?? "#e5e7eb"};border-radius:${s.inputBorderRadius ?? "8px"};background:${s.inputBgColor ?? "#f9fafb"};color:${s.inputTextColor ?? "#111827"};font-size:14px;outline:none;box-sizing:border-box;`;
  const labelStyle = `display:block;font-size:13px;font-weight:500;color:${s.labelColor ?? "#374151"};margin-bottom:5px;`;

  const nameField = c.showNameField
    ? `<div style="flex:1;min-width:0;"><label style="${labelStyle}">Full Name *</label><input type="text" placeholder="${c.namePlaceholder ?? "John Doe"}" style="${inputStyle}"/></div>`
    : "";
  const emailField = c.showEmailField
    ? `<div style="flex:1;min-width:0;"><label style="${labelStyle}">Email Address *</label><input type="email" placeholder="${c.emailPlaceholder ?? "johndoe@example.com"}" style="${inputStyle}"/></div>`
    : "";
  const phoneField = c.showPhoneField
    ? `<div style="flex:1;min-width:0;"><label style="${labelStyle}">Phone Number</label><input type="tel" placeholder="${c.phonePlaceholder ?? "+1 (555) 000-0000"}" style="${inputStyle}"/></div>`
    : "";

  const dropdownOptions = (c.dropdownOptions as string[] | undefined) ?? [];
  const dropdownField = c.showDropdown
    ? `<div style="flex:1;min-width:0;"><label style="${labelStyle}">${c.dropdownLabel ?? "Subject"}</label><select style="${inputStyle}cursor:pointer;">${dropdownOptions.map((o) => `<option>${o}</option>`).join("")}</select></div>`
    : "";

  const messageField = c.showMessageField
    ? `<div><label style="${labelStyle}">Your Message *</label><textarea rows="4" placeholder="${c.messagePlaceholder ?? "Type your message..."}" style="${inputStyle}resize:vertical;"></textarea></div>`
    : "";

  const topRow = nameField || emailField ? `<div style="display:flex;gap:14px;flex-wrap:wrap;">${nameField}${emailField}</div>` : "";
  const midRow = phoneField || dropdownField ? `<div style="display:flex;gap:14px;flex-wrap:wrap;">${phoneField}${dropdownField}</div>` : "";

  return `
    <div style="display:flex;flex-direction:column;gap:16px;">
      ${topRow}
      ${midRow}
      ${messageField}
      <button type="button" style="width:100%;padding:14px;background:${s.submitBgColor ?? "#FACC15"};color:${s.submitTextColor ?? "#111111"};border:none;border-radius:${s.submitBorderRadius ?? "8px"};font-size:15px;font-weight:${s.submitFontWeight ?? "600"};cursor:pointer;transition:background 0.2s;" onmouseover="this.style.background='${s.submitHoverBgColor ?? "#FDE047"}'" onmouseout="this.style.background='${s.submitBgColor ?? "#FACC15"}'">
        ${c.submitLabel ?? "Submit Inquiry →"}
      </button>
    </div>`;
}

function renderEditorOverlay(data: ContactWidgetData): string {
  const widgetId = data.id;
  const c = data.content;
  const modalId = `wto-contact-modal-${widgetId}`;
  const textareaId = `wto-contact-input-${widgetId}`;
  const heightInputId = `wto-contact-height-${widgetId}`;
  const isEmbed = c.formType === "custom_embed";

  return `
    <div class="wto-contact-hover-bar" style="position: absolute; top: 12px; right: 16px; z-index: 1000; opacity: 0; pointer-events: none; transition: opacity 0.2s ease;">
      <button type="button" onclick="(function(e){ e.stopPropagation(); var m=document.getElementById('${modalId}'); if(m) m.style.display='flex'; })(event)" style="display: inline-flex; align-items: center; gap: 7px; padding: 7px 14px; background: #0f172a; color: #ffffff; border: 1.5px solid #FACC15; border-radius: 20px; font-size: 12px; font-weight: 600; cursor: pointer; box-shadow: 0 6px 20px rgba(0,0,0,0.3); pointer-events: auto;">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#FACC15" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        <span>Replace Form / Embed Jotform</span>
      </button>
    </div>

    <!-- Interactive Jotform / Custom Embed Modal in Canvas -->
    <div id="${modalId}" style="display: none; position: fixed; inset: 0; z-index: 999999; background: rgba(0,0,0,0.75); backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px); align-items: center; justify-content: center; padding: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;" onclick="if(event.target===this) this.style.display='none';">
      <div style="background: #18181b; border: 1px solid #3f3f46; border-radius: 16px; width: 100%; max-width: 580px; box-shadow: 0 24px 60px rgba(0,0,0,0.6); overflow: hidden;" onclick="event.stopPropagation();">
        <div style="display: flex; align-items: center; justify-content: space-between; padding: 18px 22px; border-bottom: 1px solid #27272a; background: #09090b;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <div style="width: 32px; height: 32px; border-radius: 8px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center;">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#FACC15" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
            </div>
            <div>
              <div style="font-weight: 700; font-size: 15px; color: #fafafa;">Form Settings & Jotform Embed</div>
              <div style="font-size: 12px; color: #a1a1aa;">Choose built-in form or paste Jotform / third-party embed code</div>
            </div>
          </div>
          <button type="button" onclick="document.getElementById('${modalId}').style.display='none';" style="border: 0; background: transparent; color: #a1a1aa; font-size: 20px; cursor: pointer; padding: 4px 8px; line-height: 1;">&times;</button>
        </div>

        <div style="padding: 22px; max-height: calc(85vh - 120px); overflow-y: auto;">
          <!-- Form Mode Switcher -->
          <div style="margin-bottom: 16px;">
            <label style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #d4d4d8; margin-bottom: 8px;">
              Form Mode
            </label>
            <div style="display: flex; gap: 10px;">
              <label style="flex: 1; display: flex; align-items: center; gap: 8px; background: #27272a; padding: 10px 14px; border-radius: 8px; cursor: pointer; border: 1px solid #3f3f46;">
                <input type="radio" name="wto_form_type_${widgetId}" value="standard" ${!isEmbed ? "checked" : ""} style="accent-color: #FACC15;" onchange="(function(){ document.getElementById('embed-box-${widgetId}').style.display='none'; })()" />
                <span style="font-size: 13px; font-weight: 500; color: #fafafa;">Built-in Form</span>
              </label>
              <label style="flex: 1; display: flex; align-items: center; gap: 8px; background: #27272a; padding: 10px 14px; border-radius: 8px; cursor: pointer; border: 1px solid #3f3f46;">
                <input type="radio" name="wto_form_type_${widgetId}" value="custom_embed" ${isEmbed ? "checked" : ""} style="accent-color: #FACC15;" onchange="(function(){ document.getElementById('embed-box-${widgetId}').style.display='block'; })()" />
                <span style="font-size: 13px; font-weight: 500; color: #fafafa;">Jotform / Custom Embed</span>
              </label>
            </div>
          </div>

          <!-- Embed Code Section -->
          <div id="embed-box-${widgetId}" style="display: ${isEmbed ? "block" : "none"};">
            <label style="display: block; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #d4d4d8; margin-bottom: 8px;">
              Paste Jotform Embed Code, Script, or Form Link
            </label>
            <textarea id="${textareaId}" rows="5" placeholder="&lt;iframe src=&quot;https://form.jotform.com/21234567890&quot; ...&gt;&lt;/iframe&gt; or &lt;script src=&quot;...&quot;&gt;&lt;/script&gt; or https://form.jotform.com/..." style="width: 100%; box-sizing: border-box; background: #09090b; border: 1px solid #3f3f46; border-radius: 10px; color: #fafafa; font-family: monospace; font-size: 12px; padding: 12px; resize: vertical; outline: none;">${escapeAttr(String(c.customEmbedCode ?? ""))}</textarea>

            <div style="margin-top: 12px; display: flex; align-items: center; gap: 10px;">
              <label style="font-size: 12px; color: #d4d4d8; font-weight: 500; white-space: nowrap;">Form Height:</label>
              <input type="text" id="${heightInputId}" value="${escapeAttr(String(c.customEmbedHeight ?? "520px"))}" placeholder="520px" style="background: #09090b; border: 1px solid #3f3f46; border-radius: 6px; color: #fafafa; padding: 6px 10px; font-size: 12px; width: 90px;" />
            </div>

            <div style="margin-top: 14px; background: rgba(250, 204, 21, 0.08); border: 1px solid rgba(250, 204, 21, 0.2); border-radius: 10px; padding: 12px 14px; font-size: 12px; color: #a1a1aa; line-height: 1.5;">
              <strong style="color: #FACC15;">How to get Jotform embed code:</strong>
              <ol style="margin: 6px 0 0 0; padding-left: 18px; color: #d4d4d8;">
                <li>Open your form in <a href="https://www.jotform.com" target="_blank" rel="noopener noreferrer" style="color: #60a5fa; text-decoration: underline;">Jotform</a>.</li>
                <li>Go to the <strong>Publish</strong> tab at the top.</li>
                <li>Click <strong>Embed</strong> &rarr; Click <strong>Copy Code</strong> (or choose <strong>Iframe</strong> &rarr; Copy Code).</li>
                <li>Paste it into the box above and click Save.</li>
              </ol>
            </div>
          </div>
        </div>

        <div style="display: flex; align-items: center; justify-content: flex-end; gap: 10px; padding: 14px 22px; border-top: 1px solid #27272a; background: #09090b;">
          <button type="button" onclick="document.getElementById('${modalId}').style.display='none';" style="padding: 8px 16px; background: transparent; border: 1px solid #3f3f46; border-radius: 8px; color: #d4d4d8; font-size: 13px; font-weight: 500; cursor: pointer;">Cancel</button>
          <button type="button" onclick="(function(){
            var radios = document.getElementsByName('wto_form_type_${widgetId}');
            var selectedType = 'standard';
            for (var i = 0; i < radios.length; i++) {
              if (radios[i].checked) { selectedType = radios[i].value; break; }
            }
            var embedCode = document.getElementById('${textareaId}') ? document.getElementById('${textareaId}').value.trim() : '';
            var embedHeight = document.getElementById('${heightInputId}') ? document.getElementById('${heightInputId}').value.trim() : '520px';
            try {
              window.parent.postMessage({
                __wto: true,
                type: 'contact-embed-update',
                payload: {
                  widgetId: '${widgetId}',
                  formType: selectedType,
                  customEmbedCode: embedCode,
                  customEmbedHeight: embedHeight || '520px'
                }
              }, '*');
            } catch(e) {}
            document.getElementById('${modalId}').style.display = 'none';
          })()" style="padding: 8px 20px; background: #FACC15; border: 0; border-radius: 8px; color: #09090b; font-size: 13px; font-weight: 600; cursor: pointer;">Save & Update Form</button>
        </div>
      </div>
    </div>
  `;
}

function buildSplitLayout(data: ContactWidgetData, context?: ExportContext): string {
  const c = data.content;
  const s = data.style;
  const l = data.layout;
  const isEditor = !!context?.editorMode;

  const formCard = `
    <div class="wto-contact-form-container" style="position: relative; background:${s.formBgColor ?? "#ffffff"};border-radius:${s.formBorderRadius ?? "12px"};border:1px solid ${s.formBorderColor ?? "#e5e7eb"};${s.formShadow ? "box-shadow:0 4px 24px rgba(0,0,0,0.08);" : ""}padding:32px;">
      ${isEditor ? renderEditorOverlay(data) : ""}
      <h3 style="font-size:22px;font-weight:700;color:${s.formTitleColor ?? "#111827"};margin:0 0 6px;">${c.formTitle ?? "Send Us a Message"}</h3>
      <p style="font-size:13px;color:${s.formSubtitleColor ?? "#6b7280"};margin:0 0 24px;">${c.formSubtitle ?? ""}</p>
      ${buildFormHtml(data)}
    </div>`;

  return `
    <section class="wto-contact-section wto-contact-section-${data.id}" style="background:${s.backgroundColor ?? "#ffffff"};padding:${l.paddingTop ?? "80px"} ${l.paddingX ?? "24px"} ${l.paddingBottom ?? "80px"};">
      <div style="max-width:${l.maxWidth ?? "1200px"};margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;">
        <div>
          ${c.showEyebrow ? `<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${s.eyebrowColor ?? "#FACC15"};margin-bottom:10px;">${c.eyebrow}</div>` : ""}
          <h2 style="font-size:34px;font-weight:700;color:${s.headingColor ?? "#111827"};margin:0 0 14px;line-height:1.2;">${c.heading}</h2>
          <p style="font-size:15px;color:${s.descriptionColor ?? "#4b5563"};line-height:1.7;margin:0 0 36px;">${c.description}</p>
          ${buildInfoHtml(data)}
        </div>
        <div>${formCard}</div>
      </div>
    </section>`;
}

function buildCenteredFormLayout(data: ContactWidgetData, context?: ExportContext): string {
  const c = data.content;
  const s = data.style;
  const l = data.layout;
  const isEditor = !!context?.editorMode;

  return `
    <section class="wto-contact-section wto-contact-section-${data.id}" style="background:${s.backgroundColor ?? "#f9fafb"};padding:${l.paddingTop ?? "80px"} ${l.paddingX ?? "24px"} ${l.paddingBottom ?? "80px"};">
      <div style="max-width:640px;margin:0 auto;text-align:center;">
        ${c.showEyebrow ? `<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${s.eyebrowColor ?? "#FACC15"};margin-bottom:10px;">${c.eyebrow}</div>` : ""}
        <h2 style="font-size:32px;font-weight:700;color:${s.headingColor ?? "#111827"};margin:0 0 12px;">${c.heading}</h2>
        <p style="font-size:15px;color:${s.descriptionColor ?? "#6b7280"};line-height:1.7;margin:0 0 36px;">${c.description}</p>
      </div>
      <div class="wto-contact-form-container" style="position: relative; max-width:640px;margin:0 auto;background:${s.formBgColor ?? "#ffffff"};border-radius:${s.formBorderRadius ?? "14px"};border:1px solid ${s.formBorderColor ?? "#e5e7eb"};${s.formShadow ? "box-shadow:0 8px 32px rgba(0,0,0,0.08);" : ""}padding:36px;">
        ${isEditor ? renderEditorOverlay(data) : ""}
        ${buildFormHtml(data)}
      </div>
    </section>`;
}

function buildDarkLayout(data: ContactWidgetData, context?: ExportContext): string {
  const c = data.content;
  const l = data.layout;
  const s = { ...data.style };
  const isEditor = !!context?.editorMode;

  const bg = "#111827";
  const infoBg = "#1f2937";
  const formBg = "#1f2937";
  const headingCol = s.headingColor ?? "#ffffff";
  const descCol = s.descriptionColor ?? "#9ca3af";
  const eyebrowCol = s.eyebrowColor ?? "#FACC15";
  const infoIconCol = s.infoIconColor ?? "#FACC15";
  const infoLabelCol = s.infoLabelColor ?? "#f3f4f6";
  const infoValueCol = s.infoValueColor ?? "#9ca3af";
  const formTitleCol = s.formTitleColor ?? "#ffffff";
  const formSubCol = s.formSubtitleColor ?? "#9ca3af";

  const infoItems = ((c.infoItems as ContactInfoItem[]) ?? [])
    .map(
      (item) => `
    <div style="display:flex;align-items:flex-start;gap:14px;margin-bottom:22px;">
      <div style="flex-shrink:0;width:40px;height:40px;border-radius:10px;background:${infoIconCol}22;display:flex;align-items:center;justify-content:center;">
        ${iconSvg(item.icon, infoIconCol)}
      </div>
      <div>
        <div style="font-weight:600;font-size:14px;color:${infoLabelCol};margin-bottom:3px;">${item.label}</div>
        <div style="font-size:13px;color:${infoValueCol};line-height:1.5;">${item.value}</div>
      </div>
    </div>`
    )
    .join("");

  return `
    <section class="wto-contact-section wto-contact-section-${data.id}" style="background:${bg};padding:${l.paddingTop ?? "80px"} ${l.paddingX ?? "24px"} ${l.paddingBottom ?? "80px"};">
      <div style="max-width:${l.maxWidth ?? "1200px"};margin:0 auto;display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:start;">
        <div style="background:${infoBg};border-radius:14px;padding:32px;">
          ${c.showEyebrow ? `<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${eyebrowCol};margin-bottom:10px;">${c.eyebrow}</div>` : ""}
          <h2 style="font-size:30px;font-weight:700;color:${headingCol};margin:0 0 12px;">${c.heading}</h2>
          <p style="font-size:14px;color:${descCol};line-height:1.7;margin:0 0 30px;">${c.description}</p>
          ${infoItems}
        </div>
        <div class="wto-contact-form-container" style="position: relative; background:${formBg};border-radius:14px;padding:32px;">
          ${isEditor ? renderEditorOverlay(data) : ""}
          <h3 style="font-size:20px;font-weight:700;color:${formTitleCol};margin:0 0 6px;">${c.formTitle}</h3>
          <p style="font-size:13px;color:${formSubCol};margin:0 0 22px;">${c.formSubtitle}</p>
          ${buildFormHtml(data)}
        </div>
      </div>
    </section>`;
}

function buildMinimalCardLayout(data: ContactWidgetData, context?: ExportContext): string {
  const c = data.content;
  const s = data.style;
  const l = data.layout;
  const isEditor = !!context?.editorMode;

  const infoItems = ((c.infoItems as ContactInfoItem[]) ?? [])
    .map(
      (item) => `
    <a href="#" style="display:flex;align-items:center;gap:14px;padding:16px;border-radius:10px;border:1px solid ${s.formBorderColor ?? "#e5e7eb"};text-decoration:none;transition:border-color 0.2s;" onmouseover="this.style.borderColor='${s.infoIconColor ?? "#FACC15"}'" onmouseout="this.style.borderColor='${s.formBorderColor ?? "#e5e7eb"}'">
      <div style="flex-shrink:0;width:44px;height:44px;border-radius:10px;background:${s.infoIconColor ?? "#FACC15"}18;display:flex;align-items:center;justify-content:center;">
        ${iconSvg(item.icon, s.infoIconColor ?? "#FACC15")}
      </div>
      <div>
        <div style="font-size:11px;text-transform:uppercase;letter-spacing:1px;color:${s.infoValueColor ?? "#6b7280"};margin-bottom:2px;">${item.label}</div>
        <div style="font-size:14px;font-weight:600;color:${s.infoLabelColor ?? "#111827"};">${item.value}</div>
      </div>
    </a>`
    )
    .join("");

  return `
    <section class="wto-contact-section wto-contact-section-${data.id}" style="background:${s.backgroundColor ?? "#ffffff"};padding:${l.paddingTop ?? "80px"} ${l.paddingX ?? "24px"} ${l.paddingBottom ?? "80px"};">
      <div style="max-width:${l.maxWidth ?? "1200px"};margin:0 auto;">
        <div style="text-align:center;margin-bottom:48px;">
          ${c.showEyebrow ? `<div style="font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;color:${s.eyebrowColor ?? "#FACC15"};margin-bottom:10px;">${c.eyebrow}</div>` : ""}
          <h2 style="font-size:34px;font-weight:700;color:${s.headingColor ?? "#111827"};margin:0 0 12px;">${c.heading}</h2>
          <p style="font-size:15px;color:${s.descriptionColor ?? "#6b7280"};max-width:560px;margin:0 auto;">${c.description}</p>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px;margin-bottom:48px;">
          ${infoItems}
        </div>
        <div class="wto-contact-form-container" style="position: relative; max-width:640px;margin:0 auto;background:${s.formBgColor ?? "#ffffff"};border-radius:${s.formBorderRadius ?? "14px"};border:1px solid ${s.formBorderColor ?? "#e5e7eb"};${s.formShadow ? "box-shadow:0 4px 24px rgba(0,0,0,0.07);" : ""}padding:36px;">
          ${isEditor ? renderEditorOverlay(data) : ""}
          ${buildFormHtml(data)}
        </div>
      </div>
    </section>`;
}

export function buildContactBootstrapMarkup(data: ContactWidgetData, context?: ExportContext): string {
  if (data.advanced?.visibility === false) return "";

  const isEditor = !!context?.editorMode;
  const hoverStyle = isEditor
    ? `
      <style>
        .wto-contact-section-${data.id} .wto-contact-form-container:hover .wto-contact-hover-bar {
          opacity: 1 !important;
          pointer-events: auto !important;
        }
      </style>
    `
    : "";

  let html = "";
  switch (data.variant as ContactVariant) {
    case "Centered Form":
      html = buildCenteredFormLayout(data, context);
      break;
    case "Dark Side-by-Side":
      html = buildDarkLayout(data, context);
      break;
    case "Minimal Card":
      html = buildMinimalCardLayout(data, context);
      break;
    default:
      html = buildSplitLayout(data, context);
      break;
  }

  return `${hoverStyle}${html}`;
}
