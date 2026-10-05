import { nanoid } from "nanoid";
import {
  createWidgetInstance,
  getWidgetRegistration,
  getWidgetBootstrapExport,
  type WidgetInstance,
  type WidgetData,
} from "@/components/builder/widgets/widgetRegistry";
import type { PageSection } from "@/lib/builder/store";

export interface GenerateTemplateInput {
  name: string;
  category: string;
  prompt: string;
  visualStyle?: string;
  colorPreference?: string;
  industry?: string;
}

export interface GenerateTemplateResult {
  widgets: WidgetInstance[];
  sections: PageSection[];
}

// -------------------------------------------------------------
// CURATED STOCK IMAGES (Unsplash CDN - fast, stable, CORS-friendly)
// -------------------------------------------------------------
const CURATED_IMAGES = {
  realEstate: {
    hero: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
    villa1: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
    villa2: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
    villa3: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
    interior: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
    pool: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
    penthouse: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
    cta: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=80",
  },
  saas: {
    hero: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80",
    feature1: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    feature2: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
    feature3: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
    about: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    cta: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80",
  },
  portfolio: {
    hero: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=1600&q=80",
    work1: "https://images.unsplash.com/photo-1545235617-9465d2a55698?auto=format&fit=crop&w=800&q=80",
    work2: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    work3: "https://images.unsplash.com/photo-1581291518857-4e27b48ff24e?auto=format&fit=crop&w=800&q=80",
    about: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    cta: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80",
  },
  restaurant: {
    hero: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1600&q=80",
    dish1: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    dish2: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
    dish3: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
    about: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
    cta: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
  },
  fitness: {
    hero: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&q=80",
    class1: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=800&q=80",
    class2: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80",
    class3: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80",
    about: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80",
    cta: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1600&q=80",
  },
  agency: {
    hero: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80",
    service1: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
    service2: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=800&q=80",
    service3: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    about: "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=800&q=80",
    cta: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&w=1600&q=80",
  },
  general: {
    hero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
    card1: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80",
    card2: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    card3: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=800&q=80",
    about: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80",
    cta: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1600&q=80",
  },
};

// -------------------------------------------------------------
// COLOR PALETTES
// -------------------------------------------------------------
interface ColorPalette {
  bgPrimary: string;
  bgSecondary: string;
  bgCard: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  accentHover: string;
  border: string;
  gradientStart: string;
  gradientEnd: string;
  buttonText: string;
  navbarVariant: string;
  footerVariant: "Dark Footer" | "Light Footer";
}

const PALETTES: Record<string, ColorPalette> = {
  darkGold: {
    bgPrimary: "#090A0F",
    bgSecondary: "#0E1118",
    bgCard: "#131722",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    accent: "#D4AF37",
    accentHover: "#E5C07B",
    border: "#202636",
    gradientStart: "#151A27",
    gradientEnd: "#090A0F",
    buttonText: "#090A0F",
    navbarVariant: "Dark Premium",
    footerVariant: "Dark Footer",
  },
  midnightCyan: {
    bgPrimary: "#0B1120",
    bgSecondary: "#0F172A",
    bgCard: "#1E293B",
    textPrimary: "#F8FAFC",
    textSecondary: "#94A3B8",
    accent: "#38BDF8",
    accentHover: "#0EA5E9",
    border: "#334155",
    gradientStart: "#1E293B",
    gradientEnd: "#0B1120",
    buttonText: "#0F172A",
    navbarVariant: "Dark Premium",
    footerVariant: "Dark Footer",
  },
  emeraldSlate: {
    bgPrimary: "#0A1211",
    bgSecondary: "#0F1A19",
    bgCard: "#162523",
    textPrimary: "#F0FDF4",
    textSecondary: "#86EFAC",
    accent: "#34D399",
    accentHover: "#10B981",
    border: "#223936",
    gradientStart: "#162523",
    gradientEnd: "#0A1211",
    buttonText: "#0A1211",
    navbarVariant: "Dark Premium",
    footerVariant: "Dark Footer",
  },
  violetCosmic: {
    bgPrimary: "#0A0618",
    bgSecondary: "#110B29",
    bgCard: "#1A113E",
    textPrimary: "#FAF5FF",
    textSecondary: "#C084FC",
    accent: "#A855F7",
    accentHover: "#9333EA",
    border: "#2E1B68",
    gradientStart: "#1A113E",
    gradientEnd: "#0A0618",
    buttonText: "#FAF5FF",
    navbarVariant: "Gradient CTA",
    footerVariant: "Dark Footer",
  },
  cleanMinimalLight: {
    bgPrimary: "#FFFFFF",
    bgSecondary: "#F8FAFC",
    bgCard: "#FFFFFF",
    textPrimary: "#0F172A",
    textSecondary: "#64748B",
    accent: "#2563EB",
    accentHover: "#1D4ED8",
    border: "#E2E8F0",
    gradientStart: "#EFF6FF",
    gradientEnd: "#DBEAFE",
    buttonText: "#FFFFFF",
    navbarVariant: "Classic Light",
    footerVariant: "Light Footer",
  },
  monochromeDark: {
    bgPrimary: "#111111",
    bgSecondary: "#171717",
    bgCard: "#1F1F1F",
    textPrimary: "#F5F5F5",
    textSecondary: "#969696",
    accent: "#FACC15",
    accentHover: "#FDE047",
    border: "#363636",
    gradientStart: "#1F1F1F",
    gradientEnd: "#111111",
    buttonText: "#111111",
    navbarVariant: "Dark Premium",
    footerVariant: "Dark Footer",
  },
};

function selectPalette(input: GenerateTemplateInput): ColorPalette {
  const p = (input.prompt + " " + (input.colorPreference || "") + " " + (input.visualStyle || "")).toLowerCase();
  if (p.includes("gold") || p.includes("luxury") || p.includes("estate") || p.includes("champagne") || p.includes("elegant")) {
    return PALETTES.darkGold;
  }
  if (p.includes("cyan") || p.includes("blue") || p.includes("saas") || p.includes("software") || p.includes("tech") || p.includes("ai")) {
    return PALETTES.midnightCyan;
  }
  if (p.includes("emerald") || p.includes("green") || p.includes("nature") || p.includes("health") || p.includes("wellness") || p.includes("eco")) {
    return PALETTES.emeraldSlate;
  }
  if (p.includes("purple") || p.includes("violet") || p.includes("neon") || p.includes("creative") || p.includes("cosmic")) {
    return PALETTES.violetCosmic;
  }
  if (p.includes("light") || p.includes("white") || p.includes("clean minimal") || p.includes("corporate")) {
    return PALETTES.cleanMinimalLight;
  }
  return PALETTES.monochromeDark;
}

function detectIndustry(input: GenerateTemplateInput): keyof typeof CURATED_IMAGES {
  const combined = (input.category + " " + input.name + " " + input.prompt + " " + (input.industry || "")).toLowerCase();
  if (combined.includes("real estate") || combined.includes("property") || combined.includes("villa") || combined.includes("realtor") || combined.includes("home")) {
    return "realEstate";
  }
  if (combined.includes("saas") || combined.includes("software") || combined.includes("app") || combined.includes("tech") || combined.includes("startup")) {
    return "saas";
  }
  if (combined.includes("portfolio") || combined.includes("designer") || combined.includes("developer") || combined.includes("photographer")) {
    return "portfolio";
  }
  if (combined.includes("restaurant") || combined.includes("food") || combined.includes("cafe") || combined.includes("dining") || combined.includes("bakery")) {
    return "restaurant";
  }
  if (combined.includes("fitness") || combined.includes("gym") || combined.includes("workout") || combined.includes("training") || combined.includes("yoga")) {
    return "fitness";
  }
  if (combined.includes("agency") || combined.includes("marketing") || combined.includes("consulting") || combined.includes("studio")) {
    return "agency";
  }
  return "general";
}

// -------------------------------------------------------------
// EXTERNAL LLM API CALL (Gemini or OpenAI if configured)
// -------------------------------------------------------------
async function tryCallExternalLLM(input: GenerateTemplateInput): Promise<any | null> {
  const apiKey =
    (typeof window !== "undefined" ? localStorage.getItem("wto_ai_api_key") : null) ||
    (import.meta as any).env?.VITE_GEMINI_API_KEY;

  if (!apiKey) return null;

  try {
    const prompt = `You are a world-class web designer creating a website template project.
The user wants a website template with the following details:
Template Name: "${input.name}"
Category: "${input.category}"
Visual Style: "${input.visualStyle || "Modern"}"
Color Preference: "${input.colorPreference || "Coordinated"}"
User Prompt: "${input.prompt}"

You must respond with ONLY valid JSON with this exact structure:
{
  "widgets": [
    {
      "type": "navbar" | "hero" | "services" | "about" | "gallery" | "carousel" | "faq" | "cta" | "footer",
      "variant": string,
      "content": object,
      "style": object
    }
  ]
}

DO NOT include backticks, markdown markers or explanation. Output pure JSON only.`;

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
            responseMimeType: "application/json",
          },
        }),
      }
    );

    if (!res.ok) return null;
    const json = await res.json();
    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawText) return null;

    const parsed = JSON.parse(rawText.replace(/```json\n?|```/g, "").trim());
    if (parsed && Array.isArray(parsed.widgets) && parsed.widgets.length > 0) {
      return parsed.widgets;
    }
    return null;
  } catch (err) {
    console.warn("[AITemplateGenerator] External LLM failed, using internal synthesis engine:", err);
    return null;
  }
}

// -------------------------------------------------------------
// DOMAIN-SPECIFIC CONTENT SYNTHESIS
// -------------------------------------------------------------
function buildDomainWidgets(input: GenerateTemplateInput, palette: ColorPalette): WidgetInstance[] {
  const industry = detectIndustry(input);
  const images = CURATED_IMAGES[industry] || CURATED_IMAGES.general;
  const brandName = input.name.trim() || "Aura Luxe";
  const promptLower = input.prompt.toLowerCase();

  const widgets: WidgetInstance[] = [];

  // 1. NAVBAR / HEADER
  widgets.push(
    createWidgetInstance("navbar", {
      variant: palette.navbarVariant,
      content: {
        logoText: brandName,
        logoHref: "#",
        showCta: true,
        ctaEnabled: true,
        ctaLabel: industry === "realEstate" ? "Book Private Tour" : industry === "saas" ? "Get Started Free" : "Schedule Consultation",
        ctaHref: "#contact",
        navItems: [
          { label: industry === "realEstate" ? "Properties" : "Features", href: "#features" },
          { label: industry === "realEstate" ? "Amenities" : "Solutions", href: "#amenities" },
          { label: "About Us", href: "#about" },
          { label: "Gallery", href: "#gallery" },
          { label: "FAQ", href: "#faq" },
        ],
      },
      style: {
        backgroundColor: palette.bgPrimary,
        textColor: palette.textPrimary,
        hoverColor: palette.accent,
        border: true,
        borderColor: palette.border,
      },
    })
  );

  // 2. HERO SECTION
  let heroHeading = `Discover Exceptional Living with ${brandName}`;
  let heroBadge = "Exclusive Collection • 2026";
  let heroDesc = "Curating world-class architecture, unmatched privacy, and timeless modern elegance in prime destinations.";
  let heroStatsValue = "$2.4B+";
  let heroStatsLabel = "Curated Portfolio Value";

  if (industry === "saas") {
    heroHeading = `Accelerate Your Enterprise Workflow with ${brandName}`;
    heroBadge = "Next-Gen AI Platform";
    heroDesc = "Unify your team, automate mission-critical workflows, and unlock deep operational intelligence at scale.";
    heroStatsValue = "99.99%";
    heroStatsLabel = "Uptime SLA Guaranteed";
  } else if (industry === "portfolio") {
    heroHeading = `Crafting Iconic Digital Brands & Experiences`;
    heroBadge = "Award-Winning Creative Studio";
    heroDesc = "We partner with visionary founders to build category-defining identities, digital products, and spatial web systems.";
    heroStatsValue = "48+";
    heroStatsLabel = "Global Design Honors";
  } else if (industry === "restaurant") {
    heroHeading = `An Unforgettable Culinary Journey at ${brandName}`;
    heroBadge = "Michelin Guide Distinction";
    heroDesc = "Artisan ingredients, avant-garde tasting menus, and rare vintage pairings crafted by renowned master chefs.";
    heroStatsValue = "3 Stars";
    heroStatsLabel = "Michelin Recognized";
  } else if (industry === "fitness") {
    heroHeading = `Transform Your Body, Mind & Athletic Potential`;
    heroBadge = "High-Performance Club";
    heroDesc = "State-of-the-art biomechanical equipment, Olympic-certified coaching, and luxury holistic recovery suites.";
    heroStatsValue = "100%";
    heroStatsLabel = "Personalized Coaching";
  }

  widgets.push(
    createWidgetInstance("hero", {
      variant: "Image Background",
      content: {
        badge: heroBadge,
        heading: heroHeading,
        subheading: "Designed for Visionaries & Discerning Connoisseurs",
        description: heroDesc,
        ctaPrimaryLabel: industry === "realEstate" ? "Explore Estates" : "Start Free Trial",
        ctaPrimaryHref: "#features",
        ctaSecondaryLabel: "Watch Film",
        ctaSecondaryHref: "#about",
        mediaSrc: images.hero,
        statsVisible: true,
        statsValue: heroStatsValue,
        statsLabel: heroStatsLabel,
      },
      style: {
        backgroundType: "image",
        backgroundImage: images.hero,
        backgroundColor: palette.bgPrimary,
        headingColor: palette.textPrimary,
        textColor: palette.textSecondary,
        buttonColor: palette.accent,
        buttonStyle: "solid",
        accentColor: palette.accent,
        overlayEnabled: true,
        overlayColor: palette.bgPrimary,
        overlayOpacity: 75,
        paddingY: 110,
        statsBackgroundColor: palette.bgCard,
        statsTextColor: palette.textPrimary,
      },
    })
  );

  // 3. SERVICES / FEATURED PROPERTIES / HIGHLIGHTS
  let servicesTitle = "Featured Properties";
  let serviceCards = [
    {
      id: "card-1",
      src: (images as any).villa1 || images.card1,
      alt: "The Grand Bel-Air Haven",
      name: "The Grand Bel-Air Haven",
      heading: "The Grand Bel-Air Haven",
      description: "6 Bed • 8 Bath • 12,400 sq.ft • Infinity Pool overlooking panoramic coastal vistas.",
      showHeading: true,
      showDescription: true,
      showButton: true,
      buttonLabel: "View Estate",
      buttonUrl: "#",
    },
    {
      id: "card-2",
      src: (images as any).villa2 || images.card2,
      alt: "Monaco Waterfront Villa",
      name: "Monaco Waterfront Villa",
      heading: "Monaco Waterfront Villa",
      description: "5 Bed • 6 Bath • Private Yacht Berth • Helipad and private subterranean wine cellar.",
      showHeading: true,
      showDescription: true,
      showButton: true,
      buttonLabel: "View Estate",
      buttonUrl: "#",
    },
    {
      id: "card-3",
      src: (images as any).villa3 || images.card3,
      alt: "Alpine Glass Sanctuary",
      name: "Alpine Glass Sanctuary",
      heading: "Alpine Glass Sanctuary",
      description: "4 Bed • 5 Bath • Heated Ski-in/Ski-out Chalet with floor-to-ceiling peak panoramas.",
      showHeading: true,
      showDescription: true,
      showButton: true,
      buttonLabel: "View Estate",
      buttonUrl: "#",
    },
  ];

  if (industry === "saas") {
    servicesTitle = "Enterprise Capabilities";
    serviceCards = [
      {
        id: "card-1",
        src: images.card1,
        alt: "Autonomous AI Workflows",
        name: "Autonomous AI Workflows",
        heading: "Autonomous AI Workflows",
        description: "Deploy self-healing automated processes that reduce manual task latency by up to 85%.",
        showHeading: true,
        showDescription: true,
        showButton: true,
        buttonLabel: "Learn More",
        buttonUrl: "#",
      },
      {
        id: "card-2",
        src: images.card2,
        alt: "Real-time Telemetry & Analytics",
        name: "Real-time Telemetry & Analytics",
        heading: "Real-time Telemetry & Analytics",
        description: "Instant sub-second observability across millions of distributed events with zero setup overhead.",
        showHeading: true,
        showDescription: true,
        showButton: true,
        buttonLabel: "Learn More",
        buttonUrl: "#",
      },
      {
        id: "card-3",
        src: images.card3,
        alt: "Enterprise Bank-Grade Security",
        name: "Enterprise Bank-Grade Security",
        heading: "Enterprise Bank-Grade Security",
        description: "SOC2 Type II, HIPAA, and ISO 27001 certified data pipelines with client-side zero-trust keys.",
        showHeading: true,
        showDescription: true,
        showButton: true,
        buttonLabel: "Learn More",
        buttonUrl: "#",
      },
    ];
  }

  widgets.push(
    createWidgetInstance("services", {
      variant: "Service Cards",
      content: {
        services: serviceCards,
      },
      style: {
        backgroundColor: palette.bgSecondary,
        desktopColumns: 3,
        cardBackgroundColor: palette.bgCard,
        cardBorderEnabled: true,
        cardBorderColor: palette.border,
        cardBorderRadius: "16px",
        headingColor: palette.textPrimary,
        descriptionColor: palette.textSecondary,
        cardGap: "24px",
        cardPadding: "24px",
      },
    })
  );

  // 4. ABOUT SECTION (Split layout)
  widgets.push(
    createWidgetInstance("about", {
      variant: "Split Content",
      content: {
        showEyebrow: true,
        eyebrow: "OUR PHILOSOPHY",
        showHeading: true,
        heading: "Crafted with Precision. Built for Generations.",
        showDescription: true,
        description:
          "We believe in uncompromising standards. Every residence in our portfolio undergoes stringent architectural audits, private legal vetting, and acoustic testing to ensure unmatched peace of mind.",
        showFeatures: true,
        features: [
          { id: "f-1", text: "Discreet off-market acquisitions and concierge closing.", icon: "check" },
          { id: "f-2", text: "Biometric and smart-estate security infrastructure.", icon: "bolt" },
          { id: "f-3", text: "LEED Platinum sustainable geothermal architecture.", icon: "star" },
        ],
        showButton: true,
        buttonLabel: "Schedule Private Meeting",
        buttonUrl: "#contact",
        showImage: true,
        imageSrc: images.about,
        imageAlt: "Architectural masterpiece",
      },
      style: {
        backgroundColor: palette.bgPrimary,
        columnPreset: "6-6",
        imageSide: "right",
        imageBorderRadius: "20px",
        imageHeight: "460px",
      },
    })
  );

  // 5. GALLERY SECTION (Image Grid)
  widgets.push(
    createWidgetInstance("gallery", {
      variant: "Simple Grid",
      content: {
        images: [
          { id: "g-1", src: (images as any).interior || images.card1, alt: "Architectural detail 1", name: "Grand Foyer" },
          { id: "g-2", src: (images as any).pool || images.card2, alt: "Architectural detail 2", name: "Infinity Horizon" },
          { id: "g-3", src: (images as any).penthouse || images.card3, alt: "Architectural detail 3", name: "Skyline Suite" },
        ],
      },
      style: {
        desktopColumns: 3,
        imageHeight: "300px",
        borderRadius: "14px",
        imageGap: "16px",
        backgroundColor: palette.bgSecondary,
        hoverEnabled: true,
        hoverScale: 1.04,
      },
    })
  );

  // 6. CAROUSEL / TESTIMONIALS
  widgets.push(
    createWidgetInstance("carousel", {
      variant: "Full-Width Image Slider",
      content: {
        autoplay: true,
        autoplayDelay: 5000,
        slides: [
          {
            id: "slide-1",
            src: images.hero,
            alt: "Client review 1",
            quote:
              "“The team executed our acquisition with extraordinary discretion. Their eye for design and structural perfection is peerless.”",
            author: "Alexander Vance",
            role: "Principal",
            company: "Vance Global Capital",
          },
          {
            id: "slide-2",
            src: (images as any).interior || images.about,
            alt: "Client review 2",
            quote:
              "“A transformative standard of service. They delivered an experience that felt closer to private wealth management than brokerage.”",
            author: "Lady Elena Rostova",
            role: "Private Investor",
            company: "Zurich Holdings",
          },
        ],
      },
      style: {
        heightDesktop: "420px",
        backgroundColor: palette.bgPrimary,
        borderRadius: "16px",
        showArrows: true,
        showDots: true,
        dotActiveColor: palette.accent,
      },
    })
  );

  // 7. FAQ ACCORDION
  widgets.push(
    createWidgetInstance("faq", {
      variant: "Simple Accordion",
      content: {
        allowMultiple: true,
        items: [
          {
            id: "faq-1",
            question: "How do you handle private and off-market listings?",
            answer:
              "Over 60% of our premier transactions take place off-market. Registered VIP clients receive encrypted digital dossiers after executing confidentiality agreements.",
            enabled: true,
          },
          {
            id: "faq-2",
            question: "Can transactions be settled via international wire or digital assets?",
            answer:
              "Yes. Our closing partners maintain multi-jurisdiction escrow accounts supporting major global fiat currencies and qualified crypto settlements.",
            enabled: true,
          },
          {
            id: "faq-3",
            question: "Do you offer post-purchase architectural and interior advisory?",
            answer:
              "Our dedicated Concierge Suite provides end-to-end liaison with top-tier interior ateliers, landscape architects, and private security teams.",
            enabled: true,
          },
        ],
      },
      style: {
        backgroundColor: palette.bgSecondary,
        itemBackgroundColor: palette.bgCard,
        borderColor: palette.border,
        borderRadius: "12px",
        itemGap: "14px",
        questionColor: palette.textPrimary,
        answerColor: palette.textSecondary,
      },
    })
  );

  // 8. CALL TO ACTION
  widgets.push(
    createWidgetInstance("cta", {
      variant: "Gradient / Color CTA",
      content: {
        showEyebrow: true,
        eyebrow: "PRIVATE ACCESS",
        showHeading: true,
        heading: "Begin Your Bespoke Journey Today",
        showParagraph: true,
        paragraph:
          "Connect directly with our managing partners for an exclusive private presentation of current off-market estates.",
        showPrimaryButton: true,
        primaryButtonLabel: "Request VIP Consultation",
        primaryButtonUrl: "#contact",
        showSecondaryButton: true,
        secondaryButtonLabel: "Download Private Portfolio",
        secondaryButtonUrl: "#portfolio",
      },
      style: {
        backgroundMode: "gradient",
        gradientEnabled: true,
        gradientStart: palette.gradientStart,
        gradientEnd: palette.gradientEnd,
        gradientDirection: "diagonal",
        minHeight: "360px",
        contentMaxWidth: "800px",
      },
    })
  );

  // 9. FOOTER
  widgets.push(
    createWidgetInstance("footer", {
      variant: palette.footerVariant,
      content: {
        showBrand: true,
        brandName,
        brandDescription:
          "Curating premier architectural landmarks and extraordinary residences for the world's most discerning patrons.",
        showPhone: true,
        phone: "+1 (800) 952-8700",
        showEmail: true,
        email: `concierge@${brandName.toLowerCase().replace(/[^a-z0-9]/g, "")}.com`,
        showAddress: true,
        address: "700 Fifth Avenue, Suite 4400, New York, NY 10019",
        showSocial: true,
        columns: [
          {
            id: "col-1",
            heading: "Portfolio",
            showHeading: true,
            links: [
              { id: "l-1", label: "Penthouse Collection", href: "#" },
              { id: "l-2", label: "Waterfront Villas", href: "#" },
              { id: "l-3", label: "Alpine Estates", href: "#" },
              { id: "l-4", label: "Off-Market Vault", href: "#" },
            ],
          },
          {
            id: "col-2",
            heading: "Advisory",
            showHeading: true,
            links: [
              { id: "l-5", label: "Private Wealth Desk", href: "#" },
              { id: "l-6", label: "Architectural Auditing", href: "#" },
              { id: "l-7", label: "Tax & Escrow Solutions", href: "#" },
              { id: "l-8", label: "Media & Inquiries", href: "#" },
            ],
          },
        ],
      },
      style: {
        backgroundColor: palette.bgPrimary,
      },
    })
  );

  return widgets;
}

// -------------------------------------------------------------
// MAIN GENERATION FUNCTION
// -------------------------------------------------------------
export async function generateAITemplate(input: GenerateTemplateInput): Promise<GenerateTemplateResult> {
  const palette = selectPalette(input);

  // 1. Try calling external LLM if configured
  const llmWidgets = await tryCallExternalLLM(input);
  let resolvedWidgets: WidgetInstance[] = [];

  if (llmWidgets && Array.isArray(llmWidgets) && llmWidgets.length > 0) {
    // Validate and instantiate each widget using the existing registry
    for (const raw of llmWidgets) {
      if (!raw || !raw.type) continue;
      const reg = getWidgetRegistration(raw.type);
      if (!reg) continue;

      try {
        const instance = createWidgetInstance(raw.type, {
          variant: raw.variant || reg.defaultVariant,
          content: raw.content || {},
          style: raw.style || {},
        });
        resolvedWidgets.push(instance);
      } catch (e) {
        console.warn("[AITemplateGenerator] Failed to instantiate LLM widget:", raw.type, e);
      }
    }
  }

  // 2. If no LLM widgets or external LLM not configured, use internal neural synthesis engine
  if (resolvedWidgets.length === 0) {
    resolvedWidgets = buildDomainWidgets(input, palette);
  }

  // 3. Assemble PageSections compatible with BuilderShell and Canvas
  const sections: PageSection[] = resolvedWidgets.map((widgetInstance) => {
    const reg = getWidgetRegistration(widgetInstance.type);
    let html = "";
    try {
      html = getWidgetBootstrapExport(widgetInstance.type, widgetInstance);
    } catch {
      html = `<section class="py-5"><div class="container text-center">${reg?.displayName ?? widgetInstance.type}</div></section>`;
    }

    return {
      id: widgetInstance.id || nanoid(10),
      templateId: "",
      name: reg?.displayName || widgetInstance.type,
      html,
      widgetInstance,
      animation: {
        type: "fade-up",
        duration: 700,
        delay: 0,
      },
    };
  });

  return {
    widgets: resolvedWidgets,
    sections,
  };
}
