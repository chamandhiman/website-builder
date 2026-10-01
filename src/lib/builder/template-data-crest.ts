export type TemplateCategory = "Business" | "Portfolio" | "Freelancer" | "Agency" | "Restaurant";
export type TemplatePageType = "single-page" | "multi-page";

export interface TemplateSectionData {
  name: string;
  type: string;
  content: Record<string, any>;
  style?: Record<string, string>;
  className?: string;
  widgetType?: string;
}

export interface TemplatePageData {
    description: "An editorial portfolio for photographers, creatives, and boutique studios seeking a refined online presence.",
    accent: grad("#2d2a2f", "#8b7761"),
    thumbnail: "https://images.unsplash.com/photo-1505765050790-2f0a7a9f6b2a?auto=format&fit=crop&w=1200&q=80",
    pageType: "single-page",
    tags: ["Portfolio", "Creative", "Photography"],
    sections: [
      {
        name: "Header",
        type: "header",
        content: {
          brand: "Atelier Lane",
          brandHref: "#top",
          links: [
            { label: "Home", href: "#top" },
            { label: "About", href: "#about" },
            { label: "Portfolio", href: "#portfolio" },
            { label: "Services", href: "#services" },
            { label: "Journal", href: "#journal" },
            { label: "Contact", href: "#contact" }
          ],
          cta: { label: "Let's Work Together", href: "#contact" }
        },
        style: {
          transparent: "true",
          sticky: "true"
        }
      },
      {
        name: "Hero",
        type: "hero",
        content: {
          eyebrow: "",
          title: "ATELIER\nLANE",
          subtitle: "Photography & Creative Direction",
          body: "Visual stories crafted with intention, emotion and timeless detail.",
          primaryCta: { label: "View Selected Work", href: "#portfolio" },
          secondaryCta: { label: "Start a Project", href: "#contact" },
          image: "https://images.unsplash.com/photo-1504198453319-5ce911bafcde?auto=format&fit=crop&w=1600&q=80",
          layout: "asymmetric",
          eyebrowStyle: "small-caps"
        },
        style: {
          overlay: "true",
          minHeight: "760px"
        }
      },
      {
        name: "About",
        type: "about",
        content: {
          eyebrow: "Stories with a point of view.",
          title: "Atelier Lane",
          body: "Atelier Lane is an independent creative studio focused on photography, visual storytelling and art direction. We craft campaigns and imagery that feel editorial, timeless, and emotionally resonant.",
          signature: "— Jordan Lane",
          image: "https://images.unsplash.com/photo-1524253482453-3fed8d2fe12b?auto=format&fit=crop&w=1200&q=80",
          secondaryImage: "https://plus.unsplash.com/premium_photo-1723291237759-99f918377002",
          cta: { label: "Learn More", href: "#services" }
        },
        style: { padding: "80px 0" }
      },
      {
        name: "Stats",
        type: "stats",
        content: {
          items: [
            { value: "12+", label: "Years of Experience" },
            { value: "250+", label: "Projects Delivered" },
            { value: "38", label: "Global Clients" },
            { value: "96%", label: "Returning Clients" }
          ]
        },
        style: { align: "center", gap: "48px" }
      },
      {
        name: "Featured Work",
        type: "portfolio",
        content: {
          eyebrow: "Selected Work",
          title: "A collection of recent stories, campaigns and visual explorations.",
          categories: ["All", "Portraits", "Editorial", "Commercial", "Travel"],
          items: [
            { id: "proj-1", title: "Lumen House", category: "Editorial", description: "A content-led identity and campaign for a boutique hospitality concept.", image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80", href: "#" },
            { id: "proj-2", title: "Morrow Studio", category: "Portraits", description: "A refined portrait series for a contemporary design studio.", image: "https://images.unsplash.com/photo-1520975913802-3b8d0f0b0f75?auto=format&fit=crop&w=1200&q=80", href: "#" },
            { id: "proj-3", title: "Coastline", category: "Travel", description: "Documentary-style capture of coastal rituals and light.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", href: "#" },
            { id: "proj-4", title: "House of Grain", category: "Commercial", description: "Campaign imagery balancing product and lifestyle storytelling.", image: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80", href: "#" },
            { id: "proj-5", title: "Portraits in Motion", category: "Portraits", description: "A study in movement and natural light.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80", href: "#" },
            { id: "proj-6", title: "Market Days", category: "Editorial", description: "An intimate look at local markets and rituals.", image: "https://plus.unsplash.com/premium_photo-1723291237759-99f918377002", href: "#" }
          ],
          layout: "masonry",
          hover: "reveal"
        },
        style: { padding: "60px 0" }
      },
      {
        name: "Services",
        type: "services",
        content: {
          eyebrow: "Tailored for your story.",
          title: "Services",
          items: [
            { number: "01", icon: "camera", title: "Photography", description: "Custom editorial and commercial photography tailored to each brief.", cta: { label: "View details", href: "#contact" } },
            { number: "02", icon: "compass", title: "Creative Direction", description: "From concept to final frame — cohesive visual language and art direction.", cta: { label: "View details", href: "#contact" } },
            { number: "03", icon: "palette", title: "Branding", description: "Visual identity and campaign systems that support long-term recognition.", cta: { label: "View details", href: "#contact" } },
            { number: "04", icon: "users", title: "Workshops", description: "Hands-on sessions for teams and creatives focused on craft and storytelling.", cta: { label: "View details", href: "#contact" } }
          ]
        },
        style: { columns: 4, gap: "32px" }
      },
      {
        name: "Process",
        type: "process",
        content: {
          eyebrow: "From first idea to final frame.",
          title: "How We Work",
          steps: [
            { number: "01", title: "Discover", body: "Understanding the story, audience and creative direction." },
            { number: "02", title: "Define", body: "Building the visual language and production approach." },
            { number: "03", title: "Create", body: "Producing photography and creative assets." },
            { number: "04", title: "Deliver", body: "Refining, selecting and delivering the final work." }
          ]
        },
        style: { background: "transparent" }
      },
      {
        name: "Testimonials",
        type: "testimonials",
        content: {
          eyebrow: "Kind words",
          title: "Testimonials",
          items: [
            { image: "https://images.unsplash.com/photo-1546456073-6712f79251bb?auto=format&fit=crop&w=400&q=80", quote: "Working with Atelier Lane transformed our brand imagery — thoughtful and striking.", name: "Marina Gonzales", role: "Founder", company: "Hearth & Co.", rating: 5 },
            { image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", quote: "A rare combination of craft and strategic clarity.", name: "Ethan Park", role: "Creative Director", company: "Morrow Studio", rating: 5 },
            { image: "https://images.unsplash.com/photo-1545996124-7d4a3d814d62?auto=format&fit=crop&w=400&q=80", quote: "Their attention to detail elevated our campaign beyond expectations.", name: "Leah Kim", role: "Marketing Lead", company: "Lumen House", rating: 5 }
          ]
        },
        style: { cardStyle: "editorial" }
      },
      {
        name: "Clients",
        type: "clients",
        content: {
          eyebrow: "Selected Clients",
          title: "Selected Clients",
          logos: [
            { name: "Kin", image: "https://via.placeholder.com/160x64?text=Kin" },
            { name: "Hearth", image: "https://via.placeholder.com/160x64?text=Hearth" },
            { name: "Morrow", image: "https://via.placeholder.com/160x64?text=Morrow" },
            { name: "Lumen", image: "https://via.placeholder.com/160x64?text=Lumen" },
            { name: "Coastline", image: "https://via.placeholder.com/160x64?text=Coastline" },
            { name: "Studio X", image: "https://via.placeholder.com/160x64?text=Studio+X" },
            { name: "Bespoke", image: "https://via.placeholder.com/160x64?text=Bespoke" },
            { name: "Foundry", image: "https://via.placeholder.com/160x64?text=Foundry" }
          ],
          monochrome: true
        },
        style: { gap: "24px" }
      },
      {
        name: "Journal",
        type: "journal",
        content: {
          eyebrow: "From the Journal",
          title: "From the Journal",
          items: [
            { id: "post-1", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80", category: "Technique", date: "2026-06-21", title: "The Art of Natural Light", excerpt: "Observations and practical tips for working with natural light in editorial shoots.", href: "#" },
            { id: "post-2", image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=80", category: "Tips", date: "2026-05-12", title: "10 Tips for Timeless Editorial Photography", excerpt: "A concise guide to shooting imagery that feels enduring and considered.", href: "#" },
            { id: "post-3", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80", category: "Theory", date: "2026-04-02", title: "Why Storytelling Matters in Brand Photography", excerpt: "Framing projects with narrative creates stronger emotional connection and brand recall.", href: "#" }
          ]
        },
        style: { grid: 3 }
      },
      {
        name: "Contact",
        type: "contact",
        content: {
          eyebrow: "Let's create something meaningful.",
          title: "Have a project in mind? Tell us a little about it and let's start a conversation.",
          details: ["hello@atelierlane.com", "+1 (555) 123-4567", "Brooklyn, NY"],
          social: [
            { provider: "instagram", href: "https://instagram.com/atelierlane" },
            { provider: "behance", href: "#" },
            { provider: "linkedin", href: "#" }
          ],
          form: {
            fields: [
              { name: "name", label: "Name", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phone", label: "Phone", type: "tel" },
              { name: "projectType", label: "Project Type", type: "select", options: ["Editorial", "Commercial", "Branding", "Workshop"] },
              { name: "message", label: "Message", type: "textarea" }
            ],
            submit: { label: "Send Inquiry" }
          }
        },
        style: { padding: "80px 0" }
      },
      {
        name: "Footer",
        type: "footer",
        content: {
          brand: "Atelier Lane",
          description: "An independent creative studio focused on photography, visual storytelling and art direction.",
          links: [
            { label: "Portfolio", href: "#portfolio" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" }
          ],
          social: [
            { provider: "instagram", href: "https://instagram.com/atelierlane" }
          ],
          email: "hello@atelierlane.com",
          copyright: "© 2026 Atelier Lane"
        },
        style: { small: "true" }
      }
    ]
          secondaryImage: "https://plus.unsplash.com/premium_photo-1723291237759-99f918377002",
          cta: { label: "Learn More", href: "#services" }
        },
        style: { padding: "80px 0" }
      },
      {
        name: "Stats",
        type: "stats",
        content: {
          items: [
            { value: "12+", label: "Years of Experience" },
            { value: "250+", label: "Projects Delivered" },
            { value: "38", label: "Global Clients" },
            { value: "96%", label: "Returning Clients" }
          ]
        },
        style: { align: "center", gap: "48px" }
      },
      {
        name: "Featured Work",
        type: "portfolio",
        content: {
          eyebrow: "Selected Work",
          title: "A collection of recent stories, campaigns and visual explorations.",
          categories: ["All", "Portraits", "Editorial", "Commercial", "Travel"],
          items: [
            { id: "proj-1", title: "Lumen House", category: "Editorial", description: "A content-led identity and campaign for a boutique hospitality concept.", image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80", href: "#" },
            { id: "proj-2", title: "Morrow Studio", category: "Portraits", description: "A refined portrait series for a contemporary design studio.", image: "https://images.unsplash.com/photo-1520975913802-3b8d0f0b0f75?auto=format&fit=crop&w=1200&q=80", href: "#" },
            { id: "proj-3", title: "Coastline", category: "Travel", description: "Documentary-style capture of coastal rituals and light.", image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80", href: "#" },
            { id: "proj-4", title: "House of Grain", category: "Commercial", description: "Campaign imagery balancing product and lifestyle storytelling.", image: "https://images.unsplash.com/photo-1482192505345-5655af888cc4?auto=format&fit=crop&w=1200&q=80", href: "#" },
            { id: "proj-5", title: "Portraits in Motion", category: "Portraits", description: "A study in movement and natural light.", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1200&q=80", href: "#" },
            { id: "proj-6", title: "Market Days", category: "Editorial", description: "An intimate look at local markets and rituals.", image: "https://plus.unsplash.com/premium_photo-1723291237759-99f918377002", href: "#" }
          ],
          layout: "masonry",
          hover: "reveal"
        },
        style: { padding: "60px 0" }
      },
      {
        name: "Services",
        type: "services",
        content: {
          eyebrow: "Tailored for your story.",
          title: "Services",
          items: [
            { number: "01", icon: "camera", title: "Photography", description: "Custom editorial and commercial photography tailored to each brief.", cta: { label: "View details", href: "#contact" } },
            { number: "02", icon: "compass", title: "Creative Direction", description: "From concept to final frame — cohesive visual language and art direction.", cta: { label: "View details", href: "#contact" } },
            { number: "03", icon: "palette", title: "Branding", description: "Visual identity and campaign systems that support long-term recognition.", cta: { label: "View details", href: "#contact" } },
            { number: "04", icon: "users", title: "Workshops", description: "Hands-on sessions for teams and creatives focused on craft and storytelling.", cta: { label: "View details", href: "#contact" } }
          ]
        },
        style: { columns: 4, gap: "32px" }
      },
      {
        name: "Process",
        type: "process",
        content: {
          eyebrow: "From first idea to final frame.",
          title: "How We Work",
          steps: [
            { number: "01", title: "Discover", body: "Understanding the story, audience and creative direction." },
            { number: "02", title: "Define", body: "Building the visual language and production approach." },
            { number: "03", title: "Create", body: "Producing photography and creative assets." },
            { number: "04", title: "Deliver", body: "Refining, selecting and delivering the final work." }
          ]
        },
        style: { background: "transparent" }
      },
      {
        name: "Testimonials",
        type: "testimonials",
        content: {
          eyebrow: "Kind words",
          title: "Testimonials",
          items: [
            { image: "https://images.unsplash.com/photo-1546456073-6712f79251bb?auto=format&fit=crop&w=400&q=80", quote: "Working with Atelier Lane transformed our brand imagery — thoughtful and striking.", name: "Marina Gonzales", role: "Founder", company: "Hearth & Co.", rating: 5 },
            { image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80", quote: "A rare combination of craft and strategic clarity.", name: "Ethan Park", role: "Creative Director", company: "Morrow Studio", rating: 5 },
            { image: "https://images.unsplash.com/photo-1545996124-7d4a3d814d62?auto=format&fit=crop&w=400&q=80", quote: "Their attention to detail elevated our campaign beyond expectations.", name: "Leah Kim", role: "Marketing Lead", company: "Lumen House", rating: 5 }
          ]
        },
        style: { cardStyle: "editorial" }
      },
      {
        name: "Clients",
        type: "clients",
        content: {
          eyebrow: "Selected Clients",
          title: "Selected Clients",
          logos: [
            { name: "Kin", image: "https://via.placeholder.com/160x64?text=Kin" },
            { name: "Hearth", image: "https://via.placeholder.com/160x64?text=Hearth" },
            { name: "Morrow", image: "https://via.placeholder.com/160x64?text=Morrow" },
            { name: "Lumen", image: "https://via.placeholder.com/160x64?text=Lumen" },
            { name: "Coastline", image: "https://via.placeholder.com/160x64?text=Coastline" },
            { name: "Studio X", image: "https://via.placeholder.com/160x64?text=Studio+X" },
            { name: "Bespoke", image: "https://via.placeholder.com/160x64?text=Bespoke" },
            { name: "Foundry", image: "https://via.placeholder.com/160x64?text=Foundry" }
          ],
          monochrome: true
        },
        style: { gap: "24px" }
      },
      {
        name: "Journal",
        type: "journal",
        content: {
          eyebrow: "From the Journal",
          title: "From the Journal",
          items: [
            { id: "post-1", image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80", category: "Technique", date: "2026-06-21", title: "The Art of Natural Light", excerpt: "Observations and practical tips for working with natural light in editorial shoots.", href: "#" },
            { id: "post-2", image: "https://images.unsplash.com/photo-1496307042754-b4aa456c4a2d?auto=format&fit=crop&w=800&q=80", category: "Tips", date: "2026-05-12", title: "10 Tips for Timeless Editorial Photography", excerpt: "A concise guide to shooting imagery that feels enduring and considered.", href: "#" },
            { id: "post-3", image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80", category: "Theory", date: "2026-04-02", title: "Why Storytelling Matters in Brand Photography", excerpt: "Framing projects with narrative creates stronger emotional connection and brand recall.", href: "#" }
          ]
        },
        style: { grid: 3 }
      },
      {
        name: "Contact",
        type: "contact",
        content: {
          eyebrow: "Let's create something meaningful.",
          title: "Have a project in mind? Tell us a little about it and let's start a conversation.",
          details: ["hello@atelierlane.com", "+1 (555) 123-4567", "Brooklyn, NY"],
          social: [
            { provider: "instagram", href: "https://instagram.com/atelierlane" },
            { provider: "behance", href: "#" },
            { provider: "linkedin", href: "#" }
          ],
          form: {
            fields: [
              { name: "name", label: "Name", type: "text" },
              { name: "email", label: "Email", type: "email" },
              { name: "phone", label: "Phone", type: "tel" },
              { name: "projectType", label: "Project Type", type: "select", options: ["Editorial", "Commercial", "Branding", "Workshop"] },
              { name: "message", label: "Message", type: "textarea" }
            ],
            submit: { label: "Send Inquiry" }
          }
        },
        style: { padding: "80px 0" }
      },
      {
        name: "Footer",
        type: "footer",
        content: {
          brand: "Atelier Lane",
          description: "An independent creative studio focused on photography, visual storytelling and art direction.",
          links: [
            { label: "Portfolio", href: "#portfolio" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" }
          ],
          social: [
            { provider: "instagram", href: "https://instagram.com/atelierlane" }
          ],
          email: "hello@atelierlane.com",
          copyright: "© 2026 Atelier Lane"
        },
        style: { small: "true" }
      }
    ]
    name: "Crest & Co.",
    category: "Business",
    pageType: "multi-page",
    description: "A premium, launch-ready business website with trust, services, proof, and a direct conversion path.",
    accent: grad("#2563eb", "#0f766e"),
    thumbnail: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=1200&q=80",
    previewImages: [
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1400&q=80",
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1400&q=80",
    ],
    isPremium: true,
    price: "$49",
    tags: ["Business", "Launch"],
    author: "Crest Studio",
    version: "1.0",
    createdDate: "2026-07-01",
    updatedDate: "2026-07-10",
    pages: [
      {
        id: "home",
        name: "Home",
        slug: "index",
        description: "A polished homepage with strategic services, credibility, and a clear conversion path.",
        sections: [
          {
            name: "Header",
            type: "header",
            content: {
              brand: "Crest & Co.",
              brandHref: "index.html",
              links: [
                { label: "About", href: "about.html" },
                { label: "Services", href: "services.html" },
                { label: "Results", href: "contact.html" },
              ],
              cta: { label: "Book a call", href: "contact.html" },
            },
          },
          {
            name: "Hero",
            type: "hero",
            content: {
              eyebrow: "Trusted by growth-minded teams",
              title: "A sharper online presence that feels ready for scale.",
              body: "We partner with leadership teams to create polished digital experiences that support sales, credibility, and momentum.",
              primaryCta: { label: "Book a strategy call", href: "contact.html" },
              secondaryCta: { label: "Explore services", href: "services.html" },
              image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1400&q=80",
            },
          },
          {
            name: "Features",
            type: "features",
            content: {
              eyebrow: "What we do best",
              title: "A clear service stack for teams that need momentum without the scramble.",
              body: "We pair strategy, design, and rollout support so your digital presence feels premium from the start.",
              items: [
                { title: "Positioning & messaging", body: "Sharper narratives that help your business feel easier to trust." },
                { title: "Launch-ready websites", body: "Fast-moving builds that still feel thoughtful, premium, and cohesive." },
                { title: "Ongoing refinement", body: "Delivery support that helps you adapt and improve after launch." },
              ],
            },
          },
          {
            name: "Stats",
            type: "stats",
            content: {
              items: [
                { value: "4.9/5", label: "Average client rating" },
                { value: "120+", label: "Projects launched" },
                { value: "15 hrs", label: "Average response time" },
                { value: "98%", label: "Client retention" },
              ],
            },
          },
          {
            name: "Footer",
            type: "footer",
            content: {
              brand: "Crest & Co.",
              links: [
                { label: "About", href: "about.html" },
                { label: "Services", href: "services.html" },
                { label: "Contact", href: "contact.html" },
              ],
            },
          },
        ],
      },
      {
        id: "about",
        name: "About",
        slug: "about",
        description: "A company page that highlights experience, approach, and credibility.",
        sections: [
          {
            name: "Header",
            type: "header",
            content: {
              brand: "Crest & Co.",
              brandHref: "index.html",
              links: [
                { label: "Home", href: "index.html" },
                { label: "Services", href: "services.html" },
                { label: "Contact", href: "contact.html" },
              ],
            },
          },
          {
            name: "About",
            type: "about",
            content: {
              eyebrow: "About us",
              title: "We help teams move faster with calm, confident digital experiences.",
              body: "Crest & Co. blends strategy, design, and launch support to create websites that feel premium, practical, and polished.",
              bullets: [
                "Executive-level positioning and narrative clarity",
                "Visual systems designed for trust and momentum",
                "Delivery support that keeps every launch running smoothly",
              ],
              image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1000&q=80",
            },
          },
          {
            name: "Services",
            type: "services",
            content: {
              eyebrow: "What we do",
              title: "A service model built around clarity and measurable impact.",
              body: "We help companies refine positioning, design premium experiences, and launch with confidence.",
              items: [
                { title: "Strategy & messaging", body: "Focused positioning that helps your offer feel easier to understand and buy." },
                { title: "Experience design", body: "High-end pages built for credibility, clarity, and conversion." },
                { title: "Launch support", body: "A steady rollout process that keeps your team aligned and on schedule." },
              ],
            },
          },
          {
            name: "Footer",
            type: "footer",
            content: {
              brand: "Crest & Co.",
              links: [
                { label: "Home", href: "index.html" },
                { label: "Services", href: "services.html" },
                { label: "Contact", href: "contact.html" },
              ],
            },
          },
        ],
      },
      {
        id: "services",
        name: "Services",
        slug: "services",
        description: "A services page that outlines the agency’s offering and process.",
        sections: [
          {
            name: "Header",
            type: "header",
            content: {
              brand: "Crest & Co.",
              brandHref: "index.html",
              links: [
                { label: "Home", href: "index.html" },
                { label: "About", href: "about.html" },
                { label: "Contact", href: "contact.html" },
              ],
            },
          },
          {
            name: "Services",
            type: "services",
            content: {
              eyebrow: "Our services",
              title: "A service offering for teams that need premium, conversion-focused websites.",
              body: "From launch strategy to polished delivery, our work keeps your digital presence feeling confident and aligned.",
              items: [
                { title: "Brand strategy", body: "Positioning and messaging that feel consistent across every channel." },
                { title: "Website design", body: "Thoughtful pages that support trust, clarity, and action." },
                { title: "Campaign launches", body: "A launch-ready process for products, services, and strategic initiatives." },
              ],
            },
          },
          {
            name: "Process",
            type: "process",
            content: {
              eyebrow: "How we work",
              title: "A structured rollout with clear milestones and collaboration points.",
              steps: [
                { title: "Discover", body: "We align goals, audiences, and messaging needs." },
                { title: "Design", body: "We craft polished visual systems and page experiences." },
                { title: "Deliver", body: "We launch with flexibility and thoughtful follow-through." },
              ],
            },
          },
          {
            name: "Footer",
            type: "footer",
            content: {
              brand: "Crest & Co.",
              links: [
                { label: "Home", href: "index.html" },
                { label: "About", href: "about.html" },
                { label: "Contact", href: "contact.html" },
              ],
            },
          },
        ],
      },
      {
        id: "contact",
        name: "Contact",
        slug: "contact",
        description: "A conversion-focused contact page with a clear next step.",
        sections: [
          {
            name: "Header",
            type: "header",
            content: {
              brand: "Crest & Co.",
              brandHref: "index.html",
              links: [
                { label: "Home", href: "index.html" },
                { label: "About", href: "about.html" },
                { label: "Services", href: "services.html" },
              ],
            },
          },
          {
            name: "Contact",
            type: "contact",
            content: {
              eyebrow: "Get in touch",
              title: "Talk to our team about your next growth-focused website.",
              body: "We’re ready to help ambitious businesses launch with a premium site and clear digital strategy.",
              details: ["hello@crestco.com", "New York, NY", "Response within 24 hours"],
              primaryCta: { label: "Email us", href: "mailto:hello@crestco.com" },
            },
          },
          {
            name: "Footer",
            type: "footer",
            content: {
              brand: "Crest & Co.",
              links: [
                { label: "Home", href: "index.html" },
                { label: "About", href: "about.html" },
                { label: "Services", href: "services.html" },
              ],
            },
          },
        ],
      },
    ],
  },
  {
    id: "portfolio-atelier",
    name: "Atelier Lane",
    category: "Portfolio",
    description: "An editorial portfolio for photographers, creatives, and boutique studios seeking a refined online presence.",
    accent: grad("#7c3aed", "#db2777"),
    thumbnail: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    pageType: "single-page",
    tags: ["Portfolio", "Creative"],
    sections: [
      {
        name: "Header",
        type: "header",
        content: {
          brand: "Atelier Lane",
          links: [
            { label: "Work", href: "#work" },
            { label: "About", href: "#about" },
            { label: "Contact", href: "#contact" },
          ],
          cta: { label: "Book a session", href: "#contact" },
        },
      },
      {
        name: "Hero",
        type: "hero",
        content: {
          eyebrow: "Editorial work & brand stories",
          title: "I create experiences that feel cinematic, intimate, and impossible to forget.",
          body: "Selected collaborations for founders, cultural projects, and contemporary brands that want a more human presence online.",
          primaryCta: { label: "View selected work", href: "#work" },
          secondaryCta: { label: "Say hello", href: "#contact" },
          image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=80",
        },
      },
      {
        name: "Features",
        type: "features",
        content: {
          eyebrow: "What I bring",
          title: "A portfolio experience that feels editorial, personal, and polished.",
          body: "Every project is shaped to be warm, calm, and memorable while still supporting your goals.",
          items: [
            { title: "Visual direction", body: "Creative systems tailored to give your work a refined, lasting first impression." },
            { title: "Story-led pages", body: "Narrative structure that helps viewers understand your point of view quickly." },
            { title: "Launch support", body: "Carefully considered implementation so your site feels effortless to use and maintain." },
          ],
        },
      },
      {
        name: "Featured work",
        type: "portfolio",
        content: {
          eyebrow: "Selected projects",
          title: "A curated body of work shaped for clarity and emotion.",
          body: "Each project balances visual storytelling with thoughtful strategy and production care.",
          items: [
            { title: "Lumen House", body: "A content-led identity system for a hospitality concept opening in Brooklyn.", image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=1200&q=80" },
            { title: "Morrow Studio", body: "A refined launch sit
