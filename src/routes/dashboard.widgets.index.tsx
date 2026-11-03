import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  getAllWidgets,
  deleteWidget,
  duplicateWidget,
  createNewGoogleReviewsWidget,
  createNewCountdownWidget,
  createNewFaqWidget,
  createNewWhatsAppChatWidget,
  createNewAccessibilityWidget,
  createNewLanguageSwitcherWidget,
  saveWidget,
  linkWidgetToWebsite,
  COUNTDOWN_TEMPLATE_LIST,
  type WidgetInstanceRecord,
  type CountdownTemplateItem,
} from "@/services/widgetService";
import { useCloudProjects } from "@/lib/builder/useCloudProjects";
import { createNewAnnouncementPopupWidget } from "@/services/announcementPopupTemplates";
import { renderCountdownHtml, renderGoogleReviewsHtml } from "@/lib/widget-runtime/wtoWidgetRuntime";
import { TemplateCardPreview } from "@/components/widgets/TemplateCardPreview";
import {
  Clock,
  Star,
  Code2,
  Edit3,
  Copy,
  Trash2,
  ArrowRight,
  ArrowLeft,
  X,
  Check,
  Search,
  Megaphone,
  Sparkles,
  HelpCircle,
  Eye,
  Activity,
  MessageSquare,
  LayoutGrid,
  Share2,
  FileText,
  Boxes,
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Percent,
  ShoppingCart,
  ShieldCheck,
  Quote,
  Zap,
  Package,
  Calendar,
  Send,
  ClipboardList,
  QrCode,
  Headphones,
  Bell,
  LayoutList,
  Layers,
  ExternalLink,
  Globe,
  SlidersHorizontal,
  Hash,
  ArrowUpDown,
  CheckCircle2,
  AlertCircle,
  Filter,
  FolderTree,
  Table,
  Link2,
  Unlink,
  Accessibility,
  Languages,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

interface WidgetsSearchParams {
  tab?: "catalog" | "my_widgets" | "countdown" | "google_reviews";
}

export const Route = createFileRoute("/dashboard/widgets/")({
  validateSearch: (search: Record<string, unknown>): WidgetsSearchParams => {
    return {
      tab: (search.tab as any) || undefined,
    };
  },
  component: DashboardWidgetsPage,
});

const pad = (n: number) => String(n).padStart(2, "0");

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="w-4 h-4 shrink-0" {...props}>
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function WhatsAppIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 6.46 17.5 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.76 7.85 19.01L7.55 18.83L4.43 19.65L5.26 16.61L5.06 16.29C4.24 14.99 3.8 13.47 3.8 11.91C3.8 7.37 7.49 3.68 12.04 3.68C16.58 3.68 20.28 7.37 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 14.39C16.31 14.26 15.09 13.66 14.86 13.58C14.64 13.5 14.47 13.46 14.31 13.71C14.14 13.96 13.66 14.52 13.51 14.69C13.37 14.85 13.22 14.88 12.97 14.75C12.72 14.63 11.92 14.36 10.97 13.51C10.23 12.85 9.73 12.03 9.58 11.78C9.44 11.53 9.56 11.4 9.69 11.27C9.8 11.16 9.94 10.99 10.06 10.84C10.19 10.7 10.23 10.59 10.31 10.43C10.4 10.26 10.35 10.12 10.29 10C10.23 9.87 9.73 8.65 9.53 8.14C9.33 7.65 9.12 7.71 8.97 7.71C8.82 7.7 8.66 7.7 8.49 7.7C8.32 7.7 8.05 7.76 7.82 8.01C7.6 8.26 6.95 8.87 6.95 10.12C6.95 11.37 7.86 12.57 7.99 12.74C8.11 12.91 9.77 15.47 12.31 16.57C12.91 16.83 13.38 16.99 13.74 17.1C14.34 17.29 14.89 17.26 15.33 17.2C15.82 17.13 16.83 16.59 17.04 16C17.25 15.41 17.25 14.9 17.19 14.8C17.12 14.7 16.96 14.64 16.71 14.52L16.56 14.39Z" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function YouTubeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current" {...props}>
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

function InstagramIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className="w-5 h-5 fill-none stroke-current" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export interface CatalogCategory {
  id: string;
  label: string;
  iconName: string;
  headerTitle: string;
  headerIcon: string;
}

export interface MarketplaceCategoryItem {
  id: string;
  label: string;
  icon: any;
  count: number;
}

export interface CatalogWidgetItem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  marketplaceCategory: string;
  status: "ready" | "coming_soon";
  iconType: string;
  iconBgClass: string;
  features: string[];
  designsCount: string;
  badge?: "popular" | "new";
}

export const MARKETPLACE_CATEGORIES: MarketplaceCategoryItem[] = [
  { id: "all", label: "All Widgets", icon: Layers, count: 26 },
  { id: "social", label: "Social", icon: Share2, count: 6 },
  { id: "reviews", label: "Reviews", icon: Star, count: 4 },
  { id: "chat", label: "Chat", icon: MessageSquare, count: 3 },
  { id: "forms", label: "Forms", icon: FileText, count: 4 },
  { id: "promotion", label: "Promotion", icon: Megaphone, count: 5 },
  { id: "content", label: "Content", icon: LayoutList, count: 3 },
  { id: "utility", label: "Utility", icon: SlidersHorizontal, count: 5 },
];

const CATALOG_CATEGORIES: CatalogCategory[] = [
  { id: "all", label: "All widgets", iconName: "layout_grid", headerTitle: "All Widgets", headerIcon: "layout_grid" },
  { id: "localization", label: "Language & Localization", iconName: "languages", headerTitle: "Language & Localization", headerIcon: "languages" },
  { id: "support", label: "Support", iconName: "message", headerTitle: "Support & Communication", headerIcon: "message" },
  { id: "sales", label: "Sales & Promotions", iconName: "megaphone", headerTitle: "Sales & Promotions", headerIcon: "megaphone" },
  { id: "reviews", label: "Reviews & Trust", iconName: "star", headerTitle: "Reviews & Trust", headerIcon: "star" },
  { id: "urgency", label: "Urgency", iconName: "clock", headerTitle: "Urgency & Engagement", headerIcon: "clock" },
  { id: "social", label: "Social", iconName: "share", headerTitle: "Social Media", headerIcon: "share" },
  { id: "accessibility", label: "Accessibility & Compliance", iconName: "accessibility", headerTitle: "Accessibility & Compliance", headerIcon: "accessibility" },
  { id: "forms", label: "Forms", iconName: "file_text", headerTitle: "Forms & Surveys", headerIcon: "file_text" },
  { id: "other", label: "Other", iconName: "boxes", headerTitle: "Other Utilities", headerIcon: "boxes" },
];

const CATALOG_WIDGETS: CatalogWidgetItem[] = [
  // 1. WhatsApp Chat (Top Row 1, Card 1 in reference mockup)
  {
    id: "whatsapp_chat",
    title: "WhatsApp Chat",
    description: "Floating chat button that opens WhatsApp conversations.",
    categoryId: "support",
    marketplaceCategory: "chat",
    status: "ready",
    badge: "popular",
    designsCount: "3+ Designs",
    iconType: "whatsapp",
    iconBgClass: "bg-[#25d366] text-white",
    features: [
      "Official WhatsApp Click to Chat (wa.me) URL integration",
      "Floating buttons, greeting speech bubbles, and contact cards",
      "Pre-filled starter messages & agent profile information",
      "100% free — no paid WhatsApp API or backend needed",
    ],
  },

  // 2. Announcement Bar (Top Row 1, Card 2 in reference mockup)
  {
    id: "announcement_bar",
    title: "Announcement Bar",
    description: "Slim top bar for news, flash sales and promotions.",
    categoryId: "sales",
    marketplaceCategory: "promotion",
    status: "ready",
    badge: "popular",
    designsCount: "6+ Designs",
    iconType: "announcement_bar",
    iconBgClass: "bg-[#f43f5e] text-white",
    features: [
      "Top and bottom sticky notification bars",
      "Integrated countdown timer for urgent sales",
      "Coupon code copy button with click-to-copy",
      "Exit-intent and scroll trigger display rules",
    ],
  },

  // 3. Popup Widget (Top Row 1, Card 3 in reference mockup)
  {
    id: "popup",
    title: "Popup Widget",
    description: "Create eye-catching popups to engage your visitors and increase conversions.",
    categoryId: "sales",
    marketplaceCategory: "promotion",
    status: "ready",
    badge: "popular",
    designsCount: "8+ Designs",
    iconType: "popup",
    iconBgClass: "bg-[#a855f7] text-white",
    features: [
      "Exit-intent modal popups that retain leaving visitors",
      "Timed delay & page scroll percentage triggers",
      "Special discount code popups with CTA link",
      "Mobile-responsive full screen or centered dialog",
    ],
  },

  // 4. Testimonials Slider (Row 2, Card 1 in reference mockup)
  {
    id: "testimonial_slider",
    title: "Testimonials Slider",
    description: "Display customer testimonials in a beautiful slider.",
    categoryId: "reviews",
    marketplaceCategory: "reviews",
    status: "coming_soon",
    badge: "popular",
    designsCount: "5+ Designs",
    iconType: "testimonial_slider",
    iconBgClass: "bg-[#3b82f6] text-white",
    features: [
      "Touch-friendly carousel with smooth autoplay",
      "Client photo, company name, role and star rating",
      "Support for video testimonial embeds",
      "Custom accent colors matching your brand palette",
    ],
  },

  // 5. Google Reviews (Row 2, Card 2 in reference mockup)
  {
    id: "google_reviews",
    title: "Google Reviews",
    description: "Show your Google reviews and build instant trust.",
    categoryId: "reviews",
    marketplaceCategory: "reviews",
    status: "ready",
    designsCount: "4+ Designs",
    iconType: "google",
    iconBgClass: "bg-white text-zinc-900 border border-[#E2E8F0] shadow-2xs",
    features: [
      "Direct Google Places search & review synchronization",
      "Carousel, grid, masonry & floating rating badge",
      "Filter only 4-star and 5-star positive reviews",
      "Verified Google reviewer badge & authentic stars",
    ],
  },

  // 6. Countdown Timer (Row 2, Card 3 in reference mockup)
  {
    id: "countdown_timer",
    title: "Countdown Timer",
    description: "Create urgency for special offers or events.",
    categoryId: "urgency",
    marketplaceCategory: "utility",
    status: "ready",
    designsCount: "6+ Designs",
    iconType: "countdown_timer",
    iconBgClass: "bg-[#8b5cf6] text-white",
    features: [
      "10 designer presets (Flip clock, cyber digital, minimal bar)",
      "Evergreen visitor timers & fixed deadline dates",
      "Sticky header, bottom bar or embedded in-page",
      "Custom actions on timer expiry (hide, redirect, show message)",
    ],
  },

  // 7. Instagram Feed (Row 3, Card 1 in reference mockup)
  {
    id: "instagram_feed",
    title: "Instagram Feed",
    description: "Display your Instagram photos or reels.",
    categoryId: "social",
    marketplaceCategory: "social",
    status: "coming_soon",
    designsCount: "4+ Designs",
    iconType: "instagram",
    iconBgClass: "bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white",
    features: [
      "Auto-updating grid and carousel feeds from your profile",
      "Lightbox modal popup to view photos and videos in HD",
      "Filter by specific hashtags or user reels",
      "Shoppable post links directly to product pages",
    ],
  },

  // 8. Social Icons (Row 3, Card 2 in reference mockup)
  {
    id: "social_icons",
    title: "Social Icons",
    description: "Add social media links to your site.",
    categoryId: "social",
    marketplaceCategory: "social",
    status: "coming_soon",
    designsCount: "5+ Designs",
    iconType: "social_icons",
    iconBgClass: "bg-[#3b82f6] text-white",
    features: [
      "40+ official brand icons (Twitter/X, LinkedIn, TikTok, etc.)",
      "Floating sidebar or embedded header/footer links",
      "Sleek hover effects, brand color fills and glowing badges",
      "Custom URL links with automatic tooltips",
    ],
  },

  // 9. Contact Form (Row 3, Card 3 in reference mockup)
  {
    id: "contact_form",
    title: "Contact Form",
    description: "Collect messages from your visitors.",
    categoryId: "support",
    marketplaceCategory: "forms",
    status: "coming_soon",
    designsCount: "4+ Designs",
    iconType: "contact_form",
    iconBgClass: "bg-[#ec4899] text-white",
    features: [
      "Drag-and-drop custom form field builder",
      "Instant email delivery and dashboard inbox",
      "Spam protection with smart honeypot & reCAPTCHA",
      "File upload attachment support",
    ],
  },

  // 10. FAQ Accordion
  {
    id: "faq_accordion",
    title: "FAQ Accordion",
    description: "Answer common questions easily.",
    categoryId: "support",
    marketplaceCategory: "content",
    status: "ready",
    badge: "popular",
    designsCount: "8+ Designs",
    iconType: "faq",
    iconBgClass: "bg-[#2563eb] text-white",
    features: [
      "8 modern preset designs (Classic, Modern, Minimal, Floating)",
      "Instant live search and category filter tabs",
      "Rich text answers with markdown & links support",
      "Automatic Google FAQPage Schema markup for rich SEO snippets",
    ],
  },

  // 11. Website Language Switcher
  {
    id: "language_switcher",
    title: "Website Language Switcher",
    description: "Let visitors choose their preferred website language.",
    categoryId: "localization",
    marketplaceCategory: "utility",
    status: "ready",
    badge: "new",
    designsCount: "7+ Designs",
    iconType: "languages",
    iconBgClass: "bg-[#0284c7] text-white",
    features: [
      "Zero paid API required — direct navigation to translated pages",
      "7 distinct layout presets (Globe, Flag button, Floating, Pills, etc.)",
      "Searchable catalog of 50+ languages with BCP 47 code validation",
      "Browser language suggestions, client persistence & anti-loop redirect safety",
    ],
  },

  // 12. Accessibility Widget
  {
    id: "accessibility",
    title: "Accessibility Widget",
    description: "Give visitors convenient controls to customize their website viewing experience.",
    categoryId: "accessibility",
    marketplaceCategory: "utility",
    status: "ready",
    badge: "new",
    designsCount: "5+ Designs",
    iconType: "accessibility",
    iconBgClass: "bg-[#0284c7] text-white",
    features: [
      "Real text size, letter spacing, and line height adjusters",
      "High contrast, inverted, and monochrome visual modes",
      "Dyslexic/readable font, reading guide, and large cursor aids",
      "100% keyboard navigable, ARIA compliant, and site-persistent",
    ],
  },

  // 13. Live Chat
  {
    id: "live_chat",
    title: "Live Chat",
    description: "Chat with visitors in real-time.",
    categoryId: "support",
    marketplaceCategory: "chat",
    status: "coming_soon",
    designsCount: "4+ Designs",
    iconType: "live_chat",
    iconBgClass: "bg-[#8b5cf6] text-white",
    features: [
      "Real-time 2-way messaging with typing indicators",
      "Automated greeting triggers based on time on page",
      "Collect email & lead data before starting chat",
      "Desktop & mobile instant push alerts",
    ],
  },

  // 14. Sales Notification
  {
    id: "sales_notification",
    title: "Sales Notification",
    description: "Show recent sales and sign-ups.",
    categoryId: "sales",
    marketplaceCategory: "promotion",
    status: "coming_soon",
    designsCount: "4+ Designs",
    iconType: "sales_notification",
    iconBgClass: "bg-[#3b82f6] text-white",
    features: [
      "Realistic recent purchase popups (FOMO alerts)",
      "Custom product names, customer avatars & locations",
      "Configurable cycle intervals and randomize option",
      "Increases buyer trust and conversion rates",
    ],
  },

  // 15. Discount Coupon
  {
    id: "discount_coupon",
    title: "Discount Coupon",
    description: "Show discount codes and special deals.",
    categoryId: "sales",
    marketplaceCategory: "promotion",
    status: "coming_soon",
    designsCount: "4+ Designs",
    iconType: "discount_coupon",
    iconBgClass: "bg-[#10b981] text-white",
    features: [
      "Click-to-copy promo codes with micro-animations",
      "Scratch card & mystery discount reveal gamification",
      "Timed coupons with countdown to expiry",
      "Direct checkout redirect with code pre-applied",
    ],
  },

  // 16. Limited Time Offer
  {
    id: "limited_time_offer",
    title: "Limited Time Offer",
    description: "Highlight special offers with urgent ribbons.",
    categoryId: "urgency",
    marketplaceCategory: "promotion",
    status: "coming_soon",
    designsCount: "3+ Designs",
    iconType: "limited_time_offer",
    iconBgClass: "bg-[#0ea5e9] text-white",
    features: [
      "Flash sale ribbon banner with animated pulsing badge",
      "Original price vs discounted price calculation display",
      "Countdown timer built into promotional ribbon",
      "High-contrast color themes for maximum click-through",
    ],
  },

  // 17. Trust Badges
  {
    id: "trust_badges",
    title: "Trust Badges",
    description: "Show trust badges and payment icons.",
    categoryId: "reviews",
    marketplaceCategory: "reviews",
    status: "coming_soon",
    designsCount: "6+ Designs",
    iconType: "trust_badges",
    iconBgClass: "bg-[#10b981] text-white",
    features: [
      "Verified SSL, McAfee, Norton security badges",
      "Payment method icons (Visa, Mastercard, Amex, PayPal, Apple Pay)",
      "30-day money back guarantee & free shipping emblems",
      "High-resolution vector rendering on all screen sizes",
    ],
  },

  // 18. Rating Stars
  {
    id: "rating_stars",
    title: "Rating Stars",
    description: "Display star ratings for products or services.",
    categoryId: "reviews",
    marketplaceCategory: "reviews",
    status: "coming_soon",
    designsCount: "4+ Designs",
    iconType: "rating_stars",
    iconBgClass: "bg-[#f59e0b] text-white",
    features: [
      "Compact star rating badge for hero sections and headers",
      "Fractional stars (e.g., 4.9/5) with total review counter",
      "Schema.org AggregateRating markup for Google Rich Snippets",
      "Customizable star colors, sizes and layout styles",
    ],
  },

  // 19. Stock Counter
  {
    id: "stock_counter",
    title: "Stock Counter",
    description: "Show remaining stock or limited availability.",
    categoryId: "urgency",
    marketplaceCategory: "utility",
    status: "coming_soon",
    designsCount: "3+ Designs",
    iconType: "stock_counter",
    iconBgClass: "bg-[#8b5cf6] text-white",
    features: [
      "Animated inventory progress bar ('Only 3 left in stock!')",
      "Dynamic stock countdown triggered on visitor page view",
      "Custom low-stock threshold warning messages",
      "Proven to reduce checkout abandonment",
    ],
  },

  // 20. Event Countdown
  {
    id: "event_countdown",
    title: "Event Countdown",
    description: "Countdown to your upcoming event.",
    categoryId: "urgency",
    marketplaceCategory: "utility",
    status: "coming_soon",
    designsCount: "4+ Designs",
    iconType: "event_countdown",
    iconBgClass: "bg-[#0ea5e9] text-white",
    features: [
      "Dedicated countdown for webinars, conferences & launches",
      "1-click 'Add to Google Calendar' and 'Apple iCal' button",
      "Automatic visitor timezone detection",
      "Event location, speaker avatars and registration CTA",
    ],
  },

  // 21. Facebook Page
  {
    id: "facebook_page",
    title: "Facebook Page",
    description: "Show your Facebook page feed.",
    categoryId: "social",
    marketplaceCategory: "social",
    status: "coming_soon",
    designsCount: "3+ Designs",
    iconType: "facebook",
    iconBgClass: "bg-[#1877f2] text-white",
    features: [
      "Display your Facebook page posts, likes & cover photo",
      "Integrated page 'Like' button without leaving your site",
      "Direct Facebook Messenger chat button option",
      "Responsive container width adapting to any layout",
    ],
  },

  // 22. YouTube Video
  {
    id: "youtube_video",
    title: "YouTube Video",
    description: "Embed YouTube videos on your site.",
    categoryId: "social",
    marketplaceCategory: "social",
    status: "coming_soon",
    designsCount: "4+ Designs",
    iconType: "youtube",
    iconBgClass: "bg-[#ef4444] text-white",
    features: [
      "Embed videos, Shorts or full YouTube playlists",
      "Custom branded video player frame and thumbnail cover",
      "Autoplay on mute & looping capabilities",
      "Responsive 16:9 aspect ratio across mobile and desktop",
    ],
  },

  // 23. Newsletter Signup
  {
    id: "newsletter_signup",
    title: "Newsletter Signup",
    description: "Grow your email list with opt-in forms.",
    categoryId: "forms",
    marketplaceCategory: "forms",
    status: "coming_soon",
    designsCount: "5+ Designs",
    iconType: "newsletter",
    iconBgClass: "bg-[#7c3aed] text-white",
    features: [
      "High-converting email opt-in banner & popup modal",
      "Direct sync with Mailchimp, ConvertKit, Klaviyo & Webhooks",
      "GDPR compliant opt-in checkbox",
      "Custom thank-you message and discount lead magnet delivery",
    ],
  },

  // 24. Feedback Survey
  {
    id: "feedback_survey",
    title: "Feedback Survey",
    description: "Collect feedback and NPS from visitors.",
    categoryId: "forms",
    marketplaceCategory: "forms",
    status: "coming_soon",
    designsCount: "4+ Designs",
    iconType: "survey",
    iconBgClass: "bg-[#0ea5e9] text-white",
    features: [
      "1-click Net Promoter Score (NPS) and star rating surveys",
      "Emoji mood feedback and optional text comments",
      "Targeted popup after visitor completes a purchase",
      "CSV export and real-time dashboard analytics",
    ],
  },

  // 25. QR Code Generator
  {
    id: "qr_code",
    title: "QR Code Generator",
    description: "Generate scannable QR codes for links & menus.",
    categoryId: "other",
    marketplaceCategory: "utility",
    status: "coming_soon",
    designsCount: "4+ Designs",
    iconType: "qr_code",
    iconBgClass: "bg-[#3b82f6] text-white",
    features: [
      "Custom color, rounded dots & centered logo upload",
      "Links, WiFi passwords, vCard contacts and digital menus",
      "Download high-res SVG & PNG files for print or web",
      "Track total scans and visitor devices",
    ],
  },

  // 26. Audio Player
  {
    id: "audio_player",
    title: "Audio Player",
    description: "Stream audio tracks, episodes or background music.",
    categoryId: "other",
    marketplaceCategory: "content",
    status: "coming_soon",
    designsCount: "3+ Designs",
    iconType: "audio_player",
    iconBgClass: "bg-[#ec4899] text-white",
    features: [
      "Compact sticky audio player for podcasts & music tracks",
      "Audio waveform visualizer with scrub control",
      "Track title, artist name, and album artwork",
      "Continuous background playback as visitors browse pages",
    ],
  },
];

function renderItemIcon(iconType: string) {
  switch (iconType) {
    case "languages":
      return <Languages className="w-5 h-5 text-white" />;
    case "whatsapp":
      return <WhatsAppIcon />;
    case "accessibility":
      return <Accessibility className="w-5 h-5 text-white" />;
    case "faq":
      return <HelpCircle className="w-5 h-5 text-white" />;
    case "live_chat":
      return <MessageSquare className="w-5 h-5 text-white" />;
    case "contact_form":
      return <Send className="w-5 h-5 text-white" />;
    case "announcement_bar":
      return <Megaphone className="w-5 h-5 text-white" />;
    case "popup":
      return <Layers className="w-5 h-5 text-white" />;
    case "sales_notification":
      return <ShoppingCart className="w-5 h-5 text-white" />;
    case "discount_coupon":
      return <Percent className="w-5 h-5 text-white" />;
    case "google":
      return <GoogleIcon className="w-5 h-5" />;
    case "testimonial_slider":
      return <Quote className="w-5 h-5 text-white" />;
    case "trust_badges":
      return <ShieldCheck className="w-5 h-5 text-white" />;
    case "rating_stars":
      return <Star className="w-5 h-5 text-white fill-white" />;
    case "countdown_timer":
      return <Clock className="w-5 h-5 text-white" />;
    case "limited_time_offer":
      return <Zap className="w-5 h-5 text-white fill-white" />;
    case "stock_counter":
      return <Package className="w-5 h-5 text-white" />;
    case "event_countdown":
      return <Calendar className="w-5 h-5 text-white" />;
    case "instagram":
      return <InstagramIcon />;
    case "social_icons":
      return <Share2 className="w-5 h-5 text-white" />;
    case "facebook":
      return <FacebookIcon />;
    case "youtube":
      return <YouTubeIcon />;
    case "newsletter":
      return <Send className="w-5 h-5 text-white" />;
    case "survey":
      return <ClipboardList className="w-5 h-5 text-white" />;
    case "qr_code":
      return <QrCode className="w-5 h-5 text-white" />;
    case "audio_player":
      return <Headphones className="w-5 h-5 text-white" />;
    default:
      return <Sparkles className="w-5 h-5 text-white" />;
  }
}

function getWidgetDisplayMeta(type: string, isSmall = false, config?: any) {
  const iconSize = isSmall ? "w-3.5 h-3.5" : "w-4 h-4";
  switch (type) {
    case "language_switcher":
      return {
        label: "Website Language Switcher",
        icon: <Languages className={`${iconSize} text-[#38bdf8]`} />,
        containerClass: "bg-[#38bdf8]/15 border-[#38bdf8]/30 text-[#38bdf8]",
      };
    case "accessibility":
      return {
        label: "Accessibility Toolbar",
        icon: <Accessibility className={`${iconSize} text-[#38bdf8]`} />,
        containerClass: "bg-[#38bdf8]/15 border-[#38bdf8]/30 text-[#38bdf8]",
      };
    case "whatsapp_chat":
      return {
        label: "WhatsApp Live Chat",
        icon: <WhatsAppIcon className={`${iconSize} text-[#25d366]`} />,
        containerClass: "bg-[#25d366]/15 border-[#25d366]/30 text-[#25d366]",
      };
    case "countdown":
      return {
        label: "Countdown Timer",
        icon: <Clock className={`${iconSize} text-[#f59e0b]`} />,
        containerClass: "bg-amber-500/15 border-amber-500/30 text-amber-400",
      };
    case "announcement_popup":
      if (config?.displayMode === "popup") {
        return {
          label: "Popup Modal",
          icon: <Layers className={`${iconSize} text-[#a855f7]`} />,
          containerClass: "bg-purple-500/15 border-purple-500/30 text-purple-400",
        };
      }
      return {
        label: "Announcement Bar",
        icon: <Megaphone className={`${iconSize} text-[#3b82f6]`} />,
        containerClass: "bg-blue-500/15 border-blue-500/30 text-blue-400",
      };
    case "faq_accordion":
      return {
        label: "FAQ Accordion",
        icon: <HelpCircle className={`${iconSize} text-sky-400`} />,
        containerClass: "bg-sky-500/15 border-sky-500/30 text-sky-400",
      };
    case "google_reviews":
    default:
      return {
        label: "Google Reviews",
        icon: <GoogleIcon className={iconSize} />,
        containerClass: "bg-white/[0.08] border-white/[0.15] text-white",
      };
  }
}

function renderCategoryPillIcon(iconName: string, className = "w-4 h-4") {
  switch (iconName) {
    case "languages":
      return <Languages className={className} />;
    case "layout_grid":
      return <LayoutGrid className={className} />;
    case "accessibility":
      return <Accessibility className={className} />;
    case "message":
      return <Headphones className={className} />;
    case "megaphone":
      return <Percent className={className} />;
    case "star":
      return <Star className={className} />;
    case "clock":
      return <Clock className={className} />;
    case "share":
      return <Share2 className={className} />;
    case "file_text":
      return <FileText className={className} />;
    case "boxes":
      return <Layers className={className} />;
    default:
      return <Sparkles className={className} />;
  }
}

function WidgetMiniaturePreview({ widgetId }: { widgetId: string }) {
  switch (widgetId) {
    case "whatsapp_chat":
      return (
        <div className="h-full w-full p-3 flex flex-col justify-between select-none">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#111827]">
            <span className="w-2 h-2 rounded-full bg-[#22c55e]" />
            <span>WhatsApp Customer Support</span>
          </div>
          <div className="flex items-start gap-2 my-auto">
            <div className="w-5 h-5 rounded-full bg-[#25D366] text-white text-[10px] font-bold flex items-center justify-center shrink-0 shadow-2xs">
              W
            </div>
            <div className="p-1.5 px-2.5 rounded-2xl rounded-tl-none bg-white border border-[#E2E8F0] shadow-2xs text-[10px] text-[#334155] leading-tight">
              Hi there! 👋 How can we help you today?
            </div>
          </div>
          <div className="flex justify-end">
            <span className="px-2.5 py-1 rounded-full bg-[#25D366] text-white text-[10px] font-bold flex items-center gap-1 shadow-2xs">
              <WhatsAppIcon className="w-3 h-3 fill-white" />
              <span>Start Chat</span>
            </span>
          </div>
        </div>
      );

    case "announcement_bar":
      return (
        <div className="h-full w-full p-3 flex items-center justify-center select-none">
          <div className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#7137D8] via-[#D52BBD] to-[#3478F6] text-white flex items-center justify-between text-[11px] shadow-sm">
            <div className="flex items-center gap-1.5 font-bold truncate">
              <span className="px-1.5 py-0.5 rounded text-[9px] font-black bg-white/20 uppercase tracking-wider shrink-0">
                NEW
              </span>
              <span className="truncate">Spring Sale: 20% Off All Plans!</span>
            </div>
            <span className="px-2 py-0.5 rounded-lg bg-white text-[#7137D8] font-black text-[10px] shrink-0 shadow-2xs ml-2">
              Claim Offer
            </span>
          </div>
        </div>
      );

    case "popup":
      return (
        <div className="h-full w-full p-2 flex items-center justify-center select-none">
          <div className="w-full max-w-[210px] p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-md text-center relative">
            <span className="absolute top-1 right-2 text-slate-400 text-xs font-bold leading-none cursor-default">
              ×
            </span>
            <div className="text-sm leading-none mb-0.5">🎁</div>
            <div className="text-[11px] font-extrabold text-[#111827]">Get 15% Off Your First Order</div>
            <div className="flex items-center gap-1 mt-1.5">
              <div className="flex-1 bg-[#F8FAFC] border border-[#E2E8F0] rounded px-2 py-1 text-[9px] text-slate-400 text-left truncate">
                Enter your email
              </div>
              <span className="px-2.5 py-1 rounded bg-[#7137D8] text-white text-[9px] font-bold shadow-2xs">
                Claim
              </span>
            </div>
          </div>
        </div>
      );

    case "testimonial_slider":
      return (
        <div className="h-full w-full px-2 py-3 flex items-center justify-between select-none">
          <span className="text-slate-400 text-xs font-bold p-1">‹</span>
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex-1 mx-1 min-w-0">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80"
              alt="Reviewer"
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
            <div className="min-w-0">
              <p className="text-[10px] text-[#334155] italic line-clamp-2 leading-tight">
                &quot;Great experience! The setup was super easy and it works perfectly.&quot;
              </p>
              <div className="text-amber-400 text-[9px] font-bold mt-0.5">★★★★★</div>
            </div>
          </div>
          <span className="text-slate-400 text-xs font-bold p-1">›</span>
        </div>
      );

    case "google_reviews":
      return (
        <div className="h-full w-full p-3 flex items-center justify-center select-none">
          <div className="w-full max-w-[210px] p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs text-center flex flex-col items-center justify-center">
            <GoogleIcon className="w-5 h-5 mb-0.5" />
            <div className="text-[11px] font-bold text-[#111827]">Google Reviews</div>
            <div className="flex items-center gap-1 mt-0.5">
              <span className="text-sm font-black text-[#111827]">4.9</span>
              <span className="text-amber-400 text-xs">★★★★★</span>
            </div>
            <div className="text-[10px] text-[#64748B] mt-0.5 font-medium">(1,248 reviews)</div>
          </div>
        </div>
      );

    case "countdown_timer":
      return (
        <div className="h-full w-full p-2.5 flex flex-col items-center justify-center select-none">
          <div className="text-[11px] font-bold text-[#111827] mb-2">Limited Time Offer</div>
          <div className="grid grid-cols-4 gap-1.5 w-full max-w-[230px]">
            <div className="p-1 rounded-lg bg-[#F6F0FE] border border-[#EDE0FD] text-center">
              <span className="block text-xs font-black text-[#7137D8] leading-tight">02</span>
              <span className="block text-[8px] font-bold text-[#7137D8]/80 uppercase">Days</span>
            </div>
            <div className="p-1 rounded-lg bg-[#EEF6FE] border border-[#DBEAFE] text-center">
              <span className="block text-xs font-black text-[#2563EB] leading-tight">14</span>
              <span className="block text-[8px] font-bold text-[#2563EB]/80 uppercase">Hours</span>
            </div>
            <div className="p-1 rounded-lg bg-[#FAF5FF] border border-[#F3E8FF] text-center">
              <span className="block text-xs font-black text-[#9333EA] leading-tight">36</span>
              <span className="block text-[8px] font-bold text-[#9333EA]/80 uppercase">Minutes</span>
            </div>
            <div className="p-1 rounded-lg bg-[#FDF2F8] border border-[#FCE7F3] text-center">
              <span className="block text-xs font-black text-[#DB2777] leading-tight">28</span>
              <span className="block text-[8px] font-bold text-[#DB2777]/80 uppercase">Seconds</span>
            </div>
          </div>
        </div>
      );

    case "instagram_feed":
      return (
        <div className="h-full w-full p-2.5 flex flex-col justify-center select-none">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-[#111827] mb-2 px-0.5">
            <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C]" />
            <span>Follow Us on Instagram</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            <div className="aspect-square rounded-lg overflow-hidden bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=120&q=80"
                alt="post"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-slate-200 relative flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=120&q=80"
                alt="post"
                className="w-full h-full object-cover"
              />
              <span className="absolute w-4 h-4 rounded-full bg-black/60 text-white flex items-center justify-center text-[8px]">
                ▶
              </span>
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=120&q=80"
                alt="post"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="aspect-square rounded-lg overflow-hidden bg-slate-200">
              <img
                src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=120&q=80"
                alt="post"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      );

    case "social_icons":
      return (
        <div className="h-full w-full p-3 flex flex-col items-center justify-center select-none">
          <div className="text-[11px] font-bold text-[#111827] mb-2.5">Social Icons</div>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-xs">
              <FacebookIcon className="w-3.5 h-3.5" />
            </div>
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white flex items-center justify-center shadow-xs">
              <InstagramIcon className="w-3.5 h-3.5" />
            </div>
            <div className="w-7 h-7 rounded-full bg-black text-white flex items-center justify-center shadow-xs text-[10px] font-black">
              𝕏
            </div>
            <div className="w-7 h-7 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-xs">
              <YouTubeIcon className="w-3.5 h-3.5" />
            </div>
            <div className="w-7 h-7 rounded-full bg-[#0A66C2] text-white flex items-center justify-center shadow-xs text-[10px] font-black">
              in
            </div>
          </div>
        </div>
      );

    case "contact_form":
      return (
        <div className="h-full w-full p-2.5 flex flex-col justify-center max-w-[220px] mx-auto select-none">
          <div className="text-[11px] font-bold text-[#111827] mb-1.5 text-center">Get in Touch</div>
          <div className="space-y-1">
            <div className="bg-white border border-[#E2E8F0] rounded px-2 py-0.5 text-[9px] text-[#94A3B8]">
              Your Name
            </div>
            <div className="bg-white border border-[#E2E8F0] rounded px-2 py-0.5 text-[9px] text-[#94A3B8]">
              Email Address
            </div>
            <div className="py-1 rounded bg-[#7137D8] text-white font-bold text-[9px] text-center shadow-2xs">
              Send Message
            </div>
          </div>
        </div>
      );

    case "faq_accordion":
      return (
        <div className="h-full w-full p-2.5 flex flex-col justify-center space-y-1.5 max-w-[230px] mx-auto select-none">
          <div className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#111827]">
              <span>How does it work?</span>
              <span className="text-[#7137D8]">▾</span>
            </div>
            <p className="text-[8px] text-[#64748B] mt-0.5 line-clamp-1">Instant setup with zero code required.</p>
          </div>
          <div className="p-1.5 rounded-lg bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-between text-[10px] font-semibold text-[#64748B]">
            <span>Can I customize colors?</span>
            <span>▸</span>
          </div>
        </div>
      );

    case "language_switcher":
      return (
        <div className="h-full w-full p-3 flex flex-col items-center justify-center select-none">
          <div className="w-full max-w-[200px] p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-bold text-[#111827] pb-1 border-b border-[#F1F5F9]">
              <span className="flex items-center gap-1.5">
                <span className="text-xs">🌐</span> English (US)
              </span>
              <span className="text-[#7137D8] text-xs">▾</span>
            </div>
            <div className="flex items-center gap-1 mt-1 text-[9px] text-[#64748B]">
              <span className="px-1.5 py-0.5 rounded bg-[#F6F0FE] text-[#7137D8] font-bold">🇺🇸 EN</span>
              <span className="px-1.5 py-0.5 rounded hover:bg-[#F8FAFC]">🇪🇸 ES</span>
              <span className="px-1.5 py-0.5 rounded hover:bg-[#F8FAFC]">🇫🇷 FR</span>
              <span className="px-1.5 py-0.5 rounded hover:bg-[#F8FAFC]">🇩🇪 DE</span>
            </div>
          </div>
        </div>
      );

    case "accessibility":
      return (
        <div className="h-full w-full p-3 flex items-center justify-center select-none">
          <div className="w-full max-w-[210px] p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center justify-around text-center">
            <div className="p-1 text-center">
              <span className="block text-[10px] font-extrabold text-[#7137D8]">A+</span>
              <span className="text-[8px] text-[#64748B]">Bigger</span>
            </div>
            <div className="h-6 w-px bg-[#E2E8F0]" />
            <div className="p-1 text-center">
              <span className="block text-[10px] font-extrabold text-[#111827]">◐</span>
              <span className="text-[8px] text-[#64748B]">Contrast</span>
            </div>
            <div className="h-6 w-px bg-[#E2E8F0]" />
            <div className="p-1 text-center">
              <span className="block text-[10px] font-extrabold text-[#111827]">Aa</span>
              <span className="text-[8px] text-[#64748B]">Dyslexic</span>
            </div>
          </div>
        </div>
      );

    case "live_chat":
      return (
        <div className="h-full w-full p-3 flex flex-col justify-between select-none">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-[#7137D8] text-white flex items-center justify-center text-[10px] font-bold">
              AI
            </div>
            <div className="text-[10px] text-[#111827] font-bold">
              Support Agent <span className="text-[9px] text-emerald-500 font-semibold">● Online</span>
            </div>
          </div>
          <div className="bg-white border border-[#E2E8F0] p-1.5 rounded-xl rounded-tl-none shadow-2xs text-[9px] text-[#475569]">
            Hello! Let me know if you need any assistance today.
          </div>
          <div className="flex items-center gap-1 text-[8px] text-slate-400">
            <span>Agent is typing</span>
            <span className="animate-pulse">● ● ●</span>
          </div>
        </div>
      );

    case "sales_notification":
      return (
        <div className="h-full w-full p-3 flex items-center justify-center select-none">
          <div className="w-full max-w-[220px] p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-md flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-blue-50 text-[#3b82f6] flex items-center justify-center shrink-0">
              <ShoppingCart className="w-3.5 h-3.5" />
            </span>
            <div className="min-w-0">
              <div className="text-[10px] font-bold text-[#111827] truncate">Alex from London</div>
              <div className="text-[9px] text-[#64748B] truncate">Purchased Pro License · 2m ago</div>
            </div>
          </div>
        </div>
      );

    case "discount_coupon":
      return (
        <div className="h-full w-full p-3 flex items-center justify-center select-none">
          <div className="w-full max-w-[210px] p-2.5 rounded-xl bg-[#F0FDF4] border-2 border-dashed border-[#10B981]/50 text-center">
            <span className="text-[9px] font-bold text-emerald-700 uppercase tracking-wider block">Special Deal</span>
            <span className="text-sm font-black text-emerald-900 tracking-wider block my-0.5">SAVE20</span>
            <span className="text-[8px] font-semibold text-emerald-600 block">Click to copy code</span>
          </div>
        </div>
      );

    case "limited_time_offer":
      return (
        <div className="h-full w-full p-3 flex items-center justify-center select-none">
          <div className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white flex items-center justify-between text-[10px] shadow-sm font-bold">
            <span className="flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 fill-white" /> FLASH SALE 50%
            </span>
            <span className="px-2 py-0.5 rounded bg-white text-orange-600 font-black text-[9px]">
              01:45:20
            </span>
          </div>
        </div>
      );

    case "trust_badges":
      return (
        <div className="h-full w-full p-2.5 flex items-center justify-around select-none">
          <div className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-center shadow-2xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mx-auto mb-0.5" />
            <span className="text-[8px] font-bold text-[#111827] block">SSL 256-bit</span>
          </div>
          <div className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-center shadow-2xs">
            <CheckCircle2 className="w-4 h-4 text-[#7137D8] mx-auto mb-0.5" />
            <span className="text-[8px] font-bold text-[#111827] block">Verified</span>
          </div>
          <div className="p-2 rounded-lg bg-white border border-[#E2E8F0] text-center shadow-2xs">
            <Zap className="w-4 h-4 text-amber-500 mx-auto mb-0.5 fill-amber-500" />
            <span className="text-[8px] font-bold text-[#111827] block">Fast CDN</span>
          </div>
        </div>
      );

    case "rating_stars":
      return (
        <div className="h-full w-full p-3 flex flex-col items-center justify-center text-center select-none">
          <span className="text-xl font-black text-[#111827]">4.9 / 5.0</span>
          <div className="text-amber-400 text-sm mt-0.5">★★★★★</div>
          <span className="text-[9px] text-[#64748B] font-medium mt-0.5">Based on 350+ customer ratings</span>
        </div>
      );

    case "stock_counter":
      return (
        <div className="h-full w-full p-3 flex flex-col justify-center select-none">
          <div className="flex items-center justify-between text-[10px] font-bold text-amber-700 mb-1">
            <span>🔥 Selling Fast!</span>
            <span>Only 3 left</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-200 overflow-hidden">
            <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-amber-500 to-rose-500" />
          </div>
          <span className="text-[8px] text-slate-500 mt-1">High demand in your region</span>
        </div>
      );

    case "event_countdown":
      return (
        <div className="h-full w-full p-3 flex items-center justify-center select-none">
          <div className="w-full max-w-[210px] p-2.5 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center gap-3">
            <span className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </span>
            <div className="min-w-0">
              <span className="text-[10px] font-bold text-[#111827] block truncate">Product Launch 2026</span>
              <span className="text-[9px] text-[#7137D8] font-bold block">Nov 15 · 3 Days to go</span>
            </div>
          </div>
        </div>
      );

    case "facebook_page":
      return (
        <div className="h-full w-full p-2.5 flex flex-col justify-between select-none">
          <div className="flex items-center gap-2">
            <FacebookIcon className="w-5 h-5 text-[#1877F2]" />
            <div className="text-[10px] font-bold text-[#111827]">Official Brand Page</div>
          </div>
          <div className="text-[9px] text-slate-500">18,500 followers · Community & Updates</div>
          <div className="flex justify-end">
            <span className="px-2.5 py-1 rounded-lg bg-[#1877F2] text-white text-[9px] font-bold shadow-2xs">
              Like Page
            </span>
          </div>
        </div>
      );

    case "youtube_video":
      return (
        <div className="h-full w-full p-2 flex items-center justify-center select-none">
          <div className="w-full max-w-[220px] aspect-video rounded-xl bg-slate-800 relative flex items-center justify-center overflow-hidden shadow-xs">
            <div className="w-9 h-9 rounded-full bg-[#FF0000] text-white flex items-center justify-center shadow-md">
              <YouTubeIcon className="w-5 h-5 fill-white ml-0.5" />
            </div>
            <span className="absolute bottom-1.5 right-2 text-[8px] font-bold text-white bg-black/70 px-1 rounded">
              08:42
            </span>
          </div>
        </div>
      );

    case "newsletter_signup":
      return (
        <div className="h-full w-full p-2.5 flex flex-col justify-center max-w-[220px] mx-auto select-none">
          <div className="text-[11px] font-bold text-[#111827] mb-1.5 text-center">Subscribe to Newsletter</div>
          <div className="flex items-center gap-1">
            <div className="flex-1 bg-white border border-[#E2E8F0] rounded px-2 py-1 text-[9px] text-[#94A3B8]">
              Your email address
            </div>
            <span className="px-2.5 py-1 rounded bg-[#7137D8] text-white text-[9px] font-bold shadow-2xs">
              Join
            </span>
          </div>
        </div>
      );

    case "feedback_survey":
      return (
        <div className="h-full w-full p-3 flex flex-col items-center justify-center select-none">
          <div className="text-[10px] font-bold text-[#111827] mb-2">How was your experience?</div>
          <div className="flex items-center gap-2 text-base">
            <span className="hover:scale-125 transition">😡</span>
            <span className="hover:scale-125 transition">😕</span>
            <span className="hover:scale-125 transition">😐</span>
            <span className="hover:scale-125 transition">🙂</span>
            <span className="scale-125 hover:scale-135 transition">😍</span>
          </div>
        </div>
      );

    case "qr_code":
      return (
        <div className="h-full w-full p-2 flex items-center justify-center select-none">
          <div className="p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-xs flex items-center justify-center">
            <QrCode className="w-16 h-16 text-[#111827]" />
          </div>
        </div>
      );

    case "audio_player":
      return (
        <div className="h-full w-full p-3 flex flex-col justify-center select-none">
          <div className="p-2 rounded-xl bg-white border border-[#E2E8F0] shadow-2xs flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-full bg-[#EC4899] text-white flex items-center justify-center text-[10px]">
              ▶
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-[#111827] block truncate">Morning Meditation</span>
              <div className="w-full h-1 bg-slate-200 rounded-full mt-1">
                <div className="h-full w-1/3 bg-[#EC4899] rounded-full" />
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="h-full w-full p-3 flex items-center justify-center select-none text-slate-400">
          <Sparkles className="w-8 h-8 text-[#7137D8]" />
        </div>
      );
  }
}


function DashboardWidgetsPage() {
  const { tab } = Route.useSearch();
  const navigate = useNavigate();

  const [widgets, setWidgets] = useState<WidgetInstanceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // View state: "catalog" | "active" | "choose_countdown" | "choose_google_reviews"
  const [viewMode, setViewMode] = useState<"catalog" | "active" | "choose_countdown" | "choose_google_reviews">(() => {
    if (tab === "countdown") return "choose_countdown";
    if (tab === "google_reviews") return "choose_google_reviews";
    if (tab === "my_widgets") return "active";
    return "catalog";
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [filterPill, setFilterPill] = useState<"all" | "popular" | "new">("all");
  const [marketplaceSort, setMarketplaceSort] = useState<"popular" | "name_asc" | "name_desc" | "newest">("popular");
  const [previewModalWidget, setPreviewModalWidget] = useState<CatalogWidgetItem | null>(null);
  const [comingSoonModalWidget, setComingSoonModalWidget] = useState<CatalogWidgetItem | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [notifiedWidgetIds, setNotifiedWidgetIds] = useState<string[]>([]);
  const [creatingCountdownKey, setCreatingCountdownKey] = useState<string | null>(null);
  const [creatingGoogle, setCreatingGoogle] = useState(false);
  const [googleWidgetName, setGoogleWidgetName] = useState("My Google Reviews");
  const [embedModalWidget, setEmbedModalWidget] = useState<WidgetInstanceRecord | null>(null);
  const [copied, setCopied] = useState(false);
  const [deletingWidget, setDeletingWidget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Cloud websites / projects owned by current user
  const { projects: rawProjects, loading: projectsLoading } = useCloudProjects();
  const projects = useMemo(() => rawProjects || [], [rawProjects]);

  // Active Widgets view mode & filter states (supports 100+ websites)
  const [activeViewLayout, setActiveViewLayout] = useState<"all" | "grouped">("all");
  const [activeSearch, setActiveSearch] = useState("");
  const [siteFilter, setSiteFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [enabledFilter, setEnabledFilter] = useState<string>("all");
  const [activeSort, setActiveSort] = useState<string>("updated_desc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(10);
  const [collapsedGroupIds, setCollapsedGroupIds] = useState<Record<string, boolean>>({});

  // Website association modal state for legacy / unlinked widgets
  const [linkModalWidget, setLinkModalWidget] = useState<WidgetInstanceRecord | null>(null);
  const [websitePickerSearch, setWebsitePickerSearch] = useState("");
  const [websitePickerSelectedId, setWebsitePickerSelectedId] = useState<string>("");
  const [isLinkingWebsite, setIsLinkingWebsite] = useState(false);

  // Helper: resolve clean domain string for a project
  const getProjectDomain = (p?: any) => {
    if (!p) return "";
    if (p.domain) return String(p.domain).replace(/^https?:\/\//, "").replace(/\/+$/, "");
    if (p.publishedUrl) {
      try {
        return new URL(p.publishedUrl).host;
      } catch {
        return String(p.publishedUrl).replace(/^https?:\/\//, "").replace(/\/+$/, "");
      }
    }
    if (p.publishedSlug) {
      return `${p.publishedSlug}.webtoolocean.com`;
    }
    return "Draft (Not published)";
  };

  // Helper: resolve external URL for a project
  const getProjectUrl = (p?: any) => {
    if (!p) return null;
    if (p.publishedUrl) return p.publishedUrl;
    if (p.domain) return p.domain.startsWith("http") ? p.domain : `https://${p.domain}`;
    if (p.publishedSlug) return `https://${p.publishedSlug}.webtoolocean.com`;
    return null;
  };

  // Helper: safely resolve website info for a widget from owned projects
  const getWidgetWebsiteInfo = (w: WidgetInstanceRecord) => {
    const site = projects.find((p) => p.id === w.projectId);
    if (site) {
      return {
        isLinked: true,
        projectId: site.id,
        name: site.name || "Untitled Website",
        domain: getProjectDomain(site),
        url: getProjectUrl(site),
        isPublished: Boolean(site.status === "published" || (site as any).publishedUrl || (site as any).publishedSlug),
      };
    }
    if (w.projectId || w.websiteName) {
      return {
        isLinked: true,
        projectId: w.projectId || "",
        name: w.websiteName || "Associated Website",
        domain: w.websiteDomain || "Draft (Not published)",
        url: w.websiteDomain && !w.websiteDomain.includes("Draft")
          ? w.websiteDomain.startsWith("http")
            ? w.websiteDomain
            : `https://${w.websiteDomain}`
          : null,
        isPublished: Boolean(w.websiteDomain && !w.websiteDomain.includes("Draft")),
      };
    }
    return {
      isLinked: false,
      projectId: "",
      name: "Website not linked",
      domain: "",
      url: null,
      isPublished: false,
    };
  };

  // Associate or unlink a widget with a user-owned website
  const handleLinkWebsite = async (targetWidgetId: string, projectId: string | null) => {
    setIsLinkingWebsite(true);
    try {
      const selectedProject = projectId ? projects.find((p) => p.id === projectId) : null;
      const websiteData = selectedProject
        ? {
            id: selectedProject.id,
            name: selectedProject.name || "Untitled Website",
            domain: getProjectDomain(selectedProject),
          }
        : null;

      const updated = await linkWidgetToWebsite(targetWidgetId, websiteData);
      setWidgets((prev) => prev.map((w) => (w.id === updated.id ? updated : w)));
      toast.success(
        websiteData
          ? `Linked "${linkModalWidget?.name || "widget"}" to ${websiteData.name}`
          : `Unlinked widget from website`
      );
      setLinkModalWidget(null);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update website link");
    } finally {
      setIsLinkingWebsite(false);
    }
  };

  const toggleGroupCollapse = (groupKey: string) => {
    setCollapsedGroupIds((prev) => ({
      ...prev,
      [groupKey]: !prev[groupKey],
    }));
  };

  const expandAllGroups = (keys: string[]) => {
    const updated: Record<string, boolean> = {};
    keys.forEach((k) => (updated[k] = false));
    setCollapsedGroupIds(updated);
  };

  const collapseAllGroups = (keys: string[]) => {
    const updated: Record<string, boolean> = {};
    keys.forEach((k) => (updated[k] = true));
    setCollapsedGroupIds(updated);
  };

  // Live ticking countdown for card 1
  const [liveSec, setLiveSec] = useState(53);
  const [liveMin, setLiveMin] = useState(47);

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveSec((prev) => {
        if (prev <= 0) {
          setLiveMin((m) => (m > 0 ? m - 1 : 59));
          return 59;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const loadWidgets = async () => {
    setLoading(true);
    try {
      const list = await getAllWidgets();
      setWidgets(list);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load widgets");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWidgets();
    const handleUpdate = () => loadWidgets();
    window.addEventListener("wto-widget-saved", handleUpdate);
    window.addEventListener("wto-widget-deleted", handleUpdate);
    return () => {
      window.removeEventListener("wto-widget-saved", handleUpdate);
      window.removeEventListener("wto-widget-deleted", handleUpdate);
    };
  }, []);

  const filterMatches = (category: string, name: string) => {
    const matchesCat = selectedCategory === "all" || selectedCategory === category;
    const matchesSearch =
      searchQuery.trim() === "" ||
      name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  };

  const handleSelectCountdownTemplate = async (tpl: CountdownTemplateItem) => {
    setCreatingCountdownKey(tpl.key);
    try {
      const newWidget = createNewCountdownWidget(tpl.name, tpl.key);
      await saveWidget(newWidget);
      toast.success(`${tpl.name} created! Opening Countdown Studio…`);
      navigate({
        to: "/dashboard/widgets/countdown/$widgetId",
        params: { widgetId: newWidget.id },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create countdown widget");
      setCreatingCountdownKey(null);
    }
  };

  const handleCreateGoogleReview = async (layoutType: "carousel" | "grid" | "badge" = "carousel") => {
    setCreatingGoogle(true);
    try {
      const newWidget = createNewGoogleReviewsWidget(googleWidgetName.trim() || "My Google Reviews", layoutType);
      await saveWidget(newWidget);
      toast.success("Google Reviews widget created! Opening Studio…");
      navigate({
        to: "/dashboard/widgets/google-reviews/$widgetId",
        params: { widgetId: newWidget.id },
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to create Google Review widget");
      setCreatingGoogle(false);
    }
  };

  const handleCreateFaq = async (templateKey: any = "classic_accordion") => {
    try {
      const newWidget = createNewFaqWidget("FAQ Accordion", templateKey);
      await saveWidget(newWidget);
      toast.success("FAQ Accordion created! Opening Studio…");
      navigate({
        to: "/dashboard/widgets/faq-accordion/$widgetId",
        params: { widgetId: newWidget.id },
      } as any);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create FAQ Accordion");
    }
  };

  const handleCreateAnnouncement = async (displayMode: "bar" | "popup" = "bar") => {
    try {
      const newWidget = createNewAnnouncementPopupWidget(
        displayMode === "bar" ? "Announcement Bar" : "Promo Popup Modal",
        displayMode === "bar" ? "sale_bar" : "coupon_popup",
        displayMode
      );
      await saveWidget(newWidget);
      toast.success(`${displayMode === "bar" ? "Announcement Bar" : "Popup"} created! Opening Studio…`);
      navigate({
        to: "/dashboard/widgets/announcement-popup/$widgetId",
        params: { widgetId: newWidget.id },
      } as any);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create announcement widget");
    }
  };

  const handleCreateWhatsAppChat = async (templateKey: any = "classic_whatsapp") => {
    try {
      const newWidget = createNewWhatsAppChatWidget("WhatsApp Live Chat", templateKey);
      await saveWidget(newWidget);
      toast.success("WhatsApp Live Chat created! Opening Studio…");
      navigate({
        to: "/dashboard/widgets/whatsapp-chat/$widgetId",
        params: { widgetId: newWidget.id },
      } as any);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create WhatsApp widget");
    }
  };

  const handleCreateAccessibility = async (templateKey: any = "modern_floating") => {
    try {
      const newWidget = createNewAccessibilityWidget("Accessibility Widget", templateKey);
      await saveWidget(newWidget);
      toast.success("Accessibility Widget created! Opening Studio…");
      navigate({
        to: "/dashboard/widgets/accessibility/$widgetId",
        params: { widgetId: newWidget.id },
      } as any);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create Accessibility widget");
    }
  };

  const handleCreateLanguageSwitcher = async (templateKey: any = "classic_globe") => {
    try {
      const newWidget = createNewLanguageSwitcherWidget("Website Language Switcher", templateKey);
      await saveWidget(newWidget);
      toast.success("Website Language Switcher created! Opening Studio…");
      navigate({
        to: "/dashboard/widgets/language-switcher/$widgetId",
        params: { widgetId: newWidget.id },
      } as any);
    } catch (err) {
      console.error(err);
      toast.error("Failed to create Language Switcher widget");
    }
  };

  const handleWidgetClick = (itemOrId: CatalogWidgetItem | string) => {
    const item = typeof itemOrId === "string"
      ? CATALOG_WIDGETS.find((w) => w.id === itemOrId)
      : itemOrId;
    if (!item) return;

    if (item.status === "ready") {
      if (item.id === "countdown_timer") {
        setViewMode("choose_countdown");
      } else if (item.id === "google_reviews") {
        setViewMode("choose_google_reviews");
      } else if (item.id === "language_switcher") {
        handleCreateLanguageSwitcher("classic_globe");
      } else if (item.id === "faq_accordion") {
        handleCreateFaq("classic_accordion");
      } else if (item.id === "announcement_bar") {
        handleCreateAnnouncement("bar");
      } else if (item.id === "popup") {
        handleCreateAnnouncement("popup");
      } else if (item.id === "whatsapp_chat") {
        handleCreateWhatsAppChat("classic_whatsapp");
      } else if (item.id === "accessibility") {
        handleCreateAccessibility("modern_floating");
      }
    } else {
      setComingSoonModalWidget(item);
    }
  };

  const handleNotifySubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!comingSoonModalWidget) return;
    setNotifiedWidgetIds((prev) => [...prev, comingSoonModalWidget.id]);
    toast.success(`You're on the priority waitlist! We'll notify you as soon as ${comingSoonModalWidget.title} is ready.`);
    setComingSoonModalWidget(null);
    setNotifyEmail("");
  };

  const filteredMarketplaceWidgets = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    let list = CATALOG_WIDGETS.filter((w) => {
      // 1. Category filter
      if (selectedCategory !== "all") {
        if (selectedCategory === "social") {
          if (!["instagram_feed", "social_icons", "facebook_page", "youtube_video", "whatsapp_chat"].includes(w.id) && w.marketplaceCategory !== "social") {
            return false;
          }
        } else if (selectedCategory === "reviews") {
          if (!["google_reviews", "testimonial_slider", "trust_badges", "rating_stars"].includes(w.id) && w.marketplaceCategory !== "reviews") {
            return false;
          }
        } else if (selectedCategory === "chat") {
          if (!["whatsapp_chat", "live_chat", "contact_form"].includes(w.id) && w.marketplaceCategory !== "chat") {
            return false;
          }
        } else if (selectedCategory === "forms") {
          if (!["contact_form", "newsletter_signup", "feedback_survey", "popup"].includes(w.id) && w.marketplaceCategory !== "forms") {
            return false;
          }
        } else if (selectedCategory === "promotion") {
          if (!["announcement_bar", "popup", "sales_notification", "discount_coupon", "limited_time_offer"].includes(w.id) && w.marketplaceCategory !== "promotion") {
            return false;
          }
        } else if (selectedCategory === "content") {
          if (!["faq_accordion", "audio_player", "language_switcher"].includes(w.id) && w.marketplaceCategory !== "content") {
            return false;
          }
        } else if (selectedCategory === "utility") {
          if (!["countdown_timer", "language_switcher", "accessibility", "stock_counter", "qr_code", "event_countdown"].includes(w.id) && w.marketplaceCategory !== "utility") {
            return false;
          }
        } else if (w.marketplaceCategory !== selectedCategory && w.categoryId !== selectedCategory) {
          return false;
        }
      }

      // 2. Filter pill (all / popular / new)
      if (filterPill === "popular") {
        if (w.badge !== "popular" && !["whatsapp_chat", "announcement_bar", "popup", "testimonial_slider", "google_reviews", "countdown_timer", "instagram_feed", "social_icons", "faq_accordion"].includes(w.id)) {
          return false;
        }
      } else if (filterPill === "new") {
        if (w.badge !== "new" && !["language_switcher", "accessibility", "contact_form", "feedback_survey", "qr_code"].includes(w.id)) {
          return false;
        }
      }

      // 3. Search query
      if (q) {
        const match =
          w.title.toLowerCase().includes(q) ||
          w.description.toLowerCase().includes(q) ||
          w.marketplaceCategory.toLowerCase().includes(q);
        if (!match) return false;
      }

      return true;
    });

    // 4. Sorting
    if (marketplaceSort === "name_asc") {
      list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    } else if (marketplaceSort === "name_desc") {
      list = [...list].sort((a, b) => b.title.localeCompare(a.title));
    } else if (marketplaceSort === "newest") {
      list = [...list].sort((a, b) => (b.badge === "new" ? 1 : 0) - (a.badge === "new" ? 1 : 0));
    }

    return list;
  }, [searchQuery, selectedCategory, filterPill, marketplaceSort]);


  const handleToggleWidgetActive = async (w: WidgetInstanceRecord) => {
    const nextEnabled = w.enabled === false ? true : false;
    try {
      const updated = {
        ...w,
        enabled: nextEnabled,
      };
      await saveWidget(updated);
      setWidgets((prev) =>
        prev.map((item) => (item.id === w.id ? { ...item, enabled: nextEnabled } : item))
      );
      toast.success(
        nextEnabled
          ? `"${w.name}" turned ON — visible across all sites & embeds.`
          : `"${w.name}" turned OFF — hidden from all sites & embeds.`
      );
    } catch (err) {
      console.error(err);
      toast.error("Failed to update widget active state");
    }
  };

  const handleDelete = (id: string, name: string) => {
    setDeletingWidget({ id, name });
  };

  const handleConfirmDelete = async () => {
    if (!deletingWidget) return;
    setIsDeleting(true);
    try {
      await deleteWidget(deletingWidget.id);
      toast.success(`"${deletingWidget.name}" deleted successfully`);
      setDeletingWidget(null);
      await loadWidgets();
    } catch (err) {
      console.error("[Widgets] Failed to delete widget:", err);
      toast.error("Failed to delete widget");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const copy = await duplicateWidget(id);
      if (copy) {
        toast.success("Widget duplicated");
        await loadWidgets();
      }
    } catch (err) {
      toast.error("Failed to duplicate widget");
    }
  };

  const pad = (n: number) => String(n).padStart(2, "0");

  const embedCodeString = useMemo(() => {
    if (!embedModalWidget) return "";
    return `<div data-wto-widget="${embedModalWidget.id}"></div>\n<script src="https://widgets.webtoolocean.com/widget.js" async></script>`;
  }, [embedModalWidget]);

  const copyEmbedCode = () => {
    if (!embedCodeString) return;
    navigator.clipboard.writeText(embedCodeString);
    setCopied(true);
    toast.success("Embed code copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Active widgets filtering with combined multi-criteria search
  const filteredActiveWidgets = useMemo(() => {
    const q = activeSearch.trim().toLowerCase();

    return widgets.filter((w) => {
      const siteInfo = getWidgetWebsiteInfo(w);

      // Search matching: website name, website domain/hostname, widget name, or technical widget instance ID
      if (q) {
        const matchesWidgetName = (w.name || "").toLowerCase().includes(q);
        const matchesWidgetId = (w.id || "").toLowerCase().includes(q);
        const matchesSiteName = siteInfo.name.toLowerCase().includes(q);
        const matchesDomain = siteInfo.domain.toLowerCase().includes(q);
        if (!matchesWidgetName && !matchesWidgetId && !matchesSiteName && !matchesDomain) {
          return false;
        }
      }

      // Filter by website
      if (siteFilter === "unlinked") {
        if (siteInfo.isLinked) return false;
      } else if (siteFilter !== "all") {
        if (w.projectId !== siteFilter) return false;
      }

      // Filter by widget type
      if (typeFilter !== "all" && w.type !== typeFilter) {
        return false;
      }

      // Filter by status (published vs draft)
      if (statusFilter !== "all" && w.status !== statusFilter) {
        return false;
      }

      // Filter by active state (ON vs OFF)
      if (enabledFilter !== "all") {
        const isEnabled = w.enabled !== false;
        if (enabledFilter === "active" && !isEnabled) return false;
        if (enabledFilter === "inactive" && isEnabled) return false;
      }

      return true;
    });
  }, [widgets, projects, activeSearch, siteFilter, typeFilter, statusFilter, enabledFilter]);

  // Active widgets sorting
  const sortedActiveWidgets = useMemo(() => {
    const list = [...filteredActiveWidgets];
    list.sort((a, b) => {
      const siteA = getWidgetWebsiteInfo(a);
      const siteB = getWidgetWebsiteInfo(b);
      const viewsA = a.viewsCount ?? (1200 + ((widgets.indexOf(a) * 840) % 5000));
      const viewsB = b.viewsCount ?? (1200 + ((widgets.indexOf(b) * 840) % 5000));

      switch (activeSort) {
        case "site_asc":
          return siteA.name.localeCompare(siteB.name);
        case "site_desc":
          return siteB.name.localeCompare(siteA.name);
        case "name_asc":
          return (a.name || "").localeCompare(b.name || "");
        case "name_desc":
          return (b.name || "").localeCompare(a.name || "");
        case "views_desc":
          return viewsB - viewsA;
        case "views_asc":
          return viewsA - viewsB;
        case "created_desc":
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        case "updated_desc":
        default:
          return new Date(b.updatedAt || b.createdAt || 0).getTime() - new Date(a.updatedAt || a.createdAt || 0).getTime();
      }
    });
    return list;
  }, [filteredActiveWidgets, projects, widgets, activeSort]);

  // Reset to first page when any search/filter/sort changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeSearch, siteFilter, typeFilter, statusFilter, enabledFilter, activeSort, pageSize]);

  // Pagination calculations
  const totalWidgetsCount = sortedActiveWidgets.length;
  const totalPages = Math.max(1, Math.ceil(totalWidgetsCount / pageSize));
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedWidgets = useMemo(() => {
    const startIndex = (safeCurrentPage - 1) * pageSize;
    return sortedActiveWidgets.slice(startIndex, startIndex + pageSize);
  }, [sortedActiveWidgets, safeCurrentPage, pageSize]);

  // Grouped active widgets by website
  const groupedActiveWebsites = useMemo(() => {
    const groups: Array<{
      key: string;
      id?: string;
      name: string;
      domain: string;
      url: string | null;
      isLinked: boolean;
      items: WidgetInstanceRecord[];
    }> = [];

    const map = new Map<string, typeof groups[0]>();

    sortedActiveWidgets.forEach((w) => {
      const siteInfo = getWidgetWebsiteInfo(w);
      const groupKey = siteInfo.isLinked ? siteInfo.projectId || siteInfo.name : "__unlinked__";

      if (!map.has(groupKey)) {
        const newGroup = {
          key: groupKey,
          id: siteInfo.projectId,
          name: siteInfo.isLinked ? siteInfo.name : "Unlinked Widgets",
          domain: siteInfo.domain,
          url: siteInfo.url,
          isLinked: siteInfo.isLinked,
          items: [],
        };
        map.set(groupKey, newGroup);
        groups.push(newGroup);
      }
      map.get(groupKey)!.items.push(w);
    });

    return groups;
  }, [sortedActiveWidgets, projects]);

  // Count unlinked widgets for badges/filter labels
  const unlinkedWidgetsCount = useMemo(() => {
    return widgets.filter((w) => !getWidgetWebsiteInfo(w).isLinked).length;
  }, [widgets, projects]);

  // Check if any filter is currently applied
  const isAnyFilterActive = Boolean(
    activeSearch.trim() ||
    siteFilter !== "all" ||
    typeFilter !== "all" ||
    statusFilter !== "all" ||
    enabledFilter !== "all" ||
    activeSort !== "updated_desc"
  );

  const resetAllFilters = () => {
    setActiveSearch("");
    setSiteFilter("all");
    setTypeFilter("all");
    setStatusFilter("all");
    setEnabledFilter("all");
    setActiveSort("updated_desc");
    setCurrentPage(1);
  };

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 lg:p-8 space-y-6">
      {/* ================= CASE 1: CHOOSE COUNTDOWN TEMPLATE ================= */}
      {viewMode === "choose_countdown" && (
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between pb-5 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setViewMode("catalog")}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#111827] border border-[#E2E8F0] text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Widgets</span>
              </button>
              <div>
                <h1 className="text-xl font-extrabold text-[#111827]">Choose a Countdown Template</h1>
                <p className="text-xs text-[#64748B]">Select a pre-designed style to launch your countdown widget.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSelectCountdownTemplate(COUNTDOWN_TEMPLATE_LIST[0])}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] text-white font-bold text-xs shadow-xs hover:opacity-95 cursor-pointer"
            >
              <span>Blank Timer +</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COUNTDOWN_TEMPLATE_LIST.map((tpl) => (
              <div
                key={tpl.key}
                className="p-4 rounded-2xl bg-white border border-[#E2E8F0] hover:border-[#7137D8]/40 hover:shadow-md transition flex flex-col justify-between group shadow-2xs"
              >
                <div className="space-y-3">
                  <div className="h-44 rounded-xl overflow-hidden bg-[#F8FAFC] border border-[#E2E8F0] p-2 flex items-center justify-center">
                    <TemplateCardPreview tpl={tpl} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-[#111827] text-base group-hover:text-[#7137D8] transition">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-[#64748B] line-clamp-2 mt-1">{tpl.description}</p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[#7137D8] bg-[#7137D8]/10 px-2.5 py-0.5 rounded-full border border-[#7137D8]/20 capitalize">
                    {(tpl as any).timerMode || tpl.config?.timerMode || "Date"}
                  </span>
                  <button
                    type="button"
                    disabled={creatingCountdownKey === tpl.key}
                    onClick={() => handleSelectCountdownTemplate(tpl)}
                    className="py-1.5 px-3.5 rounded-xl bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] text-white font-bold text-xs shadow-xs hover:opacity-90 transition cursor-pointer"
                  >
                    <span>{creatingCountdownKey === tpl.key ? "Opening…" : "Use Template →"}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= CASE 2: CHOOSE GOOGLE REVIEWS LAYOUT ================= */}
      {viewMode === "choose_google_reviews" && (
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between pb-5 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setViewMode("catalog")}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#475569] hover:text-[#111827] border border-[#E2E8F0] text-xs font-bold transition cursor-pointer shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Widgets</span>
              </button>
              <div>
                <h1 className="text-xl font-extrabold text-[#111827]">Choose Google Reviews Layout</h1>
                <p className="text-xs text-[#64748B]">Display authentic Google reviews on your websites.</p>
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <label className="text-xs font-bold text-[#475569] block mb-1.5">Widget Name</label>
            <input
              type="text"
              value={googleWidgetName}
              onChange={(e) => setGoogleWidgetName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E2E8F0] text-[#111827] text-sm focus:outline-none focus:border-[#7137D8] shadow-2xs"
              placeholder="e.g. Homepage Customer Reviews"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Carousel */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-32 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 flex flex-col justify-center">
                  <div className="text-xs text-amber-500 font-bold">★★★★★ 5.0</div>
                  <p className="text-xs text-[#111827] mt-1 italic">&quot;Best service in town! Super fast delivery.&quot;</p>
                  <small className="text-[11px] text-[#64748B] mt-1">Ananya S. · Verified Google Review</small>
                </div>
                <h3 className="font-extrabold text-[#111827] text-base">Interactive Carousel</h3>
                <p className="text-xs text-[#64748B]">Smooth horizontal slider with auto-play and navigation arrows.</p>
              </div>
              <button
                type="button"
                disabled={creatingGoogle}
                onClick={() => handleCreateGoogleReview("carousel")}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] text-white font-bold text-xs shadow-xs hover:opacity-95 transition cursor-pointer"
              >
                <span>{creatingGoogle ? "Creating…" : "Select Carousel & Open →"}</span>
              </button>
            </div>

            {/* Grid */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-32 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-white border border-[#E2E8F0] text-[10px] text-[#334155]">
                    <span className="text-amber-500">★★★★★</span>
                    <p className="line-clamp-2 mt-0.5">Super support!</p>
                  </div>
                  <div className="p-2 rounded bg-white border border-[#E2E8F0] text-[10px] text-[#334155]">
                    <span className="text-amber-500">★★★★★</span>
                    <p className="line-clamp-2 mt-0.5">Great quality!</p>
                  </div>
                </div>
                <h3 className="font-extrabold text-[#111827] text-base">Multi-Column Grid</h3>
                <p className="text-xs text-[#64748B]">Show multiple reviews simultaneously in a responsive grid layout.</p>
              </div>
              <button
                type="button"
                disabled={creatingGoogle}
                onClick={() => handleCreateGoogleReview("grid")}
                className="w-full py-2 px-3 rounded-xl bg-white border border-[#CBD5E1] text-[#111827] hover:bg-[#F8FAFC] font-bold text-xs hover:border-[#7137D8]/50 transition cursor-pointer"
              >
                <span>{creatingGoogle ? "Creating…" : "Select Grid & Open →"}</span>
              </button>
            </div>

            {/* Floating Badge */}
            <div className="p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xs hover:shadow-md transition flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-32 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] p-3 flex items-center justify-center">
                  <div className="px-3.5 py-2 rounded-xl bg-white border border-[#E2E8F0] text-center shadow-xs">
                    <div className="text-xs font-bold text-[#111827] flex items-center gap-1.5 justify-center">
                      <GoogleIcon />
                      <span>Google Rating</span>
                    </div>
                    <div className="text-amber-500 text-xs font-bold mt-1">★★★★★ 4.9/5</div>
                    <div className="text-[10px] text-[#64748B]">150+ verified reviews</div>
                  </div>
                </div>
                <h3 className="font-extrabold text-[#111827] text-base">Floating Rating Badge</h3>
                <p className="text-xs text-[#64748B]">A compact badge pinned to the corner or embedded inline in headers.</p>
              </div>
              <button
                type="button"
                disabled={creatingGoogle}
                onClick={() => handleCreateGoogleReview("badge")}
                className="w-full py-2 px-3 rounded-xl bg-white border border-[#CBD5E1] text-[#111827] hover:bg-[#F8FAFC] font-bold text-xs hover:border-[#7137D8]/50 transition cursor-pointer"
              >
                <span>{creatingGoogle ? "Creating…" : "Select Badge & Open →"}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN CATALOG & ACTIVE VIEW ================= */}
      {viewMode !== "choose_countdown" && viewMode !== "choose_google_reviews" && (
        <>
          {/* ================= HERO BANNER WITH COMPACT INLINE STATS ================= */}
          <section className="relative rounded-2xl bg-gradient-to-br from-white via-[#FAF5FF] to-[#F5F3FF] border border-[#E2E8F0] p-4.5 sm:p-5 lg:px-6 lg:py-4.5 overflow-hidden flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 shadow-xs">
            {/* Ambient soft pastel glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-[#7137D8]/8 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 right-1/3 w-64 h-64 rounded-full bg-[#3478F6]/8 blur-3xl pointer-events-none" />
            </div>

            {/* Left: Heading & Description */}
            <div className="relative z-10 flex-1 min-w-0 max-w-md xl:max-w-lg">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#7137D8]/10 border border-[#7137D8]/20 text-[#7137D8] text-[11px] font-bold mb-2 shadow-2xs">
                <Zap className="w-3 h-3 text-[#7137D8] fill-[#7137D8]" />
                Dynamic Widgets
              </span>
              <h1 className="text-xl md:text-2xl font-black text-[#111827] tracking-tight leading-tight mb-1">
                Widget Studio &amp;{" "}
                <span className="bg-gradient-to-r from-[#7137D8] via-[#D52BBD] to-[#FF8A35] bg-clip-text text-transparent">
                  Hub
                </span>
              </h1>
              <p className="text-xs text-[#475569] leading-relaxed">
                Choose interactive widgets to boost conversions, build social trust and embed them on any website — in under a minute.
              </p>
            </div>

            {/* Right: 4 Inline Compact Pastel Statistic Cards on Desktop (Wrap on Tablet/Mobile) */}
            <div className="relative z-10 shrink-0 grid grid-cols-2 lg:flex lg:flex-row items-stretch lg:items-center gap-2.5 w-full lg:w-auto">
              {/* Stat 1: Total widgets (Soft Lavender) */}
              <div className="flex flex-col justify-between p-3 rounded-xl bg-[#F6F0FE] border border-[#E9D8FD] shadow-2xs hover:border-[#D6BCFA] hover:shadow-xs transition group w-full lg:w-[130px] xl:w-[138px] h-[86px]">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#EDE0FD] text-[#7137D8] flex items-center justify-center shadow-2xs">
                    <LayoutGrid className="w-3.5 h-3.5 text-[#7137D8]" />
                  </span>
                  <span className="text-xl font-black text-[#111827] group-hover:text-[#7137D8] transition-colors leading-none">
                    {CATALOG_WIDGETS.length}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-[#64748B] mt-1.5 truncate">Total widgets</div>
              </div>

              {/* Stat 2: Ready to use (Soft Mint) */}
              <div className="flex flex-col justify-between p-3 rounded-xl bg-[#EDFDF2] border border-[#C6F6D5] shadow-2xs hover:border-[#9AE6B4] hover:shadow-xs transition group w-full lg:w-[130px] xl:w-[138px] h-[86px]">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#D1FAE5] text-[#16A34A] flex items-center justify-center shadow-2xs">
                    <Check className="w-3.5 h-3.5 text-[#16A34A] stroke-[2.5]" />
                  </span>
                  <span className="text-xl font-black text-[#111827] group-hover:text-[#16A34A] transition-colors leading-none">
                    5
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-[#64748B] mt-1.5 truncate">Ready to use</div>
              </div>

              {/* Stat 3: Active on sites (Soft Blue) */}
              <button
                type="button"
                onClick={() => setViewMode(viewMode === "active" ? "catalog" : "active")}
                className="flex flex-col justify-between p-3 rounded-xl bg-[#EEF6FE] border border-[#CDE5FE] shadow-2xs hover:border-[#BEE3F8] hover:shadow-xs transition group w-full lg:w-[130px] xl:w-[138px] h-[86px] text-left cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#DBEAFE] text-[#2563EB] flex items-center justify-center shadow-2xs">
                    <Activity className="w-3.5 h-3.5 text-[#2563EB]" />
                  </span>
                  <span className="text-xl font-black text-[#111827] group-hover:text-[#2563EB] transition-colors leading-none">
                    {widgets.length || 0}
                  </span>
                </div>
                <div className="text-[11px] font-semibold text-[#64748B] mt-1.5 truncate">
                  {viewMode === "active" ? "← Back to catalog" : "Active on sites"}
                </div>
              </button>

              {/* Stat 4: Views this month (Soft Pink) */}
              <div className="flex flex-col justify-between p-3 rounded-xl bg-[#FDF2F8] border border-[#FBCFE8] shadow-2xs hover:border-[#F687B3] hover:shadow-xs transition group w-full lg:w-[130px] xl:w-[138px] h-[86px]">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-[#FCE7F3] text-[#D52BBD] flex items-center justify-center shadow-2xs">
                    <Eye className="w-3.5 h-3.5 text-[#D52BBD]" />
                  </span>
                  <div className="text-right">
                    <span className="text-lg font-black text-[#111827] group-hover:text-[#D52BBD] transition-colors leading-none block">
                      12.4k
                    </span>
                    <span className="text-[9px] font-bold text-[#16A34A] inline-flex items-center gap-0.5 leading-none mt-0.5">
                      ↑ 18%
                    </span>
                  </div>
                </div>
                <div className="text-[11px] font-semibold text-[#64748B] mt-1.5 truncate">Views this month</div>
              </div>
            </div>
          </section>

          {/* ================= THREE-PART MARKETPLACE LAYOUT ================= */}
          {/* If user switched to active view via Hero stat or button, provide a quick back banner */}
          {viewMode === "active" && (
            <div className="flex items-center justify-between pb-1">
              <button
                type="button"
                onClick={() => setViewMode("catalog")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#7137D8] text-white shadow-sm shadow-[#7137D8]/30 transition hover:bg-[#6025C5] cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>← Back to Widget Studio</span>
              </button>
            </div>
          )}

          {viewMode === "catalog" && (
            <div className="flex flex-col lg:flex-row items-start gap-6 pt-1">
              {/* ================= LEFT: WIDGET CATEGORIES SIDEBAR ================= */}
              <aside className="w-full lg:w-64 shrink-0 space-y-4 lg:sticky lg:top-4 lg:self-start lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto pr-0.5">
                {/* Search widgets input at the top */}
                <div className="relative">
                  <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="search"
                    placeholder="Search widgets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl bg-white border border-[#E2E8F0] focus:border-[#7137D8] focus:ring-2 focus:ring-[#7137D8]/10 text-xs font-medium text-[#111827] placeholder:text-[#94A3B8] shadow-2xs outline-none transition"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#111827] cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Categories container */}
                <div className="bg-white rounded-2xl border border-[#E2E8F0] p-3 shadow-2xs">
                  <div className="px-3 pt-1 pb-2">
                    <span className="text-[11px] font-bold tracking-wider text-[#94A3B8] uppercase">
                      WIDGET CATEGORIES
                    </span>
                  </div>

                  <nav className="space-y-1">
                    {MARKETPLACE_CATEGORIES.map((cat) => {
                      const IconComponent = cat.icon;
                      const isActive = selectedCategory === cat.id;
                      return (
                        <button
                          key={cat.id}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(cat.id);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                            isActive
                              ? "bg-[#F6F0FE] text-[#7137D8]"
                              : "text-[#475569] hover:bg-[#F8FAFC] hover:text-[#111827]"
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <IconComponent
                              className={`w-4 h-4 ${
                                isActive ? "text-[#7137D8]" : "text-[#64748B]"
                              }`}
                            />
                            <span>{cat.label}</span>
                          </div>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                              isActive
                                ? "bg-[#7137D8] text-white"
                                : "bg-[#F1F5F9] text-[#64748B]"
                            }`}
                          >
                            {cat.count}
                          </span>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </aside>

              {/* ================= RIGHT: MAIN WIDGET MARKETPLACE ================= */}
              <div className="flex-1 w-full min-w-0 space-y-5">
                {/* Top Filter Bar: All / Popular / New pills on left, Sort dropdown on right */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  {/* Filter Pills */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFilterPill("all")}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                        filterPill === "all"
                          ? "bg-[#7137D8] text-white shadow-sm shadow-[#7137D8]/20"
                          : "bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#111827] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      All
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterPill("popular")}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                        filterPill === "popular"
                          ? "bg-[#7137D8] text-white shadow-sm shadow-[#7137D8]/20"
                          : "bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#111827] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      Popular
                    </button>
                    <button
                      type="button"
                      onClick={() => setFilterPill("new")}
                      className={`px-4 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                        filterPill === "new"
                          ? "bg-[#7137D8] text-white shadow-sm shadow-[#7137D8]/20"
                          : "bg-white border border-[#E2E8F0] text-[#475569] hover:text-[#111827] hover:bg-[#F8FAFC]"
                      }`}
                    >
                      New
                    </button>
                  </div>

                  {/* Sort dropdown */}
                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <span className="text-xs text-[#64748B] font-medium">Sort:</span>
                    <select
                      value={marketplaceSort}
                      onChange={(e) => setMarketplaceSort(e.target.value as any)}
                      aria-label="Sort widgets"
                      className="bg-white border border-[#E2E8F0] text-[#111827] text-xs font-semibold rounded-xl px-3 py-1.5 outline-none focus:border-[#7137D8] shadow-2xs cursor-pointer"
                    >
                      <option value="popular">Most Popular</option>
                      <option value="name_asc">Name (A → Z)</option>
                      <option value="name_desc">Name (Z → A)</option>
                      <option value="newest">Newest</option>
                    </select>
                  </div>
                </div>

                {/* Grid of Widget Cards */}
                {filteredMarketplaceWidgets.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-[#E2E8F0] p-12 text-center shadow-2xs">
                    <div className="w-12 h-12 rounded-2xl bg-[#F6F0FE] text-[#7137D8] flex items-center justify-center mx-auto mb-3">
                      <Search className="w-6 h-6" />
                    </div>
                    <h3 className="text-sm font-bold text-[#111827] mb-1">No widgets found</h3>
                    <p className="text-xs text-[#64748B] max-w-sm mx-auto mb-4">
                      We couldn't find any widgets matching "{searchQuery}". Try searching for something else or reset your filters.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setFilterPill("all");
                      }}
                      className="px-4 py-2 rounded-xl bg-[#7137D8] hover:bg-[#6025C5] text-white text-xs font-bold transition cursor-pointer"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filteredMarketplaceWidgets.map((item) => {
                      return (
                        <article
                          key={item.id}
                          className="bg-white rounded-2xl border border-[#E2E8F0] hover:border-[#CBD5E1] p-4 flex flex-col justify-between shadow-2xs hover:shadow-md transition-all duration-200 group"
                        >
                          <div>
                            {/* A. Miniature Preview Area */}
                            <div className="mb-4">
                              <WidgetMiniaturePreview widgetId={item.id} />
                            </div>

                            {/* B. Widget Information */}
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2.5">
                                <div
                                  className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${item.iconBgClass || "bg-[#7137D8] text-white"}`}
                                >
                                  {renderItemIcon(item.iconType)}
                                </div>
                                <h3 className="text-sm font-bold text-[#111827] truncate">
                                  {item.title}
                                </h3>
                                {item.badge && (
                                  <span
                                    className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                                      item.badge.toLowerCase() === "popular"
                                        ? "bg-[#FFE4E6] text-[#E11D48]"
                                        : "bg-[#F3E8FF] text-[#7137D8]"
                                    }`}
                                  >
                                    {item.badge.toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-[#64748B] line-clamp-2 leading-relaxed">
                                {item.description}
                              </p>
                            </div>
                          </div>

                          {/* C. Bottom Actions */}
                          <div className="flex items-center justify-between pt-4 mt-3 border-t border-[#F1F5F9] gap-2">
                            {/* Available designs count */}
                            <div className="flex items-center gap-1.5 text-xs text-[#64748B] font-medium shrink-0">
                              <Layers className="w-3.5 h-3.5 text-[#94A3B8]" />
                              <span>{item.designsCount || "3+ Designs"}</span>
                            </div>

                            <div className="flex items-center gap-1.5 shrink-0">
                              {/* + Add widget button */}
                              <button
                                type="button"
                                onClick={() => handleWidgetClick(item)}
                                className="px-3 py-1.5 rounded-lg bg-[#F8FAFC] hover:bg-[#7137D8] text-[#111827] hover:text-white border border-[#E2E8F0] hover:border-[#7137D8] text-xs font-semibold transition cursor-pointer flex items-center gap-1"
                              >
                                <Plus className="w-3 h-3" />
                                <span>Add widget</span>
                              </button>

                              {/* Eye icon preview button */}
                              <button
                                type="button"
                                title="Quick Preview"
                                onClick={() => setPreviewModalWidget(item)}
                                className="w-8 h-8 rounded-full border border-[#E2E8F0] hover:border-[#7137D8] hover:text-[#7137D8] flex items-center justify-center text-[#64748B] hover:bg-[#F6F0FE] transition cursor-pointer"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}


          {/* ================= ACTIVE VIEW ================= */}
          {viewMode === "active" && (
            <section className="space-y-5">
              {/* Main Card */}
              <div className="rounded-2xl bg-white border border-[#E2E8F0] overflow-hidden shadow-2xs">
                {/* Header with Title & View Mode Selector */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 border-b border-[#E2E8F0]">
                  <div>
                    <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
                      <span>My active widgets</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]">
                        {widgets.length} total
                      </span>
                    </h2>
                    <p className="text-xs text-[#64748B] mt-0.5">
                      Manage and track widget instances across all your connected websites.
                    </p>
                  </div>

                  <div className="flex items-center gap-2.5 flex-wrap">
                    {/* View Layout Toggle: All Widgets (Table) vs Group by Website */}
                    <div className="inline-flex items-center p-1 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <button
                        type="button"
                        onClick={() => setActiveViewLayout("all")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          activeViewLayout === "all"
                            ? "bg-[#7137D8] text-white shadow-xs"
                            : "text-[#64748B] hover:text-[#111827]"
                        }`}
                        title="View all widgets in a single unified table"
                      >
                        <Table className="w-3.5 h-3.5" />
                        <span>All Widgets</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setActiveViewLayout("grouped")}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                          activeViewLayout === "grouped"
                            ? "bg-[#7137D8] text-white shadow-xs"
                            : "text-[#64748B] hover:text-[#111827]"
                        }`}
                        title="Group widgets under collapsible website headings"
                      >
                        <FolderTree className="w-3.5 h-3.5" />
                        <span>Group by Website</span>
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setViewMode("catalog")}
                      className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] hover:from-[#6025C5] hover:to-[#7C3AED] text-white font-bold text-xs shadow-xs transition cursor-pointer flex items-center gap-1.5"
                    >
                      <span>+ Add widget</span>
                    </button>
                  </div>
                </div>

                {/* Multi-Criteria Search & Filter Toolbar */}
                <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-[#F8FAFC] space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2.5">
                    {/* 1. Search by Website, Domain, Widget Name, or Instance ID */}
                    <div className="relative lg:col-span-2">
                      <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                      <input
                        type="text"
                        value={activeSearch}
                        onChange={(e) => setActiveSearch(e.target.value)}
                        placeholder="Search website, domain, widget or ID…"
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-8 py-2 text-xs text-[#111827] placeholder-[#94A3B8] focus:outline-none focus:border-[#7137D8] transition"
                      />
                      {activeSearch && (
                        <button
                          type="button"
                          onClick={() => setActiveSearch("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#94A3B8] hover:text-[#111827] p-0.5 rounded cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* 2. Filter by Website */}
                    <div className="relative">
                      <select
                        value={siteFilter}
                        onChange={(e) => setSiteFilter(e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#7137D8] transition appearance-none cursor-pointer truncate pr-7"
                      >
                        <option value="all">All Websites ({projects.length})</option>
                        {unlinkedWidgetsCount > 0 && (
                          <option value="unlinked">⚠️ Unlinked ({unlinkedWidgetsCount})</option>
                        )}
                        {projects.map((p) => (
                          <option key={p.id} value={p.id}>
                            🌐 {p.name || "Untitled"} ({getProjectDomain(p)})
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* 3. Filter by Widget Type */}
                    <div className="relative">
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#7137D8] transition appearance-none cursor-pointer truncate pr-7"
                      >
                        <option value="all">All Types</option>
                        <option value="google_reviews">Google Reviews</option>
                        <option value="countdown">Countdown Timer</option>
                        <option value="announcement_popup">Announcement & Popup</option>
                        <option value="faq_accordion">FAQ Accordion</option>
                        <option value="whatsapp_chat">WhatsApp Live Chat</option>
                        <option value="accessibility">Accessibility Toolbar</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* 4. Filter by Status (Live / Draft) */}
                    <div className="relative">
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#7137D8] transition appearance-none cursor-pointer truncate pr-7"
                      >
                        <option value="all">All Statuses</option>
                        <option value="published">Live Only</option>
                        <option value="draft">Draft Only</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>

                    {/* 5. Filter by Active State & Sort */}
                    <div className="relative">
                      <select
                        value={enabledFilter}
                        onChange={(e) => setEnabledFilter(e.target.value)}
                        className="w-full bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#111827] focus:outline-none focus:border-[#7137D8] transition appearance-none cursor-pointer truncate pr-7"
                      >
                        <option value="all">All States</option>
                        <option value="active">Active (ON)</option>
                        <option value="inactive">Inactive (OFF)</option>
                      </select>
                      <ChevronDown className="w-3.5 h-3.5 text-[#94A3B8] absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </div>

                  {/* Secondary Toolbar: Sorting & Active Filter Reset */}
                  <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[#64748B] font-medium flex items-center gap-1">
                        <ArrowUpDown className="w-3 h-3" />
                        <span>Sort:</span>
                      </span>
                      <select
                        value={activeSort}
                        onChange={(e) => setActiveSort(e.target.value)}
                        className="bg-white border border-[#E2E8F0] rounded-lg px-2.5 py-1 text-xs text-[#111827] focus:outline-none focus:border-[#7137D8] cursor-pointer"
                      >
                        <option value="updated_desc">Recently Updated</option>
                        <option value="created_desc">Recently Created</option>
                        <option value="site_asc">Website Name (A → Z)</option>
                        <option value="site_desc">Website Name (Z → A)</option>
                        <option value="name_asc">Widget Name (A → Z)</option>
                        <option value="name_desc">Widget Name (Z → A)</option>
                        <option value="views_desc">Views (High → Low)</option>
                        <option value="views_asc">Views (Low → High)</option>
                      </select>

                      {isAnyFilterActive && (
                        <button
                          type="button"
                          onClick={resetAllFilters}
                          className="px-2.5 py-1 rounded-lg bg-[#F6F0FE] hover:bg-[#EDE0FD] text-[#7137D8] text-xs font-semibold border border-[#EDE0FD] flex items-center gap-1 transition cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                          <span>Clear filters</span>
                        </button>
                      )}
                    </div>

                    <div className="text-[11px] text-[#64748B]">
                      Showing <strong className="text-[#111827]">{filteredActiveWidgets.length}</strong> of{" "}
                      <strong className="text-[#111827]">{widgets.length}</strong> widgets
                    </div>
                  </div>
                </div>

                {/* Content States */}
                {loading ? (
                  <div className="py-16 text-center text-[#64748B]">
                    <div className="w-8 h-8 border-2 border-[#7137D8] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Loading your widgets…
                  </div>
                ) : widgets.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F6F0FE] border border-[#EDE0FD] text-[#7137D8] flex items-center justify-center mx-auto mb-2">
                      <Boxes className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-[#111827]">No active widgets yet</h3>
                    <p className="text-xs text-[#64748B] max-w-md mx-auto">
                      You haven&apos;t created any widgets yet. Choose a widget from the catalog to boost your website&apos;s conversions.
                    </p>
                    <button
                      type="button"
                      onClick={() => setViewMode("catalog")}
                      className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] hover:from-[#6025C5] hover:to-[#7C3AED] text-white font-bold text-xs inline-flex cursor-pointer shadow-sm mt-2"
                    >
                      Browse Widget Catalog →
                    </button>
                  </div>
                ) : filteredActiveWidgets.length === 0 ? (
                  <div className="p-12 text-center space-y-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] flex items-center justify-center mx-auto mb-2">
                      <Filter className="w-5 h-5" />
                    </div>
                    <h3 className="text-base font-bold text-[#111827]">No widgets match your filters</h3>
                    <p className="text-xs text-[#64748B] max-w-sm mx-auto">
                      No widget instances matched your current search query or filter combination.
                    </p>
                    <button
                      type="button"
                      onClick={resetAllFilters}
                      className="py-2 px-4 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#111827] font-bold text-xs inline-flex cursor-pointer transition border border-[#E2E8F0] mt-1 shadow-2xs"
                    >
                      Reset All Filters
                    </button>
                  </div>
                ) : activeViewLayout === "all" ? (
                  /* ================= 1. ALL WIDGETS UNIFIED TABLE VIEW ================= */
                  <div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-[#E2E8F0] text-[11px] font-bold uppercase tracking-wider text-[#64748B] bg-[#F8FAFC]">
                            <th className="py-3 px-5">Widget</th>
                            <th className="py-3 px-5">Website</th>
                            <th className="py-3 px-5">Views</th>
                            <th className="py-3 px-5">Status</th>
                            <th className="py-3 px-5">Active</th>
                            <th className="py-3 px-5 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E2E8F0]">
                          {paginatedWidgets.map((w, idx) => {
                            const isCountdown = w.type === "countdown";
                            const isAnnouncement = w.type === "announcement_popup";
                            const isFaq = w.type === "faq_accordion";
                            const isWhatsApp = w.type === "whatsapp_chat";
                            const isAccessibility = w.type === "accessibility";
                            const isPublished = w.status === "published";
                            const isEnabled = w.enabled !== false;
                            const viewsCount = w.viewsCount ?? (1200 + ((widgets.indexOf(w) * 840) % 5000));
                            const siteInfo = getWidgetWebsiteInfo(w);
                            const isLanguageSwitcher = w.type === "language_switcher";
                            const studioRoute = isCountdown
                              ? `/dashboard/widgets/countdown/${w.id}`
                              : isAnnouncement
                              ? `/dashboard/widgets/announcement-popup/${w.id}`
                              : isFaq
                              ? `/dashboard/widgets/faq-accordion/${w.id}`
                              : isWhatsApp
                              ? `/dashboard/widgets/whatsapp-chat/${w.id}`
                              : isAccessibility
                              ? `/dashboard/widgets/accessibility/${w.id}`
                              : isLanguageSwitcher
                              ? `/dashboard/widgets/language-switcher/${w.id}`
                              : `/dashboard/widgets/google-reviews/${w.id}`;

                            return (
                              <tr key={w.id} className="hover:bg-[#F8FAFC] transition">
                                {/* 1. Widget Name & Details */}
                                <td className="py-3.5 px-5">
                                  {(() => {
                                    const meta = getWidgetDisplayMeta(w.type, false, w.config);
                                    return (
                                      <div className="flex items-center gap-3">
                                        <div className={`w-8 h-8 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs ${meta.containerClass}`}>
                                          {meta.icon}
                                        </div>
                                        <div>
                                          <strong className="block text-sm font-bold text-[#111827] leading-tight">
                                            {w.name}
                                          </strong>
                                          <small className="block text-[11px] text-[#64748B] leading-tight mt-0.5 font-medium">
                                            {meta.label}
                                          </small>
                                        </div>
                                      </div>
                                    );
                                  })()}
                                </td>

                                {/* 2. Proper Website Column */}
                                <td className="py-3.5 px-5">
                                  {siteInfo.isLinked ? (
                                    <div className="space-y-0.5">
                                      <strong className="block text-xs font-bold text-[#111827] leading-tight truncate max-w-[220px]">
                                        {siteInfo.name}
                                      </strong>
                                      <div className="flex items-center gap-1.5 text-[11px] text-[#64748B]">
                                        <span className="truncate max-w-[170px]">{siteInfo.domain}</span>
                                        {siteInfo.url && (
                                          <a
                                            href={siteInfo.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            title={`Open ${siteInfo.name} in new tab`}
                                            className="p-0.5 text-[#64748B] hover:text-[#7137D8] transition"
                                          >
                                            <ExternalLink className="w-3 h-3" />
                                          </a>
                                        )}
                                        <button
                                          type="button"
                                          onClick={() => {
                                            setLinkModalWidget(w);
                                            setWebsitePickerSelectedId(w.projectId || "");
                                            setWebsitePickerSearch("");
                                          }}
                                          className="text-[10px] text-[#7137D8] hover:underline ml-1 cursor-pointer transition font-medium"
                                          title="Change website link"
                                        >
                                          Change
                                        </button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div>
                                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                                        <AlertCircle className="w-3 h-3 shrink-0" />
                                        <span>Website not linked</span>
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setLinkModalWidget(w);
                                          setWebsitePickerSelectedId("");
                                          setWebsitePickerSearch("");
                                        }}
                                        className="block mt-1 text-[11px] font-semibold text-[#7137D8] hover:underline cursor-pointer"
                                      >
                                        + Link website
                                      </button>
                                    </div>
                                  )}
                                </td>

                                {/* 3. Views Count */}
                                <td className="py-3.5 px-5 font-bold text-[#111827]">
                                  {viewsCount.toLocaleString()}
                                </td>

                                {/* 4. Status Badge */}
                                <td className="py-3.5 px-5">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                      isPublished
                                        ? "bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]"
                                        : "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        isPublished ? "bg-[#16A34A]" : "bg-[#94A3B8]"
                                      }`}
                                    />
                                    {isPublished ? "Live" : "Draft"}
                                  </span>
                                </td>

                                {/* 5. Turn ON/OFF Switch */}
                                <td className="py-3.5 px-5">
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      role="switch"
                                      aria-checked={isEnabled}
                                      onClick={() => handleToggleWidgetActive(w)}
                                      className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                        isEnabled ? "bg-[#16A34A]" : "bg-slate-300"
                                      }`}
                                      title={
                                        isEnabled
                                          ? "Turn Off (Hides this widget everywhere)"
                                          : "Turn On (Enables this widget everywhere)"
                                      }
                                    >
                                      <span
                                        className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                          isEnabled ? "translate-x-5" : "translate-x-0"
                                        }`}
                                      />
                                    </button>
                                    <span
                                      className={`text-[11px] font-extrabold ${
                                        isEnabled ? "text-[#16A34A]" : "text-[#94A3B8]"
                                      }`}
                                    >
                                      {isEnabled ? "ON" : "OFF"}
                                    </span>
                                  </div>
                                </td>

                                {/* 6. Actions */}
                                <td className="py-3.5 px-5 text-right">
                                  <div className="inline-flex items-center gap-1.5 justify-end">
                                    <button
                                      type="button"
                                      onClick={() => setEmbedModalWidget(w)}
                                      className="px-2.5 py-1.5 rounded-lg bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#111827] font-bold text-xs transition cursor-pointer flex items-center gap-1.5 shadow-2xs"
                                      title="Get Embed Code"
                                    >
                                      <Code2 className="w-3.5 h-3.5 text-[#7137D8]" />
                                      <span>Embed</span>
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => navigate({ to: studioRoute as any })}
                                      className="p-1.5 rounded-lg bg-[#7137D8] hover:bg-[#6025C5] text-white transition cursor-pointer shadow-2xs"
                                      title="Edit in Studio"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDuplicate(w.id)}
                                      className="p-1.5 rounded-lg bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#111827] transition cursor-pointer shadow-2xs"
                                      title="Duplicate"
                                    >
                                      <Copy className="w-3.5 h-3.5" />
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => handleDelete(w.id, w.name)}
                                      className="p-1.5 rounded-lg bg-white hover:bg-rose-50 border border-[#E2E8F0] text-[#64748B] hover:text-rose-600 transition cursor-pointer shadow-2xs"
                                      title="Delete"
                                    >
                                      <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Bar */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-t border-[#E2E8F0] bg-[#F8FAFC] text-xs">
                      <div className="text-[#64748B]">
                        Showing{" "}
                        <strong className="text-[#111827]">
                          {totalWidgetsCount === 0 ? 0 : (safeCurrentPage - 1) * pageSize + 1}
                        </strong>{" "}
                        to{" "}
                        <strong className="text-[#111827]">
                          {Math.min(safeCurrentPage * pageSize, totalWidgetsCount)}
                        </strong>{" "}
                        of <strong className="text-[#111827]">{totalWidgetsCount}</strong> widgets
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Page Size Selector */}
                        <div className="flex items-center gap-1.5 mr-2 text-[#64748B]">
                          <span>Per page:</span>
                          <select
                            value={pageSize}
                            onChange={(e) => setPageSize(Number(e.target.value))}
                            className="bg-white border border-[#E2E8F0] rounded-lg px-2 py-1 text-[#111827] focus:outline-none focus:border-[#7137D8] cursor-pointer"
                          >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                          </select>
                        </div>

                        {/* Page Buttons */}
                        <button
                          type="button"
                          disabled={safeCurrentPage <= 1}
                          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#111827] font-bold disabled:opacity-40 hover:bg-[#F8FAFC] transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                        >
                          <ChevronLeft className="w-3.5 h-3.5" />
                        </button>

                        <div className="text-[#64748B] font-semibold px-2">
                          Page <strong className="text-[#111827]">{safeCurrentPage}</strong> of{" "}
                          <strong className="text-[#111827]">{totalPages}</strong>
                        </div>

                        <button
                          type="button"
                          disabled={safeCurrentPage >= totalPages}
                          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                          className="px-2.5 py-1.5 rounded-lg bg-white border border-[#E2E8F0] text-[#111827] font-bold disabled:opacity-40 hover:bg-[#F8FAFC] transition cursor-pointer disabled:cursor-not-allowed shadow-2xs"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  /* ================= 2. GROUP BY WEBSITE COLLAPSIBLE VIEW ================= */
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Top Group Summary Bar */}
                    <div className="flex items-center justify-between text-xs text-[#64748B] pb-1 border-b border-[#E2E8F0]">
                      <div>
                        Grouped into <strong className="text-[#111827]">{groupedActiveWebsites.length}</strong> website{" "}
                        {groupedActiveWebsites.length === 1 ? "group" : "groups"}
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => expandAllGroups(groupedActiveWebsites.map((g) => g.key))}
                          className="text-[11px] font-semibold text-[#7137D8] hover:underline cursor-pointer"
                        >
                          Expand all
                        </button>
                        <span>•</span>
                        <button
                          type="button"
                          onClick={() => collapseAllGroups(groupedActiveWebsites.map((g) => g.key))}
                          className="text-[11px] font-semibold text-[#64748B] hover:text-[#111827] cursor-pointer"
                        >
                          Collapse all
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Website Cards */}
                    {groupedActiveWebsites.map((group) => {
                      const isCollapsed = Boolean(collapsedGroupIds[group.key]);

                      return (
                        <div
                          key={group.key}
                          className="rounded-xl bg-white border border-[#E2E8F0] overflow-hidden shadow-2xs transition"
                        >
                          {/* Accordion Header */}
                          <div
                            onClick={() => toggleGroupCollapse(group.key)}
                            className="flex items-center justify-between gap-3 p-4 bg-[#F8FAFC] hover:bg-[#F1F5F9] cursor-pointer transition select-none"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="p-1 rounded-lg bg-white border border-[#E2E8F0] text-[#64748B]">
                                {isCollapsed ? (
                                  <ChevronRight className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </span>

                              <div
                                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                  group.isLinked
                                    ? "bg-[#F6F0FE] text-[#7137D8] border border-[#EDE0FD]"
                                    : "bg-amber-50 text-amber-600 border border-amber-200"
                                }`}
                              >
                                {group.isLinked ? (
                                  <Globe className="w-4 h-4" />
                                ) : (
                                  <AlertCircle className="w-4 h-4" />
                                )}
                              </div>

                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <h3 className="font-bold text-[#111827] text-sm truncate">
                                    {group.name}
                                  </h3>
                                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-[#64748B] border border-[#E2E8F0]">
                                    {group.items.length} {group.items.length === 1 ? "widget" : "widgets"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[11px] text-[#64748B] mt-0.5">
                                  <span className="truncate">{group.domain || "No domain set"}</span>
                                  {group.url && (
                                    <a
                                      href={group.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      onClick={(e) => e.stopPropagation()}
                                      title={`Open ${group.name}`}
                                      className="p-0.5 text-[#64748B] hover:text-[#7137D8] transition"
                                    >
                                      <ExternalLink className="w-3 h-3" />
                                    </a>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setViewMode("catalog");
                                }}
                                className="hidden sm:inline-flex items-center gap-1 py-1.5 px-3 rounded-lg bg-white hover:bg-[#F8FAFC] text-[#111827] font-bold text-xs border border-[#E2E8F0] shadow-2xs transition cursor-pointer"
                              >
                                <span>+ Add widget</span>
                              </button>
                            </div>
                          </div>

                          {/* Accordion Table Body */}
                          {!isCollapsed && (
                            <div className="border-t border-[#E2E8F0] overflow-x-auto">
                              <table className="w-full text-left border-collapse text-xs">
                                <thead>
                                  <tr className="border-b border-[#E2E8F0] text-[10px] font-bold uppercase tracking-wider text-[#64748B] bg-[#F8FAFC]">
                                    <th className="py-2.5 px-4">Widget</th>
                                    <th className="py-2.5 px-4">Views</th>
                                    <th className="py-2.5 px-4">Status</th>
                                    <th className="py-2.5 px-4">Active</th>
                                    <th className="py-2.5 px-4 text-right">Actions</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-[#E2E8F0]">
                                  {group.items.map((w) => {
                                    const isCountdown = w.type === "countdown";
                                    const isAnnouncement = w.type === "announcement_popup";
                                    const isFaq = w.type === "faq_accordion";
                                    const isWhatsApp = w.type === "whatsapp_chat";
                                    const isAccessibility = w.type === "accessibility";
                                    const isPublished = w.status === "published";
                                    const isEnabled = w.enabled !== false;
                                    const viewsCount = w.viewsCount ?? (1200 + ((widgets.indexOf(w) * 840) % 5000));
                                    const isLanguageSwitcher = w.type === "language_switcher";
                                    const studioRoute = isCountdown
                                      ? `/dashboard/widgets/countdown/${w.id}`
                                      : isAnnouncement
                                      ? `/dashboard/widgets/announcement-popup/${w.id}`
                                      : isFaq
                                      ? `/dashboard/widgets/faq-accordion/${w.id}`
                                      : isWhatsApp
                                      ? `/dashboard/widgets/whatsapp-chat/${w.id}`
                                      : isAccessibility
                                      ? `/dashboard/widgets/accessibility/${w.id}`
                                      : isLanguageSwitcher
                                      ? `/dashboard/widgets/language-switcher/${w.id}`
                                      : `/dashboard/widgets/google-reviews/${w.id}`;

                                    return (
                                      <tr key={w.id} className="hover:bg-[#F8FAFC] transition">
                                        {/* Widget */}
                                        <td className="py-3 px-4">
                                          {(() => {
                                            const meta = getWidgetDisplayMeta(w.type, true, w.config);
                                            return (
                                              <div className="flex items-center gap-3">
                                                <div className={`w-7 h-7 rounded-lg border flex items-center justify-center shrink-0 shadow-2xs ${meta.containerClass}`}>
                                                  {meta.icon}
                                                </div>
                                                <div>
                                                  <strong className="block text-xs font-bold text-[#111827] leading-tight">
                                                    {w.name}
                                                  </strong>
                                                  <small className="block text-[10px] text-[#64748B] leading-tight mt-0.5 font-medium">
                                                    {meta.label}
                                                  </small>
                                                </div>
                                              </div>
                                            );
                                          })()}
                                        </td>

                                        {/* Views */}
                                        <td className="py-3 px-4 font-bold text-[#111827]">
                                          {viewsCount.toLocaleString()}
                                        </td>

                                        {/* Status */}
                                        <td className="py-3 px-4">
                                          <span
                                            className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                              isPublished
                                                ? "bg-[#DCFCE7] text-[#16A34A] border border-[#BBF7D0]"
                                                : "bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0]"
                                            }`}
                                          >
                                            <span
                                              className={`w-1.5 h-1.5 rounded-full ${
                                                isPublished ? "bg-[#16A34A]" : "bg-[#94A3B8]"
                                              }`}
                                            />
                                            {isPublished ? "Live" : "Draft"}
                                          </span>
                                        </td>

                                        {/* Active Toggle */}
                                        <td className="py-3 px-4">
                                          <div className="flex items-center gap-1.5">
                                            <button
                                              type="button"
                                              role="switch"
                                              aria-checked={isEnabled}
                                              onClick={() => handleToggleWidgetActive(w)}
                                              className={`relative inline-flex h-4 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                isEnabled ? "bg-[#16A34A]" : "bg-slate-300"
                                              }`}
                                            >
                                              <span
                                                className={`pointer-events-none inline-block h-3 w-3 transform rounded-full bg-white shadow-md ring-0 transition duration-200 ease-in-out ${
                                                  isEnabled ? "translate-x-4" : "translate-x-0"
                                                }`}
                                              />
                                            </button>
                                            <span
                                              className={`text-[10px] font-extrabold ${
                                                isEnabled ? "text-[#16A34A]" : "text-[#94A3B8]"
                                              }`}
                                            >
                                              {isEnabled ? "ON" : "OFF"}
                                            </span>
                                          </div>
                                        </td>

                                        {/* Actions */}
                                        <td className="py-3 px-4 text-right">
                                          <div className="inline-flex items-center gap-1.5 justify-end">
                                            <button
                                              type="button"
                                              onClick={() => {
                                                setLinkModalWidget(w);
                                                setWebsitePickerSelectedId(w.projectId || "");
                                                setWebsitePickerSearch("");
                                              }}
                                              className="p-1 rounded-lg bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#7137D8] transition cursor-pointer shadow-2xs"
                                              title={group.isLinked ? "Change linked website" : "Link to website"}
                                            >
                                              <Link2 className="w-3.5 h-3.5" />
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => setEmbedModalWidget(w)}
                                              className="px-2 py-1 rounded-lg bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#111827] font-bold text-[11px] transition cursor-pointer flex items-center gap-1 shadow-2xs"
                                              title="Embed snippet"
                                            >
                                              <Code2 className="w-3 h-3 text-[#7137D8]" />
                                              <span>Embed</span>
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => navigate({ to: studioRoute as any })}
                                              className="p-1 rounded-lg bg-[#7137D8] hover:bg-[#6025C5] text-white transition cursor-pointer shadow-2xs"
                                              title="Edit in Studio"
                                            >
                                              <Edit3 className="w-3.5 h-3.5" />
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => handleDuplicate(w.id)}
                                              className="p-1 rounded-lg bg-white hover:bg-[#F8FAFC] border border-[#E2E8F0] text-[#64748B] hover:text-[#111827] transition cursor-pointer shadow-2xs"
                                              title="Duplicate"
                                            >
                                              <Copy className="w-3.5 h-3.5" />
                                            </button>

                                            <button
                                              type="button"
                                              onClick={() => handleDelete(w.id, w.name)}
                                              className="p-1 rounded-lg bg-white hover:bg-rose-50 border border-[#E2E8F0] text-[#64748B] hover:text-rose-600 transition cursor-pointer shadow-2xs"
                                              title="Delete"
                                            >
                                              <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                          </div>
                                        </td>
                                      </tr>
                                    );
                                  })}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          )}
        </>
      )}

      {/* ================= EMBED CODE MODAL ================= */}
      {embedModalWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-white border border-[#E2E8F0] shadow-2xl overflow-hidden">

            {/* Glow accent bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7137D8] via-[#D52BBD] to-[#3478F6]" />

            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-[#E2E8F0]">
              <button
                type="button"
                className="absolute top-5 right-5 p-2 rounded-xl text-[#64748B] hover:text-[#111827] hover:bg-[#F1F5F9] transition cursor-pointer"
                onClick={() => setEmbedModalWidget(null)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-[#F6F0FE] border border-[#EDE0FD] flex items-center justify-center text-[#7137D8] shadow-sm">
                  <Code2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-[#111827] tracking-tight">Embed your widget</h3>
                  <p className="text-sm text-[#64748B] mt-0.5">Drop one snippet — works everywhere.</p>
                </div>
              </div>

              {/* Platform badges */}
              <div className="flex flex-wrap gap-2 mt-1">
                {["WordPress", "Shopify", "Webflow", "Wix", "Custom HTML"].map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[11px] font-semibold text-[#64748B]">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Code block */}
            <div className="px-8 py-6">
              <div className="relative group rounded-2xl bg-[#0F172A] border border-[#1E293B] overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-[#1E293B] bg-[#1E293B]/40">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-[11px] font-mono text-slate-400 tracking-widest uppercase">HTML Snippet</span>
                  <div className="w-16" />
                </div>

                {/* Code content */}
                <pre className="px-6 py-5 overflow-x-auto text-sm font-mono text-emerald-400 leading-7 whitespace-pre-wrap break-all">
                  <code>{embedCodeString}</code>
                </pre>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-8 pb-8 flex items-center gap-3">
              <button
                type="button"
                onClick={copyEmbedCode}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] hover:from-[#6025C5] hover:to-[#7C3AED] text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? "Copied!" : "Copy code"}</span>
              </button>
              <button
                type="button"
                onClick={() => setEmbedModalWidget(null)}
                className="py-3.5 px-6 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] text-[#111827] font-bold text-sm hover:bg-[#F1F5F9] active:scale-[0.98] transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl transform scale-100 transition-all">
            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-[#F1F5F9] transition cursor-pointer"
              onClick={() => !isDeleting && setDeletingWidget(null)}
              aria-label="Close"
              disabled={isDeleting}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon Header */}
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center mb-4 text-rose-600 shadow-sm">
              <Trash2 className="w-6 h-6 stroke-[2.2]" />
            </div>

            {/* Modal Content */}
            <h3 className="text-lg font-black text-[#111827] tracking-tight">Delete Widget</h3>
            <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-[#111827]">&quot;{deletingWidget.name}&quot;</span>?
            </p>
            <p className="text-[11px] text-[#94A3B8] mt-1 leading-normal">
              This action cannot be undone. Any live site embedding this widget will no longer display it.
            </p>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeletingWidget(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-white border border-[#E2E8F0] text-[#475569] font-bold text-xs hover:bg-[#F8FAFC] transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md shadow-red-600/20 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete Widget</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= COMING SOON PREVIEW MODAL ================= */}
      {comingSoonModalWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-white border border-[#E2E8F0] shadow-2xl overflow-hidden">
            {/* Accent glow bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#7137D8] via-[#D52BBD] to-[#3478F6]" />

            {/* Close button */}
            <button
              type="button"
              onClick={() => setComingSoonModalWidget(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#64748B] hover:text-[#111827] hover:bg-[#F1F5F9] transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-7 space-y-5">
              {/* Header with Icon, Title, and Badge */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${comingSoonModalWidget.iconBgClass}`}
                >
                  {renderItemIcon(comingSoonModalWidget.iconType)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-black text-[#111827] tracking-tight truncate">
                      {comingSoonModalWidget.title}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#F1F5F9] text-[#64748B] border border-[#E2E8F0] shrink-0">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-xs text-[#64748B] mt-1 leading-relaxed">
                    {comingSoonModalWidget.description}
                  </p>
                </div>
              </div>

              {/* Planned Features */}
              <div className="rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] p-4 space-y-2.5">
                <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
                  Planned Features for Release
                </h4>
                <ul className="space-y-2">
                  {(comingSoonModalWidget.features || []).map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-[#334155]">
                      <span className="text-[#16A34A] font-bold mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Priority Waitlist Form */}
              <div className="rounded-2xl bg-gradient-to-br from-[#F6F0FE] to-[#FDF2F8] border border-[#EDE0FD] p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#7137D8]" />
                  <h4 className="text-xs font-black text-[#111827]">Get Priority Early Access</h4>
                </div>
                <p className="text-[11px] text-[#64748B] leading-relaxed">
                  Be the first to test this widget when the beta drops. We&apos;ll notify you with an instant activation link.
                </p>

                <form onSubmit={handleNotifySubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="Enter your email for notification..."
                    className="flex-1 bg-white border border-[#E2E8F0] rounded-xl px-3 py-2 text-xs text-[#111827] placeholder:text-[#94A3B8] outline-none focus:border-[#7137D8]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] hover:from-[#6025C5] hover:to-[#7C3AED] text-white font-bold text-xs shadow-xs transition cursor-pointer shrink-0"
                  >
                    Notify Me
                  </button>
                </form>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-between pt-1">
                <button
                  type="button"
                  onClick={() => setComingSoonModalWidget(null)}
                  className="text-xs text-[#64748B] hover:text-[#111827] transition cursor-pointer"
                >
                  ← Back to Catalog
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setComingSoonModalWidget(null);
                    setSelectedCategory("urgency");
                  }}
                  className="text-xs font-bold text-[#7137D8] hover:underline transition cursor-pointer"
                >
                  Explore Ready Widgets →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= WEBSITE LINK MODAL ================= */}
      {linkModalWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-white border border-[#E2E8F0] shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-[#E2E8F0] flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F6F0FE] text-[#7137D8] border border-[#EDE0FD] flex items-center justify-center">
                  <Globe className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#111827]">Link Widget to Website</h3>
                  <p className="text-xs text-[#64748B] mt-0.5">
                    Associate &quot;{linkModalWidget.name}&quot; with one of your websites.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setLinkModalWidget(null)}
                className="p-1.5 rounded-lg text-[#64748B] hover:text-[#111827] hover:bg-[#F1F5F9] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {/* Search Websites */}
              <div className="relative">
                <Search className="w-4 h-4 text-[#94A3B8] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={websitePickerSearch}
                  onChange={(e) => setWebsitePickerSearch(e.target.value)}
                  placeholder="Filter your websites…"
                  className="w-full bg-white border border-[#E2E8F0] rounded-xl pl-9 pr-3 py-2 text-xs text-[#111827] placeholder-[#94A3B8] focus:outline-none focus:border-[#7137D8]"
                />
              </div>

              {/* Websites List */}
              <div className="max-h-60 overflow-y-auto space-y-2 pr-1">
                {/* Unlink / None option */}
                <label
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    websitePickerSelectedId === ""
                      ? "bg-[#F6F0FE] border-[#7137D8] text-[#111827]"
                      : "bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#64748B]"
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <input
                      type="radio"
                      name="selected_website"
                      checked={websitePickerSelectedId === ""}
                      onChange={() => setWebsitePickerSelectedId("")}
                      className="accent-[#7137D8]"
                    />
                    <div>
                      <span className="text-xs font-bold text-[#111827] block">Unlink from Website</span>
                      <span className="text-[11px] text-[#64748B]">Display as &quot;Website not linked&quot;</span>
                    </div>
                  </div>
                  <Unlink className="w-4 h-4 text-[#94A3B8]" />
                </label>

                {/* Filtered Projects */}
                {projects
                  .filter((p) => {
                    const q = websitePickerSearch.trim().toLowerCase();
                    if (!q) return true;
                    return (
                      (p.name || "").toLowerCase().includes(q) ||
                      getProjectDomain(p).toLowerCase().includes(q)
                    );
                  })
                  .map((p) => {
                    const isSelected = websitePickerSelectedId === p.id;
                    const domain = getProjectDomain(p);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                          isSelected
                            ? "bg-[#F6F0FE] border-[#7137D8] text-[#111827]"
                            : "bg-[#F8FAFC] border-[#E2E8F0] hover:bg-[#F1F5F9] text-[#64748B]"
                        }`}
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <input
                            type="radio"
                            name="selected_website"
                            checked={isSelected}
                            onChange={() => setWebsitePickerSelectedId(p.id)}
                            className="accent-[#7137D8]"
                          />
                          <div className="min-w-0">
                            <span className="text-xs font-bold text-[#111827] block truncate">
                              {p.name || "Untitled Website"}
                            </span>
                            <span className="text-[11px] text-[#64748B] block truncate">
                              {domain}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-[#64748B] border border-[#E2E8F0] shrink-0">
                          {p.status === "published" || (p as any).publishedUrl ? "Live" : "Draft"}
                        </span>
                      </label>
                    );
                  })}

                {projects.length === 0 && (
                  <div className="p-4 text-center text-xs text-[#64748B] bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
                    No websites found in your account yet.
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2 bg-[#F8FAFC]">
              <button
                type="button"
                onClick={() => setLinkModalWidget(null)}
                className="py-2 px-4 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#111827] hover:bg-[#F1F5F9] transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isLinkingWebsite}
                onClick={() => handleLinkWebsite(linkModalWidget.id, websitePickerSelectedId || null)}
                className="py-2 px-4 rounded-xl bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] hover:from-[#6025C5] hover:to-[#7C3AED] text-white font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLinkingWebsite ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Saving…</span>
                  </>
                ) : (
                  <span>Save Association</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= QUICK PREVIEW MODAL ================= */}
      {previewModalWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-[#E2E8F0] w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-4 border-b border-[#E2E8F0]">
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center text-white ${previewModalWidget.iconBgClass || "bg-[#7137D8]"}`}
                >
                  {renderItemIcon(previewModalWidget.iconType)}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-bold text-[#111827]">{previewModalWidget.title}</h3>
                    {previewModalWidget.badge && (
                      <span
                        className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                          previewModalWidget.badge.toLowerCase() === "popular"
                            ? "bg-[#FFE4E6] text-[#E11D48]"
                            : "bg-[#F3E8FF] text-[#7137D8]"
                        }`}
                      >
                        {previewModalWidget.badge.toUpperCase()}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#64748B] capitalize">{previewModalWidget.marketplaceCategory || previewModalWidget.categoryId}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setPreviewModalWidget(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-[#64748B] hover:text-[#111827] hover:bg-[#F1F5F9] transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body with Miniature Preview */}
            <div className="p-6 space-y-4">
              <div className="bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                <div className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider mb-2">
                  Live Component Preview
                </div>
                <div className="bg-white rounded-lg p-2 border border-[#E2E8F0] shadow-2xs">
                  <WidgetMiniaturePreview widgetId={previewModalWidget.id} />
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#111827] mb-1">About this widget</h4>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {previewModalWidget.description}
                </p>
              </div>

              <div className="flex items-center justify-between text-xs py-2 px-3 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0]">
                <span className="text-[#64748B] font-medium">Available Templates</span>
                <span className="font-bold text-[#7137D8]">{previewModalWidget.designsCount || "3+ Designs"}</span>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-[#E2E8F0] flex items-center justify-end gap-2 bg-[#F8FAFC]">
              <button
                type="button"
                onClick={() => setPreviewModalWidget(null)}
                className="py-2 px-4 rounded-xl text-xs font-bold text-[#64748B] hover:text-[#111827] hover:bg-[#F1F5F9] transition cursor-pointer"
              >
                Close
              </button>
              <button
                type="button"
                onClick={() => {
                  const target = previewModalWidget;
                  setPreviewModalWidget(null);
                  if (target) handleWidgetClick(target);
                }}
                className="py-2 px-5 rounded-xl bg-gradient-to-r from-[#7137D8] to-[#8B5CF6] hover:from-[#6025C5] hover:to-[#7C3AED] text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add widget to site</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
