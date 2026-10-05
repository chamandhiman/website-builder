import type { WidgetData } from "../widgetRegistry";
import type { BuilderAssetEntry } from "@/lib/builder/image-storage";

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio?: string;
  photo: string | BuilderAssetEntry;
  alt?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  email?: string;
}

export interface TeamContent extends Record<string, unknown> {
  eyebrow?: string;
  heading?: string;
  description?: string;
  members: TeamMember[];
}

export type TeamLayoutMode = "static" | "carousel";

export interface TeamStyle extends Record<string, unknown> {
  mode?: TeamLayoutMode;
  desktopColumns?: number;
  tabletColumns?: number;
  mobileColumns?: number;
  backgroundColor?: string;
  cardBackgroundColor?: string;
  cardBorderRadius?: string;
  cardBorderColor?: string;
  cardBorderWidth?: string;
  cardPadding?: string;
  cardShadow?: string;
  cardGap?: string;
  hoverLift?: string;
  nameColor?: string;
  nameFontSize?: string;
  roleColor?: string;
  roleFontSize?: string;
  bioColor?: string;
  socialIconColor?: string;
  photoHeight?: string;
  photoBorderRadius?: string;
  // Carousel options
  autoplay?: boolean;
  autoplayDelay?: number;
  loop?: boolean;
  showArrows?: boolean;
  showDots?: boolean;
}

export interface TeamWidgetData extends WidgetData {
  type: "team";
  content: TeamContent;
  style: TeamStyle;
}

export const defaultTeamMembers: TeamMember[] = [
  {
    id: "m1",
    name: "David Reynolds",
    role: "Managing Director & Founder",
    bio: "Over 18 years of executive leadership in premium property acquisitions and global portfolio investments.",
    photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "david@example.com",
  },
  {
    id: "m2",
    name: "Sophia Martinez",
    role: "Head of Architecture & Design",
    bio: "Award-winning architectural designer specializing in sustainable luxury developments and modern interior aesthetics.",
    photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "sophia@example.com",
  },
  {
    id: "m3",
    name: "Robert Chen",
    role: "Lead Development Director",
    bio: "Expert project manager overseeing multi-million dollar residential and commercial urban developments.",
    photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com",
    github: "https://github.com",
    email: "robert@example.com",
  },
  {
    id: "m4",
    name: "Olivia Vance",
    role: "Senior Client Relations Advisor",
    bio: "Dedicated client partner delivering seamless concierge advisory services for premier real estate transactions.",
    photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80",
    linkedin: "https://linkedin.com",
    twitter: "https://twitter.com",
    email: "olivia@example.com",
  },
];

export const defaultTeamWidgetData: TeamWidgetData = {
  id: "team-widget",
  type: "team",
  variant: "Static Grid",
  content: {
    eyebrow: "OUR PROFESSIONALS",
    heading: "Meet Our Expert Team",
    description: "Our dedicated professionals bring decades of industry mastery, passion, and proven results.",
    members: defaultTeamMembers,
  },
  style: {
    mode: "static",
    desktopColumns: 4,
    tabletColumns: 2,
    mobileColumns: 1,
    backgroundColor: "#ffffff",
    cardBackgroundColor: "#f8fafc",
    cardBorderRadius: "16px",
    cardBorderColor: "#e2e8f0",
    cardBorderWidth: "1px",
    cardPadding: "20px",
    cardShadow: "0 4px 20px rgba(0,0,0,0.04)",
    cardGap: "24px",
    hoverLift: "6px",
    nameColor: "#0f172a",
    nameFontSize: "18px",
    roleColor: "#d97706",
    roleFontSize: "13px",
    bioColor: "#64748b",
    socialIconColor: "#94a3b8",
    photoHeight: "260px",
    photoBorderRadius: "12px",
    autoplay: false,
    autoplayDelay: 4000,
    loop: true,
    showArrows: true,
    showDots: true,
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

export function isTeamWidgetData(data: unknown): data is TeamWidgetData {
  return (
    typeof data === "object" &&
    data !== null &&
    (data as WidgetData).type === "team" &&
    typeof (data as TeamWidgetData).content === "object" &&
    Array.isArray((data as TeamWidgetData).content?.members)
  );
}
