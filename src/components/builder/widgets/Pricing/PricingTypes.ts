import type { WidgetData } from "../widgetRegistry";

export interface PricingTier {
  id: string;
  name: string;
  badge?: string;
  priceMonthly: string;
  priceAnnual: string;
  periodMonthly?: string;
  periodAnnual?: string;
  description: string;
  features: string[];
  buttonText: string;
  buttonLink: string;
  isPopular?: boolean;
}

export interface PricingContent extends Record<string, unknown> {
  eyebrow?: string;
  heading?: string;
  description?: string;
  billingCycle?: "monthly" | "annual";
  showBillingToggle?: boolean;
  annualDiscountBadge?: string;
  tiers: PricingTier[];
}

export interface PricingStyle extends Record<string, unknown> {
  desktopColumns?: number;
  backgroundColor?: string;
  cardBackgroundColor?: string;
  cardBorderRadius?: string;
  cardBorderColor?: string;
  cardBorderWidth?: string;
  cardPadding?: string;
  popularCardBorderColor?: string;
  popularBadgeBg?: string;
  popularBadgeColor?: string;
  headingColor?: string;
  priceColor?: string;
  periodColor?: string;
  featureTextColor?: string;
  featureCheckColor?: string;
  buttonBg?: string;
  buttonColor?: string;
  popularButtonBg?: string;
  popularButtonColor?: string;
}

export interface PricingWidgetData extends WidgetData {
  type: "pricing";
  content: PricingContent;
  style: PricingStyle;
}

export const defaultPricingTiers: PricingTier[] = [
  {
    id: "p1",
    name: "Starter",
    badge: "",
    priceMonthly: "$29",
    priceAnnual: "$24",
    periodMonthly: "/month",
    periodAnnual: "/month, billed yearly",
    description: "Essential tools and listings for individual clients and small property inquiries.",
    features: [
      "Access to standard property catalog",
      "Email support within 24 hours",
      "Up to 3 active inquiries",
      "Virtual tour previews",
      "Standard contract review",
    ],
    buttonText: "Get Started",
    buttonLink: "#contact",
    isPopular: false,
  },
  {
    id: "p2",
    name: "Professional",
    badge: "MOST POPULAR",
    priceMonthly: "$79",
    priceAnnual: "$64",
    periodMonthly: "/month",
    periodAnnual: "/month, billed yearly",
    description: "Comprehensive advisory and dedicated support for active buyers, sellers, and investors.",
    features: [
      "Priority VIP property listings",
      "Dedicated senior real estate advisor",
      "Unlimited active property inquiries",
      "Off-market private viewings",
      "Full legal & valuation analysis",
      "Negotiation and escrow concierge",
    ],
    buttonText: "Choose Professional",
    buttonLink: "#contact",
    isPopular: true,
  },
  {
    id: "p3",
    name: "Enterprise",
    badge: "CUSTOM",
    priceMonthly: "$199",
    priceAnnual: "$159",
    periodMonthly: "/month",
    periodAnnual: "/month, billed yearly",
    description: "Bespoke wealth management, portfolio acquisition, and luxury asset development.",
    features: [
      "Complete portfolio asset management",
      "24/7 dedicated partner line",
      "Global luxury network access",
      "Custom development consulting",
      "Institutional mortgage assistance",
      "Comprehensive tax & estate advisory",
    ],
    buttonText: "Contact Us",
    buttonLink: "#contact",
    isPopular: false,
  },
];

export const defaultPricingWidgetData: PricingWidgetData = {
  id: "pricing-widget",
  type: "pricing",
  variant: "3-Column Cards",
  content: {
    eyebrow: "TRANSPARENT PRICING",
    heading: "Simple, Predictable Plans",
    description: "Choose the perfect package tailored to your property requirements and investment goals.",
    billingCycle: "monthly",
    showBillingToggle: true,
    annualDiscountBadge: "Save 20%",
    tiers: defaultPricingTiers,
  },
  style: {
    desktopColumns: 3,
    backgroundColor: "#ffffff",
    cardBackgroundColor: "#f8fafc",
    cardBorderRadius: "20px",
    cardBorderColor: "#e2e8f0",
    cardBorderWidth: "1px",
    cardPadding: "32px 28px",
    popularCardBorderColor: "#facc15",
    popularBadgeBg: "#facc15",
    popularBadgeColor: "#0f172a",
    headingColor: "#0f172a",
    priceColor: "#0f172a",
    periodColor: "#64748b",
    featureTextColor: "#334155",
    featureCheckColor: "#10b981",
    buttonBg: "#0f172a",
    buttonColor: "#ffffff",
    popularButtonBg: "#facc15",
    popularButtonColor: "#0f172a",
  },
  layout: {
    paddingTop: "64px",
    paddingBottom: "64px",
    paddingX: "24px",
  },
  responsive: {
    hideOnMobile: false,
    hideOnTablet: false,
    hideOnDesktop: false,
  },
};

export function isPricingWidgetData(data: unknown): data is PricingWidgetData {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as WidgetData).type === "pricing" &&
    typeof (data as PricingWidgetData).content === "object" &&
    Array.isArray((data as PricingWidgetData).content?.tiers)
  );
}
