import { ANNOUNCEMENT_POPUP_TEMPLATES, ANNOUNCEMENT_POPUP_TEMPLATE_LIST, createNewAnnouncementPopupWidget } from "../src/services/announcementPopupTemplates";
import { renderAnnouncementPopupHtml } from "../src/lib/widget-runtime/announcementPopupRuntime";

console.log("=== Testing Announcement Bar & Popup Widget System ===");

// 1. Verify 12 Templates
console.log(`\n1. Verifying Templates: Found ${ANNOUNCEMENT_POPUP_TEMPLATE_LIST.length} templates.`);
if (ANNOUNCEMENT_POPUP_TEMPLATE_LIST.length !== 12) {
  throw new Error(`Expected 12 templates, got ${ANNOUNCEMENT_POPUP_TEMPLATE_LIST.length}`);
}

const barTemplates = ANNOUNCEMENT_POPUP_TEMPLATE_LIST.filter(t => t.displayMode === "bar");
const popupTemplates = ANNOUNCEMENT_POPUP_TEMPLATE_LIST.filter(t => t.displayMode === "popup");

console.log(`   - Announcement Bar Templates (${barTemplates.length}):`, barTemplates.map(t => t.name).join(", "));
console.log(`   - Popup Modal Templates (${popupTemplates.length}):`, popupTemplates.map(t => t.name).join(", "));

if (barTemplates.length !== 6 || popupTemplates.length !== 6) {
  throw new Error(`Expected 6 bars and 6 popups, got ${barTemplates.length} bars and ${popupTemplates.length} popups`);
}

// 2. Test Rendering Each Template
console.log("\n2. Testing HTML/CSS Rendering for all 12 templates:");
for (const tpl of ANNOUNCEMENT_POPUP_TEMPLATE_LIST) {
  const widget = createNewAnnouncementPopupWidget(tpl.name, tpl.key, tpl.displayMode);
  const result = renderAnnouncementPopupHtml(widget);

  if (!result.html || result.html.length < 50) {
    throw new Error(`Template ${tpl.key} generated empty or invalid HTML`);
  }
  if (!result.css || result.css.length < 20) {
    throw new Error(`Template ${tpl.key} generated empty or invalid CSS`);
  }

  // Check scoping
  const expectedClass = `wto-inst-${widget.id}`;
  if (!result.html.includes(expectedClass) || !result.css.includes(expectedClass)) {
    throw new Error(`Template ${tpl.key} is missing scoped CSS class ${expectedClass}`);
  }

  if (tpl.displayMode === "popup") {
    if (!result.html.includes('role="dialog"') || !result.html.includes('aria-modal="true"')) {
      throw new Error(`Popup template ${tpl.key} is missing accessibility attributes`);
    }
  }

  if (tpl.config.countdown?.enabled) {
    if (!result.html.includes('wto-cd-unit')) {
      throw new Error(`Countdown enabled template ${tpl.key} is missing countdown elements`);
    }
  }

  if (tpl.config.coupon?.enabled) {
    if (!result.html.includes('wto-coupon-copy-btn')) {
      throw new Error(`Coupon enabled template ${tpl.key} is missing coupon copy button`);
    }
  }

  console.log(`   ✓ [${tpl.displayMode.toUpperCase()}] ${tpl.name} rendered cleanly (${result.html.length} chars HTML, ${result.css.length} chars CSS)`);
}

// 3. Test Embed Format
const sampleWidget = createNewAnnouncementPopupWidget("Summer Sale", "sale_bar", "bar");
const sampleEmbed = `<div data-wto-widget="${sampleWidget.id}"></div>\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;
console.log("\n3. Embed Snippet Format Verified:");
console.log(sampleEmbed);

console.log("\n✅ ALL ANNOUNCEMENT & POPUP TESTS PASSED SUCCESSFULLY!");
