import { SHARED_HEADER_SECTION_ID, SHARED_FOOTER_SECTION_ID, type Page, type PageSection } from "@/lib/builder/store";
import type { Template } from "./templates";

// =============================================================
// CURATED HIGH-RESOLUTION YOGA STUDIO ASSETS
// =============================================================
export const FLOW_YOGA_ASSETS = {
  hero: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1900&q=85",
  about: "https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&w=900&q=85",
  classSlowFlow: "https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=800&q=80",
  classFoundations: "https://images.unsplash.com/photo-1573590330099-d6c35c1f9b6d?auto=format&fit=crop&w=800&q=80",
  classRestore: "https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=800&q=80",
  gallery1: "https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=85",
  gallery2: "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=700&q=85",
  gallery3: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=700&q=85",
  gallery4: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=85",
  preview: "/templates/flow-yoga-preview.png",
};

// =============================================================
// GLOBAL CSS FOR FLOW YOGA STUDIO
// =============================================================
export const FLOW_YOGA_GLOBAL_CSS = `
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap");

:root {
  --ink: #193832;
  --muted: #5d746c;
  --cream: #fbf6ed;
  --sand: #eee2cf;
  --clay: #cb755e;
  --sage: #9db8a3;
  --white: #fffdfa;
  --line: rgba(25, 56, 50, 0.13);
  --radius: 24px;
  --shadow: 0 18px 45px rgba(31, 57, 46, 0.12);
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
  scroll-padding-top: 90px;
}

body {
  margin: 0;
  color: var(--ink);
  background: var(--cream);
  font-family: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  line-height: 1.55;
  overflow-x: hidden;
}

a {
  text-decoration: none;
  color: inherit;
}

img {
  display: block;
  width: 100%;
  object-fit: cover;
}

.container {
  width: min(1160px, calc(100% - 40px));
  margin: auto;
}

.eyebrow {
  margin: 0 0 11px;
  text-transform: uppercase;
  letter-spacing: 0.16em;
  font-size: 0.73rem;
  font-weight: 700;
  color: var(--clay);
}

.wto-page-shell h1, .wto-page-shell h2, .wto-page-shell h3 {
  font-family: "Playfair Display", Georgia, serif;
  line-height: 1.05;
  margin: 0;
}

.wto-page-shell h2 {
  font-size: clamp(2.25rem, 4vw, 4.1rem);
  max-width: 650px;
}

.wto-page-shell p {
  color: var(--muted);
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  padding: 14px 22px;
  border-radius: 999px;
  border: 1px solid var(--ink);
  font-weight: 700;
  font-size: 0.92rem;
  transition: transform 0.25s, background 0.25s, color 0.25s;
  cursor: pointer;
  text-decoration: none;
}

.btn:hover {
  transform: translateY(-3px);
}

.btn.primary {
  background: var(--ink);
  color: var(--white);
  border-color: var(--ink);
}

.btn.primary:hover {
  background: var(--clay);
  border-color: var(--clay);
  color: var(--white);
}

.btn.light {
  background: var(--white);
  border-color: var(--white);
  color: var(--ink);
}

.btn.arrow::after {
  content: "→";
  font-size: 1.18rem;
  line-height: 1;
}

/* Header & Navigation */
header {
  position: sticky;
  top: 0;
  z-index: 100;
  color: var(--white);
  padding: 18px 0;
  background: rgba(18, 47, 41, 0.94);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 3px 18px rgba(0, 0, 0, 0.12);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}

.brand {
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.65rem;
  font-weight: 700;
  letter-spacing: -0.04em;
  color: var(--white);
  line-height: 1;
}

.brand span {
  font-family: "DM Sans", sans-serif;
  text-transform: uppercase;
  display: block;
  letter-spacing: 0.23em;
  font-size: 0.44rem;
  font-weight: 700;
  margin-top: -2px;
  color: rgba(255, 255, 255, 0.85);
}

.nav-links {
  display: flex;
  gap: 28px;
  font-size: 0.88rem;
  font-weight: 600;
}

.nav-links a {
  color: var(--white);
  opacity: 0.85;
  transition: opacity 0.2s;
}

.nav-links a:hover {
  opacity: 1;
}

.nav .btn {
  padding: 10px 17px;
  color: var(--ink);
  background: var(--white);
}

/* Hero Section */
.hero {
  min-height: 780px;
  position: relative;
  display: grid;
  align-items: end;
  color: var(--white);
  isolation: isolate;
  padding: 140px 0 78px;
  background: linear-gradient(110deg, rgba(13, 41, 35, 0.72), rgba(17, 49, 42, 0.16)),
    url("https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1900&q=85") center/cover;
}

.hero:after {
  content: "";
  position: absolute;
  inset: auto 0 0;
  height: 150px;
  background: linear-gradient(transparent, var(--cream));
  z-index: -1;
}

.hero-grid {
  display: grid;
  grid-template-columns: 1.3fr 0.7fr;
  align-items: end;
  gap: 32px;
}

.hero-copy {
  max-width: 740px;
}

.hero h1 {
  font-size: clamp(3.55rem, 8vw, 7.1rem);
  letter-spacing: -0.07em;
  color: var(--white);
}

.hero h1 em {
  color: #e5c5a0;
  font-style: italic;
}

.hero-copy p {
  color: rgba(255, 255, 255, 0.88);
  font-size: 1.1rem;
  max-width: 510px;
  margin: 24px 0 29px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 13px;
}

.hero-card {
  background: rgba(255, 253, 250, 0.94);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  color: var(--ink);
  padding: 25px;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  animation: float 5s ease-in-out infinite;
}

.hero-card .mini {
  font-size: 0.78rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  color: var(--clay);
  display: block;
}

.hero-card h3 {
  font-size: 1.65rem;
  margin: 5px 0 8px;
  color: var(--ink);
}

.hero-card p {
  font-size: 0.9rem;
  margin: 0 0 14px;
  color: var(--muted);
}

.hero-card a {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--ink);
  border-bottom: 1px solid var(--ink);
  display: inline-block;
}

/* Values Ticker */
.ticker {
  overflow: hidden;
  background: var(--clay);
  color: var(--white);
  white-space: nowrap;
  padding: 13px 0;
}

.ticker-track {
  display: inline-flex;
  gap: 35px;
  animation: marquee 22s linear infinite;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  font-weight: 700;
  font-size: 0.75rem;
}

.ticker-track span:after {
  content: "✦";
  margin-left: 35px;
  color: #f2d7ad;
}

/* Standard Section Spacing */
section {
  padding: 112px 0;
  scroll-margin-top: 90px;
}

/* About Section */
.intro {
  display: grid;
  grid-template-columns: 0.75fr 1.25fr;
  gap: 80px;
  align-items: center;
}

.intro-visual {
  position: relative;
  min-height: 500px;
}

.intro-visual img {
  height: 500px;
  border-radius: 220px 220px 20px 20px;
}

.orb {
  position: absolute;
  border-radius: 50%;
  background: var(--clay);
  width: 145px;
  aspect-ratio: 1;
  right: -35px;
  bottom: 36px;
  display: grid;
  place-items: center;
  color: white;
  text-align: center;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 1.05rem;
  animation: spin 15s linear infinite;
}

.intro-copy p {
  font-size: 1.1rem;
  max-width: 570px;
  margin: 23px 0 27px;
}

.numbers {
  display: flex;
  gap: 38px;
  border-top: 1px solid var(--line);
  padding-top: 25px;
  margin-top: 42px;
}

.number strong {
  display: block;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 2rem;
  color: var(--ink);
}

.number span {
  font-size: 0.8rem;
  color: var(--muted);
}

/* Classes Section */
.classes {
  background: var(--ink);
  color: var(--white);
}

.classes .section-head {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 44px;
}

.classes h2 {
  max-width: 550px;
  color: var(--white);
}

.classes .section-head p {
  color: #cbd8d1;
  max-width: 330px;
  margin: 0;
}

.class-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.class-card {
  min-height: 345px;
  border-radius: var(--radius);
  padding: 28px;
  display: flex;
  flex-direction: column;
  justify-content: end;
  position: relative;
  overflow: hidden;
  isolation: isolate;
}

.class-card:before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -1;
  background: linear-gradient(0deg, rgba(14, 39, 34, 0.92), rgba(14, 39, 34, 0.05));
}

.class-card:after {
  content: "";
  position: absolute;
  inset: 0;
  z-index: -2;
  background-size: cover;
  background-position: center;
  transition: transform 0.6s;
}

.class-card:hover:after {
  transform: scale(1.09);
}

.class-card:nth-child(1):after {
  background-image: url("https://images.unsplash.com/photo-1545389336-cf090694435e?auto=format&fit=crop&w=800&q=80");
}

.class-card:nth-child(2):after {
  background-image: url("https://images.unsplash.com/photo-1573590330099-d6c35c1f9b6d?auto=format&fit=crop&w=800&q=80");
}

.class-card:nth-child(3):after {
  background-image: url("https://images.unsplash.com/photo-1510894347713-fc3ed6fdf539?auto=format&fit=crop&w=800&q=80");
}

.class-card .tag {
  align-self: start;
  background: rgba(255, 255, 255, 0.19);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 6px 10px;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--white);
}

.class-card h3 {
  font-size: 2rem;
  margin-top: auto;
  color: var(--white);
}

.class-card p {
  color: white;
  opacity: 0.84;
  margin: 5px 0 0;
  font-size: 0.91rem;
}

/* Schedule Section */
.schedule-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 30px;
  margin-bottom: 37px;
}

.schedule-head p {
  max-width: 365px;
  margin: 0;
}

.schedule {
  border-top: 1px solid var(--line);
}

.class-row {
  display: grid;
  grid-template-columns: 150px 1.3fr 0.9fr auto;
  align-items: center;
  gap: 20px;
  border-bottom: 1px solid var(--line);
  padding: 23px 6px;
  transition: padding 0.28s, background 0.28s;
}

.class-row:hover {
  padding-left: 19px;
  padding-right: 19px;
  background: #f3eadc;
}

.class-row time {
  font-weight: 700;
  color: var(--clay);
}

.class-row h3 {
  font-family: "DM Sans", sans-serif;
  font-size: 1.04rem;
  color: var(--ink);
}

.class-row span {
  font-size: 0.9rem;
  color: var(--muted);
}

.class-row a {
  font-size: 0.86rem;
  font-weight: 700;
  text-decoration: underline;
  text-underline-offset: 4px;
  color: var(--ink);
}

/* Services Section */
.services {
  background: #f3eadc;
}

.service-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 42px;
}

.service-card {
  background: var(--white);
  padding: 32px;
  border-radius: var(--radius);
  box-shadow: 0 9px 25px rgba(41, 62, 51, 0.08);
  transition: transform 0.25s ease;
}

.service-card:hover {
  transform: translateY(-7px);
}

.service-icon {
  width: 50px;
  height: 50px;
  display: grid;
  place-items: center;
  margin-bottom: 22px;
  border-radius: 50%;
  background: var(--sand);
  font-size: 1.45rem;
}

.service-card h3 {
  font-size: 1.65rem;
  color: var(--ink);
}

.service-card p {
  font-size: 0.94rem;
  margin: 10px 0 20px;
}

/* Gallery Bento Section */
.gallery {
  padding-top: 112px;
}

.gallery-head {
  display: flex;
  justify-content: space-between;
  align-items: end;
  margin-bottom: 35px;
  gap: 20px;
}

.gallery-head p {
  max-width: 360px;
  margin: 0;
}

.gallery-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr 0.85fr;
  grid-template-rows: 250px 250px;
  gap: 16px;
}

.gallery-grid figure {
  margin: 0;
  overflow: hidden;
  border-radius: 18px;
  position: relative;
}

.gallery-grid figure:first-child {
  grid-row: span 2;
}

.gallery-grid figure:nth-child(4) {
  grid-column: span 2;
}

.gallery-grid img {
  height: 100%;
  transition: transform 0.65s;
}

.gallery-grid figure:hover img {
  transform: scale(1.08);
}

.gallery-grid figcaption {
  position: absolute;
  bottom: 14px;
  left: 16px;
  color: white;
  font-size: 0.82rem;
  font-weight: 700;
  text-shadow: 0 1px 8px #000;
}

/* Pricing Section */
.pricing {
  background: var(--ink);
  color: var(--white);
}

.pricing-intro {
  text-align: center;
  margin: auto;
}

.pricing-intro h2 {
  margin: auto;
  color: var(--white);
}

.pricing-intro p {
  max-width: 560px;
  margin: 18px auto 0;
  color: #cbd8d1;
}

.price-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-top: 46px;
}

.price-card {
  position: relative;
  padding: 32px;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.06);
}

.price-card.featured {
  color: var(--ink);
  background: var(--sand);
  transform: translateY(-13px);
}

.popular {
  position: absolute;
  top: -13px;
  right: 24px;
  padding: 6px 12px;
  border-radius: 999px;
  background: var(--clay);
  color: var(--white);
  font-size: 0.7rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.price-card h3 {
  font-size: 1.8rem;
}

.price-card.featured h3 {
  color: var(--ink);
}

.price {
  margin: 19px 0 5px;
  font-family: "Playfair Display", Georgia, serif;
  font-size: 3.3rem;
  line-height: 1;
}

.price small {
  font-family: "DM Sans", sans-serif;
  font-size: 0.9rem;
}

.price-card p {
  min-height: 44px;
  color: #d2ded7;
  font-size: 0.9rem;
}

.price-card.featured p {
  color: var(--muted);
}

.price-card ul {
  margin: 24px 0;
  padding: 0;
  list-style: none;
  border-top: 1px solid rgba(255, 255, 255, 0.18);
}

.price-card li {
  padding: 10px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.14);
  font-size: 0.89rem;
}

.price-card li::before {
  content: "✓";
  margin-right: 9px;
  color: #d9a892;
  font-weight: bold;
}

.price-card.featured li {
  border-color: var(--line);
  color: var(--ink);
}

.price-card.featured li::before {
  color: var(--clay);
}

.price-card .btn {
  width: 100%;
  border-color: rgba(255, 255, 255, 0.6);
  color: var(--white);
}

.price-card.featured .btn {
  border-color: var(--ink);
  background: var(--ink);
  color: var(--white);
}

/* Quote Section */
.quote {
  padding: 100px 0;
  background: var(--sand);
  text-align: center;
}

.quote blockquote {
  font-family: "Playfair Display", Georgia, serif;
  font-size: clamp(2rem, 4vw, 4rem);
  line-height: 1.16;
  max-width: 920px;
  margin: 0 auto;
  color: var(--ink);
}

.quote cite {
  display: block;
  font-style: normal;
  font-family: "DM Sans", sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--clay);
  margin-top: 25px;
}

/* Call to Action */
.cta {
  padding: 100px 0;
}

.cta-box {
  background: var(--sage);
  border-radius: 35px;
  min-height: 380px;
  padding: 65px;
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: end;
  gap: 35px;
  position: relative;
  overflow: hidden;
}

.cta-box:before,
.cta-box:after {
  content: "";
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.42);
  width: 420px;
  height: 420px;
  border-radius: 50%;
  right: -100px;
  top: -205px;
}

.cta-box:after {
  width: 300px;
  height: 300px;
  right: 70px;
  top: -155px;
}

.cta-box > * {
  position: relative;
}

.cta-box h2 {
  font-size: clamp(2.5rem, 5vw, 5rem);
  max-width: 620px;
  color: var(--ink);
}

.cta-box p {
  color: #315148;
  max-width: 470px;
  font-size: 1.05rem;
}

.cta-box .btn {
  background: var(--white);
  border-color: var(--white);
  white-space: nowrap;
  color: var(--ink);
}

/* Contact Section */
.contact {
  background: var(--cream);
}

.contact-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 70px;
  align-items: start;
}

.contact-info p {
  max-width: 440px;
  font-size: 1.06rem;
}

.contact-detail {
  margin-top: 25px;
}

.contact-detail strong {
  display: block;
  margin-bottom: 4px;
  color: var(--clay);
  font-size: 0.76rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.contact-detail a,
.contact-detail span {
  display: block;
  color: var(--ink);
  font-size: 1rem;
}

.contact-form {
  padding: 34px;
  border-radius: var(--radius);
  background: var(--white);
  box-shadow: var(--shadow);
}

.contact-form h3 {
  font-size: 1.65rem;
  color: var(--ink);
  margin-bottom: 12px;
}

.contact-form label {
  display: block;
  margin: 15px 0 6px;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.09em;
  text-transform: uppercase;
  color: var(--ink);
}

.contact-form input,
.contact-form textarea {
  width: 100%;
  padding: 13px;
  border: 1px solid var(--line);
  border-radius: 10px;
  background: #fffcf7;
  color: var(--ink);
  font: inherit;
}

.contact-form textarea {
  min-height: 120px;
  resize: vertical;
}

.contact-form .btn {
  width: 100%;
  margin-top: 19px;
}

/* Back to Top Link */
.top-link {
  position: fixed;
  right: 22px;
  bottom: 22px;
  z-index: 200;
  display: grid;
  width: 49px;
  height: 49px;
  place-items: center;
  border-radius: 50%;
  background: var(--clay);
  color: var(--white);
  box-shadow: 0 8px 22px rgba(89, 45, 31, 0.3);
  font-size: 1.35rem;
  transition: transform 0.25s ease, background 0.25s ease;
  text-decoration: none;
}

.top-link:hover {
  background: var(--ink);
  transform: translateY(-5px);
  color: var(--white);
}

/* Footer */
footer {
  background: #122f29;
  color: #edf3ee;
  padding: 55px 0 25px;
}

.footer-top {
  display: grid;
  grid-template-columns: 1.35fr repeat(3, 0.6fr);
  gap: 40px;
  padding-bottom: 48px;
}

.footer-brand p {
  color: #afc4ba;
  max-width: 250px;
  font-size: 0.9rem;
  margin-top: 10px;
}

.footer-top h4 {
  margin: 3px 0 13px;
  font-size: 0.8rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #d9a892;
}

.footer-top a,
.footer-top span {
  display: block;
  color: #c6d4cd;
  font-size: 0.88rem;
  margin: 7px 0;
  text-decoration: none;
}

.footer-top a:hover {
  color: #fff;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.15);
  padding-top: 21px;
  display: flex;
  justify-content: space-between;
  color: #98aca3;
  font-size: 0.76rem;
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-12px); }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

@keyframes marquee {
  to { transform: translateX(-50%); }
}

/* Responsive Breakpoints */
@media (max-width: 800px) {
  .nav-links { display: none; }
  .hero { min-height: 720px; }
  .hero-grid, .intro, .cta-box { grid-template-columns: 1fr; }
  .hero-card { max-width: 380px; }
  .intro { gap: 45px; }
  .intro-visual { max-width: 390px; }
  .class-grid { grid-template-columns: 1fr; }
  .class-card { min-height: 280px; }
  .class-row { grid-template-columns: 90px 1fr auto; }
  .class-row span { display: none; }
  .gallery-grid { grid-template-columns: 1fr 1fr; grid-template-rows: 230px 180px 180px; }
  .gallery-grid figure:first-child { grid-row: span 2; }
  .gallery-grid figure:nth-child(4) { grid-column: span 2; }
  .service-grid, .price-grid { grid-template-columns: 1fr; }
  .price-card.featured { transform: none; }
  .contact-grid { grid-template-columns: 1fr; gap: 40px; }
  .cta-box { padding: 43px; }
  .footer-top { grid-template-columns: 1fr 1fr; }
  .footer-brand { grid-column: span 2; }
}

@media (max-width: 520px) {
  .container { width: min(100% - 30px, 1160px); }
  header { padding: 18px 0; }
  .nav .btn { display: none; }
  .hero { padding-top: 115px; padding-bottom: 52px; min-height: 690px; }
  .hero h1 { font-size: 3.45rem; }
  .hero-copy p { font-size: 1rem; }
  .hero-card { padding: 20px; }
  .numbers { gap: 20px; }
  .number strong { font-size: 1.55rem; }
  section { padding: 80px 0; }
  .classes .section-head, .schedule-head, .gallery-head { display: block; }
  .classes .section-head p, .schedule-head p, .gallery-head p { margin-top: 16px; }
  .class-row { grid-template-columns: 75px 1fr; }
  .class-row a { display: none; }
  .gallery-grid { gap: 10px; grid-template-rows: 190px 145px 145px; }
  .quote { padding: 75px 0; }
  .cta-box { padding: 34px 27px; min-height: 340px; }
  .footer-top { gap: 26px; }
  .footer-bottom { display: block; }
  .footer-bottom span { display: block; margin: 6px 0; }
}

@media (prefers-reduced-motion: reduce) {
  *, *:before, *:after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    scroll-behavior: auto !important;
  }
}
`;

// =============================================================
// SECTIONS FOR FLOW YOGA STUDIO
// =============================================================
export const FLOW_YOGA_SECTIONS: PageSection[] = [
  // 1. Header Navigation
  {
    id: "sec-flow-header",
    templateId: "tpl-flow-yoga-header",
    name: "Header Navigation",
    html: `
<header>
  <div class="container nav">
    <a href="#home" class="brand">flow<span>yoga studio</span></a>
    <nav class="nav-links">
      <a href="#about">Our story</a>
      <a href="#classes">Classes</a>
      <a href="#schedule">Schedule</a>
      <a href="#gallery">Gallery</a>
      <a href="#services">Services</a>
      <a href="#pricing">Pricing</a>
      <a href="#contact">Contact</a>
    </nav>
    <a class="btn light" href="#join">Book a class</a>
  </div>
</header>
    `.trim(),
    style: {},
  },

  // 2. Hero Banner
  {
    id: "sec-flow-hero",
    templateId: "tpl-flow-yoga-hero",
    name: "Hero Banner",
    html: `
<section class="hero" id="home">
  <div class="container hero-grid">
    <div class="hero-copy">
      <p class="eyebrow" style="color: #e8c49a">A place to return to yourself</p>
      <h1>Move softly.<br><em>Live fully.</em></h1>
      <p>Thoughtful yoga for every body, every breath, and every season of life. Meet us on the mat in the heart of your neighborhood.</p>
      <div class="hero-actions">
        <a class="btn light arrow" href="#schedule">Find your flow</a>
        <a class="btn" style="border-color: rgba(255,255,255,0.75); color: #ffffff" href="#about">Explore the studio</a>
      </div>
    </div>
    <aside class="hero-card">
      <span class="mini">This week at Flow</span>
      <h3>New Moon Flow</h3>
      <p>Thursday · 7:30 PM<br>Slow, grounding, candlelit.</p>
      <a href="#schedule">Reserve your spot →</a>
    </aside>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 3. Values Ticker
  {
    id: "sec-flow-ticker",
    templateId: "tpl-flow-yoga-ticker",
    name: "Values Ticker",
    html: `
<div class="ticker" aria-label="Studio values">
  <div class="ticker-track">
    <span>Breathe deeply</span>
    <span>Move freely</span>
    <span>Rest intentionally</span>
    <span>Come as you are</span>
    <span>Breathe deeply</span>
    <span>Move freely</span>
    <span>Rest intentionally</span>
    <span>Come as you are</span>
  </div>
</div>
    `.trim(),
    style: {},
  },

  // 4. About Studio Story
  {
    id: "sec-flow-about",
    templateId: "tpl-flow-yoga-about",
    name: "Studio Story & Philosophy",
    html: `
<section id="about">
  <div class="container intro">
    <div class="intro-visual">
      <img src="https://images.unsplash.com/photo-1603988363607-e1e4a66962c6?auto=format&fit=crop&w=900&q=85" alt="Yoga practitioner seated calmly in a light-filled studio">
      <div class="orb">Find your<br>steady place</div>
    </div>
    <div class="intro-copy">
      <p class="eyebrow">Welcome to Flow</p>
      <h2>A softer way to feel strong.</h2>
      <p>Flow is a warm, sunlit studio made for real life. Whether you are brand new to yoga or have been practicing for years, our classes invite you to arrive exactly as you are—and leave a little more at home in your body.</p>
      <a class="btn primary arrow" href="#classes">Meet our classes</a>
      <div class="numbers">
        <div class="number">
          <strong>12+</strong>
          <span>Weekly classes</span>
        </div>
        <div class="number">
          <strong>8</strong>
          <span>Kind teachers</span>
        </div>
        <div class="number">
          <strong>1</strong>
          <span>Open-hearted community</span>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 5. Classes Grid
  {
    id: "sec-flow-classes",
    templateId: "tpl-flow-yoga-classes",
    name: "Curated Classes",
    html: `
<section class="classes" id="classes">
  <div class="container">
    <div class="section-head">
      <div>
        <p class="eyebrow" style="color: #e5ae98">Practice your way</p>
        <h2>There is a class for your every mood.</h2>
      </div>
      <p>From energizing morning movement to deeply restorative evenings, choose the practice that meets you today.</p>
    </div>
    <div class="class-grid">
      <article class="class-card">
        <span class="tag">All levels</span>
        <h3>Slow Flow</h3>
        <p>Unhurried movement, intentional breath, sweet strength.</p>
      </article>
      <article class="class-card">
        <span class="tag">Beginner-friendly</span>
        <h3>Foundations</h3>
        <p>Build confidence with the essentials, one shape at a time.</p>
      </article>
      <article class="class-card">
        <span class="tag">Deep rest</span>
        <h3>Restore</h3>
        <p>Props, long holds, and the permission to simply be.</p>
      </article>
    </div>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 6. Schedule Timetable
  {
    id: "sec-flow-schedule",
    templateId: "tpl-flow-yoga-schedule",
    name: "Weekly Schedule",
    html: `
<section id="schedule">
  <div class="container">
    <div class="schedule-head">
      <div>
        <p class="eyebrow">Make a date with yourself</p>
        <h2>Your week at Flow.</h2>
      </div>
      <p>Drop in for a single class or make your mat a regular home. All classes are 60 minutes unless noted.</p>
    </div>
    <div class="schedule">
      <div class="class-row">
        <time>MON · 6:30 AM</time>
        <h3>Morning Flow</h3>
        <span>with Maya</span>
        <a href="#join">Book class →</a>
      </div>
      <div class="class-row">
        <time>TUE · 6:00 PM</time>
        <h3>Foundations</h3>
        <span>with Eliana</span>
        <a href="#join">Book class →</a>
      </div>
      <div class="class-row">
        <time>WED · 7:30 PM</time>
        <h3>Candlelight Restore</h3>
        <span>with Nora</span>
        <a href="#join">Book class →</a>
      </div>
      <div class="class-row">
        <time>SAT · 9:00 AM</time>
        <h3>Weekend Flow</h3>
        <span>with James</span>
        <a href="#join">Book class →</a>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 7. Services & Offerings
  {
    id: "sec-flow-services",
    templateId: "tpl-flow-yoga-services",
    name: "Services & Offerings",
    html: `
<section class="services" id="services">
  <div class="container">
    <div>
      <p class="eyebrow">More than a class</p>
      <h2>Support for your whole practice.</h2>
    </div>

    <div class="service-grid">
      <article class="service-card">
        <div class="service-icon">☀</div>
        <h3>Private Yoga</h3>
        <p>One-to-one guidance tailored to your body, your goals, and your season of life.</p>
        <a class="btn arrow" href="#contact">Enquire now</a>
      </article>

      <article class="service-card">
        <div class="service-icon">✦</div>
        <h3>Workshops</h3>
        <p>Take a deeper dive into breathwork, alignment, meditation, and mindful movement.</p>
        <a class="btn arrow" href="#schedule">View sessions</a>
      </article>

      <article class="service-card">
        <div class="service-icon">♥</div>
        <h3>Community Events</h3>
        <p>Seasonal gatherings and nourishing experiences to connect beyond the mat.</p>
        <a class="btn arrow" href="#contact">Stay in the loop</a>
      </article>
    </div>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 8. Studio Bento Gallery
  {
    id: "sec-flow-gallery",
    templateId: "tpl-flow-yoga-gallery",
    name: "Studio Gallery",
    html: `
<section class="gallery" id="gallery">
  <div class="container">
    <div class="gallery-head">
      <div>
        <p class="eyebrow">Inside the studio</p>
        <h2>Small moments of spaciousness.</h2>
      </div>
      <p>Natural light, plenty of plants, and everything you need to settle into your practice.</p>
    </div>
    <div class="gallery-grid">
      <figure>
        <img src="https://images.unsplash.com/photo-1599447421416-3414500d18a5?auto=format&fit=crop&w=900&q=85" alt="Yoga group in a bright studio">
        <figcaption>Practice together</figcaption>
      </figure>
      <figure>
        <img src="https://images.unsplash.com/photo-1549576490-b0b4831ef60a?auto=format&fit=crop&w=700&q=85" alt="Woman in a yoga pose">
        <figcaption>Move with ease</figcaption>
      </figure>
      <figure>
        <img src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=700&q=85" alt="Yoga class stretching">
        <figcaption>Find your edge</figcaption>
      </figure>
      <figure>
        <img src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=1000&q=85" alt="Peaceful yoga practice">
        <figcaption>A breath for you</figcaption>
      </figure>
    </div>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 9. Pricing & Memberships
  {
    id: "sec-flow-pricing",
    templateId: "tpl-flow-yoga-pricing",
    name: "Memberships & Pricing",
    html: `
<section class="pricing" id="pricing">
  <div class="container">
    <div class="pricing-intro">
      <p class="eyebrow" style="color: #e5ae98">Simple memberships</p>
      <h2>Choose the rhythm that feels right.</h2>
      <p>Start with a single class or build a practice that fits naturally into your week.</p>
    </div>

    <div class="price-grid">
      <article class="price-card">
        <h3>Drop In</h3>
        <div class="price">₹600 <small>/ class</small></div>
        <p>Perfect for an occasional reset.</p>
        <ul>
          <li>Any regular studio class</li>
          <li>Valid for 30 days</li>
          <li>Easy online booking</li>
        </ul>
        <a class="btn" href="#contact">Get started</a>
      </article>

      <article class="price-card featured">
        <span class="popular">Most loved</span>
        <h3>Flow Monthly</h3>
        <div class="price">₹3,200 <small>/ month</small></div>
        <p>A supportive rhythm for regular practice.</p>
        <ul>
          <li>8 classes every month</li>
          <li>Priority workshop booking</li>
          <li>Member community events</li>
        </ul>
        <a class="btn" href="#contact">Join Flow</a>
      </article>

      <article class="price-card">
        <h3>Unlimited</h3>
        <div class="price">₹4,800 <small>/ month</small></div>
        <p>For when the studio feels like home.</p>
        <ul>
          <li>Unlimited regular classes</li>
          <li>Bring-a-friend pass monthly</li>
          <li>10% off workshops</li>
        </ul>
        <a class="btn" href="#contact">Practice freely</a>
      </article>
    </div>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 10. Testimonial Quote
  {
    id: "sec-flow-quote",
    templateId: "tpl-flow-yoga-quote",
    name: "Member Testimonial",
    html: `
<section class="quote">
  <div class="container">
    <blockquote>“Flow has become the calmest, kindest part of my week.”</blockquote>
    <cite>— Priya, Flow member</cite>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 11. First Visit Call to Action
  {
    id: "sec-flow-cta",
    templateId: "tpl-flow-yoga-cta",
    name: "First Visit Invitation",
    html: `
<section class="cta" id="join">
  <div class="container">
    <div class="cta-box">
      <div>
        <p class="eyebrow" style="color: #355c50">Your first visit</p>
        <h2>Come flow with us.</h2>
        <p>Your first class is on us. Bring yourself, wear something comfortable, and we’ll take care of the rest.</p>
      </div>
      <a class="btn arrow" href="mailto:hello@flowyogastudio.com?subject=I'd%20like%20to%20book%20my%20first%20class">Claim your class</a>
    </div>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 12. Contact & Visit Form
  {
    id: "sec-flow-contact",
    templateId: "tpl-flow-yoga-contact",
    name: "Contact & Studio Location",
    html: `
<section class="contact" id="contact">
  <div class="container contact-grid">
    <div class="contact-info">
      <p class="eyebrow">Say hello</p>
      <h2>We would love to welcome you.</h2>
      <p>
        Have a question about classes, memberships, or finding the right place
        to begin? Send us a note and our team will be in touch.
      </p>

      <div class="contact-detail">
        <strong>Visit us</strong>
        <span>18 Willow Street, Your City</span>
      </div>

      <div class="contact-detail">
        <strong>Call or email</strong>
        <a href="tel:+15550141414">(555) 014-1414</a>
        <a href="mailto:hello@flowyogastudio.com">hello@flowyogastudio.com</a>
      </div>
    </div>

    <form class="contact-form" action="#" method="post" onsubmit="event.preventDefault(); alert('Thank you! Your message has been received.');">
      <h3>Send a message</h3>

      <label for="name">Your name</label>
      <input id="name" name="name" type="text" placeholder="Your name" required>

      <label for="email">Email address</label>
      <input id="email" name="email" type="email" placeholder="you@example.com" required>

      <label for="message">How can we help?</label>
      <textarea id="message" name="message" placeholder="Tell us a little more..."></textarea>

      <button class="btn primary arrow" type="submit">Send message</button>
    </form>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 13. Footer
  {
    id: "sec-flow-footer",
    templateId: "tpl-flow-yoga-footer",
    name: "Footer & Back to Top",
    html: `
<a class="top-link" href="#home" aria-label="Move to top">↑</a>
<footer>
  <div class="container">
    <div class="footer-top">
      <div class="footer-brand">
        <a href="#home" class="brand">flow<span>yoga studio</span></a>
        <p>A gathering place for movement, breath, and belonging.</p>
      </div>
      <div>
        <h4>Visit</h4>
        <span>18 Willow Street</span>
        <span>Open daily, 6 AM–8 PM</span>
      </div>
      <div>
        <h4>Connect</h4>
        <a href="mailto:hello@flowyogastudio.com">hello@flowyogastudio.com</a>
        <a href="tel:+15550141414">(555) 014-1414</a>
      </div>
      <div>
        <h4>Follow</h4>
        <a href="#">Instagram</a>
        <a href="#">Facebook</a>
      </div>
    </div>
    <div class="footer-bottom">
      <span>© 2026 Flow Yoga Studio. Made with intention.</span>
      <span>Privacy · Terms</span>
    </div>
  </div>
</footer>
    `.trim(),
    style: {},
  },
];

// =============================================================
// SHARED CHROME & PAGE DEFINITIONS
// =============================================================
export const FLOW_YOGA_SHARED_HEADER: PageSection = {
  ...FLOW_YOGA_SECTIONS[0],
  id: SHARED_HEADER_SECTION_ID,
  shared: "header",
  widgetInstance: undefined,
};

export const FLOW_YOGA_SHARED_FOOTER: PageSection = {
  ...FLOW_YOGA_SECTIONS[FLOW_YOGA_SECTIONS.length - 1],
  id: SHARED_FOOTER_SECTION_ID,
  shared: "footer",
  widgetInstance: undefined,
};

export const FLOW_YOGA_HOME_PAGE: Page = {
  id: "page-flow-yoga-home",
  name: "Home",
  slug: "index",
  sections: FLOW_YOGA_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const FLOW_YOGA_TEMPLATE: Template = {
  id: "tpl-flow-yoga",
  name: "Flow Yoga Studio",
  slug: "flow-yoga-studio",
  category: "Fitness & Gym",
  description: "Serene, minimalist yoga, pilates, and mindful meditation studio template with class timetable, bento gallery, and memberships.",
  status: "published",
  thumbnail: FLOW_YOGA_ASSETS.preview,
  previewImage: FLOW_YOGA_ASSETS.preview,
  featured: true,
  isNew: true,
  sortOrder: 5,
  widgets: [],
  pages: [FLOW_YOGA_HOME_PAGE],
  sharedHeader: FLOW_YOGA_SHARED_HEADER,
  sharedFooter: FLOW_YOGA_SHARED_FOOTER,
  globalCss: FLOW_YOGA_GLOBAL_CSS,
  customHead: `
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:ital,wght@0,600;0,700;1,600&display=swap" rel="stylesheet">
  `.trim(),
  assets: FLOW_YOGA_ASSETS,
  createdBy: "system",
  createdAt: new Date("2026-03-01"),
  updatedAt: new Date("2026-03-01"),
};
