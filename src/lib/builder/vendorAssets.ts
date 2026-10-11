import {
  BOOTSTRAP_BUNDLE_JS_CDN,
  BOOTSTRAP_CSS_CDN,
  FONT_AWESOME_CDN,
} from "./exportContributions";

export const JQUERY_CDN = "https://code.jquery.com/jquery-3.7.1.min.js";

const vendorCache: Record<string, string> = {};
const webfontCache: Record<string, string> = {};

const webfontFiles = [
  "fa-solid-900.woff2",
  "fa-brands-400.woff2",
  "fa-regular-400.woff2",
  "fa-v4compatibility.woff2",
];

export async function fetchVendorFile(filename: string, cdnFallbackUrl: string): Promise<string> {
  if (vendorCache[filename]) {
    return vendorCache[filename];
  }

  // 1. Try local /vendor/ path served by Vite / public folder
  if (typeof window !== "undefined") {
    try {
      const localRes = await fetch(`/vendor/${filename}`);
      if (localRes.ok) {
        const text = await localRes.text();
        if (text && text.length > 50) {
          vendorCache[filename] = text;
          return text;
        }
      }
    } catch (_) {}
  } else {
    try {
      const localRes = await fetch(`http://localhost:8080/vendor/${filename}`);
      if (localRes.ok) {
        const text = await localRes.text();
        if (text && text.length > 50) {
          vendorCache[filename] = text;
          return text;
        }
      }
    } catch (_) {}
  }

  // 2. Fallback to CDN
  try {
    const cdnRes = await fetch(cdnFallbackUrl);
    if (cdnRes.ok) {
      const text = await cdnRes.text();
      if (text) {
        vendorCache[filename] = text;
        return text;
      }
    }
  } catch (_) {}

  return "";
}

export async function getJQueryScript(): Promise<string> {
  const content = await fetchVendorFile("jquery.min.js", JQUERY_CDN);
  if (content) return content;
  // Fallback minimal jQuery stub if network is completely inaccessible
  return `/*! jQuery stub v3.7.1 fallback */
(function(window){
  var jQuery = function(selector, context){
    if (typeof selector === 'function') {
      if (document.readyState !== 'loading') selector(jQuery);
      else document.addEventListener('DOMContentLoaded', function(){ selector(jQuery); });
      return jQuery;
    }
    return document.querySelectorAll(selector);
  };
  window.jQuery = window.$ = jQuery;
})(window);`;
}

export async function getBootstrapBundleScript(): Promise<string> {
  return fetchVendorFile("bootstrap.bundle.min.js", BOOTSTRAP_BUNDLE_JS_CDN);
}

export async function getBootstrapStyles(): Promise<string> {
  return fetchVendorFile("bootstrap.min.css", BOOTSTRAP_CSS_CDN);
}

export async function getFontAwesomeStyles(): Promise<string> {
  return fetchVendorFile("all.min.css", FONT_AWESOME_CDN);
}

export async function getFontAwesomeWebfonts(): Promise<{ path: string; base64: string }[]> {
  const result: { path: string; base64: string }[] = [];
  for (const filename of webfontFiles) {
    if (webfontCache[filename]) {
      result.push({ path: `webfonts/${filename}`, base64: webfontCache[filename] });
      continue;
    }
    const cdnUrl = `https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/${filename}`;
    const localUrl = typeof window !== "undefined"
      ? `/vendor/webfonts/${filename}`
      : `http://localhost:8080/vendor/webfonts/${filename}`;

    try {
      let res = await fetch(localUrl);
      if (!res.ok) {
        res = await fetch(cdnUrl);
      }
      if (res.ok) {
        const buffer = await res.arrayBuffer();
        const bytes = Array.from(new Uint8Array(buffer), (b) => String.fromCharCode(b)).join("");
        const base64 = btoa(bytes);
        webfontCache[filename] = base64;
        result.push({ path: `webfonts/${filename}`, base64 });
      }
    } catch (_) {}
  }
  return result;
}
