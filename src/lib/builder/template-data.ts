import {
  ASSETS,
  FREELANCER_SECTIONS,
  WELLNESS_ASSETS,
  WELLNESS_SECTIONS,
  WELLNESS_GLOBAL_CSS,
  REALESTATE_ASSETS,
  REALESTATE_GLOBAL_CSS,
  RE_HOME_PAGE,
  RE_PAGES,
} from "@/services/templateSeeds";

export const TEMPLATE_CATEGORIES = [
  "Business",
  "Agency",
  "Freelancer",
  "SaaS & Technology",
  "Healthcare",
  "Fitness & Gym",
  "Restaurant & Café",
  "Real Estate",
  "Education",
  "Driving School",
  "Beauty & Salon",
  "Construction",
  "Automotive",
  "Photography",
  "Portfolio",
  "Law Firm",
  "Finance",
  "Travel & Hotel",
  "E-commerce",
  "Personal / Resume",
] as const;

export type TemplateCategory = (typeof TEMPLATE_CATEGORIES)[number] | "Restaurant" | "Fitness" | "Health" | string;
export type TemplatePageType = "single-page" | "multi-page";

export interface TemplateSectionData {
  name: string;
  type: string;
  content: Record<string, any>;
  style?: Record<string, string>;
  className?: string;
  widgetType?: string;
  html?: string;
  layout?: Record<string, any>;
  responsive?: Record<string, any>;
  animation?: Record<string, any>;
  advanced?: Record<string, any>;
}

export interface TemplateDataDefinition {
  id: string;
  slug: string;
  name: string;
  category: TemplateCategory;
  pageType: TemplatePageType;
  layout?: Record<string, any>;
  description: string;
  accent?: string;
  thumbnail: string;
  isPremium?: boolean;
  tags: string[];
  author: string;
  version: string;
  createdDate: string;
  updatedDate: string;
  globalCss?: string;
  globalJs?: string;
  customHead?: string;
  sections?: TemplateSectionData[];
  pages?: Array<{
    name: string;
    slug: string;
    description?: string;
    keywords?: string;
    seo?: Record<string, any>;
    sections: TemplateSectionData[];
  }>;
  sharedSections?: TemplateSectionData[];
  projectSeo?: Record<string, any>;
  seo?: Record<string, any>;
}

const grad = (from: string, to: string) => `linear-gradient(135deg, ${from}, ${to})`;

export const TEMPLATE_DATA_LIBRARY: TemplateDataDefinition[] = [
  {
    id: "freelancer-creative-portfolio",
    slug: "freelancer-creative-portfolio",
    name: "Freelancer - Creative Portfolio",
    category: "Freelancer",
    pageType: "single-page",
    layout: { type: "custom" },
    description: "A premium, high-converting dark portfolio website for freelancers, designers, and developers.",
    accent: grad("#FACC15", "#EAB308"),
    thumbnail: ASSETS.heroDeveloper,
    isPremium: false,
    tags: ["Portfolio", "Freelancer", "Dark Theme", "Creative", "Developer"],
    author: "Super Admin",
    version: "1.0",
    createdDate: "2026-01-01",
    updatedDate: "2026-01-01",
    globalCss: `
      @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css");
      @import url("https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap");
      html { scroll-behavior: smooth; }
      body { background: #0B0C10; color: #FFFFFF; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
    `,
    sections: FREELANCER_SECTIONS.map((sec) => ({
      name: sec.name,
      type: "raw",
      content: { html: sec.html },
      html: sec.html,
    })),
    pages: [
      {
        name: "Home",
        slug: "home",
        sections: FREELANCER_SECTIONS.map((sec) => ({
          name: sec.name,
          type: "raw",
          content: { html: sec.html },
          html: sec.html,
        })),
      },
    ],
  },
  {
    id: "wellness-health-fitness",
    slug: "wellness-health-fitness",
    name: "WellnessLife - Health & Fitness",
    category: "Fitness",
    pageType: "single-page",
    layout: { type: "custom" },
    description: "A modern, high-converting fitness, wellness, and healthcare website with complete interactive sections and Font Awesome icons.",
    accent: grad("#FACC15", "#EAB308"),
    thumbnail: WELLNESS_ASSETS.heroFitnessWoman,
    isPremium: false,
    tags: ["Fitness", "Health", "Wellness", "Gym", "Personal Trainer", "Medical"],
    author: "Super Admin",
    version: "1.0",
    createdDate: "2026-01-01",
    updatedDate: "2026-01-01",
    globalCss: WELLNESS_GLOBAL_CSS,
    sections: WELLNESS_SECTIONS.map((sec) => ({
      name: sec.name,
      type: "raw",
      content: { html: sec.html },
      html: sec.html,
    })),
    pages: [
      {
        name: "Home",
        slug: "home",
        sections: WELLNESS_SECTIONS.map((sec) => ({
          name: sec.name,
          type: "raw",
          content: { html: sec.html },
          html: sec.html,
        })),
      },
    ],
  },
  {
    id: "tpl-dreamhome-real-estate",
    slug: "dreamhome-luxury-real-estate",
    name: "DreamHome - Luxury Real Estate",
    category: "Real Estate",
    pageType: "multi-page",
    layout: { type: "custom" },
    description: "An elegant, high-converting multi-page luxury real estate template with property listings, filters, agent profiles, services, blog, and contact forms.",
    accent: grad("#FACC15", "#EAB308"),
    thumbnail: REALESTATE_ASSETS.heroVilla,
    isPremium: false,
    tags: ["Real Estate", "Luxury", "Multi-Page", "Properties", "Villas", "Architecture"],
    author: "Super Admin",
    version: "1.0",
    createdDate: "2026-01-01",
    updatedDate: "2026-01-01",
    globalCss: REALESTATE_GLOBAL_CSS,
    sections: RE_HOME_PAGE.sections.map((sec) => ({
      name: sec.name,
      type: "raw",
      content: { html: sec.html },
      html: sec.html,
    })),
    pages: RE_PAGES.map((page) => ({
      name: page.name,
      slug: page.slug,
      sections: page.sections.map((sec) => ({
        name: sec.name,
        type: "raw",
        content: { html: sec.html },
        html: sec.html,
      })),
    })),
  },
];
