import { SHARED_HEADER_SECTION_ID, SHARED_FOOTER_SECTION_ID, type Page, type PageSection } from "@/lib/builder/store";
import type { Template } from "./templates";

// =============================================================
// CURATED HIGH-RESOLUTION BEAUTY & SALON ASSETS
// =============================================================
export const BEAUTY_SALON_ASSETS = {
  hero: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
  about: "/images/about.jpg",
  before: "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=800&q=80",
  after: "https://images.unsplash.com/photo-1560869713-7d0a29430803?auto=format&fit=crop&w=800&q=80",
  team1: "/images/team1.jpg",
  team2: "/images/team2.jpg",
  team3: "/images/team3.jpg",
  g1: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
  g2: "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=800&q=80",
  g3: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=800&q=80",
  g4: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80",
  g5: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=800&q=80",
  g6: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=800&q=80",
  g7: "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80",
  preview: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1200&q=80",
};

export const BEAUTY_PROJECT_ASSETS: Record<string, string> = {
  "images/about.jpg": "/images/about.jpg",
  "images/team1.jpg": "/images/team1.jpg",
  "images/team2.jpg": "/images/team2.jpg",
  "images/team3.jpg": "/images/team3.jpg",
  "about.jpg": "/images/about.jpg",
  "team1.jpg": "/images/team1.jpg",
  "team2.jpg": "/images/team2.jpg",
  "team3.jpg": "/images/team3.jpg",
};

// =============================================================
// GLOBAL CSS FOR ROSÉ ATELIER BEAUTY & SALON TEMPLATE
// =============================================================
export const ROSE_BEAUTY_GLOBAL_CSS = `
@import url("https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&family=Jost:wght@300;400;500;600&display=swap");

:root {
  /* Colours */
  --bg: #fbf6f2;
  --bg-2: #f5ebe4;
  --surface: #ffffff;
  --blush: #efd3c8;
  --line: rgba(60, 35, 30, 0.12);
  --ink: #2b1e1c;
  --muted: #7a6560;
  --accent: #b5695a;       /* rose clay */
  --accent-2: #d9a28f;     /* soft rose */
  --gold: #c9a26b;

  /* Type */
  --font-display: "Cormorant", "Times New Roman", serif;
  --font-body: "Jost", system-ui, sans-serif;
  --fs-hero: clamp(3rem, 1.4rem + 6vw, 6.4rem);
  --fs-h2: clamp(2.3rem, 1.4rem + 3.4vw, 4.2rem);
  --fs-h3: clamp(1.35rem, 1.1rem + .6vw, 1.7rem);
  --fs-body: clamp(1rem, .96rem + .2vw, 1.1rem);
  --fs-small: .8rem;

  /* Layout */
  --container: 1220px;
  --gutter: clamp(1.25rem, 4vw, 2.5rem);
  --section: clamp(5rem, 10vw, 8.5rem);
  --radius: 22px;

  /* Motion */
  --ease: cubic-bezier(.22, 1, .36, 1);
}

/* Reset inside Beauty theme */
html, body, .wto-page-shell {
  font-family: var(--font-body) !important;
  font-size: var(--fs-body) !important;
  font-weight: 300 !important;
  line-height: 1.7 !important;
  color: var(--ink) !important;
  background-color: var(--bg) !important;
  -webkit-font-smoothing: antialiased;
  overflow-x: clip;
}
html { scroll-behavior: smooth; scroll-padding-top: 80px; -webkit-text-size-adjust: 100%; }
img { display: block; max-width: 100%; height: auto; }
a { color: inherit; text-decoration: none; font-family: inherit; }
ul, ol { list-style: none; }
em { font-style: italic; color: var(--accent); }
::selection { background: var(--accent); color: #fff; }
.container { width: min(100% - var(--gutter) * 2, var(--container)); margin-inline: auto; }
.section { padding-block: var(--section); position: relative; }
.muted { color: var(--muted); }

/* Scroll progress bar */
body::after {
  content: ""; position: fixed; top: 0; left: 0; right: 0; height: 3px; z-index: 70;
  background: linear-gradient(90deg, var(--accent-2), var(--accent), var(--gold));
  transform-origin: left; transform: scaleX(0);
}
@supports (animation-timeline: scroll()) {
  body::after { animation: progress linear both; animation-timeline: scroll(root); }
}
@keyframes progress { to { transform: scaleX(1); } }

/* Typography */
h1, h2, h3, h4, .brand-name {
  font-family: var(--font-display) !important;
  letter-spacing: -.01em;
  line-height: 1.02;
}
h1, .hero-title { font-size: var(--fs-hero) !important; font-weight: 300 !important; }
h2, .section-title { font-size: var(--fs-h2) !important; font-weight: 400 !important; margin-bottom: 1.4rem; max-width: 15ch; }
h3 { font-size: var(--fs-h3) !important; font-weight: 400 !important; }
h4 { font-weight: 400 !important; }
.brand-name { font-size: 1.7rem !important; font-weight: 500 !important; color: var(--ink) !important; }
.section-head { text-align: center; margin-bottom: clamp(2.5rem, 5vw, 4rem); }
.section-head .section-title { margin-inline: auto; }
.eyebrow {
  display: inline-flex; align-items: center; gap: .7rem; margin-bottom: 1rem;
  font-family: var(--font-body) !important;
  font-size: var(--fs-small) !important; font-weight: 500 !important; letter-spacing: .28em !important; text-transform: uppercase; color: var(--accent) !important;
}
.eyebrow::before { content: "✿"; font-size: .9rem; letter-spacing: 0; animation: spin 10s linear infinite; display: inline-block; }
.section-title em::after {
  content: ""; display: block; height: .14em; margin-top: -.05em;
  background: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 12' preserveAspectRatio='none'%3E%3Cpath d='M2 8 Q50 1 100 7 T198 5' fill='none' stroke='%23d9a28f' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E") center / 100% 100% no-repeat;
  clip-path: inset(0 100% 0 0); animation: draw 1.2s var(--ease) .4s forwards;
}
.section-title em { display: inline-block; }
@supports (animation-timeline: view()) {
  .section-title em::after { animation: draw linear forwards; animation-timeline: view(); animation-range: entry 40% cover 40%; }
}
@keyframes draw { to { clip-path: inset(0 0 0 0); } }

/* Buttons */
.btn {
  position: relative; display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
  padding: 1rem 2rem; border-radius: 999px; border: 1px solid var(--ink);
  background: var(--ink); color: var(--bg); font: 500 .92rem/1 var(--font-body); letter-spacing: .06em;
  cursor: pointer; overflow: hidden; isolation: isolate;
  transition: color .45s var(--ease), border-color .45s, transform .45s var(--ease), box-shadow .45s var(--ease);
}
.btn::before {
  content: ""; position: absolute; left: 50%; top: 50%; width: 0; aspect-ratio: 1; border-radius: 50%; z-index: -1;
  background: var(--accent); translate: -50% -50%; transition: width .6s var(--ease);
}
.btn:hover { transform: translateY(-2px); border-color: var(--accent); box-shadow: 0 14px 30px -12px rgba(181, 105, 90, .6); }
.btn:hover::before { width: 125%; }
.btn-ghost { background: transparent; color: var(--ink); }
.btn-ghost:hover { color: #fff; }
.btn-small { padding: .7rem 1.4rem; font-size: .82rem; }
.btn-block { width: 100%; }
a:focus-visible, .btn:focus-visible, label:focus-visible, summary:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }

/* Sticky Header on scroll across all devices */
.nav-toggle { position: absolute; opacity: 0; pointer-events: none; }
.site-header {
  position: sticky; top: 0; z-index: 1000; width: 100%; padding-block: 1.1rem;
  background: rgba(251, 246, 242, 0.95); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
  transition: padding .3s var(--ease), background .3s;
}
.header-inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.brand { display: inline-flex; align-items: center; gap: .65rem; color: var(--accent); }
.brand-mark { width: 40px; height: 40px; }
.brand-mark .petals { transform-origin: 20px 22px; animation: bloom 4s ease-in-out infinite; }
@keyframes bloom { 50% { transform: scale(1.08) rotate(6deg); } }
.brand-name { font-size: 1.7rem; font-weight: 500; color: var(--ink); }
.main-nav { display: flex; align-items: center; gap: 1.9rem; }
.main-nav a:not(.btn) { font-size: .9rem; font-weight: 400; color: var(--muted); position: relative; padding-block: .3rem; transition: color .3s; }
.main-nav a:not(.btn)::after {
  content: "✿"; position: absolute; left: 50%; bottom: -.9rem; font-size: .6rem; color: var(--accent);
  translate: -50% 0; opacity: 0; transform: translateY(-6px) scale(.4); transition: all .4s var(--ease);
}
.main-nav a:not(.btn):hover { color: var(--ink); }
.main-nav a:not(.btn):hover::after { opacity: 1; transform: none; }
.burger { display: none; width: 44px; height: 44px; cursor: pointer; position: relative; z-index: 60; }
.burger span { position: absolute; left: 10px; right: 10px; height: 1.5px; background: var(--ink); transition: transform .45s var(--ease), opacity .3s; }
.burger span:nth-child(1) { top: 15px; } .burger span:nth-child(2) { top: 21px; } .burger span:nth-child(3) { top: 27px; }

/* Hero */
.hero { min-height: 90vh; display: grid; align-items: center; padding-block: 4rem 4rem; overflow: hidden; position: relative; }
.blob { position: absolute; z-index: -1; filter: blur(10px); animation: morph 14s ease-in-out infinite alternate; }
.blob-1 { width: 46vw; height: 46vw; right: -10vw; top: -8vw; background: radial-gradient(circle at 30% 30%, var(--blush), transparent 70%); }
.blob-2 { width: 32vw; height: 32vw; left: -10vw; bottom: -10vw; background: radial-gradient(circle at 60% 40%, #f3e1cf, transparent 70%); animation-delay: -6s; }
@keyframes morph {
  0%   { border-radius: 42% 58% 70% 30% / 45% 45% 55% 55%; transform: translate(0, 0) rotate(0); }
  50%  { border-radius: 70% 30% 46% 54% / 30% 39% 61% 70%; transform: translate(-3vw, 2vw) rotate(25deg); }
  100% { border-radius: 30% 70% 38% 62% / 60% 30% 70% 40%; transform: translate(2vw, -2vw) rotate(-15deg); }
}
.hero-grid { display: grid; grid-template-columns: 1.1fr .9fr; gap: clamp(2rem, 5vw, 5rem); align-items: center; }
.hero-title { font-size: var(--fs-hero); font-weight: 300; margin-bottom: 1.6rem; }
.hero-title .line { display: block; overflow: hidden; padding-bottom: .06em; }
.hero-title .line > span { display: inline-block; animation: lineUp 1.2s var(--ease) both; animation-delay: var(--d, 0s); }
@keyframes lineUp { from { transform: translateY(110%) rotate(3deg); } }
.hero-lead { max-width: 44ch; color: var(--muted); font-size: clamp(1.05rem, 1rem + .3vw, 1.2rem); margin-bottom: 2.3rem; }
.hero-cta { display: flex; flex-wrap: wrap; gap: 1rem; margin-bottom: 2.8rem; }
.fade-in { animation: fadeUp 1s var(--ease) both; animation-delay: var(--d, 0s); }
@keyframes fadeUp { from { opacity: 0; transform: translateY(28px); } }

.shimmer {
  background: linear-gradient(110deg, var(--accent) 0%, var(--gold) 25%, #f1d2b8 40%, var(--accent) 60%, var(--accent) 100%);
  background-size: 250% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: shimmer 5s linear infinite; padding-right: .08em;
}
@keyframes shimmer { to { background-position: -250% 0; } }

.hero-proof { display: flex; align-items: center; gap: clamp(1rem, 3vw, 2.2rem); flex-wrap: wrap; }
.hero-proof li { display: flex; flex-direction: column; line-height: 1.3; }
.hero-proof strong { font: 500 1.6rem var(--font-display); }
.hero-proof span { font-size: .82rem; color: var(--muted); }
.stars { font-style: normal; color: var(--gold); font-size: .85rem; letter-spacing: .1em; }
.avatars { display: flex; }
.avatars span {
  width: 42px; height: 42px; border-radius: 50%; border: 3px solid var(--bg); margin-left: -12px;
  background: center / cover no-repeat; display: grid; place-items: center; font-weight: 500; color: #fff;
}
.avatars span:first-child { margin-left: 0; background-image: url("${BEAUTY_SALON_ASSETS.team1}"); }
.avatars span:nth-child(2) { background-image: url("${BEAUTY_SALON_ASSETS.team2}"); }
.avatars span:nth-child(3) { background-image: url("${BEAUTY_SALON_ASSETS.g3}"); }
.avatars span:nth-child(4) { background: var(--accent); }

.hero-visual { position: relative; justify-self: center; width: min(100%, 460px); animation: fadeUp 1.4s var(--ease) .3s both; }
.arch { border-radius: 999px 999px var(--radius) var(--radius); overflow: hidden; aspect-ratio: 3 / 4; box-shadow: 0 40px 80px -40px rgba(80, 40, 30, .5); }
.arch img { width: 100%; height: 100%; object-fit: cover; animation: slowZoom 18s ease-in-out infinite alternate; }
@keyframes slowZoom { to { transform: scale(1.1); } }
.arch-outline {
  position: absolute; inset: -18px 18px 18px -18px; z-index: -1; border: 1px solid var(--accent-2);
  border-radius: 999px 999px var(--radius) var(--radius); animation: drift 7s ease-in-out infinite alternate;
}
@keyframes drift { to { transform: translate(10px, -10px); } }
.float-card {
  position: absolute; display: flex; align-items: center; gap: .8rem; padding: .85rem 1.2rem .85rem .85rem;
  background: rgba(255, 255, 255, .82); backdrop-filter: blur(12px); border-radius: 18px;
  box-shadow: 0 20px 40px -20px rgba(80, 40, 30, .4); line-height: 1.25; animation: bob 5s ease-in-out infinite;
}
.float-card strong { display: block; font-weight: 500; font-size: .92rem; }
.float-card small { color: var(--muted); font-size: .75rem; }
.fc-icon { width: 38px; height: 38px; border-radius: 12px; display: grid; place-items: center; background: var(--blush); color: var(--accent); }
.fc-1 { left: -14%; top: 22%; }
.fc-2 { right: -10%; bottom: 14%; animation-delay: -2.5s; }
@keyframes bob { 50% { transform: translateY(-14px); } }
.spin-badge {
  position: absolute; right: -6%; top: -2%; width: 120px; height: 120px; border-radius: 50%;
  background: var(--ink); color: var(--bg); display: grid; place-items: center;
}
.spin-badge svg { position: absolute; inset: 0; animation: spin 14s linear infinite; }
.spin-badge text { font: 500 10px var(--font-body); letter-spacing: .26em; text-transform: uppercase; fill: currentColor; }
.spin-badge span { font-size: 1.6rem; color: var(--accent-2); }
@keyframes spin { to { transform: rotate(360deg); } }
.sparkle { position: absolute; fill: var(--gold); animation: twinkle 3s ease-in-out infinite; }
.sp-1 { width: 26px; left: -6%; top: 6%; }
.sp-2 { width: 16px; right: 4%; top: 46%; animation-delay: -1s; }
.sp-3 { width: 20px; left: 12%; bottom: -4%; animation-delay: -2s; }
@keyframes twinkle { 0%, 100% { transform: scale(.4) rotate(0); opacity: .3; } 50% { transform: scale(1) rotate(90deg); opacity: 1; } }

/* Marquee */
.marquee { overflow: hidden; background: var(--ink); color: var(--bg); padding-block: 1.3rem; white-space: nowrap; rotate: -1.5deg; scale: 1.03; }
.marquee-track { display: inline-flex; align-items: center; gap: 2.4rem; animation: marquee 32s linear infinite; }
.marquee span { font: italic 300 clamp(1.6rem, 1rem + 2.2vw, 2.6rem) var(--font-display); }
.marquee i { font-style: normal; color: var(--accent-2); display: inline-block; animation: spin 6s linear infinite; }
.marquee:hover .marquee-track { animation-play-state: paused; }
@keyframes marquee { to { transform: translateX(calc(-50% - 1.2rem)); } }

/* About */
.about-grid { display: grid; grid-template-columns: 1fr 1.05fr; gap: clamp(3rem, 7vw, 6rem); align-items: center; }
.about-media { position: relative; }
.about-media img { border-radius: var(--radius) var(--radius) 999px 999px; aspect-ratio: 4 / 5; object-fit: cover; width: 100%; }
.exp-badge {
  position: absolute; left: -1.5rem; bottom: 3rem; padding: 1.2rem 1.5rem; display: flex; align-items: center; gap: .8rem;
  background: var(--surface); border-radius: 18px; box-shadow: 0 25px 50px -25px rgba(80, 40, 30, .45); animation: bob 6s ease-in-out infinite;
}
.exp-badge strong { font: 400 3rem/1 var(--font-display); color: var(--accent); }
.exp-badge span { font-size: .82rem; color: var(--muted); line-height: 1.3; }
.about-copy > p { color: var(--muted); margin-bottom: 1.5rem; max-width: 54ch; }
.checks { display: grid; grid-template-columns: 1fr 1fr; gap: .8rem 1.5rem; margin-bottom: 2.2rem; }
.checks li { position: relative; padding-left: 1.9rem; font-size: .95rem; }
.checks li::before {
  content: "✓"; position: absolute; left: 0; top: .15rem; width: 1.3rem; height: 1.3rem; border-radius: 50%;
  display: grid; place-items: center; font-size: .7rem; background: var(--blush); color: var(--accent);
}
.stats { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; padding-top: 2rem; border-top: 1px solid var(--line); }
.stats strong { display: block; font: 400 clamp(2rem, 1.5rem + 1.6vw, 2.8rem)/1 var(--font-display); color: var(--accent); }
.stats span { font-size: .8rem; color: var(--muted); letter-spacing: .05em; }

/* Services */
.services { background: var(--bg-2); }
.service-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4rem; }
.service {
  position: relative; padding: 2.4rem 2rem 2rem; background: var(--surface); border-radius: var(--radius); overflow: hidden; isolation: isolate;
  border: 1px solid var(--line); transition: transform .6s var(--ease), box-shadow .6s var(--ease), color .5s;
}
.service::before {
  content: ""; position: absolute; inset: 0; z-index: -1; background: linear-gradient(160deg, var(--accent), #8f4b3f);
  clip-path: circle(0 at 90% 90%); transition: clip-path .8s var(--ease);
}
.service:hover { transform: translateY(-8px); box-shadow: 0 30px 60px -30px rgba(80, 40, 30, .55); color: #fff; }
.service:hover::before { clip-path: circle(150% at 90% 90%); }
.s-icon { width: 54px; height: 54px; color: var(--accent); margin-bottom: 1.6rem; transition: color .5s, transform .6s var(--ease); }
.service:hover .s-icon { color: #fff; transform: rotate(-8deg) scale(1.1); }
.service h3 { font-size: var(--fs-h3); font-weight: 500; margin-bottom: .6rem; }
.service p { color: var(--muted); font-size: .95rem; margin-bottom: 1.6rem; transition: color .5s; }
.service:hover p { color: rgba(255, 255, 255, .85); }
.s-price { font: italic 500 1.2rem var(--font-display); }
.s-arrow {
  position: absolute; right: 1.6rem; bottom: 1.6rem; width: 40px; height: 40px; border-radius: 50%; display: grid; place-items: center;
  border: 1px solid currentColor; transition: transform .5s var(--ease), background .5s, color .5s;
}
.service:hover .s-arrow { transform: rotate(-45deg); background: #fff; color: var(--accent); border-color: #fff; }

/* Before / After */
.transform-grid { display: grid; grid-template-columns: .9fr 1.1fr; gap: clamp(2.5rem, 6vw, 5rem); align-items: center; }
.transform-copy > p:not(.eyebrow) { color: var(--muted); margin-bottom: 1.5rem; max-width: 44ch; }
.link { color: var(--accent); font-weight: 500; display: inline-block; transition: transform .3s var(--ease); }
.link:hover { transform: translateX(6px); }
.compare { position: relative; aspect-ratio: 4 / 5; max-width: 560px; width: 100%; justify-self: center; border-radius: var(--radius); overflow: hidden; box-shadow: 0 40px 80px -40px rgba(80, 40, 30, .5); --pos: 50%; }
.compare:not(.touched) { animation: sweep 6s ease-in-out infinite; }
.compare:hover:not(.touched) { animation-play-state: paused; }
@keyframes sweep { 0%, 100% { --pos: 50%; } 25% { --pos: 22%; } 75% { --pos: 78%; } }
.compare-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; }
.compare-before { clip-path: inset(0 calc(100% - var(--pos)) 0 0); }
.compare-line { position: absolute; top: 0; bottom: 0; left: var(--pos); width: 2px; background: #fff; translate: -1px 0; pointer-events: none; }
.compare-knob {
  position: absolute; top: 50%; left: 50%; width: 52px; height: 52px; translate: -50% -50%; border-radius: 50%;
  display: grid; place-items: center; background: #fff; color: var(--accent); font-size: 1.2rem; box-shadow: 0 8px 20px rgba(0, 0, 0, .2);
}
.compare-knob::after { content: ""; position: absolute; inset: -8px; border-radius: 50%; border: 1px solid #fff; animation: pulse 2s ease-out infinite; }
@keyframes pulse { from { transform: scale(.8); opacity: 1; } to { transform: scale(1.5); opacity: 0; } }
.compare-tag {
  position: absolute; top: 1rem; padding: .35rem .9rem; border-radius: 999px; font-size: .75rem; letter-spacing: .15em; text-transform: uppercase;
  background: rgba(43, 30, 28, .65); color: #fff; backdrop-filter: blur(6px); pointer-events: none;
}
.tag-b { left: 1rem; } .tag-a { right: 1rem; }
.compare-range { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: ew-resize; margin: 0; }

/* Pricing */
.pricing { background: linear-gradient(180deg, var(--bg) 0%, var(--bg-2) 100%); }
.plans { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.4rem; align-items: center; }
.plan {
  position: relative; padding: 2.6rem 2.2rem; background: var(--surface); border-radius: var(--radius); border: 1px solid var(--line);
  transition: transform .6s var(--ease), box-shadow .6s var(--ease);
}
.plan:hover { transform: translateY(-8px); box-shadow: 0 30px 60px -30px rgba(80, 40, 30, .45); }
.plan h3 { font-size: 1.9rem; font-weight: 500; margin-bottom: .4rem; }
.plan-desc { color: var(--muted); font-size: .92rem; margin-bottom: 1.6rem; }
.plan-price { font: 400 3.6rem/1 var(--font-display); margin-bottom: 1.8rem; }
.plan-price small { font-size: 1.6rem; vertical-align: top; margin-right: .2rem; color: var(--accent); }
.plan ul { display: grid; gap: .8rem; margin-bottom: 2.2rem; padding-top: 1.6rem; border-top: 1px dashed var(--line); }
.plan li { position: relative; padding-left: 1.6rem; font-size: .95rem; }
.plan li::before { content: "✿"; position: absolute; left: 0; color: var(--accent); font-size: .8rem; top: .15rem; }
.plan-featured { background: var(--ink); color: var(--bg); padding-block: 3.4rem; border: 0; }
.plan-featured .plan-desc { color: rgba(251, 246, 242, .65); }
.plan-featured ul { border-color: rgba(255, 255, 255, .15); }
.plan-featured li::before, .plan-featured .plan-price small { color: var(--accent-2); }
.plan-featured .btn { background: var(--accent); border-color: var(--accent); color: #fff; }
.plan-featured .btn::before { background: var(--bg); }
.plan-featured .btn:hover { color: var(--ink); }
.plan-featured::after {
  content: ""; position: absolute; inset: 0; border-radius: inherit; pointer-events: none;
  background: linear-gradient(115deg, transparent 40%, rgba(255, 255, 255, .08) 50%, transparent 60%) 0 0 / 250% 100%;
  animation: sheen 5s linear infinite;
}
@keyframes sheen { from { background-position: 150% 0; } to { background-position: -100% 0; } }
.ribbon-tag {
  position: absolute; top: 1.4rem; right: 1.4rem; padding: .35rem .9rem; border-radius: 999px;
  font-size: .72rem; font-weight: 500; letter-spacing: .14em; text-transform: uppercase; background: var(--accent-2); color: var(--ink);
}

/* Process */
.steps { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; position: relative; }
.steps::before {
  content: ""; position: absolute; top: 34px; left: 12%; right: 12%; height: 1px; z-index: -1;
  background: repeating-linear-gradient(90deg, var(--accent-2) 0 8px, transparent 8px 16px);
}
.step { text-align: center; }
.step-num {
  width: 68px; height: 68px; margin: 0 auto 1.4rem; border-radius: 50%; display: grid; place-items: center;
  font: italic 500 1.5rem var(--font-display); color: var(--accent); background: var(--bg); border: 1px solid var(--accent-2);
  transition: background .5s, color .5s, transform .6s var(--ease);
}
.step:hover .step-num { background: var(--accent); color: #fff; transform: scale(1.1) rotate(-10deg); }
.step h3 { font-size: 1.6rem; font-weight: 500; margin-bottom: .4rem; }
.step p { color: var(--muted); font-size: .94rem; max-width: 24ch; margin-inline: auto; }

/* Team */
.team { background: var(--bg-2); }
.team-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.6rem; }
.member { text-align: center; }
.member-img { position: relative; overflow: hidden; border-radius: 999px 999px var(--radius) var(--radius); aspect-ratio: 3 / 4; margin-bottom: 1.3rem; }
.member-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--ease), filter .8s; filter: saturate(.9); }
.member:hover .member-img img { transform: scale(1.08); filter: saturate(1.05); }
.member-img::after { content: ""; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(43, 30, 28, .6), transparent 50%); opacity: 0; transition: opacity .6s; }
.member:hover .member-img::after { opacity: 1; }
.member-social { position: absolute; left: 0; right: 0; bottom: 1.4rem; z-index: 2; display: flex; justify-content: center; gap: .6rem; }
.member-social a {
  width: 42px; height: 42px; border-radius: 50%; display: grid; place-items: center; background: #fff; color: var(--ink);
  font-size: .72rem; font-weight: 600; letter-spacing: .05em; opacity: 0; transform: translateY(20px);
  transition: opacity .5s var(--ease), transform .5s var(--ease), background .3s, color .3s;
}
.member:hover .member-social a { opacity: 1; transform: none; }
.member-social a:hover { background: var(--accent); color: #fff; }
.member h3 { font-size: 1.8rem; font-weight: 500; }
.member p { color: var(--accent); font-size: .85rem; letter-spacing: .08em; text-transform: uppercase; }

/* Gallery */
.g-filter > input { position: absolute; opacity: 0; pointer-events: none; }
.g-chips { display: flex; flex-wrap: wrap; justify-content: center; gap: .6rem; margin-bottom: 2.5rem; }
.g-chips label {
  padding: .6rem 1.4rem; border-radius: 999px; border: 1px solid var(--line); cursor: pointer; font-size: .88rem;
  transition: all .4s var(--ease); background: var(--surface);
}
.g-chips label:hover { border-color: var(--accent); color: var(--accent); }
#gf-all:checked ~ .g-chips label[for="gf-all"],
#gf-hair:checked ~ .g-chips label[for="gf-hair"],
#gf-makeup:checked ~ .g-chips label[for="gf-makeup"],
#gf-nails:checked ~ .g-chips label[for="gf-nails"],
#gf-skin:checked ~ .g-chips label[for="gf-skin"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }

.g-grid { columns: 3 260px; column-gap: 1rem; }
.g-item {
  position: relative; display: block; margin-bottom: 1rem; break-inside: avoid; border-radius: 18px; overflow: hidden; cursor: zoom-in;
  animation: popIn .7s var(--ease) both;
}
.g-item img { width: 100%; transition: transform 1.2s var(--ease), filter .6s; }
.g-item::after { content: ""; position: absolute; inset: 0; background: linear-gradient(0deg, rgba(43, 30, 28, .7), transparent 55%); opacity: 0; transition: opacity .5s; }
.g-item::before {
  content: "+"; position: absolute; top: 1rem; right: 1rem; z-index: 2; width: 40px; height: 40px; border-radius: 50%;
  display: grid; place-items: center; background: #fff; color: var(--accent); font-size: 1.3rem; transform: scale(0) rotate(-90deg); transition: transform .5s var(--ease);
}
.g-cap { position: absolute; left: 1.2rem; bottom: 1rem; z-index: 2; color: #fff; font: 500 1.35rem/1.2 var(--font-display); opacity: 0; transform: translateY(16px); transition: all .5s var(--ease); }
.g-cap small { display: block; font: 500 .65rem var(--font-body); letter-spacing: .2em; text-transform: uppercase; color: var(--accent-2); }
.g-item:hover img { transform: scale(1.08); }
.g-item:hover::after, .g-item:hover .g-cap { opacity: 1; transform: none; }
.g-item:hover::before { transform: scale(1); }

#gf-hair:checked ~ .g-grid .g-item:not(.hair),
#gf-makeup:checked ~ .g-grid .g-item:not(.makeup),
#gf-nails:checked ~ .g-grid .g-item:not(.nails),
#gf-skin:checked ~ .g-grid .g-item:not(.skin) { display: none; }
@keyframes popIn { from { opacity: 0; transform: scale(.92) translateY(20px); } }

/* Lightbox (CSS :target) - Zero height when inactive to eliminate any blank page space */
.lightbox {
  position: fixed !important; inset: 0 !important; z-index: 99999 !important; display: none; place-items: center; padding: 4rem 1rem;
  background: rgba(43, 30, 28, .92); backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);
}
.lightbox:target { display: grid !important; }
.lb-backdrop { position: absolute; inset: 0; background: rgba(43, 30, 28, .9); backdrop-filter: blur(10px); cursor: zoom-out; }
.lb-figure { position: relative; max-width: min(1000px, 92vw); }
.lb-figure img { max-height: 76vh; width: auto; margin-inline: auto; border-radius: var(--radius); box-shadow: 0 40px 80px -20px #000; }
.lb-figure figcaption { text-align: center; margin-top: 1rem; color: #fff; font: 400 1.6rem var(--font-display) !important; font-family: var(--font-display) !important; }
.lb-figure small { display: block; font: 500 .7rem var(--font-body) !important; font-family: var(--font-body) !important; letter-spacing: .2em; text-transform: uppercase; color: var(--accent-2); }
.lb-nav, .lb-close {
  position: absolute; z-index: 2; display: grid; place-items: center; width: 52px; height: 52px; border-radius: 50%;
  border: 1px solid rgba(255, 255, 255, .35); color: #fff; font-size: 1.2rem; transition: background .3s, color .3s, transform .3s var(--ease);
}
.lb-nav:hover, .lb-close:hover { background: #fff; color: var(--accent); }
.lb-prev { left: clamp(.5rem, 3vw, 2rem); top: 50%; translate: 0 -50%; }
.lb-next { right: clamp(.5rem, 3vw, 2rem); top: 50%; translate: 0 -50%; }
.lb-close { top: 1.25rem; right: 1.25rem; }

/* Testimonials */
.testimonials { overflow: hidden; }
.t-row { overflow: hidden; padding-block: .6rem; mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent); }
.t-track { display: flex; gap: 1.2rem; width: max-content; animation: tMove 45s linear infinite; }
.t-row-reverse .t-track { animation-direction: reverse; animation-duration: 52s; }
.t-row:hover .t-track { animation-play-state: paused; }
@keyframes tMove { to { transform: translateX(calc(-50% - .6rem)); } }
.t-card {
  width: clamp(280px, 30vw, 380px); padding: 1.8rem; background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius);
  transition: transform .5s var(--ease), box-shadow .5s, border-color .5s;
}
.t-card:hover { transform: translateY(-6px) rotate(-1deg); border-color: var(--accent-2); box-shadow: 0 25px 50px -30px rgba(80, 40, 30, .5); }
.t-card p { font: 400 1.35rem/1.35 var(--font-display) !important; font-family: var(--font-display) !important; margin-block: .7rem 1rem; }
.t-card cite { font-style: normal; font-size: .85rem !important; color: var(--accent); font-weight: 500 !important; font-family: var(--font-body) !important; letter-spacing: .05em; }

/* FAQ */
.faq { background: var(--bg-2); }
.faq-grid { display: grid; grid-template-columns: .8fr 1.2fr; gap: clamp(2.5rem, 6vw, 5rem); align-items: start; }
.faq-grid .muted { margin-bottom: 2rem; max-width: 36ch; font-family: var(--font-body) !important; }
.faq-list { display: grid; gap: .9rem; }
details { background: var(--surface); border-radius: 18px; border: 1px solid var(--line); transition: border-color .4s, box-shadow .4s; }
details[open] { border-color: var(--accent-2); box-shadow: 0 20px 40px -30px rgba(80, 40, 30, .5); }
summary {
  list-style: none; cursor: pointer; padding: 1.3rem 4rem 1.3rem 1.5rem; position: relative;
  font: 500 1.35rem/1.3 var(--font-display) !important; font-family: var(--font-display) !important;
}
summary::-webkit-details-marker { display: none; }
summary::after {
  content: "+"; position: absolute; right: 1.2rem; top: 50%; translate: 0 -50%; width: 34px; height: 34px; border-radius: 50%;
  display: grid; place-items: center; background: var(--blush); color: var(--accent); font: 400 1.3rem var(--font-body) !important; transition: transform .5s var(--ease), background .4s, color .4s;
}
details[open] summary::after { transform: rotate(135deg); background: var(--accent); color: #fff; }
details p { padding: 0 1.5rem 1.4rem; color: var(--muted); font-family: var(--font-body) !important; font-size: var(--fs-body) !important; font-weight: 300 !important; }

/* Booking */
.book-card {
  display: grid; grid-template-columns: 1fr 1fr; gap: clamp(2rem, 5vw, 4rem); padding: clamp(2rem, 5vw, 4rem);
  border-radius: calc(var(--radius) + 10px); background: var(--ink); color: var(--bg); position: relative; overflow: hidden; isolation: isolate;
}
.book-card::before, .book-card::after { content: ""; position: absolute; z-index: -1; border-radius: 50%; filter: blur(30px); animation: morph 12s ease-in-out infinite alternate; }
.book-card::before { width: 420px; height: 420px; left: -120px; top: -160px; background: rgba(181, 105, 90, .45); }
.book-card::after { width: 340px; height: 340px; right: -100px; bottom: -140px; background: rgba(201, 162, 107, .3); animation-delay: -5s; }
.book-info .section-title { color: var(--bg); }
.book-info > p:not(.eyebrow) { color: rgba(251, 246, 242, .7); margin-bottom: 2rem; font-family: var(--font-body) !important; font-weight: 300 !important; }
.book-info .eyebrow { color: var(--accent-2); }
.contact-list { display: grid; gap: 1.1rem; }
.contact-list li { display: grid; grid-template-columns: 70px 1fr; gap: 1rem; font-size: .95rem !important; font-family: var(--font-body) !important; font-weight: 300 !important; padding-bottom: 1.1rem; border-bottom: 1px solid rgba(255, 255, 255, .1); }
.contact-list span { color: var(--accent-2); font-size: .72rem !important; font-family: var(--font-body) !important; letter-spacing: .18em; text-transform: uppercase; padding-top: .2rem; }
.contact-list a:hover { color: var(--accent-2); }
.book-form { display: grid; gap: 1rem; background: var(--bg); color: var(--ink); padding: clamp(1.5rem, 3.5vw, 2.4rem); border-radius: var(--radius); }
.field { position: relative; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.field input, .field select, .field textarea {
  width: 100%; padding: 1.45rem 1rem .55rem; background: var(--surface); color: var(--ink); border: 1px solid var(--line); border-radius: 12px;
  font: inherit; font-size: 1rem !important; font-family: var(--font-body) !important; appearance: none; transition: border-color .3s, box-shadow .3s; resize: vertical; box-sizing: border-box;
}
.field select {
  background-image: linear-gradient(45deg, transparent 50%, var(--accent) 50%), linear-gradient(135deg, var(--accent) 50%, transparent 50%);
  background-position: calc(100% - 22px) 55%, calc(100% - 16px) 55%; background-size: 6px 6px; background-repeat: no-repeat;
}
.field label { position: absolute; left: 1rem; top: 1rem; color: var(--muted); pointer-events: none; transition: all .3s var(--ease); font-family: var(--font-body) !important; }
.field input:focus + label, .field input:not(:placeholder-shown) + label,
.field textarea:focus + label, .field textarea:not(:placeholder-shown) + label,
.field label.fixed { top: .4rem; font-size: .7rem !important; font-family: var(--font-body) !important; letter-spacing: .1em; text-transform: uppercase; color: var(--accent); }
.field input:focus, .field select:focus, .field textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 4px rgba(181, 105, 90, .15); }

/* Instagram strip */
.insta { padding-bottom: var(--section); overflow: hidden; }
.insta-tag { text-align: center; margin-bottom: 1.6rem; font: italic 400 1.5rem var(--font-display) !important; font-family: var(--font-display) !important; }
.insta-tag a { color: var(--accent); border-bottom: 1px solid currentColor; }
.insta-track { display: flex; gap: .8rem; width: max-content; animation: tMove 55s linear infinite; }
.insta-row:hover .insta-track { animation-play-state: paused; }
.insta-track img { width: clamp(150px, 16vw, 220px); aspect-ratio: 1; object-fit: cover; border-radius: 16px; transition: transform .5s var(--ease), filter .5s; filter: saturate(.85); }
.insta-track img:hover { transform: scale(1.05) rotate(-2deg); filter: none; }

/* Footer */
.site-footer {
  background: var(--ink) !important;
  color: var(--bg) !important;
  padding-block: 4.5rem 6rem;
  margin-bottom: 0 !important;
}
[data-wto-section="sec-rose-footer"],
[data-wto-shared="footer"] {
  transform: none !important;
  animation: none !important;
  margin-bottom: 0 !important;
}
.footer-grid { display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.4fr; gap: 2.5rem; padding-bottom: 3rem; border-bottom: 1px solid rgba(255, 255, 255, .1); }
.site-footer .brand-name { color: var(--bg) !important; font-size: 2.2rem !important; font-family: var(--font-display) !important; font-weight: 500 !important; }
.site-footer .brand-name em { color: var(--accent-2); }
.site-footer .muted { color: rgba(251, 246, 242, .6); margin-top: .8rem; font-size: .92rem !important; font-family: var(--font-body) !important; font-weight: 300 !important; }
.site-footer h4 { font-size: 1.4rem !important; margin-bottom: 1rem; color: var(--accent-2); font-family: var(--font-display) !important; font-weight: 400 !important; }
.footer-grid > div > a:not(.brand) { display: block; color: rgba(251, 246, 242, .7); margin-bottom: .5rem; font-size: .95rem !important; font-family: var(--font-body) !important; font-weight: 300 !important; transition: color .3s, transform .3s var(--ease); }
.footer-grid > div > a:not(.brand):hover { color: #fff; transform: translateX(4px); }
.newsletter { display: flex; margin-top: 1rem; border-bottom: 1px solid rgba(255, 255, 255, .3); transition: border-color .3s; }
.newsletter:focus-within { border-color: var(--accent-2); }
.newsletter input { flex: 1; background: none; border: 0; padding: .8rem 0; color: #fff; font: inherit; outline: none; font-family: var(--font-body) !important; font-weight: 300 !important; }
.newsletter input::placeholder { color: rgba(251, 246, 242, .45); }
.newsletter button { background: none; border: 0; color: var(--accent-2); font-size: 1.3rem; cursor: pointer; transition: transform .3s var(--ease); }
.newsletter button:hover { transform: translateX(5px); }
.footer-bottom { display: flex; justify-content: space-between; align-items: center; gap: 1rem; flex-wrap: wrap; padding-top: 2rem; font-size: .85rem !important; color: rgba(251, 246, 242, .55); font-family: var(--font-body) !important; font-weight: 300 !important; }
.socials { display: flex; flex-wrap: wrap; gap: 1.2rem; }
.socials a:hover { color: var(--accent-2); }

/* Floating buttons */
.to-top, .float-book { position: fixed !important; z-index: 9999 !important; transition: transform .35s var(--ease), opacity .3s; }
.to-top { right: 1.5rem; bottom: 1.5rem; width: 48px; height: 48px; border-radius: 50%; display: grid; place-items: center; background: var(--ink); color: var(--bg); box-shadow: 0 10px 25px rgba(43,30,28,.35); }
.float-book {
  left: 1.5rem; bottom: 1.5rem; padding: .8rem 1.3rem; border-radius: 999px; background: var(--accent); color: #fff; font-weight: 500 !important; font-family: var(--font-body) !important; font-size: .9rem !important;
  box-shadow: 0 14px 30px -12px rgba(181, 105, 90, .8);
}
.float-book::after { content: ""; position: absolute; inset: 0; border-radius: inherit; border: 2px solid var(--accent); animation: pulse 2.2s ease-out infinite; }
.to-top:hover, .float-book:hover { transform: translateY(-4px); }

/* Responsive adjustments */
@media (max-width: 1024px) {
  .main-nav { gap: 1.3rem; }
  .fc-1 { left: -6%; } .fc-2 { right: -4%; }
}
@media (max-width: 960px) {
  .hero-grid, .about-grid, .transform-grid, .faq-grid, .book-card { grid-template-columns: 1fr; }
  .hero { padding-top: 5rem; }
  .hero-visual { width: min(85%, 420px); margin-top: 1rem; }
  .about-media { max-width: 520px; }
  .service-grid, .plans, .team-grid { grid-template-columns: 1fr 1fr; }
  .plans .plan-featured { grid-column: 1 / -1; order: -1; }
  .team-grid .member:last-child { grid-column: 1 / -1; max-width: calc(50% - .8rem); justify-self: center; }
  .steps { grid-template-columns: 1fr 1fr; row-gap: 3rem; }
  .steps::before { display: none; }
  .footer-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 860px) {
  .burger { display: block; }
  .main-nav {
    position: fixed; inset: 0; flex-direction: column; justify-content: center; gap: 1.5rem; background: rgba(251, 246, 242, .97); backdrop-filter: blur(10px);
    clip-path: circle(0 at calc(100% - 42px) 42px); transition: clip-path .7s var(--ease);
  }
  .main-nav a:not(.btn) { font: 400 2.2rem var(--font-display); color: var(--ink); opacity: 0; transform: translateY(20px); transition: all .5s var(--ease); }
  .main-nav a:not(.btn)::after { display: none; }
  .nav-toggle:checked ~ .site-header .main-nav { clip-path: circle(150% at calc(100% - 42px) 42px); }
  .nav-toggle:checked ~ .site-header .main-nav a { opacity: 1; transform: none; }
  .nav-toggle:checked ~ .site-header .burger span:nth-child(1) { transform: translateY(6px) rotate(45deg); }
  .nav-toggle:checked ~ .site-header .burger span:nth-child(2) { opacity: 0; }
  .nav-toggle:checked ~ .site-header .burger span:nth-child(3) { transform: translateY(-6px) rotate(-45deg); }
}
@media (max-width: 640px) {
  .service-grid, .plans, .team-grid, .checks { grid-template-columns: 1fr; }
  .team-grid .member:last-child { max-width: none; }
  .stats { grid-template-columns: repeat(2, 1fr); row-gap: 1.5rem; }
  .field-row, .footer-grid { grid-template-columns: 1fr; }
  .fc-1 { left: -8%; top: 12%; } .fc-2 { right: -8%; bottom: 8%; }
  .float-card { padding: .6rem .9rem .6rem .6rem; } .fc-icon { width: 30px; height: 30px; }
  .spin-badge { width: 92px; height: 92px; right: -8%; }
  .exp-badge { left: .5rem; bottom: 1.5rem; }
  .g-grid { columns: 2; column-gap: .7rem; } .g-item { margin-bottom: .7rem; }
  .g-cap, .g-item::after { opacity: 1; transform: none; } .g-cap { font-size: 1.05rem; left: .8rem; bottom: .7rem; }
  .g-item::before { display: none; }
  .lb-nav { top: auto; bottom: 1.25rem; translate: none; }
  .lb-prev { left: calc(50% - 64px); } .lb-next { right: calc(50% - 64px); }
  .float-book span { display: none; }
}
`.trim();

// =============================================================
// MODULAR PAGE SECTIONS FOR ROSÉ ATELIER
// =============================================================
export const ROSE_BEAUTY_SECTIONS: PageSection[] = [
  // 1. HEADER NAVIGATION
  {
    id: "sec-rose-header",
    templateId: "",
    name: "Header Navigation",
    html: `
<input type="checkbox" id="nav-toggle" class="nav-toggle" aria-hidden="true">
<header class="site-header">
  <div class="container header-inner">
    <a href="#top" class="brand" aria-label="Rosé Atelier home">
      <svg class="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" stroke="currentColor" stroke-width="1.2"/>
        <g class="petals" fill="currentColor">
          <path d="M20 8c3.6 3.6 3.6 8.4 0 12-3.6-3.6-3.6-8.4 0-12z"/>
          <path d="M11 15.5c5 0 8.6 3.4 9 9-5-.2-8.8-3.8-9-9z" opacity=".75"/>
          <path d="M29 15.5c-.2 5.2-4 8.8-9 9 .4-5.6 4-9 9-9z" opacity=".75"/>
        </g>
        <path d="M20 24.5v7" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/>
      </svg>
      <span class="brand-name">Rosé <em>Atelier</em></span>
    </a>

    <label for="nav-toggle" class="burger" aria-label="Open menu"><span></span><span></span><span></span></label>

    <nav class="main-nav" aria-label="Primary" onclick="if(event.target.closest('a'))document.getElementById('nav-toggle').checked=false">
      <a href="#about">About</a>
      <a href="#services">Services</a>
      <a href="#pricing">Pricing</a>
      <a href="#team">Team</a>
      <a href="#gallery">Gallery</a>
      <a href="#faq">FAQ</a>
      <a href="#book" class="btn btn-small">Book now</a>
    </nav>
  </div>
</header>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 2. HERO
  {
    id: "sec-rose-hero",
    templateId: "",
    name: "Hero Showcase",
    html: `
<section class="hero" id="top">
  <div class="blob blob-1" aria-hidden="true"></div>
  <div class="blob blob-2" aria-hidden="true"></div>

  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow fade-in" style="--d:.1s">Hair · Skin · Nails · Bridal</p>
      <h1 class="hero-title">
        <span class="line"><span style="--d:.2s">Where beauty</span></span>
        <span class="line"><span style="--d:.35s">feels like <em>you</em>,</span></span>
        <span class="line"><span style="--d:.5s">only <em class="shimmer">softer.</em></span></span>
      </h1>
      <p class="hero-lead fade-in" style="--d:.7s">An intimate studio for hair artistry, skin rituals and bridal glam — thoughtful consultations, premium products and hands that genuinely care.</p>
      <div class="hero-cta fade-in" style="--d:.85s">
        <a href="#book" class="btn">Book an appointment</a>
        <a href="#services" class="btn btn-ghost">View services</a>
      </div>
      <ul class="hero-proof fade-in" style="--d:1s">
        <li>
          <div class="avatars">
            <span style="background-image: url('${BEAUTY_SALON_ASSETS.team1}')"></span>
            <span style="background-image: url('${BEAUTY_SALON_ASSETS.team2}')"></span>
            <span style="background-image: url('${BEAUTY_SALON_ASSETS.g3}')"></span>
            <span style="background: var(--accent);">+</span>
          </div>
        </li>
        <li><strong>2,400+</strong><span>happy clients</span></li>
        <li><strong>4.9 <i class="stars" aria-label="5 stars">★★★★★</i></strong><span>Google reviews</span></li>
      </ul>
    </div>

    <div class="hero-visual">
      <div class="arch"><img src="${BEAUTY_SALON_ASSETS.hero}" alt="Woman with glossy wavy hair and glowing skin"></div>
      <div class="arch-outline" aria-hidden="true"></div>
      <div class="float-card fc-1"><span class="fc-icon">✦</span><div><strong>Bridal Glam</strong><small>Booking for 2026–27</small></div></div>
      <div class="float-card fc-2"><span class="fc-icon">♡</span><div><strong>Organic products</strong><small>Cruelty-free brands</small></div></div>
      <div class="spin-badge" aria-hidden="true">
        <svg viewBox="0 0 120 120"><defs><path id="c1" d="M60,60 m-45,0 a45,45 0 1,1 90,0 a45,45 0 1,1 -90,0"/></defs>
          <text><textPath href="#c1">book your glow · book your glow · </textPath></text></svg>
        <span>✿</span>
      </div>
      <svg class="sparkle sp-1" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z"/></svg>
      <svg class="sparkle sp-2" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z"/></svg>
      <svg class="sparkle sp-3" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c1 7 5 11 12 12-7 1-11 5-12 12-1-7-5-11-12-12 7-1 11-5 12-12z"/></svg>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 3. SERVICE MARQUEE
  {
    id: "sec-rose-marquee",
    templateId: "",
    name: "Service Marquee",
    html: `
<div class="marquee" aria-hidden="true">
  <div class="marquee-track">
    <span>Balayage</span><i>✿</i><span>Keratin</span><i>✿</i><span>HydraFacial</span><i>✿</i><span>Bridal Makeup</span><i>✿</i><span>Gel Nails</span><i>✿</i><span>Lash Lift</span><i>✿</i>
    <span>Balayage</span><i>✿</i><span>Keratin</span><i>✿</i><span>HydraFacial</span><i>✿</i><span>Bridal Makeup</span><i>✿</i><span>Gel Nails</span><i>✿</i><span>Lash Lift</span><i>✿</i>
  </div>
</div>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 4. ABOUT THE STUDIO
  {
    id: "sec-rose-about",
    templateId: "",
    name: "About Studio",
    html: `
<section id="about" class="section about">
  <div class="container about-grid">
    <div class="about-media reveal">
      <img src="${BEAUTY_SALON_ASSETS.about}" alt="Inside the Rosé Atelier salon with arched mirrors and velvet chairs" loading="lazy">
      <div class="exp-badge"><strong>10</strong><span>years of<br>craft</span></div>
    </div>
    <div class="about-copy">
      <p class="eyebrow reveal">About the studio</p>
      <h2 class="section-title reveal">A calm space for <em>beautiful</em> transformations.</h2>
      <p class="reveal">Rosé Atelier was founded on a simple idea — beauty services should feel like self-care, not a chore. Every visit begins with a consultation, so we understand your hair, skin and lifestyle before we pick up a single brush.</p>
      <ul class="checks reveal">
        <li>Certified, internationally trained artists</li>
        <li>Premium, cruelty-free product brands</li>
        <li>Hospital-grade hygiene &amp; single-use kits</li>
        <li>Complimentary consultation on every service</li>
      </ul>
      <ul class="stats reveal">
        <li><strong>10+</strong><span>Years</span></li>
        <li><strong>18</strong><span>Experts</span></li>
        <li><strong>65+</strong><span>Services</span></li>
        <li><strong>900+</strong><span>Brides</span></li>
      </ul>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 5. SERVICES
  {
    id: "sec-rose-services",
    templateId: "",
    name: "Services Menu",
    html: `
<section id="services" class="section services">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow reveal">Our services</p>
      <h2 class="section-title reveal">Everything you need to <em>glow</em></h2>
    </div>
    <div class="service-grid">
      <article class="service reveal">
        <svg class="s-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="14" cy="36" r="6"/><circle cx="34" cy="36" r="6"/><path d="M18 31 38 6M30 31 10 6"/></svg>
        <h3>Hair Styling</h3>
        <p>Precision cuts, blow-dry bars, curls and red-carpet updos tailored to your face.</p>
        <span class="s-price">from ₹800</span><span class="s-arrow">→</span>
      </article>
      <article class="service reveal">
        <svg class="s-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M24 4c8 10 12 17 12 24a12 12 0 0 1-24 0c0-7 4-14 12-24z"/><path d="M18 30a6 6 0 0 0 6 6"/></svg>
        <h3>Colour &amp; Balayage</h3>
        <p>Hand-painted balayage, global colour and gloss treatments with ammonia-free colour.</p>
        <span class="s-price">from ₹3,500</span><span class="s-arrow">→</span>
      </article>
      <article class="service reveal">
        <svg class="s-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="24" cy="22" r="14"/><path d="M18 20h.01M30 20h.01M18 28c3 3 9 3 12 0"/><path d="M14 40c3 3 17 3 20 0"/></svg>
        <h3>Skin &amp; Facials</h3>
        <p>HydraFacials, chemical peels and glow rituals designed around your skin type.</p>
        <span class="s-price">from ₹2,200</span><span class="s-arrow">→</span>
      </article>
      <article class="service reveal">
        <svg class="s-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M17 44V22a7 7 0 0 1 14 0v22"/><path d="M19 22c0-6 2-14 5-18 3 4 5 12 5 18"/></svg>
        <h3>Nails &amp; Spa</h3>
        <p>Gel, BIAB and nail art, plus indulgent manicures and pedicures with hot stone.</p>
        <span class="s-price">from ₹1,200</span><span class="s-arrow">→</span>
      </article>
      <article class="service reveal">
        <svg class="s-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M8 40 30 18"/><path d="M30 18c2-6 6-10 10-12-2 4-6 8-12 10"/><path d="M28 16l4 4"/></svg>
        <h3>Makeup &amp; Lashes</h3>
        <p>Party makeup, lash lifts, brow lamination and HD airbrush finishes that last.</p>
        <span class="s-price">from ₹2,500</span><span class="s-arrow">→</span>
      </article>
      <article class="service reveal">
        <svg class="s-icon" viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M24 6l4 10 10 1-8 7 3 10-9-6-9 6 3-10-8-7 10-1z"/><path d="M12 42h24"/></svg>
        <h3>Bridal Studio</h3>
        <p>Pre-bridal packages, trials and wedding-day glam for the bride and her party.</p>
        <span class="s-price">from ₹18,000</span><span class="s-arrow">→</span>
      </article>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 6. BEFORE & AFTER TRANSFORMATION
  {
    id: "sec-rose-transform",
    templateId: "",
    name: "Transformation Slider",
    html: `
<section class="section transform">
  <div class="container transform-grid">
    <div class="transform-copy">
      <p class="eyebrow reveal">Real results</p>
      <h2 class="section-title reveal">See the <em>difference</em> for yourself.</h2>
      <p class="reveal">A dull, frizzy base turned into glossy honey balayage with our signature bond-repair treatment. Drag the handle to compare before and after.</p>
      <a href="#gallery" class="link reveal">See more transformations →</a>
    </div>
    <div class="compare reveal" style="--pos:50%">
      <img src="${BEAUTY_SALON_ASSETS.after}" alt="Hair after treatment: glossy honey balayage" class="compare-img">
      <img src="${BEAUTY_SALON_ASSETS.before}" alt="Hair before treatment: dull and frizzy" class="compare-img compare-before">
      <span class="compare-line" aria-hidden="true"><span class="compare-knob">⟷</span></span>
      <span class="compare-tag tag-b">Before</span>
      <span class="compare-tag tag-a">After</span>
      <input type="range" min="0" max="100" value="50" class="compare-range" aria-label="Compare before and after"
        oninput="this.parentNode.classList.add('touched');this.parentNode.style.setProperty('--pos',this.value+'%')">
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 7. PRICING PACKAGES
  {
    id: "sec-rose-pricing",
    templateId: "",
    name: "Pricing Rituals",
    html: `
<section id="pricing" class="section pricing">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow reveal">Packages</p>
      <h2 class="section-title reveal">Curated rituals, <em>honest</em> pricing</h2>
    </div>

    <div class="plans">
      <article class="plan reveal">
        <h3>Glow Refresh</h3>
        <p class="plan-desc">A quick pick-me-up between big appointments.</p>
        <p class="plan-price"><small>₹</small>2,999</p>
        <ul>
          <li>Wash, blow-dry &amp; style</li>
          <li>Express clean-up facial</li>
          <li>Classic manicure</li>
          <li>Brow shaping</li>
        </ul>
        <a href="#book" class="btn btn-ghost btn-block">Choose plan</a>
      </article>
      <article class="plan plan-featured reveal">
        <span class="ribbon-tag">Most loved</span>
        <h3>Signature Glam</h3>
        <p class="plan-desc">Our full-day ritual for hair, skin and hands.</p>
        <p class="plan-price"><small>₹</small>7,499</p>
        <ul>
          <li>Haircut + gloss treatment</li>
          <li>HydraFacial with LED</li>
          <li>Gel manicure &amp; spa pedicure</li>
          <li>Lash lift &amp; tint</li>
          <li>Complimentary mocktail</li>
        </ul>
        <a href="#book" class="btn btn-block">Choose plan</a>
      </article>
      <article class="plan reveal">
        <h3>Bride-to-Be</h3>
        <p class="plan-desc">A 4-session pre-bridal journey to the big day.</p>
        <p class="plan-price"><small>₹</small>24,999</p>
        <ul>
          <li>4 skin-prep facials</li>
          <li>Hair spa + colour refresh</li>
          <li>Makeup &amp; hair trial</li>
          <li>Body polishing ritual</li>
        </ul>
        <a href="#book" class="btn btn-ghost btn-block">Choose plan</a>
      </article>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 8. PROCESS
  {
    id: "sec-rose-process",
    templateId: "",
    name: "Visit Process",
    html: `
<section class="section process">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow reveal">How it works</p>
      <h2 class="section-title reveal">Your visit, in <em>four</em> easy steps</h2>
    </div>
    <ol class="steps">
      <li class="step reveal"><span class="step-num">01</span><h3>Book online</h3><p>Pick a service, stylist and time that suits you.</p></li>
      <li class="step reveal"><span class="step-num">02</span><h3>Consult</h3><p>We talk through goals, hair history and skin needs.</p></li>
      <li class="step reveal"><span class="step-num">03</span><h3>Relax</h3><p>Sit back with a drink while our artists work.</p></li>
      <li class="step reveal"><span class="step-num">04</span><h3>Glow</h3><p>Leave with aftercare tips and a look you love.</p></li>
    </ol>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 9. TEAM
  {
    id: "sec-rose-team",
    templateId: "",
    name: "Artists & Team",
    html: `
<section id="team" class="section team">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow reveal">Meet the artists</p>
      <h2 class="section-title reveal">The hands behind the <em>magic</em></h2>
    </div>
    <div class="team-grid">
      <article class="member reveal">
        <div class="member-img"><img src="${BEAUTY_SALON_ASSETS.team1}" alt="Hair stylist Priya Kapoor" loading="lazy">
          <div class="member-social"><a href="#" aria-label="Instagram">IG</a><a href="#" aria-label="Pinterest">PT</a><a href="#" aria-label="YouTube">YT</a></div>
        </div>
        <h3>Priya Kapoor</h3><p>Creative Director · Hair</p>
      </article>
      <article class="member reveal">
        <div class="member-img"><img src="${BEAUTY_SALON_ASSETS.team2}" alt="Makeup artist Aisha Khan" loading="lazy">
          <div class="member-social"><a href="#" aria-label="Instagram">IG</a><a href="#" aria-label="Pinterest">PT</a><a href="#" aria-label="YouTube">YT</a></div>
        </div>
        <h3>Aisha Khan</h3><p>Lead Makeup &amp; Bridal Artist</p>
      </article>
      <article class="member reveal">
        <div class="member-img"><img src="${BEAUTY_SALON_ASSETS.team3}" alt="Skin therapist Arjun Mehta" loading="lazy">
          <div class="member-social"><a href="#" aria-label="Instagram">IG</a><a href="#" aria-label="Pinterest">PT</a><a href="#" aria-label="YouTube">YT</a></div>
        </div>
        <h3>Arjun Mehta</h3><p>Senior Skin Therapist</p>
      </article>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 10. GALLERY
  {
    id: "sec-rose-gallery",
    templateId: "",
    name: "Studio Gallery",
    html: `
<section id="gallery" class="section gallery">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow reveal">Gallery</p>
      <h2 class="section-title reveal">Moments from the <em>studio</em></h2>
    </div>

    <div class="g-filter">
      <input type="radio" name="gf" id="gf-all" checked>
      <input type="radio" name="gf" id="gf-hair">
      <input type="radio" name="gf" id="gf-makeup">
      <input type="radio" name="gf" id="gf-nails">
      <input type="radio" name="gf" id="gf-skin">
      <div class="g-chips reveal">
        <label for="gf-all">All</label>
        <label for="gf-hair">Hair</label>
        <label for="gf-makeup">Makeup</label>
        <label for="gf-nails">Nails</label>
        <label for="gf-skin">Skin</label>
      </div>

      <div class="g-grid">
        <a href="#lb-1" class="g-item hair"><img src="${BEAUTY_SALON_ASSETS.g1}" alt="Stylist blow-drying glossy hair" loading="lazy"><span class="g-cap"><small>Hair</small>Signature blow-dry</span></a>
        <a href="#lb-2" class="g-item nails"><img src="${BEAUTY_SALON_ASSETS.g2}" alt="Nude pink manicure with gold accents" loading="lazy"><span class="g-cap"><small>Nails</small>Nude &amp; gold gel</span></a>
        <a href="#lb-3" class="g-item makeup"><img src="${BEAUTY_SALON_ASSETS.g3}" alt="Bride with soft glam makeup" loading="lazy"><span class="g-cap"><small>Makeup</small>Soft bridal glam</span></a>
        <a href="#lb-4" class="g-item skin"><img src="${BEAUTY_SALON_ASSETS.g4}" alt="Client relaxing during a facial" loading="lazy"><span class="g-cap"><small>Skin</small>HydraFacial ritual</span></a>
        <a href="#lb-5" class="g-item skin"><img src="${BEAUTY_SALON_ASSETS.g5}" alt="Luxury skincare products on travertine" loading="lazy"><span class="g-cap"><small>Skin</small>Our skincare edit</span></a>
        <a href="#lb-6" class="g-item hair"><img src="${BEAUTY_SALON_ASSETS.g6}" alt="Braided bridal updo with flowers" loading="lazy"><span class="g-cap"><small>Hair</small>Floral bridal updo</span></a>
        <a href="#lb-7" class="g-item makeup"><img src="${BEAUTY_SALON_ASSETS.g7}" alt="Makeup brushes on a marble vanity" loading="lazy"><span class="g-cap"><small>Makeup</small>The makeup bar</span></a>
        <a href="#lb-8" class="g-item hair"><img src="${BEAUTY_SALON_ASSETS.after}" alt="Glossy honey balayage" loading="lazy"><span class="g-cap"><small>Hair</small>Honey balayage</span></a>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 11. TESTIMONIALS
  {
    id: "sec-rose-testimonials",
    templateId: "",
    name: "Client Love Notes",
    html: `
<section class="section testimonials">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow reveal">Love notes</p>
      <h2 class="section-title reveal">What our clients <em>say</em></h2>
    </div>
  </div>
  <div class="t-row">
    <div class="t-track">
      <blockquote class="t-card"><i class="stars">★★★★★</i><p>“My balayage is exactly what I dreamed of. Priya actually listened!”</p><cite>Neha S.</cite></blockquote>
      <blockquote class="t-card"><i class="stars">★★★★★</i><p>“Best HydraFacial in the city. My skin has never looked this good.”</p><cite>Riya M.</cite></blockquote>
      <blockquote class="t-card"><i class="stars">★★★★★</i><p>“Aisha did my wedding makeup — it lasted 14 hours and looked flawless in every photo.”</p><cite>Simran K.</cite></blockquote>
      <blockquote class="t-card"><i class="stars">★★★★★</i><p>“Spotless, calm and so welcoming. It feels like a mini vacation.”</p><cite>Tanya G.</cite></blockquote>
      <blockquote class="t-card" aria-hidden="true"><i class="stars">★★★★★</i><p>“My balayage is exactly what I dreamed of. Priya actually listened!”</p><cite>Neha S.</cite></blockquote>
      <blockquote class="t-card" aria-hidden="true"><i class="stars">★★★★★</i><p>“Best HydraFacial in the city. My skin has never looked this good.”</p><cite>Riya M.</cite></blockquote>
      <blockquote class="t-card" aria-hidden="true"><i class="stars">★★★★★</i><p>“Aisha did my wedding makeup — it lasted 14 hours and looked flawless in every photo.”</p><cite>Simran K.</cite></blockquote>
      <blockquote class="t-card" aria-hidden="true"><i class="stars">★★★★★</i><p>“Spotless, calm and so welcoming. It feels like a mini vacation.”</p><cite>Tanya G.</cite></blockquote>
    </div>
  </div>
  <div class="t-row t-row-reverse">
    <div class="t-track">
      <blockquote class="t-card"><i class="stars">★★★★★</i><p>“Gel nails that last three weeks without chipping. I'm hooked.”</p><cite>Ishita P.</cite></blockquote>
      <blockquote class="t-card"><i class="stars">★★★★★</i><p>“The pre-bridal package was worth every rupee. Glowing on my big day.”</p><cite>Meera J.</cite></blockquote>
      <blockquote class="t-card"><i class="stars">★★★★★</i><p>“Finally a salon that understands curly hair. Thank you!”</p><cite>Kavya R.</cite></blockquote>
      <blockquote class="t-card"><i class="stars">★★★★★</i><p>“Arjun's peel cleared my skin in just two sessions.”</p><cite>Ananya D.</cite></blockquote>
      <blockquote class="t-card" aria-hidden="true"><i class="stars">★★★★★</i><p>“Gel nails that last three weeks without chipping. I'm hooked.”</p><cite>Ishita P.</cite></blockquote>
      <blockquote class="t-card" aria-hidden="true"><i class="stars">★★★★★</i><p>“The pre-bridal package was worth every rupee. Glowing on my big day.”</p><cite>Meera J.</cite></blockquote>
      <blockquote class="t-card" aria-hidden="true"><i class="stars">★★★★★</i><p>“Finally a salon that understands curly hair. Thank you!”</p><cite>Kavya R.</cite></blockquote>
      <blockquote class="t-card" aria-hidden="true"><i class="stars">★★★★★</i><p>“Arjun's peel cleared my skin in just two sessions.”</p><cite>Ananya D.</cite></blockquote>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 12. FAQ
  {
    id: "sec-rose-faq",
    templateId: "",
    name: "Questions & FAQ",
    html: `
<section id="faq" class="section faq">
  <div class="container faq-grid">
    <div>
      <p class="eyebrow reveal">FAQ</p>
      <h2 class="section-title reveal">Good to <em>know</em></h2>
      <p class="muted reveal">Can't find your answer? Message us on WhatsApp and we'll reply within the hour.</p>
      <a href="#book" class="btn reveal">Ask a question</a>
    </div>
    <div class="faq-list">
      <details class="reveal" open><summary>Do I need to book in advance?</summary><p>We recommend booking 2–3 days ahead for most services, and 2–3 months ahead for bridal. Walk-ins are welcome when slots are free.</p></details>
      <details class="reveal"><summary>Which products do you use?</summary><p>We work with professional, cruelty-free brands for hair colour, care and skin — and we're happy to patch-test before any new treatment.</p></details>
      <details class="reveal"><summary>What is your cancellation policy?</summary><p>Free cancellation or rescheduling up to 12 hours before your appointment. Bridal bookings have a separate policy shared at booking.</p></details>
      <details class="reveal"><summary>Do you offer bridal services at the venue?</summary><p>Yes — our bridal team travels to venues across NCR. Travel charges depend on distance and team size.</p></details>
      <details class="reveal"><summary>Are gift cards available?</summary><p>Absolutely. Digital and printed gift cards are available in any amount and are valid for 12 months.</p></details>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 13. BOOKING FORM
  {
    id: "sec-rose-book",
    templateId: "",
    name: "Appointment Booking",
    html: `
<section id="book" class="section book">
  <div class="container book-card reveal">
    <div class="book-info">
      <p class="eyebrow">Book an appointment</p>
      <h2 class="section-title">Ready for your <em>glow-up</em>?</h2>
      <p>Fill in the form and our concierge will confirm your slot within 30 minutes.</p>
      <ul class="contact-list">
        <li><span>Visit</span>Shop 12, Pari Chowk Plaza, Greater Noida, UP 201310</li>
        <li><span>Call</span><a href="tel:+919876543210">+91 98765 43210</a></li>
        <li><span>Hours</span>Tue – Sun · 10:00 – 20:30 (Mon closed)</li>
      </ul>
    </div>
    <form class="book-form" action="#" method="post" onsubmit="event.preventDefault(); alert('Thank you! Your appointment request has been received. Our concierge will contact you shortly.');">
      <div class="field"><input type="text" id="b-name" name="name" placeholder=" " required><label for="b-name">Full name</label></div>
      <div class="field"><input type="tel" id="b-phone" name="phone" placeholder=" " required><label for="b-phone">Phone number</label></div>
      <div class="field">
        <select id="b-service" name="service" required>
          <option value="hair">Hair styling</option>
          <option value="colour">Colour &amp; balayage</option>
          <option value="skin">Skin &amp; facials</option>
          <option value="nails">Nails &amp; spa</option>
          <option value="makeup">Makeup &amp; lashes</option>
          <option value="bridal">Bridal studio</option>
        </select>
        <label for="b-service" class="fixed">Service</label>
      </div>
      <div class="field-row">
        <div class="field"><input type="date" id="b-date" name="date" required><label for="b-date" class="fixed">Date</label></div>
        <div class="field"><input type="time" id="b-time" name="time" required><label for="b-time" class="fixed">Time</label></div>
      </div>
      <div class="field"><textarea id="b-note" name="note" rows="3" placeholder=" "></textarea><label for="b-note">Anything we should know?</label></div>
      <button type="submit" class="btn btn-block">Request appointment</button>
    </form>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 14. INSTAGRAM STRIP
  {
    id: "sec-rose-insta",
    templateId: "",
    name: "Instagram Feed",
    html: `
<section class="insta">
  <p class="insta-tag reveal">Follow our work <a href="#">@roseatelier</a></p>
  <div class="insta-row" aria-hidden="true">
    <div class="insta-track">
      <img src="${BEAUTY_SALON_ASSETS.g1}" alt=""><img src="${BEAUTY_SALON_ASSETS.g2}" alt=""><img src="${BEAUTY_SALON_ASSETS.g3}" alt=""><img src="${BEAUTY_SALON_ASSETS.g5}" alt=""><img src="${BEAUTY_SALON_ASSETS.g6}" alt=""><img src="${BEAUTY_SALON_ASSETS.g7}" alt=""><img src="${BEAUTY_SALON_ASSETS.g4}" alt=""><img src="${BEAUTY_SALON_ASSETS.after}" alt="">
      <img src="${BEAUTY_SALON_ASSETS.g1}" alt=""><img src="${BEAUTY_SALON_ASSETS.g2}" alt=""><img src="${BEAUTY_SALON_ASSETS.g3}" alt=""><img src="${BEAUTY_SALON_ASSETS.g5}" alt=""><img src="${BEAUTY_SALON_ASSETS.g6}" alt=""><img src="${BEAUTY_SALON_ASSETS.g7}" alt=""><img src="${BEAUTY_SALON_ASSETS.g4}" alt=""><img src="${BEAUTY_SALON_ASSETS.after}" alt="">
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 15. FOOTER
  {
    id: "sec-rose-footer",
    templateId: "",
    name: "Studio Footer",
    html: `
<footer class="site-footer">
  <div class="container">
    <div class="footer-grid">
      <div>
        <a href="#top" class="brand"><span class="brand-name">Rosé <em>Atelier</em></span></a>
        <p class="muted">Hair, skin, nails &amp; bridal beauty studio in Greater Noida.</p>
      </div>
      <div><h4>Studio</h4><a href="#about">About</a><a href="#team">Team</a><a href="#gallery">Gallery</a></div>
      <div><h4>Services</h4><a href="#services">Hair &amp; colour</a><a href="#services">Skin &amp; facials</a><a href="#pricing">Bridal</a></div>
      <div><h4>Newsletter</h4><p class="muted">Offers &amp; beauty tips, monthly.</p>
        <form class="newsletter" action="#" onsubmit="event.preventDefault(); alert('Subscribed to Rosé Atelier updates!');"><input type="email" placeholder="Your email" aria-label="Email" required><button type="submit" aria-label="Subscribe">→</button></form>
      </div>
    </div>
    <div class="footer-bottom">
      <p>© 2026 Rosé Atelier. All rights reserved.</p>
      <nav class="socials" aria-label="Social"><a href="#">Instagram</a><a href="#">Facebook</a><a href="#">Pinterest</a><a href="#">WhatsApp</a></nav>
    </div>
  </div>

  <!-- Floating Controls -->
  <a href="#book" class="float-book" aria-label="Book an appointment">✿ <span>Book</span></a>
  <a href="#top" class="to-top" aria-label="Back to top">↑</a>

  <!-- Gallery Lightbox Popups -->
  <div class="lightbox" id="lb-1" role="dialog" aria-label="Signature blow-dry">
    <a href="#gallery" class="lb-backdrop" aria-label="Close"></a>
    <figure class="lb-figure"><img src="${BEAUTY_SALON_ASSETS.g1}" alt="Stylist blow-drying glossy hair" loading="lazy"><figcaption><small>Hair · 01/08</small>Signature blow-dry</figcaption></figure>
    <a href="#lb-8" class="lb-nav lb-prev" aria-label="Previous photo">←</a>
    <a href="#lb-2" class="lb-nav lb-next" aria-label="Next photo">→</a>
    <a href="#gallery" class="lb-close" aria-label="Close">✕</a>
  </div>
  <div class="lightbox" id="lb-2" role="dialog" aria-label="Nude &amp; gold gel">
    <a href="#gallery" class="lb-backdrop" aria-label="Close"></a>
    <figure class="lb-figure"><img src="${BEAUTY_SALON_ASSETS.g2}" alt="Nude pink manicure with gold accents" loading="lazy"><figcaption><small>Nails · 02/08</small>Nude &amp; gold gel</figcaption></figure>
    <a href="#lb-1" class="lb-nav lb-prev" aria-label="Previous photo">←</a>
    <a href="#lb-3" class="lb-nav lb-next" aria-label="Next photo">→</a>
    <a href="#gallery" class="lb-close" aria-label="Close">✕</a>
  </div>
  <div class="lightbox" id="lb-3" role="dialog" aria-label="Soft bridal glam">
    <a href="#gallery" class="lb-backdrop" aria-label="Close"></a>
    <figure class="lb-figure"><img src="${BEAUTY_SALON_ASSETS.g3}" alt="Bride with soft glam makeup" loading="lazy"><figcaption><small>Makeup · 03/08</small>Soft bridal glam</figcaption></figure>
    <a href="#lb-2" class="lb-nav lb-prev" aria-label="Previous photo">←</a>
    <a href="#lb-4" class="lb-nav lb-next" aria-label="Next photo">→</a>
    <a href="#gallery" class="lb-close" aria-label="Close">✕</a>
  </div>
  <div class="lightbox" id="lb-4" role="dialog" aria-label="HydraFacial ritual">
    <a href="#gallery" class="lb-backdrop" aria-label="Close"></a>
    <figure class="lb-figure"><img src="${BEAUTY_SALON_ASSETS.g4}" alt="Client relaxing during a facial" loading="lazy"><figcaption><small>Skin · 04/08</small>HydraFacial ritual</figcaption></figure>
    <a href="#lb-3" class="lb-nav lb-prev" aria-label="Previous photo">←</a>
    <a href="#lb-5" class="lb-nav lb-next" aria-label="Next photo">→</a>
    <a href="#gallery" class="lb-close" aria-label="Close">✕</a>
  </div>
  <div class="lightbox" id="lb-5" role="dialog" aria-label="Our skincare edit">
    <a href="#gallery" class="lb-backdrop" aria-label="Close"></a>
    <figure class="lb-figure"><img src="${BEAUTY_SALON_ASSETS.g5}" alt="Luxury skincare products" loading="lazy"><figcaption><small>Skin · 05/08</small>Our skincare edit</figcaption></figure>
    <a href="#lb-4" class="lb-nav lb-prev" aria-label="Previous photo">←</a>
    <a href="#lb-6" class="lb-nav lb-next" aria-label="Next photo">→</a>
    <a href="#gallery" class="lb-close" aria-label="Close">✕</a>
  </div>
  <div class="lightbox" id="lb-6" role="dialog" aria-label="Floral bridal updo">
    <a href="#gallery" class="lb-backdrop" aria-label="Close"></a>
    <figure class="lb-figure"><img src="${BEAUTY_SALON_ASSETS.g6}" alt="Braided bridal updo with flowers" loading="lazy"><figcaption><small>Hair · 06/08</small>Floral bridal updo</figcaption></figure>
    <a href="#lb-5" class="lb-nav lb-prev" aria-label="Previous photo">←</a>
    <a href="#lb-7" class="lb-nav lb-next" aria-label="Next photo">→</a>
    <a href="#gallery" class="lb-close" aria-label="Close">✕</a>
  </div>
  <div class="lightbox" id="lb-7" role="dialog" aria-label="The makeup bar">
    <a href="#gallery" class="lb-backdrop" aria-label="Close"></a>
    <figure class="lb-figure"><img src="${BEAUTY_SALON_ASSETS.g7}" alt="Makeup brushes on a marble vanity" loading="lazy"><figcaption><small>Makeup · 07/08</small>The makeup bar</figcaption></figure>
    <a href="#lb-6" class="lb-nav lb-prev" aria-label="Previous photo">←</a>
    <a href="#lb-8" class="lb-nav lb-next" aria-label="Next photo">→</a>
    <a href="#gallery" class="lb-close" aria-label="Close">✕</a>
  </div>
  <div class="lightbox" id="lb-8" role="dialog" aria-label="Honey balayage">
    <a href="#gallery" class="lb-backdrop" aria-label="Close"></a>
    <figure class="lb-figure"><img src="${BEAUTY_SALON_ASSETS.after}" alt="Glossy honey balayage" loading="lazy"><figcaption><small>Hair · 08/08</small>Honey balayage</figcaption></figure>
    <a href="#lb-7" class="lb-nav lb-prev" aria-label="Previous photo">←</a>
    <a href="#lb-1" class="lb-nav lb-next" aria-label="Next photo">→</a>
    <a href="#gallery" class="lb-close" aria-label="Close">✕</a>
  </div>
</footer>
    `.trim(),
    animation: { type: "none", duration: 0, delay: 0 },
  },
];

// =============================================================
// SHARED HEADER & FOOTER DEFINITIONS
// =============================================================
export const ROSE_BEAUTY_SHARED_HEADER: PageSection = {
  ...ROSE_BEAUTY_SECTIONS[0],
  id: SHARED_HEADER_SECTION_ID,
  shared: "header",
  sharedKey: "global-header",
  name: "Header Navigation",
};

export const ROSE_BEAUTY_SHARED_FOOTER: PageSection = {
  ...ROSE_BEAUTY_SECTIONS[ROSE_BEAUTY_SECTIONS.length - 1],
  id: SHARED_FOOTER_SECTION_ID,
  shared: "footer",
  sharedKey: "global-footer",
  name: "Studio Footer",
};

// =============================================================
// MAIN HOME PAGE DEFINITION
// =============================================================
export const ROSE_BEAUTY_HOME_PAGE: Page = {
  id: "page-rose-home",
  name: "Home",
  slug: "home",
  sections: ROSE_BEAUTY_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

// =============================================================
// TEMPLATE EXPORT DEFINITION (MATCHING BUILDER TEMPLATE INTERFACE)
// =============================================================
export const ROSE_BEAUTY_TEMPLATE: Template = {
  id: "tpl-rose-atelier-beauty-salon",
  name: "Rosé Atelier — Hair, Skin & Beauty Studio",
  slug: "rose-atelier-beauty-studio",
  category: "Beauty & Salon",
  description: "An intimate luxury hair artistry, skin rituals, nails, and bridal glam studio template with interactive service menus, before/after compare slider, and online appointment booking.",
  status: "published",
  featured: true,
  isNew: true,
  sortOrder: 1,
  thumbnail: BEAUTY_SALON_ASSETS.preview,
  previewImage: BEAUTY_SALON_ASSETS.hero,
  widgets: [],
  pages: [ROSE_BEAUTY_HOME_PAGE],
  sharedHeader: ROSE_BEAUTY_SHARED_HEADER,
  sharedFooter: ROSE_BEAUTY_SHARED_FOOTER,
  globalCss: ROSE_BEAUTY_GLOBAL_CSS,
  customHead: `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cormorant:ital,wght@0,300..700;1,300..700&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet">
  `.trim(),
  assets: BEAUTY_PROJECT_ASSETS,
  createdBy: "super-admin",
  createdAt: new Date("2026-03-05T00:00:00Z"),
  updatedAt: new Date("2026-03-05T00:00:00Z"),
};
