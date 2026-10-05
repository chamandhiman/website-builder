import type { Page, PageSection } from "@/lib/builder/store";
import type { Template } from "./templates";

// =============================================================
// CURATED HIGH-RESOLUTION REAL ESTATE ASSETS
// =============================================================
export const REALESTATE_ASSETS = {
  heroVilla: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1600&q=80",
  home1ModernFamily: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
  home2Apartment: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
  home3PoolVilla: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=800&q=80",
  home4Townhouse: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
  home5Mansion: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=800&q=80",
  home6Penthouse: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80",
  home7Hillside: "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=800&q=80",
  home8Bungalow: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=800&q=80",
  aboutVideoTour: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80",
  aboutStory: "https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1000&q=80",
  blogNeighborhood: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80",
  blogHomeValue: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
  blogMarket: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80",
  blogAgent: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
  avatarSarah: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  avatarMichael: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  avatarEmily: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
  agentDavid: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
  agentSophia: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
  agentRobert: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
  agentOlivia: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
};

// =============================================================
// GLOBAL CSS FOR REAL ESTATE TEMPLATE
// =============================================================
export const REALESTATE_GLOBAL_CSS = `
@import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.7.2/css/all.min.css");
@import url("https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap");

:root {
  --dh-primary: #0F172A;
  --dh-dark: #0A0F1D;
  --dh-gold: #FACC15;
  --dh-gold-hover: #EAB308;
  --dh-gold-dark: #CA8A04;
  --dh-text-main: #0F172A;
  --dh-text-muted: #64748B;
  --dh-bg-light: #F8FAFC;
  --dh-border: #E2E8F0;
  --dh-font: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
}

body {
  font-family: var(--dh-font);
  color: var(--dh-text-main);
  background-color: #FFFFFF;
  margin: 0;
  padding: 0;
  -webkit-font-smoothing: antialiased;
}

.dh-container {
  max-width: 1240px;
  margin: 0 auto;
  padding-left: 24px;
  padding-right: 24px;
  box-sizing: border-box;
}

.dh-badge-kicker {
  font-size: 11px;
  font-weight: 800;
  color: var(--dh-gold-dark);
  letter-spacing: 0.14em;
  text-transform: uppercase;
  margin-bottom: 8px;
  display: block;
}

.dh-btn-gold {
  background-color: var(--dh-gold);
  color: #0F172A;
  font-weight: 700;
  font-size: 14px;
  padding: 10px 22px;
  border-radius: 8px;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: all 0.2s ease;
  border: none;
  cursor: pointer;
}

.dh-btn-gold:hover {
  background-color: var(--dh-gold-hover);
  transform: translateY(-1px);
}

.dh-card-shadow {
  box-shadow: 0 10px 25px -5px rgba(15, 23, 42, 0.06), 0 8px 10px -6px rgba(15, 23, 42, 0.04);
}

.dh-card-hover {
  transition: all 0.25s ease;
}

.dh-card-hover:hover {
  transform: translateY(-4px);
  box-shadow: 0 20px 30px -10px rgba(15, 23, 42, 0.12);
}
`.trim();

// =============================================================
// SHARED NAVBAR SECTION
// =============================================================
export function createRealEstateNavbar(activeSlug = "home"): PageSection {
  return {
    id: `sec-re-navbar-${activeSlug}`,
    templateId: "",
    name: "Header Navigation",
    html: `
<header style="background: rgba(10, 15, 29, 0.95); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255, 255, 255, 0.08); position: sticky; top: 0; z-index: 100; width: 100%; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto; padding: 14px 24px; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box;">
    
    <!-- Brand Logo -->
    <a href="home.html" style="display: flex; align-items: center; gap: 10px; text-decoration: none;">
      <div style="width: 36px; height: 36px; border-radius: 8px; background: rgba(250, 204, 21, 0.15); border: 1px solid rgba(250, 204, 21, 0.4); display: flex; align-items: center; justify-content: center; color: #FACC15; font-size: 18px;">
        <i class="fa-solid fa-house-chimney"></i>
      </div>
      <div>
        <div style="font-size: 18px; font-weight: 800; color: #FFFFFF; line-height: 1.1; letter-spacing: -0.02em;">DreamHome</div>
        <div style="font-size: 9px; font-weight: 700; color: #FACC15; letter-spacing: 0.18em; text-transform: uppercase;">REAL ESTATE</div>
      </div>
    </a>

    <!-- Nav Links -->
    <nav style="display: flex; align-items: center; gap: 26px;">
      <a href="home.html" style="color: ${activeSlug === "home" ? "#FACC15" : "#E2E8F0"}; text-decoration: none; font-size: 13px; font-weight: ${activeSlug === "home" ? "700" : "500"}; transition: color 0.15s ease;">Home</a>
      <a href="properties.html" style="color: ${activeSlug === "properties" ? "#FACC15" : "#94A3B8"}; text-decoration: none; font-size: 13px; font-weight: ${activeSlug === "properties" ? "700" : "500"}; transition: color 0.15s ease;">Properties</a>
      <a href="about.html" style="color: ${activeSlug === "about" ? "#FACC15" : "#94A3B8"}; text-decoration: none; font-size: 13px; font-weight: ${activeSlug === "about" ? "700" : "500"}; transition: color 0.15s ease;">About</a>
      <a href="services.html" style="color: ${activeSlug === "services" ? "#FACC15" : "#94A3B8"}; text-decoration: none; font-size: 13px; font-weight: ${activeSlug === "services" ? "700" : "500"}; transition: color 0.15s ease;">Services</a>
      <a href="home.html#testimonials" style="color: #94A3B8; text-decoration: none; font-size: 13px; font-weight: 500; transition: color 0.15s ease;">Testimonials</a>
      <a href="blog.html" style="color: ${activeSlug === "blog" ? "#FACC15" : "#94A3B8"}; text-decoration: none; font-size: 13px; font-weight: ${activeSlug === "blog" ? "700" : "500"}; transition: color 0.15s ease;">Blog</a>
      <a href="contact.html" style="color: ${activeSlug === "contact" ? "#FACC15" : "#94A3B8"}; text-decoration: none; font-size: 13px; font-weight: ${activeSlug === "contact" ? "700" : "500"}; transition: color 0.15s ease;">Contact</a>
    </nav>

    <!-- Right Contact & CTA -->
    <div style="display: flex; align-items: center; gap: 18px;">
      <a href="tel:+15551234567" style="display: flex; align-items: center; gap: 7px; color: #E2E8F0; text-decoration: none; font-size: 13px; font-weight: 600;">
        <i class="fa-solid fa-phone" style="color: #FACC15; font-size: 12px;"></i>
        <span>+1 (555) 123-4567</span>
      </a>
      <a href="properties.html" style="background-color: #FACC15; color: #0F172A; text-decoration: none; font-size: 13px; font-weight: 700; padding: 9px 18px; border-radius: 8px; transition: transform 0.15s ease, background 0.15s ease; display: inline-block;">
        Get Started
      </a>
    </div>

  </div>
</header>
    `.trim(),
    animation: { type: "fade-up", duration: 600, delay: 0 },
  };
}

// =============================================================
// SHARED FOOTER SECTION
// =============================================================
export function createRealEstateFooter(): PageSection {
  return {
    id: "sec-re-footer-global",
    templateId: "",
    name: "Site Footer",
    html: `
<footer style="background-color: #0A0F1D; color: #94A3B8; padding: 70px 24px 30px; font-family: 'Plus Jakarta Sans', sans-serif; border-top: 1px solid rgba(255, 255, 255, 0.08);">
  <div style="max-width: 1240px; margin: 0 auto; box-sizing: border-box;">
    
    <div style="display: grid; grid-template-columns: 1.4fr 0.8fr 0.8fr 1.1fr 1.3fr; gap: 36px; padding-bottom: 50px;">
      
      <!-- Col 1: Brand & Socials -->
      <div>
        <a href="home.html" style="display: flex; align-items: center; gap: 10px; text-decoration: none; margin-bottom: 16px;">
          <div style="width: 34px; height: 34px; border-radius: 8px; background: rgba(250, 204, 21, 0.15); border: 1px solid rgba(250, 204, 21, 0.4); display: flex; align-items: center; justify-content: center; color: #FACC15; font-size: 16px;">
            <i class="fa-solid fa-house-chimney"></i>
          </div>
          <div>
            <div style="font-size: 17px; font-weight: 800; color: #FFFFFF; line-height: 1.1;">DreamHome</div>
            <div style="font-size: 8px; font-weight: 700; color: #FACC15; letter-spacing: 0.18em; text-transform: uppercase;">REAL ESTATE</div>
          </div>
        </a>
        <p style="font-size: 13px; line-height: 1.6; color: #94A3B8; margin: 0 0 20px; max-width: 260px;">
          Discover your dream property with the premier luxury real estate agency providing expert guidance and verified listings.
        </p>
        <div style="display: flex; gap: 10px;">
          <a href="#" style="width: 32px; height: 32px; border-radius: 50%; background: #131A2B; border: 1px solid #1E283D; display: flex; align-items: center; justify-content: center; color: #E2E8F0; text-decoration: none; font-size: 12px;"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" style="width: 32px; height: 32px; border-radius: 50%; background: #131A2B; border: 1px solid #1E283D; display: flex; align-items: center; justify-content: center; color: #E2E8F0; text-decoration: none; font-size: 12px;"><i class="fa-brands fa-instagram"></i></a>
          <a href="#" style="width: 32px; height: 32px; border-radius: 50%; background: #131A2B; border: 1px solid #1E283D; display: flex; align-items: center; justify-content: center; color: #E2E8F0; text-decoration: none; font-size: 12px;"><i class="fa-brands fa-linkedin-in"></i></a>
          <a href="#" style="width: 32px; height: 32px; border-radius: 50%; background: #131A2B; border: 1px solid #1E283D; display: flex; align-items: center; justify-content: center; color: #E2E8F0; text-decoration: none; font-size: 12px;"><i class="fa-brands fa-youtube"></i></a>
        </div>
      </div>

      <!-- Col 2: Quick Links -->
      <div>
        <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;">Quick Links</div>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
          <li><a href="home.html" style="color: #94A3B8; text-decoration: none; font-size: 13px; transition: color 0.15s;">Home</a></li>
          <li><a href="properties.html" style="color: #94A3B8; text-decoration: none; font-size: 13px; transition: color 0.15s;">Properties</a></li>
          <li><a href="about.html" style="color: #94A3B8; text-decoration: none; font-size: 13px; transition: color 0.15s;">About</a></li>
        </ul>
      </div>

      <!-- Col 3: Company -->
      <div>
        <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;">Services</div>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
          <li><a href="services.html" style="color: #94A3B8; text-decoration: none; font-size: 13px; transition: color 0.15s;">Services</a></li>
          <li><a href="blog.html" style="color: #94A3B8; text-decoration: none; font-size: 13px; transition: color 0.15s;">Blog</a></li>
          <li><a href="contact.html" style="color: #94A3B8; text-decoration: none; font-size: 13px; transition: color 0.15s;">Contact</a></li>
        </ul>
      </div>

      <!-- Col 4: Contact Info -->
      <div>
        <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;">Contact Us</div>
        <div style="display: flex; flex-direction: column; gap: 10px; font-size: 13px;">
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-phone" style="color: #FACC15; font-size: 12px;"></i>
            <span>+1 (555) 123-4567</span>
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <i class="fa-solid fa-envelope" style="color: #FACC15; font-size: 12px;"></i>
            <span>info@dreamhome.com</span>
          </div>
          <div style="display: flex; align-items: flex-start; gap: 8px;">
            <i class="fa-solid fa-location-dot" style="color: #FACC15; font-size: 12px; margin-top: 3px;"></i>
            <span>123 Real Estate Ave, New York, NY 10001</span>
          </div>
        </div>
      </div>

      <!-- Col 5: Newsletter -->
      <div>
        <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 16px;">Newsletter</div>
        <p style="font-size: 12px; line-height: 1.5; color: #94A3B8; margin: 0 0 12px;">
          Subscribe to our newsletter for the latest properties and real estate tips.
        </p>
        <form onsubmit="event.preventDefault(); alert('Thank you for subscribing to DreamHome!');" style="display: flex; gap: 6px;">
          <input type="email" required placeholder="Enter your email" style="flex: 1; min-width: 0; background-color: #131A2B; border: 1px solid #1E283D; border-radius: 6px; padding: 9px 12px; color: #FFFFFF; font-size: 12px; outline: none;" />
          <button type="submit" style="background-color: #FACC15; color: #0F172A; font-weight: 700; font-size: 12px; border: none; padding: 9px 14px; border-radius: 6px; cursor: pointer; white-space: nowrap;">
            Subscribe
          </button>
        </form>
      </div>

    </div>

    <!-- Bottom Legal Bar -->
    <div style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 24px; display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #64748B;">
      <div>© 2025 DreamHome Real Estate. All rights reserved.</div>
      <div style="display: flex; gap: 20px;">
        <a href="#" style="color: #64748B; text-decoration: none;">Privacy Policy</a>
        <a href="#" style="color: #64748B; text-decoration: none;">Terms & Conditions</a>
      </div>
    </div>

  </div>
</footer>
    `.trim(),
    animation: { type: "fade-up", duration: 600, delay: 0 },
  };
}

// =============================================================
// 1. HOME PAGE SECTIONS (EXACT REPLICA OF USER MOCKUP)
// =============================================================

export const RE_HOME_SECTIONS: PageSection[] = [
  // 1. NAVBAR
  createRealEstateNavbar("home"),

  // 2. HERO SECTION WITH MODERN DUSK VILLA & FLOATING SEARCH BAR
  {
    id: "sec-re-home-hero",
    templateId: "",
    name: "Hero Section with Filter",
    html: `
<section style="position: relative; min-height: 580px; background-image: linear-gradient(180deg, rgba(10, 15, 29, 0.72) 0%, rgba(10, 15, 29, 0.55) 50%, rgba(10, 15, 29, 0.85) 100%), url('${REALESTATE_ASSETS.heroVilla}'); background-size: cover; background-position: center; padding: 90px 24px 90px; color: #FFFFFF; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto; box-sizing: border-box;">
    
    <!-- Hero Copy -->
    <div style="max-width: 680px; margin-bottom: 50px;">
      <div style="font-size: 12px; font-weight: 800; color: #FACC15; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 14px;">
        YOUR DREAM HOME AWAITS
      </div>
      <h1 style="font-size: 52px; font-weight: 800; line-height: 1.12; letter-spacing: -0.02em; margin: 0 0 16px; color: #FFFFFF;">
        Find Your Perfect <br /><span style="color: #FACC15;">Home</span> with Us
      </h1>
      <p style="font-size: 16px; line-height: 1.6; color: #E2E8F0; margin: 0; max-width: 560px;">
        Whether you're buying, selling, or renting, we make real estate simple, seamless, and stress-free.
      </p>
    </div>

    <!-- Floating Search & Filter Bar (Exact Match) -->
    <div style="background: #FFFFFF; border-radius: 14px; padding: 12px 16px; box-shadow: 0 20px 40px -10px rgba(0, 0, 0, 0.35); display: grid; grid-template-columns: 1.2fr 1fr 1fr auto; gap: 12px; align-items: center; max-width: 960px; box-sizing: border-box;">
      
      <!-- Field 1: Location -->
      <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-right: 1px solid #E2E8F0;">
        <i class="fa-solid fa-location-dot" style="color: #CA8A04; font-size: 16px;"></i>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 11px; font-weight: 700; color: #0F172A; line-height: 1.2;">Location</div>
          <input type="text" placeholder="Enter city, area or zip" style="width: 100%; border: none; outline: none; font-size: 13px; color: #64748B; background: transparent; padding: 0; margin-top: 2px;" />
        </div>
      </div>

      <!-- Field 2: Property Type -->
      <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px; border-right: 1px solid #E2E8F0;">
        <i class="fa-solid fa-house" style="color: #CA8A04; font-size: 16px;"></i>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 11px; font-weight: 700; color: #0F172A; line-height: 1.2;">Property Type</div>
          <select style="width: 100%; border: none; outline: none; font-size: 13px; color: #64748B; background: transparent; padding: 0; margin-top: 2px; cursor: pointer;">
            <option>Any</option>
            <option>Modern Villa</option>
            <option>Luxury Apartment</option>
            <option>Townhouse</option>
            <option>Penthouse</option>
          </select>
        </div>
      </div>

      <!-- Field 3: Budget -->
      <div style="display: flex; align-items: center; gap: 10px; padding: 8px 12px;">
        <i class="fa-solid fa-gauge-high" style="color: #CA8A04; font-size: 16px;"></i>
        <div style="flex: 1; min-width: 0;">
          <div style="font-size: 11px; font-weight: 700; color: #0F172A; line-height: 1.2;">Budget</div>
          <select style="width: 100%; border: none; outline: none; font-size: 13px; color: #64748B; background: transparent; padding: 0; margin-top: 2px; cursor: pointer;">
            <option>Any</option>
            <option>$300k - $600k</option>
            <option>$600k - $1M</option>
            <option>$1M - $2.5M</option>
            <option>$2.5M+</option>
          </select>
        </div>
      </div>

      <!-- Search Button -->
      <div>
        <a href="properties.html" style="background-color: #FACC15; color: #0F172A; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 10px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s ease;">
          <i class="fa-solid fa-magnifying-glass" style="font-size: 13px;"></i>
          <span>Search</span>
        </a>
      </div>

    </div>

  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 3. TRUST & FEATURES STRIP (4 HIGHLIGHT CARDS)
  {
    id: "sec-re-home-features",
    templateId: "",
    name: "Key Features & Trust Bar",
    html: `
<section style="background-color: #FFFFFF; border-bottom: 1px solid #E2E8F0; padding: 32px 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px; box-sizing: border-box;">
    
    <!-- Feature 1 -->
    <div style="display: flex; align-items: center; gap: 14px; padding: 8px 12px;">
      <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 18px; shrink: 0;">
        <i class="fa-solid fa-house"></i>
      </div>
      <div>
        <div style="font-size: 14px; font-weight: 700; color: #0F172A;">Wide Range of Properties</div>
        <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Find from 1000+ listings</div>
      </div>
    </div>

    <!-- Feature 2 -->
    <div style="display: flex; align-items: center; gap: 14px; padding: 8px 12px; border-left: 1px solid #F1F5F9;">
      <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 18px; shrink: 0;">
        <i class="fa-solid fa-shield-halved"></i>
      </div>
      <div>
        <div style="font-size: 14px; font-weight: 700; color: #0F172A;">Trusted & Secure</div>
        <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Safe and transparent process</div>
      </div>
    </div>

    <!-- Feature 3 -->
    <div style="display: flex; align-items: center; gap: 14px; padding: 8px 12px; border-left: 1px solid #F1F5F9;">
      <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 18px; shrink: 0;">
        <i class="fa-solid fa-user-group"></i>
      </div>
      <div>
        <div style="font-size: 14px; font-weight: 700; color: #0F172A;">Expert Guidance</div>
        <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Professional support at every step</div>
      </div>
    </div>

    <!-- Feature 4 -->
    <div style="display: flex; align-items: center; gap: 14px; padding: 8px 12px; border-left: 1px solid #F1F5F9;">
      <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 18px; shrink: 0;">
        <i class="fa-solid fa-location-dot"></i>
      </div>
      <div>
        <div style="font-size: 14px; font-weight: 700; color: #0F172A;">Prime Locations</div>
        <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Best properties in top neighborhoods</div>
      </div>
    </div>

  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 4. FEATURED PROPERTIES (4-CARD GRID)
  {
    id: "sec-re-home-listings",
    templateId: "",
    name: "Featured Properties",
    html: `
<section style="background-color: #F8FAFC; padding: 70px 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto; box-sizing: border-box;">
    
    <!-- Section Header -->
    <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px;">
      <div>
        <div style="font-size: 11px; font-weight: 800; color: #CA8A04; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px;">
          FEATURED PROPERTIES
        </div>
        <h2 style="font-size: 28px; font-weight: 800; color: #0F172A; margin: 0; letter-spacing: -0.02em;">
          Explore Our Latest Listings
        </h2>
      </div>
      <a href="properties.html" style="color: #CA8A04; font-size: 13px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 6px;">
        <span>View All Properties</span>
        <i class="fa-solid fa-arrow-right" style="font-size: 11px;"></i>
      </a>
    </div>

    <!-- 4 Properties Grid -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
      
      <!-- Property 1 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: transform 0.2s ease;">
        <div style="position: relative; height: 170px;">
          <img src="${REALESTATE_ASSETS.home1ModernFamily}" alt="Modern Family Home" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">
            For Sale
          </span>
        </div>
        <div style="padding: 16px;">
          <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">$850,000</div>
          <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Modern Family Home</div>
          <div style="font-size: 11px; color: #64748B; display: flex; align-items: center; gap: 4px; margin-bottom: 14px;">
            <i class="fa-solid fa-location-dot" style="color: #CA8A04;"></i> California, USA
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">
            <span><i class="fa-solid fa-bed" style="margin-right: 4px;"></i> 4 Beds</span>
            <span><i class="fa-solid fa-bath" style="margin-right: 4px;"></i> 3 Baths</span>
            <span><i class="fa-solid fa-ruler-combined" style="margin-right: 4px;"></i> 2,500 sqft</span>
          </div>
        </div>
      </div>

      <!-- Property 2 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: transform 0.2s ease;">
        <div style="position: relative; height: 170px;">
          <img src="${REALESTATE_ASSETS.home2Apartment}" alt="Luxury Apartment" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">
            For Sale
          </span>
        </div>
        <div style="padding: 16px;">
          <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">$620,000</div>
          <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Luxury Apartment</div>
          <div style="font-size: 11px; color: #64748B; display: flex; align-items: center; gap: 4px; margin-bottom: 14px;">
            <i class="fa-solid fa-location-dot" style="color: #CA8A04;"></i> New York, USA
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">
            <span><i class="fa-solid fa-bed" style="margin-right: 4px;"></i> 2 Beds</span>
            <span><i class="fa-solid fa-bath" style="margin-right: 4px;"></i> 2 Baths</span>
            <span><i class="fa-solid fa-ruler-combined" style="margin-right: 4px;"></i> 1,200 sqft</span>
          </div>
        </div>
      </div>

      <!-- Property 3 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: transform 0.2s ease;">
        <div style="position: relative; height: 170px;">
          <img src="${REALESTATE_ASSETS.home3PoolVilla}" alt="Villa with Private Pool" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">
            For Sale
          </span>
        </div>
        <div style="padding: 16px;">
          <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">$1,200,000</div>
          <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Villa with Private Pool</div>
          <div style="font-size: 11px; color: #64748B; display: flex; align-items: center; gap: 4px; margin-bottom: 14px;">
            <i class="fa-solid fa-location-dot" style="color: #CA8A04;"></i> Florida, USA
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">
            <span><i class="fa-solid fa-bed" style="margin-right: 4px;"></i> 5 Beds</span>
            <span><i class="fa-solid fa-bath" style="margin-right: 4px;"></i> 4 Baths</span>
            <span><i class="fa-solid fa-ruler-combined" style="margin-right: 4px;"></i> 4,000 sqft</span>
          </div>
        </div>
      </div>

      <!-- Property 4 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03); transition: transform 0.2s ease;">
        <div style="position: relative; height: 170px;">
          <img src="${REALESTATE_ASSETS.home4Townhouse}" alt="Modern Townhouse" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(16, 185, 129, 0.9); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">
            For Rent
          </span>
        </div>
        <div style="padding: 16px;">
          <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">$2,500 <span style="font-size: 13px; font-weight: 500; color: #64748B;">/month</span></div>
          <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Modern Townhouse</div>
          <div style="font-size: 11px; color: #64748B; display: flex; align-items: center; gap: 4px; margin-bottom: 14px;">
            <i class="fa-solid fa-location-dot" style="color: #CA8A04;"></i> Texas, USA
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; padding-top: 10px; border-top: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">
            <span><i class="fa-solid fa-bed" style="margin-right: 4px;"></i> 3 Beds</span>
            <span><i class="fa-solid fa-bath" style="margin-right: 4px;"></i> 2 Baths</span>
            <span><i class="fa-solid fa-ruler-combined" style="margin-right: 4px;"></i> 1,800 sqft</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 5. ABOUT US (VIDEO TOUR PREVIEW + STORY & STATS)
  {
    id: "sec-re-home-about",
    templateId: "",
    name: "About Us & Video Tour",
    html: `
<section style="background-color: #FFFFFF; padding: 80px 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1.1fr 1fr; gap: 50px; align-items: center; box-sizing: border-box;">
    
    <!-- Left: Video Tour Preview Card -->
    <div style="position: relative; border-radius: 16px; overflow: hidden; height: 380px; box-shadow: 0 15px 30px rgba(0,0,0,0.1);">
      <img src="${REALESTATE_ASSETS.aboutVideoTour}" alt="DreamHome Interior Tour" style="width: 100%; height: 100%; object-fit: cover;" />
      
      <!-- Dark overlay -->
      <div style="position: absolute; inset: 0; background: rgba(15, 23, 42, 0.25);"></div>
      
      <!-- Gold Play Button -->
      <a href="about.html" style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); width: 64px; height: 64px; border-radius: 50%; background-color: #FACC15; display: flex; align-items: center; justify-content: center; color: #0F172A; text-decoration: none; font-size: 20px; box-shadow: 0 8px 25px rgba(250, 204, 21, 0.5); transition: transform 0.2s ease;">
        <i class="fa-solid fa-play" style="margin-left: 3px;"></i>
      </a>
    </div>

    <!-- Right: About Story & Metrics -->
    <div>
      <div style="font-size: 11px; font-weight: 800; color: #CA8A04; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px;">
        ABOUT US
      </div>
      <h2 style="font-size: 32px; font-weight: 800; color: #0F172A; line-height: 1.2; margin: 0 0 16px; letter-spacing: -0.02em;">
        Your Trusted Real Estate Partner
      </h2>
      <p style="font-size: 14px; line-height: 1.7; color: #64748B; margin: 0 0 28px;">
        At DreamHome, we believe that finding the right property is more than just a transaction — it's about building your future. With years of experience and a commitment to excellence, we help you navigate the real estate market with confidence.
      </p>

      <!-- 3 Metrics Columns -->
      <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; padding-bottom: 28px; border-bottom: 1px solid #F1F5F9; margin-bottom: 28px;">
        <div>
          <div style="font-size: 26px; font-weight: 800; color: #0F172A;">10+</div>
          <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Years Experience</div>
        </div>
        <div>
          <div style="font-size: 26px; font-weight: 800; color: #0F172A;">500+</div>
          <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Happy Clients</div>
        </div>
        <div>
          <div style="font-size: 26px; font-weight: 800; color: #0F172A;">1,000+</div>
          <div style="font-size: 12px; color: #64748B; margin-top: 4px;">Properties Sold</div>
        </div>
      </div>

      <a href="about.html" style="background-color: #FACC15; color: #0F172A; font-weight: 700; font-size: 13px; padding: 12px 24px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
        <span>Learn More</span>
        <i class="fa-solid fa-arrow-right" style="font-size: 12px;"></i>
      </a>
    </div>

  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 6. OUR SERVICES (HOW WE CAN HELP YOU - 4 CARDS)
  {
    id: "sec-re-home-services",
    templateId: "",
    name: "Our Services",
    html: `
<section style="background-color: #F8FAFC; padding: 70px 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto; box-sizing: border-box;">
    
    <div style="margin-bottom: 36px;">
      <div style="font-size: 11px; font-weight: 800; color: #CA8A04; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px;">
        OUR SERVICES
      </div>
      <h2 style="font-size: 28px; font-weight: 800; color: #0F172A; margin: 0; letter-spacing: -0.02em;">
        How We Can Help You
      </h2>
    </div>

    <!-- 4 Services Cards -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
      
      <!-- Card 1: Buy a Property -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 28px 22px; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: transform 0.2s ease;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 20px; margin-bottom: 18px;">
          <i class="fa-solid fa-house"></i>
        </div>
        <div style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">Buy a Property</div>
        <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0;">
          Find your dream home with expert guidance and tailored financing solutions.
        </p>
      </div>

      <!-- Card 2: Sell a Property -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 28px 22px; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: transform 0.2s ease;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 20px; margin-bottom: 18px;">
          <i class="fa-solid fa-tags"></i>
        </div>
        <div style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">Sell a Property</div>
        <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0;">
          Get the best value with our marketing expertise and verified high-intent buyer network.
        </p>
      </div>

      <!-- Card 3: Rent a Property -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 28px 22px; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: transform 0.2s ease;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 20px; margin-bottom: 18px;">
          <i class="fa-solid fa-key"></i>
        </div>
        <div style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">Rent a Property</div>
        <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0;">
          Flexible options for short or long term stays in top metropolitan neighborhoods.
        </p>
      </div>

      <!-- Card 4: Property Management -->
      <div style="background: #FFFFFF; border-radius: 12px; padding: 28px 22px; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.02); transition: transform 0.2s ease;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 20px; margin-bottom: 18px;">
          <i class="fa-solid fa-building-circle-check"></i>
        </div>
        <div style="font-size: 16px; font-weight: 700; color: #0F172A; margin-bottom: 8px;">Property Management</div>
        <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0;">
          We handle the details, leasing, and maintenance while you enjoy steady rental returns.
        </p>
      </div>

    </div>

  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 7. TESTIMONIALS (DARK NAVY SECTION + 3 CLIENT CARDS)
  {
    id: "sec-re-home-testimonials",
    templateId: "",
    name: "Testimonials",
    html: `
<section id="testimonials" style="background-color: #0A0F1D; color: #FFFFFF; padding: 80px 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1fr 2.4fr; gap: 40px; align-items: center; box-sizing: border-box;">
    
    <!-- Left Column: Title & CTA -->
    <div>
      <div style="font-size: 11px; font-weight: 800; color: #FACC15; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 10px;">
        TESTIMONIALS
      </div>
      <h2 style="font-size: 32px; font-weight: 800; line-height: 1.2; margin: 0 0 14px; letter-spacing: -0.02em;">
        What Our Clients Say
      </h2>
      <p style="font-size: 14px; line-height: 1.6; color: #94A3B8; margin: 0 0 28px;">
        Real stories from happy homeowners and investors who built their dreams with us.
      </p>
      <a href="about.html" style="background-color: #FACC15; color: #0F172A; font-weight: 700; font-size: 13px; padding: 11px 22px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px;">
        <span>View All Reviews</span>
        <i class="fa-solid fa-arrow-right" style="font-size: 11px;"></i>
      </a>
    </div>

    <!-- Right Column: 3 White Client Cards -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px;">
      
      <!-- Review 1: Sarah Johnson -->
      <div style="background: #FFFFFF; color: #0F172A; border-radius: 12px; padding: 22px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
            <img src="${REALESTATE_ASSETS.avatarSarah}" alt="Sarah Johnson" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #0F172A;">Sarah Johnson</div>
              <div style="font-size: 11px; color: #64748B;">Home Buyer</div>
            </div>
          </div>
          <p style="font-size: 12px; line-height: 1.6; color: #475569; margin: 0 0 16px;">
            "The team was incredibly helpful and professional. They found us the perfect home within our budget."
          </p>
        </div>
        <div style="color: #FACC15; font-size: 12px; letter-spacing: 2px;">
          <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
        </div>
      </div>

      <!-- Review 2: Michael Brown -->
      <div style="background: #FFFFFF; color: #0F172A; border-radius: 12px; padding: 22px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
            <img src="${REALESTATE_ASSETS.avatarMichael}" alt="Michael Brown" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #0F172A;">Michael Brown</div>
              <div style="font-size: 11px; color: #64748B;">Home Seller</div>
            </div>
          </div>
          <p style="font-size: 12px; line-height: 1.6; color: #475569; margin: 0 0 16px;">
            "Excellent service from start to finish. They made the selling process smooth and stress-free."
          </p>
        </div>
        <div style="color: #FACC15; font-size: 12px; letter-spacing: 2px;">
          <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
        </div>
      </div>

      <!-- Review 3: Emily Davis -->
      <div style="background: #FFFFFF; color: #0F172A; border-radius: 12px; padding: 22px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px;">
            <img src="${REALESTATE_ASSETS.avatarEmily}" alt="Emily Davis" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;" />
            <div>
              <div style="font-size: 13px; font-weight: 700; color: #0F172A;">Emily Davis</div>
              <div style="font-size: 11px; color: #64748B;">Renter</div>
            </div>
          </div>
          <p style="font-size: 12px; line-height: 1.6; color: #475569; margin: 0 0 16px;">
            "Great experience! Very responsive and knowledgeable. I highly recommend them to anyone looking!"
          </p>
        </div>
        <div style="color: #FACC15; font-size: 12px; letter-spacing: 2px;">
          <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
        </div>
      </div>

    </div>

  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 8. LATEST BLOG (TIPS & INSIGHTS - 4 CARDS)
  {
    id: "sec-re-home-blog",
    templateId: "",
    name: "Latest Blog & Insights",
    html: `
<section style="background-color: #FFFFFF; padding: 70px 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto; box-sizing: border-box;">
    
    <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 36px;">
      <div>
        <div style="font-size: 11px; font-weight: 800; color: #CA8A04; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px;">
          LATEST BLOG
        </div>
        <h2 style="font-size: 28px; font-weight: 800; color: #0F172A; margin: 0; letter-spacing: -0.02em;">
          Tips & Insights
        </h2>
      </div>
      <a href="blog.html" style="color: #CA8A04; font-size: 13px; font-weight: 700; text-decoration: none; display: flex; align-items: center; gap: 6px;">
        <span>View All Articles</span>
        <i class="fa-solid fa-arrow-right" style="font-size: 11px;"></i>
      </a>
    </div>

    <!-- 4 Blog Cards -->
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
      
      <!-- Article 1 -->
      <a href="blog.html" style="text-decoration: none; color: inherit; display: block; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; background: #FFFFFF; transition: transform 0.2s ease;">
        <div style="height: 140px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.blogNeighborhood}" alt="Neighborhood Tips" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 14px;">
          <div style="font-size: 13px; font-weight: 700; color: #0F172A; line-height: 1.4; margin-bottom: 10px;">
            5 Tips to Choose the Right Neighborhood
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #64748B;">
            <span>May 12, 2025</span>
            <i class="fa-solid fa-arrow-right" style="color: #CA8A04;"></i>
          </div>
        </div>
      </a>

      <!-- Article 2 -->
      <a href="blog.html" style="text-decoration: none; color: inherit; display: block; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; background: #FFFFFF; transition: transform 0.2s ease;">
        <div style="height: 140px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.blogHomeValue}" alt="Home Value" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 14px;">
          <div style="font-size: 13px; font-weight: 700; color: #0F172A; line-height: 1.4; margin-bottom: 10px;">
            How to Increase Your Home's Value
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #64748B;">
            <span>May 8, 2025</span>
            <i class="fa-solid fa-arrow-right" style="color: #CA8A04;"></i>
          </div>
        </div>
      </a>

      <!-- Article 3 -->
      <a href="blog.html" style="text-decoration: none; color: inherit; display: block; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; background: #FFFFFF; transition: transform 0.2s ease;">
        <div style="height: 140px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.blogMarket}" alt="Real Estate Market" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 14px;">
          <div style="font-size: 13px; font-weight: 700; color: #0F172A; line-height: 1.4; margin-bottom: 10px;">
            Is Now a Good Time to Buy Real Estate?
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #64748B;">
            <span>May 5, 2025</span>
            <i class="fa-solid fa-arrow-right" style="color: #CA8A04;"></i>
          </div>
        </div>
      </a>

      <!-- Article 4 -->
      <a href="blog.html" style="text-decoration: none; color: inherit; display: block; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; background: #FFFFFF; transition: transform 0.2s ease;">
        <div style="height: 140px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.blogAgent}" alt="Working with Agent" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 14px;">
          <div style="font-size: 13px; font-weight: 700; color: #0F172A; line-height: 1.4; margin-bottom: 10px;">
            The Benefits of Working with a Real Estate Agent
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; font-size: 11px; color: #64748B;">
            <span>May 2, 2025</span>
            <i class="fa-solid fa-arrow-right" style="color: #CA8A04;"></i>
          </div>
        </div>
      </a>

    </div>

  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 9. PRE-FOOTER CTA BANNER
  {
    id: "sec-re-home-cta",
    templateId: "",
    name: "Pre-Footer CTA Banner",
    html: `
<section style="background-image: linear-gradient(90deg, rgba(10, 15, 29, 0.95) 0%, rgba(10, 15, 29, 0.85) 100%), url('${REALESTATE_ASSETS.heroVilla}'); background-size: cover; background-position: center; padding: 48px 24px; color: #FFFFFF; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; box-sizing: border-box;">
    <div>
      <h3 style="font-size: 24px; font-weight: 800; margin: 0 0 6px; letter-spacing: -0.01em;">
        Ready to Find Your Dream Home?
      </h3>
      <p style="font-size: 13px; color: #94A3B8; margin: 0;">
        Get in touch with our team today and take the first step towards your new home.
      </p>
    </div>
    <a href="contact.html" style="background-color: #FACC15; color: #0F172A; font-weight: 700; font-size: 13px; padding: 11px 22px; border-radius: 8px; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; white-space: nowrap;">
      <span>Contact Us</span>
      <i class="fa-solid fa-arrow-right" style="font-size: 11px;"></i>
    </a>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // 10. SITE FOOTER
  createRealEstateFooter(),
];

// =============================================================
// 2. PROPERTIES PAGE (INNER PAGE)
// =============================================================

export const RE_PROPERTIES_SECTIONS: PageSection[] = [
  createRealEstateNavbar("properties"),

  // Properties Banner
  {
    id: "sec-re-prop-banner",
    templateId: "",
    name: "Properties Banner",
    html: `
<section style="background-color: #0A0F1D; color: #FFFFFF; padding: 60px 24px 50px; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif; border-bottom: 1px solid rgba(255, 255, 255, 0.08);">
  <div style="max-width: 800px; margin: 0 auto;">
    <div style="font-size: 11px; font-weight: 800; color: #FACC15; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 10px;">EXCLUSIVE COLLECTION</div>
    <h1 style="font-size: 40px; font-weight: 800; margin: 0 0 14px; letter-spacing: -0.02em;">Explore All Properties</h1>
    <p style="font-size: 15px; color: #94A3B8; line-height: 1.6; margin: 0;">
      Browse our verified portfolio of residential luxury villas, modern apartments, penthouses, and private estates.
    </p>
  </div>
</section>
    `.trim(),
  },

  // Filter Bar
  {
    id: "sec-re-prop-filter",
    templateId: "",
    name: "Properties Search & Filter",
    html: `
<section style="background-color: #F8FAFC; border-bottom: 1px solid #E2E8F0; padding: 24px;">
  <div style="max-width: 1240px; margin: 0 auto; display: flex; flex-wrap: wrap; gap: 14px; align-items: center; justify-content: space-between;">
    <div style="display: flex; gap: 10px; flex-wrap: wrap;">
      <select style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 8px 14px; font-size: 13px; color: #0F172A; font-family: inherit;">
        <option>All Types</option>
        <option>Villas</option>
        <option>Apartments</option>
        <option>Townhouses</option>
        <option>Penthouses</option>
      </select>
      <select style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 8px 14px; font-size: 13px; color: #0F172A; font-family: inherit;">
        <option>Any Location</option>
        <option>California</option>
        <option>New York</option>
        <option>Florida</option>
        <option>Texas</option>
      </select>
      <select style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 8px 14px; font-size: 13px; color: #0F172A; font-family: inherit;">
        <option>Price: Any</option>
        <option>Under $500,000</option>
        <option>$500k - $1,000,000</option>
        <option>$1,000,000+</option>
      </select>
      <select style="background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 8px 14px; font-size: 13px; color: #0F172A; font-family: inherit;">
        <option>Bedrooms: Any</option>
        <option>2+ Beds</option>
        <option>3+ Beds</option>
        <option>4+ Beds</option>
      </select>
    </div>
    <div style="font-size: 13px; font-weight: 600; color: #64748B;">
      Showing <span style="color: #0F172A; font-weight: 800;">8 Available Properties</span>
    </div>
  </div>
</section>
    `.trim(),
  },

  // 8 Properties Grid
  {
    id: "sec-re-prop-grid",
    templateId: "",
    name: "Properties Grid",
    html: `
<section style="background-color: #FFFFFF; padding: 60px 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto;">
    
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;">
      
      <!-- Item 1 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="position: relative; height: 180px;">
          <img src="${REALESTATE_ASSETS.home1ModernFamily}" alt="Modern Family Home" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">For Sale</span>
        </div>
        <div style="padding: 16px;">
          <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">$850,000</div>
          <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Modern Family Home</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 12px;"><i class="fa-solid fa-location-dot" style="color: #CA8A04;"></i> California, USA</div>
          <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">
            <span><i class="fa-solid fa-bed"></i> 4 Beds</span>
            <span><i class="fa-solid fa-bath"></i> 3 Baths</span>
            <span><i class="fa-solid fa-ruler-combined"></i> 2,500 sqft</span>
          </div>
        </div>
      </div>

      <!-- Item 2 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="position: relative; height: 180px;">
          <img src="${REALESTATE_ASSETS.home2Apartment}" alt="Luxury Apartment" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">For Sale</span>
        </div>
        <div style="padding: 16px;">
          <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">$620,000</div>
          <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Luxury Apartment</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 12px;"><i class="fa-solid fa-location-dot" style="color: #CA8A04;"></i> New York, USA</div>
          <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">
            <span><i class="fa-solid fa-bed"></i> 2 Beds</span>
            <span><i class="fa-solid fa-bath"></i> 2 Baths</span>
            <span><i class="fa-solid fa-ruler-combined"></i> 1,200 sqft</span>
          </div>
        </div>
      </div>

      <!-- Item 3 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="position: relative; height: 180px;">
          <img src="${REALESTATE_ASSETS.home3PoolVilla}" alt="Villa with Pool" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">For Sale</span>
        </div>
        <div style="padding: 16px;">
          <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">$1,200,000</div>
          <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Villa with Private Pool</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 12px;"><i class="fa-solid fa-location-dot" style="color: #CA8A04;"></i> Florida, USA</div>
          <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">
            <span><i class="fa-solid fa-bed"></i> 5 Beds</span>
            <span><i class="fa-solid fa-bath"></i> 4 Baths</span>
            <span><i class="fa-solid fa-ruler-combined"></i> 4,000 sqft</span>
          </div>
        </div>
      </div>

      <!-- Item 4 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="position: relative; height: 180px;">
          <img src="${REALESTATE_ASSETS.home4Townhouse}" alt="Modern Townhouse" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(16, 185, 129, 0.9); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">For Rent</span>
        </div>
        <div style="padding: 16px;">
          <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">$2,500 /mo</div>
          <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Modern Townhouse</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 12px;"><i class="fa-solid fa-location-dot" style="color: #CA8A04;"></i> Texas, USA</div>
          <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">
            <span><i class="fa-solid fa-bed"></i> 3 Beds</span>
            <span><i class="fa-solid fa-bath"></i> 2 Baths</span>
            <span><i class="fa-solid fa-ruler-combined"></i> 1,800 sqft</span>
          </div>
        </div>
      </div>

      <!-- Item 5 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="position: relative; height: 180px;">
          <img src="${REALESTATE_ASSETS.home5Mansion}" alt="Waterfront Mansion" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">For Sale</span>
        </div>
        <div style="padding: 16px;">
          <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">$2,850,000</div>
          <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Waterfront Luxury Estate</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 12px;"><i class="fa-solid fa-location-dot" style="color: #CA8A04;"></i> Miami, Florida</div>
          <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">
            <span><i class="fa-solid fa-bed"></i> 6 Beds</span>
            <span><i class="fa-solid fa-bath"></i> 6 Baths</span>
            <span><i class="fa-solid fa-ruler-combined"></i> 6,200 sqft</span>
          </div>
        </div>
      </div>

      <!-- Item 6 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="position: relative; height: 180px;">
          <img src="${REALESTATE_ASSETS.home6Penthouse}" alt="Skyline Penthouse" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">For Sale</span>
        </div>
        <div style="padding: 16px;">
          <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">$1,750,000</div>
          <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Skyline Penthouse Suite</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 12px;"><i class="fa-solid fa-location-dot" style="color: #CA8A04;"></i> Manhattan, NY</div>
          <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">
            <span><i class="fa-solid fa-bed"></i> 4 Beds</span>
            <span><i class="fa-solid fa-bath"></i> 3 Baths</span>
            <span><i class="fa-solid fa-ruler-combined"></i> 2,800 sqft</span>
          </div>
        </div>
      </div>

      <!-- Item 7 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="position: relative; height: 180px;">
          <img src="${REALESTATE_ASSETS.home7Hillside}" alt="Hillside Villa" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">For Sale</span>
        </div>
        <div style="padding: 16px;">
          <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">$1,490,000</div>
          <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Contemporary Hillside Villa</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 12px;"><i class="fa-solid fa-location-dot" style="color: #CA8A04;"></i> Aspen, Colorado</div>
          <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">
            <span><i class="fa-solid fa-bed"></i> 5 Beds</span>
            <span><i class="fa-solid fa-bath"></i> 4 Baths</span>
            <span><i class="fa-solid fa-ruler-combined"></i> 3,600 sqft</span>
          </div>
        </div>
      </div>

      <!-- Item 8 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="position: relative; height: 180px;">
          <img src="${REALESTATE_ASSETS.home8Bungalow}" alt="Beachside Bungalow" style="width: 100%; height: 100%; object-fit: cover;" />
          <span style="position: absolute; top: 10px; left: 10px; background: rgba(15, 23, 42, 0.85); color: #FFFFFF; font-size: 10px; font-weight: 700; padding: 4px 10px; border-radius: 9999px;">For Sale</span>
        </div>
        <div style="padding: 16px;">
          <div style="font-size: 18px; font-weight: 800; color: #0F172A; margin-bottom: 4px;">$790,000</div>
          <div style="font-size: 14px; font-weight: 700; color: #1E293B; margin-bottom: 6px;">Beachside Bungalow</div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 12px;"><i class="fa-solid fa-location-dot" style="color: #CA8A04;"></i> San Diego, CA</div>
          <div style="display: flex; justify-content: space-between; padding-top: 10px; border-top: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">
            <span><i class="fa-solid fa-bed"></i> 3 Beds</span>
            <span><i class="fa-solid fa-bath"></i> 2 Baths</span>
            <span><i class="fa-solid fa-ruler-combined"></i> 1,950 sqft</span>
          </div>
        </div>
      </div>

    </div>

  </div>
</section>
    `.trim(),
  },

  createRealEstateFooter(),
];

// =============================================================
// 3. ABOUT PAGE (INNER PAGE)
// =============================================================

export const RE_ABOUT_SECTIONS: PageSection[] = [
  createRealEstateNavbar("about"),

  // About Header Banner
  {
    id: "sec-re-about-banner",
    templateId: "",
    name: "About Page Banner",
    html: `
<section style="background-color: #0A0F1D; color: #FFFFFF; padding: 60px 24px; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 800px; margin: 0 auto;">
    <div style="font-size: 11px; font-weight: 800; color: #FACC15; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 10px;">OUR STORY & VALUES</div>
    <h1 style="font-size: 40px; font-weight: 800; margin: 0 0 14px; letter-spacing: -0.02em;">About DreamHome Real Estate</h1>
    <p style="font-size: 15px; color: #94A3B8; line-height: 1.6; margin: 0;">
      A heritage of excellence, market integrity, and dedicated client service delivering premier residential and commercial properties.
    </p>
  </div>
</section>
    `.trim(),
  },

  // Our Story
  {
    id: "sec-re-about-story",
    templateId: "",
    name: "Our Story",
    html: `
<section style="background-color: #FFFFFF; padding: 70px 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1fr; gap: 50px; align-items: center;">
    <div>
      <div style="font-size: 11px; font-weight: 800; color: #CA8A04; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 8px;">SINCE 2015</div>
      <h2 style="font-size: 32px; font-weight: 800; color: #0F172A; line-height: 1.2; margin: 0 0 16px;">Building Lifelong Relationships, One Home at a Time</h2>
      <p style="font-size: 14px; line-height: 1.7; color: #64748B; margin: 0 0 16px;">
        DreamHome was founded with a singular conviction: real estate transactions should be transparent, rewarding, and empowering. Over the last decade, we have grown into one of the country's most respected boutique real estate agencies.
      </p>
      <p style="font-size: 14px; line-height: 1.7; color: #64748B; margin: 0 0 24px;">
        Whether representing an architect-designed modern villa or a penthouse in the heart of the city, our agents combine local market intelligence with sophisticated global marketing to achieve superior results.
      </p>
      <div style="display: flex; gap: 30px;">
        <div>
          <div style="font-size: 28px; font-weight: 800; color: #0F172A;">$850M+</div>
          <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Total Sales Volume</div>
        </div>
        <div>
          <div style="font-size: 28px; font-weight: 800; color: #0F172A;">99.4%</div>
          <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Client Satisfaction</div>
        </div>
        <div>
          <div style="font-size: 28px; font-weight: 800; color: #0F172A;">15+</div>
          <div style="font-size: 12px; color: #64748B; margin-top: 2px;">Industry Awards</div>
        </div>
      </div>
    </div>
    <div style="border-radius: 14px; overflow: hidden; height: 420px; box-shadow: 0 15px 30px rgba(0,0,0,0.08);">
      <img src="${REALESTATE_ASSETS.aboutStory}" alt="DreamHome Office" style="width: 100%; height: 100%; object-fit: cover;" />
    </div>
  </div>
</section>
    `.trim(),
  },

  // Leadership Team
  {
    id: "sec-re-about-team",
    templateId: "",
    name: "Our Leadership & Agents",
    html: `
<section style="background-color: #F8FAFC; padding: 70px 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto;">
    <div style="text-align: center; margin-bottom: 40px;">
      <div style="font-size: 11px; font-weight: 800; color: #CA8A04; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px;">EXPERT TEAM</div>
      <h2 style="font-size: 28px; font-weight: 800; color: #0F172A; margin: 0;">Meet Our Top Real Estate Advisors</h2>
    </div>

    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 20px;">
      
      <!-- Agent 1 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; text-align: center; padding-bottom: 18px;">
        <div style="height: 220px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.agentDavid}" alt="David Vance" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 16px 14px 0;">
          <div style="font-size: 16px; font-weight: 800; color: #0F172A;">David Vance</div>
          <div style="font-size: 12px; color: #CA8A04; font-weight: 600; margin-top: 2px;">Principal Broker & Founder</div>
          <div style="font-size: 11px; color: #64748B; margin-top: 8px;">+1 (555) 234-5678</div>
        </div>
      </div>

      <!-- Agent 2 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; text-align: center; padding-bottom: 18px;">
        <div style="height: 220px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.agentSophia}" alt="Sophia Martinez" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 16px 14px 0;">
          <div style="font-size: 16px; font-weight: 800; color: #0F172A;">Sophia Martinez</div>
          <div style="font-size: 12px; color: #CA8A04; font-weight: 600; margin-top: 2px;">Luxury Residential Specialist</div>
          <div style="font-size: 11px; color: #64748B; margin-top: 8px;">+1 (555) 345-6789</div>
        </div>
      </div>

      <!-- Agent 3 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; text-align: center; padding-bottom: 18px;">
        <div style="height: 220px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.agentRobert}" alt="Robert Chen" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 16px 14px 0;">
          <div style="font-size: 16px; font-weight: 800; color: #0F172A;">Robert Chen</div>
          <div style="font-size: 12px; color: #CA8A04; font-weight: 600; margin-top: 2px;">Investment & Commercial Director</div>
          <div style="font-size: 11px; color: #64748B; margin-top: 8px;">+1 (555) 456-7890</div>
        </div>
      </div>

      <!-- Agent 4 -->
      <div style="background: #FFFFFF; border-radius: 12px; overflow: hidden; border: 1px solid #E2E8F0; text-align: center; padding-bottom: 18px;">
        <div style="height: 220px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.agentOlivia}" alt="Olivia Taylor" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 16px 14px 0;">
          <div style="font-size: 16px; font-weight: 800; color: #0F172A;">Olivia Taylor</div>
          <div style="font-size: 12px; color: #CA8A04; font-weight: 600; margin-top: 2px;">Head of Client Relations</div>
          <div style="font-size: 11px; color: #64748B; margin-top: 8px;">+1 (555) 567-8901</div>
        </div>
      </div>

    </div>
  </div>
</section>
    `.trim(),
  },

  createRealEstateFooter(),
];

// =============================================================
// 4. SERVICES PAGE (INNER PAGE)
// =============================================================

export const RE_SERVICES_SECTIONS: PageSection[] = [
  createRealEstateNavbar("services"),

  // Services Banner
  {
    id: "sec-re-serv-banner",
    templateId: "",
    name: "Services Banner",
    html: `
<section style="background-color: #0A0F1D; color: #FFFFFF; padding: 60px 24px; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 800px; margin: 0 auto;">
    <div style="font-size: 11px; font-weight: 800; color: #FACC15; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 10px;">WHAT WE DO</div>
    <h1 style="font-size: 40px; font-weight: 800; margin: 0 0 14px; letter-spacing: -0.02em;">Comprehensive Real Estate Services</h1>
    <p style="font-size: 15px; color: #94A3B8; line-height: 1.6; margin: 0;">
      Tailored guidance and data-driven strategy for homeowners, buyers, and investors at every stage of their property journey.
    </p>
  </div>
</section>
    `.trim(),
  },

  // 6 Services Detailed Grid
  {
    id: "sec-re-serv-grid",
    templateId: "",
    name: "Services Detailed Grid",
    html: `
<section style="background-color: #FFFFFF; padding: 70px 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto;">
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
      
      <!-- Service 1 -->
      <div style="border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px 24px; background: #FFFFFF; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 20px; margin-bottom: 16px;">
          <i class="fa-solid fa-house-circle-check"></i>
        </div>
        <h3 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px;">Property Acquisition</h3>
        <p style="font-size: 13px; line-height: 1.7; color: #64748B; margin: 0 0 14px;">
          Exclusive access to private off-market listings, customized property curation, expert contract negotiation, and smooth closing assistance.
        </p>
        <a href="contact.html" style="font-size: 12px; font-weight: 700; color: #CA8A04; text-decoration: none;">Learn more →</a>
      </div>

      <!-- Service 2 -->
      <div style="border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px 24px; background: #FFFFFF; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 20px; margin-bottom: 16px;">
          <i class="fa-solid fa-bullhorn"></i>
        </div>
        <h3 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px;">Premium Property Marketing</h3>
        <p style="font-size: 13px; line-height: 1.7; color: #64748B; margin: 0 0 14px;">
          High-end architectural photography, 4K immersive video tours, virtual staging, and targeted digital distribution across high-net-worth channels.
        </p>
        <a href="contact.html" style="font-size: 12px; font-weight: 700; color: #CA8A04; text-decoration: none;">Learn more →</a>
      </div>

      <!-- Service 3 -->
      <div style="border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px 24px; background: #FFFFFF; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 20px; margin-bottom: 16px;">
          <i class="fa-solid fa-chart-line"></i>
        </div>
        <h3 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px;">Investment Advisory</h3>
        <p style="font-size: 13px; line-height: 1.7; color: #64748B; margin: 0 0 14px;">
          Data-backed capitalization rates, neighborhood appreciation modeling, and 1031 tax-deferred exchange structuring for property portfolios.
        </p>
        <a href="contact.html" style="font-size: 12px; font-weight: 700; color: #CA8A04; text-decoration: none;">Learn more →</a>
      </div>

      <!-- Service 4 -->
      <div style="border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px 24px; background: #FFFFFF; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 20px; margin-bottom: 16px;">
          <i class="fa-solid fa-key"></i>
        </div>
        <h3 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px;">Luxury Rental Placement</h3>
        <p style="font-size: 13px; line-height: 1.7; color: #64748B; margin: 0 0 14px;">
          Strict tenant vetting, bespoke lease agreements, and concierge handover service for luxury homeowners and corporate executives.
        </p>
        <a href="contact.html" style="font-size: 12px; font-weight: 700; color: #CA8A04; text-decoration: none;">Learn more →</a>
      </div>

      <!-- Service 5 -->
      <div style="border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px 24px; background: #FFFFFF; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 20px; margin-bottom: 16px;">
          <i class="fa-solid fa-clipboard-check"></i>
        </div>
        <h3 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px;">Property Valuation</h3>
        <p style="font-size: 13px; line-height: 1.7; color: #64748B; margin: 0 0 14px;">
          Complimentary, accurate Comparative Market Analysis (CMA) based on real-time comps, historical trends, and premium home features.
        </p>
        <a href="contact.html" style="font-size: 12px; font-weight: 700; color: #CA8A04; text-decoration: none;">Learn more →</a>
      </div>

      <!-- Service 6 -->
      <div style="border: 1px solid #E2E8F0; border-radius: 12px; padding: 32px 24px; background: #FFFFFF; box-shadow: 0 4px 15px rgba(0,0,0,0.02);">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 20px; margin-bottom: 16px;">
          <i class="fa-solid fa-building-user"></i>
        </div>
        <h3 style="font-size: 18px; font-weight: 800; color: #0F172A; margin: 0 0 10px;">Asset & Facility Management</h3>
        <p style="font-size: 13px; line-height: 1.7; color: #64748B; margin: 0 0 14px;">
          Complete turnkey oversight: preventive maintenance, prompt rent collection, financial reporting, and 24/7 emergency response.
        </p>
        <a href="contact.html" style="font-size: 12px; font-weight: 700; color: #CA8A04; text-decoration: none;">Learn more →</a>
      </div>

    </div>

  </div>
</section>
    `.trim(),
  },

  createRealEstateFooter(),
];

// =============================================================
// 5. BLOG PAGE (INNER PAGE)
// =============================================================

export const RE_BLOG_SECTIONS: PageSection[] = [
  createRealEstateNavbar("blog"),

  // Blog Banner
  {
    id: "sec-re-blog-banner",
    templateId: "",
    name: "Blog Banner",
    html: `
<section style="background-color: #0A0F1D; color: #FFFFFF; padding: 60px 24px; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 800px; margin: 0 auto;">
    <div style="font-size: 11px; font-weight: 800; color: #FACC15; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 10px;">MARKET INTELLIGENCE</div>
    <h1 style="font-size: 40px; font-weight: 800; margin: 0 0 14px; letter-spacing: -0.02em;">Real Estate News & Insights</h1>
    <p style="font-size: 15px; color: #94A3B8; line-height: 1.6; margin: 0;">
      Expert advice, housing market trends, architectural inspiration, and investment guides from our seasoned brokers.
    </p>
  </div>
</section>
    `.trim(),
  },

  // 6 Blog Grid
  {
    id: "sec-re-blog-grid",
    templateId: "",
    name: "Blog Grid",
    html: `
<section style="background-color: #FFFFFF; padding: 70px 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto;">
    
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px;">
      
      <!-- Article 1 -->
      <article style="border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; background: #FFFFFF; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="height: 180px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.blogNeighborhood}" alt="Neighborhood Tips" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 20px;">
          <div style="font-size: 11px; font-weight: 700; color: #CA8A04; text-transform: uppercase; margin-bottom: 6px;">Buying Guide</div>
          <h3 style="font-size: 16px; font-weight: 800; color: #0F172A; line-height: 1.35; margin: 0 0 8px;">
            5 Tips to Choose the Right Neighborhood for Your Family
          </h3>
          <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0 0 16px;">
            Discover the crucial factors beyond property price: school districts, transit accessibility, and lifestyle amenities.
          </p>
          <div style="font-size: 11px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 10px;">
            May 12, 2025 • 4 min read
          </div>
        </div>
      </article>

      <!-- Article 2 -->
      <article style="border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; background: #FFFFFF; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="height: 180px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.blogHomeValue}" alt="Home Value" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 20px;">
          <div style="font-size: 11px; font-weight: 700; color: #CA8A04; text-transform: uppercase; margin-bottom: 6px;">Selling Advice</div>
          <h3 style="font-size: 16px; font-weight: 800; color: #0F172A; line-height: 1.35; margin: 0 0 8px;">
            How to Increase Your Home's Value Before Selling
          </h3>
          <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0 0 16px;">
            Cost-effective kitchen upgrades, professional landscaping, and minor touch-ups that yield maximum ROI on sale.
          </p>
          <div style="font-size: 11px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 10px;">
            May 8, 2025 • 6 min read
          </div>
        </div>
      </article>

      <!-- Article 3 -->
      <article style="border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; background: #FFFFFF; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="height: 180px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.blogMarket}" alt="Real Estate Market" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 20px;">
          <div style="font-size: 11px; font-weight: 700; color: #CA8A04; text-transform: uppercase; margin-bottom: 6px;">Market Trends</div>
          <h3 style="font-size: 16px; font-weight: 800; color: #0F172A; line-height: 1.35; margin: 0 0 8px;">
            Is Now a Good Time to Buy Real Estate?
          </h3>
          <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0 0 16px;">
            An in-depth macroeconomic analysis of mortgage rate trends, inventory shifts, and regional buyer leverage.
          </p>
          <div style="font-size: 11px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 10px;">
            May 5, 2025 • 5 min read
          </div>
        </div>
      </article>

      <!-- Article 4 -->
      <article style="border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; background: #FFFFFF; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="height: 180px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.blogAgent}" alt="Working with Agent" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 20px;">
          <div style="font-size: 11px; font-weight: 700; color: #CA8A04; text-transform: uppercase; margin-bottom: 6px;">Advisory</div>
          <h3 style="font-size: 16px; font-weight: 800; color: #0F172A; line-height: 1.35; margin: 0 0 8px;">
            The Benefits of Working with a Licensed Realtor
          </h3>
          <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0 0 16px;">
            Why having experienced representation protects your financial interests and simplifies complex paperwork.
          </p>
          <div style="font-size: 11px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 10px;">
            May 2, 2025 • 4 min read
          </div>
        </div>
      </article>

      <!-- Article 5 -->
      <article style="border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; background: #FFFFFF; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="height: 180px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.home6Penthouse}" alt="Penthouse Staging" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 20px;">
          <div style="font-size: 11px; font-weight: 700; color: #CA8A04; text-transform: uppercase; margin-bottom: 6px;">Interior Design</div>
          <h3 style="font-size: 16px; font-weight: 800; color: #0F172A; line-height: 1.35; margin: 0 0 8px;">
            Top Architectural Trends for Modern Luxury Homes
          </h3>
          <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0 0 16px;">
            From indoor-outdoor living spaces to sustainable building materials, explore features modern buyers covet most.
          </p>
          <div style="font-size: 11px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 10px;">
            April 28, 2025 • 5 min read
          </div>
        </div>
      </article>

      <!-- Article 6 -->
      <article style="border: 1px solid #E2E8F0; border-radius: 12px; overflow: hidden; background: #FFFFFF; box-shadow: 0 4px 15px rgba(0,0,0,0.03);">
        <div style="height: 180px; overflow: hidden;">
          <img src="${REALESTATE_ASSETS.home3PoolVilla}" alt="Villa Investment" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 20px;">
          <div style="font-size: 11px; font-weight: 700; color: #CA8A04; text-transform: uppercase; margin-bottom: 6px;">Investment Strategy</div>
          <h3 style="font-size: 16px; font-weight: 800; color: #0F172A; line-height: 1.35; margin: 0 0 8px;">
            Maximizing Rental Yields on Coastal Vacation Properties
          </h3>
          <p style="font-size: 13px; line-height: 1.6; color: #64748B; margin: 0 0 16px;">
            How to structure short-term rental operations, seasonal pricing models, and luxury concierge services for peak returns.
          </p>
          <div style="font-size: 11px; color: #94A3B8; border-top: 1px solid #F1F5F9; padding-top: 10px;">
            April 22, 2025 • 7 min read
          </div>
        </div>
      </article>

    </div>

  </div>
</section>
    `.trim(),
  },

  createRealEstateFooter(),
];

// =============================================================
// 6. CONTACT PAGE (INNER PAGE)
// =============================================================

export const RE_CONTACT_SECTIONS: PageSection[] = [
  createRealEstateNavbar("contact"),

  // Contact Banner
  {
    id: "sec-re-cont-banner",
    templateId: "",
    name: "Contact Banner",
    html: `
<section style="background-color: #0A0F1D; color: #FFFFFF; padding: 60px 24px; text-align: center; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 800px; margin: 0 auto;">
    <div style="font-size: 11px; font-weight: 800; color: #FACC15; letter-spacing: 0.16em; text-transform: uppercase; margin-bottom: 10px;">GET IN TOUCH</div>
    <h1 style="font-size: 40px; font-weight: 800; margin: 0 0 14px; letter-spacing: -0.02em;">We'd Love to Hear From You</h1>
    <p style="font-size: 15px; color: #94A3B8; line-height: 1.6; margin: 0;">
      Schedule a private tour, request a property valuation, or ask our team about exclusive off-market listings.
    </p>
  </div>
</section>
    `.trim(),
  },

  // Contact Info Strip & Form
  {
    id: "sec-re-cont-form",
    templateId: "",
    name: "Contact Info & Form",
    html: `
<section style="background-color: #FFFFFF; padding: 70px 24px; font-family: 'Plus Jakarta Sans', sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1fr 1.2fr; gap: 50px;">
    
    <!-- Left: Contact Details -->
    <div>
      <div style="font-size: 11px; font-weight: 800; color: #CA8A04; letter-spacing: 0.14em; text-transform: uppercase; margin-bottom: 6px;">HEADQUARTERS</div>
      <h2 style="font-size: 28px; font-weight: 800; color: #0F172A; margin: 0 0 20px;">Visit Our Office</h2>
      <p style="font-size: 14px; line-height: 1.7; color: #64748B; margin: 0 0 30px;">
        Our flagship office in Manhattan is open for scheduled consultations, private viewings, and real estate portfolio reviews.
      </p>

      <div style="display: flex; flex-direction: column; gap: 20px;">
        
        <div style="display: flex; align-items: flex-start; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 18px; shrink: 0;">
            <i class="fa-solid fa-location-dot"></i>
          </div>
          <div>
            <div style="font-size: 14px; font-weight: 700; color: #0F172A;">Office Address</div>
            <div style="font-size: 13px; color: #64748B; margin-top: 2px;">123 Real Estate Ave, Suite 500, New York, NY 10001</div>
          </div>
        </div>

        <div style="display: flex; align-items: flex-start; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 18px; shrink: 0;">
            <i class="fa-solid fa-phone"></i>
          </div>
          <div>
            <div style="font-size: 14px; font-weight: 700; color: #0F172A;">Direct Phone Line</div>
            <div style="font-size: 13px; color: #64748B; margin-top: 2px;">+1 (555) 123-4567 (Mon-Sat, 9am - 7pm)</div>
          </div>
        </div>

        <div style="display: flex; align-items: flex-start; gap: 14px;">
          <div style="width: 44px; height: 44px; border-radius: 10px; background: rgba(250, 204, 21, 0.15); display: flex; align-items: center; justify-content: center; color: #CA8A04; font-size: 18px; shrink: 0;">
            <i class="fa-solid fa-envelope"></i>
          </div>
          <div>
            <div style="font-size: 14px; font-weight: 700; color: #0F172A;">Email Address</div>
            <div style="font-size: 13px; color: #64748B; margin-top: 2px;">contact@dreamhome.com</div>
          </div>
        </div>

      </div>
    </div>

    <!-- Right: Send Message Form -->
    <div style="background: #F8FAFC; border: 1px solid #E2E8F0; border-radius: 14px; padding: 36px 30px;">
      <h3 style="font-size: 20px; font-weight: 800; color: #0F172A; margin: 0 0 6px;">Send Us a Message</h3>
      <p style="font-size: 13px; color: #64748B; margin: 0 0 24px;">Fill in the details below and an agent will reach out within 2 hours.</p>

      <form onsubmit="event.preventDefault(); alert('Message sent successfully! We will contact you shortly.');" style="display: flex; flex-direction: column; gap: 16px;">
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">Full Name *</label>
            <input type="text" required placeholder="John Doe" style="width: 100%; box-sizing: border-box; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #0F172A; outline: none;" />
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">Email Address *</label>
            <input type="email" required placeholder="johndoe@gmail.com" style="width: 100%; box-sizing: border-box; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #0F172A; outline: none;" />
          </div>
        </div>

        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">Phone Number</label>
            <input type="tel" placeholder="+1 (555) 000-0000" style="width: 100%; box-sizing: border-box; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #0F172A; outline: none;" />
          </div>
          <div>
            <label style="font-size: 12px; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">I am interested in</label>
            <select style="width: 100%; box-sizing: border-box; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #0F172A; outline: none;">
              <option>Buying a Property</option>
              <option>Selling a Property</option>
              <option>Renting a Property</option>
              <option>Property Management</option>
              <option>Commercial Investment</option>
            </select>
          </div>
        </div>

        <div>
          <label style="font-size: 12px; font-weight: 700; color: #334155; display: block; margin-bottom: 6px;">Your Message *</label>
          <textarea required rows={4} placeholder="Describe the property type, budget, or preferred location..." style="width: 100%; box-sizing: border-box; background: #FFFFFF; border: 1px solid #CBD5E1; border-radius: 8px; padding: 10px 14px; font-size: 13px; color: #0F172A; outline: none; font-family: inherit; resize: vertical;"></textarea>
        </div>

        <button type="submit" style="background-color: #FACC15; color: #0F172A; font-weight: 700; font-size: 14px; border: none; padding: 12px 24px; border-radius: 8px; cursor: pointer; display: inline-flex; align-items: center; justify-content: center; gap: 8px; transition: background 0.15s ease;">
          <span>Submit Inquiry</span>
          <i class="fa-solid fa-paper-plane" style="font-size: 12px;"></i>
        </button>
      </form>
    </div>

  </div>
</section>
    `.trim(),
  },

  createRealEstateFooter(),
];

// =============================================================
// PREBUILT PAGES DEFINITIONS
// =============================================================

export const RE_HOME_PAGE: Page = {
  id: "page-re-home",
  name: "Home",
  slug: "home",
  sections: RE_HOME_SECTIONS,
  useGlobalHeader: false,
  useGlobalFooter: false,
  hideHeader: false,
  hideFooter: false,
};

export const RE_PROPERTIES_PAGE: Page = {
  id: "page-re-properties",
  name: "Properties",
  slug: "properties",
  sections: RE_PROPERTIES_SECTIONS,
  useGlobalHeader: false,
  useGlobalFooter: false,
  hideHeader: false,
  hideFooter: false,
};

export const RE_ABOUT_PAGE: Page = {
  id: "page-re-about",
  name: "About",
  slug: "about",
  sections: RE_ABOUT_SECTIONS,
  useGlobalHeader: false,
  useGlobalFooter: false,
  hideHeader: false,
  hideFooter: false,
};

export const RE_SERVICES_PAGE: Page = {
  id: "page-re-services",
  name: "Services",
  slug: "services",
  sections: RE_SERVICES_SECTIONS,
  useGlobalHeader: false,
  useGlobalFooter: false,
  hideHeader: false,
  hideFooter: false,
};

export const RE_BLOG_PAGE: Page = {
  id: "page-re-blog",
  name: "Blog",
  slug: "blog",
  sections: RE_BLOG_SECTIONS,
  useGlobalHeader: false,
  useGlobalFooter: false,
  hideHeader: false,
  hideFooter: false,
};

export const RE_CONTACT_PAGE: Page = {
  id: "page-re-contact",
  name: "Contact",
  slug: "contact",
  sections: RE_CONTACT_SECTIONS,
  useGlobalHeader: false,
  useGlobalFooter: false,
  hideHeader: false,
  hideFooter: false,
};

export const RE_PAGES: Page[] = [
  RE_HOME_PAGE,
  RE_PROPERTIES_PAGE,
  RE_ABOUT_PAGE,
  RE_SERVICES_PAGE,
  RE_BLOG_PAGE,
  RE_CONTACT_PAGE,
];

// =============================================================
// PREBUILT TEMPLATE OBJECT
// =============================================================

export const REAL_ESTATE_TEMPLATE: Template = {
  id: "tpl-dreamhome-real-estate",
  name: "DreamHome - Luxury Real Estate",
  slug: "dreamhome-luxury-real-estate",
  category: "Real Estate",
  status: "published",
  thumbnail: REALESTATE_ASSETS.heroVilla,
  widgets: [],
  pages: RE_PAGES,
  createdBy: "super-admin",
  createdAt: new Date("2026-01-01T00:00:00Z"),
  updatedAt: new Date("2026-01-01T00:00:00Z"),
};
