import { nanoid } from "nanoid";
import type { WidgetInstanceRecord } from "./widgetService";

export type LanguageSwitcherLayout =
  | "globe_dropdown"
  | "globe_text_dropdown"
  | "flag_button_dropdown"
  | "minimal_text"
  | "floating_selector"
  | "horizontal_pills"
  | "compact_bottom_sheet";

export type LanguageButtonFormat =
  | "flag_and_name"
  | "flag_and_code"
  | "flag_only"
  | "name_only"
  | "code_only"
  | "globe_and_name"
  | "globe_and_code";

export type LanguageDropdownPosition = "auto" | "bottom_right" | "bottom_left" | "top_right" | "top_left";
export type LanguageFloatingPosition = "bottom_right" | "bottom_left" | "top_right" | "top_left";
export type LanguageSwitcherPosition = LanguageFloatingPosition;
export type LanguageTheme = "dark" | "light" | "system";
export type LanguageShadow = "none" | "soft" | "medium" | "intense";
export type LanguageAnimation = "fade" | "slide" | "scale" | "bounce" | "none";

export interface LanguageOption {
  id: string;
  code: string; // BCP 47 code, e.g. "en", "es", "fr", "hi", "de", "zh-CN", "ja"
  name: string; // English name, e.g. "English"
  nativeName: string; // Native name, e.g. "English", "Español", "Français", "हिन्दी"
  flag: string; // Emoji flag, e.g. "🇺🇸", "🇪🇸", "🇫🇷", "🇮🇳"
  url: string; // Destination URL for this translated page/site
  enabled: boolean;
  isDefault?: boolean;
}

export interface LanguageSwitcherAppearanceConfig {
  template: string;
  layout: LanguageSwitcherLayout;
  buttonFormat: LanguageButtonFormat;
  showGlobeIcon: boolean;
  showFlags: boolean;
  showNativeNames: boolean;
  showSearchInDropdown: boolean;
  preSelectionLabel: string; // e.g. "Language:" or ""
  
  // Sizing & Spacing
  fontSize: number; // e.g. 13
  paddingX: number; // e.g. 14
  paddingY: number; // e.g. 8
  borderRadius: number; // e.g. 10
  dropdownBorderRadius: number; // e.g. 12
  dropdownWidth: number; // e.g. 220
  
  // Colors & Styling
  theme: LanguageTheme;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  hoverBackgroundColor: string;
  hoverTextColor: string;
  activeItemBackgroundColor: string;
  activeItemTextColor: string;
  accentColor: string;
  dropdownBackgroundColor: string;
  dropdownTextColor: string;
  dropdownBorderColor: string;
  dropdownShadow: LanguageShadow;
  
  // Positioning
  dropdownPosition: LanguageDropdownPosition;
  floatingPosition: LanguageFloatingPosition;
  floatingOffsetX: number; // e.g. 24
  floatingOffsetY: number; // e.g. 24
  zIndex: number; // e.g. 999999
  
  // Visibility & Animation
  visibleOnDesktop: boolean;
  visibleOnMobile: boolean;
  showTooltip: boolean;
  tooltipText: string;
  animation: LanguageAnimation;
}

export interface LanguageSwitcherBehaviorConfig {
  mode: "existing_pages" | "auto_translate";
  detectBrowserLanguage: boolean;
  rememberVisitorPreference: boolean;
  autoRedirect: boolean; // default false to prevent unexpected redirects or redirect loops
  openInNewTab: boolean;
  storageKeyPrefix: string;
  defaultFallbackCode: string;
  // Future auto-translate provider settings (Mode B architecture)
  autoTranslateProvider?: "none" | "custom_api" | "google_cloud" | "deepl" | "libretranslate";
  autoTranslateEndpoint?: string;
  autoTranslateApiKey?: string;
}

export interface LanguageSwitcherConfig {
  languages: LanguageOption[];
  appearance: LanguageSwitcherAppearanceConfig;
  behavior: LanguageSwitcherBehaviorConfig;
}

export interface LanguageSwitcherTemplateItem {
  key: string;
  name: string;
  description: string;
  badge: string;
  layout: LanguageSwitcherLayout;
  config: LanguageSwitcherConfig;
}

/** Standard ISO / BCP 47 Common Language Catalog */
export interface StandardLanguageItem {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
}

export const COMMON_LANGUAGES_CATALOG: StandardLanguageItem[] = [
  { code: "en", name: "English", nativeName: "English", flag: "🇺🇸" },
  { code: "en-GB", name: "English (UK)", nativeName: "English (UK)", flag: "🇬🇧" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "it", name: "Italian", nativeName: "Italiano", flag: "🇮🇹" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
  { code: "pt-BR", name: "Portuguese (Brazil)", nativeName: "Português (Brasil)", flag: "🇧🇷" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "gu", name: "Gujarati", nativeName: "ગુજરાતી", flag: "🇮🇳" },
  { code: "kn", name: "Kannada", nativeName: "ಕನ್ನಡ", flag: "🇮🇳" },
  { code: "ml", name: "Malayalam", nativeName: "മലയാളം", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "ur", name: "Urdu", nativeName: "اردو", flag: "🇵🇰" },
  { code: "zh-CN", name: "Chinese (Simplified)", nativeName: "简体中文", flag: "🇨🇳" },
  { code: "zh-TW", name: "Chinese (Traditional)", nativeName: "繁體中文", flag: "🇹🇼" },
  { code: "ja", name: "Japanese", nativeName: "日本語", flag: "🇯🇵" },
  { code: "ko", name: "Korean", nativeName: "한국어", flag: "🇰🇷" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "ru", name: "Russian", nativeName: "Русский", flag: "🇷🇺" },
  { code: "tr", name: "Turkish", nativeName: "Türkçe", flag: "🇹🇷" },
  { code: "nl", name: "Dutch", nativeName: "Nederlands", flag: "🇳🇱" },
  { code: "pl", name: "Polish", nativeName: "Polski", flag: "🇵🇱" },
  { code: "sv", name: "Swedish", nativeName: "Svenska", flag: "🇸🇪" },
  { code: "da", name: "Danish", nativeName: "Dansk", flag: "🇩🇰" },
  { code: "fi", name: "Finnish", nativeName: "Suomi", flag: "🇫🇮" },
  { code: "no", name: "Norwegian", nativeName: "Norsk", flag: "🇳🇴" },
  { code: "el", name: "Greek", nativeName: "Ελληνικά", flag: "🇬🇷" },
  { code: "he", name: "Hebrew", nativeName: "עברית", flag: "🇮🇱" },
  { code: "th", name: "Thai", nativeName: "ไทย", flag: "🇹🇭" },
  { code: "vi", name: "Vietnamese", nativeName: "Tiếng Việt", flag: "🇻🇳" },
  { code: "id", name: "Indonesian", nativeName: "Bahasa Indonesia", flag: "🇮🇩" },
  { code: "ms", name: "Malay", nativeName: "Bahasa Melayu", flag: "🇲🇾" },
  { code: "uk", name: "Ukrainian", nativeName: "Українська", flag: "🇺🇦" },
  { code: "cs", name: "Czech", nativeName: "Čeština", flag: "🇨🇿" },
  { code: "ro", name: "Romanian", nativeName: "Română", flag: "🇷🇴" },
  { code: "hu", name: "Hungarian", nativeName: "Magyar", flag: "🇭🇺" },
  { code: "sk", name: "Slovak", nativeName: "Slovenčina", flag: "🇸🇰" },
  { code: "bg", name: "Bulgarian", nativeName: "Български", flag: "🇧🇬" },
  { code: "sr", name: "Serbian", nativeName: "Српски", flag: "🇷🇸" },
  { code: "hr", name: "Croatian", nativeName: "Hrvatski", flag: "🇭🇷" },
  { code: "fa", name: "Persian", nativeName: "فارسی", flag: "🇮🇷" },
  { code: "fil", name: "Filipino", nativeName: "Filipino", flag: "🇵🇭" },
  { code: "sw", name: "Swahili", nativeName: "Kiswahili", flag: "🇰🇪" },
  { code: "af", name: "Afrikaans", nativeName: "Afrikaans", flag: "🇿🇦" },
];

export const DEFAULT_LANGUAGE_OPTIONS: LanguageOption[] = [
  {
    id: "lang-en",
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇺🇸",
    url: "https://example.com/",
    enabled: true,
    isDefault: true,
  },
  {
    id: "lang-es",
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    url: "https://example.com/es/",
    enabled: true,
    isDefault: false,
  },
  {
    id: "lang-fr",
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    url: "https://example.com/fr/",
    enabled: true,
    isDefault: false,
  },
  {
    id: "lang-de",
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    url: "https://example.com/de/",
    enabled: true,
    isDefault: false,
  },
  {
    id: "lang-hi",
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    flag: "🇮🇳",
    url: "https://example.com/hi/",
    enabled: true,
    isDefault: false,
  },
];

export const DEFAULT_LANGUAGE_SWITCHER_CONFIG: LanguageSwitcherConfig = {
  languages: DEFAULT_LANGUAGE_OPTIONS,
  appearance: {
    template: "modern_dropdown",
    layout: "globe_text_dropdown",
    buttonFormat: "flag_and_name",
    showGlobeIcon: true,
    showFlags: true,
    showNativeNames: true,
    showSearchInDropdown: true,
    preSelectionLabel: "",
    fontSize: 13,
    paddingX: 14,
    paddingY: 8,
    borderRadius: 10,
    dropdownBorderRadius: 12,
    dropdownWidth: 230,
    theme: "dark",
    backgroundColor: "#18181b",
    textColor: "#f4f4f5",
    borderColor: "#27272a",
    hoverBackgroundColor: "#27272a",
    hoverTextColor: "#ffffff",
    activeItemBackgroundColor: "#4f46e5",
    activeItemTextColor: "#ffffff",
    accentColor: "#6366f1",
    dropdownBackgroundColor: "#18181b",
    dropdownTextColor: "#f4f4f5",
    dropdownBorderColor: "#27272a",
    dropdownShadow: "medium",
    dropdownPosition: "auto",
    floatingPosition: "bottom_right",
    floatingOffsetX: 24,
    floatingOffsetY: 24,
    zIndex: 999999,
    visibleOnDesktop: true,
    visibleOnMobile: true,
    showTooltip: true,
    tooltipText: "Change Language",
    animation: "fade",
  },
  behavior: {
    mode: "existing_pages",
    detectBrowserLanguage: true,
    rememberVisitorPreference: true,
    autoRedirect: false,
    openInNewTab: false,
    storageKeyPrefix: "wto_lang_pref",
    defaultFallbackCode: "en",
    autoTranslateProvider: "none",
  },
};

/** 7 Distinct Layout Presets for WebToolOcean Widget Studio */
export const LANGUAGE_SWITCHER_TEMPLATES: Record<string, LanguageSwitcherTemplateItem> = {
  classic_globe: {
    key: "classic_globe",
    name: "Classic Globe Dropdown",
    description: "Compact globe button with current language label and elegant dropdown menu.",
    badge: "Popular",
    layout: "globe_dropdown",
    config: {
      ...DEFAULT_LANGUAGE_SWITCHER_CONFIG,
      appearance: {
        ...DEFAULT_LANGUAGE_SWITCHER_CONFIG.appearance,
        template: "classic_globe",
        layout: "globe_dropdown",
        buttonFormat: "globe_and_code",
        showGlobeIcon: true,
        showFlags: true,
        borderRadius: 9999,
        dropdownBorderRadius: 14,
        backgroundColor: "#0f172a",
        textColor: "#f8fafc",
        borderColor: "#334155",
        accentColor: "#38bdf8",
        activeItemBackgroundColor: "#0284c7",
        dropdownBackgroundColor: "#0f172a",
        dropdownBorderColor: "#334155",
        dropdownShadow: "medium",
      },
    },
  },

  modern_dropdown: {
    key: "modern_dropdown",
    name: "Modern Language Dropdown",
    description: "Full language name with flag badge, globe icon, and polished dark glass effect.",
    badge: "Pro",
    layout: "globe_text_dropdown",
    config: {
      ...DEFAULT_LANGUAGE_SWITCHER_CONFIG,
      appearance: {
        ...DEFAULT_LANGUAGE_SWITCHER_CONFIG.appearance,
        template: "modern_dropdown",
        layout: "globe_text_dropdown",
        buttonFormat: "flag_and_name",
        showGlobeIcon: true,
        showFlags: true,
        borderRadius: 10,
        backgroundColor: "#18181b",
        textColor: "#ffffff",
        borderColor: "#27272a",
        accentColor: "#6366f1",
        activeItemBackgroundColor: "#4f46e5",
        dropdownBackgroundColor: "#18181b",
        dropdownBorderColor: "#27272a",
        dropdownShadow: "medium",
      },
    },
  },

  flag_button: {
    key: "flag_button",
    name: "Flag Button Selector",
    description: "Prominent flag icon with language badge and card-style dropdown menu.",
    badge: "Visual",
    layout: "flag_button_dropdown",
    config: {
      ...DEFAULT_LANGUAGE_SWITCHER_CONFIG,
      appearance: {
        ...DEFAULT_LANGUAGE_SWITCHER_CONFIG.appearance,
        template: "flag_button",
        layout: "flag_button_dropdown",
        buttonFormat: "flag_and_name",
        showGlobeIcon: false,
        showFlags: true,
        borderRadius: 12,
        backgroundColor: "#1e1e24",
        textColor: "#ffffff",
        borderColor: "#2e2e38",
        accentColor: "#ec4899",
        activeItemBackgroundColor: "#db2777",
        dropdownBackgroundColor: "#1e1e24",
        dropdownBorderColor: "#2e2e38",
        dropdownShadow: "intense",
      },
    },
  },

  clean_minimal: {
    key: "clean_minimal",
    name: "Clean Minimal Text",
    description: "Ultra-sleek borderless switcher designed to fit cleanly inside site headers.",
    badge: "Minimal",
    layout: "minimal_text",
    config: {
      ...DEFAULT_LANGUAGE_SWITCHER_CONFIG,
      appearance: {
        ...DEFAULT_LANGUAGE_SWITCHER_CONFIG.appearance,
        template: "clean_minimal",
        layout: "minimal_text",
        buttonFormat: "code_only",
        showGlobeIcon: false,
        showFlags: false,
        borderRadius: 6,
        paddingX: 8,
        paddingY: 4,
        backgroundColor: "transparent",
        textColor: "#94a3b8",
        borderColor: "transparent",
        hoverBackgroundColor: "rgba(255,255,255,0.08)",
        hoverTextColor: "#ffffff",
        accentColor: "#ffffff",
        activeItemBackgroundColor: "rgba(255,255,255,0.12)",
        dropdownBackgroundColor: "#09090b",
        dropdownBorderColor: "#27272a",
        dropdownWidth: 180,
      },
    },
  },

  floating_selector: {
    key: "floating_selector",
    name: "Floating Corner Button",
    description: "Fixed floating pill pinned to bottom-right with dropup menu and native names.",
    badge: "Universal",
    layout: "floating_selector",
    config: {
      ...DEFAULT_LANGUAGE_SWITCHER_CONFIG,
      appearance: {
        ...DEFAULT_LANGUAGE_SWITCHER_CONFIG.appearance,
        template: "floating_selector",
        layout: "floating_selector",
        buttonFormat: "flag_and_code",
        showGlobeIcon: true,
        showFlags: true,
        borderRadius: 9999,
        paddingX: 16,
        paddingY: 10,
        floatingPosition: "bottom_right",
        floatingOffsetX: 24,
        floatingOffsetY: 24,
        dropdownPosition: "top_right",
        backgroundColor: "#18181b",
        textColor: "#ffffff",
        borderColor: "#3f3f46",
        accentColor: "#10b981",
        activeItemBackgroundColor: "#059669",
        dropdownShadow: "intense",
      },
    },
  },

  horizontal_pills: {
    key: "horizontal_pills",
    name: "Horizontal Language Pills",
    description: "Side-by-side language buttons ideal for footers, banners, or submenus.",
    badge: "Inline",
    layout: "horizontal_pills",
    config: {
      ...DEFAULT_LANGUAGE_SWITCHER_CONFIG,
      appearance: {
        ...DEFAULT_LANGUAGE_SWITCHER_CONFIG.appearance,
        template: "horizontal_pills",
        layout: "horizontal_pills",
        buttonFormat: "flag_and_code",
        showGlobeIcon: true,
        showFlags: true,
        borderRadius: 8,
        paddingX: 10,
        paddingY: 6,
        backgroundColor: "#27272a",
        textColor: "#d4d4d8",
        borderColor: "#3f3f46",
        activeItemBackgroundColor: "#3b82f6",
        activeItemTextColor: "#ffffff",
        accentColor: "#3b82f6",
      },
    },
  },

  compact_bottom_sheet: {
    key: "compact_bottom_sheet",
    name: "Mobile Compact Selector",
    description: "Touch-first compact selector with large tap targets and integrated search.",
    badge: "Mobile-First",
    layout: "compact_bottom_sheet",
    config: {
      ...DEFAULT_LANGUAGE_SWITCHER_CONFIG,
      appearance: {
        ...DEFAULT_LANGUAGE_SWITCHER_CONFIG.appearance,
        template: "compact_bottom_sheet",
        layout: "compact_bottom_sheet",
        buttonFormat: "flag_and_name",
        showGlobeIcon: true,
        showFlags: true,
        showSearchInDropdown: true,
        borderRadius: 12,
        paddingX: 14,
        paddingY: 10,
        dropdownWidth: 260,
        backgroundColor: "#18181b",
        textColor: "#ffffff",
        borderColor: "#3f3f46",
        accentColor: "#f59e0b",
        activeItemBackgroundColor: "#d97706",
        dropdownBackgroundColor: "#18181b",
        dropdownBorderColor: "#3f3f46",
      },
    },
  },
};

export const LANGUAGE_SWITCHER_TEMPLATE_LIST = Object.values(LANGUAGE_SWITCHER_TEMPLATES);
export const LANGUAGE_SWITCHER_PRESETS = LANGUAGE_SWITCHER_TEMPLATES;
export type LanguageSwitcherPresetKey = keyof typeof LANGUAGE_SWITCHER_TEMPLATES;

export function findCommonLanguage(codeOrName: string) {
  const q = (codeOrName || "").trim().toLowerCase();
  return COMMON_LANGUAGES_CATALOG.find(
    (l) => l.code.toLowerCase() === q || l.name.toLowerCase() === q || l.nativeName.toLowerCase() === q
  );
}

/** Factory function to create a new Website Language Switcher widget */
export function createNewLanguageSwitcherWidget(
  name: string = "Website Language Switcher",
  templateKey: string = "modern_dropdown"
): WidgetInstanceRecord<LanguageSwitcherConfig> {
  const tpl = LANGUAGE_SWITCHER_TEMPLATES[templateKey] || LANGUAGE_SWITCHER_TEMPLATES.modern_dropdown;
  const now = new Date().toISOString();

  return {
    id: `wgt_lang_${nanoid(10)}`,
    type: "language_switcher" as any,
    name: name || tpl.name,
    status: "draft",
    enabled: true,
    viewsCount: 0,
    source: {
      provider: "translated_pages",
    },
    selectedReviews: [],
    config: JSON.parse(JSON.stringify(tpl.config)),
    createdAt: now,
    updatedAt: now,
  };
}
