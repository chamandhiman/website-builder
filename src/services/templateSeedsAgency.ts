import { SHARED_HEADER_SECTION_ID, SHARED_FOOTER_SECTION_ID, type Page, type PageSection } from "@/lib/builder/store";
import type { Template } from "./templates";

// =============================================================
// CURATED ASSETS FOR NEXORA DIGITAL AGENCY
// =============================================================
export const NEXORA_ASSETS = {
  heroWeb: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
  heroGrowth: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
  heroMobile: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80",
  projectOne: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80",
  projectTwo: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80",
  projectThree: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
};

// =============================================================
// GLOBAL CSS FOR NEXORA DIGITAL AGENCY
// =============================================================
export const NEXORA_GLOBAL_CSS = `
@import url("https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap");

:root {
  --ink: #242044;
  --muted: #6f6b87;
  --purple: #6d5dfc;
  --teal: #12cdbd;
  --coral: #f45f94;
  --cream: #fbfaff;
  --pale: #f0efff;
  --line: #e5e3f3;
  --white: #ffffff;
  --radius: 22px;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: "DM Sans", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  background: var(--cream);
  color: var(--ink);
  overflow-x: hidden;
  margin: 0;
  line-height: 1.6;
}

a {
  text-decoration: none;
  color: inherit;
}

section {
  padding: 105px 0;
  scroll-margin-top: 72px;
}

.eyebrow {
  display: inline-block;
  color: var(--purple);
  font-weight: 700;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.title {
  font: 800 clamp(2.25rem, 4vw, 4rem) / 1.08 "Manrope", sans-serif;
  letter-spacing: -0.055em;
}

.lead {
  color: var(--muted);
  font-size: 1.06rem;
  line-height: 1.75;
}

.btn-main {
  border: 0;
  border-radius: 999px;
  background: var(--purple);
  color: #fff !important;
  padding: 14px 22px;
  font-weight: 700;
  transition: 0.25s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
}

.btn-main:hover {
  background: var(--ink);
  color: #fff !important;
  transform: translateY(-3px);
}

.btn-ghost {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 13px 21px;
  font-weight: 700;
  background: #fff;
  color: var(--ink) !important;
  transition: 0.25s;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
}

.btn-ghost:hover {
  border-color: var(--purple);
  color: var(--purple) !important;
  transform: translateY(-3px);
}

/* Navbar */
.navbar {
  padding: 17px 0;
  background: rgba(251, 250, 255, 0.88);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border-bottom: 1px solid transparent;
  transition: 0.3s;
  z-index: 1030;
}

.navbar.scrolled {
  box-shadow: 0 8px 25px rgba(37, 31, 91, 0.08);
  border-color: var(--line);
}

.navbar-brand {
  font: 800 1.45rem "Manrope", sans-serif;
  letter-spacing: -0.06em;
  color: var(--ink);
  display: inline-flex;
  align-items: center;
}

.logo-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  background: var(--teal);
  border-radius: 50%;
  margin-left: 2px;
}

.nav-link {
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--ink) !important;
  margin: 0 7px;
  position: relative;
  transition: color 0.2s;
}

.nav-link:after {
  content: "";
  position: absolute;
  left: 8px;
  right: 8px;
  bottom: 0;
  height: 2px;
  background: var(--purple);
  transform: scaleX(0);
  transition: 0.25s;
}

.nav-link:hover:after {
  transform: scaleX(1);
}

.navbar-toggler {
  border: 0;
  box-shadow: none !important;
  padding: 5px;
}

.navbar-toggler-icon {
  background-image: none;
  width: 27px;
  height: 18px;
  position: relative;
  border-top: 2px solid var(--ink);
  border-bottom: 2px solid var(--ink);
}

.navbar-toggler-icon:after {
  content: "";
  position: absolute;
  top: 7px;
  left: 0;
  width: 100%;
  border-top: 2px solid var(--ink);
}

/* Hero Section */
.hero {
  padding: 0;
  background: linear-gradient(120deg, #eeecff 0%, #fbfaff 52%, #e6fbf8 100%);
}

.hero .carousel-item {
  min-height: 680px;
}

.hero-copy {
  padding: 150px 0 100px;
}

.hero h1 {
  font: 800 clamp(3rem, 6vw, 5.55rem) / 0.99 "Manrope", sans-serif;
  letter-spacing: -0.075em;
  max-width: 650px;
  margin: 0;
}

.hero h1 span {
  color: var(--purple);
}

.hero p {
  color: var(--muted);
  max-width: 560px;
  font-size: 1.1rem;
  line-height: 1.75;
  margin: 25px 0 30px;
}

.hero-art {
  width: min(100%, 565px);
  margin: 105px auto 55px;
  filter: drop-shadow(0 24px 24px rgba(58, 45, 140, 0.17));
  animation: float 5s ease-in-out infinite;
  display: block;
}

.carousel-indicators {
  justify-content: flex-start;
  margin: 0 0 47px calc((100% - min(1320px, 100% - 24px)) / 2);
}

.carousel-indicators [data-bs-target] {
  width: 28px;
  height: 4px;
  border: 0;
  border-radius: 10px;
  background: var(--purple);
  opacity: 0.26;
}

.carousel-indicators .active {
  opacity: 1;
}

.carousel-control-next,
.carousel-control-prev {
  width: 7%;
  opacity: 0.65;
}

/* Trust Bar */
.trust {
  background: var(--ink);
  color: #fff;
  padding: 26px 0;
}

.trust small {
  color: #bdb8dd;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

.trust .brand-row {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 22px;
  margin-top: 17px;
  color: #fff;
  font: 700 1.05rem "Manrope", sans-serif;
  opacity: 0.8;
}

.trust .brand-row span {
  letter-spacing: -0.04em;
}

/* About */
.about-image {
  position: relative;
}

.about-image img {
  border-radius: 28px;
  box-shadow: 0 23px 45px rgba(52, 41, 112, 0.16);
  width: 100%;
}

.metric {
  position: absolute;
  right: -15px;
  bottom: -25px;
  background: #fff;
  border-radius: 18px;
  padding: 18px 21px;
  box-shadow: 0 15px 35px rgba(42, 34, 86, 0.16);
}

.metric strong {
  display: block;
  font: 800 2rem "Manrope", sans-serif;
  color: var(--purple);
  line-height: 1;
}

.metric span {
  font-size: 0.78rem;
  color: var(--muted);
}

.check {
  display: flex;
  gap: 11px;
  align-items: start;
  margin: 14px 0;
  color: var(--muted);
}

.check b {
  color: var(--teal);
  font-size: 1.1rem;
}

/* Services */
.services {
  background: var(--ink);
  color: #fff;
}

.services .eyebrow {
  color: #71eee0;
}

.services .lead {
  color: #c0bdd7;
}

.service-card {
  height: 100%;
  padding: 30px;
  border: 1px solid rgba(255, 255, 255, 0.13);
  border-radius: var(--radius);
  background: rgba(255, 255, 255, 0.04);
  transition: 0.3s;
}

.service-card:hover {
  background: #fff;
  color: var(--ink);
  transform: translateY(-9px);
}

.service-card:hover p {
  color: var(--muted);
}

.service-icon {
  width: 53px;
  height: 53px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(18, 205, 189, 0.16);
  font-size: 1.45rem;
  margin-bottom: 25px;
  color: var(--teal);
}

.service-card h3 {
  font: 700 1.28rem "Manrope", sans-serif;
  margin-bottom: 12px;
}

.service-card p {
  color: #c0bdd7;
  font-size: 0.93rem;
  line-height: 1.7;
  margin-bottom: 16px;
}

.service-card a {
  font-weight: 700;
  font-size: 0.88rem;
  color: inherit;
}

.service-card a:after {
  content: " →";
  color: var(--teal);
}

/* Work / Projects */
.work-card {
  overflow: hidden;
  border-radius: var(--radius);
  background: #fff;
  box-shadow: 0 12px 35px rgba(46, 38, 90, 0.1);
  transition: 0.3s;
}

.work-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 20px 42px rgba(46, 38, 90, 0.17);
}

.work-card img {
  width: 100%;
  transition: 0.5s;
  display: block;
}

.work-card:hover img {
  transform: scale(1.05);
}

.work-info {
  padding: 22px;
}

.work-info h3 {
  font: 700 1.25rem "Manrope", sans-serif;
  margin: 0 0 7px;
  color: var(--ink);
}

.work-info p {
  color: var(--muted);
  font-size: 0.87rem;
  margin: 0;
}

/* CTA */
.cta {
  padding: 0;
}

.cta-box {
  overflow: hidden;
  position: relative;
  background: linear-gradient(115deg, var(--purple), #4233cc);
  border-radius: 30px;
  padding: 68px;
  color: #fff;
}

.cta-box:before,
.cta-box:after {
  content: "";
  position: absolute;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 50%;
  width: 360px;
  height: 360px;
  right: -90px;
  top: -175px;
}

.cta-box:after {
  width: 240px;
  height: 240px;
  right: 40px;
  top: -115px;
}

.cta-box > * {
  position: relative;
}

.cta-box h2 {
  font: 800 clamp(2rem, 4vw, 3.4rem) / 1.08 "Manrope", sans-serif;
  letter-spacing: -0.06em;
  max-width: 620px;
  margin-bottom: 16px;
}

.cta-box p {
  max-width: 560px;
  color: #e0ddff;
  margin-bottom: 24px;
}

/* Pricing */
.pricing {
  background: #f0efff;
}

.price-card {
  height: 100%;
  padding: 32px;
  border-radius: var(--radius);
  background: #fff;
  border: 1px solid var(--line);
  transition: 0.3s;
}

.price-card.hot {
  background: var(--ink);
  color: #fff;
  transform: translateY(-10px);
  border-color: var(--ink);
}

.price-card h3 {
  font: 700 1.35rem "Manrope", sans-serif;
}

.price {
  font: 800 3rem "Manrope", sans-serif;
  letter-spacing: -0.07em;
  margin: 20px 0 3px;
}

.price small {
  font: 500 0.85rem "DM Sans", sans-serif;
  color: var(--muted);
  letter-spacing: 0;
}

.price-card.hot small,
.price-card.hot p {
  color: #c8c4df;
}

.price-card p {
  color: var(--muted);
  font-size: 0.9rem;
}

.price-card ul {
  list-style: none;
  padding: 0;
  margin: 25px 0;
}

.price-card li {
  padding: 9px 0;
  border-bottom: 1px solid var(--line);
  font-size: 0.88rem;
}

.price-card.hot li {
  border-color: rgba(255, 255, 255, 0.13);
}

.price-card li:before {
  content: "✓ ";
  color: var(--teal);
  font-weight: 700;
  margin-right: 9px;
}

/* Contact */
.contact-box {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 28px;
  padding: clamp(25px, 5vw, 55px);
  box-shadow: 0 15px 32px rgba(45, 36, 94, 0.08);
}

.contact-detail {
  margin: 25px 0;
}

.contact-detail strong {
  display: block;
  text-transform: uppercase;
  letter-spacing: 0.13em;
  font-size: 0.7rem;
  color: var(--purple);
  margin-bottom: 5px;
}

.contact-detail a,
.contact-detail span {
  color: var(--ink);
  font-weight: 600;
}

.form-control {
  padding: 13px 15px;
  border-color: var(--line);
  border-radius: 10px;
}

.form-control:focus {
  box-shadow: 0 0 0 0.2rem rgba(109, 93, 252, 0.13);
  border-color: var(--purple);
}

.form-label {
  font-size: 0.82rem;
  font-weight: 700;
}

/* Footer */
.footer {
  background: #17142f;
  color: #e9e8f5;
  padding: 72px 0 22px;
}

.footer p,
.footer a {
  color: #b9b5d2;
  font-size: 0.9rem;
}

.footer h5 {
  font: 700 0.83rem "Manrope", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 18px;
  color: #fff;
}

.footer a {
  display: block;
  margin: 9px 0;
  transition: 0.2s;
  text-decoration: none;
}

.footer a:hover {
  color: var(--teal);
  transform: translateX(3px);
}

.social a {
  display: inline-grid;
  place-items: center;
  width: 34px;
  height: 34px;
  margin: 0 7px 0 0;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 50%;
  color: #fff;
  text-decoration: none;
}

.social a:hover {
  border-color: var(--teal);
  color: var(--teal);
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.12);
  margin-top: 45px;
  padding-top: 20px;
  font-size: 0.78rem;
  color: #9792b7;
}

/* Back to Top */
.top {
  position: fixed;
  right: 21px;
  bottom: 21px;
  z-index: 99;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--purple);
  color: #fff !important;
  box-shadow: 0 10px 25px rgba(67, 51, 204, 0.35);
  transition: 0.25s;
  text-decoration: none;
}

.top:hover {
  color: #fff !important;
  transform: translateY(-5px);
  background: var(--ink);
}

/* Animations */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-15px); }
}

@keyframes rise {
  from { opacity: 0; transform: translateY(28px); }
  to { opacity: 1; transform: none; }
}

@media (max-width: 991px) {
  .hero .carousel-item { min-height: auto; }
  .hero-copy { padding: 132px 0 35px; }
  .hero-art { margin: 15px auto 80px; width: 75%; }
  .navbar-collapse { padding: 17px 0; }
  .nav-link { padding: 9px 0; }
  .navbar .btn-main { margin-top: 10px; }
  .about-image { margin-bottom: 65px; }
  .contact-box .col-lg-5 { margin-bottom: 35px; }
}

@media (max-width: 575px) {
  section { padding: 75px 0; }
  .hero h1 { font-size: 3rem; }
  .hero-art { width: 100%; margin-bottom: 70px; }
  .carousel-control-next, .carousel-control-prev { display: none; }
  .carousel-indicators { margin-left: 20px; margin-bottom: 22px; }
  .trust .brand-row { gap: 13px; font-size: 0.9rem; }
  .metric { right: 0; }
  .cta-box { padding: 42px 28px; }
  .price-card.hot { transform: none; }
  .footer { padding-top: 55px; }
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
// SECTIONS FOR NEXORA DIGITAL AGENCY
// =============================================================
export const NEXORA_SECTIONS: PageSection[] = [
  // 1. Navigation Header
  {
    id: "sec-nexora-header",
    templateId: "tpl-nexora-header",
    name: "Header Navigation",
    html: `
<nav class="navbar navbar-expand-lg fixed-top">
  <div class="container">
    <a class="navbar-brand" href="#home">nexora<span class="logo-dot"></span></a>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse justify-content-end" id="mainNav">
      <ul class="navbar-nav align-items-lg-center me-lg-3">
        <li class="nav-item"><a class="nav-link" href="#home">Home</a></li>
        <li class="nav-item"><a class="nav-link" href="#about">About</a></li>
        <li class="nav-item"><a class="nav-link" href="#services">Services</a></li>
        <li class="nav-item"><a class="nav-link" href="#projects">Projects</a></li>
        <li class="nav-item"><a class="nav-link" href="#pricing">Pricing</a></li>
        <li class="nav-item"><a class="nav-link" href="#contact">Contact</a></li>
      </ul>
      <a href="#work" class="btn btn-main">Work with us</a>
    </div>
  </div>
</nav>
    `.trim(),
    style: {},
  },

  // 2. Hero Carousel Slider
  {
    id: "sec-nexora-hero",
    templateId: "tpl-nexora-hero",
    name: "Hero Carousel Slider",
    html: `
<section class="hero" id="home">
  <div id="heroSlider" class="carousel slide" data-bs-ride="carousel" data-bs-interval="5500">
    <div class="carousel-indicators">
      <button type="button" data-bs-target="#heroSlider" data-bs-slide-to="0" class="active" aria-label="Slide 1"></button>
      <button type="button" data-bs-target="#heroSlider" data-bs-slide-to="1" aria-label="Slide 2"></button>
      <button type="button" data-bs-target="#heroSlider" data-bs-slide-to="2" aria-label="Slide 3"></button>
    </div>
    <div class="carousel-inner">
      <div class="carousel-item active">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <div class="hero-copy">
                <span class="eyebrow">Digital experiences that matter</span>
                <h1>Ideas that become <span>digital momentum.</span></h1>
                <p>We design and build brands, websites, and products that move ambitious businesses forward.</p>
                <div class="d-flex flex-wrap gap-3">
                  <a class="btn btn-main" href="#work">Start a project</a>
                  <a class="btn btn-ghost" href="#projects">See our work</a>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <img class="hero-art rounded-4 shadow" src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80" alt="Website design interface illustration" />
            </div>
          </div>
        </div>
      </div>
      <div class="carousel-item">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <div class="hero-copy">
                <span class="eyebrow">Search. Strategy. Growth.</span>
                <h1>Make your next move <span>impossible to miss.</span></h1>
                <p>Insight-led SEO and performance campaigns that connect your brand with the people looking for it.</p>
                <div class="d-flex flex-wrap gap-3">
                  <a class="btn btn-main" href="#services">Grow your visibility</a>
                  <a class="btn btn-ghost" href="#pricing">Explore plans</a>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <img class="hero-art rounded-4 shadow" src="https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80" alt="Digital marketing growth illustration" />
            </div>
          </div>
        </div>
      </div>
      <div class="carousel-item">
        <div class="container">
          <div class="row align-items-center">
            <div class="col-lg-6">
              <div class="hero-copy">
                <span class="eyebrow">Built for the real world</span>
                <h1>Products people love to <span>come back to.</span></h1>
                <p>From focused mobile apps to complex platforms, we turn challenging product ideas into smooth experiences.</p>
                <div class="d-flex flex-wrap gap-3">
                  <a class="btn btn-main" href="#contact">Talk to an expert</a>
                  <a class="btn btn-ghost" href="#services">Our services</a>
                </div>
              </div>
            </div>
            <div class="col-lg-6">
              <img class="hero-art rounded-4 shadow" src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=1200&q=80" alt="Mobile application interface illustration" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <button class="carousel-control-prev" type="button" data-bs-target="#heroSlider" data-bs-slide="prev">
      <span class="carousel-control-prev-icon"></span>
      <span class="visually-hidden">Previous</span>
    </button>
    <button class="carousel-control-next" type="button" data-bs-target="#heroSlider" data-bs-slide="next">
      <span class="carousel-control-next-icon"></span>
      <span class="visually-hidden">Next</span>
    </button>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 3. Trust Brands Strip
  {
    id: "sec-nexora-trust",
    templateId: "tpl-nexora-trust",
    name: "Client Trust Bar",
    html: `
<div class="trust">
  <div class="container">
    <small>Trusted by teams building what is next</small>
    <div class="brand-row">
      <span>HORIZON</span>
      <span>northstar</span>
      <span>Monogram</span>
      <span>velora</span>
      <span>arc&amp;co</span>
    </div>
  </div>
</div>
    `.trim(),
    style: {},
  },

  // 4. About Studio Story
  {
    id: "sec-nexora-about",
    templateId: "tpl-nexora-about",
    name: "About Agency & Highlights",
    html: `
<section id="about">
  <div class="container">
    <div class="row align-items-center g-5">
      <div class="col-lg-6">
        <div class="about-image">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80" class="rounded-4 shadow" alt="Creative agency workspace illustration" />
          <div class="metric">
            <strong>10+ yrs</strong>
            <span>creating digital impact</span>
          </div>
        </div>
      </div>
      <div class="col-lg-6">
        <span class="eyebrow">A small agency with big energy</span>
        <h2 class="title">Your sharpest creative and technical partner.</h2>
        <p class="lead mt-4">Nexora brings strategy, design, and development into one close-knit team. We ask smart questions, sweat the details, and create work that earns attention.</p>
        <div class="mt-4">
          <div class="check">
            <b>✦</b>
            <span>Senior specialists on every project, from kickoff to launch.</span>
          </div>
          <div class="check">
            <b>✦</b>
            <span>Clear process, honest collaboration, and no unnecessary jargon.</span>
          </div>
          <div class="check">
            <b>✦</b>
            <span>Digital systems that are made to scale with your business.</span>
          </div>
        </div>
        <a href="#work" class="btn btn-main mt-4">Meet our team</a>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 5. Services Grid
  {
    id: "sec-nexora-services",
    templateId: "tpl-nexora-services",
    name: "Agency Services",
    html: `
<section class="services" id="services">
  <div class="container">
    <div class="row align-items-end mb-5">
      <div class="col-lg-7">
        <span class="eyebrow">What we do</span>
        <h2 class="title">Everything your digital presence needs.</h2>
      </div>
      <div class="col-lg-5">
        <p class="lead mb-0">Pick a focused service or bring us in as your ongoing digital partner.</p>
      </div>
    </div>
    <div class="row g-4">
      <div class="col-md-6 col-lg-4">
        <article class="service-card">
          <div class="service-icon">✦</div>
          <h3>Web Design</h3>
          <p>Distinctive, conversion-minded websites that give your brand an edge from the first scroll.</p>
          <a href="#contact">Explore service</a>
        </article>
      </div>
      <div class="col-md-6 col-lg-4">
        <article class="service-card">
          <div class="service-icon">⌘</div>
          <h3>Web Development</h3>
          <p>Fast, accessible, resilient websites and e-commerce experiences built with care.</p>
          <a href="#contact">Explore service</a>
        </article>
      </div>
      <div class="col-md-6 col-lg-4">
        <article class="service-card">
          <div class="service-icon">↗</div>
          <h3>SEO &amp; Growth</h3>
          <p>Technical SEO, content strategy, and campaigns designed to grow qualified demand.</p>
          <a href="#contact">Explore service</a>
        </article>
      </div>
      <div class="col-md-6 col-lg-4">
        <article class="service-card">
          <div class="service-icon">◉</div>
          <h3>Custom Development</h3>
          <p>Smart portals, tools, integrations, and platforms shaped around your exact workflow.</p>
          <a href="#contact">Explore service</a>
        </article>
      </div>
      <div class="col-md-6 col-lg-4">
        <article class="service-card">
          <div class="service-icon">▣</div>
          <h3>Mobile Apps</h3>
          <p>Intuitive iOS and Android products that make every tap feel naturally useful.</p>
          <a href="#contact">Explore service</a>
        </article>
      </div>
      <div class="col-md-6 col-lg-4">
        <article class="service-card">
          <div class="service-icon">◎</div>
          <h3>Brand Systems</h3>
          <p>Flexible visual identities and digital guidelines that keep every touchpoint on point.</p>
          <a href="#contact">Explore service</a>
        </article>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 6. Call to Action Banner
  {
    id: "sec-nexora-cta",
    templateId: "tpl-nexora-cta",
    name: "Call to Action Banner",
    html: `
<section class="cta">
  <div class="container">
    <div class="cta-box">
      <span class="eyebrow" style="color: #a8fff5">One team. One clear direction.</span>
      <h2>Ready to turn a good idea into your next big advantage?</h2>
      <p class="lead">Tell us where you want to go. We will bring the thinking, people, and momentum to get you there.</p>
      <a href="#work" class="btn btn-light rounded-pill px-4 py-3 fw-bold mt-2">Let's build something →</a>
    </div>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 7. Projects Showcase
  {
    id: "sec-nexora-projects",
    templateId: "tpl-nexora-projects",
    name: "Selected Projects Showcase",
    html: `
<section id="projects">
  <div class="container">
    <div class="d-flex justify-content-between align-items-end flex-wrap gap-3 mb-5">
      <div>
        <span class="eyebrow">Selected work</span>
        <h2 class="title">Proof, not promises.</h2>
      </div>
      <a href="#contact" class="btn btn-ghost">View all projects</a>
    </div>
    <div class="row g-4">
      <div class="col-md-4">
        <article class="work-card">
          <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80" alt="Horizon platform project" />
          <div class="work-info">
            <h3>Horizon Finance</h3>
            <p>Brand, web design &amp; development</p>
          </div>
        </article>
      </div>
      <div class="col-md-4">
        <article class="work-card">
          <img src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=80" alt="Bloom ecommerce project" />
          <div class="work-info">
            <h3>Bloom Goods</h3>
            <p>E-commerce &amp; growth strategy</p>
          </div>
        </article>
      </div>
      <div class="col-md-4">
        <article class="work-card">
          <img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1000&q=80" alt="Verdant analytics project" />
          <div class="work-info">
            <h3>Verdant Health</h3>
            <p>Product design &amp; custom platform</p>
          </div>
        </article>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 8. Pricing Tiers
  {
    id: "sec-nexora-pricing",
    templateId: "tpl-nexora-pricing",
    name: "Transparent Pricing Plans",
    html: `
<section class="pricing" id="pricing">
  <div class="container">
    <div class="text-center mb-5">
      <span class="eyebrow">Simple starting points</span>
      <h2 class="title mx-auto">Big agency thinking. Clear pricing.</h2>
      <p class="lead mx-auto mt-3" style="max-width: 600px">Every engagement is tailored. These plans are a useful place to begin the conversation.</p>
    </div>
    <div class="row g-4 justify-content-center">
      <div class="col-md-6 col-lg-4">
        <article class="price-card">
          <h3>Launch</h3>
          <div class="price">$2,500 <small>from</small></div>
          <p>For a focused, high-impact digital refresh.</p>
          <ul>
            <li>Strategic discovery</li>
            <li>Up to 5 web pages</li>
            <li>Responsive development</li>
            <li>30-day launch support</li>
          </ul>
          <a href="#contact" class="btn btn-ghost w-100">Choose Launch</a>
        </article>
      </div>
      <div class="col-md-6 col-lg-4">
        <article class="price-card hot">
          <h3>Growth</h3>
          <div class="price">$5,900 <small>from</small></div>
          <p>For brands ready for their next level online.</p>
          <ul>
            <li>Full website experience</li>
            <li>SEO foundation and analytics</li>
            <li>Custom interactions</li>
            <li>90-day growth support</li>
          </ul>
          <a href="#contact" class="btn btn-light rounded-pill w-100 fw-bold">Choose Growth</a>
        </article>
      </div>
      <div class="col-md-6 col-lg-4">
        <article class="price-card">
          <h3>Custom</h3>
          <div class="price">Let's talk</div>
          <p>For apps, platforms, and ambitious bespoke products.</p>
          <ul>
            <li>Dedicated project team</li>
            <li>Product strategy workshop</li>
            <li>Custom solution scope</li>
            <li>Long-term partnership</li>
          </ul>
          <a href="#contact" class="btn btn-ghost w-100">Book a call</a>
        </article>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 9. Work & Contact Enquiry
  {
    id: "sec-nexora-contact",
    templateId: "tpl-nexora-contact",
    name: "Contact & Project Enquiry",
    html: `
<section id="work">
  <div class="container">
    <div class="contact-box">
      <div class="row g-5">
        <div class="col-lg-5">
          <span class="eyebrow">Work with Nexora</span>
          <h2 class="title">Have a project in mind?</h2>
          <p class="lead mt-3">Send a few details and we will come back within two business days.</p>
          <div class="contact-detail">
            <strong>Email us</strong>
            <a href="mailto:hello@nexora-demo.com">hello@nexora-demo.com</a>
          </div>
          <div class="contact-detail">
            <strong>Call us</strong>
            <a href="tel:+15550148760">+1 (555) 014-8760</a>
          </div>
          <div class="contact-detail">
            <strong>Visit</strong>
            <span>220 Creative Avenue, Suite 400, New York</span>
          </div>
        </div>
        <div class="col-lg-7">
          <form action="#" method="post" onsubmit="event.preventDefault(); alert('Thank you! Your project enquiry has been submitted.');">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label" for="name">Your name</label>
                <input class="form-control" id="name" type="text" placeholder="Alex Morgan" required />
              </div>
              <div class="col-md-6">
                <label class="form-label" for="email">Email address</label>
                <input class="form-control" id="email" type="email" placeholder="alex@company.com" required />
              </div>
              <div class="col-12">
                <label class="form-label" for="service">What can we help with?</label>
                <select class="form-select form-control" id="service">
                  <option>Website design &amp; development</option>
                  <option>SEO &amp; growth</option>
                  <option>Mobile app</option>
                  <option>Custom development</option>
                  <option>Something else</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label" for="message">Tell us about your project</label>
                <textarea class="form-control" id="message" rows="5" placeholder="A little context, timeline, and goals..."></textarea>
              </div>
              <div class="col-12">
                <button class="btn btn-main" type="submit">Send project enquiry →</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    style: {},
  },

  // 10. Brand Footer & Back to top
  {
    id: "sec-nexora-footer",
    templateId: "tpl-nexora-footer",
    name: "Brand Footer & Back to Top",
    html: `
<footer class="footer">
  <div class="container">
    <div class="row g-5">
      <div class="col-lg-4">
        <a class="navbar-brand text-white" href="#home">nexora<span class="logo-dot"></span></a>
        <p class="mt-3" style="max-width: 280px">A focused digital agency for brands ready to make meaningful moves.</p>
        <div class="social">
          <a href="#" aria-label="LinkedIn">in</a>
          <a href="#" aria-label="Instagram">ig</a>
          <a href="#" aria-label="X">𝕏</a>
        </div>
      </div>
      <div class="col-6 col-lg-2">
        <h5>Explore</h5>
        <a href="#about">About us</a>
        <a href="#services">Services</a>
        <a href="#projects">Projects</a>
        <a href="#pricing">Pricing</a>
      </div>
      <div class="col-6 col-lg-2">
        <h5>Services</h5>
        <a href="#services">Web design</a>
        <a href="#services">Development</a>
        <a href="#services">SEO</a>
        <a href="#services">Mobile apps</a>
      </div>
      <div class="col-lg-4">
        <h5>Get in touch</h5>
        <a href="mailto:hello@nexora-demo.com">hello@nexora-demo.com</a>
        <a href="tel:+15550148760">+1 (555) 014-8760</a>
        <p class="mt-3">220 Creative Avenue, Suite 400<br />New York, NY 10001</p>
      </div>
    </div>
    <div class="footer-bottom d-flex justify-content-between flex-wrap gap-2">
      <span>© 2026 Nexora Studio. All rights reserved.</span>
      <span>Privacy policy · Terms of use</span>
    </div>
  </div>
</footer>
<a class="top" href="#home" aria-label="Back to top">↑</a>
    `.trim(),
    style: {},
  },
];

// =============================================================
// SHARED CHROME & PAGE DEFINITIONS
// =============================================================
export const NEXORA_SHARED_HEADER: PageSection = {
  ...NEXORA_SECTIONS[0],
  id: SHARED_HEADER_SECTION_ID,
  shared: "header",
  widgetInstance: undefined,
};

export const NEXORA_SHARED_FOOTER: PageSection = {
  ...NEXORA_SECTIONS[NEXORA_SECTIONS.length - 1],
  id: SHARED_FOOTER_SECTION_ID,
  shared: "footer",
  widgetInstance: undefined,
};

export const NEXORA_HOME_PAGE: Page = {
  id: "page-nexora-home",
  name: "Home",
  slug: "index",
  sections: NEXORA_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const NEXORA_TEMPLATE: Template = {
  id: "tpl-nexora-agency",
  name: "Nexora — Creative Digital Agency",
  slug: "nexora-digital-agency",
  category: "Agency",
  description: "High-performance creative IT and digital agency template for web, mobile apps, SEO, and custom digital products with interactive hero carousel and project portfolio.",
  status: "published",
  thumbnail: NEXORA_ASSETS.preview,
  previewImage: NEXORA_ASSETS.preview,
  featured: true,
  isNew: true,
  sortOrder: 1,
  widgets: [],
  pages: [NEXORA_HOME_PAGE],
  sharedHeader: NEXORA_SHARED_HEADER,
  sharedFooter: NEXORA_SHARED_FOOTER,
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
  customHead: `
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  `.trim(),
  assets: NEXORA_ASSETS,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};
