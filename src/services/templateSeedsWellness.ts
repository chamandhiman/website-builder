import type { Page, PageSection } from "@/lib/builder/store";
import type { Template } from "./templates";

// =============================================================
// CURATED ASSETS FOR WELLNESSLIFE TEMPLATE
// =============================================================
export const WELLNESS_ASSETS = {
  heroFitnessWoman: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
  aboutTrainer: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1000&q=80",
  transformationBanner: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=80",
  whyTrustGym: "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=800&q=80",
  teamAlex: "https://images.unsplash.com/photo-1567013127542-490d757e51fc?auto=format&fit=crop&w=600&q=80",
  teamSarah: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&w=600&q=80",
  teamEmma: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=600&q=80",
  teamJohn: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=600&q=80",
  blogExercises: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=800&q=80",
  blogRelaxation: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=800&q=80",
  blogNutrition: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80",
  avatarReviewer: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
};

// =============================================================
// CSS STYLING FOR WELLNESSLIFE (STANDALONE + EMBEDDED)
// =============================================================
export const WELLNESS_GLOBAL_CSS = `
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css");
@import url("https://fonts.googleapis.com/css2?family=Caveat:wght@600;700&family=Inter:wght@300;400;500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;1,600;1,700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Poppins:wght@400;500;600;700;800&display=swap");

:root {
  --wl-bg-dark: #0A0D14;
  --wl-bg-surface: #0E121B;
  --wl-bg-card: #151A26;
  --wl-bg-card-alt: #121622;
  --wl-border: #232938;
  --wl-border-subtle: #1E222D;
  --wl-accent: #FACC15;
  --wl-accent-dark: #D97706;
  --wl-accent-hover: #EAB308;
  --wl-accent-glow: rgba(250, 204, 21, 0.25);
  --wl-accent-bg: rgba(250, 204, 21, 0.1);
  --wl-text-primary: #FFFFFF;
  --wl-text-secondary: #94A3B8;
  --wl-text-muted: #64748B;
  --wl-radius-sm: 8px;
  --wl-radius-md: 14px;
  --wl-radius-lg: 20px;
  --wl-radius-full: 9999px;
  --wl-transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

html {
  scroll-behavior: smooth;
}

body {
  margin: 0;
  padding: 0;
  background-color: var(--wl-bg-dark);
  color: var(--wl-text-primary);
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
}

.wl-container {
  max-width: 1280px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
  box-sizing: border-box;
}

.wl-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 800;
  color: var(--wl-accent);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.wl-eyebrow-line {
  display: inline-block;
  width: 20px;
  height: 2px;
  background-color: var(--wl-accent);
}

.wl-text-accent {
  color: var(--wl-accent);
}

.wl-btn-primary {
  background-color: var(--wl-accent);
  color: #0A0D14;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  padding: 12px 26px;
  border-radius: var(--wl-radius-full);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  transition: var(--wl-transition);
}

.wl-btn-primary:hover {
  background-color: var(--wl-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(250, 204, 21, 0.3);
}

.wl-btn-outline {
  background: rgba(20, 24, 34, 0.8);
  color: var(--wl-text-primary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  padding: 11px 24px;
  border-radius: var(--wl-radius-full);
  border: 1px solid #334155;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  cursor: pointer;
  transition: var(--wl-transition);
}

.wl-btn-outline:hover {
  border-color: var(--wl-accent);
  color: var(--wl-accent);
  transform: translateY(-2px);
}

.wl-header {
  background-color: var(--wl-bg-dark);
  border-bottom: 1px solid var(--wl-border-subtle);
  position: sticky;
  top: 0;
  z-index: 1000;
  width: 100%;
}

.wl-header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 18px;
  padding-bottom: 18px;
}

.wl-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
}

.wl-brand-icon {
  width: 38px;
  height: 38px;
  border-radius: 10px;
  background: var(--wl-accent-bg);
  border: 1px solid rgba(250, 204, 21, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wl-accent);
  font-size: 20px;
}

.wl-brand-title {
  color: var(--wl-text-primary);
  font-size: 20px;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.1;
}

.wl-brand-subtitle {
  color: var(--wl-text-secondary);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

.wl-nav {
  display: flex;
  align-items: center;
  gap: 28px;
}

.wl-nav-link {
  color: var(--wl-text-secondary);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  transition: color 0.15s ease;
}

.wl-nav-link:hover,
.wl-nav-link.active {
  color: var(--wl-text-primary);
}

.wl-hero-section {
  background: radial-gradient(circle at 30% 20%, #151A26 0%, var(--wl-bg-dark) 70%);
  padding: 80px 0 100px;
  position: relative;
  overflow: hidden;
}

.wl-hero-grid {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 48px;
  align-items: center;
}

.wl-hero-title {
  font-size: 56px;
  font-weight: 900;
  line-height: 1.12;
  letter-spacing: -0.03em;
  margin: 0 0 20px;
  color: var(--wl-text-primary);
}

.wl-hero-desc {
  font-size: 16px;
  line-height: 1.65;
  color: var(--wl-text-secondary);
  max-width: 520px;
  margin: 0 0 36px;
}

.wl-btn-group {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 48px;
}

.wl-hero-stats {
  display: flex;
  align-items: center;
  gap: 36px;
  padding-top: 32px;
  border-top: 1px solid var(--wl-border-subtle);
}

.wl-hero-stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.wl-stat-icon-box {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: var(--wl-accent-bg);
  border: 1px solid rgba(250, 204, 21, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wl-accent);
  font-size: 18px;
}

.wl-stat-number {
  font-size: 22px;
  font-weight: 800;
  color: var(--wl-text-primary);
}

.wl-stat-text {
  font-size: 12px;
  color: var(--wl-text-secondary);
}

.wl-hero-visual {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.wl-hero-img-wrap {
  position: relative;
  width: 100%;
  max-width: 520px;
  height: 560px;
  border-radius: 28px;
  overflow: hidden;
  border: 1px solid #2A3142;
  box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.8);
}

.wl-hero-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center top;
}

.wl-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 65%, rgba(10, 13, 20, 0.85) 100%);
}

.wl-slider-indicator {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-top: 16px;
  background: rgba(20, 24, 34, 0.8);
  border: 1px solid var(--wl-border-subtle);
  padding: 6px 16px;
  border-radius: var(--wl-radius-full);
  font-size: 12px;
  color: var(--wl-text-secondary);
  font-weight: 600;
}

.wl-about-section {
  background-color: var(--wl-bg-surface);
  padding: 100px 0;
  border-top: 1px solid var(--wl-border-subtle);
}

.wl-about-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 60px;
  align-items: center;
}

.wl-about-img-box {
  position: relative;
}

.wl-about-img-wrap {
  width: 100%;
  height: 480px;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid var(--wl-border);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.6);
}

.wl-about-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.wl-floating-badge {
  position: absolute;
  bottom: 24px;
  left: 24px;
  background: rgba(14, 18, 27, 0.92);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(250, 204, 21, 0.35);
  border-radius: 16px;
  padding: 16px 22px;
  display: flex;
  align-items: center;
  gap: 14px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
}

.wl-section-title {
  font-size: 42px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  margin: 0 0 20px;
  color: var(--wl-text-primary);
}

.wl-section-desc {
  font-size: 15px;
  line-height: 1.7;
  color: var(--wl-text-secondary);
  margin: 0 0 32px;
}

.wl-features-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin-bottom: 36px;
}

.wl-feature-pill {
  background-color: var(--wl-bg-card);
  border: 1px solid var(--wl-border);
  border-radius: var(--wl-radius-md);
  padding: 18px 16px;
  text-align: center;
  transition: var(--wl-transition);
}

.wl-feature-pill:hover {
  transform: translateY(-4px);
  border-color: rgba(250, 204, 21, 0.4);
}

.wl-feature-pill-icon {
  width: 44px;
  height: 44px;
  margin: 0 auto 12px;
  border-radius: 50%;
  background: var(--wl-accent-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wl-accent);
  font-size: 18px;
}

.wl-feature-pill-title {
  font-size: 13px;
  font-weight: 700;
  color: var(--wl-text-primary);
}

.wl-services-section {
  background-color: #F8FAFC;
  color: #0F172A;
  padding: 100px 0;
}

.wl-section-header-center {
  text-align: center;
  max-width: 680px;
  margin: 0 auto 56px;
}

.wl-services-title {
  font-size: 40px;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin: 0 0 14px;
  color: #0F172A;
}

.wl-services-desc {
  font-size: 15px;
  line-height: 1.6;
  color: #64748B;
  margin: 0;
}

.wl-services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.wl-service-card {
  background-color: #FFFFFF;
  border: 1px solid #E2E8F0;
  border-radius: 18px;
  padding: 32px 28px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04);
  transition: var(--wl-transition);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.wl-service-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 20px 35px -5px rgba(0, 0, 0, 0.08);
  border-color: #CBD5E1;
}

.wl-service-icon-box {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background-color: #FEF3C7;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wl-accent-dark);
  font-size: 22px;
  margin-bottom: 20px;
}

.wl-service-card-title {
  font-size: 20px;
  font-weight: 800;
  color: #0F172A;
  margin: 0 0 10px;
}

.wl-service-card-desc {
  font-size: 14px;
  line-height: 1.6;
  color: #64748B;
  margin: 0 0 24px;
}

.wl-service-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #0F172A;
  text-decoration: none;
  font-size: 14px;
  font-weight: 700;
  transition: color 0.15s ease;
}

.wl-service-link:hover {
  color: var(--wl-accent-dark);
}

.wl-banner-section {
  position: relative;
  background: var(--wl-bg-dark);
  color: var(--wl-text-primary);
  padding: 100px 0;
  overflow: hidden;
}

.wl-banner-bg {
  position: absolute;
  inset: 0;
  z-index: 1;
}

.wl-banner-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.35);
}

.wl-banner-gradient {
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, #0A0D14 20%, rgba(10, 13, 20, 0.75) 60%, rgba(10, 13, 20, 0.9) 100%);
}

.wl-banner-content {
  position: relative;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.wl-calligraphy-text {
  font-family: "Georgia", "Playfair Display", serif;
  font-style: italic;
  font-size: 48px;
  line-height: 1.2;
  color: var(--wl-accent);
  font-weight: 700;
  text-shadow: 0 10px 30px rgba(0, 0, 0, 0.8);
  text-align: right;
}

.wl-team-section {
  background-color: var(--wl-bg-surface);
  padding: 100px 0;
  border-top: 1px solid var(--wl-border-subtle);
}

.wl-team-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.wl-team-card {
  background-color: var(--wl-bg-card);
  border: 1px solid var(--wl-border);
  border-radius: 18px;
  overflow: hidden;
  transition: var(--wl-transition);
}

.wl-team-card:hover {
  transform: translateY(-6px);
  border-color: rgba(250, 204, 21, 0.4);
}

.wl-team-img-wrap {
  height: 240px;
  overflow: hidden;
}

.wl-team-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.wl-team-card:hover .wl-team-img {
  transform: scale(1.05);
}

.wl-team-info {
  padding: 22px 20px;
}

.wl-team-name {
  font-size: 18px;
  font-weight: 800;
  color: var(--wl-text-primary);
  margin: 0 0 4px;
}

.wl-team-role {
  font-size: 12px;
  font-weight: 700;
  color: var(--wl-accent);
  margin-bottom: 2px;
}

.wl-team-spec {
  font-size: 12px;
  color: var(--wl-text-secondary);
  margin-bottom: 16px;
}

.wl-social-row {
  display: flex;
  gap: 10px;
}

.wl-social-circle {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #1F2637;
  color: var(--wl-text-secondary);
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 13px;
  transition: var(--wl-transition);
}

.wl-social-circle:hover {
  background-color: var(--wl-accent);
  color: #0A0D14;
}

.wl-pricing-section {
  background-color: var(--wl-bg-dark);
  padding: 100px 0;
  border-top: 1px solid var(--wl-border-subtle);
}

.wl-pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  align-items: stretch;
}

.wl-pricing-card {
  background-color: var(--wl-bg-card-alt);
  border: 1px solid var(--wl-border);
  border-radius: var(--wl-radius-lg);
  padding: 36px 30px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: var(--wl-transition);
}

.wl-pricing-card:hover {
  transform: translateY(-6px);
  border-color: rgba(250, 204, 21, 0.4);
}

.wl-pricing-featured {
  background-color: var(--wl-bg-card);
  border: 2px solid var(--wl-accent);
  position: relative;
  box-shadow: 0 20px 40px -10px rgba(250, 204, 21, 0.15);
}

.wl-popular-badge {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--wl-accent);
  color: #0A0D14;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 14px;
  border-radius: var(--wl-radius-full);
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.wl-pricing-title {
  font-size: 16px;
  font-weight: 700;
  color: var(--wl-text-primary);
  margin-bottom: 8px;
}

.wl-price-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-bottom: 24px;
}

.wl-price-val {
  font-size: 42px;
  font-weight: 900;
  color: var(--wl-text-primary);
}

.wl-price-period {
  font-size: 14px;
  color: var(--wl-text-secondary);
}

.wl-pricing-checklist {
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-bottom: 36px;
}

.wl-check-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  color: #CBD5E1;
}

.wl-split-section {
  background-color: var(--wl-bg-surface);
  padding: 100px 0;
  border-top: 1px solid var(--wl-border-subtle);
}

.wl-split-grid {
  display: grid;
  grid-template-columns: 1.15fr 0.85fr;
  gap: 60px;
  align-items: center;
}

.wl-trust-grid {
  display: grid;
  grid-template-columns: 0.95fr 1.05fr;
  gap: 32px;
  align-items: center;
}

.wl-trust-img-box {
  position: relative;
  height: 360px;
  border-radius: 20px;
  overflow: hidden;
  border: 1px solid var(--wl-border);
}

.wl-trust-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.65);
}

.wl-trust-img-quote {
  position: absolute;
  inset: 0;
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  font-size: 26px;
  font-weight: 900;
  line-height: 1.15;
  color: var(--wl-accent);
}

.wl-trust-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.wl-trust-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 13px;
  color: #CBD5E1;
}

.wl-trust-num {
  font-weight: 800;
  color: var(--wl-accent);
}

.wl-satisfaction-gauge {
  display: flex;
  align-items: center;
  gap: 14px;
  background: rgba(20, 24, 34, 0.8);
  border: 1px solid var(--wl-border);
  padding: 12px 18px;
  border-radius: var(--wl-radius-md);
}

.wl-gauge-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: 3px solid var(--wl-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 15px;
  font-weight: 900;
  color: var(--wl-accent);
}

.wl-testimonial-box {
  background-color: var(--wl-bg-card);
  border: 1px solid var(--wl-border);
  border-radius: 20px;
  padding: 36px 32px;
  position: relative;
  overflow: hidden;
}

.wl-carousel-viewport {
  overflow: hidden;
  width: 100%;
  position: relative;
}

.wl-carousel-track {
  display: flex;
  width: 100%;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
}

.wl-carousel-slide {
  flex: 0 0 100%;
  min-width: 100%;
  box-sizing: border-box;
}

.wl-carousel-controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid var(--wl-border);
  padding-top: 18px;
  margin-top: 20px;
}

.wl-carousel-btn {
  background: none;
  border: none;
  color: var(--wl-text-secondary);
  font-size: 15px;
  cursor: pointer;
  padding: 8px 14px;
  line-height: 1;
  border-radius: var(--wl-radius-sm);
  transition: var(--wl-transition);
}

.wl-carousel-btn:hover {
  color: var(--wl-accent);
  background-color: var(--wl-accent-bg);
}

.wl-carousel-btn:disabled,
.wl-carousel-btn.is-disabled {
  opacity: 0.35;
  cursor: not-allowed;
}

.wl-carousel-dots {
  display: flex;
  align-items: center;
  gap: 8px;
}

.wl-carousel-dot {
  width: 8px;
  height: 6px;
  border-radius: 3px;
  background-color: #334155;
  border: none;
  cursor: pointer;
  padding: 0;
  transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.wl-carousel-dot.is-active,
.wl-carousel-dot[aria-current="true"] {
  width: 24px;
  background-color: var(--wl-accent);
}

.wl-stars-row {
  display: flex;
  gap: 4px;
  color: var(--wl-accent);
  font-size: 16px;
  margin-bottom: 16px;
}

.wl-quote-text {
  font-size: 15px;
  line-height: 1.7;
  color: #CBD5E1;
  margin: 0 0 28px;
  font-style: italic;
}

.wl-counter-bar {
  background-color: var(--wl-bg-card-alt);
  padding: 48px 0;
  border-top: 1px solid var(--wl-border-subtle);
  border-bottom: 1px solid var(--wl-border-subtle);
}

.wl-counter-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}

.wl-counter-item {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 14px;
}

.wl-blog-section {
  background-color: var(--wl-bg-dark);
  padding: 100px 0;
}

.wl-blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}

.wl-blog-card {
  background-color: var(--wl-bg-card-alt);
  border: 1px solid var(--wl-border);
  border-radius: 18px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  transition: var(--wl-transition);
}

.wl-blog-card:hover {
  transform: translateY(-6px);
  border-color: rgba(250, 204, 21, 0.4);
}

.wl-blog-img-wrap {
  position: relative;
  height: 210px;
  overflow: hidden;
}

.wl-blog-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.wl-blog-card:hover .wl-blog-img {
  transform: scale(1.05);
}

.wl-blog-badge {
  position: absolute;
  top: 14px;
  left: 14px;
  background-color: var(--wl-accent);
  color: #0A0D14;
  font-size: 11px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: var(--wl-radius-full);
}

.wl-blog-body {
  padding: 22px 20px;
}

.wl-blog-date {
  font-size: 12px;
  color: var(--wl-text-secondary);
  margin-bottom: 8px;
}

.wl-blog-title {
  font-size: 18px;
  font-weight: 800;
  color: var(--wl-text-primary);
  line-height: 1.35;
  margin: 0 0 10px;
}

.wl-blog-desc {
  font-size: 13px;
  line-height: 1.6;
  color: var(--wl-text-secondary);
  margin: 0 0 18px;
}

.wl-blog-footer {
  padding: 0 20px 22px;
}

.wl-blog-link {
  color: var(--wl-accent);
  text-decoration: none;
  font-size: 13px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition: gap 0.2s ease;
}

.wl-blog-link:hover {
  gap: 10px;
}

.wl-contact-section {
  background-color: var(--wl-bg-surface);
  padding: 100px 0;
  border-top: 1px solid var(--wl-border-subtle);
}

.wl-contact-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 60px;
  align-items: center;
}

.wl-contact-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.wl-contact-item {
  display: flex;
  align-items: center;
  gap: 14px;
}

.wl-contact-icon {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: var(--wl-accent-bg);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--wl-accent);
  font-size: 15px;
}

.wl-contact-text {
  font-size: 14px;
  color: #CBD5E1;
}

.wl-form-card {
  background-color: var(--wl-bg-card);
  border: 1px solid var(--wl-border);
  border-radius: 20px;
  padding: 36px 32px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.wl-form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

.wl-form-label {
  display: block;
  font-size: 12px;
  font-weight: 600;
  color: #CBD5E1;
  margin-bottom: 6px;
}

.wl-input,
.wl-select,
.wl-textarea {
  width: 100%;
  box-sizing: border-box;
  background-color: var(--wl-bg-surface);
  border: 1px solid var(--wl-border);
  border-radius: var(--wl-radius-sm);
  padding: 11px 14px;
  color: var(--wl-text-primary);
  font-size: 13px;
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.wl-input:focus,
.wl-select:focus,
.wl-textarea:focus {
  border-color: var(--wl-accent);
  box-shadow: 0 0 0 2px var(--wl-accent-glow);
}

.wl-textarea {
  resize: vertical;
}

.wl-footer {
  background-color: #07090E;
  color: var(--wl-text-secondary);
  padding: 80px 0 32px;
  border-top: 1px solid var(--wl-border-subtle);
  position: relative;
}

.wl-footer-grid {
  display: grid;
  grid-template-columns: 1.4fr 0.9fr 1fr 1.1fr;
  gap: 48px;
  margin-bottom: 60px;
}

.wl-footer-title {
  font-size: 14px;
  font-weight: 700;
  color: var(--wl-text-primary);
  margin-bottom: 20px;
}

.wl-footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
  font-size: 13px;
}

.wl-footer-link {
  color: var(--wl-text-secondary);
  text-decoration: none;
  transition: color 0.15s ease;
}

.wl-footer-link:hover {
  color: var(--wl-text-primary);
}

.wl-footer-bottom {
  padding-top: 28px;
  border-top: 1px solid var(--wl-border-subtle);
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: var(--wl-text-muted);
}

.wl-back-to-top {
  position: absolute;
  right: 28px;
  bottom: 28px;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: var(--wl-accent);
  color: #0A0D14;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  font-size: 14px;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(250, 204, 21, 0.4);
  transition: var(--wl-transition);
}

.wl-back-to-top:hover {
  transform: translateY(-4px);
  background-color: var(--wl-accent-hover);
}

@media (max-width: 1024px) {
  .wl-hero-grid,
  .wl-about-grid,
  .wl-split-grid,
  .wl-contact-grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .wl-services-grid,
  .wl-team-grid,
  .wl-pricing-grid,
  .wl-blog-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .wl-counter-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 32px;
  }

  .wl-footer-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 36px;
  }
}

@media (max-width: 768px) {
  .wl-header-inner {
    flex-wrap: wrap;
    gap: 16px;
  }

  .wl-nav {
    display: none;
  }

  .wl-hero-title {
    font-size: 40px;
  }

  .wl-hero-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  }

  .wl-services-grid,
  .wl-team-grid,
  .wl-pricing-grid,
  .wl-blog-grid,
  .wl-features-row,
  .wl-trust-grid {
    grid-template-columns: 1fr;
  }

  .wl-counter-grid {
    grid-template-columns: 1fr;
    gap: 24px;
  }

  .wl-footer-grid {
    grid-template-columns: 1fr;
  }

  .wl-banner-content {
    flex-direction: column;
    gap: 32px;
    text-align: center;
  }

  .wl-calligraphy-text {
    text-align: center;
  }

  .wl-form-row {
    grid-template-columns: 1fr;
  }
}
`.trim();

// =============================================================
// COMPLETE HTML SECTIONS FOR WELLNESSLIFE (USING CLASSES & STYLE.CSS)
// =============================================================
export const WELLNESS_SECTIONS: PageSection[] = [
  // -----------------------------------------------------------
  // 1. NAVBAR / HEADER
  // -----------------------------------------------------------
  {
    id: "sec-wellness-navbar",
    templateId: "",
    name: "Header Navigation",
    html: `
<header id="header" class="wl-header">
  <div class="wl-container wl-header-inner">
    <!-- Brand Logo -->
    <a href="#home" class="wl-brand">
      <div class="wl-brand-icon">
        <i class="fa-solid fa-spa"></i>
      </div>
      <div>
        <div class="wl-brand-title">WellnessLife</div>
        <div class="wl-brand-subtitle">HEALTH • FITNESS • HEALING</div>
      </div>
    </a>
    
    <!-- Nav Links -->
    <nav class="wl-nav">
      <a href="#home" class="wl-nav-link active">Home</a>
      <a href="#about" class="wl-nav-link">About</a>
      <a href="#services" class="wl-nav-link">Services</a>
      <a href="#team" class="wl-nav-link">Team</a>
      <a href="#pricing" class="wl-nav-link">Pricing</a>
      <a href="#blog" class="wl-nav-link">Blog</a>
      <a href="#contact" class="wl-nav-link">Contact</a>
    </nav>

    <!-- Header CTA -->
    <a href="#contact" class="wl-btn-primary">
      <span>Book Appointment</span>
      <i class="fa-regular fa-calendar-check"></i>
    </a>
  </div>
</header>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 2. HERO SECTION
  // -----------------------------------------------------------
  {
    id: "sec-wellness-hero",
    templateId: "",
    name: "Hero Section",
    html: `
<section id="home" class="wl-hero-section">
  <div class="wl-container">
    <div class="wl-hero-grid">
      <!-- Left Column: Copy & Actions -->
      <div class="wl-hero-left">
        <div class="wl-eyebrow">
          <span class="wl-eyebrow-line"></span>
          <span>YOUR HEALTH, YOUR WELLNESS, YOUR FUTURE.</span>
        </div>

        <h1 class="wl-hero-title">
          <span>Transform Your Body.</span><br />
          <span class="wl-text-accent">Elevate Your Life.</span>
        </h1>

        <p class="wl-hero-desc">
          We provide personalized fitness, wellness and healthcare solutions to help you look better, feel stronger and live healthier.
        </p>

        <!-- CTA Buttons Row -->
        <div class="wl-btn-group">
          <a href="#services" class="wl-btn-primary">
            <span>Get Started</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
          <a href="#contact" class="wl-btn-outline">
            <span>Book Appointment</span>
            <i class="fa-regular fa-calendar"></i>
          </a>
        </div>

        <!-- Hero Bottom Stats -->
        <div class="wl-hero-stats">
          <div class="wl-hero-stat-item">
            <div class="wl-stat-icon-box">
              <i class="fa-solid fa-shield-halved"></i>
            </div>
            <div>
              <div class="wl-stat-number">10+</div>
              <div class="wl-stat-text">Years Experience</div>
            </div>
          </div>

          <div class="wl-hero-stat-item">
            <div class="wl-stat-icon-box">
              <i class="fa-solid fa-users"></i>
            </div>
            <div>
              <div class="wl-stat-number">5,000+</div>
              <div class="wl-stat-text">Happy Clients</div>
            </div>
          </div>

          <div class="wl-hero-stat-item">
            <div class="wl-stat-icon-box">
              <i class="fa-solid fa-user-doctor"></i>
            </div>
            <div>
              <div class="wl-stat-number">20+</div>
              <div class="wl-stat-text">Expert Professionals</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Hero Visual Image with Controls -->
      <div class="wl-hero-visual">
        <div class="wl-hero-img-wrap">
          <img src="${WELLNESS_ASSETS.heroFitnessWoman}" alt="Wellness & Fitness Training" class="wl-hero-img" />
          <div class="wl-hero-overlay"></div>
        </div>

        <div class="wl-slider-indicator">
          <span>‹ 1 / 4 ›</span>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 3. ABOUT US SECTION
  // -----------------------------------------------------------
  {
    id: "sec-wellness-about",
    templateId: "",
    name: "About Us",
    html: `
<section id="about" class="wl-about-section">
  <div class="wl-container">
    <div class="wl-about-grid">
      <!-- Left Column: About Visual with Star Badge -->
      <div class="wl-about-img-box">
        <div class="wl-about-img-wrap">
          <img src="${WELLNESS_ASSETS.aboutTrainer}" alt="Personal training session" class="wl-about-img" />
        </div>

        <div class="wl-floating-badge">
          <div class="wl-stat-icon-box">
            <i class="fa-solid fa-star"></i>
          </div>
          <div>
            <div class="wl-stat-number">10+</div>
            <div class="wl-stat-text">Years of Excellence</div>
          </div>
        </div>
      </div>

      <!-- Right Column: Details & Feature Pills -->
      <div>
        <div class="wl-eyebrow">
          <span class="wl-eyebrow-line"></span>
          <span>ABOUT US</span>
        </div>

        <h2 class="wl-section-title">
          Built Around Your<br />Health & Wellbeing
        </h2>

        <p class="wl-section-desc">
          We are committed to helping you achieve your fitness and wellness goals with expert guidance, personalized programs and world-class facilities. Our team of professionals is here to support you every step of the way.
        </p>

        <!-- 3 Feature Badges Row -->
        <div class="wl-features-row">
          <div class="wl-feature-pill">
            <div class="wl-feature-pill-icon">
              <i class="fa-solid fa-user-tie"></i>
            </div>
            <div class="wl-feature-pill-title">Experienced Professionals</div>
          </div>

          <div class="wl-feature-pill">
            <div class="wl-feature-pill-icon">
              <i class="fa-solid fa-shield-heart"></i>
            </div>
            <div class="wl-feature-pill-title">Personalized Programs</div>
          </div>

          <div class="wl-feature-pill">
            <div class="wl-feature-pill-icon">
              <i class="fa-solid fa-dumbbell"></i>
            </div>
            <div class="wl-feature-pill-title">Modern Facilities</div>
          </div>
        </div>

        <a href="#services" class="wl-btn-primary">
          <span>Discover More</span>
          <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 4. OUR SERVICES GRID (WHITE HIGH-CONTRAST CARDS)
  // -----------------------------------------------------------
  {
    id: "sec-wellness-services",
    templateId: "",
    name: "Our Services",
    html: `
<section id="services" class="wl-services-section">
  <div class="wl-container">
    <div class="wl-section-header-center">
      <div class="wl-eyebrow">
        <span class="wl-eyebrow-line"></span>
        <span>OUR SERVICES</span>
        <span class="wl-eyebrow-line"></span>
      </div>
      <h2 class="wl-services-title">Everything You Need To Feel Your Best</h2>
      <p class="wl-services-desc">
        Choose from our wide range of services designed to improve your health, fitness and overall well-being.
      </p>
    </div>

    <!-- 6 Service Cards Grid (3 cols x 2 rows) -->
    <div class="wl-services-grid">
      <!-- Card 1 -->
      <div class="wl-service-card">
        <div>
          <div class="wl-service-icon-box">
            <i class="fa-solid fa-dumbbell"></i>
          </div>
          <h3 class="wl-service-card-title">Personal Training</h3>
          <p class="wl-service-card-desc">
            Get one-on-one guidance from certified trainers to reach your fitness goals.
          </p>
        </div>
        <a href="#contact" class="wl-service-link">
          <span>Learn More</span>
          <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>

      <!-- Card 2 -->
      <div class="wl-service-card">
        <div>
          <div class="wl-service-icon-box">
            <i class="fa-solid fa-person-running"></i>
          </div>
          <h3 class="wl-service-card-title">Fitness Programs</h3>
          <p class="wl-service-card-desc">
            Customized workout plans for all fitness levels and goals.
          </p>
        </div>
        <a href="#contact" class="wl-service-link">
          <span>Learn More</span>
          <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>

      <!-- Card 3 -->
      <div class="wl-service-card">
        <div>
          <div class="wl-service-icon-box">
            <i class="fa-solid fa-spa"></i>
          </div>
          <h3 class="wl-service-card-title">Spa & Relaxation</h3>
          <p class="wl-service-card-desc">
            Rejuvenate your mind and body with our premium spa services.
          </p>
        </div>
        <a href="#contact" class="wl-service-link">
          <span>Learn More</span>
          <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>

      <!-- Card 4 -->
      <div class="wl-service-card">
        <div>
          <div class="wl-service-icon-box">
            <i class="fa-solid fa-stethoscope"></i>
          </div>
          <h3 class="wl-service-card-title">Doctor Consultation</h3>
          <p class="wl-service-card-desc">
            Expert medical consultation for your health and wellness.
          </p>
        </div>
        <a href="#contact" class="wl-service-link">
          <span>Learn More</span>
          <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>

      <!-- Card 5 -->
      <div class="wl-service-card">
        <div>
          <div class="wl-service-icon-box">
            <i class="fa-solid fa-bone"></i>
          </div>
          <h3 class="wl-service-card-title">Physiotherapy</h3>
          <p class="wl-service-card-desc">
            Recover, improve and feel better with professional physiotherapy.
          </p>
        </div>
        <a href="#contact" class="wl-service-link">
          <span>Learn More</span>
          <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>

      <!-- Card 6 -->
      <div class="wl-service-card">
        <div>
          <div class="wl-service-icon-box">
            <i class="fa-solid fa-apple-whole"></i>
          </div>
          <h3 class="wl-service-card-title">Nutrition Planning</h3>
          <p class="wl-service-card-desc">
            Personalized diet plans for a healthier and stronger you.
          </p>
        </div>
        <a href="#contact" class="wl-service-link">
          <span>Learn More</span>
          <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 5. MID-PAGE TRANSFORMATION BANNER
  // -----------------------------------------------------------
  {
    id: "sec-wellness-banner",
    templateId: "",
    name: "Transformation Callout",
    html: `
<section class="wl-banner-section">
  <div class="wl-banner-bg">
    <img src="${WELLNESS_ASSETS.transformationBanner}" alt="Fitness banner" class="wl-banner-img" />
    <div class="wl-banner-gradient"></div>
  </div>

  <div class="wl-container wl-banner-content">
    <div>
      <div class="wl-eyebrow">
        <span class="wl-eyebrow-line"></span>
        <span>READY TO BEGIN?</span>
      </div>

      <h2 class="wl-section-title">
        Ready To Start Your<br />Transformation?
      </h2>

      <p class="wl-section-desc">
        Take the first step towards a healthier, happier you. Our expert team is here to guide you on your journey.
      </p>

      <a href="#contact" class="wl-btn-primary">
        <span>Book Your First Session</span>
        <i class="fa-solid fa-arrow-right"></i>
      </a>
    </div>

    <div class="wl-calligraphy-text">
      Better<br />Health<br />Brighter<br />Future
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 6. MEET OUR EXPERTS / TEAM
  // -----------------------------------------------------------
  {
    id: "sec-wellness-team",
    templateId: "",
    name: "Meet Our Experts",
    html: `
<section id="team" class="wl-team-section">
  <div class="wl-container">
    <div class="wl-section-header-center">
      <div class="wl-eyebrow">
        <span class="wl-eyebrow-line"></span>
        <span>OUR TEAM</span>
        <span class="wl-eyebrow-line"></span>
      </div>
      <h2 class="wl-section-title">Meet Our Experts</h2>
      <p class="wl-section-desc">Our certified professionals are dedicated to your health and success.</p>
    </div>

    <div class="wl-team-grid">
      <!-- Expert 1 -->
      <div class="wl-team-card">
        <div class="wl-team-img-wrap">
          <img src="${WELLNESS_ASSETS.teamAlex}" alt="Alex Morgan" class="wl-team-img" />
        </div>
        <div class="wl-team-info">
          <h3 class="wl-team-name">Alex Morgan</h3>
          <div class="wl-team-role">Fitness Coach</div>
          <div class="wl-team-spec">Strength & Conditioning</div>
          
          <div class="wl-social-row">
            <a href="#" class="wl-social-circle"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="wl-social-circle"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" class="wl-social-circle"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

      <!-- Expert 2 -->
      <div class="wl-team-card">
        <div class="wl-team-img-wrap">
          <img src="${WELLNESS_ASSETS.teamSarah}" alt="Dr. Sarah Williams" class="wl-team-img" />
        </div>
        <div class="wl-team-info">
          <h3 class="wl-team-name">Dr. Sarah Williams</h3>
          <div class="wl-team-role">Medical Specialist</div>
          <div class="wl-team-spec">General Physician</div>
          
          <div class="wl-social-row">
            <a href="#" class="wl-social-circle"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="wl-social-circle"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" class="wl-social-circle"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

      <!-- Expert 3 -->
      <div class="wl-team-card">
        <div class="wl-team-img-wrap">
          <img src="${WELLNESS_ASSETS.teamEmma}" alt="Emma Wilson" class="wl-team-img" />
        </div>
        <div class="wl-team-info">
          <h3 class="wl-team-name">Emma Wilson</h3>
          <div class="wl-team-role">Wellness Therapist</div>
          <div class="wl-team-spec">Spa & Relaxation</div>
          
          <div class="wl-social-row">
            <a href="#" class="wl-social-circle"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="wl-social-circle"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" class="wl-social-circle"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>

      <!-- Expert 4 -->
      <div class="wl-team-card">
        <div class="wl-team-img-wrap">
          <img src="${WELLNESS_ASSETS.teamJohn}" alt="John Carter" class="wl-team-img" />
        </div>
        <div class="wl-team-info">
          <h3 class="wl-team-name">John Carter</h3>
          <div class="wl-team-role">Physiotherapist</div>
          <div class="wl-team-spec">Musculoskeletal Care</div>
          
          <div class="wl-social-row">
            <a href="#" class="wl-social-circle"><i class="fa-brands fa-facebook-f"></i></a>
            <a href="#" class="wl-social-circle"><i class="fa-brands fa-instagram"></i></a>
            <a href="#" class="wl-social-circle"><i class="fa-brands fa-linkedin-in"></i></a>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 7. PRICING SECTION
  // -----------------------------------------------------------
  {
    id: "sec-wellness-pricing",
    templateId: "",
    name: "Pricing Plans",
    html: `
<section id="pricing" class="wl-pricing-section">
  <div class="wl-container">
    <div class="wl-section-header-center">
      <div class="wl-eyebrow">
        <span class="wl-eyebrow-line"></span>
        <span>OUR PRICING</span>
        <span class="wl-eyebrow-line"></span>
      </div>
      <h2 class="wl-section-title">Choose Your Perfect Plan</h2>
      <p class="wl-section-desc">Flexible plans designed to fit your goals and lifestyle.</p>
    </div>

    <div class="wl-pricing-grid">
      <!-- Plan 1 -->
      <div class="wl-pricing-card">
        <div>
          <div class="wl-pricing-title">Starter</div>
          <div class="wl-price-row">
            <span class="wl-price-val">$49</span>
            <span class="wl-price-period">/ month</span>
          </div>

          <div class="wl-pricing-checklist">
            <div class="wl-check-item">
              <i class="fa-solid fa-check wl-text-accent"></i>
              <span>Access to gym facilities</span>
            </div>
            <div class="wl-check-item">
              <i class="fa-solid fa-check wl-text-accent"></i>
              <span>Basic fitness plan</span>
            </div>
            <div class="wl-check-item">
              <i class="fa-solid fa-check wl-text-accent"></i>
              <span>1 wellness consultation</span>
            </div>
          </div>
        </div>

        <a href="#contact" class="wl-btn-outline">
          Get Started
        </a>
      </div>

      <!-- Plan 2 (Featured) -->
      <div class="wl-pricing-card wl-pricing-featured">
        <div class="wl-popular-badge">Most Popular</div>

        <div>
          <div class="wl-pricing-title">Professional</div>
          <div class="wl-price-row">
            <span class="wl-price-val wl-text-accent">$99</span>
            <span class="wl-price-period">/ month</span>
          </div>

          <div class="wl-pricing-checklist">
            <div class="wl-check-item">
              <i class="fa-solid fa-check wl-text-accent"></i>
              <span>All Starter features</span>
            </div>
            <div class="wl-check-item">
              <i class="fa-solid fa-check wl-text-accent"></i>
              <span>Personal training (2x/week)</span>
            </div>
            <div class="wl-check-item">
              <i class="fa-solid fa-check wl-text-accent"></i>
              <span>Nutrition guidance</span>
            </div>
            <div class="wl-check-item">
              <i class="fa-solid fa-check wl-text-accent"></i>
              <span>Wellness consultations</span>
            </div>
          </div>
        </div>

        <a href="#contact" class="wl-btn-primary">
          Get Started
        </a>
      </div>

      <!-- Plan 3 -->
      <div class="wl-pricing-card">
        <div>
          <div class="wl-pricing-title">Premium</div>
          <div class="wl-price-row">
            <span class="wl-price-val">$149</span>
            <span class="wl-price-period">/ month</span>
          </div>

          <div class="wl-pricing-checklist">
            <div class="wl-check-item">
              <i class="fa-solid fa-check wl-text-accent"></i>
              <span>24/7 gym access</span>
            </div>
            <div class="wl-check-item">
              <i class="fa-solid fa-check wl-text-accent"></i>
              <span>Unlimited personal training</span>
            </div>
            <div class="wl-check-item">
              <i class="fa-solid fa-check wl-text-accent"></i>
              <span>Customized diet plan</span>
            </div>
            <div class="wl-check-item">
              <i class="fa-solid fa-check wl-text-accent"></i>
              <span>Priority support</span>
            </div>
          </div>
        </div>

        <a href="#contact" class="wl-btn-outline">
          Get Started
        </a>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 8. WHY THOUSANDS TRUST US & TESTIMONIALS SPLIT
  // -----------------------------------------------------------
  {
    id: "sec-wellness-why-testimonials",
    templateId: "",
    name: "Trust & Testimonials",
    html: `
<section class="wl-split-section">
  <div class="wl-container">
    <div class="wl-split-grid">
      <!-- Left Column: Why Thousands Trust Us with Gym Image -->
      <div class="wl-trust-grid">
        <div class="wl-trust-img-box">
          <img src="${WELLNESS_ASSETS.whyTrustGym}" alt="Gym training facility" class="wl-trust-img" />
          <div class="wl-trust-img-quote">
            STRONGER<br />HEALTHIER<br />HAPPIER
          </div>
        </div>

        <div>
          <div class="wl-eyebrow">
            <span class="wl-eyebrow-line"></span>
            <span>WHY CHOOSE US</span>
          </div>
          <h3 style="font-size: 28px; font-weight: 800; color: #FFFFFF; margin: 0 0 20px;">
            Why Thousands Trust Us
          </h3>

          <div class="wl-trust-list">
            <div class="wl-trust-item">
              <span class="wl-trust-num">01</span>
              <span>Certified Professionals</span>
            </div>
            <div class="wl-trust-item">
              <span class="wl-trust-num">02</span>
              <span>Personalized Guidance</span>
            </div>
            <div class="wl-trust-item">
              <span class="wl-trust-num">03</span>
              <span>Modern Facilities</span>
            </div>
            <div class="wl-trust-item">
              <span class="wl-trust-num">04</span>
              <span>Flexible Plans</span>
            </div>
            <div class="wl-trust-item">
              <span class="wl-trust-num">05</span>
              <span>Customer-First Approach</span>
            </div>
          </div>

          <div class="wl-satisfaction-gauge">
            <div class="wl-gauge-circle">98%</div>
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #FFFFFF;">Client Satisfaction</div>
              <div style="font-size: 11px; color: #94A3B8;">Verified client feedback</div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: What Our Clients Say (Interactive Carousel) -->
      <div class="wl-testimonial-box" data-wto-carousel="1" data-autoplay="1" data-autoplay-delay="4500" data-loop="1" data-pause-hover="1">
        <div class="wl-eyebrow">
          <span class="wl-eyebrow-line"></span>
          <span>TESTIMONIALS</span>
        </div>
        <h3 style="font-size: 28px; font-weight: 800; color: #FFFFFF; margin: 0 0 24px;">
          What Our Clients Say
        </h3>

        <!-- Carousel Viewport & Track -->
        <div class="wl-carousel-viewport" style="overflow: hidden; width: 100%;">
          <div class="wl-carousel-track" data-carousel-track style="display: flex; transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); width: 100%;">

            <!-- Slide 1 -->
            <div class="wl-carousel-slide" data-carousel-slide style="flex: 0 0 100%; min-width: 100%; box-sizing: border-box;">
              <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 18px;">
                <img src="${WELLNESS_ASSETS.avatarReviewer}" alt="Sarah Johnson" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #FACC15;" />
                <div>
                  <div style="font-size: 16px; font-weight: 800; color: #FFFFFF;">Sarah Johnson</div>
                  <div style="font-size: 12px; color: #94A3B8;">Fitness Enthusiast</div>
                </div>
              </div>
              <div class="wl-stars-row">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <p class="wl-quote-text">
                "The trainers are amazing and the facilities are world-class. I've never felt better or more energized in my life!"
              </p>
            </div>

            <!-- Slide 2 -->
            <div class="wl-carousel-slide" data-carousel-slide style="flex: 0 0 100%; min-width: 100%; box-sizing: border-box;">
              <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 18px;">
                <img src="${WELLNESS_ASSETS.teamAlex}" alt="Marcus Vance" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #FACC15;" />
                <div>
                  <div style="font-size: 16px; font-weight: 800; color: #FFFFFF;">Marcus Vance</div>
                  <div style="font-size: 12px; color: #94A3B8;">Crossfit Athlete</div>
                </div>
              </div>
              <div class="wl-stars-row">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <p class="wl-quote-text">
                "The customized nutrition blueprint and targeted strength training helped me shed 18 lbs in just 8 weeks."
              </p>
            </div>

            <!-- Slide 3 -->
            <div class="wl-carousel-slide" data-carousel-slide style="flex: 0 0 100%; min-width: 100%; box-sizing: border-box;">
              <div style="display: flex; align-items: center; gap: 14px; margin-bottom: 18px;">
                <img src="${WELLNESS_ASSETS.teamEmma}" alt="Jessica Lin" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover; border: 2px solid #FACC15;" />
                <div>
                  <div style="font-size: 16px; font-weight: 800; color: #FFFFFF;">Jessica Lin</div>
                  <div style="font-size: 12px; color: #94A3B8;">Yoga & Wellness Member</div>
                </div>
              </div>
              <div class="wl-stars-row">
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
                <i class="fa-solid fa-star"></i>
              </div>
              <p class="wl-quote-text">
                "A true sanctuary for mind and body. The meditation workshops and hydrotherapy sessions keep me centered."
              </p>
            </div>

          </div>
        </div>

        <!-- Carousel Controls Bar -->
        <div class="wl-carousel-controls" style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #232938; padding-top: 18px; margin-top: 20px;">
          <button type="button" data-carousel-prev class="wl-carousel-btn wl-carousel-prev" aria-label="Previous Testimonial" style="background: none; border: none; font-size: 14px; color: #94A3B8; cursor: pointer; padding: 6px 12px; line-height: 1; border-radius: 6px; transition: color 0.2s;">
            <i class="fa-solid fa-chevron-left"></i>
          </button>
          
          <div class="wl-carousel-dots" style="display: flex; align-items: center; gap: 8px;">
            <button type="button" data-carousel-dot data-index="0" class="wl-carousel-dot is-active" aria-label="Slide 1" style="width: 22px; height: 6px; border-radius: 3px; background-color: #FACC15; border: none; cursor: pointer; padding: 0; transition: all 0.25s;"></button>
            <button type="button" data-carousel-dot data-index="1" class="wl-carousel-dot" aria-label="Slide 2" style="width: 8px; height: 6px; border-radius: 3px; background-color: #334155; border: none; cursor: pointer; padding: 0; transition: all 0.25s;"></button>
            <button type="button" data-carousel-dot data-index="2" class="wl-carousel-dot" aria-label="Slide 3" style="width: 8px; height: 6px; border-radius: 3px; background-color: #334155; border: none; cursor: pointer; padding: 0; transition: all 0.25s;"></button>
          </div>

          <button type="button" data-carousel-next class="wl-carousel-btn wl-carousel-next" aria-label="Next Testimonial" style="background: none; border: none; font-size: 14px; color: #94A3B8; cursor: pointer; padding: 6px 12px; line-height: 1; border-radius: 6px; transition: color 0.2s;">
            <i class="fa-solid fa-chevron-right"></i>
          </button>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 9. STATS COUNTER BAR
  // -----------------------------------------------------------
  {
    id: "sec-wellness-stats",
    templateId: "",
    name: "Achievement Counter Bar",
    html: `
<section class="wl-counter-bar">
  <div class="wl-container">
    <div class="wl-counter-grid">
      <div class="wl-counter-item">
        <i class="fa-solid fa-shield-halved wl-text-accent" style="font-size: 26px;"></i>
        <div>
          <div class="wl-stat-number" style="font-size: 28px; line-height: 1;">10+</div>
          <div class="wl-stat-text" style="margin-top: 4px;">Years Experience</div>
        </div>
      </div>

      <div class="wl-counter-item">
        <i class="fa-solid fa-users wl-text-accent" style="font-size: 26px;"></i>
        <div>
          <div class="wl-stat-number" style="font-size: 28px; line-height: 1;">5K+</div>
          <div class="wl-stat-text" style="margin-top: 4px;">Happy Clients</div>
        </div>
      </div>

      <div class="wl-counter-item">
        <i class="fa-solid fa-user-doctor wl-text-accent" style="font-size: 26px;"></i>
        <div>
          <div class="wl-stat-number" style="font-size: 28px; line-height: 1;">25+</div>
          <div class="wl-stat-text" style="margin-top: 4px;">Expert Professionals</div>
        </div>
      </div>

      <div class="wl-counter-item">
        <i class="fa-solid fa-thumbs-up wl-text-accent" style="font-size: 26px;"></i>
        <div>
          <div class="wl-stat-number" style="font-size: 28px; line-height: 1;">98%</div>
          <div class="wl-stat-text" style="margin-top: 4px;">Positive Reviews</div>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 10. BLOG / HEALTH TIPS & INSIGHTS
  // -----------------------------------------------------------
  {
    id: "sec-wellness-blog",
    templateId: "",
    name: "Health Tips & Insights",
    html: `
<section id="blog" class="wl-blog-section">
  <div class="wl-container">
    <div class="wl-section-header-center">
      <div class="wl-eyebrow">
        <span class="wl-eyebrow-line"></span>
        <span>LATEST FROM OUR JOURNAL</span>
        <span class="wl-eyebrow-line"></span>
      </div>
      <h2 class="wl-section-title">Health Tips & Insights</h2>
      <p class="wl-section-desc">Get the latest tips, advice and inspiration for a healthier lifestyle.</p>
    </div>

    <div class="wl-blog-grid">
      <!-- Post 1 -->
      <div class="wl-blog-card">
        <div>
          <div class="wl-blog-img-wrap">
            <img src="${WELLNESS_ASSETS.blogExercises}" alt="Exercises" class="wl-blog-img" />
            <div class="wl-blog-badge">Fitness</div>
          </div>
          <div class="wl-blog-body">
            <div class="wl-blog-date">March 15, 2026</div>
            <h3 class="wl-blog-title">5 Simple Exercises for a Stronger You</h3>
            <p class="wl-blog-desc">
              Stay active and build strength with these easy exercises you can do at home or the gym.
            </p>
          </div>
        </div>
        <div class="wl-blog-footer">
          <a href="#" class="wl-blog-link">
            <span>Read Article</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>

      <!-- Post 2 -->
      <div class="wl-blog-card">
        <div>
          <div class="wl-blog-img-wrap">
            <img src="${WELLNESS_ASSETS.blogRelaxation}" alt="Relaxation" class="wl-blog-img" />
            <div class="wl-blog-badge">Wellness</div>
          </div>
          <div class="wl-blog-body">
            <div class="wl-blog-date">March 12, 2026</div>
            <h3 class="wl-blog-title">The Power of Relaxation and Self-Care</h3>
            <p class="wl-blog-desc">
              Learn how relaxation can improve your mental and physical health.
            </p>
          </div>
        </div>
        <div class="wl-blog-footer">
          <a href="#" class="wl-blog-link">
            <span>Read Article</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>

      <!-- Post 3 -->
      <div class="wl-blog-card">
        <div>
          <div class="wl-blog-img-wrap">
            <img src="${WELLNESS_ASSETS.blogNutrition}" alt="Nutrition" class="wl-blog-img" />
            <div class="wl-blog-badge">Nutrition</div>
          </div>
          <div class="wl-blog-body">
            <div class="wl-blog-date">March 10, 2026</div>
            <h3 class="wl-blog-title">Healthy Eating for a Better Life</h3>
            <p class="wl-blog-desc">
              Discover simple nutrition tips to boost your energy and overall well-being.
            </p>
          </div>
        </div>
        <div class="wl-blog-footer">
          <a href="#" class="wl-blog-link">
            <span>Read Article</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
        </div>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 11. CONTACT & APPOINTMENT BOOKING SECTION
  // -----------------------------------------------------------
  {
    id: "sec-wellness-contact",
    templateId: "",
    name: "Appointment & Contact Form",
    html: `
<section id="contact" class="wl-contact-section">
  <div class="wl-container">
    <div class="wl-contact-grid">
      <!-- Left Column: Contact Copy & Details -->
      <div>
        <div class="wl-eyebrow">
          <span class="wl-eyebrow-line"></span>
          <span>START YOUR JOURNEY TODAY</span>
        </div>

        <h2 class="wl-section-title">
          Your Better Self<br />Starts Today.
        </h2>

        <p class="wl-section-desc">
          Book your appointment and take the first step towards a healthier, happier you.
        </p>

        <div class="wl-btn-group" style="margin-bottom: 40px;">
          <a href="#contact" class="wl-btn-primary">
            <span>Get Started</span>
            <i class="fa-solid fa-arrow-right"></i>
          </a>
          <a href="#services" class="wl-btn-outline">
            <span>Contact Us</span>
            <i class="fa-regular fa-envelope"></i>
          </a>
        </div>

        <div class="wl-contact-list">
          <div class="wl-contact-item">
            <div class="wl-contact-icon">
              <i class="fa-solid fa-location-dot"></i>
            </div>
            <span class="wl-contact-text">123 Wellness Street, New York, NY 10001</span>
          </div>

          <div class="wl-contact-item">
            <div class="wl-contact-icon">
              <i class="fa-solid fa-phone"></i>
            </div>
            <span class="wl-contact-text">+1 (555) 123-4567</span>
          </div>

          <div class="wl-contact-item">
            <div class="wl-contact-icon">
              <i class="fa-solid fa-envelope"></i>
            </div>
            <span class="wl-contact-text">contact@wellnesslife.com</span>
          </div>

          <div class="wl-contact-item">
            <div class="wl-contact-icon">
              <i class="fa-regular fa-clock"></i>
            </div>
            <span class="wl-contact-text">Mon - Sat: 8:00 AM - 8:00 PM</span>
          </div>
        </div>
      </div>

      <!-- Right Column: Appointment Form Card -->
      <div class="wl-form-card">
        <div style="margin-bottom: 24px;">
          <h3 style="font-size: 22px; font-weight: 800; color: #FFFFFF; margin: 0 0 6px;">Get In Touch</h3>
          <p style="font-size: 13px; color: #94A3B8; margin: 0;">Have questions? We're here to help.</p>
        </div>

        <form id="wellness-form" onsubmit="event.preventDefault(); alert('Appointment booked successfully! Our team will contact you shortly.');" style="display: flex; flex-direction: column; gap: 16px;">
          <div class="wl-form-row">
            <div>
              <label class="wl-form-label">First Name *</label>
              <input type="text" required placeholder="John" class="wl-input" />
            </div>
            <div>
              <label class="wl-form-label">Last Name *</label>
              <input type="text" required placeholder="Doe" class="wl-input" />
            </div>
          </div>

          <div class="wl-form-row">
            <div>
              <label class="wl-form-label">Email Address *</label>
              <input type="email" required placeholder="johndoe@gmail.com" class="wl-input" />
            </div>
            <div>
              <label class="wl-form-label">Phone Number *</label>
              <input type="tel" required placeholder="+1 (555) 000-0000" class="wl-input" />
            </div>
          </div>

          <div>
            <label class="wl-form-label">Select Service *</label>
            <select class="wl-select">
              <option value="personal-training">Personal Training</option>
              <option value="fitness-programs">Fitness Programs</option>
              <option value="spa-relaxation">Spa & Relaxation</option>
              <option value="doctor-consultation">Doctor Consultation</option>
              <option value="physiotherapy">Physiotherapy</option>
              <option value="nutrition-planning">Nutrition Planning</option>
            </select>
          </div>

          <div>
            <label class="wl-form-label">Message (Optional)</label>
            <textarea rows="3" placeholder="Tell us about your goals..." class="wl-textarea"></textarea>
          </div>

          <button type="submit" class="wl-btn-primary" style="width: 100%; border-radius: 8px; padding: 14px; margin-top: 6px;">
            <span>Book Appointment</span>
            <i class="fa-solid fa-arrow-right"></i>
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 12. FOOTER SECTION
  // -----------------------------------------------------------
  {
    id: "sec-wellness-footer",
    templateId: "",
    name: "Footer & Copyright",
    html: `
<footer id="footer" class="wl-footer">
  <div class="wl-container">
    <div class="wl-footer-grid">
      <!-- Col 1: Brand & Bio -->
      <div>
        <a href="#home" class="wl-brand" style="margin-bottom: 18px;">
          <div class="wl-brand-icon">
            <i class="fa-solid fa-spa"></i>
          </div>
          <div>
            <div class="wl-brand-title">WellnessLife</div>
            <div class="wl-brand-subtitle">HEALTH • FITNESS • HEALING</div>
          </div>
        </a>

        <p style="font-size: 13px; line-height: 1.6; color: #94A3B8; margin: 0 0 24px; max-width: 300px;">
          Your trusted partner in health, fitness, and overall well-being.
        </p>

        <div class="wl-social-row">
          <a href="#" class="wl-social-circle"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" class="wl-social-circle"><i class="fa-brands fa-x-twitter"></i></a>
          <a href="#" class="wl-social-circle"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" class="wl-social-circle"><i class="fa-brands fa-linkedin-in"></i></a>
        </div>
      </div>

      <!-- Col 2: Quick Links -->
      <div>
        <div class="wl-footer-title">Quick Links</div>
        <ul class="wl-footer-links">
          <li><a href="#home" class="wl-footer-link">Home</a></li>
          <li><a href="#about" class="wl-footer-link">About</a></li>
          <li><a href="#services" class="wl-footer-link">Services</a></li>
          <li><a href="#pricing" class="wl-footer-link">Pricing</a></li>
          <li><a href="#blog" class="wl-footer-link">Blog</a></li>
          <li><a href="#contact" class="wl-footer-link">Contact</a></li>
        </ul>
      </div>

      <!-- Col 3: Services -->
      <div>
        <div class="wl-footer-title">Services</div>
        <ul class="wl-footer-links">
          <li><a href="#services" class="wl-footer-link">Personal Training</a></li>
          <li><a href="#services" class="wl-footer-link">Fitness Programs</a></li>
          <li><a href="#services" class="wl-footer-link">Spa & Relaxation</a></li>
          <li><a href="#services" class="wl-footer-link">Doctor Consultation</a></li>
          <li><a href="#services" class="wl-footer-link">Physiotherapy</a></li>
          <li><a href="#services" class="wl-footer-link">Nutrition Planning</a></li>
        </ul>
      </div>

      <!-- Col 4: Contact Info -->
      <div>
        <div class="wl-footer-title">Contact</div>
        <div class="wl-contact-list">
          <div class="wl-contact-item">
            <i class="fa-solid fa-location-dot wl-text-accent"></i>
            <span>123 Wellness Street, New York, NY 10001</span>
          </div>
          <div class="wl-contact-item">
            <i class="fa-solid fa-phone wl-text-accent"></i>
            <span>+1 (555) 123-4567</span>
          </div>
          <div class="wl-contact-item">
            <i class="fa-solid fa-envelope wl-text-accent"></i>
            <span>contact@wellnesslife.com</span>
          </div>
          <div class="wl-contact-item">
            <i class="fa-regular fa-clock wl-text-accent"></i>
            <span>Mon - Sat: 8:00 AM - 8:00 PM</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Row: Copyright & Floating back to top button -->
    <div class="wl-footer-bottom">
      <div>© 2026 WellnessLife. All rights reserved.</div>
      <div style="display: flex; gap: 20px;">
        <a href="#" class="wl-footer-link">Privacy Policy</a>
        <a href="#" class="wl-footer-link">Terms & Conditions</a>
      </div>
    </div>
  </div>

  <a href="#home" class="wl-back-to-top" title="Back to top">
    <i class="fa-solid fa-chevron-up"></i>
  </a>
</footer>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
];

// =============================================================
// PREBUILT PAGE FOR WELLNESSLIFE
// =============================================================
export const WELLNESS_PAGE: Page = {
  id: "page-wellness-preview",
  name: "Home",
  slug: "home",
  sections: WELLNESS_SECTIONS,
  useGlobalHeader: false,
  useGlobalFooter: false,
  hideHeader: false,
  hideFooter: false,
};

// =============================================================
// PREBUILT TEMPLATE OBJECT FOR SUPABASE / FIRESTORE
// =============================================================
export const WELLNESS_TEMPLATE: Template = {
  id: "tpl-wellness-fitness-health",
  name: "WellnessLife - Health & Fitness",
  slug: "wellness-health-fitness",
  category: "Health & Fitness",
  status: "published",
  thumbnail: WELLNESS_ASSETS.heroFitnessWoman,
  widgets: [],
  pages: [WELLNESS_PAGE],
  createdBy: "super-admin",
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
};
