import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, useMemo } from "react";
import {
  getAllWidgets,
  deleteWidget,
  duplicateWidget,
  createNewGoogleReviewsWidget,
  createNewCountdownWidget,
  createNewFaqWidget,
  saveWidget,
  COUNTDOWN_TEMPLATE_LIST,
  type WidgetInstanceRecord,
  type CountdownTemplateItem,
} from "@/services/widgetService";
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
  MessageSquare,
  LayoutGrid,
  Share2,
  FileText,
  Boxes,
  ChevronRight,
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

export interface CatalogWidgetItem {
  id: string;
  title: string;
  description: string;
  categoryId: string;
  status: "ready" | "coming_soon";
  iconType: string;
  iconBgClass: string;
  features: string[];
}

const CATALOG_CATEGORIES: CatalogCategory[] = [
  { id: "all", label: "All widgets", iconName: "layout_grid", headerTitle: "All Widgets", headerIcon: "layout_grid" },
  { id: "support", label: "Support", iconName: "message", headerTitle: "Support & Communication", headerIcon: "message" },
  { id: "sales", label: "Sales & Promotions", iconName: "megaphone", headerTitle: "Sales & Promotions", headerIcon: "megaphone" },
  { id: "reviews", label: "Reviews & Trust", iconName: "star", headerTitle: "Reviews & Trust", headerIcon: "star" },
  { id: "urgency", label: "Urgency", iconName: "clock", headerTitle: "Urgency & Engagement", headerIcon: "clock" },
  { id: "social", label: "Social", iconName: "share", headerTitle: "Social Media", headerIcon: "share" },
  { id: "forms", label: "Forms", iconName: "file_text", headerTitle: "Forms & Surveys", headerIcon: "file_text" },
  { id: "other", label: "Other", iconName: "boxes", headerTitle: "Other Utilities", headerIcon: "boxes" },
];

const CATALOG_WIDGETS: CatalogWidgetItem[] = [
  // 1. Support & Communication
  {
    id: "whatsapp_chat",
    title: "WhatsApp Live Chat",
    description: "Let visitors chat with you on WhatsApp.",
    categoryId: "support",
    status: "coming_soon",
    iconType: "whatsapp",
    iconBgClass: "bg-[#25d366] text-white",
    features: [
      "Floating WhatsApp chat bubble with custom button position",
      "Pre-filled welcome greetings and starter questions",
      "Custom support agent avatar, name, and online badge",
      "Direct redirection to WhatsApp Web or mobile app",
    ],
  },
  {
    id: "faq_accordion",
    title: "FAQ Accordion",
    description: "Answer common questions easily.",
    categoryId: "support",
    status: "ready",
    iconType: "faq",
    iconBgClass: "bg-[#0284c7] text-white",
    features: [
      "8 modern preset designs (Classic, Modern, Minimal, Floating)",
      "Instant live search and category filter tabs",
      "Rich text answers with markdown & links support",
      "Automatic Google FAQPage Schema markup for rich SEO snippets",
    ],
  },
  {
    id: "live_chat",
    title: "Live Chat",
    description: "Chat with visitors in real-time.",
    categoryId: "support",
    status: "coming_soon",
    iconType: "live_chat",
    iconBgClass: "bg-[#8b5cf6] text-white",
    features: [
      "Real-time 2-way messaging with typing indicators",
      "Automated greeting triggers based on time on page",
      "Collect email & lead data before starting chat",
      "Desktop & mobile instant push alerts",
    ],
  },
  {
    id: "contact_form",
    title: "Contact Form",
    description: "Collect messages from your visitors.",
    categoryId: "support",
    status: "coming_soon",
    iconType: "contact_form",
    iconBgClass: "bg-[#f97316] text-white",
    features: [
      "Drag-and-drop custom form field builder",
      "Instant email delivery and dashboard inbox",
      "Spam protection with smart honeypot & reCAPTCHA",
      "File upload attachment support",
    ],
  },

  // 2. Sales & Promotions
  {
    id: "announcement_bar",
    title: "Announcement Bar",
    description: "Show offers and important updates.",
    categoryId: "sales",
    status: "ready",
    iconType: "announcement_bar",
    iconBgClass: "bg-[#f43f5e] text-white",
    features: [
      "Top and bottom sticky notification bars",
      "Integrated countdown timer for urgent sales",
      "Coupon code copy button with click-to-copy",
      "Exit-intent and scroll trigger display rules",
    ],
  },
  {
    id: "popup",
    title: "Popup",
    description: "Display popups for offers and announcements.",
    categoryId: "sales",
    status: "ready",
    iconType: "popup",
    iconBgClass: "bg-[#a855f7] text-white",
    features: [
      "Exit-intent modal popups that retain leaving visitors",
      "Timed delay & page scroll percentage triggers",
      "Special discount code popups with CTA link",
      "Mobile-responsive full screen or centered dialog",
    ],
  },
  {
    id: "sales_notification",
    title: "Sales Notification",
    description: "Show recent sales and sign-ups.",
    categoryId: "sales",
    status: "coming_soon",
    iconType: "sales_notification",
    iconBgClass: "bg-[#f97316] text-white",
    features: [
      "Realistic recent purchase popups (FOMO alerts)",
      "Custom product names, customer avatars & locations",
      "Configurable cycle intervals and randomize option",
      "Increases buyer trust and conversion rates",
    ],
  },
  {
    id: "discount_coupon",
    title: "Discount Coupon",
    description: "Show discount codes and special deals.",
    categoryId: "sales",
    status: "coming_soon",
    iconType: "discount_coupon",
    iconBgClass: "bg-[#10b981] text-white",
    features: [
      "Click-to-copy promo codes with micro-animations",
      "Scratch card & mystery discount reveal gamification",
      "Timed coupons with countdown to expiry",
      "Direct checkout redirect with code pre-applied",
    ],
  },

  // 3. Reviews & Trust
  {
    id: "google_reviews",
    title: "Google Reviews",
    description: "Show customer reviews on your site.",
    categoryId: "reviews",
    status: "ready",
    iconType: "google",
    iconBgClass: "bg-white text-zinc-900 border border-white/20",
    features: [
      "Direct Google Places search & review synchronization",
      "Carousel, grid, masonry & floating rating badge",
      "Filter only 4-star and 5-star positive reviews",
      "Verified Google reviewer badge & authentic stars",
    ],
  },
  {
    id: "testimonial_slider",
    title: "Testimonial Slider",
    description: "Display customer testimonials.",
    categoryId: "reviews",
    status: "coming_soon",
    iconType: "testimonial_slider",
    iconBgClass: "bg-[#4f46e5] text-white",
    features: [
      "Touch-friendly carousel with smooth autoplay",
      "Client photo, company name, role and star rating",
      "Support for video testimonial embeds",
      "Custom accent colors matching your brand palette",
    ],
  },
  {
    id: "trust_badges",
    title: "Trust Badges",
    description: "Show trust badges and payment icons.",
    categoryId: "reviews",
    status: "coming_soon",
    iconType: "trust_badges",
    iconBgClass: "bg-[#10b981] text-white",
    features: [
      "Verified SSL, McAfee, Norton security badges",
      "Payment method icons (Visa, Mastercard, Amex, PayPal, Apple Pay)",
      "30-day money back guarantee & free shipping emblems",
      "High-resolution vector rendering on all screen sizes",
    ],
  },
  {
    id: "rating_stars",
    title: "Rating Stars",
    description: "Display star ratings for products or services.",
    categoryId: "reviews",
    status: "coming_soon",
    iconType: "rating_stars",
    iconBgClass: "bg-[#f59e0b] text-white",
    features: [
      "Compact star rating badge for hero sections and headers",
      "Fractional stars (e.g., 4.9/5) with total review counter",
      "Schema.org AggregateRating markup for Google Rich Snippets",
      "Customizable star colors, sizes and layout styles",
    ],
  },

  // 4. Urgency & Engagement
  {
    id: "countdown_timer",
    title: "Countdown Timer",
    description: "Create urgency for offers or events.",
    categoryId: "urgency",
    status: "ready",
    iconType: "countdown_timer",
    iconBgClass: "bg-[#ef4444] text-white",
    features: [
      "10 designer presets (Flip clock, cyber digital, minimal bar)",
      "Evergreen visitor timers & fixed deadline dates",
      "Sticky header, bottom bar or embedded in-page",
      "Custom actions on timer expiry (hide, redirect, show message)",
    ],
  },
  {
    id: "limited_time_offer",
    title: "Limited Time Offer",
    description: "Highlight special offers.",
    categoryId: "urgency",
    status: "coming_soon",
    iconType: "limited_time_offer",
    iconBgClass: "bg-[#f97316] text-white",
    features: [
      "Flash sale ribbon banner with animated pulsing badge",
      "Original price vs discounted price calculation display",
      "Countdown timer built into promotional ribbon",
      "High-contrast color themes for maximum click-through",
    ],
  },
  {
    id: "stock_counter",
    title: "Stock Counter",
    description: "Show remaining stock or limited availability.",
    categoryId: "urgency",
    status: "coming_soon",
    iconType: "stock_counter",
    iconBgClass: "bg-[#8b5cf6] text-white",
    features: [
      "Animated inventory progress bar ('Only 3 left in stock!')",
      "Dynamic stock countdown triggered on visitor page view",
      "Custom low-stock threshold warning messages",
      "Proven to reduce checkout abandonment",
    ],
  },
  {
    id: "event_countdown",
    title: "Event Countdown",
    description: "Countdown to your upcoming event.",
    categoryId: "urgency",
    status: "coming_soon",
    iconType: "event_countdown",
    iconBgClass: "bg-[#0ea5e9] text-white",
    features: [
      "Dedicated countdown for webinars, conferences & launches",
      "1-click 'Add to Google Calendar' and 'Apple iCal' button",
      "Automatic visitor timezone detection",
      "Event location, speaker avatars and registration CTA",
    ],
  },

  // 5. Social Media
  {
    id: "instagram_feed",
    title: "Instagram Feed",
    description: "Display your Instagram photos or reels.",
    categoryId: "social",
    status: "coming_soon",
    iconType: "instagram",
    iconBgClass: "bg-gradient-to-tr from-[#f58529] via-[#dd2a7b] to-[#8134af] text-white",
    features: [
      "Auto-updating grid and carousel feeds from your profile",
      "Lightbox modal popup to view photos and videos in HD",
      "Filter by specific hashtags or user reels",
      "Shoppable post links directly to product pages",
    ],
  },
  {
    id: "social_icons",
    title: "Social Icons",
    description: "Add social media links to your site.",
    categoryId: "social",
    status: "coming_soon",
    iconType: "social_icons",
    iconBgClass: "bg-[#3b82f6] text-white",
    features: [
      "40+ official brand icons (Twitter/X, LinkedIn, TikTok, etc.)",
      "Floating sidebar or embedded header/footer links",
      "Sleek hover effects, brand color fills and glowing badges",
      "Custom URL links with automatic tooltips",
    ],
  },
  {
    id: "facebook_page",
    title: "Facebook Page",
    description: "Show your Facebook page feed.",
    categoryId: "social",
    status: "coming_soon",
    iconType: "facebook",
    iconBgClass: "bg-[#1877f2] text-white",
    features: [
      "Display your Facebook page posts, likes & cover photo",
      "Integrated page 'Like' button without leaving your site",
      "Direct Facebook Messenger chat button option",
      "Responsive container width adapting to any layout",
    ],
  },
  {
    id: "youtube_video",
    title: "YouTube Video",
    description: "Embed YouTube videos on your site.",
    categoryId: "social",
    status: "coming_soon",
    iconType: "youtube",
    iconBgClass: "bg-[#ef4444] text-white",
    features: [
      "Embed videos, Shorts or full YouTube playlists",
      "Custom branded video player frame and thumbnail cover",
      "Autoplay on mute & looping capabilities",
      "Responsive 16:9 aspect ratio across mobile and desktop",
    ],
  },

  // 6. Forms & Surveys
  {
    id: "newsletter_signup",
    title: "Newsletter Signup",
    description: "Grow your email list with opt-in forms.",
    categoryId: "forms",
    status: "coming_soon",
    iconType: "newsletter",
    iconBgClass: "bg-[#7c3aed] text-white",
    features: [
      "High-converting email opt-in banner & popup modal",
      "Direct sync with Mailchimp, ConvertKit, Klaviyo & Webhooks",
      "GDPR compliant opt-in checkbox",
      "Custom thank-you message and discount lead magnet delivery",
    ],
  },
  {
    id: "feedback_survey",
    title: "Feedback Survey",
    description: "Collect feedback and NPS from visitors.",
    categoryId: "forms",
    status: "coming_soon",
    iconType: "survey",
    iconBgClass: "bg-[#06b6d4] text-white",
    features: [
      "1-click Net Promoter Score (NPS) and star rating surveys",
      "Emoji mood feedback and optional text comments",
      "Targeted popup after visitor completes a purchase",
      "CSV export and real-time dashboard analytics",
    ],
  },

  // 7. Other Utilities
  {
    id: "qr_code",
    title: "QR Code Generator",
    description: "Generate scannable QR codes for links & menus.",
    categoryId: "other",
    status: "coming_soon",
    iconType: "qr_code",
    iconBgClass: "bg-[#475569] text-white",
    features: [
      "Custom color, rounded dots & centered logo upload",
      "Links, WiFi passwords, vCard contacts and digital menus",
      "Download high-res SVG & PNG files for print or web",
      "Track total scans and visitor devices",
    ],
  },
  {
    id: "audio_player",
    title: "Audio Player",
    description: "Stream audio tracks, episodes or background music.",
    categoryId: "other",
    status: "coming_soon",
    iconType: "audio_player",
    iconBgClass: "bg-[#db2777] text-white",
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
    case "whatsapp":
      return <WhatsAppIcon />;
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

function renderCategoryPillIcon(iconName: string, className = "w-3.5 h-3.5") {
  switch (iconName) {
    case "layout_grid":
      return <LayoutGrid className={className} />;
    case "message":
      return <MessageSquare className={className} />;
    case "megaphone":
      return <Megaphone className={className} />;
    case "star":
      return <Star className={className} />;
    case "clock":
      return <Clock className={className} />;
    case "share":
      return <Share2 className={className} />;
    case "file_text":
      return <FileText className={className} />;
    case "boxes":
      return <Boxes className={className} />;
    default:
      return <Sparkles className={className} />;
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
  const [catalogLayout, setCatalogLayout] = useState<"list" | "cards">("list");
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

  const handleWidgetClick = (item: CatalogWidgetItem) => {
    if (item.status === "ready") {
      if (item.id === "countdown_timer") {
        setViewMode("choose_countdown");
      } else if (item.id === "google_reviews") {
        setViewMode("choose_google_reviews");
      } else if (item.id === "faq_accordion") {
        handleCreateFaq("classic_accordion");
      } else if (item.id === "announcement_bar") {
        handleCreateAnnouncement("bar");
      } else if (item.id === "popup") {
        handleCreateAnnouncement("popup");
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

  const filteredCatalogSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return CATALOG_CATEGORIES.filter((cat) => cat.id !== "all")
      .map((cat) => {
        if (selectedCategory !== "all" && selectedCategory !== cat.id) {
          return null;
        }

        const items = CATALOG_WIDGETS.filter((w) => {
          if (w.categoryId !== cat.id) return false;
          if (!q) return true;
          return (
            w.title.toLowerCase().includes(q) ||
            w.description.toLowerCase().includes(q) ||
            cat.label.toLowerCase().includes(q)
          );
        });

        if (items.length === 0) return null;

        return {
          ...cat,
          items,
        };
      })
      .filter(Boolean) as Array<CatalogCategory & { items: CatalogWidgetItem[] }>;
  }, [searchQuery, selectedCategory]);


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

  return (
    <div className="w-full max-w-[1400px] mx-auto p-6 lg:p-8 space-y-6">
      {/* ================= CASE 1: CHOOSE COUNTDOWN TEMPLATE ================= */}
      {viewMode === "choose_countdown" && (
        <div className="space-y-6 pt-2">
          <div className="flex items-center justify-between pb-5 border-b border-[#26262e]">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setViewMode("catalog")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#151518] hover:bg-[#1f1f25] text-[#9a9aa3] hover:text-white border border-white/10 text-xs font-bold transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Widgets</span>
              </button>
              <div>
                <h1 className="text-xl font-extrabold text-white">Choose a Countdown Template</h1>
                <p className="text-xs text-[#9a9aa3]">Select a pre-designed style to launch your countdown widget.</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleSelectCountdownTemplate(COUNTDOWN_TEMPLATE_LIST[0])}
              className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 cursor-pointer"
            >
              <span>Blank Timer +</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {COUNTDOWN_TEMPLATE_LIST.map((tpl) => (
              <div
                key={tpl.key}
                className="p-4 rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/40 transition flex flex-col justify-between group"
              >
                <div className="space-y-3">
                  <div className="h-44 rounded-xl overflow-hidden bg-[#0d0d10] border border-[#26262e] p-2 flex items-center justify-center">
                    <TemplateCardPreview tpl={tpl} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-white text-base group-hover:text-[#ffc21a] transition">
                      {tpl.name}
                    </h3>
                    <p className="text-xs text-[#9a9aa3] line-clamp-2 mt-1">{tpl.description}</p>
                  </div>
                </div>

                <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-[#ffc21a] bg-[#ffc21a]/10 px-2 py-0.5 rounded-full border border-[#ffc21a]/20 capitalize">
                    {(tpl as any).timerMode || tpl.config?.timerMode || "Date"}
                  </span>
                  <button
                    type="button"
                    disabled={creatingCountdownKey === tpl.key}
                    onClick={() => handleSelectCountdownTemplate(tpl)}
                    className="py-1.5 px-3 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md hover:opacity-90 transition cursor-pointer"
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
          <div className="flex items-center justify-between pb-5 border-b border-[#26262e]">
            <div className="flex items-center gap-3.5">
              <button
                type="button"
                onClick={() => setViewMode("catalog")}
                className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[#151518] hover:bg-[#1f1f25] text-[#9a9aa3] hover:text-white border border-white/10 text-xs font-bold transition cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Widgets</span>
              </button>
              <div>
                <h1 className="text-xl font-extrabold text-white">Choose Google Reviews Layout</h1>
                <p className="text-xs text-[#9a9aa3]">Display authentic Google reviews on your websites.</p>
              </div>
            </div>
          </div>

          <div className="max-w-md">
            <label className="text-xs font-bold text-[#9a9aa3] block mb-1.5">Widget Name</label>
            <input
              type="text"
              value={googleWidgetName}
              onChange={(e) => setGoogleWidgetName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#141418] border border-[#26262e] text-white text-sm focus:outline-none focus:border-[#ffc21a]"
              placeholder="e.g. Homepage Customer Reviews"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Carousel */}
            <div className="p-5 rounded-2xl bg-[#151518] border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-32 rounded-xl bg-[#0f0f13] border border-white/10 p-3 flex flex-col justify-center">
                  <div className="text-xs text-[#ffc21a] font-bold">★★★★★ 5.0</div>
                  <p className="text-xs text-white mt-1 italic">&quot;Best service in town! Super fast delivery.&quot;</p>
                  <small className="text-[11px] text-[#6b6b74] mt-1">Ananya S. · Verified Google Review</small>
                </div>
                <h3 className="font-extrabold text-white text-base">Interactive Carousel</h3>
                <p className="text-xs text-[#9a9aa3]">Smooth horizontal slider with auto-play and navigation arrows.</p>
              </div>
              <button
                type="button"
                disabled={creatingGoogle}
                onClick={() => handleCreateGoogleReview("carousel")}
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md transition cursor-pointer"
              >
                <span>{creatingGoogle ? "Creating…" : "Select Carousel & Open →"}</span>
              </button>
            </div>

            {/* Grid */}
            <div className="p-5 rounded-2xl bg-[#151518] border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-32 rounded-xl bg-[#0f0f13] border border-white/10 p-3 grid grid-cols-2 gap-2">
                  <div className="p-2 rounded bg-[#16161c] border border-white/10 text-[10px] text-zinc-300">
                    <span className="text-[#ffc21a]">★★★★★</span>
                    <p className="line-clamp-2 mt-0.5">Super support!</p>
                  </div>
                  <div className="p-2 rounded bg-[#16161c] border border-white/10 text-[10px] text-zinc-300">
                    <span className="text-[#ffc21a]">★★★★★</span>
                    <p className="line-clamp-2 mt-0.5">Great quality!</p>
                  </div>
                </div>
                <h3 className="font-extrabold text-white text-base">Multi-Column Grid</h3>
                <p className="text-xs text-[#9a9aa3]">Show multiple reviews simultaneously in a responsive grid layout.</p>
              </div>
              <button
                type="button"
                disabled={creatingGoogle}
                onClick={() => handleCreateGoogleReview("grid")}
                className="w-full py-2 px-3 rounded-xl bg-[#1f1f25] border border-white/10 text-white font-bold text-xs hover:border-[#ffc21a]/50 transition cursor-pointer"
              >
                <span>{creatingGoogle ? "Creating…" : "Select Grid & Open →"}</span>
              </button>
            </div>

            {/* Floating Badge */}
            <div className="p-5 rounded-2xl bg-[#151518] border border-white/[0.08] flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="h-32 rounded-xl bg-[#0f0f13] border border-white/10 p-3 flex items-center justify-center">
                  <div className="px-3.5 py-2 rounded-xl bg-[#1a1a20] border border-[#303038] text-center">
                    <div className="text-xs font-bold text-white flex items-center gap-1.5 justify-center">
                      <GoogleIcon />
                      <span>Google Rating</span>
                    </div>
                    <div className="text-[#ffc21a] text-xs font-bold mt-1">★★★★★ 4.9/5</div>
                    <div className="text-[10px] text-[#6b6b74]">150+ verified reviews</div>
                  </div>
                </div>
                <h3 className="font-extrabold text-white text-base">Floating Rating Badge</h3>
                <p className="text-xs text-[#9a9aa3]">A compact badge pinned to the corner or embedded inline in headers.</p>
              </div>
              <button
                type="button"
                disabled={creatingGoogle}
                onClick={() => handleCreateGoogleReview("badge")}
                className="w-full py-2 px-3 rounded-xl bg-[#1f1f25] border border-white/10 text-white font-bold text-xs hover:border-[#ffc21a]/50 transition cursor-pointer"
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
          {/* ================= HERO BANNER ================= */}
          <section className="relative rounded-[22px] bg-gradient-to-br from-[#17150f] via-[#141418] to-[#121215] border border-white/[0.07] p-8 overflow-hidden flex flex-col md:flex-row items-start md:items-end justify-between gap-6 shadow-2xl">
            {/* Ambient Gold & Blue Glow */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -top-24 right-1/4 w-80 h-80 rounded-full bg-[#ffc21a]/15 blur-3xl pointer-events-none" />
              <div className="absolute -bottom-24 right-1/3 w-64 h-64 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
            </div>

            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffc21a]/10 border border-[#ffc21a]/25 text-[#ffc21a] text-xs font-bold mb-3.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#ffc21a] animate-pulse" />
                Dynamic Widgets
              </span>
              <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight leading-tight mb-2">
                Widget Studio <span className="text-[#ffc21a] bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] bg-clip-text text-transparent">&amp; Hub</span>
              </h1>
              <p className="text-sm text-[#9a9aa3] leading-relaxed">
                Choose interactive widgets to boost conversions, build social trust and embed them on any website — in under a minute.
              </p>
            </div>

            {/* Sliding View Switch */}
            <div className="relative z-10 flex items-center p-1 rounded-xl bg-black/40 border border-white/[0.08] shrink-0">
              <button
                type="button"
                onClick={() => setViewMode("catalog")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "catalog"
                    ? "bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black shadow-lg shadow-[#ffc21a]/25"
                    : "text-[#9a9aa3] hover:text-white"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill={viewMode === "catalog" ? "currentColor" : "none"}
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0"
                >
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                </svg>
                <span>Widget Catalog</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    viewMode === "catalog" ? "bg-black/20 text-[#1a1400]" : "bg-white/10 text-[#9a9aa3]"
                  }`}
                >
                  {CATALOG_WIDGETS.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode("active")}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-bold transition cursor-pointer ${
                  viewMode === "active"
                    ? "bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black shadow-lg shadow-[#ffc21a]/25"
                    : "text-[#9a9aa3] hover:text-white"
                }`}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="shrink-0"
                >
                  <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                </svg>
                <span>My Active Widgets</span>
                <span
                  className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                    viewMode === "active" ? "bg-black/20 text-[#1a1400]" : "bg-white/10 text-[#9a9aa3]"
                  }`}
                >
                  {widgets.length || 0}
                </span>
              </button>
            </div>
          </section>

          {/* ================= STATS ROW ================= */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#151518] border border-white/[0.07]">
              <div className="w-11 h-11 rounded-xl bg-[#ffc21a]/10 text-[#ffc21a] flex items-center justify-center shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="3" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="3" width="7" height="7" rx="1.5" />
                  <rect x="14" y="14" width="7" height="7" rx="1.5" />
                  <rect x="3" y="14" width="7" height="7" rx="1.5" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-tight">{CATALOG_WIDGETS.length}</div>
                <div className="text-xs text-[#9a9aa3]">Widgets in catalog</div>
              </div>
            </div>

            {/* Stat 2 */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#151518] border border-white/[0.07]">
              <div className="w-11 h-11 rounded-xl bg-[#22c55e]/10 text-[#22c55e] flex items-center justify-center shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-tight">5</div>
                <div className="text-xs text-[#9a9aa3]">Ready to use</div>
              </div>
            </div>

            {/* Stat 3 */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#151518] border border-white/[0.07]">
              <div className="w-11 h-11 rounded-xl bg-[#60a5fa]/10 text-[#60a5fa] flex items-center justify-center shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-tight">{widgets.length || 0}</div>
                <div className="text-xs text-[#9a9aa3]">Active on your sites</div>
              </div>
            </div>

            {/* Stat 4 */}
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#151518] border border-white/[0.07]">
              <div className="w-11 h-11 rounded-xl bg-[#a78bfa]/10 text-[#a78bfa] flex items-center justify-center shrink-0">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div>
                <div className="text-2xl font-black text-white leading-tight">12.4k</div>
                <div className="text-xs text-[#9a9aa3]">
                  Views this month <span className="text-[#22c55e] font-bold ml-1">↑ 18%</span>
                </div>
              </div>
            </div>
          </section>

          {/* ================= CATALOG VIEW ================= */}
          {viewMode === "catalog" && (
            <section className="space-y-6">
              {/* Category Filter Pills & Search Bar (Screenshot 1 Layout) */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-2">
                {/* Category Pills */}
                <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
                  {CATALOG_CATEGORIES.map((cat) => {
                    const isSelected = selectedCategory === cat.id;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs transition cursor-pointer shrink-0 ${
                          isSelected
                            ? "bg-[#ffc21a] text-[#1a1400] font-black shadow-md shadow-[#ffc21a]/25"
                            : "bg-[#151518] border border-white/[0.08] text-[#9a9aa3] hover:text-white font-semibold hover:bg-white/[0.04]"
                        }`}
                      >
                        {renderCategoryPillIcon(cat.iconName)}
                        <span>{cat.label}</span>
                        {cat.id === "all" && (
                          <span
                            className={`text-[10px] font-black px-1.5 py-0.2 rounded-full ${
                              isSelected ? "bg-black/20 text-[#1a1400]" : "text-[#6b6b74]"
                            }`}
                          >
                            {CATALOG_WIDGETS.length}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Right controls: Search & Layout Toggle */}
                <div className="flex items-center gap-2 shrink-0">
                  <div className="flex items-center gap-2 bg-[#151518] border border-white/[0.08] focus-within:border-[#ffc21a]/50 rounded-xl px-3 py-1.5 w-full sm:w-[250px]">
                    <Search className="w-3.5 h-3.5 text-[#6b6b74] shrink-0" />
                    <input
                      type="search"
                      placeholder="Search widgets..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-0 outline-none text-xs text-white placeholder:text-[#6b6b74] flex-1 min-w-0"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="text-[#6b6b74] hover:text-white text-xs"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {/* Toggle Between Row List (Screenshot 1) and Card Previews */}
                  <div className="hidden sm:flex items-center p-1 rounded-xl bg-[#151518] border border-white/[0.08] shrink-0">
                    <button
                      type="button"
                      onClick={() => setCatalogLayout("list")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        catalogLayout === "list"
                          ? "bg-[#ffc21a] text-[#1a1400]"
                          : "text-[#9a9aa3] hover:text-white"
                      }`}
                      title="Categorized List Rows (Screenshot 1)"
                    >
                      <LayoutList className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Rows</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCatalogLayout("cards")}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer flex items-center gap-1.5 ${
                        catalogLayout === "cards"
                          ? "bg-[#ffc21a] text-[#1a1400]"
                          : "text-[#9a9aa3] hover:text-white"
                      }`}
                      title="Interactive Live Cards"
                    >
                      <LayoutGrid className="w-3.5 h-3.5" />
                      <span className="hidden md:inline">Cards</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* ================= PRIMARY LIST LAYOUT (SCREENSHOT 1) ================= */}
              {catalogLayout === "list" && (
                <div className="space-y-8">
                  {filteredCatalogSections.length === 0 ? (
                    <div className="rounded-2xl bg-[#151518] border border-white/[0.08] p-10 text-center space-y-3">
                      <div className="w-12 h-12 rounded-2xl bg-white/[0.04] border border-white/10 text-[#9a9aa3] flex items-center justify-center mx-auto">
                        <Search className="w-5 h-5" />
                      </div>
                      <h3 className="text-base font-bold text-white">No widgets found</h3>
                      <p className="text-xs text-[#9a9aa3] max-w-sm mx-auto">
                        We couldn&apos;t find any widgets matching &ldquo;{searchQuery}&rdquo;. Try another search term or clear the filter.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchQuery("");
                          setSelectedCategory("all");
                        }}
                        className="py-2 px-4 rounded-xl bg-[#ffc21a] text-[#1a1400] font-bold text-xs inline-flex cursor-pointer shadow-md"
                      >
                        Reset Filters
                      </button>
                    </div>
                  ) : (
                    filteredCatalogSections.map((sec) => (
                      <section key={sec.id} className="space-y-3">
                        {/* Section Header with Category Icon, Title, and "View all ->" */}
                        <div className="flex items-center justify-between pb-1">
                          <h2 className="flex items-center gap-2 text-base font-extrabold text-white tracking-tight">
                            <span className="text-[#ffc21a]">
                              {renderCategoryPillIcon(sec.headerIcon, "w-4 h-4")}
                            </span>
                            <span>{sec.headerTitle}</span>
                          </h2>

                          <button
                            type="button"
                            onClick={() => setSelectedCategory(selectedCategory === sec.id ? "all" : sec.id)}
                            className="text-xs font-bold text-sky-400 hover:text-sky-300 flex items-center gap-1 transition cursor-pointer"
                          >
                            <span>{selectedCategory === sec.id ? "Show all categories" : "View all"}</span>
                            <span className="text-sm">→</span>
                          </button>
                        </div>

                        {/* 2-Column Grid Matching Screenshot 1 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                          {sec.items.map((item) => {
                            const isReady = item.status === "ready";
                            const isNotified = notifiedWidgetIds.includes(item.id);

                            return (
                              <div
                                key={item.id}
                                onClick={() => handleWidgetClick(item)}
                                className="rounded-2xl bg-[#0b0e14]/90 hover:bg-[#121622] border border-white/[0.08] hover:border-white/20 p-3.5 sm:p-4 transition-all duration-200 cursor-pointer flex items-center justify-between group shadow-sm hover:shadow-lg hover:shadow-black/40"
                              >
                                {/* Left side: Squircle Icon + Info */}
                                <div className="flex items-center gap-3.5 min-w-0 pr-3">
                                  <div
                                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-md ${item.iconBgClass}`}
                                  >
                                    {renderItemIcon(item.iconType)}
                                  </div>

                                  <div className="min-w-0">
                                    <div className="text-sm font-bold text-white group-hover:text-white transition flex items-center gap-2">
                                      <span className="truncate">{item.title}</span>
                                    </div>
                                    <p className="text-xs text-[#9a9aa3] mt-0.5 truncate leading-tight">
                                      {item.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Right side: Status Badge + Arrow */}
                                <div className="flex items-center gap-2.5 shrink-0">
                                  {isReady ? (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#22c55e]/15 border border-[#22c55e]/30 text-[#22c55e] text-xs font-bold shadow-sm shadow-[#22c55e]/15">
                                      <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-pulse" />
                                      Ready
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/[0.05] border border-white/10 text-[#a1a1aa] text-[11px] font-semibold">
                                      {isNotified ? "Waitlisted ✓" : "Coming soon"}
                                    </span>
                                  )}

                                  <ChevronRight className="w-4 h-4 text-[#71717a] group-hover:text-white group-hover:translate-x-0.5 transition" />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </section>
                    ))
                  )}
                </div>
              )}

              {/* ================= SECONDARY CARD PREVIEW LAYOUT (SCREENSHOT 2) ================= */}
              {catalogLayout === "cards" && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {/* FAQ Accordion (Ready & Fully Functional) */}
                  {filterMatches("support", "faq accordion") && (
                    <article className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/30 transition overflow-hidden flex flex-col justify-between group shadow-lg">
                      {/* Preview Box */}
                      <div className="relative h-44 bg-[radial-gradient(ellipse_at_50%_120%,rgba(56,189,248,0.12),transparent_60%),linear-gradient(180deg,#1a1a1f,#141417)] border-b border-white/[0.07] flex flex-col items-center justify-center p-4">
                        <div className="w-full max-w-[280px] space-y-2">
                          <div className="p-2.5 rounded-lg bg-white/[0.06] border border-white/10 shadow-sm">
                            <div className="flex items-center justify-between text-xs font-bold text-white">
                              <span>How does it work?</span>
                              <span className="text-[#ffc21a] text-xs font-black">−</span>
                            </div>
                            <p className="text-[10px] text-[#9a9aa3] mt-1 leading-snug line-clamp-1">
                              Everything is automated and completely customizable.
                            </p>
                          </div>
                          <div className="px-2.5 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.06] flex items-center justify-between text-xs font-medium text-zinc-300">
                            <span>Can I embed this anywhere?</span>
                            <span className="text-zinc-500 text-xs font-bold">+</span>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-sky-400 bg-sky-400/10 border border-sky-400/20 px-3 py-0.5 rounded-full mt-2">
                          💬 Live Accordion &amp; Search
                        </span>
                      </div>

                      {/* Card Body */}
                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                              Ready
                            </span>
                            <span className="text-[11px] font-bold text-[#9a9aa3] bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                              8 Pro presets
                            </span>
                          </div>
                          <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase mb-1">
                            Customer Support
                          </p>
                          <h3 className="flex items-center gap-2.5 text-lg font-black text-white mb-2">
                            <span className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400 flex items-center justify-center">
                              <HelpCircle className="w-4 h-4" />
                            </span>
                            <span>FAQ Accordion</span>
                          </h3>
                          <p className="text-xs text-[#9a9aa3] leading-relaxed mb-4">
                            Display frequently asked questions and answers in a clean, interactive accordion with live search, categories, and 8 ready-made templates.
                          </p>
                          <ul className="flex flex-wrap gap-1.5 mb-2">
                            <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                              ✓ 8 templates
                            </li>
                            <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                              ✓ Live search
                            </li>
                            <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                              ✓ Category filter
                            </li>
                          </ul>
                        </div>

                        <div className="pt-4 mt-2 border-t border-white/[0.06]">
                          <button
                            type="button"
                            onClick={() => handleCreateFaq("classic_accordion")}
                            className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-sky-400 to-indigo-500 hover:opacity-95 text-black font-extrabold text-xs transition cursor-pointer flex items-center justify-center gap-2 shadow-md shadow-sky-500/10"
                          >
                            <span>+ Create FAQ Widget</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </article>
                  )}

                  {/* Countdown Timer (Ready) */}
                  {filterMatches("urgency", "countdown timer") && (
                    <article className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/30 transition overflow-hidden flex flex-col justify-between group shadow-lg">
                      <div className="relative h-44 bg-[radial-gradient(ellipse_at_50%_120%,rgba(255,194,26,0.12),transparent_60%),linear-gradient(180deg,#1a1a1f,#141417)] border-b border-white/[0.07] flex flex-col items-center justify-center p-3">
                        <div className="flex items-center gap-1.5">
                          <div className="flex flex-col items-center gap-1">
                            <div className="relative w-14 h-14 rounded-xl bg-gradient-to-b from-[#26262c] to-[#1f1f24] border border-white/10 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                              <span>02</span>
                              <span className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/60" />
                            </div>
                            <small className="text-[9px] font-extrabold uppercase tracking-widest text-[#6b6b74]">
                              HRS
                            </small>
                          </div>
                          <span className="text-[#ffc21a] font-bold text-xl pb-3.5">:</span>
                          <div className="flex flex-col items-center gap-1">
                            <div className="relative w-14 h-14 rounded-xl bg-gradient-to-b from-[#26262c] to-[#1f1f24] border border-white/10 text-white font-black text-2xl flex items-center justify-center shadow-lg">
                              <span>{pad(liveMin)}</span>
                              <span className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/60" />
                            </div>
                            <small className="text-[9px] font-extrabold uppercase tracking-widest text-[#6b6b74]">
                              MIN
                            </small>
                          </div>
                          <span className="text-[#ffc21a] font-bold text-xl pb-3.5">:</span>
                          <div className="flex flex-col items-center gap-1">
                            <div className="relative w-14 h-14 rounded-xl bg-gradient-to-b from-[#26262c] to-[#1f1f24] border border-[#ffc21a]/30 text-[#ffc21a] font-black text-2xl flex items-center justify-center shadow-lg animate-pulse">
                              <span>{pad(liveSec)}</span>
                              <span className="absolute left-0 right-0 top-1/2 h-[1px] bg-black/60" />
                            </div>
                            <small className="text-[9px] font-extrabold uppercase tracking-widest text-[#6b6b74]">
                              SEC
                            </small>
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-[#ffc21a] bg-[#ffc21a]/10 border border-[#ffc21a]/20 px-3 py-0.5 rounded-full mt-3">
                          ⚡ Flash sale ends soon
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                              Ready
                            </span>
                            <span className="text-[11px] font-bold text-[#9a9aa3] bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                              10 Pro presets
                            </span>
                          </div>
                          <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase mb-1">
                            Urgency &amp; Conversions
                          </p>
                          <h3 className="flex items-center gap-2.5 text-lg font-black text-white mb-2">
                            <span className="w-7 h-7 rounded-lg bg-[#ef4444]/15 border border-[#ef4444]/30 text-[#ef4444] flex items-center justify-center">
                              <Clock className="w-4 h-4" />
                            </span>
                            <span>Countdown Timer</span>
                          </h3>
                          <p className="text-xs text-[#9a9aa3] leading-relaxed mb-4">
                            Sales deadlines, evergreen visitor timers, recurring bars &amp; number counters with flip-clock styles and expiry actions.
                          </p>
                          <ul className="flex flex-wrap gap-1.5 mb-2">
                            <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                              ✓ Date &amp; evergreen
                            </li>
                            <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                              ✓ Sticky bars
                            </li>
                            <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                              ✓ Flip clock
                            </li>
                          </ul>
                        </div>

                        <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewMode("choose_countdown")}
                            className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Choose widget</span>
                            <span className="text-sm">→</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  )}

                  {/* Google Reviews (Ready) */}
                  {filterMatches("reviews", "google reviews") && (
                    <article className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/30 transition overflow-hidden flex flex-col justify-between group shadow-lg">
                      <div className="relative h-44 bg-[radial-gradient(ellipse_at_50%_120%,rgba(66,133,244,0.12),transparent_60%),linear-gradient(180deg,#1a1a1f,#141417)] border-b border-white/[0.07] flex flex-col items-center justify-center p-4">
                        <div className="w-[220px] p-2.5 rounded-xl bg-[#1f1f25] border border-white/10 shadow-xl flex items-center gap-2.5">
                          <span className="w-8 h-8 rounded-full bg-[#3b82f6] text-white font-black text-xs flex items-center justify-center shrink-0">
                            M
                          </span>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <strong className="text-xs font-bold text-white">Meera</strong>
                              <span className="text-[#ffc21a] text-[10px]">★★★★★</span>
                            </div>
                            <p className="text-[11px] text-[#9a9aa3] truncate">Highly recommended.</p>
                          </div>
                        </div>

                        <div className="absolute right-3.5 bottom-3 bg-white text-black px-2.5 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5">
                          <GoogleIcon className="w-3.5 h-3.5" />
                          <span className="font-extrabold text-[11px]">4.9</span>
                          <span className="text-[#f59e0b] text-[10px]">★</span>
                        </div>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                              Ready
                            </span>
                            <span className="text-[11px] font-bold text-[#9a9aa3] bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                              Live Google Places
                            </span>
                          </div>
                          <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase mb-1">
                            Social Proof &amp; Trust
                          </p>
                          <h3 className="flex items-center gap-2.5 text-lg font-black text-white mb-2">
                            <span className="w-7 h-7 rounded-lg bg-white border border-white text-black flex items-center justify-center">
                              <GoogleIcon className="w-4 h-4" />
                            </span>
                            <span>Google Reviews</span>
                          </h3>
                          <p className="text-xs text-[#9a9aa3] leading-relaxed mb-4">
                            Display authentic Google reviews with verified badges, real-time ratings and carousel, grid, masonry or floating layouts.
                          </p>
                          <ul className="flex flex-wrap gap-1.5 mb-2">
                            <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                              ✓ Live sync
                            </li>
                            <li className="text-[11px] font-medium text-zinc-300 bg-white/[0.03] border border-white/[0.06] rounded-md px-2 py-0.5">
                              ✓ Carousel &amp; grid
                            </li>
                          </ul>
                        </div>

                        <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setViewMode("choose_google_reviews")}
                            className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Choose widget</span>
                            <span className="text-sm">→</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  )}

                  {/* Announcement Bar & Popup (Ready) */}
                  {filterMatches("sales", "announcement bar") && (
                    <article className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-[#ffc21a]/30 transition overflow-hidden flex flex-col justify-between group shadow-lg">
                      <div className="relative h-44 bg-[radial-gradient(ellipse_at_50%_120%,rgba(250,204,21,0.12),transparent_60%),linear-gradient(180deg,#1a1a1f,#141417)] border-b border-white/[0.07] flex flex-col items-center justify-center p-4">
                        <div className="w-[230px] rounded-xl overflow-hidden bg-[#1f1f25] border border-white/10 shadow-xl">
                          <div className="bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] text-[10px] font-black py-1 px-2.5 overflow-hidden whitespace-nowrap flex items-center justify-between">
                            <span>🔥 Summer Sale — 25% OFF</span>
                            <span className="text-[9px] bg-black/20 px-1 rounded font-mono">SAVE25</span>
                          </div>
                          <div className="p-3 space-y-1.5 opacity-60">
                            <div className="h-1.5 bg-white/30 rounded w-3/4" />
                            <div className="h-1 bg-white/15 rounded w-1/2" />
                          </div>
                        </div>
                        <span className="text-[11px] font-bold text-[#ffc21a] bg-[#ffc21a]/10 border border-[#ffc21a]/20 px-3 py-0.5 rounded-full mt-3 flex items-center gap-1">
                          <Megaphone className="w-3 h-3" />
                          <span>Bars &amp; Modal Popups</span>
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#22c55e]/10 border border-[#22c55e]/25 text-[#22c55e] text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#22c55e] animate-ping" />
                              Ready
                            </span>
                            <span className="text-[11px] font-bold text-[#9a9aa3] bg-white/[0.05] border border-white/[0.08] px-2.5 py-0.5 rounded-full">
                              12 Pro presets
                            </span>
                          </div>
                          <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase mb-1">
                            Promotions &amp; Conversion
                          </p>
                          <h3 className="flex items-center gap-2.5 text-lg font-black text-white mb-2">
                            <span className="w-7 h-7 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                              <Megaphone className="w-4 h-4" />
                            </span>
                            <span>Announcement &amp; Popup</span>
                          </h3>
                          <p className="text-xs text-[#9a9aa3] leading-relaxed mb-4">
                            Sticky top/bottom notification bars and modal popups with live countdown, exit-intent triggers, discount codes and scheduling.
                          </p>
                        </div>

                        <div className="pt-4 mt-2 border-t border-white/[0.06] flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleCreateAnnouncement("bar")}
                            className="flex-1 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md shadow-[#ffc21a]/20 hover:opacity-95 transition flex items-center justify-center gap-2 cursor-pointer"
                          >
                            <span>Choose widget</span>
                            <span className="text-sm">→</span>
                          </button>
                        </div>
                      </div>
                    </article>
                  )}

                  {/* WhatsApp Live Chat (Coming soon preview) */}
                  {filterMatches("support", "whatsapp live chat") && (
                    <article className="rounded-2xl bg-[#151518] border border-white/[0.08] hover:border-white/20 transition overflow-hidden flex flex-col justify-between group shadow-lg">
                      <div className="relative h-44 bg-[radial-gradient(ellipse_at_50%_120%,rgba(37,211,102,0.12),transparent_60%),linear-gradient(180deg,#1a1a1f,#141417)] border-b border-white/[0.07] flex flex-col items-center justify-center p-4">
                        <div className="w-[210px] rounded-xl overflow-hidden bg-[#1f1f25] border border-white/10 shadow-xl pb-2">
                          <div className="flex items-center gap-2 px-3 py-2 bg-[#075e54]">
                            <span className="w-5 h-5 rounded-full bg-[#25d366] text-black font-extrabold text-[10px] flex items-center justify-center">
                              W
                            </span>
                            <div>
                              <strong className="block text-[11px] font-bold text-white leading-tight">Support</strong>
                              <small className="block text-[9px] text-[#a7f3d0] leading-tight">● Online</small>
                            </div>
                          </div>
                          <p className="m-2 p-1.5 rounded-lg bg-[#2a2a31] text-[10px] text-white w-fit">
                            Hi there 👋 How can we help?
                          </p>
                        </div>

                        <span className="absolute right-4 bottom-3 w-9 h-9 rounded-full bg-[#25d366] text-white flex items-center justify-center shadow-lg shadow-[#25d366]/40 animate-pulse">
                          <WhatsAppIcon />
                        </span>
                      </div>

                      <div className="p-5 flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-3">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/[0.06] border border-white/10 text-[#a1a1aa] text-[11px] font-semibold">
                              Coming soon
                            </span>
                          </div>
                          <p className="text-[10px] font-extrabold tracking-wider text-[#6b6b74] uppercase mb-1">
                            Chat &amp; Contact
                          </p>
                          <h3 className="flex items-center gap-2.5 text-lg font-black text-white mb-2">
                            <span className="w-7 h-7 rounded-lg bg-[#25d366]/15 border border-[#25d366]/30 text-[#25d366] flex items-center justify-center">
                              <WhatsAppIcon />
                            </span>
                            <span>WhatsApp Live Chat</span>
                          </h3>
                          <p className="text-xs text-[#9a9aa3] leading-relaxed mb-4">
                            Floating WhatsApp button with custom greeting, avatar and pre-filled messages that turn visitors into phone leads.
                          </p>
                        </div>

                        <div className="pt-4 mt-2 border-t border-white/[0.06]">
                          <button
                            type="button"
                            onClick={() => {
                              const item = CATALOG_WIDGETS.find((w) => w.id === "whatsapp_chat");
                              if (item) setComingSoonModalWidget(item);
                            }}
                            className="w-full py-2.5 px-3 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-dashed border-white/10 hover:border-[#ffc21a]/40 text-[#9a9aa3] hover:text-white font-bold text-xs transition cursor-pointer"
                          >
                            🔔 Notify me when ready
                          </button>
                        </div>
                      </div>
                    </article>
                  )}
                </div>
              )}
            </section>
          )}


          {/* ================= ACTIVE VIEW ================= */}
          {viewMode === "active" && (
            <section className="space-y-4">
              <div className="rounded-2xl bg-[#151518] border border-white/[0.08] overflow-hidden shadow-xl">
                <div className="flex items-center justify-between gap-4 p-5 border-b border-white/[0.07]">
                  <div>
                    <h2 className="text-lg font-bold text-white">My active widgets</h2>
                    <p className="text-xs text-[#9a9aa3]">Widgets currently embedded on your websites.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setViewMode("catalog")}
                    className="py-2 px-3.5 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs shadow-md transition cursor-pointer"
                  >
                    + Add widget
                  </button>
                </div>

                {loading ? (
                  <div className="py-12 text-center text-[#9a9aa3]">
                    <div className="w-8 h-8 border-2 border-[#ffc21a] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                    Loading your widgets…
                  </div>
                ) : widgets.length === 0 ? (
                  <div className="p-10 text-center space-y-3">
                    <p className="text-sm text-[#9a9aa3]">
                      You don&apos;t have any widgets yet. Create one from the catalog to see it here!
                    </p>
                    <button
                      type="button"
                      onClick={() => setViewMode("catalog")}
                      className="py-2 px-4 rounded-xl bg-[#ffc21a] text-[#1a1400] font-bold text-xs inline-flex cursor-pointer"
                    >
                      Browse Widget Catalog →
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-white/[0.06] text-[11px] font-bold uppercase tracking-wider text-[#6b6b74]">
                          <th className="py-3 px-5">Widget</th>
                          <th className="py-3 px-5">Website / ID</th>
                          <th className="py-3 px-5">Views</th>
                          <th className="py-3 px-5">Status</th>
                          <th className="py-3 px-5">Active</th>
                          <th className="py-3 px-5 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/[0.04]">
                        {widgets.map((w, idx) => {
                          const isCountdown = w.type === "countdown";
                          const isAnnouncement = w.type === "announcement_popup";
                          const isFaq = w.type === "faq_accordion";
                          const isPublished = w.status === "published";
                          const isEnabled = w.enabled !== false;
                          const viewsCount = 1200 + ((idx * 840) % 5000);
                          const studioRoute = isCountdown
                            ? `/dashboard/widgets/countdown/${w.id}`
                            : isAnnouncement
                            ? `/dashboard/widgets/announcement-popup/${w.id}`
                            : isFaq
                            ? `/dashboard/widgets/faq-accordion/${w.id}`
                            : `/dashboard/widgets/google-reviews/${w.id}`;

                          return (
                            <tr key={w.id} className="hover:bg-white/[0.02] transition">
                              <td className="py-3.5 px-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-lg bg-[#ffc21a]/10 border border-[#ffc21a]/20 flex items-center justify-center shrink-0 text-[#ffc21a]">
                                    {isCountdown ? (
                                      <Clock className="w-4 h-4" />
                                    ) : isAnnouncement ? (
                                      <Megaphone className="w-4 h-4" />
                                    ) : isFaq ? (
                                      <HelpCircle className="w-4 h-4 text-sky-400" />
                                    ) : (
                                      <GoogleIcon className="w-4 h-4" />
                                    )}
                                  </div>
                                  <div>
                                    <strong className="block text-sm font-bold text-white leading-tight">
                                      {w.name}
                                    </strong>
                                    <small className="block text-[11px] text-[#6b6b74] leading-tight">
                                      {isCountdown
                                        ? "Countdown Timer"
                                        : isAnnouncement
                                        ? "Announcement & Popup"
                                        : isFaq
                                        ? "FAQ Accordion"
                                        : "Google Reviews"}
                                    </small>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-5 font-mono text-[11px] text-[#9a9aa3]">
                                {w.id}
                              </td>

                              <td className="py-3.5 px-5 font-bold text-white">
                                {viewsCount.toLocaleString()}
                              </td>

                              <td className="py-3.5 px-5">
                                <span
                                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                                    isPublished
                                      ? "bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/25"
                                      : "bg-white/[0.06] text-[#9a9aa3]"
                                  }`}
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      isPublished ? "bg-[#22c55e]" : "bg-[#9a9aa3]"
                                    }`}
                                  />
                                  {isPublished ? "Live" : "Draft"}
                                </span>
                              </td>

                              {/* Turn ON/OFF Switch */}
                              <td className="py-3.5 px-5">
                                <div className="flex items-center gap-2">
                                  <button
                                    type="button"
                                    role="switch"
                                    aria-checked={isEnabled}
                                    onClick={() => handleToggleWidgetActive(w)}
                                    className={`relative inline-flex h-5 w-10 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                      isEnabled ? "bg-[#22c55e]" : "bg-zinc-700"
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
                                      isEnabled ? "text-[#22c55e]" : "text-zinc-500"
                                    }`}
                                  >
                                    {isEnabled ? "ON" : "OFF"}
                                  </span>
                                </div>
                              </td>

                              <td className="py-3.5 px-5 text-right">
                                <div className="inline-flex items-center gap-1.5 justify-end">
                                  <button
                                    type="button"
                                    onClick={() => setEmbedModalWidget(w)}
                                    className="px-2.5 py-1.5 rounded-lg bg-[#1f1f25] hover:bg-[#282830] border border-white/10 text-white font-bold text-xs transition cursor-pointer flex items-center gap-1.5"
                                  >
                                    <Code2 className="w-3.5 h-3.5 text-[#ffc21a]" />
                                    <span>Embed</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => navigate({ to: studioRoute as any })}
                                    className="p-1.5 rounded-lg bg-[#ffc21a] hover:bg-[#ffc21a]/90 text-[#1a1400] transition cursor-pointer"
                                    title="Edit in Studio"
                                  >
                                    <Edit3 className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDuplicate(w.id)}
                                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-[#9a9aa3] hover:text-white transition cursor-pointer"
                                    title="Duplicate"
                                  >
                                    <Copy className="w-3.5 h-3.5" />
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => handleDelete(w.id, w.name)}
                                    className="p-1.5 rounded-lg bg-white/[0.04] hover:bg-red-500/10 text-[#9a9aa3] hover:text-red-400 transition cursor-pointer"
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
            </section>
          )}
        </>
      )}

      {/* ================= EMBED CODE MODAL ================= */}
      {embedModalWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#111114] border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.8)] overflow-hidden">

            {/* Glow accent bar */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffc21a]/60 to-transparent" />

            {/* Header */}
            <div className="px-8 pt-8 pb-6 border-b border-white/[0.06]">
              <button
                type="button"
                className="absolute top-5 right-5 p-2 rounded-xl text-[#9a9aa3] hover:text-white hover:bg-white/[0.07] transition cursor-pointer"
                onClick={() => setEmbedModalWidget(null)}
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ffc21a]/20 to-[#ff9f0a]/10 border border-[#ffc21a]/25 flex items-center justify-center text-[#ffc21a] shadow-lg shadow-[#ffc21a]/10">
                  <Code2 className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="text-2xl font-black text-white tracking-tight">Embed your widget</h3>
                  <p className="text-sm text-[#9a9aa3] mt-0.5">Drop one snippet — works everywhere.</p>
                </div>
              </div>

              {/* Platform badges */}
              <div className="flex flex-wrap gap-2 mt-1">
                {["WordPress", "Shopify", "Webflow", "Wix", "Custom HTML"].map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded-lg bg-white/[0.05] border border-white/[0.08] text-[11px] font-semibold text-[#9a9aa3]">
                    {p}
                  </span>
                ))}
              </div>
            </div>

            {/* Code block */}
            <div className="px-8 py-6">
              <div className="relative group rounded-2xl bg-[#0a0a0c] border border-white/[0.07] overflow-hidden">
                {/* Top bar */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
                    <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
                    <span className="w-3 h-3 rounded-full bg-[#28c840]" />
                  </div>
                  <span className="text-[11px] font-mono text-[#9a9aa3]/60 tracking-widest uppercase">HTML Snippet</span>
                  <div className="w-16" />
                </div>

                {/* Code content */}
                <pre className="px-6 py-5 overflow-x-auto text-sm font-mono text-[#a8d8a8] leading-7 whitespace-pre-wrap break-all">
                  <code>{embedCodeString}</code>
                </pre>
              </div>
            </div>

            {/* Footer actions */}
            <div className="px-8 pb-8 flex items-center gap-3">
              <button
                type="button"
                onClick={copyEmbedCode}
                className="flex-1 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-sm shadow-lg shadow-[#ffc21a]/20 hover:shadow-[#ffc21a]/40 hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2.5 cursor-pointer"
              >
                {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                <span>{copied ? "Copied!" : "Copy code"}</span>
              </button>
              <button
                type="button"
                onClick={() => setEmbedModalWidget(null)}
                className="py-3.5 px-6 rounded-2xl bg-white/[0.05] border border-white/[0.1] text-white font-bold text-sm hover:bg-white/[0.09] active:scale-[0.98] transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= DELETE CONFIRMATION MODAL ================= */}
      {deletingWidget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-md p-6 rounded-2xl bg-[#151518] border border-white/10 shadow-2xl shadow-black/80 transform scale-100 transition-all">
            {/* Close button */}
            <button
              type="button"
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#9a9aa3] hover:text-white hover:bg-white/[0.06] transition cursor-pointer"
              onClick={() => !isDeleting && setDeletingWidget(null)}
              aria-label="Close"
              disabled={isDeleting}
            >
              <X className="w-4 h-4" />
            </button>

            {/* Glowing Icon Header */}
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 text-red-400 shadow-lg shadow-red-500/5">
              <Trash2 className="w-6 h-6 stroke-[2.2]" />
            </div>

            {/* Modal Content */}
            <h3 className="text-lg font-black text-white tracking-tight">Delete Widget</h3>
            <p className="text-xs text-[#9a9aa3] mt-2 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-white">&quot;{deletingWidget.name}&quot;</span>?
            </p>
            <p className="text-[11px] text-zinc-500 mt-1 leading-normal">
              This action cannot be undone. Any live site embedding this widget will no longer display it.
            </p>

            {/* Modal Actions */}
            <div className="flex items-center gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeletingWidget(null)}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#1f1f25] border border-white/10 text-white font-bold text-xs hover:bg-[#282830] transition cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="flex-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-xs shadow-lg shadow-red-600/30 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#111114] border border-white/[0.1] shadow-[0_32px_80px_rgba(0,0,0,0.85)] overflow-hidden">
            {/* Accent glow bar */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ffc21a]/80 to-transparent" />

            {/* Close button */}
            <button
              type="button"
              onClick={() => setComingSoonModalWidget(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-[#9a9aa3] hover:text-white hover:bg-white/[0.07] transition cursor-pointer"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-6 sm:p-7 space-y-5">
              {/* Header with Icon, Title, and Badge */}
              <div className="flex items-center gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-lg ${comingSoonModalWidget.iconBgClass}`}
                >
                  {renderItemIcon(comingSoonModalWidget.iconType)}
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-xl font-black text-white tracking-tight truncate">
                      {comingSoonModalWidget.title}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ffc21a]/15 text-[#ffc21a] border border-[#ffc21a]/30 shrink-0">
                      Coming Soon
                    </span>
                  </div>
                  <p className="text-xs text-[#9a9aa3] mt-1 leading-relaxed">
                    {comingSoonModalWidget.description}
                  </p>
                </div>
              </div>

              {/* Planned Features */}
              <div className="rounded-2xl bg-white/[0.03] border border-white/[0.06] p-4 space-y-2.5">
                <h4 className="text-[11px] font-bold text-white uppercase tracking-wider text-[#9a9aa3]">
                  Planned Features for Release
                </h4>
                <ul className="space-y-2">
                  {comingSoonModalWidget.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-xs text-zinc-300">
                      <span className="text-[#22c55e] font-bold mt-0.5">✓</span>
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Priority Waitlist Form */}
              <div className="rounded-2xl bg-gradient-to-br from-[#1a1811] to-[#141419] border border-[#ffc21a]/20 p-4 space-y-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-[#ffc21a]" />
                  <h4 className="text-xs font-black text-white">Get Priority Early Access</h4>
                </div>
                <p className="text-[11px] text-[#9a9aa3] leading-relaxed">
                  Be the first to test this widget when the beta drops. We&apos;ll notify you with an instant activation link.
                </p>

                <form onSubmit={handleNotifySubmit} className="flex gap-2">
                  <input
                    type="email"
                    value={notifyEmail}
                    onChange={(e) => setNotifyEmail(e.target.value)}
                    placeholder="Enter your email for notification..."
                    className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder:text-zinc-500 outline-none focus:border-[#ffc21a]"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#ffc21a] to-[#ff9f0a] text-[#1a1400] font-black text-xs hover:opacity-95 shadow-md transition cursor-pointer shrink-0"
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
                  className="text-xs text-[#9a9aa3] hover:text-white transition cursor-pointer"
                >
                  ← Back to Catalog
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setComingSoonModalWidget(null);
                    setSelectedCategory("urgency");
                  }}
                  className="text-xs font-bold text-[#ffc21a] hover:underline transition cursor-pointer"
                >
                  Explore Ready Widgets →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
