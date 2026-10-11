import {
  normalizeFaqConfig,
  createNewFaqWidget,
  FAQ_TEMPLATES,
  SAMPLE_FAQ_ITEMS,
} from "../src/services/faqTemplates";
import { renderFaqHtml } from "../src/lib/widget-runtime/faqRuntime";

console.log("=== Testing FAQ Widget Normalization & Runtime ===");

// Test 1: Empty config
const emptyNormalized = normalizeFaqConfig({});
if (!Array.isArray(emptyNormalized.items) || emptyNormalized.items.length === 0) {
  throw new Error("Test 1 failed: items should default to sample FAQ items");
}
console.log("✓ Test 1: Empty config normalized with items count =", emptyNormalized.items.length);

// Test 2: Old format where items was only in content.items
const oldFormat = normalizeFaqConfig({
  content: {
    items: [
      { id: "custom_1", question: "Custom Q?", answer: "Custom A" }
    ]
  }
});
if (!Array.isArray(oldFormat.items) || oldFormat.items.length !== 1 || oldFormat.items[0].question !== "Custom Q?") {
  throw new Error("Test 2 failed: items did not mirror content.items");
}
console.log("✓ Test 2: Mirrored content.items to items");

// Test 3: createNewFaqWidget
const widget = createNewFaqWidget("Test FAQ", "two_column_faq");
if (!widget.config.items || widget.config.items.length === 0) {
  throw new Error("Test 3 failed: createNewFaqWidget config.items is missing");
}
console.log("✓ Test 3: createNewFaqWidget config.items count =", widget.config.items.length);

// Test 4: renderFaqHtml
const rendered = renderFaqHtml(widget);
if (!rendered.html || !rendered.css) {
  throw new Error("Test 4 failed: renderFaqHtml failed to return html and css");
}
console.log("✓ Test 4: renderFaqHtml succeeded. HTML length =", rendered.html.length);

// Test 5: Safe serialization logic
const sampleWidget = {
  id: "test-wgt",
  type: "faq_accordion",
  name: "Test",
  config: undefined,
};
let safeConfig: any = {};
if (sampleWidget.config) {
  try {
    const serialized = JSON.stringify(sampleWidget.config);
    if (serialized && serialized !== "undefined") {
      safeConfig = JSON.parse(serialized);
    }
  } catch {
    safeConfig = {};
  }
}
console.log("✓ Test 5: Safe serialization on undefined config =", safeConfig);

// Test 6: Bordered FAQ template contrast
const borderedTpl = FAQ_TEMPLATES.bordered_faq;
if (borderedTpl.config.colors.rowBackground === "transparent" && borderedTpl.config.colors.questionColor === "#ffffff") {
  throw new Error("Test 6 failed: bordered_faq template has white text on transparent row");
}
console.log("✓ Test 6: bordered_faq has contrast questionColor =", borderedTpl.config.colors.questionColor);

// Test 7: Normalizing transparent/white row background with white text auto-adapts
const lightTransparentNorm = normalizeFaqConfig({
  colors: {
    rowBackground: "transparent",
    questionColor: "#ffffff",
    answerColor: "#ffffff",
  } as any,
});
if (lightTransparentNorm.colors.questionColor.toLowerCase() === "#ffffff") {
  throw new Error("Test 7 failed: transparent row did not auto-adapt white text to dark");
}
console.log("✓ Test 7: normalizeFaqConfig auto-adapted questionColor =", lightTransparentNorm.colors.questionColor);

// Test 8: renderFaqHtml on bordered_faq produces high contrast CSS
const borderedWidget = createNewFaqWidget("Bordered FAQ", "bordered_faq");
const borderedRendered = renderFaqHtml(borderedWidget);
if (!borderedRendered.css.includes("color: #0f172a") && !borderedRendered.css.includes("color: #111827")) {
  throw new Error("Test 8 failed: rendered bordered_faq does not contain dark question text");
}
console.log("✓ Test 8: renderFaqHtml for bordered_faq outputs dark high-contrast question color");

console.log("\nALL FAQ TESTS PASSED SUCCESSFULLY! 🎉\n");
