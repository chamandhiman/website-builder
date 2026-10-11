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
  SAFFRON_RESTAURANT_ASSETS,
  SAFFRON_GLOBAL_CSS,
  SAFFRON_SECTIONS,
  SAFFRON_HOME_PAGE,
  BEAUTY_SALON_ASSETS,
  BEAUTY_PROJECT_ASSETS,
  ROSE_BEAUTY_GLOBAL_CSS,
  ROSE_BEAUTY_SECTIONS,
  ROSE_BEAUTY_SHARED_HEADER,
  ROSE_BEAUTY_SHARED_FOOTER,
  FLOW_YOGA_ASSETS,
  FLOW_YOGA_GLOBAL_CSS,
  FLOW_YOGA_SECTIONS,
  FLOW_YOGA_SHARED_HEADER,
  FLOW_YOGA_SHARED_FOOTER,
  NEXORA_ASSETS,
  NEXORA_GLOBAL_CSS,
  NEXORA_SECTIONS,
  NEXORA_SHARED_HEADER,
  NEXORA_SHARED_FOOTER,
} from "@/services/templateSeeds";
import { DRIVE_PRO_TEMPLATE } from "@/services/templateSeedsDrivingSchool";
import { ALL_NEW_WEBSITE_TEMPLATES } from "@/services/templateSeedsWebsites";

export interface TemplateCategoryGroup {
  id: string;
  name: string;
  subcategories: string[];
}

export const TEMPLATE_CATEGORY_GROUPS: TemplateCategoryGroup[] = [
  {
    id: "business",
    name: "Business",
    subcategories: ["Agency", "SaaS", "Startup", "Consulting", "Corporate", "IT company"],
  },
  {
    id: "personal",
    name: "Personal",
    subcategories: ["Portfolio", "Resume", "Freelancer", "Designer", "Developer"],
  },
  {
    id: "ecommerce",
    name: "Ecommerce",
    subcategories: ["Product", "Fashion", "Restaurant", "Electronics"],
  },
  {
    id: "special",
    name: "Special",
    subcategories: ["Event", "School", "Driving School", "Gym", "Real estate", "Landing page", "Blog"],
  },
];

export const TEMPLATE_CATEGORIES = [
  "All",
  // 1. Business
  "Business",
  "Agency",
  "SaaS",
  "Startup",
  "Consulting",
  "Corporate",
  "IT company",
  // 2. Personal
  "Personal",
  "Portfolio",
  "Resume",
  "Freelancer",
  "Designer",
  "Developer",
  // 3. Ecommerce
  "Ecommerce",
  "Product",
  "Fashion",
  "Restaurant",
  "Electronics",
  // 4. Special
  "Special",
  "Event",
  "School",
  "Driving School",
  "Gym",
  "Real estate",
  "Landing page",
  "Blog",
] as const;

export function matchesTemplateCategory(templateCategory: string, selectedCategory: string): boolean {
  if (!selectedCategory || selectedCategory === "All") return true;
  const tCat = (templateCategory || "").toLowerCase().trim();
  const sCat = selectedCategory.toLowerCase().trim();
  if (tCat === sCat) return true;

  // Check if selectedCategory is a parent group
  const group = TEMPLATE_CATEGORY_GROUPS.find(
    (g) => g.name.toLowerCase() === sCat || g.id === sCat
  );
  if (group) {
    if (group.subcategories.some((sub) => tCat.includes(sub.toLowerCase()))) return true;
  }

  // Cross-match variations
  if (tCat.includes(sCat) || sCat.includes(tCat)) return true;
  if (sCat === "driving school" && tCat.includes("driving")) return true;
  if (sCat === "school" && (tCat.includes("school") || tCat.includes("driving"))) return true;
  if (sCat === "restaurant" && tCat.includes("restaurant")) return true;
  if (sCat === "gym" && (tCat.includes("gym") || tCat.includes("fitness"))) return true;
  if (sCat === "real estate" && tCat.includes("real estate")) return true;
  if (sCat === "agency" && tCat.includes("agency")) return true;
  if (sCat === "saas" && tCat.includes("saas")) return true;
  if (sCat === "freelancer" && tCat.includes("freelancer")) return true;

  return false;
}

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
  domId?: string;
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
  sharedHeader?: any;
  sharedFooter?: any;
  assets?: Record<string, any>;
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
  {
    id: "tpl-saffron-ember-restaurant",
    slug: "saffron-ember-modern-indian-kitchen",
    name: "Saffron & Ember - Modern Indian Kitchen",
    category: "Restaurant & Café",
    pageType: "single-page",
    layout: { type: "custom" },
    description: "A sensory, high-converting restaurant website with a live tandoor hero, interactive menu tabs, chef signatures, bento photo gallery, and online reservations.",
    accent: grad("#e0a43a", "#c8562f"),
    thumbnail: SAFFRON_RESTAURANT_ASSETS.preview,
    isPremium: false,
    tags: ["Restaurant", "Café", "Indian Kitchen", "Food", "Menu", "Reservations", "Dark Theme"],
    author: "Super Admin",
    version: "1.0",
    createdDate: "2026-03-01",
    updatedDate: "2026-03-01",
    globalCss: SAFFRON_GLOBAL_CSS,
    sections: SAFFRON_SECTIONS.map((sec) => ({
      name: sec.name,
      type: sec.id === "sec-saffron-header" ? "header" : sec.id === "sec-saffron-footer" ? "footer" : "raw",
      content: { html: sec.html },
      html: sec.html,
    })),
    pages: [
      {
        name: "Home",
        slug: "home",
        sections: SAFFRON_SECTIONS.map((sec) => ({
          name: sec.name,
          type: sec.id === "sec-saffron-header" ? "header" : sec.id === "sec-saffron-footer" ? "footer" : "raw",
          content: { html: sec.html },
          html: sec.html,
        })),
      },
    ],
  },
  {
    id: "tpl-rose-atelier-beauty-salon",
    slug: "rose-atelier-beauty-studio",
    name: "Rosé Atelier — Hair, Skin & Beauty Studio",
    category: "Beauty & Salon",
    pageType: "single-page",
    layout: { type: "custom" },
    description: "An intimate luxury hair artistry, skin rituals, nails, and bridal glam studio template with interactive service menus, before/after compare slider, and online appointment booking.",
    accent: grad("#b5695a", "#d9a28f"),
    thumbnail: BEAUTY_SALON_ASSETS.preview,
    isPremium: false,
    tags: ["Beauty", "Salon", "Hair", "Skin", "Nails", "Spa", "Bridal", "Luxury"],
    author: "Super Admin",
    version: "1.0",
    createdDate: "2026-03-05",
    updatedDate: "2026-03-05",
    globalCss: ROSE_BEAUTY_GLOBAL_CSS,
    sharedHeader: ROSE_BEAUTY_SHARED_HEADER,
    sharedFooter: ROSE_BEAUTY_SHARED_FOOTER,
    assets: BEAUTY_PROJECT_ASSETS,
    customHead: `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
    `.trim(),
    sections: ROSE_BEAUTY_SECTIONS.map((sec) => ({
      name: sec.name,
      type: sec.id === "sec-rose-header" ? "header" : sec.id === "sec-rose-footer" ? "footer" : "raw",
      content: { html: sec.html },
      html: sec.html,
    })),
    pages: [
      {
        name: "Home",
        slug: "home",
        sections: ROSE_BEAUTY_SECTIONS.map((sec) => ({
          name: sec.name,
          type: sec.id === "sec-rose-header" ? "header" : sec.id === "sec-rose-footer" ? "footer" : "raw",
          content: { html: sec.html },
          html: sec.html,
        })),
      },
    ],
  },
  {
    id: "tpl-flow-yoga",
    slug: "flow-yoga-studio",
    name: "Flow Yoga Studio",
    category: "Fitness & Gym",
    pageType: "single-page",
    layout: { type: "custom" },
    description: "A soulful, high-converting yoga and wellness studio template with class schedule timetable, membership tiers, teacher highlights, and interactive booking.",
    accent: grad("#193832", "#cb755e"),
    thumbnail: FLOW_YOGA_ASSETS.preview,
    isPremium: true,
    tags: ["Yoga", "Fitness & Gym", "Wellness", "Pilates", "Meditation", "Schedule", "Memberships", "Studio"],
    author: "Super Admin",
    version: "1.0",
    createdDate: "2026-03-01",
    updatedDate: "2026-03-01",
    globalCss: FLOW_YOGA_GLOBAL_CSS,
    sharedHeader: FLOW_YOGA_SHARED_HEADER,
    sharedFooter: FLOW_YOGA_SHARED_FOOTER,
    assets: FLOW_YOGA_ASSETS,
    customHead: `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
    `.trim(),
    sections: FLOW_YOGA_SECTIONS.map((sec) => ({
      name: sec.name,
      type: "raw",
      content: { html: sec.html },
      html: sec.html,
    })),
    pages: [
      {
        name: "Home",
        slug: "home",
        sections: FLOW_YOGA_SECTIONS.map((sec) => ({
          name: sec.name,
          type: "raw",
          content: { html: sec.html },
          html: sec.html,
        })),
      },
    ],
  },
  {
    id: "tpl-nexora-agency",
    slug: "nexora-digital-agency",
    name: "Nexora — Creative Digital Agency",
    category: "Agency",
    pageType: "single-page",
    layout: { type: "custom" },
    description: "Cutting-edge creative IT and digital agency template for web, mobile apps, SEO, and bespoke platforms with interactive hero carousel and project portfolio.",
    accent: grad("#242044", "#6d5dfc"),
    thumbnail: NEXORA_ASSETS.preview,
    isPremium: false,
    tags: ["Agency", "Business", "IT company", "Web Design", "Development", "SEO", "Mobile apps", "Creative"],
    author: "Super Admin",
    version: "1.0",
    createdDate: "2026-03-08",
    updatedDate: "2026-03-08",
    globalCss: NEXORA_GLOBAL_CSS,
    globalJs: `
addEventListener('scroll', () => {
  const nav = document.querySelector('.navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);
});
document.querySelectorAll('.nav-link').forEach((a) => {
  a.addEventListener('click', () => {
    if (typeof window !== 'undefined' && window.bootstrap) {
      window.bootstrap.Collapse?.getOrCreateInstance?.(document.querySelector('#mainNav'))?.hide?.();
    }
  });
});
    `.trim(),
    sharedHeader: NEXORA_SHARED_HEADER,
    sharedFooter: NEXORA_SHARED_FOOTER,
    assets: NEXORA_ASSETS,
    customHead: `
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    `.trim(),
    sections: NEXORA_SECTIONS.map((sec) => ({
      name: sec.name,
      type: "raw",
      content: { html: sec.html },
      html: sec.html,
    })),
    pages: [
      {
        name: "Home",
        slug: "home",
        sections: NEXORA_SECTIONS.map((sec) => ({
          name: sec.name,
          type: "raw",
          content: { html: sec.html },
          html: sec.html,
        })),
      },
    ],
  },
  ...ALL_NEW_WEBSITE_TEMPLATES.map((t): any => ({
    id: t.id,
    slug: t.slug,
    name: t.name,
    category: t.category,
    pageType: "single-page",
    layout: { type: "custom" },
    description: t.description || "",
    accent: grad("#1e293b", "#3b82f6"),
    thumbnail: t.thumbnail || "",
    isPremium: false,
    tags: [t.category, "Modern", "Responsive"],
    author: "Super Admin",
    version: "1.0",
    createdDate: "2026-03-08",
    updatedDate: "2026-03-08",
    globalCss: t.globalCss,
    globalJs: t.globalJs,
    customHead: t.customHead,
    sharedHeader: t.sharedHeader,
    sharedFooter: t.sharedFooter,
    assets: t.assets,
    sections: (t.pages?.[0]?.sections || []).map((sec) => ({
      name: sec.name,
      type: "raw",
      content: { html: sec.html },
      html: sec.html,
    })),
    pages: (t.pages || []).map((p) => ({
      name: p.name,
      slug: p.slug,
      sections: (p.sections || []).map((sec) => ({
        name: sec.name,
        type: "raw",
        content: { html: sec.html },
        html: sec.html,
      })),
    })),
  })),
  {
    id: DRIVE_PRO_TEMPLATE.id,
    slug: DRIVE_PRO_TEMPLATE.slug,
    name: DRIVE_PRO_TEMPLATE.name,
    category: DRIVE_PRO_TEMPLATE.category,
    pageType: "multi-page",
    layout: { type: "custom" },
    description: DRIVE_PRO_TEMPLATE.description || "",
    accent: grad("#3b82f6", "#06b6d4"),
    thumbnail: DRIVE_PRO_TEMPLATE.thumbnail || "",
    isPremium: false,
    tags: ["Driving School", "Multi-Page", "Education", "Bootstrap 5", "Font Awesome"],
    author: "Super Admin",
    version: "1.0",
    createdDate: "2026-03-09",
    updatedDate: "2026-03-09",
    globalCss: DRIVE_PRO_TEMPLATE.globalCss,
    globalJs: DRIVE_PRO_TEMPLATE.globalJs,
    customHead: DRIVE_PRO_TEMPLATE.customHead,
    sharedHeader: DRIVE_PRO_TEMPLATE.sharedHeader,
    sharedFooter: DRIVE_PRO_TEMPLATE.sharedFooter,
    assets: DRIVE_PRO_TEMPLATE.assets,
    sections: (DRIVE_PRO_TEMPLATE.pages?.[0]?.sections || []).map((sec) => ({
      name: sec.name,
      type: "raw",
      content: { html: sec.html },
      html: sec.html,
    })),
    pages: (DRIVE_PRO_TEMPLATE.pages || []).map((p) => ({
      name: p.name,
      slug: p.slug,
      description: p.seo?.description,
      seo: p.seo,
      sections: (p.sections || []).map((sec) => ({
        name: sec.name,
        type: "raw",
        content: { html: sec.html },
        html: sec.html,
      })),
    })),
  },
];
