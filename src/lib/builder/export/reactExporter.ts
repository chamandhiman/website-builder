import type { PageSection, Project } from "../store";
import { getImageBlob, getAssetValue, type BuilderAssetEntry } from "../image-storage";
import { getWidgetExportContribution } from "@/components/builder/widgets/widgetRegistry";
import {
  BOOTSTRAP_BUNDLE_JS_CDN,
  BOOTSTRAP_CSS_CDN,
  FONT_AWESOME_CDN,
  GOOGLE_FONTS_CDN,
  DEFAULT_FAVICON_BASE64,
  dedupeCssBlocks,
  extractStyleTags,
} from "../exportContributions";
import { composePageSections, isNavbarSection, isFooterSection } from "../sharedChrome";
import { WTO_CAROUSEL_RUNTIME } from "@/components/builder/widgets/Carousel/CarouselRuntime";
import { WTO_FAQ_RUNTIME } from "@/components/builder/widgets/FAQ/FAQRuntime";
import {
  RUNTIME_CSS,
  applyRootAttributes,
  escapeHtml,
  normalizeAssetRef,
  resolvePageLinks,
  sectionAttrs,
  stripEditorOnlyMarkup,
  styleToString,
} from "../preview";
import JSZip from "jszip";
import { toast } from "sonner";

export type ReactExportFile = {
  path: string;
  content: string;
  base64?: string;
};

export type ReactExportResult = {
  projectName: string;
  slug: string;
  files: ReactExportFile[];
};

const VOID_ELEMENTS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr",
]);

const BOOLEAN_ATTRS = new Set([
  "allowfullscreen",
  "async",
  "autofocus",
  "autoplay",
  "checked",
  "controls",
  "default",
  "defer",
  "disabled",
  "formnovalidate",
  "hidden",
  "ismap",
  "itemscope",
  "loop",
  "multiple",
  "muted",
  "nomodule",
  "novalidate",
  "open",
  "playsinline",
  "readonly",
  "required",
  "reversed",
  "selected",
]);

const ATTR_NAME_MAP: Record<string, string> = {
  class: "className",
  for: "htmlFor",
  tabindex: "tabIndex",
  autocomplete: "autoComplete",
  autofocus: "autoFocus",
  autoplay: "autoPlay",
  readonly: "readOnly",
  novalidate: "noValidate",
  maxlength: "maxLength",
  minlength: "minLength",
  cellspacing: "cellSpacing",
  cellpadding: "cellPadding",
  rowspan: "rowSpan",
  colspan: "colSpan",
  contenteditable: "contentEditable",
  crossorigin: "crossOrigin",
  enctype: "encType",
  formaction: "formAction",
  frameborder: "frameBorder",
  hreflang: "hrefLang",
  ismap: "isMap",
  playsinline: "playsInline",
  usemap: "useMap",
  srcset: "srcSet",
  // SVG attributes
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-opacity": "strokeOpacity",
  "fill-opacity": "fillOpacity",
  "fill-rule": "fillRule",
  "clip-path": "clipPath",
  "clip-rule": "clipRule",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "xmlns:xlink": "xmlnsXlink",
  "xlink:href": "xlinkHref",
  "xml:space": "xmlSpace",
};

/**
 * Sanitizes project name into a valid npm package / directory name.
 */
export function slugifyProjectName(name?: string | null): string {
  if (!name || !name.trim()) return "my-react-website";
  const slug = name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "my-react-website";
}

/**
 * Converts CSS declaration string into JSX style object string.
 * e.g. "color: #fff; margin-top: 10px;" -> '{{ color: "#fff", marginTop: "10px" }}'
 */
export function cssStringToJsxStyle(styleStr: string): string {
  if (!styleStr || !styleStr.trim()) return "{}";
  const declarations = styleStr.split(";").map((s) => s.trim()).filter(Boolean);
  const entries: string[] = [];

  for (const decl of declarations) {
    const colonIdx = decl.indexOf(":");
    if (colonIdx === -1) continue;
    const rawProp = decl.slice(0, colonIdx).trim();
    const rawVal = decl.slice(colonIdx + 1).trim();
    if (!rawProp || !rawVal) continue;

    let propKey = rawProp;
    if (!rawProp.startsWith("--")) {
      propKey = rawProp.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    }

    const keyStr = propKey.includes("-") ? JSON.stringify(propKey) : propKey;
    entries.push(`${keyStr}: ${JSON.stringify(rawVal)}`);
  }

  if (entries.length === 0) return "{}";
  return `{{ ${entries.join(", ")} }}`;
}

function escapeJsxAttr(value: string): string {
  return value.replace(/"/g, "&quot;");
}

function escapeJsxText(text: string): string {
  return text.replace(/{/g, '{"{"}').replace(/}/g, '{"}"}');
}

/**
 * AST walker converting browser DOM node to clean JSX string.
 */
function domNodeToJsx(node: Node, indent = "    "): string {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent || "";
    if (!text) return "";
    if (/^\s+$/.test(text)) {
      return text.includes("\n") ? "" : " ";
    }
    return escapeJsxText(text);
  }

  if (node.nodeType === Node.COMMENT_NODE) {
    const comment = node.textContent || "";
    return `{/* ${comment.trim()} */}`;
  }

  if (node.nodeType === Node.ELEMENT_NODE) {
    const el = node as HTMLElement;
    const tag = el.tagName.toLowerCase();

    // Ignore inline scripts inside JSX — handled by runtime
    if (tag === "script") return "";

    const attrs: string[] = [];
    const attrNames = el.getAttributeNames ? el.getAttributeNames() : [];

    for (const rawName of attrNames) {
      if (rawName.startsWith("on")) continue;
      if (rawName.startsWith("data-builder-") || rawName.startsWith("data-wto-editor")) continue;

      const val = el.getAttribute(rawName) ?? "";

      if (rawName === "class") {
        attrs.push(`className="${escapeJsxAttr(val)}"`);
        continue;
      }
      if (rawName === "for") {
        attrs.push(`htmlFor="${escapeJsxAttr(val)}"`);
        continue;
      }
      if (rawName === "style") {
        const jsxStyle = cssStringToJsxStyle(val);
        if (jsxStyle !== "{}") {
          attrs.push(`style=${jsxStyle}`);
        }
        continue;
      }
      if (tag === "input" && rawName === "value") {
        attrs.push(`defaultValue="${escapeJsxAttr(val)}"`);
        continue;
      }
      if (tag === "input" && rawName === "checked") {
        attrs.push(`defaultChecked={true}`);
        continue;
      }
      if (tag === "textarea" && rawName === "value") {
        attrs.push(`defaultValue="${escapeJsxAttr(val)}"`);
        continue;
      }

      const lowerName = rawName.toLowerCase();
      const mappedName = ATTR_NAME_MAP[lowerName] || rawName;

      if (BOOLEAN_ATTRS.has(lowerName)) {
        if (val === "" || val.toLowerCase() === lowerName || val === "true") {
          attrs.push(mappedName);
          continue;
        }
      }

      attrs.push(`${mappedName}="${escapeJsxAttr(val)}"`);
    }

    if (tag === "form") {
      attrs.push(`onSubmit={(e) => e.preventDefault()}`);
    }

    const attrStr = attrs.length > 0 ? " " + attrs.join(" ") : "";

    if (VOID_ELEMENTS.has(tag)) {
      return `<${tag}${attrStr} />`;
    }

    let childrenJsx = "";
    const children = Array.from(el.childNodes);
    for (const child of children) {
      childrenJsx += domNodeToJsx(child, indent + "  ");
    }

    if (!childrenJsx.trim()) {
      return `<${tag}${attrStr}></${tag}>`;
    }

    return `<${tag}${attrStr}>${childrenJsx}</${tag}>`;
  }

  return "";
}

/**
 * Pure regex / string based HTML-to-JSX fallback for non-DOM environments.
 */
function regexHtmlToJsx(html: string): string {
  let out = html;

  // 1. Comments
  out = out.replace(/<!--([\s\S]*?)-->/g, "{/* $1 */}");

  // 2. Class and For
  out = out.replace(/\sclass=(["'])(.*?)\1/gi, ' className="$2"');
  out = out.replace(/\sfor=(["'])(.*?)\1/gi, ' htmlFor="$2"');

  // 3. Style attribute to JSX
  out = out.replace(/\sstyle=(["'])(.*?)\1/gi, (_m, _q, styleContent: string) => {
    const jsxStyle = cssStringToJsxStyle(styleContent);
    return jsxStyle !== "{}" ? ` style=${jsxStyle}` : "";
  });

  // 4. Form onSubmit
  out = out.replace(/<form\b([^>]*)>/gi, (match, attrs: string) => {
    if (!attrs.includes("onSubmit")) {
      return `<form${attrs} onSubmit={(e) => e.preventDefault()}>`;
    }
    return match;
  });

  // 5. Input value to defaultValue
  out = out.replace(/<input\b([^>]*)\bvalue=(["'])(.*?)\2/gi, '<input$1defaultValue="$3"');
  out = out.replace(/<textarea\b([^>]*)\bvalue=(["'])(.*?)\2/gi, '<textarea$1defaultValue="$3"');

  // 6. SVG / camelCase attributes
  for (const [k, v] of Object.entries(ATTR_NAME_MAP)) {
    if (k !== "class" && k !== "for") {
      const reg = new RegExp(`\\s${k}=(["'])(.*?)\\1`, "gi");
      out = out.replace(reg, ` ${v}="$2"`);
    }
  }

  // 7. Void elements self-closing
  for (const voidTag of VOID_ELEMENTS) {
    const voidReg = new RegExp(`<(${voidTag})\\b([^>]*?)(?<!/)>`, "gi");
    out = out.replace(voidReg, "<$1$2 />");
  }

  // 8. Text curly braces escape outside of tags
  out = out.replace(/>([^<]+)</g, (_m, textContent: string) => {
    const escaped = escapeJsxText(textContent);
    return `>${escaped}<`;
  });

  return out.trim();
}

/**
 * Converts raw section HTML into clean, valid React JSX markup.
 */
export function htmlToJsx(html: string): string {
  const trimmed = (html || "").trim();
  if (!trimmed) return "<div></div>";

  if (typeof DOMParser !== "undefined") {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(`<body>${trimmed}</body>`, "text/html");
      const body = doc.body;
      const childNodes = Array.from(body.childNodes);

      if (childNodes.length === 1 && childNodes[0].nodeType === Node.ELEMENT_NODE) {
        return domNodeToJsx(childNodes[0]);
      }

      const pieces = childNodes.map((n) => domNodeToJsx(n)).filter(Boolean);
      return `<>\n      ${pieces.join("\n      ")}\n    </>`;
    } catch {
      return regexHtmlToJsx(trimmed);
    }
  }

  return regexHtmlToJsx(trimmed);
}

/**
 * Rewrites image and asset URLs from builder formats to Vite `/assets/...` public path.
 */
export function rewriteReactAssetPaths(
  content: string,
  assets?: Record<string, BuilderAssetEntry | string>,
): string {
  if (!content) return "";
  let out = content;

  // Replace standard builder image prefixes
  out = out.replace(/builder:\/\/images\/([^"'\s)>]+)/g, "/assets/$1");
  out = out.replace(/(?:(?:\.\/|\/)?images\/)([^"'\s)>]+)/g, "/assets/$1");

  if (assets) {
    for (const [name, value] of Object.entries(assets)) {
      const entry = typeof value === "string" ? undefined : value;
      const safeName = normalizeAssetRef(name);
      const filename = normalizeAssetRef(entry?.filename || safeName);
      const target = `/assets/${filename}`;

      const dataUrl = getAssetValue(value);
      if (dataUrl && /^data:/i.test(dataUrl)) {
        out = out.split(dataUrl).join(target);
      }

      const remoteUrl =
        typeof value === "string"
          ? value
          : entry?.url || entry?.previewSrc || entry?.src || "";
      if (/^https?:\/\//i.test(remoteUrl)) {
        const esc = remoteUrl.replace(/[.*+?^${}()|[\]\\/]/g, "\\$&");
        const pattern = new RegExp(`(^|[\\s"'=(])${esc}(?=$|[\\s"')>])`, "g");
        out = out.replace(pattern, `$1${target}`);
      }
    }
  }

  return out;
}

/**
 * PascalCase component name generator from section metadata.
 */
function generateComponentName(
  section: PageSection,
  index: number,
  usedNames: Set<string>,
): string {
  if (section.shared === "header" || isNavbarSection(section) || (section as any).role === "header") {
    return "Header";
  }
  if (section.shared === "footer" || isFooterSection(section) || (section as any).role === "footer") {
    return "Footer";
  }

  let base = (section.name || "")
    .trim()
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");

  if (!base || /^[0-9]/.test(base)) {
    base = `Section${index + 1}`;
  }

  let candidate = base;
  let counter = 2;
  while (usedNames.has(candidate)) {
    candidate = `${base}${counter}`;
    counter++;
  }
  usedNames.add(candidate);
  return candidate;
}

/**
 * PascalCase page name generator from page slug/name.
 */
function generatePageName(name: string, slug: string): string {
  const source = slug || name || "Page";
  let cleaned = source
    .trim()
    .replace(/[^a-zA-Z0-9\s_-]/g, "")
    .split(/[\s_-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join("");

  if (!cleaned || /^[0-9]/.test(cleaned)) {
    cleaned = "HomePage";
  }
  if (slug === "index" || slug === "home" || slug === "") {
    cleaned = "Home";
  }
  return cleaned;
}

/**
 * Builds the complete standalone Vite + React project files.
 */
export async function buildReactExport(project: Project): Promise<ReactExportResult> {
  const files: ReactExportFile[] = [];
  const projectSlug = slugifyProjectName(project.name);
  const pages = (project.pages ?? []).filter((page) => !page.hidden);
  const isMultiPage = pages.length > 1;

  // In React export, override [data-anim]{ opacity: 0; } so elements are never hidden
  const reactRuntimeCss = RUNTIME_CSS.replace(
    /\[data-anim\]\s*\{\s*opacity:\s*0;\s*\}/g,
    "[data-anim]{ opacity: 1; }"
  );

  const cssBlocks: string[] = [
    `@import url("${FONT_AWESOME_CDN}");`,
    `@import url("${GOOGLE_FONTS_CDN}");`,
    `/* Sticky Header */`,
    `header, .site-header, .wl-header, .wto-shared-header, [data-wto-shared="header"], [data-role="header"], [data-section-role="header"] { position: sticky !important; top: 0 !important; z-index: 1000 !important; width: 100% !important; }`,
    reactRuntimeCss,
    `/* Ensure data-anim elements are visible in React export */
[data-anim] {
  opacity: 1 !important;
  visibility: visible !important;
  transform: none !important;
}
[data-anim].wto-in {
  opacity: 1 !important;
}`,
    project.globalCss || "",
  ];

  // Include default favicon.png in public/
  files.push({
    path: "public/favicon.png",
    content: "",
    base64: DEFAULT_FAVICON_BASE64,
  });

  // 1. Process project assets into /public/assets/
  const processedAssetFilenames = new Set<string>();

  for (const [name, asset] of Object.entries(project.assets ?? {})) {
    const entry = typeof asset === "string" ? undefined : asset;
    const filename = normalizeAssetRef(entry?.filename || name);
    if (processedAssetFilenames.has(filename)) continue;
    processedAssetFilenames.add(filename);

    const blob = entry?.imageId ? await getImageBlob(entry.imageId) : null;
    if (blob) {
      const buffer = await blob.arrayBuffer();
      const bytes = Array.from(new Uint8Array(buffer), (b) => String.fromCharCode(b)).join("");
      files.push({
        path: `public/assets/${filename}`,
        content: "",
        base64: btoa(bytes),
      });
      continue;
    }

    if (typeof asset === "string" && /^data:/i.test(asset)) {
      const comma = asset.indexOf(",");
      const payload = comma >= 0 ? asset.slice(comma + 1) : "";
      const isBase64 = /;base64/i.test(asset.slice(0, Math.max(0, comma)));
      if (isBase64 && payload) {
        files.push({
          path: `public/assets/${filename}`,
          content: "",
          base64: payload,
        });
      }
      continue;
    }

    const remoteUrl =
      typeof asset === "string"
        ? asset
        : entry?.url || entry?.previewSrc || entry?.src || "";

    if (/^https?:\/\//i.test(remoteUrl) || /^\/?(?:images|templates)\//i.test(remoteUrl)) {
      try {
        const fetchUrl = /^https?:\/\//i.test(remoteUrl)
          ? remoteUrl
          : typeof window !== "undefined"
          ? new URL(remoteUrl.replace(/^\/?/, "/"), window.location.origin).href
          : null;
        if (fetchUrl) {
          const response = await fetch(fetchUrl);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const bytes = Array.from(new Uint8Array(arrayBuffer), (b) => String.fromCharCode(b)).join("");
            files.push({
              path: `public/assets/${filename}`,
              content: "",
              base64: btoa(bytes),
            });
          }
        }
      } catch {
        // Leave remote image as-is
      }
    }
  }

  // 2. Generate Section Components for every unique section
  const sectionComponentMap = new Map<string, { componentName: string; filename: string }>();
  const projectUsedNames = new Set<string>();

  // Process shared header and footer first
  if (project.sharedHeader) {
    const compName = "Header";
    projectUsedNames.add(compName);
    sectionComponentMap.set(project.sharedHeader.id, {
      componentName: compName,
      filename: `src/components/${compName}.jsx`,
    });
  }
  if (project.sharedFooter) {
    const compName = "Footer";
    projectUsedNames.add(compName);
    sectionComponentMap.set(project.sharedFooter.id, {
      componentName: compName,
      filename: `src/components/${compName}.jsx`,
    });
  }

  // Assign component names to each section in each page
  for (const page of pages) {
    const sections = composePageSections(project, page);
    for (let i = 0; i < sections.length; i++) {
      const s = sections[i];
      if (!sectionComponentMap.has(s.id)) {
        const compName = generateComponentName(s, i, projectUsedNames);
        sectionComponentMap.set(s.id, {
          componentName: compName,
          filename: `src/components/${compName}.jsx`,
        });
      }
    }
  }

  // Build the JSX file for each registered section component
  const writtenComponentFiles = new Set<string>();

  for (const page of pages) {
    const sections = composePageSections(project, page);
    for (const s of sections) {
      const meta = sectionComponentMap.get(s.id);
      if (!meta || writtenComponentFiles.has(meta.filename)) continue;
      writtenComponentFiles.add(meta.filename);

      // Extract section HTML, widget contribution, and styles
      const styleStr = styleToString(s.style);
      let rawHtml = s.html;
      if (s.widgetInstance) {
        const contribution = getWidgetExportContribution(s.widgetInstance.type, s.widgetInstance, {
          editorMode: false,
        });
        if (contribution.css) cssBlocks.push(contribution.css);
        rawHtml = contribution.html || s.html;
      }

      const extracted = extractStyleTags(rawHtml);
      if (extracted.css) cssBlocks.push(extracted.css);

      const raw = applyRootAttributes(extracted.html, {
        className: s.className,
        domId: s.domId,
        style: styleStr,
        fallbackTag: "section",
      });

      const pageMeta = pages.map((p) => ({ id: p.id, slug: p.slug }));
      const withLinks = resolvePageLinks(raw, pageMeta);
      const wrap = sectionAttrs(s);
      const wrapped = wrap ? `<div ${wrap}>${withLinks}</div>` : withLinks;

      let cleanedHtml = stripEditorOnlyMarkup(wrapped);
      cleanedHtml = rewriteReactAssetPaths(cleanedHtml, project.assets);

      // Multi-page link rewriting (e.g. href="about.html" -> href="/about")
      if (isMultiPage) {
        for (const p of pages) {
          const routePath = p.slug === "index" || p.slug === "home" || !p.slug ? "/" : `/${p.slug.replace(/^\//, "")}`;
          cleanedHtml = cleanedHtml.replace(
            new RegExp(`href=["'](?:\\./)?${p.slug}(?:\\.html)?["']`, "gi"),
            `href="${routePath}"`,
          );
        }
      }

      const jsxBody = htmlToJsx(cleanedHtml);

      const componentCode = `import React from 'react';

export default function ${meta.componentName}() {
  return (
    ${jsxBody}
  );
}
`;
      files.push({
        path: meta.filename,
        content: componentCode,
      });
    }
  }

  // 3. Generate Pages (if multi-page) and App.jsx
  if (isMultiPage) {
    const pageEntries: { pageName: string; routePath: string; componentImport: string }[] = [];

    for (const page of pages) {
      const pageName = generatePageName(page.name, page.slug);
      const routePath = page.slug === "index" || page.slug === "home" || !page.slug ? "/" : `/${page.slug.replace(/^\//, "")}`;
      const sections = composePageSections(project, page);

      const importedComponents: string[] = [];
      const renderedTags: string[] = [];

      for (const s of sections) {
        const meta = sectionComponentMap.get(s.id);
        if (meta && !importedComponents.includes(meta.componentName)) {
          importedComponents.push(meta.componentName);
        }
        if (meta) {
          renderedTags.push(`<${meta.componentName} />`);
        }
      }

      const importsCode = importedComponents
        .map((name) => `import ${name} from '../components/${name}';`)
        .join("\n");

      const pageCode = `import React from 'react';
${importsCode}

export default function ${pageName}() {
  return (
    <div className="page-wrapper page-${slugifyProjectName(page.slug)}">
      ${renderedTags.join("\n      ")}
    </div>
  );
}
`;
      files.push({
        path: `src/pages/${pageName}.jsx`,
        content: pageCode,
      });

      pageEntries.push({
        pageName,
        routePath,
        componentImport: `import ${pageName} from './pages/${pageName}';`,
      });
    }

    // Generate App.jsx with React Router
    const appImports = pageEntries.map((p) => p.componentImport).join("\n");
    const appRoutes = pageEntries
      .map((p) => `        <Route path="${p.routePath}" element={<${p.pageName} />} />`)
      .join("\n");

    const appCode = `import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
${appImports}
import { initWebsiteRuntime } from './runtime';

export default function App() {
  useEffect(() => {
    initWebsiteRuntime();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
${appRoutes}
      </Routes>
    </BrowserRouter>
  );
}
`;
    files.push({
      path: "src/App.jsx",
      content: appCode,
    });
  } else {
    // Single page website
    const homePage = pages[0] || project.pages?.[0];
    const sections = composePageSections(project, homePage);
    const importedComponents: string[] = [];
    const renderedTags: string[] = [];

    for (const s of sections) {
      const meta = sectionComponentMap.get(s.id);
      if (meta && !importedComponents.includes(meta.componentName)) {
        importedComponents.push(meta.componentName);
      }
      if (meta) {
        renderedTags.push(`<${meta.componentName} />`);
      }
    }

    const importsCode = importedComponents
      .map((name) => `import ${name} from './components/${name}';`)
      .join("\n");

    const appCode = `import React, { useEffect } from 'react';
${importsCode}
import { initWebsiteRuntime } from './runtime';

export default function App() {
  useEffect(() => {
    initWebsiteRuntime();
  }, []);

  return (
    <div className="website-root">
      ${renderedTags.join("\n      ")}
    </div>
  );
}
`;
    files.push({
      path: "src/App.jsx",
      content: appCode,
    });

    // Also generate src/pages/Home.jsx for consistency
    const homeImports = importedComponents
      .map((name) => `import ${name} from '../components/${name}';`)
      .join("\n");

    const homeCode = `import React from 'react';
${homeImports}

export default function Home() {
  return (
    <div className="page-wrapper page-home">
      ${renderedTags.join("\n      ")}
    </div>
  );
}
`;
    files.push({
      path: "src/pages/Home.jsx",
      content: homeCode,
    });
  }

  // 4. Runtime helper for carousels, accordions, and FAQs (src/runtime.js)
  const runtimeCode = `// Website runtime initialization for animations, carousels, FAQ accordions, and interactive elements
export function initWebsiteRuntime() {
  if (typeof window === 'undefined') return;
  try {
    // Ensure all data-anim elements are visible immediately
    if (typeof document !== 'undefined') {
      document.querySelectorAll('[data-anim]').forEach(function(el) {
        el.classList.add('wto-in');
      });

      if ('IntersectionObserver' in window) {
        var animObserver = new IntersectionObserver(function(entries) {
          entries.forEach(function(entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('wto-in');
            }
          });
        }, { threshold: 0.1 });

        document.querySelectorAll('[data-anim]').forEach(function(el) {
          animObserver.observe(el);
        });
      }
    }

    ${WTO_CAROUSEL_RUNTIME}
    ${WTO_FAQ_RUNTIME}
    ${project.globalJs || ""}
  } catch (err) {
    console.warn('Interactive runtime error:', err);
  }
}
`;
  files.push({
    path: "src/runtime.js",
    content: runtimeCode,
  });

  // 5. Stylesheet (src/styles/main.css)
  const dedupedCss = dedupeCssBlocks(cssBlocks);
  const rewrittenCss = rewriteReactAssetPaths(dedupedCss, project.assets);
  files.push({
    path: "src/styles/main.css",
    content: rewrittenCss,
  });

  // 6. website.json (src/data/website.json)
  const websiteData = {
    name: project.name || "My Website",
    description: project.description || "",
    pages: pages.map((p) => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      sectionsCount: (p.sections || []).length,
    })),
    exportedAt: new Date().toISOString(),
  };
  files.push({
    path: "src/data/website.json",
    content: JSON.stringify(websiteData, null, 2),
  });

  // 7. Entry main.jsx (src/main.jsx)
  const mainJsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/main.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;
  files.push({
    path: "src/main.jsx",
    content: mainJsx,
  });

  // 8. package.json
  const dependencies: Record<string, string> = {
    react: "^18.3.1",
    "react-dom": "^18.3.1",
  };
  if (isMultiPage) {
    dependencies["react-router-dom"] = "^6.26.2";
  }

  const packageJson = {
    name: projectSlug,
    private: true,
    version: "1.0.0",
    type: "module",
    scripts: {
      dev: "vite",
      build: "vite build",
      preview: "vite preview",
    },
    dependencies,
    devDependencies: {
      "@vitejs/plugin-react": "^4.3.1",
      vite: "^5.4.2",
    },
  };
  files.push({
    path: "package.json",
    content: JSON.stringify(packageJson, null, 2),
  });

  // 9. vite.config.js
  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
});
`;
  files.push({
    path: "vite.config.js",
    content: viteConfig,
  });

  // 10. index.html
  const pageTitle = pages[0]?.seo?.title || pages[0]?.name || project.name || "Website";
  const customHead = project.customHead || "";
  const indexHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(pageTitle)}</title>
    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.png" />
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link rel="stylesheet" href="${GOOGLE_FONTS_CDN}" />
    <!-- Font Awesome -->
    <link rel="stylesheet" href="${FONT_AWESOME_CDN}" crossorigin="anonymous" referrerpolicy="no-referrer" />
    <!-- Bootstrap CSS -->
    <link rel="stylesheet" href="${BOOTSTRAP_CSS_CDN}" />
    ${customHead}
  </head>
  <body>
    <div id="root"></div>
    <!-- Bootstrap Bundle JS -->
    <script src="${BOOTSTRAP_BUNDLE_JS_CDN}"></script>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`;
  files.push({
    path: "index.html",
    content: indexHtml,
  });

  // 11. README.md
  const readme = `# ${project.name || "My Website"}

This is a standalone React application generated with Website Builder.

## Getting Started

1. Install dependencies:
\`\`\`bash
npm install
\`\`\`

2. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

3. Build for production:
\`\`\`bash
npm run build
\`\`\`

4. Preview production build:
\`\`\`bash
npm run preview
\`\`\`
`;
  files.push({
    path: "README.md",
    content: readme,
  });

  return {
    projectName: project.name || "website",
    slug: projectSlug,
    files,
  };
}

/**
 * Generates and downloads the standalone React application as a ZIP file.
 */
export async function exportProjectAsReactZip(project: Project): Promise<void> {
  try {
    toast.loading("Generating standalone React project...", { id: "export-react-toast" });

    const exportData = await buildReactExport(project);
    const zip = new JSZip();

    for (const file of exportData.files) {
      if (file.base64) {
        zip.file(file.path, file.base64, { base64: true });
      } else {
        zip.file(file.path, file.content);
      }
    }

    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${exportData.slug}-react.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
    toast.success("React project exported successfully!", { id: "export-react-toast" });
  } catch (error: any) {
    console.error("React export error:", error);
    toast.error(`Failed to export React project: ${error?.message || "Unknown error"}`, {
      id: "export-react-toast",
    });
    throw error;
  }
}
