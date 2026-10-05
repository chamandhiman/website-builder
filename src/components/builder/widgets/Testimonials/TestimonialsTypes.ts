import type { WidgetData } from "../widgetRegistry";

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  company?: string;
  quote: string;
  avatar: string;
  rating?: number;
}

export interface TestimonialsContent extends Record<string, unknown> {
  eyebrow?: string;
  heading?: string;
  description?: string;
  items: TestimonialItem[];
}

export type TestimonialsLayoutMode = "static" | "carousel";

export interface TestimonialsStyle extends Record<string, unknown> {
  mode?: TestimonialsLayoutMode;
  desktopColumns?: number;
  backgroundColor?: string;
  cardBackgroundColor?: string;
  cardBorderRadius?: string;
  cardBorderColor?: string;
  cardBorderWidth?: string;
  cardPadding?: string;
  cardShadow?: string;
  cardGap?: string;
  quoteColor?: string;
  quoteFontSize?: string;
  nameColor?: string;
  nameFontSize?: string;
  roleColor?: string;
  starColor?: string;
  avatarSize?: string;
  avatarBorderRadius?: string;
  hoverLift?: string;
  // Carousel
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
}

export interface TestimonialsWidgetData extends WidgetData {
  type: "testimonials";
  content: TestimonialsContent;
  style: TestimonialsStyle;
}

export const defaultTestimonialItems: TestimonialItem[] = [
  {
    id: "t1",
    name: "Sarah Johnson",
    role: "Property Investor",
    company: "NYC Real Estate Group",
    quote: "Working with DreamHome transformed my investment strategy. Their team's expertise and dedication helped me secure three premium properties at exceptional valuations.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
  {
    id: "t2",
    name: "Michael Brown",
    role: "Senior Architect",
    company: "Vanguard Design Studio",
    quote: "The market intelligence and off-market access DreamHome provides is unmatched. I found my perfect beachside villa through their exclusive connections — couldn't be happier.",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
  {
    id: "t3",
    name: "Emily Davis",
    role: "VP of Operations",
    company: "Horizon Capital Partners",
    quote: "From the very first consultation to final closing, DreamHome's white-glove service exceeded every expectation. They truly understand what premium service means.",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
    rating: 5,
  },
];

export const defaultTestimonialsWidgetData: TestimonialsWidgetData = {
  id: "testimonials-widget",
  type: "testimonials",
  variant: "Static Grid",
  content: {
    eyebrow: "WHAT OUR CLIENTS SAY",
    heading: "Real Stories from Real Clients",
    description: "Thousands of satisfied clients trust us to find their perfect property and deliver exceptional results.",
    items: defaultTestimonialItems,
  },
  style: {
    mode: "static",
    desktopColumns: 3,
    backgroundColor: "#0f172a",
    cardBackgroundColor: "#1e293b",
    cardBorderRadius: "16px",
    cardBorderColor: "#334155",
    cardBorderWidth: "1px",
    cardPadding: "28px",
    cardShadow: "0 4px 24px rgba(0,0,0,0.15)",
    cardGap: "24px",
    quoteColor: "#cbd5e1",
    quoteFontSize: "14px",
    nameColor: "#f1f5f9",
    nameFontSize: "16px",
    roleColor: "#64748b",
    starColor: "#facc15",
    avatarSize: "52px",
    avatarBorderRadius: "9999px",
    hoverLift: "6px",
    autoplay: false,
    autoplayDelay: 5000,
    loop: true,
    showArrows: true,
    showDots: true,
  },
  layout: {
    paddingTop: "72px",
    paddingBottom: "72px",
    paddingX: "24px",
  },
  responsive: {
    hideOnMobile: false,
    hideOnTablet: false,
    hideOnDesktop: false,
  },
};

export function isTestimonialsWidgetData(data: unknown): data is TestimonialsWidgetData {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as WidgetData).type === "testimonials" &&
    typeof (data as TestimonialsWidgetData).content === "object" &&
    Array.isArray((data as TestimonialsWidgetData).content?.items)
  );
}
