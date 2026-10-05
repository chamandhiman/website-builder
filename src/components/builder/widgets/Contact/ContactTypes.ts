import type { WidgetData } from "../widgetRegistry";

export type ContactVariant =
  | "Split Info + Form"
  | "Centered Form"
  | "Dark Side-by-Side"
  | "Minimal Card";

export interface ContactInfoItem {
  icon: "map-pin" | "phone" | "mail" | "clock";
  label: string;
  value: string;
}

export interface ContactContentGroup extends Record<string, unknown> {
  eyebrow?: string;
  showEyebrow?: boolean;
  heading?: string;
  description?: string;
  infoItems?: ContactInfoItem[];
  showInfoItems?: boolean;
  formTitle?: string;
  formSubtitle?: string;
  showNameField?: boolean;
  namePlaceholder?: string;
  showEmailField?: boolean;
  emailPlaceholder?: string;
  showPhoneField?: boolean;
  phonePlaceholder?: string;
  showSubjectField?: boolean;
  subjectPlaceholder?: string;
  showDropdown?: boolean;
  dropdownLabel?: string;
  dropdownOptions?: string[];
  showMessageField?: boolean;
  messagePlaceholder?: string;
  submitLabel?: string;
  submitUrl?: string;
  formType?: "standard" | "custom_embed";
  customEmbedCode?: string;
  customEmbedHeight?: string;
}

export interface ContactStyleGroup extends Record<string, unknown> {
  backgroundColor?: string;
  infoBgColor?: string;
  formBgColor?: string;
  formBorderRadius?: string;
  formBorderColor?: string;
  formShadow?: boolean;
  eyebrowColor?: string;
  headingColor?: string;
  descriptionColor?: string;
  infoIconColor?: string;
  infoLabelColor?: string;
  infoValueColor?: string;
  formTitleColor?: string;
  formSubtitleColor?: string;
  inputBgColor?: string;
  inputBorderColor?: string;
  inputTextColor?: string;
  inputPlaceholderColor?: string;
  inputBorderRadius?: string;
  labelColor?: string;
  submitBgColor?: string;
  submitTextColor?: string;
  submitHoverBgColor?: string;
  submitBorderRadius?: string;
  submitFontWeight?: string;
}

export interface ContactLayoutGroup extends Record<string, unknown> {
  paddingTop?: string;
  paddingBottom?: string;
  paddingX?: string;
  maxWidth?: string;
}

export interface ContactResponsiveGroup extends Record<string, unknown> {
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
}

export interface ContactAnimationGroup extends Record<string, unknown> {
  enabled?: boolean;
  type?: string;
  duration?: number;
  delay?: number;
}

export interface ContactAdvancedGroup extends Record<string, unknown> {
  id?: string;
  className?: string;
  visibility?: boolean;
}

export interface ContactWidgetData extends WidgetData {
  type: "contact";
  variant: ContactVariant;
  content: ContactContentGroup;
  style: ContactStyleGroup;
  layout: ContactLayoutGroup;
  responsive: ContactResponsiveGroup;
  animation: ContactAnimationGroup;
  advanced: ContactAdvancedGroup;
}

export function isContactWidgetData(value: unknown): value is ContactWidgetData {
  return Boolean(value && typeof value === "object" && (value as { type?: string }).type === "contact");
}

const DEFAULT_INFO_ITEMS: ContactInfoItem[] = [
  { icon: "map-pin", label: "Office Address", value: "123 Business Ave, Suite 500, New York, NY 10001" },
  { icon: "phone", label: "Direct Phone Line", value: "+1 (555) 123-4567 (Mon–Sat, 9am – 7pm)" },
  { icon: "mail", label: "Email Address", value: "contact@yourcompany.com" },
  { icon: "clock", label: "Business Hours", value: "Monday – Saturday, 9:00 AM – 7:00 PM" },
];

export const defaultContactWidgetData: ContactWidgetData = {
  id: "contact-default",
  type: "contact",
  variant: "Split Info + Form",
  content: {
    showEyebrow: true,
    eyebrow: "HEADQUARTERS",
    heading: "Visit Our Office",
    description:
      "Our flagship office is open for scheduled consultations, private viewings, and portfolio reviews.",
    showInfoItems: true,
    infoItems: DEFAULT_INFO_ITEMS,
    formTitle: "Send Us a Message",
    formSubtitle: "Fill in the details below and an agent will reach out within 2 hours.",
    showNameField: true,
    namePlaceholder: "John Doe",
    showEmailField: true,
    emailPlaceholder: "johndoe@gmail.com",
    showPhoneField: true,
    phonePlaceholder: "+1 (555) 000-0000",
    showDropdown: true,
    dropdownLabel: "I am interested in",
    dropdownOptions: ["Buying a Property", "Selling a Property", "Renting", "Investment", "Other"],
    showMessageField: true,
    messagePlaceholder: "Describe your inquiry, budget, or preferred timeline...",
    submitLabel: "Submit Inquiry →",
    submitUrl: "#",
    formType: "standard",
    customEmbedCode: "",
    customEmbedHeight: "520px",
  },
  style: {
    backgroundColor: "#ffffff",
    infoBgColor: "#ffffff",
    formBgColor: "#ffffff",
    formBorderRadius: "12px",
    formBorderColor: "#e5e7eb",
    formShadow: true,
    eyebrowColor: "#FACC15",
    headingColor: "#111827",
    descriptionColor: "#4b5563",
    infoIconColor: "#FACC15",
    infoLabelColor: "#111827",
    infoValueColor: "#6b7280",
    formTitleColor: "#111827",
    formSubtitleColor: "#6b7280",
    inputBgColor: "#f9fafb",
    inputBorderColor: "#e5e7eb",
    inputTextColor: "#111827",
    inputPlaceholderColor: "#9ca3af",
    inputBorderRadius: "8px",
    labelColor: "#374151",
    submitBgColor: "#FACC15",
    submitTextColor: "#111111",
    submitHoverBgColor: "#FDE047",
    submitBorderRadius: "8px",
    submitFontWeight: "600",
  },
  layout: {
    paddingTop: "80px",
    paddingBottom: "80px",
    paddingX: "24px",
    maxWidth: "1200px",
  },
  responsive: {
    hideOnMobile: false,
    hideOnTablet: false,
    hideOnDesktop: false,
  },
  animation: { enabled: false, type: "none", duration: 300, delay: 0 },
  advanced: { id: "", className: "", visibility: true },
};
