export type TemplateCategory = "Business" | "Portfolio" | "Freelancer" | "Agency" | "Restaurant";
export type TemplatePageType = "single-page" | "multi-page";

export const TEMPLATE_CATEGORIES: TemplateCategory[] = ["Business", "Portfolio", "Freelancer", "Agency", "Restaurant"];

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
    id: "monocraft-portfolio",
    slug: "monocraft-portfolio",
    name: "MonoCraft Portfolio",
    category: "Portfolio",
    pageType: "single-page",
    layout: { type: "custom" },
    description: "A modern dark portfolio website for designers, developers, freelancers, and creative professionals.",
    accent: grad("#2563eb", "#2563eb"),
    thumbnail: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1200&q=80",
    isPremium: false,
    tags: ["Portfolio", "Creative", "Modern", "Dark Theme"],
    author: "MonoCraft",
    version: "2.0",
    createdDate: "2026-08-24",
    updatedDate: "2026-08-24",
    globalCss: `
      html { scroll-behavior: smooth; }
      body { background: #0a0a0a; color: #f8fafc; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
      section { position: relative; }
      h1, h2, h3, h4, h5, h6 { color: #f8fafc; }
      p { color: #a0a0a0; }
      .wto-progress { position: relative; }
      .wto-progress [role="progressbar"] {
        background: rgba(255,255,255,.08) !important;
        height: 10px !important;
        border-radius: 999px !important;
        overflow: hidden !important;
      }
      .wto-progress [role="progressbar"] > div {
        background: #2563eb !important;
        border-radius: 999px !important;
        transition: width 700ms cubic-bezier(.2,.8,.2,1) !important;
      }
      .wto-section-hero { padding: 100px 0; background: #0a0a0a; }
      .wto-section-stats { padding: 60px 0; background: #0a0a0a; border-top: 1px solid rgba(255,255,255,.06); border-bottom: 1px solid rgba(255,255,255,.06); }
      .wto-section-about { padding: 100px 0; background: #0a0a0a; }
      .wto-section-skills { padding: 40px 0; background: #0a0a0a; }
      .wto-section-services { padding: 100px 0; background: #0a0a0a; }
      .wto-section-portfolio { padding: 100px 0; background: #0a0a0a; }
      .wto-section-blog { padding: 100px 0; background: #0a0a0a; }
      .wto-section-testimonials { padding: 100px 0; background: #0a0a0a; }
      .wto-section-contact { padding: 100px 0; background: #0a0a0a; }
      .wto-section-footer { padding: 60px 0 30px; background: #0a0a0a; border-top: 1px solid rgba(255,255,255,.06); }
    `,
    sections: [
      {
        name: "Header",
        type: "header",
        widgetType: "navbar",
        content: {
          logoText: "Persona",
          logoHref: "#home",
          navItems: [
            { label: "Home", href: "#home" },
            { label: "About Me", href: "#about" },
            { label: "Service", href: "#services" },
            { label: "Portfolio", href: "#portfolio" },
            { label: "Blog", href: "#blog" },
            { label: "Testimonials", href: "#testimonials" },
            { label: "Contact Me", href: "#contact" }
          ],
          cta: { label: "Contact Me", href: "#contact" }
        },
        style: {
          backgroundColor: "#0a0a0a",
          textColor: "#f8fafc"
        }
      },
      {
        name: "Hero",
        domId: "home",
        type: "hero",
        widgetType: "hero",
        content: {
          eyebrow: "Hello! World",
          title: "I'm Jacob M. Clark",
          subtitle: "UI UX Designer",
          body: "I help ambitious teams build modern, user-centered products with strong strategy, clean design, and reliable frontend execution.",
          primaryCta: { label: "Download Resume", href: "#" },
          secondaryCta: { label: "Hire Me", href: "#contact" },
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80"
        },
        style: {
          backgroundColor: "#0a0a0a",
          headingColor: "#f8fafc",
          textColor: "#a0a0a0"
        }
      },
      {
        name: "Statistics",
        type: "stats",
        domId: "stats",
        widgetType: "grid",
        content: {
          items: [
            { title: "5+", body: "Years Experience" },
            { title: "80+", body: "Satisfied Clients" },
            { title: "200+", body: "Projects Completed" },
            { title: "99+", body: "Reviews Given" }
          ],
          columns: 4
        },
        style: { backgroundColor: "#0a0a0a", padding: "60px 0" }
      },
      {
        name: "About Me",
        domId: "about",
        type: "about",
        widgetType: "about",
        content: {
          eyebrow: "About Me",
          title: "About Me",
          description: "Company Is An Agency Specialized In Building Brands And Startups. We Are A Team Of Cool People Learning To Develop Cool And Smart Technologies Out Of Something Simple.",
          bullets: [],
          image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80",
          showImage: true
        },
        style: { backgroundColor: "#0a0a0a", padding: "100px 0" }
      },
      {
        name: "Skill Figma",
        type: "progress",
        domId: "skill-figma",
        widgetType: "progress",
        content: { label: "Figma", value: 90, showValue: true },
        style: { backgroundColor: "#0a0a0a", padding: "3px 0" }
      },
      {
        name: "Skill Photoshop",
        type: "progress",
        domId: "skill-photoshop",
        widgetType: "progress",
        content: { label: "Adobe Photoshop", value: 85, showValue: true },
        style: { backgroundColor: "#0a0a0a", padding: "3px 0" }
      },
      {
        name: "Skill Adobe XD",
        type: "progress",
        domId: "skill-adobe-xd",
        widgetType: "progress",
        content: { label: "Adobe XD", value: 80, showValue: true },
        style: { backgroundColor: "#0a0a0a", padding: "3px 0" }
      },
      {
        name: "Skill Illustrator",
        type: "progress",
        domId: "skill-illustrator",
        widgetType: "progress",
        content: { label: "Adobe Illustrator", value: 75, showValue: true },
        style: { backgroundColor: "#0a0a0a", padding: "3px 0" }
      },
      {
        name: "Skill HTML",
        type: "progress",
        domId: "skill-html",
        widgetType: "progress",
        content: { label: "HTML/CSS", value: 90, showValue: true },
        style: { backgroundColor: "#0a0a0a", padding: "3px 0" }
      },
      {
        name: "Skill WordPress",
        type: "progress",
        domId: "skill-wordpress",
        widgetType: "progress",
        content: { label: "WordPress", value: 80, showValue: true },
        style: { backgroundColor: "#0a0a0a", padding: "3px 0" }
      },
      {
        name: "Skill PHP",
        type: "progress",
        domId: "skill-php",
        widgetType: "progress",
        content: { label: "PHP", value: 70, showValue: true },
        style: { backgroundColor: "#0a0a0a", padding: "3px 0" }
      },
      {
        name: "Skill JavaScript",
        type: "progress",
        domId: "skill-javascript",
        widgetType: "progress",
        content: { label: "JavaScript", value: 85, showValue: true },
        style: { backgroundColor: "#0a0a0a", padding: "3px 0" }
      },
      {
        name: "Services",
        domId: "services",
        type: "services",
        widgetType: "services",
        content: {
          eyebrow: "My Service",
          title: "My Service",
          items: [
            { title: "UI UX Design", body: "I am specialized in UI & UX Design.", icon: "layout" },
            { title: "Graphic Design", body: "I have good knowledge of Graphics Design.", icon: "star" },
            { title: "Development", body: "I have good knowledge Development.", icon: "code" }
          ]
        },
        style: {
          backgroundColor: "#0a0a0a",
          padding: "100px 0"
        }
      },
      {
        name: "Portfolio",
        domId: "portfolio",
        type: "portfolio",
        widgetType: "grid",
        content: {
          eyebrow: "My Portfolio",
          title: "My Portfolio",
          items: [
            { title: "Food Website Design", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", category: "Web Design", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80" },
            { title: "App Dashboard UI Design", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", category: "UI/UX Design", image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80" },
            { title: "Real Estate Website", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", category: "Web Design", image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80" }
          ],
          columns: 3
        },
        style: {
          backgroundColor: "#0a0a0a",
          padding: "100px 0"
        }
      },
      {
        name: "Blog",
        domId: "blog",
        type: "blog",
        widgetType: "grid",
        content: {
          eyebrow: "My Blog",
          title: "My Blog",
          items: [
            { title: "Mobile Mockup Design", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", category: "Design", image: "https://images.unsplash.com/photo-1512941691920-25d2dba43cbb?auto=format&fit=crop&w=800&q=80" },
            { title: "The Future Of User", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", category: "Development", image: "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=800&q=80" },
            { title: "Fast Dispath Mobile", body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", category: "Design", image: "https://images.unsplash.com/photo-1555066931-4365d440dcde?auto=format&fit=crop&w=800&q=80" }
          ],
          columns: 3
        },
        style: {
          backgroundColor: "#0a0a0a",
          padding: "100px 0"
        }
      },
      {
        name: "Testimonials",
        domId: "testimonials",
        type: "testimonials",
        widgetType: "grid",
        content: {
          eyebrow: "Customer Testimonials",
          title: "Customer Testimonials",
          items: [
            {
              title: "★★★★★\nCristina J. McDonald\nStarbucks",
              body: "He has done great work and we look forward to continuing working with him. Speedy delivery and great quality design.",
              image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80"
            },
            {
              title: "★★★★★\nCristina J. McDonald\nStarbucks",
              body: "He has done great work and we look forward to continuing working with him. Speedy delivery and great quality design.",
              image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80"
            },
            {
              title: "★★★★★\nCristina J. McDonald\nStarbucks",
              body: "He has done great work and we look forward to continuing working with him. Speedy delivery and great quality design.",
              image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80"
            }
          ],
          columns: 3
        },
        style: {
          backgroundColor: "#0a0a0a",
          padding: "100px 0"
        }
      },
      {
        name: "Contact",
        domId: "contact",
        type: "contact",
        widgetType: "grid",
        content: {
          eyebrow: "Hire Me",
          title: "Hire Me",
          items: [
            {
              title: "Hire Me",
              body: "Let's collaborate on your next project. Fill out the form below and I'll get back to you soon.",
              cta: { label: "Learn More", href: "#" }
            },
            {
              title: "Full Name *\nEmail *\nSubject\nHow Can I Help You?",
              body: "",
              cta: { label: "Send Message", href: "#contact" }
            }
          ],
          columns: 2
        },
        style: {
          backgroundColor: "#0a0a0a",
          padding: "100px 0"
        }
      },
      {
        name: "Footer",
        type: "footer",
        widgetType: "footer",
        content: {
          brand: "Persona",
          description: "© Persona 2023. All Rights Reserved",
          links: [
            { label: "Home", href: "#home" },
            { label: "About Me", href: "#about" },
            { label: "Service", href: "#services" },
            { label: "Portfolio", href: "#portfolio" },
            { label: "Blog", href: "#blog" },
            { label: "Testimonials", href: "#testimonials" },
            { label: "Contact Me", href: "#contact" }
          ],
          social: [
            { provider: "facebook", href: "https://facebook.com" },
            { provider: "twitter", href: "https://twitter.com" },
            { provider: "linkedin", href: "https://linkedin.com" },
            { provider: "github", href: "https://github.com" }
          ],
          copyright: "© Persona 2023. All Rights Reserved.",
          legal: ""
        },
        style: {
          backgroundColor: "#0a0a0a",
          textColor: "#a0a0a0"
        }
      }
    ]
  },
  {
    id: "standout-digital-marketing",
    slug: "standout-digital-marketing",
    name: "Standout Digital Marketing Agency",
    category: "Agency",
    pageType: "single-page",
    layout: { type: "custom" },
    description: "A bold digital marketing agency template with hero, services, courses, testimonials, blog, and newsletter sections.",
    accent: grad("#2F80ED", "#2F80ED"),
    thumbnail: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=1200&q=80",
    isPremium: false,
    tags: ["Agency", "Digital Marketing", "Business", "Single Page"],
    author: "Standout",
    version: "1.0",
    createdDate: "2026-08-25",
    updatedDate: "2026-08-25",
    globalCss: `
      html { scroll-behavior: smooth; }
      body { background: #FFFFFF; color: #1A1A1A; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, sans-serif; }
      section { position: relative; }
      h1, h2, h3, h4, h5, h6 { color: #1A1A1A; }
      p { color: #6B7280; }
    `,
    sections: [
      {
        name: "Header",
        type: "header",
        widgetType: "navbar",
        content: {
          logoText: "stand·ut",
          logoHref: "#home",
          logoImageSrc: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22140%22%20height%3D%2240%22%20viewBox%3D%220%200%20140%2040%22%3E%3Crect%20width%3D%2232%22%20height%3D%2232%22%20rx%3D%226%22%20fill%3D%22%232F80ED%22%2F%3E%3Cpath%20d%3D%22M10%2020L16%2012L22%2020L16%2028Z%22%20fill%3D%22white%22%2F%3E%3Ctext%20x%3D%2240%22%20y%3D%2226%22%20font-family%3D%22Arial%2Csans-serif%22%20font-size%3D%2218%22%20font-weight%3D%22700%22%20fill%3D%22%231A1A1A%22%3Estand%C2%B7ut%3C%2Ftext%3E%3C%2Fsvg%3E",
          navItems: [
            { label: "Home", href: "#home" },
            { label: "Services", href: "#services" },
            { label: "Resources", href: "#resources" },
            { label: "Pages", href: "#pages" },
            { label: "Blog", href: "#blog" },
            { label: "Shop", href: "#shop" },
            { label: "Elements", href: "#elements" }
          ],
          showCta: true,
          ctaEnabled: true,
          ctaLabel: "Appointment",
          ctaHref: "#contact"
        },
        style: {
          backgroundColor: "#FFFFFF",
          textColor: "#1A1A1A",
          shadow: "sm",
          border: true,
          borderColor: "#E5E7EB"
        }
      },
      {
        name: "Hero",
        domId: "home",
        type: "hero",
        widgetType: "hero",
        content: {
          eyebrow: "CREATIVE AGENCY WITH A PASSION",
          title: "Professional Personal Digital Marketing",
          body: "We help ambitious brands build modern, user-centered digital experiences with strong strategy, clean design, and reliable execution.",
          primaryCta: { label: "Explore Now", href: "#services" },
          image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
        },
        style: {
          backgroundColor: "#000000",
          headingColor: "#FFFFFF",
          textColor: "#D1D5DB"
        }
      },
      {
        name: "Creative Services",
        domId: "services",
        type: "services",
        widgetType: "services",
        content: {
          eyebrow: "HELLO!",
          title: "We produce creative projects",
          body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tmepor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam.",
          items: [
            { title: "Online advertising campaigns", body: "Strategic online advertising campaigns designed to grow your brand visibility and drive qualified traffic." },
            { title: "Television and radio commercials", body: "Traditional media campaigns that complement digital efforts and expand reach across multiple channels." },
            { title: "Consulting service & inspirations", body: "Expert consulting and creative direction to help your team find clearer, bolder ideas faster." },
            { title: "Mobile marketing & promotions", body: "Targeted mobile-first promotions that connect with audiences wherever they are." }
          ]
        },
        style: { backgroundColor: "#F5F6F8", padding: "80px 0" }
      },
      {
        name: "About / Learning",
        domId: "about",
        type: "about",
        widgetType: "about",
        content: {
          eyebrow: "ABOUT US",
          title: "Learn new skills to go ahead for your carrer",
          description: "We can support student forum 24/7 for national and international students. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tmepor incididunt ut labore et dolore magna aliqua.",
          bullets: [],
          image: "https://images.unsplash.com/photo-1523240794352-8572bf7c6b8f?auto=format&fit=crop&w=900&q=80",
          showImage: true
        },
        style: { backgroundColor: "#FFFFFF", padding: "80px 0" }
      },
      {
        name: "Press & Awards",
        domId: "brand-strip",
        type: "brand-strip",
        widgetType: "grid",
        content: {
          eyebrow: "PRESS & AWARDS",
          items: [
            { image: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%2240%22%20viewBox%3D%220%200%20120%2040%22%3E%3Crect%20width%3D%22120%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20fill%3D%22%23374151%22%3EEmpact%20100%3C%2Ftext%3E%3C%2Fsvg%3E", alt: "Empact 100" },
            { image: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%2240%22%20viewBox%3D%220%200%20120%2040%22%3E%3Crect%20width%3D%22120%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20fill%3D%22%23374151%22%3EInc.%3C%2Ftext%3E%3C%2Fsvg%3E", alt: "Inc." },
            { image: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%2240%22%20viewBox%3D%220%200%20120%2040%22%3E%3Crect%20width%3D%22120%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20fill%3D%22%23374151%22%3EForbes%3C%2Ftext%3E%3C%2Fsvg%3E", alt: "Forbes" },
            { image: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%2240%22%20viewBox%3D%220%200%20120%2040%22%3E%3Crect%20width%3D%22120%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20fill%3D%22%23374151%22%3ECNN%3C%2Ftext%3E%3C%2Fsvg%3E", alt: "CNN" },
            { image: "data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22120%22%20height%3D%2240%22%20viewBox%3D%220%200%20120%2040%22%3E%3Crect%20width%3D%22120%22%20height%3D%2240%22%20rx%3D%224%22%20fill%3D%22%23f3f4f6%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20text-anchor%3D%22middle%22%20dy%3D%22.3em%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20font-weight%3D%22700%22%20fill%3D%22%23374151%22%3E30%20Under%2030%3C%2Ftext%3E%3C%2Fsvg%3E", alt: "30 Under 30" }
          ],
          columns: 5
        },
        style: { backgroundColor: "#FFFFFF", padding: "40px 0", borderTop: "1px solid #E5E7EB" }
      },
      {
        name: "Big Data Analytics CTA",
        domId: "cta-analytics",
        type: "cta",
        widgetType: "cta",
        content: {
          eyebrow: "Big Data Analytics",
          title: "We Provide Big Data Analytics & Data Solutions",
          body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tmepor",
          primaryCta: { label: "Get Started", href: "#contact" },
          image: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1600&q=80"
        },
        style: {
          backgroundColor: "#000000",
          textColor: "#FFFFFF",
          padding: "80px 0"
        }
      },
      {
        name: "Online Courses",
        domId: "courses",
        type: "courses",
        widgetType: "grid",
        content: {
          eyebrow: "DISCOVER COURSES",
          title: "Our popular online courses",
          items: [
            { title: "Information About UI/UX Design Degree", image: "https://images.unsplash.com/photo-1586717791821-3f44a5638d48?auto=format&fit=crop&w=800&q=80", instructor: "David Warner", instructorImage: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80", students: "2 students", lessons: "5 lessons", price: "$188" },
            { title: "React - The Complete Guide (React Router)", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80", instructor: "David Warner", instructorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80", students: "2 students", lessons: "10 lessons", price: "$186" },
            { title: "Certified JavaScript with Free Project Course", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80", instructor: "David Warner", instructorImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80", students: "2 students", lessons: "7 lessons", price: "$140" }
          ],
          columns: 3
        },
        style: { backgroundColor: "#FFFFFF", padding: "80px 0" }
      },
      {
        name: "Testimonials",
        domId: "testimonials",
        type: "testimonials",
        widgetType: "testimonials",
        content: {
          eyebrow: "OUR TESTIMONIALS",
          title: "Our Testimonials",
          items: [
            { name: "Mila McSabbu", role: "Freelance Designer", quote: "Lorem ipsum dolor amet, consectetur adipisicing elit, sed do eiusmod tmepor incididunt ut labore dolore aliqua.", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80" },
            { name: "Robert Fox", role: "UI/UX Designer", quote: "Lorem ipsum dolor amet, consectetur adipisicing elit, sed do eiusmod tmepor incididunt ut labore dolore aliqua.", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80" },
            { name: "Jenny Wilson", role: "Web Developer", quote: "Lorem ipsum dolor amet, consectetur adipisicing elit, sed do eiusmod tmepor incididunt ut labore dolore aliqua.", image: "https://images.unsplash.com/photo-1494790108377-be9c29a29330?auto=format&fit=crop&w=200&q=80" },
            { name: "Wade Warren", role: "Director, Technology", quote: "Lorem ipsum dolor amet, consectetur adipisicing elit, sed do eiusmod tmepor incididunt ut labore dolore aliqua.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80" },
            { name: "Savannah Nguyen", role: "Digital Marketer Agency", quote: "Lorem ipsum dolor amet, consectetur adipisicing elit, sed do eiusmod tmepor incididunt ut labore dolore aliqua.", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
            { name: "Cody Fisher", role: "Director of IT", quote: "Lorem ipsum dolor amet, consectetur adipisicing elit, sed do eiusmod tmepor incididunt ut labore dolore aliqua.", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80" }
          ]
        },
        style: { backgroundColor: "#F5F6F8", padding: "80px 0", textAlign: "center" }
      },
      {
        name: "Latest News",
        domId: "blog",
        type: "grid",
        widgetType: "grid",
        content: {
          eyebrow: "Our Latest Blog",
          title: "Our Latest News",
          items: [
            { title: "Experts Global Digital During Developments", body: "August 2, 2023", image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80" },
            { title: "Creating To Continues Test Workflow Using GitHub", body: "August 5, 2023", image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80" },
            { title: "Standardizing And Beyond The Past Present...", body: "August 9, 2023", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80" }
          ],
          columns: 3
        },
        style: { backgroundColor: "#FFFFFF", padding: "80px 0", textAlign: "center" }
      },
      {
        name: "Newsletter",
        domId: "newsletter",
        type: "newsletter",
        widgetType: "grid",
        content: {
          title: "Join Our Newsletter",
          body: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tmepor incididunt.",
          placeholder: "Enter Your Email Addrese",
          buttonText: "Subscribe Now"
        },
        style: { backgroundColor: "#1A1A1A", padding: "48px 0", color: "#FFFFFF" }
      }
    ],
    footer: {
      name: "Footer",
      type: "footer",
      widgetType: "footer",
      content: {
        brand: "priming",
        brandDescription: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tmepor incididunt ut labore et dolore magna aliqua.",
        social: [
          { provider: "instagram", href: "#" },
          { provider: "facebook", href: "#" },
          { provider: "twitter", href: "#" },
          { provider: "whatsapp", href: "#" }
        ],
        columns: [
          {
            title: "Services",
            items: [
              { label: "IT Management", href: "#it-management" },
              { label: "Trading Management", href: "#trading-management" },
              { label: "Design Management", href: "#design-management" },
              { label: "Shop Business", href: "#shop-business" },
              { label: "Support Engineer", href: "#support-engineer" }
            ]
          },
          {
            title: "Quick Links",
            items: [
              { label: "About Us", href: "#about" },
              { label: "Products", href: "#products" },
              { label: "Pages", href: "#pages" },
              { label: "Shop", href: "#shop" },
              { label: "Contact", href: "#contact" }
            ]
          },
          {
            title: "Contact",
            items: [
              { text: "Location: 3064/3065 Silver Bussiness Point Utran Surat" },
              { text: "Email: info@lathiyasolutions.com" },
              { text: "Phone: +91 78785 35701" }
            ]
          }
        ],
        legal: "© 2022 priming. All Rights Reserved.",
        links: [
          { label: "Terms & Conditions", href: "#terms" },
          { label: "Privacy Policy", href: "#privacy" }
        ]
      },
      style: {
        backgroundColor: "#111111",
        textColor: "#D1D5DB"
      }
    }
  }
];
