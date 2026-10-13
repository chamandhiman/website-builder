import { SHARED_HEADER_SECTION_ID, SHARED_FOOTER_SECTION_ID, type Page, type PageSection } from "@/lib/builder/store";
import type { Template } from "./templates";

// =============================================================
// ASSETS FOR DRIVEPRO DRIVING SCHOOL
// =============================================================
export const DRIVE_PRO_ASSETS = {
  aboutInstructor: "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80",
  adultClass: "https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80",
  defensiveClass: "https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80",
  heroCar: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
  heroSteering: "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=1200&q=80",
  logoDrivePro: "/images/logo-drivepro.svg",
  staff1: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
  staff2: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  staff3: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80",
  teenClass: "https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80",
  whyExpert: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  whyFlexible: "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=400&q=80",
  whySafe: "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=400&q=80",
  whySuccess: "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=400&q=80",
  preview: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80",
};

// =============================================================
// GLOBAL CSS FOR DRIVEPRO DRIVING SCHOOL
// =============================================================
export const DRIVE_PRO_GLOBAL_CSS = `
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css");
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap");

:root {
  --primary: #3b82f6;
  --secondary: #06b6d4;
  --dark: #0f172a;
  --muted: #64748b;
  --light: #f8fafc;
  --white: #ffffff;
  --line: #e2e8f0;
  --radius: 16px;
}

* {
  box-sizing: border-box;
}

html {
  scroll-behavior: smooth;
}

body {
  font-family: "Inter", sans-serif;
  background: var(--light);
  color: var(--dark);
  overflow-x: hidden;
  line-height: 1.6;
  margin: 0;
}

a {
  text-decoration: none;
  color: inherit;
}

.img-fluid {
  max-width: 100%;
  height: auto;
}

section {
  padding: 80px 0;
}

.eyebrow {
  display: inline-block;
  color: var(--primary);
  font-weight: 700;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.title {
  font: 800 clamp(2rem, 4vw, 3.2rem) / 1.15 "Poppins", sans-serif;
  letter-spacing: -0.03em;
}

.lead {
  color: var(--muted);
  font-size: 1.05rem;
  line-height: 1.7;
}

.btn-primary {
  border: 0;
  border-radius: 999px;
  background: var(--primary);
  color: #fff !important;
  padding: 13px 26px;
  font-weight: 600;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.btn-primary:hover {
  background: var(--secondary);
  color: #fff !important;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(59, 130, 246, 0.25);
}

.btn-outline {
  border: 1px solid var(--line);
  border-radius: 999px;
  padding: 12px 24px;
  font-weight: 600;
  background: #fff;
  color: var(--dark) !important;
  transition: all 0.25s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.btn-outline:hover {
  border-color: var(--primary);
  color: var(--primary) !important;
  transform: translateY(-2px);
  box-shadow: 0 8px 18px rgba(15, 23, 42, 0.08);
}

.btn-sm {
  padding: 8px 16px;
  font-size: 0.85rem;
}

.btn-lg {
  padding: 15px 32px;
  font-size: 1.05rem;
}

/* TOP BAR */
.top-bar {
  background: var(--dark);
  color: #fff;
  padding: 10px 0;
  font-size: 0.85rem;
}

.top-bar a {
  color: #cbd5e1;
  margin-right: 18px;
  transition: 0.2s;
}

.top-bar a:hover {
  color: #fff;
}

.top-bar .social {
  display: inline-flex;
  gap: 10px;
  margin-left: 12px;
}

.top-bar .social a {
  display: inline-grid;
  place-items: center;
  width: 28px;
  height: 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  font-size: 0.75rem;
  margin-right: 0;
}

.top-bar .social a:hover {
  background: var(--primary);
  border-color: var(--primary);
}

/* STICKY NAVBAR */
.navbar {
  padding: 18px 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(12px);
  box-shadow: 0 2px 15px rgba(15, 23, 42, 0.06);
  position: sticky !important;
  top: 0 !important;
  z-index: 1000 !important;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  padding: 12px 0;
  box-shadow: 0 4px 22px rgba(15, 23, 42, 0.12);
}

.navbar-brand {
  font: 800 1.5rem "Poppins", sans-serif;
  color: var(--primary);
  display: inline-flex;
  align-items: center;
}

.nav-link {
  font-weight: 600;
  font-size: 0.88rem;
  color: var(--dark) !important;
  margin: 0 8px;
  position: relative;
  transition: color 0.2s ease;
}

.nav-link:after {
  content: "";
  position: absolute;
  left: 0;
  right: 0;
  bottom: -6px;
  height: 2px;
  background: var(--primary);
  transform: scaleX(0);
  transition: transform 0.25s ease;
}

.nav-link:hover:after,
.nav-link.active:after {
  transform: scaleX(1);
}

/* DROPDOWN MENU & CHEVRON */
.dropdown-toggle::after {
  display: none !important;
}

.dropdown-toggle .fa-chevron-down {
  transition: transform 0.25s ease;
  font-size: 0.72rem;
}

.nav-item.dropdown:hover .dropdown-toggle .fa-chevron-down,
.nav-item.dropdown.show .dropdown-toggle .fa-chevron-down {
  transform: rotate(180deg);
}

.dropdown-menu {
  border: 0;
  box-shadow: 0 10px 30px rgba(15, 23, 42, 0.14);
  border-radius: 12px;
  padding: 8px 0;
  margin-top: 8px;
}

.dropdown-item {
  font-weight: 600;
  font-size: 0.86rem;
  padding: 10px 20px;
  transition: all 0.2s ease;
  color: var(--dark);
}

.dropdown-item:hover {
  background: #f1f5f9;
  color: var(--primary);
  padding-left: 24px;
}

@media (min-width: 992px) {
  .nav-item.dropdown:hover .dropdown-menu {
    display: block;
    animation: driveProFadeDown 0.2s ease forwards;
  }
}

@keyframes driveProFadeDown {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}

.navbar-toggler {
  border: 0;
  box-shadow: none;
}

.navbar-toggler-icon {
  background-image: none;
  width: 26px;
  height: 18px;
  position: relative;
  border-top: 2px solid var(--dark);
  border-bottom: 2px solid var(--dark);
}

.navbar-toggler-icon:after {
  content: "";
  position: absolute;
  top: 6px;
  left: 0;
  width: 100%;
  border-top: 2px solid var(--dark);
}

/* HERO SLIDER */
.hero-slider {
  position: relative;
  overflow: hidden;
  background: linear-gradient(135deg, #e0f2fe 0%, #ffffff 50%, #fef3c7 100%);
  padding: 100px 0 80px;
}

.hero-slide {
  display: none;
  animation: driveProFadeSlide 0.8s;
}

.hero-slide.active {
  display: block;
}

.hero-slider .container {
  position: relative;
  z-index: 2;
}

.hero-slider .row {
  align-items: center;
}

.hero-text h1 {
  font: 800 clamp(2.5rem, 5vw, 4rem) / 1.1 "Poppins", sans-serif;
  color: var(--dark);
  margin-bottom: 20px;
}

.hero-text h1 span {
  color: var(--primary);
}

.hero-text p {
  color: var(--muted);
  font-size: 1.1rem;
  margin-bottom: 28px;
  max-width: 500px;
}

.hero-form select {
  padding: 12px 18px;
  border: 1px solid var(--line);
  border-radius: 10px;
  font-size: 0.95rem;
  margin-right: 12px;
  background: #fff;
}

.hero-image {
  position: relative;
  transform: skewX(-8deg);
  margin-left: 40px;
}

.hero-image img {
  transform: skewX(8deg);
  border-radius: 24px;
  box-shadow: 0 25px 50px rgba(15, 23, 42, 0.15);
  max-width: 100%;
}

.slider-dots {
  display: flex;
  justify-content: center;
  gap: 10px;
  margin-top: 40px;
}

.slider-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: #cbd5e1;
  cursor: pointer;
  transition: 0.25s;
}

.slider-dot.active {
  background: var(--primary);
  width: 32px;
  border-radius: 6px;
}

@keyframes driveProFadeSlide {
  from { opacity: 0.5; transform: translateX(20px); }
  to { opacity: 1; transform: none; }
}

/* PAGE HEADER */
.page-header {
  background: linear-gradient(135deg, #e0f2fe, #ffffff);
  padding: 80px 0 50px;
  text-align: center;
}

.page-header h1 {
  font: 800 clamp(2.2rem, 4vw, 3.5rem) / 1.1 "Poppins", sans-serif;
  margin-bottom: 15px;
}

/* CARDS */
.card {
  border: 0;
  border-radius: var(--radius);
  background: #fff;
  box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
  transition: all 0.3s ease;
  height: 100%;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 36px rgba(15, 23, 42, 0.1);
}

.service-card {
  padding: 30px;
  text-align: center;
}

.service-icon {
  width: 65px;
  height: 65px;
  border-radius: 16px;
  display: grid;
  place-items: center;
  background: rgba(59, 130, 246, 0.1);
  font-size: 1.8rem;
  margin: 0 auto 20px;
  color: var(--primary);
}

.service-card h3 {
  font: 700 1.25rem "Poppins", sans-serif;
  margin-bottom: 12px;
}

.service-card p {
  color: var(--muted);
  font-size: 0.92rem;
  line-height: 1.7;
}

.why-card {
  padding: 28px;
}

.why-icon {
  font-size: 2.5rem;
  margin-bottom: 16px;
  color: var(--primary);
}

.why-card h4 {
  font: 700 1.15rem "Poppins", sans-serif;
  margin-bottom: 10px;
}

.why-card p {
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.65;
}

/* SERVICE DETAIL */
.service-detail {
  padding: 70px 0;
  border-bottom: 1px solid var(--line);
}

.service-detail:last-child {
  border-bottom: 0;
}

/* STAFF CARDS */
.staff-card {
  padding: 30px;
  text-align: center;
}

.staff-img {
  width: 140px;
  height: 140px;
  border-radius: 50%;
  margin: 0 auto 20px;
  overflow: hidden;
  background: #f1f5f9;
  display: grid;
  place-items: center;
}

.staff-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.staff-card h4 {
  font: 700 1.15rem "Poppins", sans-serif;
  margin-bottom: 5px;
}

.staff-card .role {
  color: var(--primary);
  font-weight: 600;
  font-size: 0.9rem;
  margin-bottom: 10px;
}

.staff-card p {
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.6;
}

/* PRICING ACCORDION */
.pricing-accordion {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  margin-bottom: 16px;
  overflow: hidden;
  background: #fff;
  transition: all 0.25s ease;
}

.pricing-header {
  display: grid;
  grid-template-columns: 1.5fr 1fr 2fr;
  align-items: center;
  padding: 22px 28px;
  cursor: pointer;
  transition: 0.2s;
}

.pricing-header:hover {
  background: #f8fafc;
}

.pricing-header h3 {
  font: 700 1.2rem "Poppins", sans-serif;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.pricing-price {
  font: 800 2rem "Poppins", sans-serif;
  color: var(--primary);
}

.pricing-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.pricing-body {
  display: none;
  padding: 0 28px 25px;
  background: #f8fafc;
  border-top: 1px solid var(--line);
}

.pricing-accordion.active .pricing-body {
  display: block;
}

.pricing-body p {
  color: var(--muted);
  line-height: 1.7;
  margin: 18px 0 15px;
}

.pricing-body ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.pricing-body li {
  padding: 8px 0;
  border-bottom: 1px solid var(--line);
  font-size: 0.9rem;
  display: flex;
  justify-content: space-between;
}

/* FAQ ACCORDION */
.faq-item {
  border: 1px solid var(--line);
  border-radius: var(--radius);
  margin-bottom: 15px;
  overflow: hidden;
  background: #fff;
  transition: all 0.25s ease;
}

.faq-question {
  padding: 20px 25px;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: 0.2s;
}

.faq-question:hover {
  background: #f8fafc;
}

.faq-answer {
  display: none;
  padding: 0 25px 20px;
  color: var(--muted);
  line-height: 1.7;
}

.faq-item.active .faq-answer {
  display: block;
}

.faq-icon {
  font-size: 1.2rem;
  transition: transform 0.3s ease;
  color: var(--primary);
}

.faq-item.active .faq-icon {
  transform: rotate(45deg);
}

/* RESOURCES */
.resource-card {
  padding: 30px;
}

.resource-icon {
  font-size: 2.5rem;
  margin-bottom: 15px;
  color: var(--primary);
}

.resource-card h4 {
  font: 700 1.15rem "Poppins", sans-serif;
  margin-bottom: 10px;
}

.resource-card p {
  color: var(--muted);
  font-size: 0.9rem;
  line-height: 1.65;
}

/* ACCESSIBILITY & LEGAL */
.access-feature {
  padding: 25px;
  border-left: 4px solid var(--primary);
  background: #f8fafc;
  margin-bottom: 20px;
  border-radius: 0 12px 12px 0;
}

.access-feature h4 {
  font: 700 1.1rem "Poppins", sans-serif;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.legal-content {
  max-width: 800px;
  margin: auto;
}

.legal-content h2 {
  font: 700 1.4rem "Poppins", sans-serif;
  margin: 35px 0 16px;
  color: var(--dark);
}

.legal-content p, .legal-content li {
  color: var(--muted);
  line-height: 1.75;
}

/* CONTACT BOX */
.contact-box {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 20px;
  padding: 35px;
  box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
}

.contact-info {
  margin-bottom: 22px;
}

.contact-info strong {
  display: block;
  font-size: 0.9rem;
  color: var(--dark);
  margin-bottom: 4px;
}

.contact-info a, .contact-info span {
  color: var(--muted);
  font-size: 0.95rem;
}

/* FOOTER */
.footer {
  background: #0f172a;
  color: #e2e8f0;
  padding: 70px 0 25px;
}

.footer p,
.footer a {
  color: #94a3b8;
  font-size: 0.9rem;
}

.footer h5 {
  font: 700 0.8rem "Poppins", sans-serif;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  margin-bottom: 18px;
  color: #fff;
}

.footer a {
  display: block;
  margin: 8px 0;
  transition: 0.2s;
}

.footer a:hover {
  color: #fff;
  transform: translateX(3px);
}

.footer-logo {
  margin-bottom: 15px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin-top: 45px;
  padding-top: 20px;
  font-size: 0.78rem;
  color: #64748b;
}

/* BACK TO TOP */
.back-top {
  position: fixed;
  right: 20px;
  bottom: 20px;
  z-index: 99;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: var(--primary);
  color: #fff;
  box-shadow: 0 8px 22px rgba(59, 130, 246, 0.35);
  transition: 0.25s;
  font-size: 1.1rem;
  opacity: 0;
  visibility: hidden;
}

.back-top.show {
  opacity: 1;
  visibility: visible;
}

.back-top:hover {
  color: #fff;
  transform: translateY(-5px);
  background: var(--secondary);
}

@media (max-width: 991px) {
  .hero-text {
    text-align: center;
    margin-bottom: 40px;
  }
  .hero-form {
    justify-content: center;
  }
  .hero-image {
    transform: none;
    margin: 0;
  }
  .hero-image img {
    transform: none;
  }
  .pricing-header {
    grid-template-columns: 1fr;
    gap: 15px;
    text-align: center;
  }
  .pricing-actions {
    justify-content: center;
  }
}

@media (max-width: 767px) {
  .navbar-collapse {
    padding: 15px 0;
  }
  .navbar .btn-primary {
    margin-top: 10px;
  }
  .hero-slider {
    padding: 70px 0 50px;
  }
  .top-bar {
    text-align: center;
  }
  .top-bar .social {
    margin: 10px 0 0;
  }
}

@media (max-width: 575px) {
  section {
    padding: 50px 0;
  }
  .hero-text h1 {
    font-size: 2rem;
  }
}
`.trim();

// =============================================================
// GLOBAL JS FOR DRIVEPRO DRIVING SCHOOL
// =============================================================
export const DRIVE_PRO_GLOBAL_JS = `
// Sticky Navbar & Back to Top Toggle
window.addEventListener('scroll', function() {
  const nav = document.querySelector('.navbar');
  if (nav) nav.classList.toggle('scrolled', window.scrollY > 30);
  const backTop = document.querySelector('.back-top');
  if (backTop) {
    if (window.scrollY > 300) backTop.classList.add('show');
    else backTop.classList.remove('show');
  }
});

// Back to Top Click
document.addEventListener('click', function(e) {
  const backTop = e.target.closest('.back-top');
  if (backTop) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
});

// Hero Slider Functions
let driveProSlide = 0;
window.showDriveProSlide = function(n) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.slider-dot');
  if (!slides.length) return;
  slides.forEach(s => s.classList.remove('active'));
  dots.forEach(d => d.classList.remove('active'));
  driveProSlide = (n + slides.length) % slides.length;
  slides[driveProSlide]?.classList.add('active');
  dots[driveProSlide]?.classList.add('active');
};

if (typeof window !== 'undefined') {
  setInterval(function() {
    const slides = document.querySelectorAll('.hero-slide');
    if (slides.length > 1) {
      window.showDriveProSlide((driveProSlide + 1) % slides.length);
    }
  }, 5000);
}

// Pricing Accordions
document.addEventListener('click', function(e) {
  const header = e.target.closest('.pricing-header');
  if (header) {
    const accordion = header.closest('.pricing-accordion');
    if (accordion) accordion.classList.toggle('active');
  }
  const detailBtn = e.target.closest('.pricing-actions button');
  if (detailBtn) {
    e.stopPropagation();
    const accordion = detailBtn.closest('.pricing-accordion');
    const body = accordion ? accordion.querySelector('.pricing-body') : null;
    if (body) {
      const isVisible = body.style.display === 'block';
      body.style.display = isVisible ? 'none' : 'block';
      detailBtn.textContent = isVisible ? 'Details' : 'Hide Details';
    }
  }
});

// FAQ Accordion
document.addEventListener('click', function(e) {
  const faqItem = e.target.closest('.faq-item');
  if (faqItem) {
    faqItem.classList.toggle('active');
  }
});

// Navbar Collapse close on mobile link click
document.querySelectorAll('.navbar .nav-link, .navbar .dropdown-item').forEach(function(link) {
  link.addEventListener('click', function() {
    if (typeof window !== 'undefined' && window.bootstrap) {
      const collapseEl = document.querySelector('.navbar-collapse.show');
      if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();
    }
  });
});
`.trim();

// =============================================================
// CUSTOM HEAD FOR DRIVEPRO DRIVING SCHOOL
// =============================================================
export const DRIVE_PRO_CUSTOM_HEAD = `
<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css" crossorigin="anonymous" referrerpolicy="no-referrer">
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700;800&display=swap" rel="stylesheet">
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
`.trim();

// =============================================================
// SHARED HEADER (Sticky with Font Awesome Dropdown Icons)
// =============================================================
export const DRIVE_PRO_SHARED_HEADER: PageSection = {
  id: SHARED_HEADER_SECTION_ID,
  templateId: "tpl-drivepro-shared-header",
  name: "Header Navigation",
  shared: "header",
  widgetInstance: undefined,
  html: `
<header class="drivepro-header">
  <div class="top-bar">
    <div class="container d-flex justify-content-between align-items-center flex-wrap">
      <div class="d-flex align-items-center flex-wrap gap-3">
        <a href="tel:+15550123456" class="d-inline-flex align-items-center">
          <i class="fa-solid fa-phone me-2 text-primary"></i>(555) 012-3456
        </a>
        <a href="mailto:info@drivepro.com" class="d-inline-flex align-items-center">
          <i class="fa-solid fa-envelope me-2 text-primary"></i>info@drivepro.com
        </a>
        <span class="social">
          <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
        </span>
      </div>
      <div>
        <a href="enroll.html" class="d-inline-flex align-items-center">
          Student Portal <i class="fa-solid fa-arrow-right-to-bracket ms-1.5 text-primary"></i>
        </a>
      </div>
    </div>
  </div>
  <nav class="navbar navbar-expand-lg">
    <div class="container">
      <a class="navbar-brand d-flex align-items-center gap-2" href="index.html">
        <img src="/images/logo-drivepro.svg" alt="DrivePro" height="38">
      </a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#mainNav" aria-controls="mainNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse justify-content-end" id="mainNav">
        <ul class="navbar-nav align-items-lg-center">
          <li class="nav-item"><a class="nav-link" href="index.html">Home</a></li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle d-inline-flex align-items-center gap-1" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              About Us <i class="fa-solid fa-chevron-down ms-1" style="font-size: 0.72rem;"></i>
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item d-flex align-items-center" href="about.html"><i class="fa-solid fa-circle-info me-2 text-primary"></i>Our Story</a></li>
              <li><a class="dropdown-item d-flex align-items-center" href="staff.html"><i class="fa-solid fa-user-tie me-2 text-primary"></i>Our Staff</a></li>
              <li><a class="dropdown-item d-flex align-items-center" href="accessibility.html"><i class="fa-solid fa-universal-access me-2 text-primary"></i>Accessibility</a></li>
            </ul>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link dropdown-toggle d-inline-flex align-items-center gap-1" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
              Services <i class="fa-solid fa-chevron-down ms-1" style="font-size: 0.72rem;"></i>
            </a>
            <ul class="dropdown-menu">
              <li><a class="dropdown-item d-flex align-items-center" href="services.html#teen"><i class="fa-solid fa-id-card me-2 text-primary"></i>Teen Driving</a></li>
              <li><a class="dropdown-item d-flex align-items-center" href="services.html#adult"><i class="fa-solid fa-car me-2 text-primary"></i>Adult Driving</a></li>
              <li><a class="dropdown-item d-flex align-items-center" href="services.html#defensive"><i class="fa-solid fa-shield-halved me-2 text-primary"></i>Defensive Driving</a></li>
            </ul>
          </li>
          <li class="nav-item"><a class="nav-link" href="enroll.html">Enroll</a></li>
          <li class="nav-item"><a class="nav-link" href="resources.html">Resources</a></li>
          <li class="nav-item"><a class="nav-link" href="faq.html">FAQ</a></li>
          <li class="nav-item"><a class="nav-link" href="contact.html">Contact</a></li>
          <li class="nav-item ms-lg-3">
            <a class="btn btn-primary d-inline-flex align-items-center gap-2" href="enroll.html">
              <i class="fa-solid fa-graduation-cap"></i> Enroll Now
            </a>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</header>
  `.trim(),
};

// =============================================================
// SHARED FOOTER (With Font Awesome & Rich Links)
// =============================================================
export const DRIVE_PRO_SHARED_FOOTER: PageSection = {
  id: SHARED_FOOTER_SECTION_ID,
  templateId: "tpl-drivepro-shared-footer",
  name: "Footer & Back to Top",
  shared: "footer",
  widgetInstance: undefined,
  html: `
<footer class="footer">
  <div class="container">
    <div class="row g-5">
      <div class="col-lg-4">
        <img src="/images/logo-drivepro.svg" alt="DrivePro" class="footer-logo" height="40">
        <p class="mt-3">Professional driving instruction for teens and adults. Building safe, confident, and certified drivers since 2005.</p>
        <div class="social mt-3">
          <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" aria-label="Instagram"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" aria-label="Twitter"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="#" aria-label="YouTube"><i class="fa-brands fa-youtube"></i></a>
        </div>
      </div>
      <div class="col-6 col-lg-2">
        <h5>Quick Links</h5>
        <a href="index.html"><i class="fa-solid fa-angle-right me-1 text-primary"></i> Home</a>
        <a href="about.html"><i class="fa-solid fa-angle-right me-1 text-primary"></i> About Us</a>
        <a href="services.html"><i class="fa-solid fa-angle-right me-1 text-primary"></i> Services</a>
        <a href="enroll.html"><i class="fa-solid fa-angle-right me-1 text-primary"></i> Enroll</a>
        <a href="contact.html"><i class="fa-solid fa-angle-right me-1 text-primary"></i> Contact</a>
      </div>
      <div class="col-6 col-lg-2">
        <h5>Programs</h5>
        <a href="services.html#teen"><i class="fa-solid fa-angle-right me-1 text-primary"></i> Teen Driving</a>
        <a href="services.html#adult"><i class="fa-solid fa-angle-right me-1 text-primary"></i> Adult Lessons</a>
        <a href="services.html#defensive"><i class="fa-solid fa-angle-right me-1 text-primary"></i> Defensive Driving</a>
        <a href="resources.html"><i class="fa-solid fa-angle-right me-1 text-primary"></i> Resources</a>
        <a href="faq.html"><i class="fa-solid fa-angle-right me-1 text-primary"></i> FAQ</a>
      </div>
      <div class="col-lg-4">
        <h5>Contact Info</h5>
        <a href="tel:+15550123456" class="d-flex align-items-center mb-2"><i class="fa-solid fa-phone me-2 text-primary"></i> (555) 012-3456</a>
        <a href="mailto:info@drivepro.com" class="d-flex align-items-center mb-2"><i class="fa-solid fa-envelope me-2 text-primary"></i> info@drivepro.com</a>
        <p class="mt-2 mb-3"><i class="fa-solid fa-location-dot me-2 text-primary"></i> 123 Driving Lane, Suite 100<br><span class="ms-4">Cityville, ST 12345</span></p>
        <div class="mt-3 pt-2 border-top border-secondary-subtle">
          <a href="privacy.html" style="display:inline"><i class="fa-solid fa-shield-halved me-1 text-muted"></i> Privacy Policy</a>
          <a href="terms.html" style="display:inline;margin-left:15px"><i class="fa-solid fa-file-contract me-1 text-muted"></i> Terms</a>
          <a href="accessibility.html" style="display:inline;margin-left:15px"><i class="fa-solid fa-universal-access me-1 text-muted"></i> Accessibility</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom d-flex justify-content-between flex-wrap gap-2">
      <span>&copy; 2026 DrivePro Driving School. All rights reserved.</span>
      <span><i class="fa-solid fa-award text-primary me-1"></i> State Licensed & Insured DMV Academy</span>
    </div>
  </div>
</footer>
<a class="back-top" href="#" aria-label="Back to top"><i class="fa-solid fa-arrow-up"></i></a>
  `.trim(),
};

// =============================================================
// PAGE SECTIONS: 1. HOME (index.html)
// =============================================================
export const DRIVE_PRO_HOME_SECTIONS: PageSection[] = [
  {
    id: "tpl-drivepro-home-hero",
    templateId: "tpl-drivepro-home-hero",
    name: "Hero Slider",
    widgetInstance: undefined,
    html: `
<section class="hero-slider">
  <div class="container">
    <div class="row align-items-center">
      <div class="col-lg-6 hero-text">
        <div class="hero-slide active">
          <span class="eyebrow"><i class="fa-solid fa-certificate me-1"></i> Welcome to DrivePro</span>
          <h1>Learn to Drive with <span>Confidence</span></h1>
          <p>Professional driving instruction for teens and adults. Safe, patient, and effective lessons that prepare you for the road ahead.</p>
          <form class="hero-form d-flex flex-wrap gap-2" action="enroll.html">
            <select required class="form-select w-auto">
              <option value="">Select Program</option>
              <option value="teen">Teen Driver Education</option>
              <option value="adult">Adult Driving Lessons</option>
              <option value="defensive">Defensive Driving</option>
            </select>
            <button type="submit" class="btn btn-primary">
              <i class="fa-solid fa-id-card"></i> Register Now
            </button>
          </form>
        </div>
      </div>
      <div class="col-lg-6">
        <div class="hero-image">
          <img src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?auto=format&fit=crop&w=1200&q=80" alt="Driving lesson" class="img-fluid rounded-4 shadow">
        </div>
      </div>
    </div>
    <div class="slider-dots">
      <span class="slider-dot active" onclick="window.showDriveProSlide(0)"></span>
      <span class="slider-dot" onclick="window.showDriveProSlide(1)"></span>
      <span class="slider-dot" onclick="window.showDriveProSlide(2)"></span>
    </div>
  </div>
</section>
    `.trim(),
  },
  {
    id: "tpl-drivepro-home-about",
    templateId: "tpl-drivepro-home-about",
    name: "About Overview",
    widgetInstance: undefined,
    html: `
<section id="about">
  <div class="container">
    <div class="row g-5 align-items-center">
      <div class="col-lg-6">
        <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80" class="img-fluid rounded-4 shadow" alt="Driving instructor">
      </div>
      <div class="col-lg-6">
        <span class="eyebrow"><i class="fa-solid fa-road me-1"></i> About DrivePro</span>
        <h2 class="title mb-4">Building Safe Drivers Since 2005</h2>
        <p class="lead">At DrivePro, we're committed to teaching the next generation of drivers with patience, expertise, and a focus on safety. Our certified instructors bring years of experience to every lesson.</p>
        <p class="mb-4">We offer comprehensive programs for teens, adults, and defensive driving courses. With flexible scheduling and modern dual-control vehicles, we make learning to drive stress-free.</p>
        <a href="about.html" class="btn btn-outline">
          <i class="fa-solid fa-arrow-right"></i> Learn More About Us
        </a>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
  {
    id: "tpl-drivepro-home-why",
    templateId: "tpl-drivepro-home-why",
    name: "Why Choose Us",
    widgetInstance: undefined,
    html: `
<section class="bg-white">
  <div class="container">
    <div class="text-center mb-5">
      <span class="eyebrow"><i class="fa-solid fa-star me-1"></i> Why Choose Us</span>
      <h2 class="title">The DrivePro Advantage</h2>
    </div>
    <div class="row g-4">
      <div class="col-md-6 col-lg-3">
        <div class="card why-card">
          <div class="why-icon"><i class="fa-solid fa-shield-halved"></i></div>
          <h4>Safety First</h4>
          <p>Our curriculum emphasizes defensive driving techniques and safe habits that last a lifetime.</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="card why-card">
          <div class="why-icon"><i class="fa-solid fa-user-graduate"></i></div>
          <h4>Certified Instructors</h4>
          <p>All instructors are state-certified, background-checked, and trained in the latest teaching methods.</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="card why-card">
          <div class="why-icon"><i class="fa-solid fa-calendar-check"></i></div>
          <h4>Flexible Scheduling</h4>
          <p>We work around your schedule with evening and weekend appointments available throughout the week.</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-3">
        <div class="card why-card">
          <div class="why-icon"><i class="fa-solid fa-trophy"></i></div>
          <h4>High Pass Rate</h4>
          <p>98% of our students pass their state driving test on their very first attempt with flying colors.</p>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
  {
    id: "tpl-drivepro-home-programs",
    templateId: "tpl-drivepro-home-programs",
    name: "Our Programs",
    widgetInstance: undefined,
    html: `
<section id="services">
  <div class="container">
    <div class="text-center mb-5">
      <span class="eyebrow"><i class="fa-solid fa-car me-1"></i> Our Programs</span>
      <h2 class="title">Driving Courses</h2>
    </div>
    <div class="row g-4">
      <div class="col-md-6 col-lg-4">
        <div class="card service-card">
          <div class="service-icon"><i class="fa-solid fa-id-card"></i></div>
          <h3>Teen Driver Ed</h3>
          <p>Comprehensive 30-hour classroom + behind-the-wheel training for ages 15-18.</p>
          <a href="services.html#teen" class="btn btn-outline mt-3">
            <i class="fa-solid fa-arrow-right"></i> Learn More
          </a>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card service-card">
          <div class="service-icon"><i class="fa-solid fa-car"></i></div>
          <h3>Adult Lessons</h3>
          <p>Personalized instruction for adult learners, from first-time drivers to license refreshers.</p>
          <a href="services.html#adult" class="btn btn-outline mt-3">
            <i class="fa-solid fa-arrow-right"></i> Learn More
          </a>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card service-card">
          <div class="service-icon"><i class="fa-solid fa-shield-halved"></i></div>
          <h3>Defensive Driving</h3>
          <p>Advanced techniques to anticipate hazards and drive safely in all conditions.</p>
          <a href="services.html#defensive" class="btn btn-outline mt-3">
            <i class="fa-solid fa-arrow-right"></i> Learn More
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
  {
    id: "tpl-drivepro-home-cta",
    templateId: "tpl-drivepro-home-cta",
    name: "Call to Action",
    widgetInstance: undefined,
    html: `
<section class="bg-white">
  <div class="container text-center">
    <span class="eyebrow"><i class="fa-solid fa-compass me-1"></i> Start Today</span>
    <h2 class="title mb-4">Ready to Start Your Journey?</h2>
    <p class="lead mb-4" style="max-width:600px;margin:auto">Enroll today and take the first step toward confident, safe driving. Flexible scheduling and competitive pricing.</p>
    <div class="d-flex justify-content-center gap-3 flex-wrap">
      <a href="enroll.html" class="btn btn-primary btn-lg">
        <i class="fa-solid fa-graduation-cap"></i> Enroll Now
      </a>
      <a href="contact.html" class="btn btn-outline btn-lg">
        <i class="fa-solid fa-envelope"></i> Contact Us
      </a>
    </div>
  </div>
</section>
    `.trim(),
  },
];

// =============================================================
// PAGE SECTIONS: 2. ABOUT US (about.html)
// =============================================================
export const DRIVE_PRO_ABOUT_SECTIONS: PageSection[] = [
  {
    id: "tpl-drivepro-about-hero",
    templateId: "tpl-drivepro-about-hero",
    name: "About Header",
    widgetInstance: undefined,
    html: `
<div class="page-header">
  <div class="container">
    <span class="eyebrow"><i class="fa-solid fa-users me-1"></i> Who We Are</span>
    <h1>About DrivePro</h1>
    <p class="lead" style="max-width:650px;margin:auto">For over 20 years, we've been dedicated to creating safe, confident drivers through quality education and personalized instruction.</p>
  </div>
</div>
    `.trim(),
  },
  {
    id: "tpl-drivepro-about-story",
    templateId: "tpl-drivepro-about-story",
    name: "Our Story & Stats",
    widgetInstance: undefined,
    html: `
<section>
  <div class="container">
    <div class="row g-5 align-items-center">
      <div class="col-lg-6">
        <img src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&w=1000&q=80" class="img-fluid rounded-4 shadow" alt="Driving instructor">
      </div>
      <div class="col-lg-6">
        <span class="eyebrow"><i class="fa-solid fa-award me-1"></i> Founded in 2005</span>
        <h2 class="title mb-4">Our Story</h2>
        <p class="lead">DrivePro Driving School was founded in 2005 by Michael and Sarah Johnson, both certified driving instructors with a passion for road safety.</p>
        <p>What started as a small family business has grown into one of the most trusted driving schools in the region. We've taught over 15,000 students to drive safely and confidently.</p>
        <p>Our mission is simple: to reduce accidents by providing comprehensive driver education that goes beyond just passing the test. We focus on building lifelong safe driving habits.</p>
        <div class="row g-4 mt-4">
          <div class="col-6">
            <div class="card p-4 text-center">
              <h3 class="mb-0" style="font-size:2.5rem;color:var(--primary);font-weight:800">20+</h3>
              <p class="mb-0 text-muted">Years Experience</p>
            </div>
          </div>
          <div class="col-6">
            <div class="card p-4 text-center">
              <h3 class="mb-0" style="font-size:2.5rem;color:var(--primary);font-weight:800">15K+</h3>
              <p class="mb-0 text-muted">Students Taught</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
  {
    id: "tpl-drivepro-about-values",
    templateId: "tpl-drivepro-about-values",
    name: "Our Values",
    widgetInstance: undefined,
    html: `
<section class="bg-white">
  <div class="container">
    <div class="text-center mb-5">
      <span class="eyebrow"><i class="fa-solid fa-heart me-1"></i> Our Core Values</span>
      <h2 class="title">What Drives Us</h2>
    </div>
    <div class="row g-4">
      <div class="col-md-4">
        <div class="card p-4 text-center">
          <div class="why-icon mb-3"><i class="fa-solid fa-bullseye text-primary"></i></div>
          <h4>Excellence</h4>
          <p class="text-muted">We maintain the highest standards in driver education and customer service.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card p-4 text-center">
          <div class="why-icon mb-3"><i class="fa-solid fa-hand-holding-heart text-danger"></i></div>
          <h4>Patience</h4>
          <p class="text-muted">Every student learns at their own pace. We create a supportive, judgment-free environment.</p>
        </div>
      </div>
      <div class="col-md-4">
        <div class="card p-4 text-center">
          <div class="why-icon mb-3"><i class="fa-solid fa-shield-halved text-primary"></i></div>
          <h4>Safety</h4>
          <p class="text-muted">Safety is at the core of everything we teach. We prepare students for real-world driving challenges.</p>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
];

// =============================================================
// PAGE SECTIONS: 3. SERVICES (services.html)
// =============================================================
export const DRIVE_PRO_SERVICES_SECTIONS: PageSection[] = [
  {
    id: "tpl-drivepro-services-hero",
    templateId: "tpl-drivepro-services-hero",
    name: "Services Header",
    widgetInstance: undefined,
    html: `
<div class="page-header">
  <div class="container">
    <span class="eyebrow"><i class="fa-solid fa-graduation-cap me-1"></i> What We Offer</span>
    <h1>Our Services</h1>
    <p class="lead" style="max-width:650px;margin:auto">Comprehensive driver education programs designed for every age and experience level.</p>
  </div>
</div>
    `.trim(),
  },
  {
    id: "tpl-drivepro-services-teen",
    templateId: "tpl-drivepro-services-teen",
    name: "Teen Driver Education",
    widgetInstance: undefined,
    html: `
<section id="teen" class="service-detail">
  <div class="container">
    <div class="row g-5 align-items-center">
      <div class="col-lg-6 order-lg-2">
        <img src="https://images.unsplash.com/photo-1517524008697-84bbe3c3fd98?auto=format&fit=crop&w=800&q=80" class="img-fluid rounded-4 shadow" alt="Teen driving">
      </div>
      <div class="col-lg-6 order-lg-1">
        <span class="eyebrow"><i class="fa-solid fa-id-card me-1"></i> Ages 15-18</span>
        <h2 class="title mb-4">Teen Driver Education</h2>
        <p class="lead">Our comprehensive teen program prepares young drivers for a lifetime of safe driving.</p>
        <p>The program includes 30 hours of classroom instruction covering traffic laws, defensive driving techniques, and the responsibilities of operating a vehicle. Plus 6 hours of behind-the-wheel training with a certified instructor.</p>
        <ul class="list-unstyled mt-4 space-y-2">
          <li class="mb-2"><i class="fa-solid fa-circle-check text-primary me-2"></i><strong>Classroom:</strong> 30 hours of interactive education</li>
          <li class="mb-2"><i class="fa-solid fa-circle-check text-primary me-2"></i><strong>Behind-the-Wheel:</strong> 6 hours of one-on-one instruction</li>
          <li class="mb-2"><i class="fa-solid fa-circle-check text-primary me-2"></i><strong>Observation:</strong> 6 hours observing other students</li>
          <li class="mb-2"><i class="fa-solid fa-circle-check text-primary me-2"></i><strong>Certification:</strong> State-approved completion certificate</li>
        </ul>
        <a href="enroll.html" class="btn btn-primary mt-4">
          <i class="fa-solid fa-user-plus"></i> Enroll Now
        </a>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
  {
    id: "tpl-drivepro-services-adult",
    templateId: "tpl-drivepro-services-adult",
    name: "Adult Driving Lessons",
    widgetInstance: undefined,
    html: `
<section id="adult" class="service-detail bg-white">
  <div class="container">
    <div class="row g-5 align-items-center">
      <div class="col-lg-6">
        <img src="https://images.unsplash.com/photo-1508974239320-0a029497e820?auto=format&fit=crop&w=800&q=80" class="img-fluid rounded-4 shadow" alt="Adult driving">
      </div>
      <div class="col-lg-6">
        <span class="eyebrow"><i class="fa-solid fa-user me-1"></i> Ages 18+</span>
        <h2 class="title mb-4">Adult Driving Lessons</h2>
        <p class="lead">Never too late to learn. Personalized instruction for adult students.</p>
        <p>Whether you're a first-time driver, need to refresh your skills, or want to overcome driving anxiety, our adult program is tailored to your needs. Flexible scheduling including evenings and weekends.</p>
        <ul class="list-unstyled mt-4 space-y-2">
          <li class="mb-2"><i class="fa-solid fa-circle-check text-primary me-2"></i><strong>Beginner:</strong> Complete basics from scratch</li>
          <li class="mb-2"><i class="fa-solid fa-circle-check text-primary me-2"></i><strong>Refresher:</strong> Brush up on skills and rules</li>
          <li class="mb-2"><i class="fa-solid fa-circle-check text-primary me-2"></i><strong>Highway:</strong> Master freeway and highway driving</li>
          <li class="mb-2"><i class="fa-solid fa-circle-check text-primary me-2"></i><strong>Test Prep:</strong> Practice for your license exam</li>
        </ul>
        <a href="enroll.html" class="btn btn-primary mt-4">
          <i class="fa-solid fa-car"></i> Get Started
        </a>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
  {
    id: "tpl-drivepro-services-defensive",
    templateId: "tpl-drivepro-services-defensive",
    name: "Defensive Driving Course",
    widgetInstance: undefined,
    html: `
<section id="defensive" class="service-detail">
  <div class="container">
    <div class="row g-5 align-items-center">
      <div class="col-lg-6 order-lg-2">
        <img src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=800&q=80" class="img-fluid rounded-4 shadow" alt="Defensive driving">
      </div>
      <div class="col-lg-6 order-lg-1">
        <span class="eyebrow"><i class="fa-solid fa-shield-halved me-1"></i> All Ages</span>
        <h2 class="title mb-4">Defensive Driving Course</h2>
        <p class="lead">Advanced techniques to stay safe on the road and potentially reduce insurance costs.</p>
        <p>Our defensive driving course teaches you to anticipate hazards, react appropriately to dangerous situations, and develop habits that protect you and your passengers. Many insurance companies offer discounts for completion.</p>
        <ul class="list-unstyled mt-4 space-y-2">
          <li class="mb-2"><i class="fa-solid fa-circle-check text-primary me-2"></i><strong>Duration:</strong> 6-hour comprehensive course</li>
          <li class="mb-2"><i class="fa-solid fa-circle-check text-primary me-2"></i><strong>Format:</strong> In-person or online options</li>
          <li class="mb-2"><i class="fa-solid fa-circle-check text-primary me-2"></i><strong>Benefits:</strong> Insurance discounts, ticket dismissal</li>
          <li class="mb-2"><i class="fa-solid fa-circle-check text-primary me-2"></i><strong>Certification:</strong> State-approved certificate</li>
        </ul>
        <a href="enroll.html" class="btn btn-primary mt-4">
          <i class="fa-solid fa-certificate"></i> Register Today
        </a>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
];

// =============================================================
// PAGE SECTIONS: 4. STAFF (staff.html)
// =============================================================
export const DRIVE_PRO_STAFF_SECTIONS: PageSection[] = [
  {
    id: "tpl-drivepro-staff-hero",
    templateId: "tpl-drivepro-staff-hero",
    name: "Staff Header",
    widgetInstance: undefined,
    html: `
<div class="page-header">
  <div class="container">
    <span class="eyebrow"><i class="fa-solid fa-user-tie me-1"></i> Meet The Team</span>
    <h1>Our Instructors</h1>
    <p class="lead" style="max-width:650px;margin:auto">Certified, experienced, and passionate about creating safe, confident drivers.</p>
  </div>
</div>
    `.trim(),
  },
  {
    id: "tpl-drivepro-staff-grid",
    templateId: "tpl-drivepro-staff-grid",
    name: "Instructors Directory",
    widgetInstance: undefined,
    html: `
<section>
  <div class="container">
    <div class="row g-4 justify-content-center">
      <div class="col-md-6 col-lg-4">
        <div class="card staff-card">
          <div class="staff-img">
            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80" alt="Michael Johnson">
          </div>
          <h4>Michael Johnson</h4>
          <div class="role"><i class="fa-solid fa-award me-1"></i> Founder & Lead Instructor</div>
          <p>25+ years of driving instruction experience. State-certified and passionate about teen driver safety and advanced vehicle control.</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card staff-card">
          <div class="staff-img">
            <img src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80" alt="Sarah Johnson">
          </div>
          <h4>Sarah Johnson</h4>
          <div class="role"><i class="fa-solid fa-heart me-1"></i> Co-Founder & Instructor</div>
          <p>Certified instructor specializing in defensive driving, student anxiety management, and patience-driven beginner training.</p>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card staff-card">
          <div class="staff-img">
            <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80" alt="David Martinez">
          </div>
          <h4>David Martinez</h4>
          <div class="role"><i class="fa-solid fa-shield-halved me-1"></i> Senior Instructor</div>
          <p>15 years experience. Expert in adult driver education, multi-lane highway navigation, and road exam readiness.</p>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
];

// =============================================================
// PAGE SECTIONS: 5. ENROLL (enroll.html)
// =============================================================
export const DRIVE_PRO_ENROLL_SECTIONS: PageSection[] = [
  {
    id: "tpl-drivepro-enroll-hero",
    templateId: "tpl-drivepro-enroll-hero",
    name: "Enrollment Header",
    widgetInstance: undefined,
    html: `
<div class="page-header">
  <div class="container">
    <span class="eyebrow"><i class="fa-solid fa-file-signature me-1"></i> Get Started</span>
    <h1>Enrollment & Pricing</h1>
    <p class="lead" style="max-width:650px;margin:auto">Choose the program that fits your needs. Flexible payment options and scheduling available.</p>
  </div>
</div>
    `.trim(),
  },
  {
    id: "tpl-drivepro-enroll-packages",
    templateId: "tpl-drivepro-enroll-packages",
    name: "Pricing Packages",
    widgetInstance: undefined,
    html: `
<section>
  <div class="container">
    <h2 class="title text-center mb-5">Our Course Packages</h2>

    <div class="pricing-accordion">
      <div class="pricing-header">
        <h3><i class="fa-solid fa-car text-primary me-2"></i> Teen Driver Education</h3>
        <div class="pricing-price">$399</div>
        <div class="pricing-actions">
          <select class="form-select form-select-sm w-auto">
            <option>Select Program</option>
            <option>Teen Basic</option>
            <option>Teen Plus</option>
          </select>
          <button class="btn btn-outline btn-sm">Details</button>
          <a href="contact.html" class="btn btn-primary btn-sm"><i class="fa-solid fa-check"></i> Register</a>
        </div>
      </div>
      <div class="pricing-body">
        <p>Complete state-approved driver education for teens ages 15-18. Includes classroom and behind-the-wheel training.</p>
        <ul>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> 30 hours classroom instruction</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> 6 hours behind-the-wheel</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> 6 hours observation</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> State certification</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Parent orientation session</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Flexible scheduling</span><span>Included</span></li>
        </ul>
      </div>
    </div>

    <div class="pricing-accordion">
      <div class="pricing-header">
        <h3><i class="fa-solid fa-user-tie text-primary me-2"></i> Adult Driving Lessons</h3>
        <div class="pricing-price">$299</div>
        <div class="pricing-actions">
          <select class="form-select form-select-sm w-auto">
            <option>Select Program</option>
            <option>Adult Beginner</option>
            <option>Adult Refresher</option>
          </select>
          <button class="btn btn-outline btn-sm">Details</button>
          <a href="contact.html" class="btn btn-primary btn-sm"><i class="fa-solid fa-check"></i> Register</a>
        </div>
      </div>
      <div class="pricing-body">
        <p>Personalized driving instruction for adults 18 and older. Perfect for first-time drivers or those needing a refresher.</p>
        <ul>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> 10 hours behind-the-wheel</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Customized lesson plan</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Flexible scheduling</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Highway driving practice</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Test preparation</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Vehicle for road test</span><span>Included</span></li>
        </ul>
      </div>
    </div>

    <div class="pricing-accordion">
      <div class="pricing-header">
        <h3><i class="fa-solid fa-shield-halved text-primary me-2"></i> Defensive Driving Course</h3>
        <div class="pricing-price">$79</div>
        <div class="pricing-actions">
          <select class="form-select form-select-sm w-auto">
            <option>Select Format</option>
            <option>In-Person</option>
            <option>Online</option>
          </select>
          <button class="btn btn-outline btn-sm">Details</button>
          <a href="contact.html" class="btn btn-primary btn-sm"><i class="fa-solid fa-check"></i> Register</a>
        </div>
      </div>
      <div class="pricing-body">
        <p>State-approved defensive driving course. May qualify for insurance discounts and ticket dismissal.</p>
        <ul>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> 6-hour comprehensive course</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> State certification</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Insurance discount eligible</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Ticket dismissal option</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Online or in-person</span><span>Choose</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Self-paced learning</span><span>Included</span></li>
        </ul>
      </div>
    </div>

    <div class="pricing-accordion">
      <div class="pricing-header">
        <h3><i class="fa-solid fa-crown text-warning me-2"></i> Premium All-Inclusive Package</h3>
        <div class="pricing-price">$599</div>
        <div class="pricing-actions">
          <select class="form-select form-select-sm w-auto">
            <option>Select Type</option>
            <option>Teen Premium</option>
            <option>Adult Premium</option>
          </select>
          <button class="btn btn-outline btn-sm">Details</button>
          <a href="contact.html" class="btn btn-primary btn-sm"><i class="fa-solid fa-check"></i> Register</a>
        </div>
      </div>
      <div class="pricing-body">
        <p>Our most comprehensive package with everything you need for confident, safe driving.</p>
        <ul>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> All Teen or Adult program features</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Extra 5 hours behind-the-wheel</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Defensive driving course</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Priority scheduling</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Free retake if needed</span><span>Included</span></li>
          <li><span><i class="fa-solid fa-check text-primary me-2"></i> Graduation certificate frame</span><span>Included</span></li>
        </ul>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
];

// =============================================================
// PAGE SECTIONS: 6. RESOURCES (resources.html)
// =============================================================
export const DRIVE_PRO_RESOURCES_SECTIONS: PageSection[] = [
  {
    id: "tpl-drivepro-resources-hero",
    templateId: "tpl-drivepro-resources-hero",
    name: "Resources Header",
    widgetInstance: undefined,
    html: `
<div class="page-header">
  <div class="container">
    <span class="eyebrow"><i class="fa-solid fa-book-bookmark me-1"></i> Helpful Materials</span>
    <h1>Student Resources</h1>
    <p class="lead" style="max-width:650px;margin:auto">Everything you need to succeed on your road test and become a confident driver.</p>
  </div>
</div>
    `.trim(),
  },
  {
    id: "tpl-drivepro-resources-grid",
    templateId: "tpl-drivepro-resources-grid",
    name: "Resource Guides & Tools",
    widgetInstance: undefined,
    html: `
<section>
  <div class="container">
    <div class="row g-4">
      <div class="col-md-6 col-lg-4">
        <div class="card resource-card">
          <div class="resource-icon"><i class="fa-solid fa-file-pdf text-danger"></i></div>
          <h4>DMV Driver Handbook</h4>
          <p>Official state driver handbook with all current laws, road signs, and regulations.</p>
          <a href="#" class="btn btn-outline btn-sm mt-3"><i class="fa-solid fa-download"></i> Download PDF</a>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card resource-card">
          <div class="resource-icon"><i class="fa-solid fa-list-check text-primary"></i></div>
          <h4>Practice Permit Tests</h4>
          <p>Test your knowledge with simulated practice tests that reflect the real exam.</p>
          <a href="#" class="btn btn-outline btn-sm mt-3"><i class="fa-solid fa-play"></i> Start Quiz</a>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card resource-card">
          <div class="resource-icon"><i class="fa-solid fa-video text-primary"></i></div>
          <h4>Video Tutorials</h4>
          <p>Watch instructional videos on parallel parking, highway merging, and defensive maneuvers.</p>
          <a href="#" class="btn btn-outline btn-sm mt-3"><i class="fa-solid fa-eye"></i> Watch Now</a>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card resource-card">
          <div class="resource-icon"><i class="fa-solid fa-clipboard-check text-success"></i></div>
          <h4>Road Test Checklists</h4>
          <p>Pre-drive inspection and critical study checklists for students preparing for exam day.</p>
          <a href="#" class="btn btn-outline btn-sm mt-3"><i class="fa-solid fa-file-lines"></i> View List</a>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card resource-card">
          <div class="resource-icon"><i class="fa-solid fa-map-location-dot text-info"></i></div>
          <h4>Practice Routes</h4>
          <p>Recommended routes for practicing different driving scenarios and DMV test paths.</p>
          <a href="#" class="btn btn-outline btn-sm mt-3"><i class="fa-solid fa-map"></i> See Routes</a>
        </div>
      </div>
      <div class="col-md-6 col-lg-4">
        <div class="card resource-card">
          <div class="resource-icon"><i class="fa-solid fa-lightbulb text-warning"></i></div>
          <h4>Expert Driving Tips</h4>
          <p>Practical safety advice for new drivers on night driving, winter weather, and distraction-free roads.</p>
          <a href="#" class="btn btn-outline btn-sm mt-3"><i class="fa-solid fa-book-open"></i> Read Tips</a>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
];

// =============================================================
// PAGE SECTIONS: 7. FAQ (faq.html)
// =============================================================
export const DRIVE_PRO_FAQ_SECTIONS: PageSection[] = [
  {
    id: "tpl-drivepro-faq-hero",
    templateId: "tpl-drivepro-faq-hero",
    name: "FAQ Header",
    widgetInstance: undefined,
    html: `
<div class="page-header">
  <div class="container">
    <span class="eyebrow"><i class="fa-solid fa-circle-question me-1"></i> Common Questions</span>
    <h1>Frequently Asked Questions</h1>
    <p class="lead" style="max-width:650px;margin:auto">Find answers to the most common questions about our programs, scheduling, and licenses.</p>
  </div>
</div>
    `.trim(),
  },
  {
    id: "tpl-drivepro-faq-accordion",
    templateId: "tpl-drivepro-faq-accordion",
    name: "FAQ List",
    widgetInstance: undefined,
    html: `
<section>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <div class="faq-item">
          <div class="faq-question">
            <span>What age can my teen start driver's ed?</span>
            <span class="faq-icon"><i class="fa-solid fa-plus"></i></span>
          </div>
          <div class="faq-answer">Students can begin classroom instruction at age 15. Behind-the-wheel training can start once they have their learner's permit, typically at 15½ in accordance with state DMV regulations.</div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>How many behind-the-wheel lessons do I need?</span>
            <span class="faq-icon"><i class="fa-solid fa-plus"></i></span>
          </div>
          <div class="faq-answer">Our teen program includes 6 hours of certified behind-the-wheel training. Most students need 2-4 additional practice lessons before their road test, depending on previous road experience and personal confidence.</div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>Do you offer pick-up and drop-off services?</span>
            <span class="faq-icon"><i class="fa-solid fa-plus"></i></span>
          </div>
          <div class="faq-answer">Yes! We provide complimentary pick-up and drop-off within 10 miles of our facility for all behind-the-wheel driving sessions, from either your home, school, or work.</div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>Can I use my own car for lessons?</span>
            <span class="faq-icon"><i class="fa-solid fa-plus"></i></span>
          </div>
          <div class="faq-answer">For safety and insurance regulations, all training must be conducted in our late-model, dual-brake controlled academy vehicles equipped with commercial safety systems.</div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>What is your cancellation and rescheduling policy?</span>
            <span class="faq-icon"><i class="fa-solid fa-plus"></i></span>
          </div>
          <div class="faq-answer">We require at least 24 hours advance notice for cancellations or rescheduling. Late cancellations may incur a $35 rescheduling fee to compensate our instructors' reserved block.</div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>Do you offer payment plans or installment options?</span>
            <span class="faq-icon"><i class="fa-solid fa-plus"></i></span>
          </div>
          <div class="faq-answer">Yes, we offer flexible split-payment options across courses as well as pay-in-full discount rates. Contact our front desk for custom payment arrangements.</div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>Is the defensive driving course state-approved for insurance discounts?</span>
            <span class="faq-icon"><i class="fa-solid fa-plus"></i></span>
          </div>
          <div class="faq-answer">Yes, our 6-hour defensive driving course is fully certified by state authorities and recognized by leading automotive insurance providers for policy discounts up to 10-15%.</div>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
];

// =============================================================
// PAGE SECTIONS: 8. CONTACT (contact.html)
// =============================================================
export const DRIVE_PRO_CONTACT_SECTIONS: PageSection[] = [
  {
    id: "tpl-drivepro-contact-hero",
    templateId: "tpl-drivepro-contact-hero",
    name: "Contact Header",
    widgetInstance: undefined,
    html: `
<div class="page-header">
  <div class="container">
    <span class="eyebrow"><i class="fa-solid fa-envelope me-1"></i> Get In Touch</span>
    <h1>Contact Us</h1>
    <p class="lead" style="max-width:650px;margin:auto">Have questions? We're here to help you start your driving journey with confidence.</p>
  </div>
</div>
    `.trim(),
  },
  {
    id: "tpl-drivepro-contact-form",
    templateId: "tpl-drivepro-contact-form",
    name: "Contact Information & Form",
    widgetInstance: undefined,
    html: `
<section>
  <div class="container">
    <div class="row g-5">
      <div class="col-lg-5">
        <div class="contact-box">
          <h3 class="mb-4">Contact Information</h3>
          <div class="contact-info">
            <strong><i class="fa-solid fa-phone text-primary me-2"></i> Phone</strong>
            <a href="tel:+15550123456">(555) 012-3456</a>
          </div>
          <div class="contact-info">
            <strong><i class="fa-solid fa-envelope text-primary me-2"></i> Email</strong>
            <a href="mailto:info@drivepro.com">info@drivepro.com</a>
          </div>
          <div class="contact-info">
            <strong><i class="fa-solid fa-location-dot text-primary me-2"></i> Address</strong>
            <span>123 Driving Lane, Suite 100<br>Cityville, ST 12345</span>
          </div>
          <div class="contact-info">
            <strong><i class="fa-solid fa-clock text-primary me-2"></i> Operating Hours</strong>
            <span>Mon - Fri: 9:00 AM - 7:00 PM<br>Sat: 10:00 AM - 4:00 PM<br>Sun: Closed (Appointments only)</span>
          </div>
        </div>
      </div>
      <div class="col-lg-7">
        <div class="contact-box">
          <h3 class="mb-4">Send Us a Message</h3>
          <form onsubmit="alert('Thank you! Your message has been sent.'); return false;">
            <div class="row g-3">
              <div class="col-md-6">
                <label class="form-label" for="name">Your Name</label>
                <input class="form-control" id="name" type="text" placeholder="John Doe" required>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="email">Email Address</label>
                <input class="form-control" id="email" type="email" placeholder="john@example.com" required>
              </div>
              <div class="col-md-6">
                <label class="form-label" for="phone">Phone Number</label>
                <input class="form-control" id="phone" type="tel" placeholder="(555) 000-0000">
              </div>
              <div class="col-md-6">
                <label class="form-label" for="subject">Course of Interest</label>
                <select class="form-select" id="subject">
                  <option>Teen Driver Education</option>
                  <option>Adult Lessons</option>
                  <option>Defensive Driving Course</option>
                  <option>General Inquiry / Scheduling</option>
                </select>
              </div>
              <div class="col-12">
                <label class="form-label" for="message">Message</label>
                <textarea class="form-control" id="message" rows="5" placeholder="How can our driving instructors assist you?" required></textarea>
              </div>
              <div class="col-12">
                <button class="btn btn-primary" type="submit">
                  Send Message <i class="fa-solid fa-paper-plane ms-2"></i>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
];

// =============================================================
// PAGE SECTIONS: 9. TERMS (terms.html)
// =============================================================
export const DRIVE_PRO_TERMS_SECTIONS: PageSection[] = [
  {
    id: "tpl-drivepro-terms-hero",
    templateId: "tpl-drivepro-terms-hero",
    name: "Terms Header",
    widgetInstance: undefined,
    html: `
<div class="page-header">
  <div class="container">
    <span class="eyebrow"><i class="fa-solid fa-file-contract me-1"></i> Legal</span>
    <h1>Terms of Service</h1>
    <p class="lead">Last updated: January 1, 2026</p>
  </div>
</div>
    `.trim(),
  },
  {
    id: "tpl-drivepro-terms-content",
    templateId: "tpl-drivepro-terms-content",
    name: "Terms Content",
    widgetInstance: undefined,
    html: `
<section>
  <div class="container legal-content">
    <h2>1. Acceptance of Terms</h2>
    <p>By enrolling in DrivePro Driving School services, you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.</p>

    <h2>2. Services</h2>
    <p>DrivePro provides driver education services including classroom instruction, behind-the-wheel training, and defensive driving courses. All services are subject to availability and instructor scheduling.</p>

    <h2>3. Payment and Refunds</h2>
    <p>Payment is due at the time of enrollment. Refunds are available within 7 days of enrollment if no behind-the-wheel services have been rendered, minus a $50 administrative fee.</p>

    <h2>4. Cancellation Policy</h2>
    <p>Lessons must be cancelled or rescheduled at least 24 hours in advance. Late cancellations may result in a $35 rescheduling fee.</p>

    <h2>5. Student Responsibilities</h2>
    <ul>
      <li>Arrive on time for all scheduled lesson appointments</li>
      <li>Bring required state documentation (valid learner's permit, glasses if mandated)</li>
      <li>Follow all instructor directions and vehicle safety protocols</li>
      <li>Maintain respectful, attentive behavior during training</li>
    </ul>

    <h2>6. Liability & Insurance</h2>
    <p>DrivePro maintains comprehensive commercial liability insurance. Students are responsible for following all road regulations during behind-the-wheel training. Willful negligence may result in immediate suspension.</p>

    <h2>7. Privacy</h2>
    <p>We respect your privacy. Please review our Privacy Policy for information on how we collect, protect, and handle student records.</p>

    <h2>8. Changes to Terms</h2>
    <p>We reserve the right to modify these terms at any time. Continued use of our academy services constitutes agreement to updated policies.</p>

    <h2>9. Contact</h2>
    <p>Questions regarding these terms should be directed to <a href="mailto:info@drivepro.com" class="text-primary">info@drivepro.com</a>.</p>
  </div>
</section>
    `.trim(),
  },
];

// =============================================================
// PAGE SECTIONS: 10. PRIVACY (privacy.html)
// =============================================================
export const DRIVE_PRO_PRIVACY_SECTIONS: PageSection[] = [
  {
    id: "tpl-drivepro-privacy-hero",
    templateId: "tpl-drivepro-privacy-hero",
    name: "Privacy Header",
    widgetInstance: undefined,
    html: `
<div class="page-header">
  <div class="container">
    <span class="eyebrow"><i class="fa-solid fa-user-shield me-1"></i> Legal</span>
    <h1>Privacy Policy</h1>
    <p class="lead">Last updated: January 1, 2026</p>
  </div>
</div>
    `.trim(),
  },
  {
    id: "tpl-drivepro-privacy-content",
    templateId: "tpl-drivepro-privacy-content",
    name: "Privacy Content",
    widgetInstance: undefined,
    html: `
<section>
  <div class="container legal-content">
    <h2>1. Information We Collect</h2>
    <p>We collect information necessary to provide driver education services, including: name, contact details, date of birth, permit numbers, and lesson progress notes.</p>

    <h2>2. How We Use Your Information</h2>
    <p>Your information is used strictly to deliver instructional services, schedule driving sessions, process payments, report course completion to state licensing agencies, and communicate about lessons.</p>

    <h2>3. Information Sharing</h2>
    <p>We do not sell or rent personal information to third parties. We share data only with state regulatory agencies (such as the DMV) as required by state licensing laws and with authorized payment processors.</p>

    <h2>4. Data Security</h2>
    <p>We implement appropriate technical and organizational safeguards to protect your personal information against unauthorized access, modification, or exposure.</p>

    <h2>5. Student Records</h2>
    <p>Student records are retained in compliance with state driver education regulations, typically for a minimum statutory period of three to five years following program graduation.</p>

    <h2>6. Your Rights</h2>
    <p>You have the right to inspect, update, or request corrections to your student records by contacting our administrative office.</p>

    <h2>7. Policy Updates</h2>
    <p>Any adjustments to this policy will be posted on this page with an updated modification timestamp.</p>

    <h2>8. Contact Us</h2>
    <p>For inquiries regarding privacy, please email <a href="mailto:privacy@drivepro.com" class="text-primary">privacy@drivepro.com</a>.</p>
  </div>
</section>
    `.trim(),
  },
];

// =============================================================
// PAGE SECTIONS: 11. ACCESSIBILITY (accessibility.html)
// =============================================================
export const DRIVE_PRO_ACCESSIBILITY_SECTIONS: PageSection[] = [
  {
    id: "tpl-drivepro-accessibility-hero",
    templateId: "tpl-drivepro-accessibility-hero",
    name: "Accessibility Header",
    widgetInstance: undefined,
    html: `
<div class="page-header">
  <div class="container">
    <span class="eyebrow"><i class="fa-solid fa-universal-access me-1"></i> Inclusive Education</span>
    <h1>Accessibility Statement</h1>
    <p class="lead" style="max-width:650px;margin:auto">We are dedicated to ensuring our driver training programs and digital platforms are fully accessible to all students.</p>
  </div>
</div>
    `.trim(),
  },
  {
    id: "tpl-drivepro-accessibility-content",
    templateId: "tpl-drivepro-accessibility-content",
    name: "Accessibility Commitments",
    widgetInstance: undefined,
    html: `
<section>
  <div class="container">
    <div class="row justify-content-center">
      <div class="col-lg-10">
        <p class="lead mb-5">DrivePro Driving School is dedicated to providing equal access to driver education for students with disabilities and diverse learning styles. We continuously work to improve our accommodations.</p>

        <h3 class="mb-4">Our Commitment & Accommodations</h3>

        <div class="access-feature">
          <h4><i class="fa-solid fa-wheelchair text-primary me-2"></i> Adaptive Training Vehicles</h4>
          <p>Our training fleet can be equipped with spinner knobs, left-foot accelerators, hand controls, and other adaptive equipment upon request.</p>
        </div>

        <div class="access-feature">
          <h4><i class="fa-solid fa-ear-listen text-primary me-2"></i> Hearing Assistance</h4>
          <p>We provide visual aids, written curriculum materials, and can coordinate sign language interpreters with advance scheduling.</p>
        </div>

        <div class="access-feature">
          <h4><i class="fa-solid fa-eye text-primary me-2"></i> Visual Accommodations</h4>
          <p>Large-print textbooks, high-contrast digital courseware, and dedicated lesson pacing for students with specific visual requirements.</p>
        </div>

        <div class="access-feature">
          <h4><i class="fa-solid fa-brain text-primary me-2"></i> Neurodiverse Learning Support</h4>
          <p>Extra time, structured checklists, anxiety-reducing techniques, and customized teaching methods for students with ADHD, dyslexia, or learning differences.</p>
        </div>

        <div class="access-feature">
          <h4><i class="fa-solid fa-globe text-primary me-2"></i> Website Accessibility Standards</h4>
          <p>Our website is designed in alignment with WCAG 2.1 AA guidelines, featuring semantic markup, accessible color contrast, and screen-reader compatibility.</p>
        </div>

        <h3 class="mt-5 mb-4">Request Accommodations</h3>
        <p>If you have questions regarding accommodations or need personalized assistance, please contact us at <a href="tel:+15550123456" class="text-primary">(555) 012-3456</a> or email <a href="mailto:accessibility@drivepro.com" class="text-primary">accessibility@drivepro.com</a>.</p>
      </div>
    </div>
  </div>
</section>
    `.trim(),
  },
];

// =============================================================
// MULTI-PAGE CONFIGURATION (11 Pages)
// =============================================================
export const DRIVE_PRO_PAGES: Page[] = [
  {
    id: "page-drivepro-home",
    name: "Home",
    slug: "index",
    sections: DRIVE_PRO_HOME_SECTIONS,
    useGlobalHeader: true,
    useGlobalFooter: true,
    hideHeader: false,
    hideFooter: false,
    seo: {
      title: "DrivePro - Professional Driving School",
      description: "Learn to drive safely with certified instructors. Teen & adult driving courses, defensive driving, and DMV preparation.",
    },
  },
  {
    id: "page-drivepro-about",
    name: "About Us",
    slug: "about",
    sections: DRIVE_PRO_ABOUT_SECTIONS,
    useGlobalHeader: true,
    useGlobalFooter: true,
    hideHeader: false,
    hideFooter: false,
    seo: {
      title: "About Us - DrivePro Driving School",
      description: "Founded in 2005, DrivePro has taught over 15,000 students safe, lifelong driving habits.",
    },
  },
  {
    id: "page-drivepro-services",
    name: "Services",
    slug: "services",
    sections: DRIVE_PRO_SERVICES_SECTIONS,
    useGlobalHeader: true,
    useGlobalFooter: true,
    hideHeader: false,
    hideFooter: false,
    seo: {
      title: "Driving Courses & Services - DrivePro",
      description: "Explore our teen education, adult refresher lessons, and certified defensive driving programs.",
    },
  },
  {
    id: "page-drivepro-staff",
    name: "Our Staff",
    slug: "staff",
    sections: DRIVE_PRO_STAFF_SECTIONS,
    useGlobalHeader: true,
    useGlobalFooter: true,
    hideHeader: false,
    hideFooter: false,
    seo: {
      title: "Meet Our Instructors - DrivePro Driving School",
      description: "State-certified, patient, and experienced driving instructors dedicated to your success.",
    },
  },
  {
    id: "page-drivepro-enroll",
    name: "Enroll",
    slug: "enroll",
    sections: DRIVE_PRO_ENROLL_SECTIONS,
    useGlobalHeader: true,
    useGlobalFooter: true,
    hideHeader: false,
    hideFooter: false,
    seo: {
      title: "Enrollment & Pricing - DrivePro Driving School",
      description: "Compare course packages, pricing, and enroll online for teen and adult driving classes.",
    },
  },
  {
    id: "page-drivepro-resources",
    name: "Resources",
    slug: "resources",
    sections: DRIVE_PRO_RESOURCES_SECTIONS,
    useGlobalHeader: true,
    useGlobalFooter: true,
    hideHeader: false,
    hideFooter: false,
    seo: {
      title: "Student Resources - DrivePro Driving School",
      description: "Download DMV handbooks, take practice tests, and review pre-test checklists.",
    },
  },
  {
    id: "page-drivepro-faq",
    name: "FAQ",
    slug: "faq",
    sections: DRIVE_PRO_FAQ_SECTIONS,
    useGlobalHeader: true,
    useGlobalFooter: true,
    hideHeader: false,
    hideFooter: false,
    seo: {
      title: "Frequently Asked Questions - DrivePro Driving School",
      description: "Answers to common questions about lesson hours, test requirements, permits, and pick-up services.",
    },
  },
  {
    id: "page-drivepro-contact",
    name: "Contact",
    slug: "contact",
    sections: DRIVE_PRO_CONTACT_SECTIONS,
    useGlobalHeader: true,
    useGlobalFooter: true,
    hideHeader: false,
    hideFooter: false,
    seo: {
      title: "Contact Us - DrivePro Driving School",
      description: "Get in touch with DrivePro for scheduling, lessons, and custom training inquiries.",
    },
  },
  {
    id: "page-drivepro-terms",
    name: "Terms",
    slug: "terms",
    sections: DRIVE_PRO_TERMS_SECTIONS,
    useGlobalHeader: true,
    useGlobalFooter: true,
    hideHeader: false,
    hideFooter: false,
    seo: {
      title: "Terms of Service - DrivePro Driving School",
      description: "Read our terms of service, cancellation policy, and school standards.",
    },
  },
  {
    id: "page-drivepro-privacy",
    name: "Privacy",
    slug: "privacy",
    sections: DRIVE_PRO_PRIVACY_SECTIONS,
    useGlobalHeader: true,
    useGlobalFooter: true,
    hideHeader: false,
    hideFooter: false,
    seo: {
      title: "Privacy Policy - DrivePro Driving School",
      description: "Learn how DrivePro protects and handles your student information.",
    },
  },
  {
    id: "page-drivepro-accessibility",
    name: "Accessibility",
    slug: "accessibility",
    sections: DRIVE_PRO_ACCESSIBILITY_SECTIONS,
    useGlobalHeader: true,
    useGlobalFooter: true,
    hideHeader: false,
    hideFooter: false,
    seo: {
      title: "Accessibility Statement - DrivePro Driving School",
      description: "Our commitment to inclusive driving education with hand controls, large print, and neurodiverse support.",
    },
  },
];

// =============================================================
// PREBUILT TEMPLATE OBJECT
// =============================================================
export const DRIVE_PRO_TEMPLATE: Template = {
  id: "tpl-drivepro-driving-school",
  name: "DrivePro — Driving School Academy",
  slug: "drivepro-driving-school",
  category: "Driving School",
  description: "Complete multi-page driving school and academy website featuring 11 connected pages, interactive course enrollment, instructor directory, DMV student resources, FAQ, and sticky navigation with Font Awesome icons.",
  status: "published",
  thumbnail: DRIVE_PRO_ASSETS.heroCar,
  previewImage: DRIVE_PRO_ASSETS.heroCar,
  featured: true,
  isNew: true,
  sortOrder: 1,
  widgets: [],
  pages: DRIVE_PRO_PAGES,
  sharedHeader: DRIVE_PRO_SHARED_HEADER,
  sharedFooter: DRIVE_PRO_SHARED_FOOTER,
  globalCss: DRIVE_PRO_GLOBAL_CSS,
  globalJs: DRIVE_PRO_GLOBAL_JS,
  customHead: DRIVE_PRO_CUSTOM_HEAD,
  assets: DRIVE_PRO_ASSETS,
  createdBy: "system",
  createdAt: new Date("2026-03-09"),
  updatedAt: new Date("2026-03-09"),
};
