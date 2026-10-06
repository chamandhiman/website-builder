import { SHARED_HEADER_SECTION_ID, SHARED_FOOTER_SECTION_ID, type Page, type PageSection } from "@/lib/builder/store";
import type { Template } from "./templates";

// =============================================================
// CURATED HIGH-RESOLUTION RESTAURANT & CULINARY ASSETS
// =============================================================
export const SAFFRON_RESTAURANT_ASSETS = {
  hero: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=1600&q=80",
  interior: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=1200&q=80",
  dish1: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=800&q=80",
  dish2: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80",
  dish3: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?auto=format&fit=crop&w=800&q=80",
  g1: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
  g2: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80",
  g3: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
  g4: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80",
  g5: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80",
  g6: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?auto=format&fit=crop&w=800&q=80",
  g7: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80",
  preview: "/templates/saffron-ember-preview.png",
};

// =============================================================
// GLOBAL CSS FOR SAFFRON & EMBER
// =============================================================
export const SAFFRON_GLOBAL_CSS = `
@import url("https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300..700;1,9..144,300..700&family=Outfit:wght@300;400;500;600&display=swap");

:root {
  /* Colours */
  --bg: #15110e;
  --bg-2: #1d1814;
  --surface: #241d18;
  --line: rgba(240, 225, 200, 0.12);
  --text: #f1e7d8;
  --muted: #b3a593;
  --accent: #e0a43a;       /* saffron */
  --accent-2: #c8562f;     /* ember */
  --accent-ink: #1a120a;

  /* Type */
  --font-display: "Fraunces", Georgia, serif;
  --font-body: "Outfit", system-ui, sans-serif;
  --fs-hero: clamp(3rem, 1.2rem + 7.5vw, 7.5rem);
  --fs-h2: clamp(2.1rem, 1.2rem + 3.2vw, 3.8rem);
  --fs-h3: clamp(1.15rem, 1rem + .5vw, 1.4rem);
  --fs-body: clamp(1rem, .95rem + .2vw, 1.1rem);
  --fs-small: .85rem;

  /* Layout */
  --container: 1200px;
  --gutter: clamp(1.25rem, 4vw, 2.5rem);
  --section: clamp(5rem, 10vw, 9rem);
  --radius: 18px;

  /* Motion */
  --ease: cubic-bezier(.22, 1, .36, 1);
  --dur: .9s;
}

/* Reset inside Saffron theme */
html { scroll-behavior: smooth; scroll-padding-top: 80px; -webkit-text-size-adjust: 100%; }
body {
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: 1.65;
  color: var(--text);
  background: var(--bg);
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
}
img { display: block; max-width: 100%; height: auto; }
a { color: inherit; text-decoration: none; }
ul { list-style: none; margin: 0; padding: 0; }
em { font-style: italic; color: var(--accent); }
::selection { background: var(--accent); color: var(--accent-ink); }

.container { width: min(100% - var(--gutter) * 2, var(--container)); margin-inline: auto; }
.section { padding-block: var(--section); position: relative; }

/* Typography */
h1, h2, h3, .footer-big, .brand-name {
  font-family: var(--font-display); font-weight: 400; line-height: 1.05; letter-spacing: -.02em;
}
.section-title { font-size: var(--fs-h2); margin-bottom: 1.5rem; max-width: 16ch; }
.section-head { text-align: center; margin-bottom: clamp(2.5rem, 5vw, 4rem); }
.section-head .section-title { margin-inline: auto; }
.eyebrow {
  font-size: var(--fs-small); text-transform: uppercase; letter-spacing: .25em;
  color: var(--accent); margin-bottom: 1rem; display: inline-flex; align-items: center; gap: .75rem;
}
.eyebrow::before { content: ""; width: 28px; height: 1px; background: currentColor; }
.eyebrow.center { display: flex; justify-content: center; }

/* Buttons */
.btn {
  --bg-btn: var(--accent);
  position: relative; display: inline-flex; align-items: center; justify-content: center; gap: .5rem;
  padding: 1rem 1.9rem; border-radius: 999px; border: 1px solid var(--accent);
  background: var(--bg-btn); color: var(--accent-ink);
  font: 500 .95rem/1 var(--font-body); letter-spacing: .03em; cursor: pointer;
  overflow: hidden; isolation: isolate;
  transition: color .4s var(--ease), transform .4s var(--ease), box-shadow .4s var(--ease);
}
.btn::before {
  content: ""; position: absolute; inset: 0; z-index: -1; background: var(--text);
  transform: translateY(101%); border-radius: inherit; transition: transform .5s var(--ease);
}
.btn:hover { transform: translateY(-2px); box-shadow: 0 12px 30px -10px rgba(224, 164, 58, .55); }
.btn:hover::before { transform: translateY(0); }
.btn-ghost { --bg-btn: transparent; color: var(--text); border-color: rgba(241, 231, 216, .4); }
.btn-ghost:hover { color: var(--accent-ink); border-color: var(--text); }
.btn-small { padding: .65rem 1.3rem; font-size: .85rem; }
.btn-block { width: 100%; }

/* Header */
.nav-toggle { position: absolute; opacity: 0; pointer-events: none; }
.site-header {
  position: sticky; top: 0; z-index: 1000; width: 100%; padding-block: 1.2rem;
  background: rgba(21, 17, 14, 0.94); backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--line);
}
.header-inner { display: flex; align-items: center; justify-content: space-between; gap: 1rem; }
.brand { display: flex; align-items: center; gap: .7rem; color: var(--accent); }
.brand-mark { width: 38px; height: 38px; }
.brand-mark .flame { transform-origin: 50% 80%; animation: flicker 2.6s ease-in-out infinite; }
@keyframes flicker {
  0%, 100% { transform: scale(1, 1) rotate(0); }
  25% { transform: scale(.96, 1.05) rotate(-2deg); }
  50% { transform: scale(1.03, .97) rotate(1.5deg); }
  75% { transform: scale(.98, 1.04) rotate(-1deg); }
}
.brand-name { font-size: 1.35rem; color: var(--text); }
.main-nav { display: flex; align-items: center; gap: 2rem; }
.main-nav a:not(.btn) {
  font-size: .92rem; letter-spacing: .04em; color: var(--muted); position: relative; padding-block: .3rem;
  transition: color .3s;
}
.main-nav a:not(.btn)::after {
  content: ""; position: absolute; left: 0; bottom: 0; width: 100%; height: 1px; background: var(--accent);
  transform: scaleX(0); transform-origin: right; transition: transform .4s var(--ease);
}
.main-nav a:not(.btn):hover { color: var(--text); }
.main-nav a:not(.btn):hover::after { transform: scaleX(1); transform-origin: left; }
.burger { display: none; width: 44px; height: 44px; cursor: pointer; position: relative; z-index: 60; }
.burger span {
  position: absolute; left: 10px; right: 10px; height: 1.5px; background: var(--text);
  transition: transform .45s var(--ease), opacity .3s;
}
.burger span:nth-child(1) { top: 15px; }
.burger span:nth-child(2) { top: 21px; }
.burger span:nth-child(3) { top: 27px; }

/* Hero */
.hero {
  position: relative; min-height: 90vh; display: grid; align-items: center;
  padding-block: 8rem 6rem; overflow: hidden; background: var(--bg);
}
.hero-media { position: absolute; inset: 0; z-index: 0; pointer-events: none; }
.hero-media img {
  width: 100%; height: 100%; object-fit: cover;
  animation: kenburns 24s ease-in-out infinite alternate;
}
.hero-media::after {
  content: ""; position: absolute; inset: 0;
  background:
    linear-gradient(90deg, rgba(21,17,14,.95) 0%, rgba(21,17,14,.75) 40%, rgba(21,17,14,.35) 100%),
    linear-gradient(0deg, var(--bg) 0%, transparent 40%);
}
@keyframes kenburns { from { transform: scale(1.05); } to { transform: scale(1.15) translate(-1%, -1%); } }

.smoke {
  position: absolute; bottom: -20%; width: 40vw; height: 40vw; border-radius: 50%; z-index: 1;
  background: radial-gradient(circle, rgba(255, 240, 220, .14), transparent 65%);
  filter: blur(30px); animation: smoke 14s linear infinite; opacity: 0; pointer-events: none;
}
.s1 { left: 55%; }
.s2 { left: 70%; animation-delay: 4.5s; }
.s3 { left: 40%; animation-delay: 9s; }
@keyframes smoke {
  0% { transform: translateY(0) scale(.6); opacity: 0; }
  20% { opacity: 1; }
  100% { transform: translateY(-110vh) scale(1.6) translateX(5vw); opacity: 0; }
}

.embers { position: absolute; inset: 0; z-index: 1; pointer-events: none; overflow: hidden; }
.embers i {
  position: absolute; bottom: -10px; left: var(--x); width: var(--s, 4px); height: var(--s, 4px); border-radius: 50%;
  background: radial-gradient(circle, #ffd27a 0%, var(--accent) 45%, rgba(200, 86, 47, 0) 70%);
  box-shadow: 0 0 10px 2px rgba(224, 164, 58, .6);
  animation: ember var(--t, 9s) linear infinite; animation-delay: var(--dl, 0s); opacity: 0;
}
.embers i:nth-child(1)  { --x: 52%; --s: 4px; --t: 8s;  --dl: 0s;   --dx: 40px; }
.embers i:nth-child(2)  { --x: 60%; --s: 3px; --t: 10s; --dl: 1.5s; --dx: -30px; }
.embers i:nth-child(3)  { --x: 68%; --s: 5px; --t: 9s;  --dl: 3s;   --dx: 60px; }
.embers i:nth-child(4)  { --x: 75%; --s: 3px; --t: 11s; --dl: .8s;  --dx: -50px; }
.embers i:nth-child(5)  { --x: 82%; --s: 4px; --t: 8.5s;--dl: 4.2s; --dx: 30px; }
.embers i:nth-child(6)  { --x: 90%; --s: 2px; --t: 12s; --dl: 2.2s; --dx: -20px; }
@keyframes ember {
  0%   { transform: translate(0, 0) scale(1); opacity: 0; }
  10%  { opacity: 1; }
  50%  { transform: translate(calc(var(--dx) * -.5), -50vh) scale(.8); }
  80%  { opacity: .8; }
  100% { transform: translate(var(--dx), -100vh) scale(.3); opacity: 0; }
}

.hero-content { position: relative; z-index: 2; }
.hero-title { font-size: var(--fs-hero); font-weight: 300; margin-bottom: 1.8rem; }
.hero-title .line { display: block; }
.hero-lead { max-width: 46ch; color: var(--muted); font-size: clamp(1.05rem, 1rem + .3vw, 1.25rem); margin-bottom: 2.5rem; }
.hero-cta { display: flex; flex-wrap: wrap; gap: 1rem; }
.shimmer {
  background: linear-gradient(110deg, var(--accent) 0%, #ffe3a3 22%, var(--accent) 40%, var(--accent-2) 70%, var(--accent) 100%);
  background-size: 250% 100%; -webkit-background-clip: text; background-clip: text; color: transparent;
  animation: shimmer 6s linear infinite; padding-right: .06em;
}
@keyframes shimmer { to { background-position: -250% 0; } }

/* Marquee */
.marquee {
  overflow: hidden; border-block: 1px solid var(--line); background: var(--bg-2);
  padding-block: 1.4rem; white-space: nowrap; position: relative; z-index: 2;
}
.marquee-track { display: inline-flex; align-items: center; gap: 2.5rem; animation: marquee 30s linear infinite; }
.marquee:hover .marquee-track { animation-play-state: paused; }
.marquee span { font-family: var(--font-display); font-size: clamp(1.6rem, 1rem + 2.4vw, 2.8rem); font-style: italic; font-weight: 300; }
.marquee i { color: var(--accent); font-style: normal; font-size: 1.2rem; display: inline-block; }
@keyframes marquee { to { transform: translateX(calc(-50% - 1.25rem)); } }

/* About */
.about { background: var(--bg); }
.about-grid { display: grid; grid-template-columns: 1.05fr 1fr; gap: clamp(3rem, 7vw, 6rem); align-items: center; }
.about-media { position: relative; }
.about-media img {
  border-radius: var(--radius); aspect-ratio: 4 / 5; object-fit: cover; width: 100%;
  transition: transform 1.2s var(--ease); filter: saturate(.9);
}
.about-media:hover img { transform: scale(1.02); filter: saturate(1.1); }
.about-media::before {
  content: ""; position: absolute; inset: 1.5rem -1.5rem -1.5rem 1.5rem; border: 1px solid var(--accent);
  border-radius: var(--radius); z-index: -1; opacity: .5;
}
.badge-spin {
  position: absolute; right: -2.5rem; bottom: 3rem; width: 130px; height: 130px;
  background: var(--accent); color: var(--accent-ink); border-radius: 50%; display: grid; place-items: center;
}
.badge-spin svg { position: absolute; inset: 0; animation: spin 16s linear infinite; }
.badge-spin text { font: 500 10.5px var(--font-body); letter-spacing: .22em; text-transform: uppercase; fill: currentColor; }
.badge-core { font-size: 1.6rem; }
@keyframes spin { to { transform: rotate(360deg); } }
.about-copy p:not(.eyebrow) { color: var(--muted); margin-bottom: 1.2rem; max-width: 52ch; }
.stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; margin-top: 2.5rem; padding-top: 2rem; border-top: 1px solid var(--line); }
.stats strong { display: block; font: 300 clamp(2rem, 1.5rem + 2vw, 3rem)/1 var(--font-display); color: var(--accent); }
.stats sup { font-size: .5em; }
.stats span { font-size: var(--fs-small); color: var(--muted); }

/* Menu */
.menu { background: var(--bg-2); }
.tabs > input { position: absolute; opacity: 0; pointer-events: none; }
.tab-labels {
  --i: 0;
  position: relative; display: grid; grid-template-columns: repeat(4, 1fr);
  max-width: 560px; margin: 0 auto 3.5rem; padding: .35rem; border-radius: 999px;
  background: var(--surface); border: 1px solid var(--line);
}
.tab-labels label {
  position: relative; z-index: 1; text-align: center; padding: .8rem .5rem; cursor: pointer;
  font-size: .92rem; color: var(--muted); border-radius: 999px; transition: color .4s var(--ease);
}
.tab-labels label:hover { color: var(--text); }
.tab-indicator {
  position: absolute; top: .35rem; bottom: .35rem; left: .35rem; width: calc((100% - .7rem) / 4);
  background: var(--accent); border-radius: 999px; transform: translateX(calc(var(--i) * 100%));
  transition: transform .55s var(--ease);
}
#tab-start:checked ~ .tab-labels { --i: 0; }
#tab-main:checked  ~ .tab-labels { --i: 1; }
#tab-sweet:checked ~ .tab-labels { --i: 2; }
#tab-drink:checked ~ .tab-labels { --i: 3; }
#tab-start:checked ~ .tab-labels label[for="tab-start"],
#tab-main:checked  ~ .tab-labels label[for="tab-main"],
#tab-sweet:checked ~ .tab-labels label[for="tab-sweet"],
#tab-drink:checked ~ .tab-labels label[for="tab-drink"] { color: var(--accent-ink); font-weight: 600; }

.tab-panels { display: grid; }
.panel {
  grid-area: 1 / 1; display: grid; grid-template-columns: repeat(2, 1fr); gap: 0 4rem;
  visibility: hidden; opacity: 0; transform: translateY(20px);
  transition: opacity .5s var(--ease), transform .6s var(--ease), visibility 0s .5s;
}
#tab-start:checked ~ .tab-panels .panel-start,
#tab-main:checked  ~ .tab-panels .panel-main,
#tab-sweet:checked ~ .tab-panels .panel-sweet,
#tab-drink:checked ~ .tab-panels .panel-drink {
  visibility: visible; opacity: 1; transform: none; transition-delay: 0s;
}
.panel li {
  display: flex; justify-content: space-between; align-items: baseline; gap: 1.5rem;
  padding: 1.5rem 0; border-bottom: 1px dashed var(--line); transition: padding .4s var(--ease);
}
.panel li:hover { padding-left: .6rem; }
.panel h3 { font-size: var(--fs-h3); margin-bottom: .3rem; transition: color .3s; }
.panel li:hover h3 { color: var(--accent); }
.panel p { color: var(--muted); font-size: .95rem; line-height: 1.5; }
.price { font: 400 1.15rem var(--font-display); color: var(--accent); white-space: nowrap; }
.tag {
  display: inline-block; vertical-align: middle; margin-left: .4rem; padding: .15rem .55rem;
  font: 500 .65rem/1.4 var(--font-body); letter-spacing: .1em; text-transform: uppercase;
  border: 1px solid var(--accent); color: var(--accent); border-radius: 999px;
}

/* Signatures */
.signature { background: var(--bg); }
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: clamp(1.25rem, 2.5vw, 2rem); }
.card {
  background: var(--surface); border: 1px solid var(--line); border-radius: var(--radius); overflow: hidden;
  transition: transform .6s var(--ease), border-color .4s, box-shadow .6s var(--ease);
}
.card:hover { transform: translateY(-8px); border-color: rgba(224, 164, 58, .45); box-shadow: 0 30px 60px -25px rgba(0, 0, 0, .7); }
.card-img { overflow: hidden; aspect-ratio: 1; position: relative; }
.card-img img { width: 100%; height: 100%; object-fit: cover; transition: transform 1.2s var(--ease); }
.card:hover .card-img img { transform: scale(1.08); }
.card-body { padding: 1.6rem 1.6rem 1.9rem; position: relative; }
.card-num { position: absolute; right: 1.6rem; top: 1.4rem; font: italic 300 1rem var(--font-display); color: var(--muted); }
.card h3 { font-size: 1.5rem; margin-bottom: .6rem; }
.card p { color: var(--muted); font-size: .95rem; margin-bottom: 1.2rem; }

/* Gallery Bento */
.gallery { background: var(--bg-2); padding-bottom: clamp(3rem, 6vw, 5rem); overflow: hidden; }
.g-grid {
  display: grid; gap: clamp(.6rem, 1.2vw, 1rem);
  grid-template-columns: repeat(4, 1fr);
  grid-auto-rows: clamp(150px, 18vw, 240px);
  grid-template-areas:
    "a b b c"
    "a d e c"
    "f f e g";
}
.g-1 { grid-area: a; } .g-4 { grid-area: b; } .g-3 { grid-area: c; } .g-2 { grid-area: d; }
.g-5 { grid-area: e; } .g-6 { grid-area: f; } .g-7 { grid-area: g; }
.g-item {
  position: relative; overflow: hidden; border-radius: var(--radius); display: block; background: var(--surface);
}
.g-item img {
  width: 100%; height: 100%; object-fit: cover;
  transform: scale(1.01); filter: saturate(.85) brightness(.9);
  transition: transform 1.4s var(--ease), filter .8s var(--ease);
}
.g-item:hover img { transform: scale(1.08); filter: saturate(1.1) brightness(1); }
.g-item::after {
  content: ""; position: absolute; inset: 0;
  background: linear-gradient(0deg, rgba(10, 8, 6, .85) 0%, rgba(10, 8, 6, 0) 55%);
  opacity: 0; transition: opacity .6s var(--ease);
}
.g-item:hover::after { opacity: 1; }
.g-cap {
  position: absolute; left: 1.4rem; bottom: 1.2rem; right: 3.5rem; z-index: 3;
  font: 400 clamp(1.05rem, .9rem + .5vw, 1.4rem)/1.2 var(--font-display);
  transform: translateY(20px); opacity: 0; transition: all .6s var(--ease);
}
.g-cap small {
  display: block; font: 500 .68rem var(--font-body); letter-spacing: .2em; text-transform: uppercase;
  color: var(--accent); margin-bottom: .35rem;
}
.g-item:hover .g-cap { transform: none; opacity: 1; }
.ribbon { margin-top: clamp(3rem, 6vw, 5rem); overflow: hidden; }
.ribbon-track { display: flex; gap: 1rem; width: max-content; animation: ribbon 50s linear infinite; }
.ribbon:hover .ribbon-track { animation-play-state: paused; }
.ribbon img {
  width: clamp(160px, 18vw, 240px); aspect-ratio: 1; object-fit: cover; border-radius: 14px;
  filter: grayscale(.4) brightness(.85); transition: filter .5s, transform .5s var(--ease);
}
.ribbon img:hover { filter: none; transform: translateY(-6px) scale(1.04); }
@keyframes ribbon { from { transform: translateX(calc(-50% - .5rem)); } to { transform: translateX(0); } }
.ribbon-tag { text-align: center; margin-top: 2.5rem; color: var(--muted); }
.ribbon-tag a { color: var(--accent); border-bottom: 1px solid currentColor; }

/* Offer Banner */
.offer { background: var(--bg); padding-block: 4rem; }
.offer-card {
  display: flex; align-items: center; justify-content: space-between; gap: 2rem; flex-wrap: wrap;
  padding: clamp(2rem, 5vw, 3.5rem); border-radius: calc(var(--radius) + 8px);
  background: var(--surface); border: 1px solid var(--line);
  box-shadow: 0 20px 40px -15px rgba(0,0,0,0.5);
}
.offer-card h2 { font-size: clamp(1.9rem, 1.2rem + 2.4vw, 3rem); margin-bottom: .6rem; }
.offer-text > p:last-child { color: var(--muted); }

/* Reviews */
.reviews { background: var(--bg-2); text-align: center; padding-block: 6rem; }
.quote-stage { display: grid; max-width: 900px; margin: 1.5rem auto 2.5rem; }
.quote { grid-area: 1 / 1; opacity: 0; animation: quoteCycle 15s infinite; }
.q2 { animation-delay: 5s; }
.q3 { animation-delay: 10s; }
.quote p { font: 300 clamp(1.5rem, 1rem + 2.2vw, 2.6rem)/1.3 var(--font-display); margin-bottom: 1.5rem; }
.quote cite { font-style: normal; color: var(--accent); font-size: .95rem; letter-spacing: .05em; }
@keyframes quoteCycle {
  0% { opacity: 0; transform: translateY(20px); filter: blur(6px); }
  5%, 28% { opacity: 1; transform: none; filter: blur(0); }
  33%, 100% { opacity: 0; transform: translateY(-20px); filter: blur(6px); }
}
.dots { display: flex; justify-content: center; gap: .6rem; }
.dots span { width: 28px; height: 3px; border-radius: 3px; background: var(--line); position: relative; overflow: hidden; }
.dots span::after { content: ""; position: absolute; inset: 0; background: var(--accent); transform: scaleX(0); transform-origin: left; animation: dotFill 15s infinite; }
.dots span:nth-child(2)::after { animation-delay: 5s; }
.dots span:nth-child(3)::after { animation-delay: 10s; }
@keyframes dotFill { 0% { transform: scaleX(0); opacity: 1; } 33% { transform: scaleX(1); opacity: 1; } 34%, 100% { transform: scaleX(1); opacity: 0; } }

/* Reservations */
.reserve {
  background: var(--bg); padding-block: 6rem;
}
.reserve-grid { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(3rem, 6vw, 6rem); align-items: center; }
.reserve-copy p:not(.eyebrow) { color: var(--muted); max-width: 46ch; margin-bottom: 2rem; }
.phone {
  font: 300 clamp(1.6rem, 1.2rem + 1.5vw, 2.4rem) var(--font-display); color: var(--accent);
}
.reserve-form {
  background: var(--surface); border: 1px solid var(--line); border-radius: calc(var(--radius) + 6px);
  padding: clamp(1.75rem, 4vw, 2.75rem); display: grid; gap: 1.25rem;
}
.field { position: relative; }
.field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
.field input, .field select {
  width: 100%; padding: 1.4rem 1rem .5rem; background: var(--bg); color: var(--text);
  border: 1px solid var(--line); border-radius: 12px; font: inherit; font-size: 1rem;
  color-scheme: dark; box-sizing: border-box;
}
.field select { appearance: none; }
.field label {
  position: absolute; left: 1rem; top: .45rem; font-size: .72rem; letter-spacing: .08em;
  text-transform: uppercase; color: var(--accent); pointer-events: none;
}

/* Visit */
.visit { background: var(--bg-2); padding-block: 5rem; }
.visit-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.visit-item { padding: 2rem 0; border-top: 1px solid var(--line); position: relative; }
.visit-item h3 { font-size: 1.6rem; margin-bottom: .8rem; }
.visit-item p { color: var(--muted); }
.visit-item p a:hover, .link:hover { color: var(--accent); }
.link { display: inline-block; margin-top: 1rem; color: var(--accent); }

/* Footer */
.site-footer { background: var(--bg); border-top: 1px solid var(--line); padding-block: 4rem 2rem; }
.footer-inner { display: grid; gap: 2rem; text-align: center; justify-items: center; }
.footer-big { font-size: clamp(3rem, 1rem + 9vw, 8rem); font-weight: 300; line-height: 1; }
.socials { display: flex; flex-wrap: wrap; justify-content: center; gap: .75rem; }
.socials a {
  padding: .55rem 1.2rem; border: 1px solid var(--line); border-radius: 999px; font-size: .9rem; color: var(--muted);
  transition: all .35s var(--ease);
}
.socials a:hover { color: var(--accent-ink); background: var(--accent); border-color: var(--accent); }
.copy { color: var(--muted); font-size: var(--fs-small); }

/* Responsive adjustments */
@media (max-width: 960px) {
  .about-grid, .reserve-grid { grid-template-columns: 1fr; }
  .cards { grid-template-columns: 1fr 1fr; }
  .cards .card:last-child { grid-column: 1 / -1; max-width: calc(50% - 1rem); justify-self: center; }
  .panel { grid-template-columns: 1fr; }
  .g-grid {
    grid-template-columns: repeat(2, 1fr); grid-auto-rows: clamp(150px, 34vw, 260px);
    grid-template-areas: "a b" "a d" "c e" "c e" "f f" "g g";
  }
}
@media (max-width: 640px) {
  .cards { grid-template-columns: 1fr; }
  .cards .card:last-child { max-width: none; }
  .visit-grid { grid-template-columns: 1fr; }
  .field-row { grid-template-columns: 1fr; }
}
`.trim();

// =============================================================
// SECTIONS FOR SAFFRON & EMBER RESTAURANT TEMPLATE
// =============================================================

export const SAFFRON_SECTIONS: PageSection[] = [
  // -----------------------------------------------------------
  // 1. NAVBAR / HEADER
  // -----------------------------------------------------------
  {
    id: "sec-saffron-header",
    templateId: "",
    name: "Header Navigation",
    html: `
<header class="site-header">
  <div class="container header-inner">
    <a href="#top" class="brand" aria-label="Saffron and Ember home">
      <svg class="brand-mark" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="20" r="18.5" stroke="currentColor" stroke-width="1.5"/>
        <path class="flame" d="M20 8c5 6 7.5 9.5 7.5 14a7.5 7.5 0 0 1-15 0c0-4.5 2.5-8 7.5-14z" fill="currentColor"/>
        <path d="M20 18c2 2.6 3 4.2 3 6a3 3 0 0 1-6 0c0-1.8 1-3.4 3-6z" fill="#15110e"/>
      </svg>
      <span class="brand-name">Saffron <em>&amp;</em> Ember</span>
    </a>

    <nav class="main-nav" aria-label="Primary">
      <a href="#about">Story</a>
      <a href="#menu">Menu</a>
      <a href="#signature">Signatures</a>
      <a href="#gallery">Gallery</a>
      <a href="#reviews">Reviews</a>
      <a href="#visit">Visit</a>
      <a href="#reserve" class="btn btn-small">Reserve</a>
    </nav>
  </div>
</header>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 2. HERO SECTION
  // -----------------------------------------------------------
  {
    id: "sec-saffron-hero",
    templateId: "",
    name: "Hero Section",
    html: `
<section class="hero" id="top">
  <div class="hero-media" aria-hidden="true">
    <img src="${SAFFRON_RESTAURANT_ASSETS.hero}" alt="Saffron and Ember Indian Kitchen">
    <div class="smoke s1"></div><div class="smoke s2"></div><div class="smoke s3"></div>
    <div class="embers"><i></i><i></i><i></i><i></i><i></i><i></i></div>
  </div>
  <div class="container hero-content">
    <p class="eyebrow">Modern Indian Kitchen · Est. 2019</p>
    <h1 class="hero-title">
      <span class="line">Fire, spice</span>
      <span class="line">&amp; <em class="shimmer">slow</em> stories.</span>
    </h1>
    <p class="hero-lead">A live tandoor, hand-ground masalas and recipes carried across generations — served in a warm room made for long dinners.</p>
    <div class="hero-cta">
      <a href="#reserve" class="btn">Book a table</a>
      <a href="#menu" class="btn btn-ghost">Explore the menu</a>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 3. MARQUEE BANNER
  // -----------------------------------------------------------
  {
    id: "sec-saffron-marquee",
    templateId: "",
    name: "Marquee Banner",
    html: `
<div class="marquee" aria-hidden="true">
  <div class="marquee-track">
    <span>Tandoor</span><i>✦</i><span>Biryani</span><i>✦</i><span>Kebabs</span><i>✦</i><span>Chaat</span><i>✦</i><span>Kulfi</span><i>✦</i><span>Masala Chai</span><i>✦</i>
    <span>Tandoor</span><i>✦</i><span>Biryani</span><i>✦</i><span>Kebabs</span><i>✦</i><span>Chaat</span><i>✦</i><span>Kulfi</span><i>✦</i><span>Masala Chai</span><i>✦</i>
  </div>
</div>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 4. ABOUT / STORY
  // -----------------------------------------------------------
  {
    id: "sec-saffron-about",
    templateId: "",
    name: "Our Story",
    html: `
<section id="about" class="section about">
  <div class="container about-grid">
    <div class="about-media">
      <img src="${SAFFRON_RESTAURANT_ASSETS.interior}" alt="Warmly lit restaurant dining room with a glowing tandoor" loading="lazy">
      <div class="badge-spin" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <defs><path id="circle-badge" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0"/></defs>
          <text><textPath href="#circle-badge">· cooked over open fire · since 2019 </textPath></text>
        </svg>
        <span class="badge-core">✦</span>
      </div>
    </div>
    <div class="about-copy">
      <p class="eyebrow">Our Story</p>
      <h2 class="section-title">Rooted in tradition, <em>cooked</em> with curiosity.</h2>
      <p>Saffron &amp; Ember began with a grandmother's spice tin and a stubborn belief that the best food is made slowly. Every morning our chefs roast and grind whole spices, knead dough for the tandoor and simmer dal for twelve hours.</p>
      <p>The menu follows the seasons and the markets — familiar flavours, re-imagined with care, and plated for sharing.</p>
      <ul class="stats">
        <li><strong>12<sup>h</sup></strong><span>Slow-cooked dal</span></li>
        <li><strong>40+</strong><span>House spice blends</span></li>
        <li><strong>4.9</strong><span>Guest rating</span></li>
      </ul>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 5. MENU TABS
  // -----------------------------------------------------------
  {
    id: "sec-saffron-menu",
    templateId: "",
    name: "Restaurant Menu",
    html: `
<section id="menu" class="section menu">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow center">The Menu</p>
      <h2 class="section-title">Something for every <em>appetite</em></h2>
    </div>

    <div class="tabs">
      <input type="radio" name="menu-tab" id="tab-start" checked>
      <input type="radio" name="menu-tab" id="tab-main">
      <input type="radio" name="menu-tab" id="tab-sweet">
      <input type="radio" name="menu-tab" id="tab-drink">

      <div class="tab-labels" role="tablist">
        <label for="tab-start">Starters</label>
        <label for="tab-main">Mains</label>
        <label for="tab-sweet">Desserts</label>
        <label for="tab-drink">Drinks</label>
        <span class="tab-indicator" aria-hidden="true"></span>
      </div>

      <div class="tab-panels">
        <ul class="panel panel-start">
          <li><div><h3>Dahi Puri Chaat</h3><p>Crisp shells, spiced potato, sweet yoghurt, tamarind &amp; mint</p></div><span class="price">₹320</span></li>
          <li><div><h3>Paneer Tikka <span class="tag">V</span></h3><p>Charred cottage cheese, smoked peppers, ajwain marinade</p></div><span class="price">₹420</span></li>
          <li><div><h3>Galouti Kebab</h3><p>Melt-in-mouth lamb patties on saffron ulte tawa paratha</p></div><span class="price">₹560</span></li>
          <li><div><h3>Amritsari Fish</h3><p>Gram-flour battered river sole, chaat masala, lemon</p></div><span class="price">₹520</span></li>
          <li><div><h3>Tandoori Broccoli <span class="tag">V</span></h3><p>Cheddar &amp; cream cheese marinade, toasted almonds</p></div><span class="price">₹380</span></li>
          <li><div><h3>Chicken 65</h3><p>Curry leaf, red chilli, crisp-fried, house garlic dip</p></div><span class="price">₹440</span></li>
        </ul>
        <ul class="panel panel-main">
          <li><div><h3>Dal Ember <span class="tag">Signature</span></h3><p>Black lentils simmered 12 hours over coal, white butter</p></div><span class="price">₹460</span></li>
          <li><div><h3>Old Delhi Butter Chicken</h3><p>Tandoor-roasted chicken, tomato &amp; fenugreek makhani</p></div><span class="price">₹620</span></li>
          <li><div><h3>Lucknowi Dum Biryani</h3><p>Aged basmati, saffron, slow-sealed lamb, burani raita</p></div><span class="price">₹720</span></li>
          <li><div><h3>Malabar Prawn Curry</h3><p>Coconut, kokum, curry leaf, steamed red rice</p></div><span class="price">₹780</span></li>
          <li><div><h3>Palak Kofta <span class="tag">V</span></h3><p>Paneer dumplings in silky spinach and garlic gravy</p></div><span class="price">₹480</span></li>
          <li><div><h3>Laal Maas</h3><p>Rajasthani lamb curry, mathania chillies, smoked ghee</p></div><span class="price">₹760</span></li>
        </ul>
        <ul class="panel panel-sweet">
          <li><div><h3>Pistachio Kulfi</h3><p>Hand-churned, rose petal, saffron syrup</p></div><span class="price">₹320</span></li>
          <li><div><h3>Gulab Jamun Brûlée</h3><p>Warm jamun, cardamom custard, caramelised top</p></div><span class="price">₹360</span></li>
          <li><div><h3>Rasmalai Tres Leches</h3><p>Three-milk sponge, saffron, crushed almonds</p></div><span class="price">₹380</span></li>
          <li><div><h3>Gajar Halwa</h3><p>Slow-cooked carrot, khoya, served warm (seasonal)</p></div><span class="price">₹300</span></li>
        </ul>
        <ul class="panel panel-drink">
          <li><div><h3>Masala Chai</h3><p>Assam leaf, ginger, cardamom, brewed to order</p></div><span class="price">₹160</span></li>
          <li><div><h3>Kokum Cooler</h3><p>Kokum, soda, black salt, roasted cumin</p></div><span class="price">₹220</span></li>
          <li><div><h3>Mango Lassi</h3><p>Alphonso mango, set yoghurt, pinch of saffron</p></div><span class="price">₹240</span></li>
          <li><div><h3>Filter Coffee</h3><p>South Indian decoction, frothed in a dabarah</p></div><span class="price">₹180</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 6. CHEF'S SIGNATURES
  // -----------------------------------------------------------
  {
    id: "sec-saffron-signatures",
    templateId: "",
    name: "Chef's Signatures",
    html: `
<section id="signature" class="section signature">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow center">Chef's Signatures</p>
      <h2 class="section-title">Plates people <em>come back</em> for</h2>
    </div>
    <div class="cards">
      <article class="card">
        <div class="card-img"><img src="${SAFFRON_RESTAURANT_ASSETS.dish1}" alt="Tandoori lamb chops with mint chutney" loading="lazy"></div>
        <div class="card-body">
          <span class="card-num">01</span>
          <h3>Tandoori Lamb Chops</h3>
          <p>Overnight raw-papaya marinade, kissed by the tandoor, finished with smoked mint.</p>
          <span class="price">₹890</span>
        </div>
      </article>
      <article class="card">
        <div class="card-img"><img src="${SAFFRON_RESTAURANT_ASSETS.dish2}" alt="Saffron biryani in a copper pot" loading="lazy"></div>
        <div class="card-body">
          <span class="card-num">02</span>
          <h3>Dum Saffron Biryani</h3>
          <p>Sealed in dough, slow-steamed over coal and opened at your table.</p>
          <span class="price">₹720</span>
        </div>
      </article>
      <article class="card">
        <div class="card-img"><img src="${SAFFRON_RESTAURANT_ASSETS.dish3}" alt="Pistachio kulfi with rose petals" loading="lazy"></div>
        <div class="card-body">
          <span class="card-num">03</span>
          <h3>Pistachio Rose Kulfi</h3>
          <p>Churned by hand each morning, with Kashmiri saffron and candied rose.</p>
          <span class="price">₹320</span>
        </div>
      </article>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 7. GALLERY & BENTO GRID
  // -----------------------------------------------------------
  {
    id: "sec-saffron-gallery",
    templateId: "",
    name: "Kitchen & Ambience Gallery",
    html: `
<section id="gallery" class="section gallery">
  <div class="container">
    <div class="section-head">
      <p class="eyebrow center">Gallery</p>
      <h2 class="section-title">A look inside the <em>kitchen</em> &amp; room</h2>
    </div>
    <div class="g-grid">
      <div class="g-item g-1">
        <img src="${SAFFRON_RESTAURANT_ASSETS.g1}" alt="Chef pulling naan from a glowing tandoor" loading="lazy">
        <span class="g-cap"><small>Kitchen</small>Fresh from the tandoor</span>
      </div>
      <div class="g-item g-2">
        <img src="${SAFFRON_RESTAURANT_ASSETS.g2}" alt="Whole Indian spices in brass bowls" loading="lazy">
        <span class="g-cap"><small>Spices</small>Hand-ground every morning</span>
      </div>
      <div class="g-item g-3">
        <img src="${SAFFRON_RESTAURANT_ASSETS.g3}" alt="Saffron cocktail on the bar" loading="lazy">
        <span class="g-cap"><small>Bar</small>Saffron old fashioned</span>
      </div>
      <div class="g-item g-4">
        <img src="${SAFFRON_RESTAURANT_ASSETS.g4}" alt="Platter of Indian street food chaat" loading="lazy">
        <span class="g-cap"><small>Plates</small>Chaat for the table</span>
      </div>
      <div class="g-item g-5">
        <img src="${SAFFRON_RESTAURANT_ASSETS.g5}" alt="Masala chai poured from a brass kettle" loading="lazy">
        <span class="g-cap"><small>Chai</small>Pour of masala chai</span>
      </div>
      <div class="g-item g-6">
        <img src="${SAFFRON_RESTAURANT_ASSETS.g6}" alt="Candle-lit corner booth in the dining room" loading="lazy">
        <span class="g-cap"><small>Dining Room</small>The corner booth</span>
      </div>
      <div class="g-item g-7">
        <img src="${SAFFRON_RESTAURANT_ASSETS.g7}" alt="Tandoori skewers over flames" loading="lazy">
        <span class="g-cap"><small>Grill</small>Over open flame</span>
      </div>
    </div>
  </div>

  <div class="ribbon" aria-hidden="true">
    <div class="ribbon-track">
      <img src="${SAFFRON_RESTAURANT_ASSETS.dish1}" alt="" loading="lazy">
      <img src="${SAFFRON_RESTAURANT_ASSETS.g2}" alt="" loading="lazy">
      <img src="${SAFFRON_RESTAURANT_ASSETS.g5}" alt="" loading="lazy">
      <img src="${SAFFRON_RESTAURANT_ASSETS.dish2}" alt="" loading="lazy">
      <img src="${SAFFRON_RESTAURANT_ASSETS.g7}" alt="" loading="lazy">
      <img src="${SAFFRON_RESTAURANT_ASSETS.interior}" alt="" loading="lazy">
      <img src="${SAFFRON_RESTAURANT_ASSETS.g3}" alt="" loading="lazy">
      <img src="${SAFFRON_RESTAURANT_ASSETS.dish3}" alt="" loading="lazy">
      <img src="${SAFFRON_RESTAURANT_ASSETS.dish1}" alt="" loading="lazy">
      <img src="${SAFFRON_RESTAURANT_ASSETS.g2}" alt="" loading="lazy">
    </div>
  </div>
  <p class="ribbon-tag">Follow along <a href="https://instagram.com" target="_blank" rel="noopener">@saffronandember</a></p>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 8. SPECIAL OFFER
  // -----------------------------------------------------------
  {
    id: "sec-saffron-offer",
    templateId: "",
    name: "Special Tasting Offer",
    html: `
<section class="offer">
  <div class="container">
    <div class="offer-card">
      <div class="offer-text">
        <p class="eyebrow">Weeknight Tasting</p>
        <h2>Seven courses, <em>one fire</em>.</h2>
        <p>Tuesday to Thursday · ₹2,400 per guest · wine pairing available</p>
      </div>
      <a href="#reserve" class="btn">Reserve the tasting</a>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 9. REVIEWS / TESTIMONIALS
  // -----------------------------------------------------------
  {
    id: "sec-saffron-reviews",
    templateId: "",
    name: "Guest Reviews",
    html: `
<section id="reviews" class="section reviews">
  <div class="container">
    <p class="eyebrow center">Kind Words</p>
    <div class="quote-stage">
      <blockquote class="quote q1">
        <p>“The dal alone is worth the drive. Warm service, gorgeous room — easily our favourite spot in the city.”</p>
        <cite>— Ananya R., Food Blogger</cite>
      </blockquote>
      <blockquote class="quote q2">
        <p>“Every dish tasted like someone cared. The biryani reveal at the table was pure theatre.”</p>
        <cite>— Rohan M., Regular Guest</cite>
      </blockquote>
      <blockquote class="quote q3">
        <p>“Refined without losing soul. Indian cooking at its most confident and generous.”</p>
        <cite>— City Food Guide</cite>
      </blockquote>
    </div>
    <div class="dots" aria-hidden="true"><span></span><span></span><span></span></div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 10. RESERVATIONS
  // -----------------------------------------------------------
  {
    id: "sec-saffron-reserve",
    templateId: "",
    name: "Online Table Reservations",
    html: `
<section id="reserve" class="section reserve">
  <div class="container reserve-grid">
    <div class="reserve-copy">
      <p class="eyebrow">Reservations</p>
      <h2 class="section-title">Save your seat at the <em>fire</em>.</h2>
      <p>Tables open 30 days in advance. For groups of 8 or more, private dining or celebrations, call us and we'll plan something special.</p>
      <a href="tel:+919876543210" class="phone">+91 98765 43210</a>
    </div>
    <form class="reserve-form" action="#" method="post" onsubmit="event.preventDefault(); alert('Reservation request submitted! Our concierge will confirm via phone shortly.');">
      <div class="field">
        <input type="text" id="res-name" name="name" placeholder="Full name" required>
        <label for="res-name">Full name</label>
      </div>
      <div class="field">
        <input type="tel" id="res-phone" name="phone" placeholder="Phone number" required>
        <label for="res-phone">Phone</label>
      </div>
      <div class="field-row">
        <div class="field">
          <input type="date" id="res-date" name="date" required>
          <label for="res-date">Date</label>
        </div>
        <div class="field">
          <input type="time" id="res-time" name="time" required>
          <label for="res-time">Time</label>
        </div>
      </div>
      <div class="field">
        <select id="res-guests" name="guests" required>
          <option value="2">2 guests</option>
          <option value="1">1 guest</option>
          <option value="3">3 guests</option>
          <option value="4">4 guests</option>
          <option value="5">5 guests</option>
          <option value="6">6+ guests</option>
        </select>
        <label for="res-guests">Party size</label>
      </div>
      <button type="submit" class="btn btn-block">Request reservation</button>
    </form>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 11. VISIT & OPENING HOURS
  // -----------------------------------------------------------
  {
    id: "sec-saffron-visit",
    templateId: "",
    name: "Location & Hours",
    html: `
<section id="visit" class="section visit">
  <div class="container visit-grid">
    <div class="visit-item">
      <h3>Find us</h3>
      <p>24, Spice Market Lane<br>Sector 18, Noida, UP 201301</p>
      <a href="https://maps.google.com" target="_blank" rel="noopener" class="link">Get directions →</a>
    </div>
    <div class="visit-item">
      <h3>Hours</h3>
      <p>Lunch · 12:00 – 15:30<br>Dinner · 19:00 – 23:30<br>Closed on Mondays</p>
    </div>
    <div class="visit-item">
      <h3>Say hello</h3>
      <p><a href="mailto:hello@saffronember.in">hello@saffronember.in</a><br><a href="tel:+919876543210">+91 98765 43210</a></p>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 12. FOOTER
  // -----------------------------------------------------------
  {
    id: "sec-saffron-footer",
    templateId: "",
    name: "Brand Footer",
    html: `
<footer class="site-footer">
  <div class="container footer-inner">
    <p class="footer-big">Saffron <em>&amp;</em> Ember</p>
    <nav class="socials" aria-label="Social">
      <a href="https://instagram.com" target="_blank" rel="noopener">Instagram</a>
      <a href="https://facebook.com" target="_blank" rel="noopener">Facebook</a>
      <a href="https://zomato.com" target="_blank" rel="noopener">Zomato</a>
      <a href="https://swiggy.com" target="_blank" rel="noopener">Swiggy</a>
    </nav>
    <p class="copy">© 2026 Saffron &amp; Ember. Modern Indian Kitchen. All rights reserved.</p>
  </div>
</footer>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
];

// =============================================================
// SHARED CHROME DEFINITIONS (GLOBAL HEADER & FOOTER)
// =============================================================
export const SAFFRON_SHARED_HEADER: PageSection = {
  ...SAFFRON_SECTIONS[0],
  id: SHARED_HEADER_SECTION_ID,
  shared: "header",
  sharedKey: "global-header",
  name: "Header Navigation",
};

export const SAFFRON_SHARED_FOOTER: PageSection = {
  ...SAFFRON_SECTIONS[SAFFRON_SECTIONS.length - 1],
  id: SHARED_FOOTER_SECTION_ID,
  shared: "footer",
  sharedKey: "global-footer",
  name: "Brand Footer",
};

// =============================================================
// MAIN HOME PAGE DEFINITION
// =============================================================
export const SAFFRON_HOME_PAGE: Page = {
  id: "page-saffron-home",
  name: "Home",
  slug: "home",
  sections: SAFFRON_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

// =============================================================
// TEMPLATE EXPORT DEFINITION
// =============================================================
export const SAFFRON_RESTAURANT_TEMPLATE: Template = {
  id: "tpl-saffron-ember-restaurant",
  name: "Saffron & Ember - Modern Indian Kitchen",
  slug: "saffron-ember-modern-indian-kitchen",
  category: "Restaurant & Café",
  description: "Sensory, modern Indian kitchen template with a live tandoor atmosphere, interactive tabbed menu, chef signatures, bento gallery, and online table reservations.",
  status: "published",
  featured: true,
  isNew: true,
  sortOrder: 1,
  thumbnail: SAFFRON_RESTAURANT_ASSETS.preview,
  previewImage: SAFFRON_RESTAURANT_ASSETS.hero,
  widgets: [],
  pages: [SAFFRON_HOME_PAGE],
  sharedHeader: SAFFRON_SHARED_HEADER,
  sharedFooter: SAFFRON_SHARED_FOOTER,
  globalCss: SAFFRON_GLOBAL_CSS,
  createdBy: "super-admin",
  createdAt: new Date("2026-03-01T00:00:00Z"),
  updatedAt: new Date("2026-03-01T00:00:00Z"),
};
