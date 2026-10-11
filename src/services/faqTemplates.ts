import { nanoid } from "nanoid";
import type { WidgetInstanceRecord } from "./widgetService";

export type FaqTemplateKey =
  | "classic_accordion"
  | "minimal_faq"
  | "card_faq"
  | "bordered_faq"
  | "modern_rounded"
  | "help_center"
  | "two_column_faq"
  | "simple_list";

export type FaqIconStyle = "chevron" | "plus_minus" | "arrow" | "caret";

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
  category?: string;
  isOpen?: boolean;
}

export interface FaqConfig {
  items: FaqItem[];
  template?: FaqTemplateKey;
  content: {
    heading: string;
    description: string;
    showHeading: boolean;
    showDescription: boolean;
    showSearch: boolean;
    searchPlaceholder: string;
    showCategories: boolean;
    categories: string[];
    selectedCategory?: string;
    items: FaqItem[];
  };
  layout: {
    template: FaqTemplateKey;
    columns: 1 | 2;
    alignment: "left" | "center";
    maxWidth: number | string;
    isFullWidth: boolean;
    questionSpacing: number;
    rowPadding: number;
    borderRadius: number;
    borderWidth: number;
    iconPosition: "left" | "right";
    showMoreLimit: number; // 0 for all
    showMoreText: string;
    showLessText: string;
    itemSpacing?: number;
    showHeader?: boolean;
    showSearch?: boolean;
    showCategories?: boolean;
  };
  behavior: {
    allowMultipleOpen: boolean;
    initialState: "all_collapsed" | "first_open";
    animationDurationMs: number;
    showExpandAllControls: boolean;
    supportUrl: string;
    supportText: string;
    emptySearchText: string;
    allowMultiple?: boolean;
    animationDuration?: number;
    showSupportLink?: boolean;
    supportButtonText?: string;
    noResultsText?: string;
    showMore?: boolean;
    itemsToShow?: number;
  };
  colors: {
    widgetBackground: string;
    headingColor: string;
    descriptionColor: string;
    questionColor: string;
    answerColor: string;
    rowBackground: string;
    expandedRowBackground: string;
    borderColor: string;
    iconColor: string;
    searchBackground: string;
    searchTextColor: string;
    categoryTagBackground: string;
    categoryTagTextColor: string;
    activeCategoryTagBackground: string;
    activeCategoryTagTextColor: string;
    widgetBg?: string;
    rowBg?: string;
    expandedRowBg?: string;
    searchBg?: string;
  };
  typography: {
    fontFamily: string;
    headingSize: number;
    questionSize: number;
    answerSize: number;
    fontWeight: string;
    lineHeight: string;
    questionFontSize?: number;
    answerFontSize?: number;
  };
  icons: {
    style: FaqIconStyle;
  };
  appearance?: {
    borderRadius?: number;
    borderWidth?: number;
    [key: string]: any;
  };
  advanced: {
    customTitle?: string;
    customCssClass?: string;
    structuredData?: boolean;
    customClass?: string;
    enableSchemaOrgFAQ?: boolean;
    inheritFont?: boolean;
  };
}

export interface FaqTemplateItem {
  key: FaqTemplateKey;
  name: string;
  description: string;
  badge: string;
  config: FaqConfig;
}

/**
 * Normalizes any FAQ configuration record to ensure all items, nested
 * structures, and property aliases are safely defined without runtime crashes.
 */
export function normalizeFaqConfig(raw: any): FaqConfig {
  if (!raw) raw = {};
  const cfg = { ...raw };

  const rawContent = cfg.content || {};
  const items: FaqItem[] = Array.isArray(cfg.items)
    ? cfg.items
    : (Array.isArray(rawContent.items) && rawContent.items.length > 0
        ? rawContent.items
        : (Array.isArray(SAMPLE_FAQ_ITEMS) ? SAMPLE_FAQ_ITEMS : []));

  cfg.items = items;
  cfg.content = {
    heading: rawContent.heading ?? cfg.heading ?? "Frequently Asked Questions",
    description: rawContent.description ?? cfg.description ?? "Everything you need to know about our products, billing, and services.",
    showHeading: rawContent.showHeading ?? cfg.showHeading ?? true,
    showDescription: rawContent.showDescription ?? cfg.showDescription ?? true,
    showSearch: rawContent.showSearch ?? cfg.showSearch ?? false,
    searchPlaceholder: rawContent.searchPlaceholder ?? "Search questions…",
    showCategories: rawContent.showCategories ?? cfg.showCategories ?? false,
    categories: rawContent.categories ?? ["General", "Billing", "Account", "Support"],
    selectedCategory: rawContent.selectedCategory ?? "All",
    items,
    ...rawContent,
  };
  cfg.content.items = items;

  cfg.layout = {
    template: cfg.layout?.template ?? cfg.template ?? "classic_accordion",
    columns: cfg.layout?.columns ?? 1,
    alignment: cfg.layout?.alignment ?? "center",
    maxWidth: cfg.layout?.maxWidth ?? 840,
    isFullWidth: cfg.layout?.isFullWidth ?? false,
    questionSpacing: cfg.layout?.questionSpacing ?? cfg.layout?.itemSpacing ?? 12,
    rowPadding: cfg.layout?.rowPadding ?? 18,
    borderRadius: cfg.layout?.borderRadius ?? 12,
    borderWidth: cfg.layout?.borderWidth ?? 1,
    iconPosition: cfg.layout?.iconPosition ?? "right",
    showMoreLimit: cfg.layout?.showMoreLimit ?? 0,
    showMoreText: cfg.layout?.showMoreText ?? "Show more questions",
    showLessText: cfg.layout?.showLessText ?? "Show less",
    itemSpacing: cfg.layout?.questionSpacing ?? cfg.layout?.itemSpacing ?? 12,
    showHeader: cfg.layout?.showHeader ?? rawContent.showHeading ?? true,
    showSearch: cfg.layout?.showSearch ?? rawContent.showSearch ?? false,
    showCategories: cfg.layout?.showCategories ?? rawContent.showCategories ?? false,
    ...(cfg.layout || {}),
  };
  cfg.template = cfg.layout.template;

  cfg.behavior = {
    allowMultipleOpen: cfg.behavior?.allowMultipleOpen ?? cfg.behavior?.allowMultiple ?? false,
    initialState: cfg.behavior?.initialState ?? "first_open",
    animationDurationMs: cfg.behavior?.animationDurationMs ?? cfg.behavior?.animationDuration ?? 250,
    showExpandAllControls: cfg.behavior?.showExpandAllControls ?? false,
    supportUrl: cfg.behavior?.supportUrl ?? "#",
    supportText: cfg.behavior?.supportText ?? "Still have questions? Contact our support team",
    emptySearchText: cfg.behavior?.emptySearchText ?? "No questions found matching your search.",
    allowMultiple: cfg.behavior?.allowMultipleOpen ?? cfg.behavior?.allowMultiple ?? false,
    animationDuration: cfg.behavior?.animationDurationMs ?? cfg.behavior?.animationDuration ?? 250,
    showSupportLink: cfg.behavior?.showSupportLink ?? true,
    supportButtonText: cfg.behavior?.supportButtonText ?? "Contact Support",
    noResultsText: cfg.behavior?.noResultsText ?? cfg.behavior?.emptySearchText ?? "No questions found.",
    ...(cfg.behavior || {}),
  };

  const rowBgVal = cfg.colors?.rowBackground ?? cfg.colors?.rowBg ?? "#18181b";
  const expRowBgVal = cfg.colors?.expandedRowBackground ?? cfg.colors?.expandedRowBg ?? "#27272a";
  const searchBgVal = cfg.colors?.searchBackground ?? cfg.colors?.searchBg ?? "#18181b";
  const widgetBgVal = cfg.colors?.widgetBackground ?? cfg.colors?.widgetBg ?? "transparent";

  let qColor = cfg.colors?.questionColor ?? "#ffffff";
  let aColor = cfg.colors?.answerColor ?? "#d4d4d8";
  const isLightRow = rowBgVal === "transparent" || rowBgVal === "#ffffff" || rowBgVal === "#fff" || rowBgVal === "rgb(255, 255, 255)";
  if (isLightRow) {
    if (qColor.toLowerCase() === "#ffffff" || qColor.toLowerCase() === "#fff") {
      qColor = "#0f172a";
    }
    if (aColor.toLowerCase() === "#d4d4d8" || aColor.toLowerCase() === "#ffffff") {
      aColor = "#334155";
    }
  }

  cfg.colors = {
    headingColor: cfg.colors?.headingColor ?? (isLightRow ? "#0f172a" : "#ffffff"),
    descriptionColor: cfg.colors?.descriptionColor ?? (isLightRow ? "#64748b" : "#a1a1aa"),
    borderColor: cfg.colors?.borderColor ?? (isLightRow ? "#e4e4e7" : "#3f3f46"),
    iconColor: cfg.colors?.iconColor ?? "#facc15",
    searchTextColor: cfg.colors?.searchTextColor ?? (isLightRow ? "#0f172a" : "#ffffff"),
    categoryTagBackground: cfg.colors?.categoryTagBackground ?? (isLightRow ? "#f1f5f9" : "#27272a"),
    categoryTagTextColor: cfg.colors?.categoryTagTextColor ?? (isLightRow ? "#475569" : "#a1a1aa"),
    activeCategoryTagBackground: cfg.colors?.activeCategoryTagBackground ?? "#facc15",
    activeCategoryTagTextColor: cfg.colors?.activeCategoryTagTextColor ?? "#000000",
    ...(cfg.colors || {}),
    widgetBackground: widgetBgVal,
    widgetBg: widgetBgVal,
    questionColor: qColor,
    answerColor: aColor,
    rowBackground: rowBgVal,
    rowBg: rowBgVal,
    expandedRowBackground: expRowBgVal,
    expandedRowBg: expRowBgVal,
    searchBackground: searchBgVal,
    searchBg: searchBgVal,
  };

  cfg.typography = {
    fontFamily: cfg.typography?.fontFamily ?? "Inter, system-ui, sans-serif",
    headingSize: cfg.typography?.headingSize ?? 28,
    questionSize: cfg.typography?.questionSize ?? cfg.typography?.questionFontSize ?? 16,
    answerSize: cfg.typography?.answerSize ?? cfg.typography?.answerFontSize ?? 14,
    fontWeight: cfg.typography?.fontWeight ?? "600",
    lineHeight: cfg.typography?.lineHeight ?? "1.6",
    questionFontSize: cfg.typography?.questionSize ?? cfg.typography?.questionFontSize ?? 16,
    answerFontSize: cfg.typography?.answerSize ?? cfg.typography?.answerFontSize ?? 14,
    ...(cfg.typography || {}),
  };

  cfg.icons = {
    style: cfg.icons?.style ?? "chevron",
    ...(cfg.icons || {}),
  };

  cfg.advanced = {
    customTitle: cfg.advanced?.customTitle ?? "",
    customCssClass: cfg.advanced?.customCssClass ?? cfg.advanced?.customClass ?? "",
    structuredData: cfg.advanced?.structuredData ?? cfg.advanced?.enableSchemaOrgFAQ ?? true,
    customClass: cfg.advanced?.customCssClass ?? cfg.advanced?.customClass ?? "",
    enableSchemaOrgFAQ: cfg.advanced?.structuredData ?? cfg.advanced?.enableSchemaOrgFAQ ?? true,
    inheritFont: cfg.advanced?.inheritFont ?? false,
    ...(cfg.advanced || {}),
  };

  return cfg;
}

/** Standard Sample Questions & Answers */
export const SAMPLE_FAQ_ITEMS: FaqItem[] = [
  {
    id: "faq_1",
    question: "How do I get started with the platform?",
    answer:
      "Getting started is simple! Create your free account, pick a starter template from our extensive library, and customize it using our intuitive drag-and-drop visual builder. You can publish your site in under 5 minutes.",
    category: "General",
  },
  {
    id: "faq_2",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit and debit cards (Visa, MasterCard, American Express), PayPal, Apple Pay, Google Pay, and UPI. All transactions are securely encrypted through industry-standard SSL.",
    category: "Billing",
  },
  {
    id: "faq_3",
    question: "Can I cancel or upgrade my subscription anytime?",
    answer:
      "Yes, absolutely. You can upgrade, downgrade, or cancel your subscription at any time directly from your account billing settings. If you cancel, your account remains active until the end of the current billing cycle.",
    category: "Billing",
  },
  {
    id: "faq_4",
    question: "Can I connect my own custom domain name?",
    answer:
      "Yes! All plans support connecting your own custom domain (e.g., yourcompany.com). We provide step-by-step DNS setup guides and automatic free SSL certificate provisioning.",
    category: "General",
  },
  {
    id: "faq_5",
    question: "Is technical support included with my plan?",
    answer:
      "Yes, 24/7 customer support is included for all users. You can reach our support team via live chat, email, or our community help center whenever you need assistance.",
    category: "Support",
  },
  {
    id: "faq_6",
    question: "How does the embed code work on external websites?",
    answer:
      "Every widget comes with a clean, lightweight HTML snippet. Simply copy the code and paste it into any website (WordPress, Shopify, Webflow, Squarespace, or plain static HTML). The widget renders asynchronously with zero dependencies.",
    category: "Technical",
  },
];

/** Base configuration shared across templates */
const baseFaqConfig: FaqConfig = {
  items: [...SAMPLE_FAQ_ITEMS],
  template: "classic_accordion",
  content: {
    heading: "Frequently Asked Questions",
    description: "Quick answers to questions you may have about our platform and services.",
    showHeading: true,
    showDescription: true,
    showSearch: false,
    searchPlaceholder: "Search questions…",
    showCategories: false,
    categories: ["General", "Billing", "Support", "Technical"],
    items: [...SAMPLE_FAQ_ITEMS],
  },
  layout: {
    template: "classic_accordion",
    columns: 1,
    alignment: "left",
    maxWidth: 860,
    isFullWidth: false,
    questionSpacing: 12,
    rowPadding: 18,
    borderRadius: 12,
    borderWidth: 1,
    iconPosition: "right",
    showMoreLimit: 0,
    showMoreText: "Show more questions",
    showLessText: "Show less",
  },
  behavior: {
    allowMultipleOpen: false,
    initialState: "first_open",
    animationDurationMs: 250,
    showExpandAllControls: false,
    supportUrl: "#",
    supportText: "Still have questions? Contact our friendly support team",
    emptySearchText: "No questions found matching your search query.",
  },
  colors: {
    widgetBackground: "transparent",
    headingColor: "#ffffff",
    descriptionColor: "#a1a1aa",
    questionColor: "#ffffff",
    answerColor: "#d4d4d8",
    rowBackground: "#18181b",
    expandedRowBackground: "#27272a",
    borderColor: "#3f3f46",
    iconColor: "#facc15",
    searchBackground: "#18181b",
    searchTextColor: "#ffffff",
    categoryTagBackground: "#27272a",
    categoryTagTextColor: "#a1a1aa",
    activeCategoryTagBackground: "#facc15",
    activeCategoryTagTextColor: "#000000",
  },
  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    headingSize: 28,
    questionSize: 16,
    answerSize: 14,
    fontWeight: "600",
    lineHeight: "1.6",
  },
  icons: {
    style: "chevron",
  },
  advanced: {
    customTitle: "",
    customCssClass: "",
    structuredData: true,
  },
};

/** All 8 Functional FAQ Templates */
export const FAQ_TEMPLATES: Record<FaqTemplateKey, FaqTemplateItem> = {
  // 1. Classic Accordion
  classic_accordion: {
    key: "classic_accordion",
    name: "Classic Accordion",
    description: "Traditional clean accordion with vertical expansion and chevron toggle icons.",
    badge: "Popular",
    config: {
      ...baseFaqConfig,
      layout: {
        ...baseFaqConfig.layout,
        template: "classic_accordion",
        borderRadius: 10,
        questionSpacing: 10,
        rowPadding: 16,
      },
      icons: {
        style: "chevron",
      },
    },
  },

  // 2. Minimal FAQ
  minimal_faq: {
    key: "minimal_faq",
    name: "Minimal FAQ",
    description: "Ultra-clean layout with subtle dividers and seamless typography.",
    badge: "Clean",
    config: {
      ...baseFaqConfig,
      layout: {
        ...baseFaqConfig.layout,
        template: "minimal_faq",
        borderRadius: 0,
        borderWidth: 1,
        questionSpacing: 0,
        rowPadding: 18,
      },
      colors: {
        ...baseFaqConfig.colors,
        headingColor: "#0f172a",
        descriptionColor: "#64748b",
        questionColor: "#0f172a",
        answerColor: "#334155",
        rowBackground: "transparent",
        expandedRowBackground: "transparent",
        borderColor: "#e4e4e7",
        iconColor: "#71717a",
      },
      icons: {
        style: "plus_minus",
      },
    },
  },

  // 3. Card FAQ
  card_faq: {
    key: "card_faq",
    name: "Card FAQ",
    description: "Each question is styled inside an individual elevated card container with soft shadows.",
    badge: "Elevated",
    config: {
      ...baseFaqConfig,
      layout: {
        ...baseFaqConfig.layout,
        template: "card_faq",
        borderRadius: 16,
        borderWidth: 1,
        questionSpacing: 14,
        rowPadding: 20,
      },
      colors: {
        ...baseFaqConfig.colors,
        rowBackground: "#1e1e24",
        expandedRowBackground: "#25252d",
        borderColor: "#2e2e38",
        iconColor: "#facc15",
      },
      icons: {
        style: "chevron",
      },
    },
  },

  // 4. Bordered FAQ
  bordered_faq: {
    key: "bordered_faq",
    name: "Bordered FAQ",
    description: "Distinct bordered question rows with clear hover outlines and active states.",
    badge: "Structured",
    config: {
      ...baseFaqConfig,
      layout: {
        ...baseFaqConfig.layout,
        template: "bordered_faq",
        borderRadius: 8,
        borderWidth: 2,
        questionSpacing: 12,
        rowPadding: 16,
      },
      colors: {
        ...baseFaqConfig.colors,
        headingColor: "#0f172a",
        descriptionColor: "#64748b",
        questionColor: "#0f172a",
        answerColor: "#334155",
        rowBackground: "transparent",
        expandedRowBackground: "rgba(250, 204, 21, 0.08)",
        borderColor: "#3f3f46",
        iconColor: "#facc15",
      },
      icons: {
        style: "arrow",
      },
    },
  },

  // 5. Modern Rounded
  modern_rounded: {
    key: "modern_rounded",
    name: "Modern Rounded",
    description: "Soft pill-curved corners, sleek ambient gradients, and vibrant accent toggles.",
    badge: "Modern",
    config: {
      ...baseFaqConfig,
      layout: {
        ...baseFaqConfig.layout,
        template: "modern_rounded",
        borderRadius: 22,
        borderWidth: 1,
        questionSpacing: 14,
        rowPadding: 20,
      },
      colors: {
        ...baseFaqConfig.colors,
        rowBackground: "#18181c",
        expandedRowBackground: "#222228",
        borderColor: "#383842",
        iconColor: "#38bdf8",
      },
      icons: {
        style: "plus_minus",
      },
    },
  },

  // 6. Help Center
  help_center: {
    key: "help_center",
    name: "Help Center",
    description: "Full customer support hub with live search filtering, category tabs, and contact banner.",
    badge: "Support",
    config: {
      ...baseFaqConfig,
      content: {
        ...baseFaqConfig.content,
        showSearch: true,
        showCategories: true,
        heading: "Help & Customer Support",
        description: "Search our knowledge base or browse frequently asked questions below.",
      },
      behavior: {
        ...baseFaqConfig.behavior,
        showExpandAllControls: true,
        supportUrl: "#contact",
      },
      layout: {
        ...baseFaqConfig.layout,
        template: "help_center",
        borderRadius: 14,
        questionSpacing: 12,
        rowPadding: 18,
      },
      colors: {
        ...baseFaqConfig.colors,
        iconColor: "#10b981",
        activeCategoryTagBackground: "#10b981",
        activeCategoryTagTextColor: "#ffffff",
      },
      icons: {
        style: "chevron",
      },
    },
  },

  // 7. Two-Column FAQ
  two_column_faq: {
    key: "two_column_faq",
    name: "Two-Column FAQ",
    description: "Responsive 2-column masonry/grid for wider desktop screens, collapsing cleanly on mobile.",
    badge: "Compact",
    config: {
      ...baseFaqConfig,
      layout: {
        ...baseFaqConfig.layout,
        template: "two_column_faq",
        columns: 2,
        maxWidth: 1140,
        borderRadius: 14,
        questionSpacing: 14,
        rowPadding: 18,
      },
      colors: {
        ...baseFaqConfig.colors,
        rowBackground: "#1a1a20",
        expandedRowBackground: "#24242c",
        borderColor: "#33333d",
      },
      icons: {
        style: "plus_minus",
      },
    },
  },

  // 8. Simple List
  simple_list: {
    key: "simple_list",
    name: "Simple List",
    description: "Compact and lightweight question list with caret toggles, ideal for tight page sections.",
    badge: "Minimal",
    config: {
      ...baseFaqConfig,
      layout: {
        ...baseFaqConfig.layout,
        template: "simple_list",
        borderRadius: 0,
        borderWidth: 0,
        questionSpacing: 6,
        rowPadding: 12,
      },
      colors: {
        ...baseFaqConfig.colors,
        headingColor: "#0f172a",
        descriptionColor: "#64748b",
        questionColor: "#0f172a",
        answerColor: "#334155",
        rowBackground: "transparent",
        expandedRowBackground: "transparent",
        borderColor: "transparent",
        iconColor: "#71717a",
      },
      icons: {
        style: "caret",
      },
    },
  },
};

export const FAQ_TEMPLATE_LIST = Object.values(FAQ_TEMPLATES);

/** Factory function to create a new FAQ widget record */
export function createNewFaqWidget(
  name = "FAQ Accordion",
  templateKey: FaqTemplateKey = "classic_accordion"
): WidgetInstanceRecord<FaqConfig> {
  const tpl = FAQ_TEMPLATES[templateKey] || FAQ_TEMPLATES.classic_accordion;
  const now = new Date().toISOString();
  const id = `wgt_faq_${nanoid(8)}`;

  return {
    id,
    type: "faq_accordion" as any,
    name: name.trim() || tpl.name,
    status: "draft",
    enabled: true,
    source: null,
    selectedReviews: [],
    config: normalizeFaqConfig(JSON.parse(JSON.stringify(tpl.config))),
    createdAt: now,
    updatedAt: now,
  };
}
