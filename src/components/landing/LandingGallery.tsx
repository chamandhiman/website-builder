import { useState, useMemo } from "react";
import type { Template } from "@/services/templates";
import { PREBUILT_TEMPLATES } from "@/services/templateSeeds";

interface LandingGalleryProps {
  realTemplates: Template[];
  onPreviewTemplate: (template: any) => void;
  onSelectTemplate: (template: any) => void;
}

// Procedural catalog definition matching the new design
const SEED_CATEGORIES = [
  ["Real Estate", "Estate", "Live where light lives.", "Listings, agents and virtual tours.", "Book a tour", "View homes", ["240 listings", "4.9 rating"], ["Villas", "Penthouses", "Waterfront"], [["12k+", "Owners"], ["38", "Cities"], ["24h", "Tours"]], ["Homes", "Agents", "Journal", "Contact"]],
  ["Fitness", "Fit", "Stronger every day.", "Classes, coaches and nutrition plans.", "Join free", "See classes", ["1,240 kcal", "Live at 6pm"], ["Yoga", "Strength", "Cardio"], [["50+", "Classes"], ["300", "Coaches"], ["4.8★", "Rating"]], ["Classes", "Coaches", "Plans", "Blog"]],
  ["Café", "Brew", "Slow coffee, fast mornings.", "Menu, online ordering and store hours.", "Order now", "See menu", ["Fresh roast", "Ready in 5 min"], ["Espresso", "Pour-over", "Pastries"], [["9", "Origins"], ["7am", "Opens"], ["100%", "Fair trade"]], ["Menu", "Roasters", "Visit", "Order"]],
  ["SaaS", "Launch", "Ship your startup.", "Pricing, features and signup flow.", "Start free", "Watch demo", ["Deployed in 12s", "+38% signups"], ["Analytics", "Billing", "API"], [["10k", "Teams"], ["99.9%", "Uptime"], ["2 min", "Setup"]], ["Product", "Pricing", "Docs", "Login"]],
  ["E-commerce", "Shop", "Drop 04 is here.", "Product grid, cart and checkout.", "Shop now", "Lookbook", ["New arrivals", "Free shipping"], ["Tees", "Sneakers", "Bags"], [["2k+", "Products"], ["48h", "Delivery"], ["4.7★", "Reviews"]], ["Shop", "New", "Sale", "Cart"]],
  ["Portfolio", "Folio", "I design loud things.", "Projects, about and contact for creatives.", "Hire me", "See work", ["60 projects", "Open for work"], ["Branding", "UI/UX", "Motion"], [["8 yrs", "Experience"], ["60+", "Projects"], ["24", "Awards"]], ["Work", "About", "Blog", "Contact"]],
  ["Events", "Pulse", "Oct 24. Be there.", "Schedule, speakers and ticketing.", "Get tickets", "Speakers", ["40 speakers", "Few seats left"], ["Keynotes", "Workshops", "Expo"], [["3", "Days"], ["40", "Speakers"], ["5k", "Guests"]], ["Agenda", "Speakers", "Venue", "Tickets"]],
  ["Agency", "Studio", "We build brands.", "Services, case studies and a quote form.", "Get a quote", "Our work", ["120 projects", "5.0 on Google"], ["Design", "Web", "SEO"], [["120+", "Projects"], ["15", "Experts"], ["5.0★", "Rated"]], ["Services", "Work", "Team", "Contact"]],
  ["Travel", "Trip", "Wander further.", "Tours, packages and booking.", "Book a trip", "Destinations", ["80 countries", "Deals today"], ["Beaches", "Treks", "City breaks"], [["80", "Countries"], ["25k", "Travelers"], ["4.9★", "Rating"]], ["Tours", "Deals", "Guides", "Book"]],
  ["Education", "Learn", "Learn skills that pay.", "Courses, instructors and enrolment.", "Enroll now", "Courses", ["300 courses", "Live mentors"], ["Coding", "Design", "Marketing"], [["300+", "Courses"], ["90k", "Students"], ["4.8★", "Rating"]], ["Courses", "Mentors", "Pricing", "Login"]],
  ["Medical", "Care", "Care that comes first.", "Doctors, services and appointments.", "Book visit", "Our doctors", ["40 doctors", "Same-day slots"], ["Dental", "Skin", "Family"], [["40", "Doctors"], ["20k", "Patients"], ["15", "Years"]], ["Services", "Doctors", "Plans", "Contact"]],
  ["Law", "Legal", "Trusted counsel.", "Practice areas, team and consultation.", "Free consult", "Practice areas", ["25 yrs", "24/7 line"], ["Business", "Family", "Property"], [["25", "Years"], ["1.2k", "Cases won"], ["98%", "Success"]], ["Practice", "Team", "News", "Contact"]],
] as const;

const PALETTES = [
  ["Aurora", "#f3efe7", "#1b1b1b", "#b8893b", "#fff", "linear-gradient(160deg,#d8c4a0,#4b3b2a)", "#2a1f14", "10px"],
  ["Midnight", "#0d0b1f", "#e8e4ff", "#9b8cff", "#0d0b1f", "linear-gradient(130deg,#9b8cff,#2b1f6b)", "#17104a", "14px"],
  ["Forest", "#0f2a22", "#d9ffe9", "#7CF5C8", "#06231a", "linear-gradient(130deg,#7CF5C8,#1a6b54)", "#0a3a2d", "999px"],
  ["Espresso", "#2b1a12", "#ffe6c7", "#e8a05a", "#2b1a12", "linear-gradient(140deg,#c9772b,#3a2214)", "#1d100a", "6px"],
  ["Sunset", "#fff4d6", "#1b1b1b", "#ff6b3d", "#fff", "linear-gradient(130deg,#ffd21f,#ff4d6d)", "#7a1f3a", "16px"],
  ["Ocean", "#071a2b", "#dff1ff", "#38bdf8", "#071a2b", "linear-gradient(130deg,#38bdf8,#0b3d6b)", "#06284a", "12px"],
  ["Rose", "#1a0f14", "#ffd6e0", "#ff6b8b", "#1a0f14", "linear-gradient(130deg,#ff6b8b,#5a1a2e)", "#3a0f20", "8px"],
  ["Mono", "#111111", "#ffffff", "#ffd21f", "#111", "linear-gradient(130deg,#555,#111)", "#333333", "0px"],
  ["Mint", "#eafaf3", "#12332a", "#12b886", "#fff", "linear-gradient(130deg,#63e6be,#0b7a5a)", "#0b5d46", "20px"],
  ["Lilac", "#f1ecff", "#241a4d", "#7c5cff", "#fff", "linear-gradient(130deg,#c4b5fd,#6d4aff)", "#3b2a8c", "12px"],
] as const;

const TAGS = ["new", "free", "pro", "free", "pop"] as const;
const TAG_LABELS: Record<string, string> = {
  new: "New",
  free: "Free",
  pro: "Premium",
  pop: "Popular",
};

export function LandingGallery({
  realTemplates,
  onPreviewTemplate,
  onSelectTemplate,
}: LandingGalleryProps) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [displayCount, setDisplayCount] = useState<number>(12);

  // Combine real database/seed templates with the 120 procedural variations
  const allTemplates = useMemo(() => {
    const list: any[] = [];
    const baseSeeds = realTemplates.length > 0 ? realTemplates : PREBUILT_TEMPLATES;

    // 1. Add all prebuilt real production templates first
    baseSeeds.forEach((tpl, idx) => {
      list.push({
        ...tpl,
        id: tpl.id,
        n: tpl.name,
        c: tpl.category,
        tag: tpl.isNew ? "new" : tpl.featured ? "pro" : "free",
        thumbnail: tpl.thumbnail || null,
        sb: "#141416",
        sf: "#f2f0ea",
        sg: "linear-gradient(130deg, #ffd21f, #ff8a00)",
        r: "10px",
        h: tpl.name,
        p: tpl.description || "Responsive modern website template.",
      });
    });

    // 2. Add procedural variations up to 120 items
    const remainingCount = Math.max(0, 120 - list.length);
    for (let i = 0; i < remainingCount; i++) {
      const c = SEED_CATEGORIES[i % SEED_CATEGORIES.length];
      const p = PALETTES[(i + Math.floor(i / SEED_CATEGORIES.length)) % PALETTES.length];
      const matchingReal = baseSeeds[i % baseSeeds.length];

      list.push({
        id: `tpl-procedural-${i}`,
        n: `${p[0]} ${c[1]}`,
        c: c[0],
        tag: TAGS[i % TAGS.length],
        thumbnail: matchingReal?.thumbnail || null,
        sb: p[1],
        sf: p[2],
        sa: p[3],
        sab: p[4],
        sg: p[5],
        sh: p[6],
        r: p[7],
        h: c[2],
        p: c[3],
        b1: c[4],
        b2: c[5],
        chips: c[6],
        words: c[7],
        stats: c[8],
        links: c[9],
        realRef: matchingReal || null,
      });
    }

    return list;
  }, [realTemplates]);

  // Available categories list with counts
  const categoryList = useMemo(() => {
    const cats = ["All", ...SEED_CATEGORIES.map((c) => c[0]), "Beauty & Salon", "Freelancer"];
    const counts: Record<string, number> = { All: allTemplates.length };

    allTemplates.forEach((t) => {
      counts[t.c] = (counts[t.c] || 0) + 1;
    });

    return cats.map((cat) => ({
      name: cat,
      count: counts[cat] || 0,
    }));
  }, [allTemplates]);

  // Filtered templates
  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((t) => {
      const matchesCategory =
        activeCategory === "All" ||
        t.c.toLowerCase().includes(activeCategory.toLowerCase()) ||
        activeCategory.toLowerCase().includes(t.c.toLowerCase());

      const query = searchQuery.trim().toLowerCase();
      const matchesQuery =
        !query ||
        t.n.toLowerCase().includes(query) ||
        t.c.toLowerCase().includes(query) ||
        (t.p && t.p.toLowerCase().includes(query));

      return matchesCategory && matchesQuery;
    });
  }, [allTemplates, activeCategory, searchQuery]);

  const visibleTemplates = filteredTemplates.slice(0, displayCount);

  return (
    <section className="sec" id="templates">
      <div className="wrap">
        <div className="head rv in">
          <div className="eyebrow">
            <i></i>Template library
          </div>
          <h2>
            120+ templates. <span className="hl">Pick, edit, launch.</span>
          </h2>
          <p>
            Every template is fully responsive and ready to edit. Preview it full
            screen, then use it.
          </p>
        </div>

        <div className="gal">
          {/* Left Category Sidebar */}
          <aside className="side">
            <input
              className="search"
              id="q"
              placeholder="Search templates…"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setDisplayCount(12);
              }}
            />
            <div className="tabs" id="tabs">
              {categoryList.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  className={activeCategory === cat.name ? "on" : ""}
                  onClick={() => {
                    setActiveCategory(cat.name);
                    setDisplayCount(12);
                  }}
                >
                  <span>{cat.name}</span>
                  <em>{cat.count}</em>
                </button>
              ))}
            </div>
          </aside>

          {/* Right Template Cards Grid */}
          <div>
            <div className="grid" id="grid">
              {visibleTemplates.map((t, idx) => {
                const tag = t.tag || "new";
                const badgeLabel = TAG_LABELS[tag] || "New";

                return (
                  <article
                    key={t.id || idx}
                    className="tpl"
                    style={{ animationDelay: `${(idx % 12) * 45}ms` }}
                  >
                    <div className="shot">
                      <span className={`badge ${tag}`}>{badgeLabel}</span>

                      {/* Real thumbnail image if available, else mini CSS site art */}
                      {t.thumbnail ? (
                        <div
                          className="mini"
                          style={{
                            background: "#18181b",
                            padding: 0,
                          }}
                        >
                          <img
                            src={t.thumbnail}
                            alt={t.n}
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div
                          className="mini"
                          style={{
                            background: t.sb || "#141416",
                            color: t.sf || "#f2f0ea",
                          }}
                        >
                          <div className="m-nav">
                            <b />
                            <span>
                              <i />
                              <i />
                              <i />
                            </span>
                          </div>
                          <div className="m-h">{t.h}</div>
                          <div className="m-p">
                            <i />
                            <i style={{ width: "50%" }} />
                          </div>
                          <div
                            className="m-big"
                            style={{
                              background: t.sg || "linear-gradient(120deg, #ffd21f, #ff8a00)",
                              borderRadius: t.r === "999px" ? "20px" : t.r,
                            }}
                          />
                          <div className="m-blocks">
                            <i />
                            <i />
                            <i />
                          </div>
                          <div className="m-blocks">
                            <i />
                            <i />
                            <i />
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="tinfo">
                      <h4>{t.n}</h4>
                      <p>
                        {t.c} — {t.p}
                      </p>
                      <div className="tbtn">
                        <button
                          type="button"
                          className="btn btn-w sm"
                          onClick={() => onPreviewTemplate(t)}
                        >
                          Preview
                        </button>
                        <button
                          type="button"
                          className="btn btn-y sm"
                          onClick={() => onSelectTemplate(t.realRef || t)}
                        >
                          Use template
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Load More Pagination */}
            <div className="more">
              <p id="cnt">
                Showing {Math.min(displayCount, filteredTemplates.length)} of{" "}
                {filteredTemplates.length} templates
              </p>
              {displayCount < filteredTemplates.length && (
                <button
                  type="button"
                  className="btn btn-w"
                  id="sent"
                  onClick={() => setDisplayCount((prev) => prev + 12)}
                >
                  Load more templates ↓
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
