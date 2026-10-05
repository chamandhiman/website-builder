import type { Page, PageSection } from "@/lib/builder/store";
import type { Template } from "./templates";
import { nanoid } from "nanoid";

// -------------------------------------------------------------
// CURATED ASSETS MATCHING THE REFERENCE DESIGN
// -------------------------------------------------------------
export const ASSETS = {
  heroDeveloper: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
  aboutDeveloper: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
  workBusiness: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
  workEcommerce: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80",
  workDashboard: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
  blogTrends: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
  blogTechStack: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
  blogCareer: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=800&q=80",
  avatarSarah: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  avatarMichael: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  avatarEmily: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80",
};

// =============================================================
// 100% MATCH CUSTOM HTML SECTIONS FOR THE FREELANCER TEMPLATE
// =============================================================

export const FREELANCER_SECTIONS: PageSection[] = [
  // -----------------------------------------------------------
  // 1. NAVBAR
  // -----------------------------------------------------------
  {
    id: "sec-freelancer-navbar",
    templateId: "",
    name: "Header Navigation",
    html: `
<header style="background-color: #0B0C10; border-bottom: 1px solid #1E222D; position: sticky; top: 0; z-index: 100; width: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto; padding: 18px 24px; display: flex; align-items: center; justify-content: space-between;">
    <a href="#home" style="display: flex; align-items: center; gap: 8px; text-decoration: none; color: #FFFFFF; font-size: 20px; font-weight: 800; letter-spacing: -0.02em;">
      <span style="color: #FACC15; font-size: 22px; line-height: 1;">⚡</span>
      <span>Freelancer</span>
    </a>
    
    <nav style="display: flex; align-items: center; gap: 28px;">
      <a href="#home" style="color: #FFFFFF; text-decoration: none; font-size: 14px; font-weight: 500;">Home</a>
      <a href="#about" style="color: #94A3B8; text-decoration: none; font-size: 14px; font-weight: 500;">About</a>
      <a href="#services" style="color: #94A3B8; text-decoration: none; font-size: 14px; font-weight: 500;">Services</a>
      <a href="#portfolio" style="color: #94A3B8; text-decoration: none; font-size: 14px; font-weight: 500;">Portfolio</a>
      <a href="#pricing" style="color: #94A3B8; text-decoration: none; font-size: 14px; font-weight: 500;">Pricing</a>
      <a href="#testimonials" style="color: #94A3B8; text-decoration: none; font-size: 14px; font-weight: 500;">Testimonials</a>
      <a href="#blog" style="color: #94A3B8; text-decoration: none; font-size: 14px; font-weight: 500;">Blog</a>
      <a href="#contact" style="color: #94A3B8; text-decoration: none; font-size: 14px; font-weight: 500;">Contact</a>
    </nav>

    <a href="#contact" style="background-color: #FACC15; color: #0B0C10; text-decoration: none; font-size: 14px; font-weight: 700; padding: 10px 24px; border-radius: 9999px; transition: transform 0.15s ease, background-color 0.15s ease; display: inline-block;">
      Hire Me
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
    id: "sec-freelancer-hero",
    templateId: "",
    name: "Hero Section",
    html: `
<section id="home" style="background-color: #0B0C10; color: #FFFFFF; padding: 80px 24px 100px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; overflow: hidden; position: relative;">
  <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center;">
    
    <!-- Left Column: Copy & CTAs -->
    <div>
      <div style="display: inline-flex; align-items: center; gap: 8px; padding: 6px 14px; background: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.3); border-radius: 9999px; font-size: 12px; font-weight: 700; color: #FACC15; letter-spacing: 0.08em; text-transform: uppercase;">
        HELLO, I'M
      </div>

      <h1 style="font-size: 54px; font-weight: 800; line-height: 1.15; letter-spacing: -0.03em; margin: 24px 0 16px; color: #FFFFFF;">
        <span>Creative Freelancer</span><br />
        <span>Building </span><span style="color: #FACC15;">Digital Experiences</span>
      </h1>

      <p style="font-size: 16px; line-height: 1.6; color: #94A3B8; max-width: 520px; margin: 0 0 36px;">
        I'm a passionate web developer & designer with a focus on creating modern, responsive and user-friendly websites that help businesses grow.
      </p>

      <div style="display: flex; align-items: center; gap: 16px; margin-bottom: 48px;">
        <a href="#contact" style="background-color: #FACC15; color: #0B0C10; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 30px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 8px;">
          Hire Me <span>→</span>
        </a>
        <a href="#portfolio" style="background: transparent; color: #FFFFFF; text-decoration: none; font-size: 15px; font-weight: 600; padding: 13px 28px; border-radius: 9999px; border: 1px solid #334155; display: inline-block;">
          View My Work
        </a>
      </div>

      <!-- Stats Bar -->
      <div style="display: flex; align-items: center; gap: 36px; padding-top: 32px; border-top: 1px solid #1E222D;">
        <div>
          <div style="font-size: 28px; font-weight: 800; color: #FFFFFF;">5+</div>
          <div style="font-size: 13px; color: #94A3B8; margin-top: 2px;">Years Experience</div>
        </div>
        <div style="width: 1px; height: 36px; background-color: #1E222D;"></div>
        <div>
          <div style="font-size: 28px; font-weight: 800; color: #FFFFFF;">50+</div>
          <div style="font-size: 13px; color: #94A3B8; margin-top: 2px;">Projects Completed</div>
        </div>
        <div style="width: 1px; height: 36px; background-color: #1E222D;"></div>
        <div>
          <div style="font-size: 28px; font-weight: 800; color: #FFFFFF;">30+</div>
          <div style="font-size: 13px; color: #94A3B8; margin-top: 2px;">Happy Clients</div>
        </div>
      </div>
    </div>

    <!-- Right Column: Visual with yellow organic shape and doodle -->
    <div style="position: relative; display: flex; justify-content: center; align-items: center;">
      <!-- Yellow organic curved backdrop -->
      <div style="position: absolute; width: 380px; height: 380px; background-color: #FACC15; border-radius: 46% 54% 50% 50% / 55% 45% 55% 45%; z-index: 1; top: 30px; right: 40px;"></div>
      
      <!-- Doodle note top right -->
      <div style="position: absolute; top: -10px; right: 10px; z-index: 10; font-family: 'Caveat', cursive, sans-serif; font-size: 20px; font-weight: 700; color: #FACC15; text-align: center; transform: rotate(-8deg); pointer-events: none;">
        <div>Turning ideas</div>
        <div>into reality</div>
        <div style="font-size: 26px; transform: scaleX(-1) rotate(40deg); margin-top: -6px;">⤷</div>
      </div>

      <!-- Developer Image with laptop -->
      <div style="position: relative; z-index: 2; width: 380px; height: 460px; border-radius: 24px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7); border: 2px solid #1E222D;">
        <img src="${ASSETS.heroDeveloper}" alt="John Doe - Creative Freelancer" style="width: 100%; height: 100%; object-fit: cover; object-position: center top;" />
      </div>
    </div>

  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 3. ABOUT ME SECTION
  // -----------------------------------------------------------
  {
    id: "sec-freelancer-about",
    templateId: "",
    name: "About Me",
    html: `
<section id="about" style="background-color: #0B0C10; color: #FFFFFF; padding: 100px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-top: 1px solid #1E222D;">
  <div style="max-width: 1240px; margin: 0 auto; display: grid; grid-template-columns: 1.15fr 0.85fr; gap: 60px; align-items: center;">
    
    <!-- Left Column: Copy & Details Grid -->
    <div>
      <div style="font-size: 13px; font-weight: 800; color: #FACC15; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 12px;">
        ABOUT ME •
      </div>

      <h2 style="font-size: 42px; font-weight: 800; line-height: 1.2; letter-spacing: -0.02em; margin: 0 0 20px; color: #FFFFFF;">
        <span>Passionate Freelancer</span><br />
        <span>with a Creative </span><span style="color: #FACC15;">Mind</span>
      </h2>

      <p style="font-size: 15px; line-height: 1.7; color: #94A3B8; margin: 0 0 24px;">
        I'm a dedicated freelancer with a passion for creating beautiful and functional websites. I love turning ideas into digital products that make an impact. With a strong focus on detail and a commitment to quality, I help businesses bring their vision to life.
      </p>

      <a href="#contact" style="background-color: #FACC15; color: #0B0C10; text-decoration: none; font-size: 14px; font-weight: 700; padding: 12px 24px; border-radius: 8px; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 36px;">
        Download Resume <span>📥</span>
      </a>

      <!-- 4 Details Cards Grid -->
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
        <!-- Name -->
        <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 14px;">
          <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(250, 204, 21, 0.1); color: #FACC15; display: flex; align-items: center; justify-content: center; font-size: 18px;">👤</div>
          <div>
            <div style="font-size: 12px; color: #94A3B8;">Name</div>
            <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-top: 2px;">John Doe</div>
          </div>
        </div>

        <!-- Email -->
        <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 14px;">
          <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(250, 204, 21, 0.1); color: #FACC15; display: flex; align-items: center; justify-content: center; font-size: 18px;">✉️</div>
          <div>
            <div style="font-size: 12px; color: #94A3B8;">Email</div>
            <div style="font-size: 13px; font-weight: 700; color: #FFFFFF; margin-top: 2px;">johndoe@gmail.com</div>
          </div>
        </div>

        <!-- Location -->
        <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 14px;">
          <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(250, 204, 21, 0.1); color: #FACC15; display: flex; align-items: center; justify-content: center; font-size: 18px;">📍</div>
          <div>
            <div style="font-size: 12px; color: #94A3B8;">Location</div>
            <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-top: 2px;">San Francisco, CA</div>
          </div>
        </div>

        <!-- Experience -->
        <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 12px; padding: 16px 20px; display: flex; align-items: center; gap: 14px;">
          <div style="width: 38px; height: 38px; border-radius: 8px; background: rgba(250, 204, 21, 0.1); color: #FACC15; display: flex; align-items: center; justify-content: center; font-size: 18px;">⭐</div>
          <div>
            <div style="font-size: 12px; color: #94A3B8;">Experience</div>
            <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-top: 2px;">5+ Years</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Column: Developer Photo with Doodle -->
    <div style="position: relative; display: flex; justify-content: center;">
      <!-- Doodle note -->
      <div style="position: absolute; right: -10px; top: 120px; z-index: 10; font-family: 'Caveat', cursive, sans-serif; font-size: 20px; font-weight: 700; color: #FACC15; transform: rotate(12deg); pointer-events: none;">
        Let's<br />work<br />together
      </div>

      <div style="width: 340px; height: 420px; border-radius: 20px; overflow: hidden; border: 2px solid #1E222D; background-color: #141722; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
        <img src="${ASSETS.aboutDeveloper}" alt="John Doe" style="width: 100%; height: 100%; object-fit: cover; object-position: center top;" />
      </div>
    </div>

  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 4. MY SERVICES SECTION
  // -----------------------------------------------------------
  {
    id: "sec-freelancer-services",
    templateId: "",
    name: "My Services",
    html: `
<section id="services" style="background-color: #0B0C10; color: #FFFFFF; padding: 100px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-top: 1px solid #1E222D;">
  <div style="max-width: 1240px; margin: 0 auto;">
    
    <div style="text-align: left; margin-bottom: 48px;">
      <div style="font-size: 13px; font-weight: 800; color: #FACC15; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">
        MY SERVICES •
      </div>
      <h2 style="font-size: 38px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 12px; color: #FFFFFF;">
        What I Can Do For You
      </h2>
      <p style="font-size: 15px; color: #94A3B8; max-width: 600px; margin: 0; line-height: 1.6;">
        I offer a wide range of services to help you build a strong online presence and achieve your goals. Here's what I specialize in:
      </p>
    </div>

    <!-- 6 Services Grid -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
      
      <!-- Card 1: Web Design -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; padding: 32px 28px; transition: border-color 0.2s;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.2); display: flex; align-items: center; justify-content: center; font-size: 22px; color: #FACC15; margin-bottom: 20px;">
          💻
        </div>
        <h3 style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 10px;">Web Design</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #94A3B8; margin: 0;">
          Modern, responsive and visually appealing website designs.
        </p>
      </div>

      <!-- Card 2: Web Development -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; padding: 32px 28px; transition: border-color 0.2s;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.2); display: flex; align-items: center; justify-content: center; font-size: 22px; color: #FACC15; margin-bottom: 20px;">
          &lt;/&gt;
        </div>
        <h3 style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 10px;">Web Development</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #94A3B8; margin: 0;">
          Clean, efficient and scalable web applications.
        </p>
      </div>

      <!-- Card 3: UI/UX Design -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; padding: 32px 28px; transition: border-color 0.2s;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.2); display: flex; align-items: center; justify-content: center; font-size: 22px; color: #FACC15; margin-bottom: 20px;">
          📐
        </div>
        <h3 style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 10px;">UI/UX Design</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #94A3B8; margin: 0;">
          User-centered designs for better engagement.
        </p>
      </div>

      <!-- Card 4: WordPress Development -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; padding: 32px 28px; transition: border-color 0.2s;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.2); display: flex; align-items: center; justify-content: center; font-size: 22px; color: #FACC15; margin-bottom: 20px;">
          🌐
        </div>
        <h3 style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 10px;">WordPress Development</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #94A3B8; margin: 0;">
          Custom WordPress sites, themes and plugins.
        </p>
      </div>

      <!-- Card 5: E-Commerce Solutions -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; padding: 32px 28px; transition: border-color 0.2s;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.2); display: flex; align-items: center; justify-content: center; font-size: 22px; color: #FACC15; margin-bottom: 20px;">
          🛒
        </div>
        <h3 style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 10px;">E-Commerce Solutions</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #94A3B8; margin: 0;">
          Powerful online stores that boost your sales.
        </p>
      </div>

      <!-- Card 6: Website Maintenance -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; padding: 32px 28px; transition: border-color 0.2s;">
        <div style="width: 48px; height: 48px; border-radius: 10px; background: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.2); display: flex; align-items: center; justify-content: center; font-size: 22px; color: #FACC15; margin-bottom: 20px;">
          🛡️
        </div>
        <h3 style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin: 0 0 10px;">Website Maintenance</h3>
        <p style="font-size: 14px; line-height: 1.6; color: #94A3B8; margin: 0;">
          Keep your site secure, updated and running smoothly.
        </p>
      </div>

    </div>
  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 5. MY PORTFOLIO SECTION
  // -----------------------------------------------------------
  {
    id: "sec-freelancer-portfolio",
    templateId: "",
    name: "My Portfolio",
    html: `
<section id="portfolio" style="background-color: #0B0C10; color: #FFFFFF; padding: 100px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-top: 1px solid #1E222D;">
  <div style="max-width: 1240px; margin: 0 auto;">
    
    <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 48px;">
      <div>
        <div style="font-size: 13px; font-weight: 800; color: #FACC15; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">
          MY PORTFOLIO •
        </div>
        <h2 style="font-size: 38px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 12px; color: #FFFFFF;">
          My Latest Work
        </h2>
        <p style="font-size: 15px; color: #94A3B8; max-width: 600px; margin: 0;">
          Here are some of my recent projects. Each one is a unique solution tailored to the client's needs.
        </p>
      </div>

      <a href="#portfolio" style="background-color: #FACC15; color: #0B0C10; text-decoration: none; font-size: 14px; font-weight: 700; padding: 10px 24px; border-radius: 9999px; display: inline-block;">
        View All Projects
      </a>
    </div>

    <!-- 3 Projects Grid -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
      
      <!-- Project 1: Business Website -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; overflow: hidden; transition: transform 0.2s;">
        <div style="height: 220px; overflow: hidden; background-color: #07080C;">
          <img src="${ASSETS.workBusiness}" alt="Business Website" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 20px 24px;">
          <h3 style="font-size: 17px; font-weight: 700; color: #FFFFFF; margin: 0 0 4px;">Business Website</h3>
          <p style="font-size: 13px; color: #94A3B8; margin: 0;">Web Design</p>
        </div>
      </div>

      <!-- Project 2: E-Commerce Platform -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; overflow: hidden; transition: transform 0.2s;">
        <div style="height: 220px; overflow: hidden; background-color: #07080C;">
          <img src="${ASSETS.workEcommerce}" alt="E-Commerce Platform" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 20px 24px;">
          <h3 style="font-size: 17px; font-weight: 700; color: #FFFFFF; margin: 0 0 4px;">E-Commerce Platform</h3>
          <p style="font-size: 13px; color: #94A3B8; margin: 0;">Web Development</p>
        </div>
      </div>

      <!-- Project 3: Dashboard UI -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; overflow: hidden; transition: transform 0.2s;">
        <div style="height: 220px; overflow: hidden; background-color: #07080C;">
          <img src="${ASSETS.workDashboard}" alt="Dashboard UI" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 20px 24px;">
          <h3 style="font-size: 17px; font-weight: 700; color: #FFFFFF; margin: 0 0 4px;">Dashboard UI</h3>
          <p style="font-size: 13px; color: #94A3B8; margin: 0;">UI/UX Design</p>
        </div>
      </div>

    </div>

  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 6. PRICING SECTION
  // -----------------------------------------------------------
  {
    id: "sec-freelancer-pricing",
    templateId: "",
    name: "Simple & Transparent Pricing",
    html: `
<section id="pricing" style="background-color: #0B0C10; color: #FFFFFF; padding: 100px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-top: 1px solid #1E222D;">
  <div style="max-width: 1240px; margin: 0 auto;">
    
    <div style="text-align: left; margin-bottom: 48px;">
      <div style="font-size: 13px; font-weight: 800; color: #FACC15; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">
        PRICING •
      </div>
      <h2 style="font-size: 38px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 12px; color: #FFFFFF;">
        Simple & Transparent Pricing
      </h2>
      <p style="font-size: 15px; color: #94A3B8; max-width: 600px; margin: 0; line-height: 1.6;">
        Choose a plan that fits your needs. All plans include high-quality work, clear communication and on-time delivery.
      </p>
    </div>

    <!-- 3 Pricing Cards Grid -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; align-items: stretch;">
      
      <!-- Basic Plan -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 18px; padding: 36px 32px; display: flex; flex-col; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="font-size: 16px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px;">Basic</div>
          <div style="display: flex; align-items: baseline; gap: 4px; margin-bottom: 24px;">
            <span style="font-size: 40px; font-weight: 800; color: #FFFFFF;">$299</span>
            <span style="font-size: 13px; color: #94A3B8;">/project</span>
          </div>
          
          <ul style="list-style: none; padding: 0; margin: 0 0 32px; display: flex; flex-direction: column; gap: 14px;">
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>1 Page Website</span>
            </li>
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>Responsive Design</span>
            </li>
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>Basic SEO</span>
            </li>
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>3 Revisions</span>
            </li>
          </ul>
        </div>

        <a href="#contact" style="width: 100%; box-sizing: border-box; text-align: center; background: transparent; color: #FFFFFF; border: 1px solid #334155; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; display: block;">
          Get Started
        </a>
      </div>

      <!-- Standard Plan (Most Popular) -->
      <div style="background-color: #141722; border: 2px solid #FACC15; border-radius: 18px; padding: 36px 32px; display: flex; flex-direction: column; justify-content: space-between; position: relative;">
        <!-- Most Popular Pill Badge -->
        <div style="position: absolute; top: -14px; left: 50%; transform: translateX(-50%); background-color: #FACC15; color: #0B0C10; font-size: 11px; font-weight: 800; padding: 4px 14px; border-radius: 9999px; letter-spacing: 0.05em; text-transform: uppercase;">
          Most Popular
        </div>

        <div>
          <div style="font-size: 16px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px;">Standard</div>
          <div style="display: flex; align-items: baseline; gap: 4px; margin-bottom: 24px;">
            <span style="font-size: 40px; font-weight: 800; color: #FFFFFF;">$599</span>
            <span style="font-size: 13px; color: #94A3B8;">/project</span>
          </div>

          <ul style="list-style: none; padding: 0; margin: 0 0 32px; display: flex; flex-direction: column; gap: 14px;">
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>Up to 5 Pages</span>
            </li>
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>Responsive Design</span>
            </li>
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>SEO Optimization</span>
            </li>
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>5 Revisions</span>
            </li>
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>1 Month Support</span>
            </li>
          </ul>
        </div>

        <a href="#contact" style="width: 100%; box-sizing: border-box; text-align: center; background-color: #FACC15; color: #0B0C10; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; text-decoration: none; display: block;">
          Get Started
        </a>
      </div>

      <!-- Premium Plan -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 18px; padding: 36px 32px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="font-size: 16px; font-weight: 700; color: #FFFFFF; margin-bottom: 12px;">Premium</div>
          <div style="display: flex; align-items: baseline; gap: 4px; margin-bottom: 24px;">
            <span style="font-size: 40px; font-weight: 800; color: #FFFFFF;">$999</span>
            <span style="font-size: 13px; color: #94A3B8;">/project</span>
          </div>

          <ul style="list-style: none; padding: 0; margin: 0 0 32px; display: flex; flex-direction: column; gap: 14px;">
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>Custom Website</span>
            </li>
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>E-Commerce Integration</span>
            </li>
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>Advanced SEO</span>
            </li>
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>10 Revisions</span>
            </li>
            <li style="display: flex; align-items: center; gap: 10px; font-size: 14px; color: #E2E8F0;">
              <span style="color: #FACC15; font-weight: bold;">✓</span> <span>3 Months Support</span>
            </li>
          </ul>
        </div>

        <a href="#contact" style="width: 100%; box-sizing: border-box; text-align: center; background: transparent; color: #FFFFFF; border: 1px solid #334155; padding: 12px 20px; border-radius: 8px; font-size: 14px; font-weight: 600; text-decoration: none; display: block;">
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
  // 7. CLIENTS FEEDBACK (TESTIMONIALS)
  // -----------------------------------------------------------
  {
    id: "sec-freelancer-testimonials",
    templateId: "",
    name: "Clients Feedback",
    html: `
<section id="testimonials" style="background-color: #0B0C10; color: #FFFFFF; padding: 100px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-top: 1px solid #1E222D;">
  <div style="max-width: 1240px; margin: 0 auto;">
    
    <div style="text-align: left; margin-bottom: 48px;">
      <div style="font-size: 13px; font-weight: 800; color: #FACC15; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">
        CLIENTS FEEDBACK •
      </div>
      <h2 style="font-size: 38px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 12px; color: #FFFFFF;">
        What My Clients Say
      </h2>
      <p style="font-size: 15px; color: #94A3B8; max-width: 600px; margin: 0; line-height: 1.6;">
        Don't just take my word for it. Here's what some of my clients have to say about working with me.
      </p>
    </div>

    <!-- 3 Testimonials Grid -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
      
      <!-- Review 1 -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; padding: 32px 28px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="color: #FACC15; font-size: 18px; letter-spacing: 2px; margin-bottom: 16px;">★★★★★</div>
          <p style="font-size: 14px; line-height: 1.7; color: #E2E8F0; margin: 0 0 24px;">
            "Amazing work! He delivered exactly what I needed and exceeded my expectations. Highly recommended!"
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${ASSETS.avatarSarah}" alt="Sarah Johnson" style="width: 42px; height: 42px; border-radius: 9999px; object-fit: cover;" />
          <div>
            <div style="font-size: 14px; font-weight: 700; color: #FFFFFF;">Sarah Johnson</div>
            <div style="font-size: 12px; color: #94A3B8;">Business Owner</div>
          </div>
        </div>
      </div>

      <!-- Review 2 -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; padding: 32px 28px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="color: #FACC15; font-size: 18px; letter-spacing: 2px; margin-bottom: 16px;">★★★★★</div>
          <p style="font-size: 14px; line-height: 1.7; color: #E2E8F0; margin: 0 0 24px;">
            "Professional, creative and very easy to work with. I'm extremely happy with the final result."
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${ASSETS.avatarMichael}" alt="Michael Lee" style="width: 42px; height: 42px; border-radius: 9999px; object-fit: cover;" />
          <div>
            <div style="font-size: 14px; font-weight: 700; color: #FFFFFF;">Michael Lee</div>
            <div style="font-size: 12px; color: #94A3B8;">Founder</div>
          </div>
        </div>
      </div>

      <!-- Review 3 -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; padding: 32px 28px; display: flex; flex-direction: column; justify-content: space-between;">
        <div>
          <div style="color: #FACC15; font-size: 18px; letter-spacing: 2px; margin-bottom: 16px;">★★★★★</div>
          <p style="font-size: 14px; line-height: 1.7; color: #E2E8F0; margin: 0 0 24px;">
            "The best freelancer I've worked with. Great communication, attention to detail and on-time delivery."
          </p>
        </div>
        <div style="display: flex; align-items: center; gap: 12px;">
          <img src="${ASSETS.avatarEmily}" alt="Emily Carter" style="width: 42px; height: 42px; border-radius: 9999px; object-fit: cover;" />
          <div>
            <div style="font-size: 14px; font-weight: 700; color: #FFFFFF;">Emily Carter</div>
            <div style="font-size: 12px; color: #94A3B8;">Marketing Manager</div>
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
  // 8. BLOG (LATEST ARTICLES & TIPS)
  // -----------------------------------------------------------
  {
    id: "sec-freelancer-blog",
    templateId: "",
    name: "Latest Articles & Tips",
    html: `
<section id="blog" style="background-color: #0B0C10; color: #FFFFFF; padding: 100px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-top: 1px solid #1E222D;">
  <div style="max-width: 1240px; margin: 0 auto;">
    
    <div style="display: flex; align-items: flex-end; justify-content: space-between; margin-bottom: 48px;">
      <div>
        <div style="font-size: 13px; font-weight: 800; color: #FACC15; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">
          BLOG •
        </div>
        <h2 style="font-size: 38px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 12px; color: #FFFFFF;">
          Latest Articles & Tips
        </h2>
        <p style="font-size: 15px; color: #94A3B8; max-width: 600px; margin: 0;">
          Stay updated with the latest web development tips, design trends and industry insights.
        </p>
      </div>

      <a href="#blog" style="background-color: #FACC15; color: #0B0C10; text-decoration: none; font-size: 14px; font-weight: 700; padding: 10px 24px; border-radius: 9999px; display: inline-block;">
        View All Posts
      </a>
    </div>

    <!-- 3 Blog Posts Grid -->
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px;">
      
      <!-- Post 1 -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column;">
        <div style="height: 190px; overflow: hidden;">
          <img src="${ASSETS.blogTrends}" alt="10 Web Design Trends for 2025" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 24px; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
          <div>
            <div style="font-size: 12px; color: #94A3B8; margin-bottom: 8px;">May 19, 2025</div>
            <h3 style="font-size: 17px; font-weight: 700; color: #FFFFFF; line-height: 1.4; margin: 0 0 10px;">10 Web Design Trends for 2025</h3>
            <p style="font-size: 13px; line-height: 1.6; color: #94A3B8; margin: 0 0 20px;">
              Discover the latest web design trends that will dominate in 2025 and how to use them in your projects.
            </p>
          </div>
          <a href="#blog" style="color: #FACC15; text-decoration: none; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
            Read More <span>→</span>
          </a>
        </div>
      </div>

      <!-- Post 2 -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column;">
        <div style="height: 190px; overflow: hidden;">
          <img src="${ASSETS.blogTechStack}" alt="How to Choose the Right Tech Stack" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 24px; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
          <div>
            <div style="font-size: 12px; color: #94A3B8; margin-bottom: 8px;">May 5, 2025</div>
            <h3 style="font-size: 17px; font-weight: 700; color: #FFFFFF; line-height: 1.4; margin: 0 0 10px;">How to Choose the Right Tech Stack</h3>
            <p style="font-size: 13px; line-height: 1.6; color: #94A3B8; margin: 0 0 20px;">
              Learn how to select the best tech stack for your project based on your goals, budget and timeline.
            </p>
          </div>
          <a href="#blog" style="color: #FACC15; text-decoration: none; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
            Read More <span>→</span>
          </a>
        </div>
      </div>

      <!-- Post 3 -->
      <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 16px; overflow: hidden; display: flex; flex-direction: column;">
        <div style="height: 190px; overflow: hidden;">
          <img src="${ASSETS.blogCareer}" alt="Tips for a Successful Freelance Career" style="width: 100%; height: 100%; object-fit: cover;" />
        </div>
        <div style="padding: 24px; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
          <div>
            <div style="font-size: 12px; color: #94A3B8; margin-bottom: 8px;">Apr 28, 2025</div>
            <h3 style="font-size: 17px; font-weight: 700; color: #FFFFFF; line-height: 1.4; margin: 0 0 10px;">Tips for a Successful Freelance Career</h3>
            <p style="font-size: 13px; line-height: 1.6; color: #94A3B8; margin: 0 0 20px;">
              Essential tips to help you grow your freelance business and get more clients.
            </p>
          </div>
          <a href="#blog" style="color: #FACC15; text-decoration: none; font-size: 13px; font-weight: 700; display: inline-flex; align-items: center; gap: 4px;">
            Read More <span>→</span>
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
  // 9. CTA BANNER (HAVE A PROJECT IN MIND?)
  // -----------------------------------------------------------
  {
    id: "sec-freelancer-cta",
    templateId: "",
    name: "CTA Banner",
    html: `
<section style="background-color: #0B0C10; padding: 60px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 1240px; margin: 0 auto;">
    
    <div style="background-color: #141722; border: 1px solid #1E222D; border-radius: 20px; padding: 60px 50px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-between;">
      
      <!-- Top-left yellow diagonal polygon -->
      <div style="position: absolute; top: 0; left: 0; width: 80px; height: 80px; background-color: #FACC15; clip-path: polygon(0 0, 100% 0, 0 100%);"></div>
      
      <!-- Bottom-right yellow diagonal polygon -->
      <div style="position: absolute; bottom: 0; right: 0; width: 80px; height: 80px; background-color: #FACC15; clip-path: polygon(100% 0, 100% 100%, 0 100%);"></div>

      <!-- Content Left -->
      <div style="position: relative; z-index: 2; max-width: 600px;">
        <div style="font-size: 12px; font-weight: 800; color: #FACC15; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">
          LET'S WORK TOGETHER
        </div>
        <h2 style="font-size: 40px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 12px; color: #FFFFFF;">
          Have a Project in Mind?
        </h2>
        <p style="font-size: 15px; color: #94A3B8; margin: 0 0 28px; line-height: 1.6;">
          I'm available for freelance projects. Let's discuss how I can help bring your ideas to life.
        </p>
        <a href="#contact" style="background-color: #FACC15; color: #0B0C10; text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 32px; border-radius: 9999px; display: inline-flex; align-items: center; gap: 8px;">
          Get in Touch <span>→</span>
        </a>
      </div>

      <!-- Content Right: Handwritten Doodle -->
      <div style="position: relative; z-index: 2; padding-right: 40px; text-align: center;">
        <div style="font-family: 'Caveat', cursive, sans-serif; font-size: 26px; font-weight: 700; color: #FACC15; line-height: 1.3; transform: rotate(-6deg);">
          <div>Your idea +</div>
          <div>My skills =</div>
          <div>Great results</div>
          <div style="font-size: 32px; transform: rotate(110deg); margin-top: 4px;">⤷</div>
        </div>
      </div>

    </div>

  </div>
</section>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },

  // -----------------------------------------------------------
  // 10. GET IN TOUCH (CONTACT)
  // -----------------------------------------------------------
  {
    id: "sec-freelancer-contact",
    templateId: "",
    name: "Get In Touch",
    html: `
<section id="contact" style="background-color: #0B0C10; color: #FFFFFF; padding: 100px 24px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-top: 1px solid #1E222D;">
  <div style="max-width: 1240px; margin: 0 auto;">
    
    <div style="text-align: left; margin-bottom: 48px;">
      <div style="font-size: 13px; font-weight: 800; color: #FACC15; letter-spacing: 0.1em; text-transform: uppercase; margin-bottom: 8px;">
        CONTACT •
      </div>
      <h2 style="font-size: 38px; font-weight: 800; letter-spacing: -0.02em; margin: 0 0 12px; color: #FFFFFF;">
        Get In Touch
      </h2>
      <p style="font-size: 15px; color: #94A3B8; max-width: 600px; margin: 0; line-height: 1.6;">
        I'd love to hear from you. Whether you have a project in mind or just want to say hello, feel free to reach out.
      </p>
    </div>

    <!-- Contact Grid -->
    <div style="display: grid; grid-template-columns: 0.9fr 1.1fr; gap: 60px;">
      
      <!-- Left: Contact Details -->
      <div style="display: flex; flex-direction: column; gap: 28px;">
        
        <!-- Email Item -->
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 48px; height: 48px; border-radius: 9999px; background: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.2); display: flex; align-items: center; justify-content: center; font-size: 20px; color: #FACC15;">
            ✉️
          </div>
          <div>
            <div style="font-size: 13px; color: #94A3B8;">Email</div>
            <div style="font-size: 15px; font-weight: 700; color: #FFFFFF; margin-top: 2px;">johndoe@gmail.com</div>
          </div>
        </div>

        <!-- Phone Item -->
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 48px; height: 48px; border-radius: 9999px; background: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.2); display: flex; align-items: center; justify-content: center; font-size: 20px; color: #FACC15;">
            📞
          </div>
          <div>
            <div style="font-size: 13px; color: #94A3B8;">Phone</div>
            <div style="font-size: 15px; font-weight: 700; color: #FFFFFF; margin-top: 2px;">+1 (555) 234-5678</div>
          </div>
        </div>

        <!-- Location Item -->
        <div style="display: flex; align-items: center; gap: 16px;">
          <div style="width: 48px; height: 48px; border-radius: 9999px; background: rgba(250, 204, 21, 0.1); border: 1px solid rgba(250, 204, 21, 0.2); display: flex; align-items: center; justify-content: center; font-size: 20px; color: #FACC15;">
            📍
          </div>
          <div>
            <div style="font-size: 13px; color: #94A3B8;">Location</div>
            <div style="font-size: 15px; font-weight: 700; color: #FFFFFF; margin-top: 2px;">San Francisco, CA</div>
          </div>
        </div>

        <!-- Social Icons Row -->
        <div style="display: flex; align-items: center; gap: 14px; margin-top: 12px;">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" style="width: 40px; height: 40px; border-radius: 9999px; background-color: #141722; border: 1px solid #1E222D; display: flex; align-items: center; justify-content: center; color: #94A3B8; text-decoration: none; font-size: 14px; font-weight: bold;">in</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" style="width: 40px; height: 40px; border-radius: 9999px; background-color: #141722; border: 1px solid #1E222D; display: flex; align-items: center; justify-content: center; color: #94A3B8; text-decoration: none; font-size: 14px; font-weight: bold;">gh</a>
          <a href="https://x.com" target="_blank" rel="noreferrer" style="width: 40px; height: 40px; border-radius: 9999px; background-color: #141722; border: 1px solid #1E222D; display: flex; align-items: center; justify-content: center; color: #94A3B8; text-decoration: none; font-size: 14px; font-weight: bold;">𝕏</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style="width: 40px; height: 40px; border-radius: 9999px; background-color: #141722; border: 1px solid #1E222D; display: flex; align-items: center; justify-content: center; color: #94A3B8; text-decoration: none; font-size: 14px; font-weight: bold;">ig</a>
        </div>

      </div>

      <!-- Right: Contact Form -->
      <div>
        <form onsubmit="event.preventDefault(); alert('Message sent successfully!');" style="display: flex; flex-direction: column; gap: 18px;">
          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #E2E8F0; margin-bottom: 6px;">Name *</label>
            <input type="text" required placeholder="Your name" style="width: 100%; box-sizing: border-box; background-color: #141722; border: 1px solid #1E222D; border-radius: 8px; padding: 12px 16px; color: #FFFFFF; font-size: 14px; outline: none;" />
          </div>

          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #E2E8F0; margin-bottom: 6px;">Email *</label>
            <input type="email" required placeholder="Your email" style="width: 100%; box-sizing: border-box; background-color: #141722; border: 1px solid #1E222D; border-radius: 8px; padding: 12px 16px; color: #FFFFFF; font-size: 14px; outline: none;" />
          </div>

          <div>
            <label style="display: block; font-size: 13px; font-weight: 600; color: #E2E8F0; margin-bottom: 6px;">Message *</label>
            <textarea rows="4" required placeholder="Your message" style="width: 100%; box-sizing: border-box; background-color: #141722; border: 1px solid #1E222D; border-radius: 8px; padding: 12px 16px; color: #FFFFFF; font-size: 14px; outline: none; resize: vertical;"></textarea>
          </div>

          <button type="submit" style="background-color: #FACC15; color: #0B0C10; border: none; font-size: 14px; font-weight: 700; padding: 14px 24px; border-radius: 8px; cursor: pointer; margin-top: 6px;">
            Send Message
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
  // 11. FOOTER
  // -----------------------------------------------------------
  {
    id: "sec-freelancer-footer",
    templateId: "",
    name: "Footer",
    html: `
<footer style="background-color: #07080C; color: #FFFFFF; padding: 80px 24px 36px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; border-top: 1px solid #1E222D;">
  <div style="max-width: 1240px; margin: 0 auto;">
    
    <!-- Top 4 Columns -->
    <div style="display: grid; grid-template-columns: 1.4fr 1fr 1fr 1.3fr; gap: 48px; margin-bottom: 60px;">
      
      <!-- Col 1: Logo & About -->
      <div>
        <div style="display: flex; align-items: center; gap: 8px; font-size: 20px; font-weight: 800; margin-bottom: 16px;">
          <span style="color: #FACC15; font-size: 22px;">⚡</span>
          <span>Freelancer</span>
        </div>
        <p style="font-size: 13px; line-height: 1.7; color: #94A3B8; max-width: 280px; margin: 0 0 20px;">
          Turning ideas into reality with clean code, creative design and a passion for excellence.
        </p>
        <div style="display: flex; align-items: center; gap: 12px;">
          <a href="https://linkedin.com" target="_blank" rel="noreferrer" style="width: 32px; height: 32px; border-radius: 9999px; background-color: #141722; border: 1px solid #1E222D; display: flex; align-items: center; justify-content: center; color: #94A3B8; text-decoration: none; font-size: 12px; font-weight: bold;">in</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" style="width: 32px; height: 32px; border-radius: 9999px; background-color: #141722; border: 1px solid #1E222D; display: flex; align-items: center; justify-content: center; color: #94A3B8; text-decoration: none; font-size: 12px; font-weight: bold;">gh</a>
          <a href="https://x.com" target="_blank" rel="noreferrer" style="width: 32px; height: 32px; border-radius: 9999px; background-color: #141722; border: 1px solid #1E222D; display: flex; align-items: center; justify-content: center; color: #94A3B8; text-decoration: none; font-size: 12px; font-weight: bold;">𝕏</a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer" style="width: 32px; height: 32px; border-radius: 9999px; background-color: #141722; border: 1px solid #1E222D; display: flex; align-items: center; justify-content: center; color: #94A3B8; text-decoration: none; font-size: 12px; font-weight: bold;">ig</a>
        </div>
      </div>

      <!-- Col 2: Quick Links -->
      <div>
        <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-bottom: 16px;">Quick Links</div>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
          <li><a href="#home" style="color: #94A3B8; text-decoration: none; font-size: 13px;">Home</a></li>
          <li><a href="#about" style="color: #94A3B8; text-decoration: none; font-size: 13px;">About</a></li>
          <li><a href="#services" style="color: #94A3B8; text-decoration: none; font-size: 13px;">Services</a></li>
          <li><a href="#portfolio" style="color: #94A3B8; text-decoration: none; font-size: 13px;">Portfolio</a></li>
          <li><a href="#pricing" style="color: #94A3B8; text-decoration: none; font-size: 13px;">Pricing</a></li>
        </ul>
      </div>

      <!-- Col 3: Resources -->
      <div>
        <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-bottom: 16px;">Resources</div>
        <ul style="list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px;">
          <li><a href="#blog" style="color: #94A3B8; text-decoration: none; font-size: 13px;">Blog</a></li>
          <li><a href="#testimonials" style="color: #94A3B8; text-decoration: none; font-size: 13px;">Testimonials</a></li>
          <li><a href="#contact" style="color: #94A3B8; text-decoration: none; font-size: 13px;">Contact</a></li>
          <li><a href="#faq" style="color: #94A3B8; text-decoration: none; font-size: 13px;">FAQ</a></li>
        </ul>
      </div>

      <!-- Col 4: Subscribe to Newsletter -->
      <div>
        <div style="font-size: 14px; font-weight: 700; color: #FFFFFF; margin-bottom: 16px;">Subscribe to Newsletter</div>
        <p style="font-size: 13px; line-height: 1.6; color: #94A3B8; margin: 0 0 16px;">
          Get the latest updates and tips straight to your inbox.
        </p>
        <form onsubmit="event.preventDefault(); alert('Subscribed successfully!');" style="display: flex; flex-direction: column; gap: 10px;">
          <input type="email" required placeholder="Your email address" style="width: 100%; box-sizing: border-box; background-color: #141722; border: 1px solid #1E222D; border-radius: 8px; padding: 10px 14px; color: #FFFFFF; font-size: 13px; outline: none;" />
          <button type="submit" style="background-color: #FACC15; color: #0B0C10; border: none; font-size: 13px; font-weight: 700; padding: 10px 16px; border-radius: 8px; cursor: pointer;">
            Subscribe
          </button>
        </form>
      </div>

    </div>

    <!-- Bottom Row -->
    <div style="padding-top: 28px; border-top: 1px solid #1E222D; display: flex; align-items: center; justify-content: space-between; font-size: 12px; color: #64748B;">
      <div>© 2025 Freelancer. All rights reserved.</div>
      <div style="display: flex; gap: 20px;">
        <a href="#" style="color: #64748B; text-decoration: none;">Privacy Policy</a>
        <a href="#" style="color: #64748B; text-decoration: none;">Terms & Conditions</a>
      </div>
    </div>

  </div>
</footer>
    `.trim(),
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
];

// =============================================================
// FREELANCER PREBUILT PAGE
// =============================================================
export const FREELANCER_PAGE: Page = {
  id: "page-freelancer-preview",
  name: "Template Preview",
  slug: "template-preview",
  sections: FREELANCER_SECTIONS,
  useGlobalHeader: false,
  useGlobalFooter: false,
  hideHeader: false,
  hideFooter: false,
};

import {
  WELLNESS_ASSETS,
  WELLNESS_SECTIONS,
  WELLNESS_PAGE,
  WELLNESS_TEMPLATE,
  WELLNESS_GLOBAL_CSS,
} from "./templateSeedsWellness";

export {
  WELLNESS_ASSETS,
  WELLNESS_SECTIONS,
  WELLNESS_PAGE,
  WELLNESS_TEMPLATE,
  WELLNESS_GLOBAL_CSS,
};

import {
  REALESTATE_ASSETS,
  REALESTATE_GLOBAL_CSS,
  REAL_ESTATE_TEMPLATE,
  RE_PAGES,
  RE_HOME_PAGE,
  RE_PROPERTIES_PAGE,
  RE_ABOUT_PAGE,
  RE_SERVICES_PAGE,
  RE_BLOG_PAGE,
  RE_CONTACT_PAGE,
} from "./templateSeedsRealEstate";

export {
  REALESTATE_ASSETS,
  REALESTATE_GLOBAL_CSS,
  REAL_ESTATE_TEMPLATE,
  RE_PAGES,
  RE_HOME_PAGE,
  RE_PROPERTIES_PAGE,
  RE_ABOUT_PAGE,
  RE_SERVICES_PAGE,
  RE_BLOG_PAGE,
  RE_CONTACT_PAGE,
};

// =============================================================
// PREBUILT TEMPLATES (FREELANCER + WELLNESSLIFE + REAL ESTATE)
// =============================================================
export const PREBUILT_TEMPLATES: Template[] = [
  {
    id: "tpl-freelancer-dark-yellow",
    name: "Freelancer - Creative Portfolio",
    slug: "freelancer-creative-portfolio",
    category: "Freelancer",
    status: "published",
    thumbnail: ASSETS.heroDeveloper,
    widgets: [],
    pages: [FREELANCER_PAGE],
    createdBy: "super-admin",
    createdAt: new Date("2026-01-01T00:00:00Z"),
    updatedAt: new Date("2026-01-01T00:00:00Z"),
  },
  WELLNESS_TEMPLATE,
  REAL_ESTATE_TEMPLATE,
];

