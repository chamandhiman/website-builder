import { SHARED_HEADER_SECTION_ID, SHARED_FOOTER_SECTION_ID, type Page, type PageSection } from "@/lib/builder/store";
import type { Template } from "./templates";
import { DRIVE_PRO_SHARED_HEADER, DRIVE_PRO_SHARED_FOOTER, DRIVE_PRO_ASSETS } from "./templateSeedsDrivingSchool";

/**
 * Prebuilt website templates generated from verified source templates with curated photography.
 * Fully compatible with both HTML download and React download.
 */

// ==========================================
// CloudFlow SaaS (SaaS)
// ==========================================
export const CLOUDFLOW_SAAS_ASSETS = {
  hero: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",

};

export const CLOUDFLOW_SAAS_GLOBAL_CSS = ":root{--primary:#3b82f6;--secondary:#06b6d4;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const CLOUDFLOW_SAAS_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const CLOUDFLOW_SAAS_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const CLOUDFLOW_SAAS_SHARED_HEADER: PageSection = {
  id: "tpl-saas-header",
  templateId: "tpl-saas-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">cloudflow</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#features\">Features</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#pricing\">Pricing</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#about\">About</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const CLOUDFLOW_SAAS_SHARED_FOOTER: PageSection = {
  id: "tpl-saas-footer",
  templateId: "tpl-saas-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">cloudflow</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@cloudflow.com\">info@cloudflow.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 CloudFlow SaaS. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const CLOUDFLOW_SAAS_SECTIONS: PageSection[] = [
  {
    id: "tpl-saas-sec-1",
    templateId: "tpl-saas-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">SaaS Platform</span><h1>The future of cloud management is here.</h1><p class=\"lead\">SaaS Platform - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80\" alt=\"CloudFlow SaaS illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-saas-sec-2",
    templateId: "tpl-saas-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-saas-sec-3",
    templateId: "tpl-saas-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-saas-sec-4",
    templateId: "tpl-saas-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Cloud Hosting</h3><p>Professional cloud hosting services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Analytics</h3><p>Professional analytics services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Security</h3><p>Professional security services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>API Access</h3><p>Professional api access services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Support</h3><p>Professional support services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Integrations</h3><p>Professional integrations services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-saas-sec-5",
    templateId: "tpl-saas-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Real-time Analytics</h4><p>Advanced real-time analytics capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>99.9% Uptime</h4><p>Advanced 99.9% uptime capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>24/7 Support</h4><p>Advanced 24/7 support capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Enterprise Security</h4><p>Advanced enterprise security capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Easy Integration</h4><p>Advanced easy integration capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Scalable Infrastructure</h4><p>Advanced scalable infrastructure capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-saas-sec-6",
    templateId: "tpl-saas-sec-6",
    name: "Pricing Plans",
    html: "<section id=\"pricing\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Pricing</span><h2 class=\"title\">Simple, transparent pricing</h2><p class=\"lead mt-3\" style=\"max-width:550px;margin:auto\">Choose the plan that fits your needs.</p></div><div class=\"row g-4 justify-content-center\"><div class=\"col-md-6 col-lg-4\"><div class=\"pricing-card  reveal\"><h3>Starter</h3><div class=\"price\">$29 <small>/month</small></div><p>Perfect for small teams</p><ul><li>5 Projects</li><li>10GB Storage</li><li>Basic Analytics</li><li>Email Support</li></ul><a href=\"#contact\" class=\"btn btn-outline w-100\">Choose Starter</a></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"pricing-card popular reveal\"><h3>Pro</h3><div class=\"price\">$79 <small>/month</small></div><p>Best for growing businesses</p><ul><li>Unlimited Projects</li><li>100GB Storage</li><li>Advanced Analytics</li><li>Priority Support</li><li>API Access</li></ul><a href=\"#contact\" class=\"btn btn-popular w-100\">Choose Pro</a></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"pricing-card  reveal\"><h3>Enterprise</h3><div class=\"price\">$199 <small>/month</small></div><p>For large organizations</p><ul><li>Everything in Pro</li><li>Unlimited Storage</li><li>Custom Integrations</li><li>Dedicated Manager</li><li>SLA Guarantee</li></ul><a href=\"#contact\" class=\"btn btn-outline w-100\">Choose Enterprise</a></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
  {
    id: "tpl-saas-sec-7",
    templateId: "tpl-saas-sec-7",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@cloudflow.com\">info@cloudflow.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 240 },
  },
];

export const CLOUDFLOW_SAAS_HOME_PAGE: Page = {
  id: "page-saas-home",
  name: "Home",
  slug: "home",
  sections: CLOUDFLOW_SAAS_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const CLOUDFLOW_SAAS_TEMPLATE: Template = {
  id: "tpl-cloudflow-saas",
  name: "CloudFlow SaaS",
  slug: "saas",
  category: "SaaS",
  description: "Modern SaaS platform template with pricing tiers and features",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 2,
  widgets: [],
  pages: [CLOUDFLOW_SAAS_HOME_PAGE],
  sharedHeader: CLOUDFLOW_SAAS_SHARED_HEADER,
  sharedFooter: CLOUDFLOW_SAAS_SHARED_FOOTER,
  assets: CLOUDFLOW_SAAS_ASSETS,
  globalCss: CLOUDFLOW_SAAS_GLOBAL_CSS,
  globalJs: CLOUDFLOW_SAAS_GLOBAL_JS,
  customHead: CLOUDFLOW_SAAS_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// LaunchPad Startup (Startup)
// ==========================================
export const LAUNCHPAD_STARTUP_ASSETS = {
  hero: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",

};

export const LAUNCHPAD_STARTUP_GLOBAL_CSS = ":root{--primary:#f59e0b;--secondary:#ef4444;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const LAUNCHPAD_STARTUP_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const LAUNCHPAD_STARTUP_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const LAUNCHPAD_STARTUP_SHARED_HEADER: PageSection = {
  id: "tpl-startup-header",
  templateId: "tpl-startup-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">launchpad</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#about\">About</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#services\">Services</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#portfolio\">Portfolio</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const LAUNCHPAD_STARTUP_SHARED_FOOTER: PageSection = {
  id: "tpl-startup-footer",
  templateId: "tpl-startup-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">launchpad</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@launchpad.com\">info@launchpad.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 LaunchPad Startup. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const LAUNCHPAD_STARTUP_SECTIONS: PageSection[] = [
  {
    id: "tpl-startup-sec-1",
    templateId: "tpl-startup-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Startup Accelerator</span><h1>Turn your vision into reality.</h1><p class=\"lead\">Startup Accelerator - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80\" alt=\"LaunchPad Startup illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-startup-sec-2",
    templateId: "tpl-startup-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-startup-sec-3",
    templateId: "tpl-startup-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-startup-sec-4",
    templateId: "tpl-startup-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Incubation</h3><p>Professional incubation services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Mentorship</h3><p>Professional mentorship services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Funding</h3><p>Professional funding services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Marketing</h3><p>Professional marketing services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-startup-sec-5",
    templateId: "tpl-startup-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Expert Mentors</h4><p>Advanced expert mentors capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Seed Funding</h4><p>Advanced seed funding capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Co-working Space</h4><p>Advanced co-working space capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Network Access</h4><p>Advanced network access capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-startup-sec-6",
    templateId: "tpl-startup-sec-6",
    name: "Section 6",
    html: "<section id=\"testimonials\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Testimonials</span><h2 class=\"title\">What clients say</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><p class=\"mb-3\">\"LaunchPad transformed our idea into a thriving business.\"</p><strong>— Sarah Chen, CEO</strong></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><p class=\"mb-3\">\"The mentorship and support were invaluable.\"</p><strong>— Mike Rodriguez, Founder</strong></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
  {
    id: "tpl-startup-sec-7",
    templateId: "tpl-startup-sec-7",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@launchpad.com\">info@launchpad.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 240 },
  },
];

export const LAUNCHPAD_STARTUP_HOME_PAGE: Page = {
  id: "page-startup-home",
  name: "Home",
  slug: "home",
  sections: LAUNCHPAD_STARTUP_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const LAUNCHPAD_STARTUP_TEMPLATE: Template = {
  id: "tpl-launchpad-startup",
  name: "LaunchPad Startup",
  slug: "startup",
  category: "Startup",
  description: "Vibrant startup website template designed for rapid growth",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 3,
  widgets: [],
  pages: [LAUNCHPAD_STARTUP_HOME_PAGE],
  sharedHeader: LAUNCHPAD_STARTUP_SHARED_HEADER,
  sharedFooter: LAUNCHPAD_STARTUP_SHARED_FOOTER,
  assets: LAUNCHPAD_STARTUP_ASSETS,
  globalCss: LAUNCHPAD_STARTUP_GLOBAL_CSS,
  globalJs: LAUNCHPAD_STARTUP_GLOBAL_JS,
  customHead: LAUNCHPAD_STARTUP_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// Apex Consulting (Consulting)
// ==========================================
export const APEX_CONSULTING_ASSETS = {
  hero: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",

};

export const APEX_CONSULTING_GLOBAL_CSS = ":root{--primary:#1e40af;--secondary:#0891b2;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const APEX_CONSULTING_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const APEX_CONSULTING_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const APEX_CONSULTING_SHARED_HEADER: PageSection = {
  id: "tpl-consulting-header",
  templateId: "tpl-consulting-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">apex</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#services\">Services</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#industries\">Industries</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#about\">About</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const APEX_CONSULTING_SHARED_FOOTER: PageSection = {
  id: "tpl-consulting-footer",
  templateId: "tpl-consulting-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">apex</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@apex.com\">info@apex.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 Apex Consulting. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const APEX_CONSULTING_SECTIONS: PageSection[] = [
  {
    id: "tpl-consulting-sec-1",
    templateId: "tpl-consulting-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Business Consulting</span><h1>Strategic insights for complex challenges.</h1><p class=\"lead\">Business Consulting - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80\" alt=\"Apex Consulting illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-consulting-sec-2",
    templateId: "tpl-consulting-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-consulting-sec-3",
    templateId: "tpl-consulting-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-consulting-sec-4",
    templateId: "tpl-consulting-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Strategy</h3><p>Professional strategy services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Operations</h3><p>Professional operations services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Digital</h3><p>Professional digital services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Change Management</h3><p>Professional change management services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-consulting-sec-5",
    templateId: "tpl-consulting-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Industry Experts</h4><p>Advanced industry experts capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Data-Driven</h4><p>Advanced data-driven capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Custom Solutions</h4><p>Advanced custom solutions capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Proven Results</h4><p>Advanced proven results capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-consulting-sec-6",
    templateId: "tpl-consulting-sec-6",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@apex.com\">info@apex.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
];

export const APEX_CONSULTING_HOME_PAGE: Page = {
  id: "page-consulting-home",
  name: "Home",
  slug: "home",
  sections: APEX_CONSULTING_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const APEX_CONSULTING_TEMPLATE: Template = {
  id: "tpl-apex-consulting",
  name: "Apex Consulting",
  slug: "consulting",
  category: "Consulting",
  description: "Premium corporate consulting and advisory business template",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 4,
  widgets: [],
  pages: [APEX_CONSULTING_HOME_PAGE],
  sharedHeader: APEX_CONSULTING_SHARED_HEADER,
  sharedFooter: APEX_CONSULTING_SHARED_FOOTER,
  assets: APEX_CONSULTING_ASSETS,
  globalCss: APEX_CONSULTING_GLOBAL_CSS,
  globalJs: APEX_CONSULTING_GLOBAL_JS,
  customHead: APEX_CONSULTING_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// Meridian Corporate (Corporate)
// ==========================================
export const MERIDIAN_CORPORATE_ASSETS = {
  hero: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",

};

export const MERIDIAN_CORPORATE_GLOBAL_CSS = ":root{--primary:#1e3a5f;--secondary:#3b82f6;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const MERIDIAN_CORPORATE_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const MERIDIAN_CORPORATE_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const MERIDIAN_CORPORATE_SHARED_HEADER: PageSection = {
  id: "tpl-corporate-header",
  templateId: "tpl-corporate-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">meridian</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#about\">About</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#services\">Services</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#investors\">Investors</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#careers\">Careers</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const MERIDIAN_CORPORATE_SHARED_FOOTER: PageSection = {
  id: "tpl-corporate-footer",
  templateId: "tpl-corporate-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">meridian</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@meridian.com\">info@meridian.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 Meridian Corporate. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const MERIDIAN_CORPORATE_SECTIONS: PageSection[] = [
  {
    id: "tpl-corporate-sec-1",
    templateId: "tpl-corporate-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Global Corporation</span><h1>Excellence in every endeavor.</h1><p class=\"lead\">Global Corporation - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80\" alt=\"Meridian Corporate illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-corporate-sec-2",
    templateId: "tpl-corporate-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-corporate-sec-3",
    templateId: "tpl-corporate-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-corporate-sec-4",
    templateId: "tpl-corporate-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Corporate Finance</h3><p>Professional corporate finance services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>M&A</h3><p>Professional m&a services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Advisory</h3><p>Professional advisory services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Risk Management</h3><p>Professional risk management services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-corporate-sec-5",
    templateId: "tpl-corporate-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Global Reach</h4><p>Advanced global reach capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Industry Leadership</h4><p>Advanced industry leadership capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Trusted Partner</h4><p>Advanced trusted partner capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Innovation</h4><p>Advanced innovation capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-corporate-sec-6",
    templateId: "tpl-corporate-sec-6",
    name: "Section 6",
    html: "<section id=\"testimonials\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Testimonials</span><h2 class=\"title\">What clients say</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><p class=\"mb-3\">\"Meridian delivered exceptional results.\"</p><strong>— Fortune 500 CEO</strong></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
  {
    id: "tpl-corporate-sec-7",
    templateId: "tpl-corporate-sec-7",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@meridian.com\">info@meridian.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 240 },
  },
];

export const MERIDIAN_CORPORATE_HOME_PAGE: Page = {
  id: "page-corporate-home",
  name: "Home",
  slug: "home",
  sections: MERIDIAN_CORPORATE_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const MERIDIAN_CORPORATE_TEMPLATE: Template = {
  id: "tpl-meridian-corporate",
  name: "Meridian Corporate",
  slug: "corporate",
  category: "Corporate",
  description: "Professional enterprise corporate presence template",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 5,
  widgets: [],
  pages: [MERIDIAN_CORPORATE_HOME_PAGE],
  sharedHeader: MERIDIAN_CORPORATE_SHARED_HEADER,
  sharedFooter: MERIDIAN_CORPORATE_SHARED_FOOTER,
  assets: MERIDIAN_CORPORATE_ASSETS,
  globalCss: MERIDIAN_CORPORATE_GLOBAL_CSS,
  globalJs: MERIDIAN_CORPORATE_GLOBAL_JS,
  customHead: MERIDIAN_CORPORATE_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// TechCore IT (IT)
// ==========================================
export const TECHCORE_IT_ASSETS = {
  hero: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",

};

export const TECHCORE_IT_GLOBAL_CSS = ":root{--primary:#0f172a;--secondary:#06b6d4;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const TECHCORE_IT_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const TECHCORE_IT_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const TECHCORE_IT_SHARED_HEADER: PageSection = {
  id: "tpl-it-header",
  templateId: "tpl-it-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">techcore</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#services\">Services</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#solutions\">Solutions</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#about\">About</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const TECHCORE_IT_SHARED_FOOTER: PageSection = {
  id: "tpl-it-footer",
  templateId: "tpl-it-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">techcore</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@techcore.com\">info@techcore.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 TechCore IT. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const TECHCORE_IT_SECTIONS: PageSection[] = [
  {
    id: "tpl-it-sec-1",
    templateId: "tpl-it-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">IT Services</span><h1>Technology solutions that power business.</h1><p class=\"lead\">IT Services - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80\" alt=\"TechCore IT illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-it-sec-2",
    templateId: "tpl-it-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-it-sec-3",
    templateId: "tpl-it-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-it-sec-4",
    templateId: "tpl-it-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Web Development</h3><p>Professional web development services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Mobile Apps</h3><p>Professional mobile apps services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Cloud Services</h3><p>Professional cloud services services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Cybersecurity</h3><p>Professional cybersecurity services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>IT Support</h3><p>Professional it support services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Consulting</h3><p>Professional consulting services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-it-sec-5",
    templateId: "tpl-it-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Certified Experts</h4><p>Advanced certified experts capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>24/7 Support</h4><p>Advanced 24/7 support capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Latest Technology</h4><p>Advanced latest technology capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Custom Solutions</h4><p>Advanced custom solutions capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-it-sec-6",
    templateId: "tpl-it-sec-6",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@techcore.com\">info@techcore.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
];

export const TECHCORE_IT_HOME_PAGE: Page = {
  id: "page-it-home",
  name: "Home",
  slug: "home",
  sections: TECHCORE_IT_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const TECHCORE_IT_TEMPLATE: Template = {
  id: "tpl-techcore-it",
  name: "TechCore IT",
  slug: "it",
  category: "IT",
  description: "Modern IT solutions and managed technology services template",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 6,
  widgets: [],
  pages: [TECHCORE_IT_HOME_PAGE],
  sharedHeader: TECHCORE_IT_SHARED_HEADER,
  sharedFooter: TECHCORE_IT_SHARED_FOOTER,
  assets: TECHCORE_IT_ASSETS,
  globalCss: TECHCORE_IT_GLOBAL_CSS,
  globalJs: TECHCORE_IT_GLOBAL_JS,
  customHead: TECHCORE_IT_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// Alex Portfolio (Portfolio)
// ==========================================
export const ALEX_PORTFOLIO_ASSETS = {
  hero: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
  "gallery1": "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
  "gallery2": "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
  "gallery3": "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80",
  "gallery4": "https://images.unsplash.com/photo-1509343255572-56040404e59e?auto=format&fit=crop&w=800&q=80",
  "gallery5": "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
  "gallery6": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
};

export const ALEX_PORTFOLIO_GLOBAL_CSS = ":root{--primary:#6366f1;--secondary:#a855f7;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const ALEX_PORTFOLIO_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const ALEX_PORTFOLIO_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const ALEX_PORTFOLIO_SHARED_HEADER: PageSection = {
  id: "tpl-personal-header",
  templateId: "tpl-personal-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">alex</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#about\">About</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#portfolio\">Portfolio</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#resume\">Resume</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const ALEX_PORTFOLIO_SHARED_FOOTER: PageSection = {
  id: "tpl-personal-footer",
  templateId: "tpl-personal-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">alex</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@alex.com\">info@alex.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 Alex Morgan. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const ALEX_PORTFOLIO_SECTIONS: PageSection[] = [
  {
    id: "tpl-personal-sec-1",
    templateId: "tpl-personal-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Designer & Developer</span><h1>Creating digital experiences that matter.</h1><p class=\"lead\">Designer & Developer - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80\" alt=\"Alex Morgan illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-personal-sec-2",
    templateId: "tpl-personal-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-personal-sec-3",
    templateId: "tpl-personal-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-personal-sec-4",
    templateId: "tpl-personal-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>UI/UX Design</h3><p>Professional ui/ux design services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Web Development</h3><p>Professional web development services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Branding</h3><p>Professional branding services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Mobile Design</h3><p>Professional mobile design services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-personal-sec-5",
    templateId: "tpl-personal-sec-5",
    name: "Section 5",
    html: "<section id=\"gallery\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Gallery</span><h2 class=\"title\">Our work</h2></div><div class=\"row g-4\"><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 1\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 2\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 3\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1509343255572-56040404e59e?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 4\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 5\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 6\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-personal-sec-6",
    templateId: "tpl-personal-sec-6",
    name: "Section 6",
    html: "<section id=\"testimonials\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Testimonials</span><h2 class=\"title\">What clients say</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><p class=\"mb-3\">\"Alex delivered beyond our expectations.\"</p><strong>— Client A</strong></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><p class=\"mb-3\">\"Creative, professional, and timely.\"</p><strong>— Client B</strong></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
  {
    id: "tpl-personal-sec-7",
    templateId: "tpl-personal-sec-7",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@alex.com\">info@alex.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 240 },
  },
];

export const ALEX_PORTFOLIO_HOME_PAGE: Page = {
  id: "page-personal-home",
  name: "Home",
  slug: "home",
  sections: ALEX_PORTFOLIO_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const ALEX_PORTFOLIO_TEMPLATE: Template = {
  id: "tpl-alex-portfolio",
  name: "Alex Portfolio",
  slug: "personal",
  category: "Portfolio",
  description: "Minimalist personal portfolio template for creators",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 7,
  widgets: [],
  pages: [ALEX_PORTFOLIO_HOME_PAGE],
  sharedHeader: ALEX_PORTFOLIO_SHARED_HEADER,
  sharedFooter: ALEX_PORTFOLIO_SHARED_FOOTER,
  assets: ALEX_PORTFOLIO_ASSETS,
  globalCss: ALEX_PORTFOLIO_GLOBAL_CSS,
  globalJs: ALEX_PORTFOLIO_GLOBAL_JS,
  customHead: ALEX_PORTFOLIO_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// James Resume (Resume)
// ==========================================
export const JAMES_RESUME_ASSETS = {
  hero: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",

};

export const JAMES_RESUME_GLOBAL_CSS = ":root{--primary:#059669;--secondary:#10b981;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const JAMES_RESUME_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const JAMES_RESUME_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const JAMES_RESUME_SHARED_HEADER: PageSection = {
  id: "tpl-resume-header",
  templateId: "tpl-resume-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">james</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#experience\">Experience</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#skills\">Skills</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#projects\">Projects</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const JAMES_RESUME_SHARED_FOOTER: PageSection = {
  id: "tpl-resume-footer",
  templateId: "tpl-resume-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">james</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@james.com\">info@james.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 James Wilson. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const JAMES_RESUME_SECTIONS: PageSection[] = [
  {
    id: "tpl-resume-sec-1",
    templateId: "tpl-resume-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Full-Stack Developer</span><h1>Senior Software Engineer ready to build.</h1><p class=\"lead\">Full-Stack Developer - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80\" alt=\"James Wilson illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-resume-sec-2",
    templateId: "tpl-resume-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-resume-sec-3",
    templateId: "tpl-resume-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-resume-sec-4",
    templateId: "tpl-resume-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Backend Development</h3><p>Professional backend development services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Frontend Development</h3><p>Professional frontend development services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>System Architecture</h3><p>Professional system architecture services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Team Leadership</h3><p>Professional team leadership services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-resume-sec-5",
    templateId: "tpl-resume-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>5+ Years Experience</h4><p>Advanced 5+ years experience capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Python, Node, React</h4><p>Advanced python, node, react capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Cloud Certified</h4><p>Advanced cloud certified capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Agile Expert</h4><p>Advanced agile expert capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-resume-sec-6",
    templateId: "tpl-resume-sec-6",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@james.com\">info@james.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
];

export const JAMES_RESUME_HOME_PAGE: Page = {
  id: "page-resume-home",
  name: "Home",
  slug: "home",
  sections: JAMES_RESUME_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const JAMES_RESUME_TEMPLATE: Template = {
  id: "tpl-james-resume",
  name: "James Resume",
  slug: "resume",
  category: "Resume",
  description: "Interactive online resume and CV showcase template",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 8,
  widgets: [],
  pages: [JAMES_RESUME_HOME_PAGE],
  sharedHeader: JAMES_RESUME_SHARED_HEADER,
  sharedFooter: JAMES_RESUME_SHARED_FOOTER,
  assets: JAMES_RESUME_ASSETS,
  globalCss: JAMES_RESUME_GLOBAL_CSS,
  globalJs: JAMES_RESUME_GLOBAL_JS,
  customHead: JAMES_RESUME_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// Creative Freelance (Freelancer)
// ==========================================
export const CREATIVE_FREELANCE_ASSETS = {
  hero: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80",

};

export const CREATIVE_FREELANCE_GLOBAL_CSS = ":root{--primary:#db2777;--secondary:#f43f5e;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const CREATIVE_FREELANCE_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const CREATIVE_FREELANCE_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const CREATIVE_FREELANCE_SHARED_HEADER: PageSection = {
  id: "tpl-freelancer-header",
  templateId: "tpl-freelancer-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">creative</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#services\">Services</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#portfolio\">Portfolio</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#testimonials\">Testimonials</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const CREATIVE_FREELANCE_SHARED_FOOTER: PageSection = {
  id: "tpl-freelancer-footer",
  templateId: "tpl-freelancer-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">creative</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@creative.com\">info@creative.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 Creative Freelance. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const CREATIVE_FREELANCE_SECTIONS: PageSection[] = [
  {
    id: "tpl-freelancer-sec-1",
    templateId: "tpl-freelancer-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Freelance Designer</span><h1>Your creative partner for digital success.</h1><p class=\"lead\">Freelance Designer - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80\" alt=\"Creative Freelance illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-freelancer-sec-2",
    templateId: "tpl-freelancer-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-freelancer-sec-3",
    templateId: "tpl-freelancer-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-freelancer-sec-4",
    templateId: "tpl-freelancer-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Graphic Design</h3><p>Professional graphic design services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Web Design</h3><p>Professional web design services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Branding</h3><p>Professional branding services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Illustration</h3><p>Professional illustration services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-freelancer-sec-5",
    templateId: "tpl-freelancer-sec-5",
    name: "Pricing Plans",
    html: "<section id=\"pricing\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Pricing</span><h2 class=\"title\">Simple, transparent pricing</h2><p class=\"lead mt-3\" style=\"max-width:550px;margin:auto\">Choose the plan that fits your needs.</p></div><div class=\"row g-4 justify-content-center\"><div class=\"col-md-6 col-lg-4\"><div class=\"pricing-card  reveal\"><h3>Basic</h3><div class=\"price\">$500 <small>/project</small></div><p>Simple design needs</p><ul><li>2 Concepts</li><li>3 Revisions</li><li>Source Files</li></ul><a href=\"#contact\" class=\"btn btn-outline w-100\">Choose Basic</a></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"pricing-card popular reveal\"><h3>Standard</h3><div class=\"price\">$1200 <small>/project</small></div><p>Most popular choice</p><ul><li>4 Concepts</li><li>5 Revisions</li><li>Source Files</li><li>Brand Guidelines</li></ul><a href=\"#contact\" class=\"btn btn-popular w-100\">Choose Standard</a></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"pricing-card  reveal\"><h3>Premium</h3><div class=\"price\">$2500 <small>/project</small></div><p>Complete branding</p><ul><li>Unlimited Concepts</li><li>Unlimited Revisions</li><li>All Files</li><li>Brand Strategy</li></ul><a href=\"#contact\" class=\"btn btn-outline w-100\">Choose Premium</a></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-freelancer-sec-6",
    templateId: "tpl-freelancer-sec-6",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@creative.com\">info@creative.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
];

export const CREATIVE_FREELANCE_HOME_PAGE: Page = {
  id: "page-freelancer-home",
  name: "Home",
  slug: "home",
  sections: CREATIVE_FREELANCE_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const CREATIVE_FREELANCE_TEMPLATE: Template = {
  id: "tpl-creative-freelance",
  name: "Creative Freelance",
  slug: "freelancer",
  category: "Freelancer",
  description: "Dynamic freelancer portfolio with services and project showcase",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 9,
  widgets: [],
  pages: [CREATIVE_FREELANCE_HOME_PAGE],
  sharedHeader: CREATIVE_FREELANCE_SHARED_HEADER,
  sharedFooter: CREATIVE_FREELANCE_SHARED_FOOTER,
  assets: CREATIVE_FREELANCE_ASSETS,
  globalCss: CREATIVE_FREELANCE_GLOBAL_CSS,
  globalJs: CREATIVE_FREELANCE_GLOBAL_JS,
  customHead: CREATIVE_FREELANCE_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// Studio Designer (Designer)
// ==========================================
export const STUDIO_DESIGNER_ASSETS = {
  hero: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1509343255572-56040404e59e?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80",
  "gallery1": "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
  "gallery2": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80",
  "gallery3": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80",
  "gallery4": "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80",
  "gallery5": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
  "gallery6": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80",
};

export const STUDIO_DESIGNER_GLOBAL_CSS = ":root{--primary:#7c3aed;--secondary:#ec4899;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const STUDIO_DESIGNER_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const STUDIO_DESIGNER_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const STUDIO_DESIGNER_SHARED_HEADER: PageSection = {
  id: "tpl-designer-header",
  templateId: "tpl-designer-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">studio</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#work\">Work</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#studio\">Studio</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#journal\">Journal</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const STUDIO_DESIGNER_SHARED_FOOTER: PageSection = {
  id: "tpl-designer-footer",
  templateId: "tpl-designer-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">studio</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@studio.com\">info@studio.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 Studio Creative. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const STUDIO_DESIGNER_SECTIONS: PageSection[] = [
  {
    id: "tpl-designer-sec-1",
    templateId: "tpl-designer-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Creative Director</span><h1>Design that moves people.</h1><p class=\"lead\">Creative Director - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80\" alt=\"Studio Creative illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-designer-sec-2",
    templateId: "tpl-designer-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-designer-sec-3",
    templateId: "tpl-designer-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1509343255572-56040404e59e?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-designer-sec-4",
    templateId: "tpl-designer-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Brand Identity</h3><p>Professional brand identity services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Digital Design</h3><p>Professional digital design services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Print Design</h3><p>Professional print design services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Art Direction</h3><p>Professional art direction services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-designer-sec-5",
    templateId: "tpl-designer-sec-5",
    name: "Section 5",
    html: "<section id=\"gallery\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Gallery</span><h2 class=\"title\">Our work</h2></div><div class=\"row g-4\"><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 1\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 2\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 3\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 4\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 5\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 6\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-designer-sec-6",
    templateId: "tpl-designer-sec-6",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@studio.com\">info@studio.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
];

export const STUDIO_DESIGNER_HOME_PAGE: Page = {
  id: "page-designer-home",
  name: "Home",
  slug: "home",
  sections: STUDIO_DESIGNER_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const STUDIO_DESIGNER_TEMPLATE: Template = {
  id: "tpl-studio-designer",
  name: "Studio Designer",
  slug: "designer",
  category: "Designer",
  description: "Elegant designer portfolio highlighting visual projects",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1600132806370-bf17e65e942f?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 10,
  widgets: [],
  pages: [STUDIO_DESIGNER_HOME_PAGE],
  sharedHeader: STUDIO_DESIGNER_SHARED_HEADER,
  sharedFooter: STUDIO_DESIGNER_SHARED_FOOTER,
  assets: STUDIO_DESIGNER_ASSETS,
  globalCss: STUDIO_DESIGNER_GLOBAL_CSS,
  globalJs: STUDIO_DESIGNER_GLOBAL_JS,
  customHead: STUDIO_DESIGNER_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// Dev Portfolio (Developer)
// ==========================================
export const DEV_DEVELOPER_ASSETS = {
  hero: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",

};

export const DEV_DEVELOPER_GLOBAL_CSS = ":root{--primary:#0891b2;--secondary:#06b6d4;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const DEV_DEVELOPER_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const DEV_DEVELOPER_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const DEV_DEVELOPER_SHARED_HEADER: PageSection = {
  id: "tpl-developer-header",
  templateId: "tpl-developer-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">dev</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#projects\">Projects</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#skills\">Skills</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#about\">About</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const DEV_DEVELOPER_SHARED_FOOTER: PageSection = {
  id: "tpl-developer-footer",
  templateId: "tpl-developer-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">dev</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@dev.com\">info@dev.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 Dev Portfolio. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const DEV_DEVELOPER_SECTIONS: PageSection[] = [
  {
    id: "tpl-developer-sec-1",
    templateId: "tpl-developer-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Full-Stack Developer</span><h1>Building the web, one line at a time.</h1><p class=\"lead\">Full-Stack Developer - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80\" alt=\"Dev Portfolio illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-developer-sec-2",
    templateId: "tpl-developer-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-developer-sec-3",
    templateId: "tpl-developer-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-developer-sec-4",
    templateId: "tpl-developer-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Web Apps</h3><p>Professional web apps services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>APIs</h3><p>Professional apis services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Databases</h3><p>Professional databases services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>DevOps</h3><p>Professional devops services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-developer-sec-5",
    templateId: "tpl-developer-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>JavaScript/TypeScript</h4><p>Advanced javascript/typescript capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>React & Node</h4><p>Advanced react & node capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Cloud Platforms</h4><p>Advanced cloud platforms capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Clean Code</h4><p>Advanced clean code capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-developer-sec-6",
    templateId: "tpl-developer-sec-6",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@dev.com\">info@dev.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
];

export const DEV_DEVELOPER_HOME_PAGE: Page = {
  id: "page-developer-home",
  name: "Home",
  slug: "home",
  sections: DEV_DEVELOPER_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const DEV_DEVELOPER_TEMPLATE: Template = {
  id: "tpl-dev-developer",
  name: "Dev Portfolio",
  slug: "developer",
  category: "Developer",
  description: "Full-stack developer portfolio with skill tags and contact form",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 11,
  widgets: [],
  pages: [DEV_DEVELOPER_HOME_PAGE],
  sharedHeader: DEV_DEVELOPER_SHARED_HEADER,
  sharedFooter: DEV_DEVELOPER_SHARED_FOOTER,
  assets: DEV_DEVELOPER_ASSETS,
  globalCss: DEV_DEVELOPER_GLOBAL_CSS,
  globalJs: DEV_DEVELOPER_GLOBAL_JS,
  customHead: DEV_DEVELOPER_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// ShopPro eCommerce (eCommerce)
// ==========================================
export const SHOPPRO_PRODUCT_ASSETS = {
  hero: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  "gallery1": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  "gallery2": "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80",
  "gallery3": "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80",
  "gallery4": "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80",
  "gallery5": "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80",
  "gallery6": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
};

export const SHOPPRO_PRODUCT_GLOBAL_CSS = ":root{--primary:#059669;--secondary:#10b981;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const SHOPPRO_PRODUCT_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const SHOPPRO_PRODUCT_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const SHOPPRO_PRODUCT_SHARED_HEADER: PageSection = {
  id: "tpl-ecommerce-header",
  templateId: "tpl-ecommerce-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">shoppro</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#shop\">Shop</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#products\">Products</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#about\">About</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const SHOPPRO_PRODUCT_SHARED_FOOTER: PageSection = {
  id: "tpl-ecommerce-footer",
  templateId: "tpl-ecommerce-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">shoppro</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@shoppro.com\">info@shoppro.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 ShopPro. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const SHOPPRO_PRODUCT_SECTIONS: PageSection[] = [
  {
    id: "tpl-ecommerce-sec-1",
    templateId: "tpl-ecommerce-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">E-commerce Store</span><h1>Your destination for quality products.</h1><p class=\"lead\">E-commerce Store - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80\" alt=\"ShopPro illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-ecommerce-sec-2",
    templateId: "tpl-ecommerce-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-ecommerce-sec-3",
    templateId: "tpl-ecommerce-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-ecommerce-sec-4",
    templateId: "tpl-ecommerce-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Free Shipping</h3><p>Professional free shipping services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Easy Returns</h3><p>Professional easy returns services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Secure Payment</h3><p>Professional secure payment services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>24/7 Support</h3><p>Professional 24/7 support services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-ecommerce-sec-5",
    templateId: "tpl-ecommerce-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Premium Quality</h4><p>Advanced premium quality capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Fast Delivery</h4><p>Advanced fast delivery capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Best Prices</h4><p>Advanced best prices capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Customer First</h4><p>Advanced customer first capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-ecommerce-sec-6",
    templateId: "tpl-ecommerce-sec-6",
    name: "Section 6",
    html: "<section id=\"gallery\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Gallery</span><h2 class=\"title\">Our work</h2></div><div class=\"row g-4\"><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 1\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 2\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 3\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1585386959984-a4155224a1ad?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 4\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 5\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 6\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
  {
    id: "tpl-ecommerce-sec-7",
    templateId: "tpl-ecommerce-sec-7",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@shoppro.com\">info@shoppro.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 240 },
  },
];

export const SHOPPRO_PRODUCT_HOME_PAGE: Page = {
  id: "page-ecommerce-home",
  name: "Home",
  slug: "home",
  sections: SHOPPRO_PRODUCT_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const SHOPPRO_PRODUCT_TEMPLATE: Template = {
  id: "tpl-shoppro-product",
  name: "ShopPro eCommerce",
  slug: "ecommerce",
  category: "eCommerce",
  description: "Modern online store product showcase template",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 12,
  widgets: [],
  pages: [SHOPPRO_PRODUCT_HOME_PAGE],
  sharedHeader: SHOPPRO_PRODUCT_SHARED_HEADER,
  sharedFooter: SHOPPRO_PRODUCT_SHARED_FOOTER,
  assets: SHOPPRO_PRODUCT_ASSETS,
  globalCss: SHOPPRO_PRODUCT_GLOBAL_CSS,
  globalJs: SHOPPRO_PRODUCT_GLOBAL_JS,
  customHead: SHOPPRO_PRODUCT_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// Luxe Fashion (Fashion)
// ==========================================
export const LUXE_FASHION_ASSETS = {
  hero: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
  "gallery1": "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80",
  "gallery2": "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80",
  "gallery3": "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
  "gallery4": "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80",
  "gallery5": "https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80",
  "gallery6": "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80",
};

export const LUXE_FASHION_GLOBAL_CSS = ":root{--primary:#db2777;--secondary:#f43f5e;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const LUXE_FASHION_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const LUXE_FASHION_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const LUXE_FASHION_SHARED_HEADER: PageSection = {
  id: "tpl-fashion-header",
  templateId: "tpl-fashion-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">luxe</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#collections\">Collections</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#new-arrivals\">New Arrivals</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#sale\">Sale</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const LUXE_FASHION_SHARED_FOOTER: PageSection = {
  id: "tpl-fashion-footer",
  templateId: "tpl-fashion-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">luxe</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@luxe.com\">info@luxe.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 Luxe Fashion. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const LUXE_FASHION_SECTIONS: PageSection[] = [
  {
    id: "tpl-fashion-sec-1",
    templateId: "tpl-fashion-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Fashion Boutique</span><h1>Style that speaks volumes.</h1><p class=\"lead\">Fashion Boutique - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80\" alt=\"Luxe Fashion illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-fashion-sec-2",
    templateId: "tpl-fashion-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-fashion-sec-3",
    templateId: "tpl-fashion-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-fashion-sec-4",
    templateId: "tpl-fashion-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Free Shipping</h3><p>Professional free shipping services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Easy Returns</h3><p>Professional easy returns services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Style Guide</h3><p>Professional style guide services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>VIP Access</h3><p>Professional vip access services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-fashion-sec-5",
    templateId: "tpl-fashion-sec-5",
    name: "Section 5",
    html: "<section id=\"gallery\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Gallery</span><h2 class=\"title\">Our work</h2></div><div class=\"row g-4\"><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 1\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 2\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 3\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 4\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 5\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 6\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-fashion-sec-6",
    templateId: "tpl-fashion-sec-6",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@luxe.com\">info@luxe.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
];

export const LUXE_FASHION_HOME_PAGE: Page = {
  id: "page-fashion-home",
  name: "Home",
  slug: "home",
  sections: LUXE_FASHION_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const LUXE_FASHION_TEMPLATE: Template = {
  id: "tpl-luxe-fashion",
  name: "Luxe Fashion",
  slug: "fashion",
  category: "Fashion",
  description: "High-end fashion brand template with hero and collections",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 13,
  widgets: [],
  pages: [LUXE_FASHION_HOME_PAGE],
  sharedHeader: LUXE_FASHION_SHARED_HEADER,
  sharedFooter: LUXE_FASHION_SHARED_FOOTER,
  assets: LUXE_FASHION_ASSETS,
  globalCss: LUXE_FASHION_GLOBAL_CSS,
  globalJs: LUXE_FASHION_GLOBAL_JS,
  customHead: LUXE_FASHION_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// Gourmet Restaurant (Restaurant)
// ==========================================
export const GOURMET_RESTAURANT_ASSETS = {
  hero: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",

};

export const GOURMET_RESTAURANT_GLOBAL_CSS = ":root{--primary:#dc2626;--secondary:#f97316;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const GOURMET_RESTAURANT_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const GOURMET_RESTAURANT_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const GOURMET_RESTAURANT_SHARED_HEADER: PageSection = {
  id: "tpl-restaurant-header",
  templateId: "tpl-restaurant-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">gourmet</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#menu\">Menu</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#reservations\">Reservations</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#about\">About</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const GOURMET_RESTAURANT_SHARED_FOOTER: PageSection = {
  id: "tpl-restaurant-footer",
  templateId: "tpl-restaurant-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">gourmet</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@gourmet.com\">info@gourmet.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 Gourmet Bistro. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const GOURMET_RESTAURANT_SECTIONS: PageSection[] = [
  {
    id: "tpl-restaurant-sec-1",
    templateId: "tpl-restaurant-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Fine Dining</span><h1>An unforgettable dining experience.</h1><p class=\"lead\">Fine Dining - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80\" alt=\"Gourmet Bistro illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-restaurant-sec-2",
    templateId: "tpl-restaurant-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-restaurant-sec-3",
    templateId: "tpl-restaurant-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-restaurant-sec-4",
    templateId: "tpl-restaurant-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Reservations</h3><p>Professional reservations services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Private Events</h3><p>Professional private events services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Catering</h3><p>Professional catering services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Gift Cards</h3><p>Professional gift cards services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-restaurant-sec-5",
    templateId: "tpl-restaurant-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Fresh Ingredients</h4><p>Advanced fresh ingredients capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Expert Chefs</h4><p>Advanced expert chefs capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Wine Selection</h4><p>Advanced wine selection capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Ambiance</h4><p>Advanced ambiance capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-restaurant-sec-6",
    templateId: "tpl-restaurant-sec-6",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@gourmet.com\">info@gourmet.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
];

export const GOURMET_RESTAURANT_HOME_PAGE: Page = {
  id: "page-restaurant-home",
  name: "Home",
  slug: "home",
  sections: GOURMET_RESTAURANT_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const GOURMET_RESTAURANT_TEMPLATE: Template = {
  id: "tpl-gourmet-restaurant",
  name: "Gourmet Restaurant",
  slug: "restaurant",
  category: "Restaurant",
  description: "Fine dining restaurant template with menu and reservation callout",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 14,
  widgets: [],
  pages: [GOURMET_RESTAURANT_HOME_PAGE],
  sharedHeader: GOURMET_RESTAURANT_SHARED_HEADER,
  sharedFooter: GOURMET_RESTAURANT_SHARED_FOOTER,
  assets: GOURMET_RESTAURANT_ASSETS,
  globalCss: GOURMET_RESTAURANT_GLOBAL_CSS,
  globalJs: GOURMET_RESTAURANT_GLOBAL_JS,
  customHead: GOURMET_RESTAURANT_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// TechGadgets Electronics (Electronics)
// ==========================================
export const TECHGADGETS_ELECTRONICS_ASSETS = {
  hero: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  "gallery1": "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
  "gallery2": "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80",
  "gallery3": "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80",
  "gallery4": "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80",
  "gallery5": "https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80",
  "gallery6": "https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80",
};

export const TECHGADGETS_ELECTRONICS_GLOBAL_CSS = ":root{--primary:#2563eb;--secondary:#06b6d4;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const TECHGADGETS_ELECTRONICS_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const TECHGADGETS_ELECTRONICS_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const TECHGADGETS_ELECTRONICS_SHARED_HEADER: PageSection = {
  id: "tpl-electronics-header",
  templateId: "tpl-electronics-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">techgadgets</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#products\">Products</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#deals\">Deals</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#support\">Support</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const TECHGADGETS_ELECTRONICS_SHARED_FOOTER: PageSection = {
  id: "tpl-electronics-footer",
  templateId: "tpl-electronics-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">techgadgets</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@techgadgets.com\">info@techgadgets.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 TechGadgets. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const TECHGADGETS_ELECTRONICS_SECTIONS: PageSection[] = [
  {
    id: "tpl-electronics-sec-1",
    templateId: "tpl-electronics-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Electronics Store</span><h1>The latest in consumer electronics.</h1><p class=\"lead\">Electronics Store - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80\" alt=\"TechGadgets illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-electronics-sec-2",
    templateId: "tpl-electronics-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-electronics-sec-3",
    templateId: "tpl-electronics-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-electronics-sec-4",
    templateId: "tpl-electronics-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Free Shipping</h3><p>Professional free shipping services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Warranty</h3><p>Professional warranty services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Tech Support</h3><p>Professional tech support services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Trade-In</h3><p>Professional trade-in services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-electronics-sec-5",
    templateId: "tpl-electronics-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Latest Products</h4><p>Advanced latest products capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Best Prices</h4><p>Advanced best prices capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Expert Advice</h4><p>Advanced expert advice capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Fast Delivery</h4><p>Advanced fast delivery capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-electronics-sec-6",
    templateId: "tpl-electronics-sec-6",
    name: "Section 6",
    html: "<section id=\"gallery\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Gallery</span><h2 class=\"title\">Our work</h2></div><div class=\"row g-4\"><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 1\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 2\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 3\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 4\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1583394838336-acd977736f90?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 5\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1585060544812-6b45742d762f?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 6\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
  {
    id: "tpl-electronics-sec-7",
    templateId: "tpl-electronics-sec-7",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@techgadgets.com\">info@techgadgets.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 240 },
  },
];

export const TECHGADGETS_ELECTRONICS_HOME_PAGE: Page = {
  id: "page-electronics-home",
  name: "Home",
  slug: "home",
  sections: TECHGADGETS_ELECTRONICS_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const TECHGADGETS_ELECTRONICS_TEMPLATE: Template = {
  id: "tpl-techgadgets-electronics",
  name: "TechGadgets Electronics",
  slug: "electronics",
  category: "Electronics",
  description: "Consumer electronics and smart devices landing page",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 15,
  widgets: [],
  pages: [TECHGADGETS_ELECTRONICS_HOME_PAGE],
  sharedHeader: TECHGADGETS_ELECTRONICS_SHARED_HEADER,
  sharedFooter: TECHGADGETS_ELECTRONICS_SHARED_FOOTER,
  assets: TECHGADGETS_ELECTRONICS_ASSETS,
  globalCss: TECHGADGETS_ELECTRONICS_GLOBAL_CSS,
  globalJs: TECHGADGETS_ELECTRONICS_GLOBAL_JS,
  customHead: TECHGADGETS_ELECTRONICS_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// Grand Event (Event)
// ==========================================
export const GRAND_EVENT_ASSETS = {
  hero: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",

};

export const GRAND_EVENT_GLOBAL_CSS = ":root{--primary:#7c3aed;--secondary:#db2777;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const GRAND_EVENT_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const GRAND_EVENT_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const GRAND_EVENT_SHARED_HEADER: PageSection = {
  id: "tpl-event-header",
  templateId: "tpl-event-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">grand</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#about\">About</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#schedule\">Schedule</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#venue\">Venue</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#tickets\">Tickets</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const GRAND_EVENT_SHARED_FOOTER: PageSection = {
  id: "tpl-event-footer",
  templateId: "tpl-event-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">grand</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@grand.com\">info@grand.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 Grand Event. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const GRAND_EVENT_SECTIONS: PageSection[] = [
  {
    id: "tpl-event-sec-1",
    templateId: "tpl-event-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Annual Conference</span><h1>Join us for an unforgettable experience.</h1><p class=\"lead\">Annual Conference - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80\" alt=\"Grand Event illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-event-sec-2",
    templateId: "tpl-event-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-event-sec-3",
    templateId: "tpl-event-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-event-sec-4",
    templateId: "tpl-event-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Keynotes</h3><p>Professional keynotes services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Workshops</h3><p>Professional workshops services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Networking</h3><p>Professional networking services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Exhibitions</h3><p>Professional exhibitions services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-event-sec-5",
    templateId: "tpl-event-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Industry Leaders</h4><p>Advanced industry leaders capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Hands-on Sessions</h4><p>Advanced hands-on sessions capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Networking Opportunities</h4><p>Advanced networking opportunities capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Exclusive Access</h4><p>Advanced exclusive access capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-event-sec-6",
    templateId: "tpl-event-sec-6",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@grand.com\">info@grand.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
];

export const GRAND_EVENT_HOME_PAGE: Page = {
  id: "page-event-home",
  name: "Home",
  slug: "home",
  sections: GRAND_EVENT_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const GRAND_EVENT_TEMPLATE: Template = {
  id: "tpl-grand-event",
  name: "Grand Event",
  slug: "event",
  category: "Event",
  description: "High-energy conference and event registration template",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 16,
  widgets: [],
  pages: [GRAND_EVENT_HOME_PAGE],
  sharedHeader: GRAND_EVENT_SHARED_HEADER,
  sharedFooter: GRAND_EVENT_SHARED_FOOTER,
  assets: GRAND_EVENT_ASSETS,
  globalCss: GRAND_EVENT_GLOBAL_CSS,
  globalJs: GRAND_EVENT_GLOBAL_JS,
  customHead: GRAND_EVENT_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// Lincoln School (School)
// ==========================================
export const LINCOLN_SCHOOL_ASSETS = {
  hero: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",

};

export const LINCOLN_SCHOOL_GLOBAL_CSS = ":root{--primary:#1e40af;--secondary:#0284c7;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const LINCOLN_SCHOOL_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const LINCOLN_SCHOOL_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const LINCOLN_SCHOOL_SHARED_HEADER: PageSection = {
  id: "tpl-school-header",
  templateId: "tpl-school-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">lincoln</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#about\">About</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#academics\">Academics</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#admissions\">Admissions</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const LINCOLN_SCHOOL_SHARED_FOOTER: PageSection = {
  id: "tpl-school-footer",
  templateId: "tpl-school-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">lincoln</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@lincoln.com\">info@lincoln.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 Lincoln Academy. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const LINCOLN_SCHOOL_SECTIONS: PageSection[] = [
  {
    id: "tpl-school-sec-1",
    templateId: "tpl-school-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Private School</span><h1>Excellence in education since 1985.</h1><p class=\"lead\">Private School - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80\" alt=\"Lincoln Academy illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-school-sec-2",
    templateId: "tpl-school-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-school-sec-3",
    templateId: "tpl-school-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-school-sec-4",
    templateId: "tpl-school-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Elementary</h3><p>Professional elementary services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Middle School</h3><p>Professional middle school services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>High School</h3><p>Professional high school services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>After School</h3><p>Professional after school services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-school-sec-5",
    templateId: "tpl-school-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Expert Faculty</h4><p>Advanced expert faculty capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Small Classes</h4><p>Advanced small classes capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Modern Facilities</h4><p>Advanced modern facilities capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>College Prep</h4><p>Advanced college prep capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-school-sec-6",
    templateId: "tpl-school-sec-6",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@lincoln.com\">info@lincoln.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
];

export const LINCOLN_SCHOOL_HOME_PAGE: Page = {
  id: "page-school-home",
  name: "Home",
  slug: "home",
  sections: LINCOLN_SCHOOL_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const LINCOLN_SCHOOL_TEMPLATE: Template = {
  id: "tpl-lincoln-school",
  name: "Lincoln School",
  slug: "school",
  category: "School",
  description: "Comprehensive educational institution and academy template",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 17,
  widgets: [],
  pages: [LINCOLN_SCHOOL_HOME_PAGE],
  sharedHeader: LINCOLN_SCHOOL_SHARED_HEADER,
  sharedFooter: LINCOLN_SCHOOL_SHARED_FOOTER,
  assets: LINCOLN_SCHOOL_ASSETS,
  globalCss: LINCOLN_SCHOOL_GLOBAL_CSS,
  globalJs: LINCOLN_SCHOOL_GLOBAL_JS,
  customHead: LINCOLN_SCHOOL_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// FitLife Gym (Gym)
// ==========================================
export const FITLIFE_GYM_ASSETS = {
  hero: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",

};

export const FITLIFE_GYM_GLOBAL_CSS = ":root{--primary:#dc2626;--secondary:#f97316;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const FITLIFE_GYM_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const FITLIFE_GYM_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const FITLIFE_GYM_SHARED_HEADER: PageSection = {
  id: "tpl-gym-header",
  templateId: "tpl-gym-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">fitlife</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#classes\">Classes</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#membership\">Membership</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#trainers\">Trainers</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const FITLIFE_GYM_SHARED_FOOTER: PageSection = {
  id: "tpl-gym-footer",
  templateId: "tpl-gym-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">fitlife</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@fitlife.com\">info@fitlife.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 FitLife Gym. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const FITLIFE_GYM_SECTIONS: PageSection[] = [
  {
    id: "tpl-gym-sec-1",
    templateId: "tpl-gym-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Fitness Center</span><h1>Transform your body, transform your life.</h1><p class=\"lead\">Fitness Center - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80\" alt=\"FitLife Gym illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-gym-sec-2",
    templateId: "tpl-gym-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-gym-sec-3",
    templateId: "tpl-gym-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-gym-sec-4",
    templateId: "tpl-gym-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Personal Training</h3><p>Professional personal training services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Group Classes</h3><p>Professional group classes services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Cardio</h3><p>Professional cardio services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Weights</h3><p>Professional weights services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-gym-sec-5",
    templateId: "tpl-gym-sec-5",
    name: "Pricing Plans",
    html: "<section id=\"pricing\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Pricing</span><h2 class=\"title\">Simple, transparent pricing</h2><p class=\"lead mt-3\" style=\"max-width:550px;margin:auto\">Choose the plan that fits your needs.</p></div><div class=\"row g-4 justify-content-center\"><div class=\"col-md-6 col-lg-4\"><div class=\"pricing-card  reveal\"><h3>Basic</h3><div class=\"price\">$29 <small>/month</small></div><p>Gym access only</p><ul><li>Gym Access</li><li>Locker Room</li><li>Free WiFi</li></ul><a href=\"#contact\" class=\"btn btn-outline w-100\">Choose Basic</a></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"pricing-card popular reveal\"><h3>Plus</h3><div class=\"price\">$49 <small>/month</small></div><p>Most popular</p><ul><li>All Basic Features</li><li>Group Classes</li><li>Sauna Access</li><li>Guest Pass</li></ul><a href=\"#contact\" class=\"btn btn-popular w-100\">Choose Plus</a></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"pricing-card  reveal\"><h3>Pro</h3><div class=\"price\">$79 <small>/month</small></div><p>Full access</p><ul><li>All Plus Features</li><li>Personal Trainer</li><li>Nutrition Plan</li><li>Spa Access</li></ul><a href=\"#contact\" class=\"btn btn-outline w-100\">Choose Pro</a></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-gym-sec-6",
    templateId: "tpl-gym-sec-6",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@fitlife.com\">info@fitlife.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
];

export const FITLIFE_GYM_HOME_PAGE: Page = {
  id: "page-gym-home",
  name: "Home",
  slug: "home",
  sections: FITLIFE_GYM_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const FITLIFE_GYM_TEMPLATE: Template = {
  id: "tpl-fitlife-gym",
  name: "FitLife Gym",
  slug: "gym",
  category: "Gym",
  description: "Energizing gym and fitness club template with classes and pricing",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 18,
  widgets: [],
  pages: [FITLIFE_GYM_HOME_PAGE],
  sharedHeader: FITLIFE_GYM_SHARED_HEADER,
  sharedFooter: FITLIFE_GYM_SHARED_FOOTER,
  assets: FITLIFE_GYM_ASSETS,
  globalCss: FITLIFE_GYM_GLOBAL_CSS,
  globalJs: FITLIFE_GYM_GLOBAL_JS,
  customHead: FITLIFE_GYM_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// Prime Real Estate (Real Estate)
// ==========================================
export const PRIME_REALESTATE_ASSETS = {
  hero: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  "gallery1": "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80",
  "gallery2": "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80",
  "gallery3": "https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80",
  "gallery4": "https://images.unsplash.com/photo-160058515526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
  "gallery5": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80",
  "gallery6": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80",
};

export const PRIME_REALESTATE_GLOBAL_CSS = ":root{--primary:#059669;--secondary:#10b981;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const PRIME_REALESTATE_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const PRIME_REALESTATE_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const PRIME_REALESTATE_SHARED_HEADER: PageSection = {
  id: "tpl-realestate-header",
  templateId: "tpl-realestate-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">prime</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#listings\">Listings</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#about\">About</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#agents\">Agents</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const PRIME_REALESTATE_SHARED_FOOTER: PageSection = {
  id: "tpl-realestate-footer",
  templateId: "tpl-realestate-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">prime</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@prime.com\">info@prime.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 Prime Properties. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const PRIME_REALESTATE_SECTIONS: PageSection[] = [
  {
    id: "tpl-realestate-sec-1",
    templateId: "tpl-realestate-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Real Estate Agency</span><h1>Find your dream property today.</h1><p class=\"lead\">Real Estate Agency - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80\" alt=\"Prime Properties illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-realestate-sec-2",
    templateId: "tpl-realestate-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-realestate-sec-3",
    templateId: "tpl-realestate-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-realestate-sec-4",
    templateId: "tpl-realestate-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Buy</h3><p>Professional buy services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Sell</h3><p>Professional sell services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Rent</h3><p>Professional rent services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Property Management</h3><p>Professional property management services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-realestate-sec-5",
    templateId: "tpl-realestate-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Expert Agents</h4><p>Advanced expert agents capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Market Insights</h4><p>Advanced market insights capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Virtual Tours</h4><p>Advanced virtual tours capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Full Service</h4><p>Advanced full service capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-realestate-sec-6",
    templateId: "tpl-realestate-sec-6",
    name: "Section 6",
    html: "<section id=\"gallery\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Gallery</span><h2 class=\"title\">Our work</h2></div><div class=\"row g-4\"><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 1\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 2\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 3\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-160058515526-990dced4db0d?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 4\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 5\"></div><div class=\"col-md-4 col-lg-3\"><img src=\"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80\" class=\"img-fluid rounded-4\" alt=\"Gallery 6\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
  {
    id: "tpl-realestate-sec-7",
    templateId: "tpl-realestate-sec-7",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@prime.com\">info@prime.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 240 },
  },
];

export const PRIME_REALESTATE_HOME_PAGE: Page = {
  id: "page-realestate-home",
  name: "Home",
  slug: "home",
  sections: PRIME_REALESTATE_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const PRIME_REALESTATE_TEMPLATE: Template = {
  id: "tpl-prime-realestate",
  name: "Prime Real Estate",
  slug: "realestate",
  category: "Real Estate",
  description: "Luxury real estate property listings and broker template",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 19,
  widgets: [],
  pages: [PRIME_REALESTATE_HOME_PAGE],
  sharedHeader: PRIME_REALESTATE_SHARED_HEADER,
  sharedFooter: PRIME_REALESTATE_SHARED_FOOTER,
  assets: PRIME_REALESTATE_ASSETS,
  globalCss: PRIME_REALESTATE_GLOBAL_CSS,
  globalJs: PRIME_REALESTATE_GLOBAL_JS,
  customHead: PRIME_REALESTATE_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// Product Landing (Landing)
// ==========================================
export const PRODUCT_LANDING_ASSETS = {
  hero: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80",

};

export const PRODUCT_LANDING_GLOBAL_CSS = ":root{--primary:#7c3aed;--secondary:#06b6d4;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const PRODUCT_LANDING_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const PRODUCT_LANDING_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const PRODUCT_LANDING_SHARED_HEADER: PageSection = {
  id: "tpl-landing-header",
  templateId: "tpl-landing-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">product</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#features\">Features</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#pricing\">Pricing</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const PRODUCT_LANDING_SHARED_FOOTER: PageSection = {
  id: "tpl-landing-footer",
  templateId: "tpl-landing-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">product</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@product.com\">info@product.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 Product Launch. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const PRODUCT_LANDING_SECTIONS: PageSection[] = [
  {
    id: "tpl-landing-sec-1",
    templateId: "tpl-landing-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Coming Soon</span><h1>The last tool you will ever need.</h1><p class=\"lead\">Coming Soon - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80\" alt=\"Product Launch illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-landing-sec-2",
    templateId: "tpl-landing-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-landing-sec-3",
    templateId: "tpl-landing-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-landing-sec-4",
    templateId: "tpl-landing-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Feature One</h3><p>Professional feature one services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Feature Two</h3><p>Professional feature two services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Feature Three</h3><p>Professional feature three services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Feature Four</h3><p>Professional feature four services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-landing-sec-5",
    templateId: "tpl-landing-sec-5",
    name: "Pricing Plans",
    html: "<section id=\"pricing\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Pricing</span><h2 class=\"title\">Simple, transparent pricing</h2><p class=\"lead mt-3\" style=\"max-width:550px;margin:auto\">Choose the plan that fits your needs.</p></div><div class=\"row g-4 justify-content-center\"><div class=\"col-md-6 col-lg-4\"><div class=\"pricing-card  reveal\"><h3>Early Bird</h3><div class=\"price\">$19 <small>/month</small></div><p>Limited time offer</p><ul><li>All Features</li><li>Priority Support</li><li>Lifetime Discount</li></ul><a href=\"#contact\" class=\"btn btn-outline w-100\">Choose Early Bird</a></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-landing-sec-6",
    templateId: "tpl-landing-sec-6",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@product.com\">info@product.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
];

export const PRODUCT_LANDING_HOME_PAGE: Page = {
  id: "page-landing-home",
  name: "Home",
  slug: "home",
  sections: PRODUCT_LANDING_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const PRODUCT_LANDING_TEMPLATE: Template = {
  id: "tpl-product-landing",
  name: "Product Landing",
  slug: "landing",
  category: "Landing",
  description: "High-converting single product marketing landing page",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 20,
  widgets: [],
  pages: [PRODUCT_LANDING_HOME_PAGE],
  sharedHeader: PRODUCT_LANDING_SHARED_HEADER,
  sharedFooter: PRODUCT_LANDING_SHARED_FOOTER,
  assets: PRODUCT_LANDING_ASSETS,
  globalCss: PRODUCT_LANDING_GLOBAL_CSS,
  globalJs: PRODUCT_LANDING_GLOBAL_JS,
  customHead: PRODUCT_LANDING_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

// ==========================================
// Insights Blog (Blog)
// ==========================================
export const INSIGHTS_BLOG_ASSETS = {
  hero: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
  about: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80",
  preview: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",

};

export const INSIGHTS_BLOG_GLOBAL_CSS = ":root{--primary:#0891b2;--secondary:#06b6d4;--dark:#0f172a;--muted:#64748b;--light:#f8fafc;--white:#fff;--line:#e2e8f0;--radius:20px}*{box-sizing:border-box}html{scroll-behavior:smooth}body{font-family:\"Inter\",sans-serif;background:var(--light);color:var(--dark);overflow-x:hidden}a{text-decoration:none;color:inherit}section{padding:90px 0;scroll-margin-top:70px}.eyebrow{display:inline-block;color:var(--primary);font-weight:700;font-size:.7rem;letter-spacing:.2em;text-transform:uppercase;margin-bottom:12px}.title{font:800 clamp(2.2rem,4vw,3.8rem)/1.1 \"Playfair Display\",serif;letter-spacing:-.04em}.lead{color:var(--muted);font-size:1.05rem;line-height:1.7}.btn-primary{border:0;border-radius:999px;background:var(--primary);color:#fff;padding:13px 24px;font-weight:600;transition:.25s}.btn-primary:hover{background:var(--secondary);color:#fff;transform:translateY(-3px)}.btn-outline{border:1px solid var(--line);border-radius:999px;padding:12px 22px;font-weight:600;background:#fff;transition:.25s}.btn-outline:hover{border-color:var(--primary);color:var(--primary);transform:translateY(-3px)}\n.navbar{padding:15px 0;background:rgba(255,255,255,.92);backdrop-filter:blur(12px);border-bottom:1px solid transparent;transition:.3s}.navbar.scrolled{box-shadow:0 8px 25px rgba(15,23,42,.08);border-color:var(--line)}.navbar-brand{font:800 1.4rem \"Playfair Display\",serif;letter-spacing:-.05em}.nav-link{font-weight:600;font-size:.86rem;color:var(--dark)!important;margin:0 8px;position:relative}.nav-link:after{content:\"\";position:absolute;left:0;right:0;bottom:-4px;height:2px;background:var(--primary);transform:scaleX(0);transition:.25s}.nav-link:hover:after{transform:scaleX(1)}.navbar-toggler{border:0;box-shadow:none!important}.navbar-toggler-icon{background-image:none;width:26px;height:16px;position:relative;border-top:2px solid var(--dark);border-bottom:2px solid var(--dark)}.navbar-toggler-icon:after{content:\"\";position:absolute;top:6px;left:0;width:100%;border-top:2px solid var(--dark)}\n.hero{background:linear-gradient(135deg,#f1f5f9 0%,#fff 50%,#e0f2fe 100%);padding:140px 0 100px}.hero-art{width:min(100%,520px);margin:60px auto 40px;filter:drop-shadow(0 20px 30px rgba(15,23,42,.12));animation:float 5s ease-in-out infinite}.hero h1{font:800 clamp(2.8rem,5vw,4.8rem)/1.05 \"Playfair Display\",serif;letter-spacing:-.06em;max-width:600px;margin-bottom:22px}.hero h1 span{color:var(--primary)}.hero p{color:var(--muted);max-width:520px;font-size:1.08rem;line-height:1.75;margin-bottom:32px}.trust{background:var(--dark);color:#fff;padding:24px 0}.trust small{color:#94a3b8;font-weight:700;letter-spacing:.12em;text-transform:uppercase;font-size:.7rem}.trust .brands{display:flex;flex-wrap:wrap;gap:24px;margin-top:14px;opacity:.75;font:700 1rem \"Inter\",sans-serif}\n.card{border:0;border-radius:var(--radius);background:#fff;box-shadow:0 10px 30px rgba(15,23,42,.06);transition:.3s;height:100%}.card:hover{transform:translateY(-7px);box-shadow:0 18px 40px rgba(15,23,42,.1)}.service-card{padding:30px}.service-icon{width:50px;height:50px;border-radius:14px;display:grid;place-items:center;background:rgba(59,130,246,.1);font-size:1.3rem;margin-bottom:20px;color:var(--primary)}.service-card h3{font:700 1.2rem \"Inter\",sans-serif;margin-bottom:10px}.service-card p{color:var(--muted);font-size:.9rem;line-height:1.7}.feature-card{padding:28px}.feature-icon{font-size:1.8rem;margin-bottom:16px}.feature-card h4{font:700 1.1rem \"Inter\",sans-serif;margin-bottom:8px}.feature-card p{color:var(--muted);font-size:.88rem;line-height:1.65}\n.pricing-card{padding:32px;border:1px solid var(--line);border-radius:var(--radius);background:#fff;transition:.3s}.pricing-card.popular{background:var(--dark);color:#fff;border-color:var(--dark);transform:translateY(-8px)}.pricing-card.popular p{color:#94a3b8}.pricing-card h3{font:700 1.3rem \"Inter\",sans-serif}.price{font:800 2.8rem \"Inter\",sans-serif;letter-spacing:-.06em;margin:18px 0 5px}.price small{font:500 .8rem;color:var(--muted)}.pricing-card.popular small{color:#94a3b8}.pricing-card p{color:var(--muted);font-size:.9rem}.pricing-card ul{list-style:none;padding:0;margin:22px 0}.pricing-card li{padding:9px 0;border-bottom:1px solid var(--line);font-size:.87rem}.pricing-card.popular li{border-color:rgba(255,255,255,.12)}.pricing-card li:before{content:\"✓\";color:var(--primary);font-weight:700;margin-right:8px}.pricing-card.popular li:before{color:#22d3ee}\n.contact-box{background:#fff;border:1px solid var(--line);border-radius:24px;padding:clamp(24px,5vw,45px);box-shadow:0 12px 28px rgba(15,23,42,.06)}.contact-detail strong{display:block;text-transform:uppercase;letter-spacing:.12em;font-size:.68rem;color:var(--primary);margin-bottom:5px}.contact-detail a,.contact-detail span{color:var(--dark);font-weight:600}.form-control{padding:12px 14px;border-color:var(--line);border-radius:10px}.form-control:focus{box-shadow:0 0 0 .2rem rgba(59,130,246,.15);border-color:var(--primary)}.form-label{font-size:.8rem;font-weight:700}\n.footer{background:#0f172a;color:#e2e8f0;padding:60px 0 20px}.footer p,.footer a{color:#94a3b8;font-size:.88rem}.footer h5{font:700 .8rem \"Inter\",sans-serif;text-transform:uppercase;letter-spacing:.12em;margin-bottom:16px;color:#fff}.footer a{display:block;margin:8px 0;transition:.2s}.footer a:hover{color:#22d3ee;transform:translateX(3px)}.social a{display:inline-grid;place-items:center;width:32px;height:32px;margin:0 6px 0 0;border:1px solid rgba(255,255,255,.16);border-radius:50%;color:#fff;font-size:.8rem}.footer-bottom{border-top:1px solid rgba(255,255,255,.1);margin-top:40px;padding-top:18px;font-size:.76rem;color:#64748b}.top{position:fixed;right:20px;bottom:20px;z-index:99;width:44px;height:44px;border-radius:50%;display:grid;place-items:center;background:var(--primary);color:#fff;box-shadow:0 8px 22px rgba(59,130,246,.35);transition:.25s;font-size:1.2rem}.top:hover{color:#fff;transform:translateY(-5px)}\n.reveal{animation:rise .7s both;animation-timeline:view();animation-range:entry 10% cover 30%}@keyframes float{50%{transform:translateY(-12px)}}@keyframes rise{from{opacity:0;transform:translateY(25px)}to{opacity:1;transform:none}}@media(max-width:991px){.hero-art{margin:30px auto 60px;width:80%}.navbar-collapse{padding:15px 0}.navbar .btn-primary{margin-top:10px}}@media(max-width:575px){section{padding:65px 0}.hero h1{font-size:2.5rem}.hero-art{width:100%;margin-bottom:50px}.carousel-control-next,.carousel-control-prev{display:none}.pricing-card.popular{transform:none}}@media(prefers-reduced-motion:reduce){*,*:before,*:after{animation-duration:.01ms!important;animation-iteration-count:1!important;scroll-behavior:auto!important}}";

export const INSIGHTS_BLOG_GLOBAL_JS = "addEventListener('scroll', () => {\n  const nav = document.querySelector('.navbar');\n  if (nav) nav.classList.toggle('scrolled', window.scrollY > 20);\n});\ndocument.querySelectorAll('.nav-link, a[href^=\"#\"]').forEach((a) => {\n  a.addEventListener('click', (e) => {\n    const href = a.getAttribute('href');\n    if (!href || href === '#' || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('tel')) return;\n    let target = null;\n    try { target = document.querySelector(href); } catch(_) {}\n    if (!target && (href === '#home' || href === '#top')) {\n      target = document.querySelector('.hero') || document.querySelector('section') || document.body;\n    }\n    if (target) {\n      e.preventDefault();\n      target.scrollIntoView({ behavior: 'smooth' });\n      if (typeof window !== 'undefined' && window.bootstrap) {\n        const collapseEl = document.querySelector('.navbar-collapse.show');\n        if (collapseEl) window.bootstrap.Collapse?.getOrCreateInstance?.(collapseEl)?.hide?.();\n      }\n    }\n  });\n});";

export const INSIGHTS_BLOG_CUSTOM_HEAD = "<link href=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css\" rel=\"stylesheet\">\n<link rel=\"preconnect\" href=\"https://fonts.googleapis.com\">\n<link rel=\"preconnect\" href=\"https://fonts.gstatic.com\" crossorigin>\n<link href=\"https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap\" rel=\"stylesheet\">\n<script src=\"https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js\"></script>";

export const INSIGHTS_BLOG_SHARED_HEADER: PageSection = {
  id: "tpl-blog-header",
  templateId: "tpl-blog-header",
  name: "Header Navigation",
  html: "<nav class=\"navbar navbar-expand-lg fixed-top\"><div class=\"container\"><a class=\"navbar-brand\" href=\"#home\">insights</a><button class=\"navbar-toggler\" type=\"button\" data-bs-toggle=\"collapse\" data-bs-target=\"#mainNav\"><span class=\"navbar-toggler-icon\"></span></button><div class=\"collapse navbar-collapse justify-content-end\" id=\"mainNav\"><ul class=\"navbar-nav align-items-lg-center me-lg-3\"><li class=\"nav-item\"><a class=\"nav-link\" href=\"#home\">Home</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#articles\">Articles</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#categories\">Categories</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#about\">About</a></li><li class=\"nav-item\"><a class=\"nav-link\" href=\"#contact\">Contact</a></li></ul><a href=\"#contact\" class=\"btn btn-primary\">Get Started</a></div></div></nav>",
  shared: "header",
  widgetInstance: undefined,
};

export const INSIGHTS_BLOG_SHARED_FOOTER: PageSection = {
  id: "tpl-blog-footer",
  templateId: "tpl-blog-footer",
  name: "Footer & Back to Top",
  html: "<footer class=\"footer\"><div class=\"container\"><div class=\"row g-5\"><div class=\"col-lg-4\"><a class=\"navbar-brand text-white\" href=\"#home\">insights</a><p class=\"mt-3\" style=\"max-width:280px\">Professional solutions for modern businesses.</p><div class=\"social mt-3\"><a href=\"#\" aria-label=\"LinkedIn\">in</a><a href=\"#\" aria-label=\"Twitter\">tw</a><a href=\"#\" aria-label=\"Instagram\">ig</a></div></div><div class=\"col-6 col-lg-2\"><h5>Quick Links</h5><a href=\"#home\">Home</a><a href=\"#about\">About</a><a href=\"#services\">Services</a><a href=\"#contact\">Contact</a></div><div class=\"col-6 col-lg-2\"><h5>Services</h5><a href=\"#services\">Consulting</a><a href=\"#services\">Strategy</a><a href=\"#services\">Support</a></div><div class=\"col-lg-4\"><h5>Contact</h5><a href=\"mailto:info@insights.com\">info@insights.com</a><a href=\"tel:+15550123456\">+1 (555) 012-3456</a><p class=\"mt-3\">123 Business Street<br>City, State 12345</p></div></div><div class=\"footer-bottom d-flex justify-content-between flex-wrap gap-2\"><span>© 2026 Insights Blog. All rights reserved.</span><span>Privacy · Terms</span></div></div></footer>",
  shared: "footer",
  widgetInstance: undefined,
};

export const INSIGHTS_BLOG_SECTIONS: PageSection[] = [
  {
    id: "tpl-blog-sec-1",
    templateId: "tpl-blog-sec-1",
    name: "Hero",
    html: "<section id=\"home\" class=\"hero\"><div class=\"container\"><div class=\"row align-items-center\"><div class=\"col-lg-6\"><span class=\"eyebrow\">Personal Blog</span><h1>Thoughts on design, tech, and life.</h1><p class=\"lead\">Personal Blog - Professional solutions tailored for your success.</p><div class=\"d-flex flex-wrap gap-3\"><a class=\"btn btn-primary\" href=\"#contact\">Get Started</a><a class=\"btn btn-outline\" href=\"#features\">Learn More</a></div></div><div class=\"col-lg-6\"><img class=\"hero-art\" src=\"https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80\" alt=\"Insights Blog illustration\"></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 0 },
  },
  {
    id: "tpl-blog-sec-2",
    templateId: "tpl-blog-sec-2",
    name: "Trust & Logos",
    html: "<div class=\"trust\"><div class=\"container\"><small>Trusted by industry leaders</small><div class=\"brands\"><span>ACME Corp</span><span>GlobalTech</span><span>Innovate</span><span>Vertex</span><span>Nexus</span></div></div></div>",
    animation: { type: "fade-up", duration: 700, delay: 40 },
  },
  {
    id: "tpl-blog-sec-3",
    templateId: "tpl-blog-sec-3",
    name: "About Us",
    html: "<section id=\"about\"><div class=\"container\"><div class=\"row g-5 align-items-center\"><div class=\"col-lg-6\"><img src=\"https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1000&q=80\" class=\"img-fluid rounded-4 shadow\" alt=\"About\"></div><div class=\"col-lg-6\"><span class=\"eyebrow\">About Us</span><h2 class=\"title mb-4\">Building the future, one project at a time.</h2><p class=\"lead\">We combine expertise with innovation to deliver exceptional results. Our team is dedicated to your success.</p><div class=\"row g-4 mt-4\"><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">✦</div><h4>Expert Team</h4><p>Seasoned professionals ready to help.</p></div></div><div class=\"col-6\"><div class=\"card feature-card\"><div class=\"feature-icon\">♥</div><h4>24/7 Support</h4><p>Always here when you need us.</p></div></div></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 80 },
  },
  {
    id: "tpl-blog-sec-4",
    templateId: "tpl-blog-sec-4",
    name: "Services",
    html: "<section id=\"services\" class=\"bg-white\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Our Services</span><h2 class=\"title\">Everything you need to succeed</h2><p class=\"lead mt-3\" style=\"max-width:600px;margin:auto\">Comprehensive solutions designed to meet your unique challenges and drive growth.</p></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Design</h3><p>Professional design services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Technology</h3><p>Professional technology services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Business</h3><p>Professional business services tailored to your needs.</p></div></div><div class=\"col-md-6 col-lg-3\"><div class=\"card service-card reveal\"><div class=\"service-icon\">✦</div><h3>Lifestyle</h3><p>Professional lifestyle services tailored to your needs.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 120 },
  },
  {
    id: "tpl-blog-sec-5",
    templateId: "tpl-blog-sec-5",
    name: "Features",
    html: "<section id=\"features\"><div class=\"container\"><div class=\"text-center mb-5\"><span class=\"eyebrow\">Features</span><h2 class=\"title\">Why choose us</h2></div><div class=\"row g-4\"><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Weekly Posts</h4><p>Advanced weekly posts capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Expert Insights</h4><p>Advanced expert insights capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Community</h4><p>Advanced community capabilities for your business.</p></div></div><div class=\"col-md-6 col-lg-4\"><div class=\"card feature-card reveal\"><div class=\"feature-icon\">✓</div><h4>Newsletter</h4><p>Advanced newsletter capabilities for your business.</p></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 160 },
  },
  {
    id: "tpl-blog-sec-6",
    templateId: "tpl-blog-sec-6",
    name: "Contact Us",
    html: "<section id=\"contact\"><div class=\"container\"><div class=\"contact-box\"><div class=\"row g-5\"><div class=\"col-lg-5\"><span class=\"eyebrow\">Contact Us</span><h2 class=\"title mb-4\">Let's work together</h2><p class=\"lead\">Ready to start your project? Get in touch with us today.</p><div class=\"contact-detail mt-4\"><strong>Email</strong><a href=\"mailto:info@insights.com\">info@insights.com</a></div><div class=\"contact-detail\"><strong>Phone</strong><a href=\"tel:+15550123456\">+1 (555) 012-3456</a></div><div class=\"contact-detail\"><strong>Address</strong><span>123 Business Street, City, State 12345</span></div></div><div class=\"col-lg-7\"><form action=\"#\" method=\"post\"><div class=\"row g-3\"><div class=\"col-md-6\"><label class=\"form-label\" for=\"name\">Your Name</label><input class=\"form-control\" id=\"name\" type=\"text\" placeholder=\"John Doe\" required></div><div class=\"col-md-6\"><label class=\"form-label\" for=\"email\">Email</label><input class=\"form-control\" id=\"email\" type=\"email\" placeholder=\"john@example.com\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"subject\">Subject</label><input class=\"form-control\" id=\"subject\" type=\"text\" placeholder=\"How can we help?\" required></div><div class=\"col-12\"><label class=\"form-label\" for=\"message\">Message</label><textarea class=\"form-control\" id=\"message\" rows=\"5\" placeholder=\"Tell us about your project...\"></textarea></div><div class=\"col-12\"><button class=\"btn btn-primary\" type=\"submit\">Send Message →</button></div></div></form></div></div></div></div></section>",
    animation: { type: "fade-up", duration: 700, delay: 200 },
  },
];

export const INSIGHTS_BLOG_HOME_PAGE: Page = {
  id: "page-blog-home",
  name: "Home",
  slug: "home",
  sections: INSIGHTS_BLOG_SECTIONS,
  useGlobalHeader: true,
  useGlobalFooter: true,
  hideHeader: false,
  hideFooter: false,
};

export const INSIGHTS_BLOG_TEMPLATE: Template = {
  id: "tpl-insights-blog",
  name: "Insights Blog",
  slug: "blog",
  category: "Blog",
  description: "Clean modern publication and article editorial template",
  status: "published",
  thumbnail: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
  previewImage: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?auto=format&fit=crop&w=1200&q=80",
  featured: true,
  isNew: true,
  sortOrder: 21,
  widgets: [],
  pages: [INSIGHTS_BLOG_HOME_PAGE],
  sharedHeader: INSIGHTS_BLOG_SHARED_HEADER,
  sharedFooter: INSIGHTS_BLOG_SHARED_FOOTER,
  assets: INSIGHTS_BLOG_ASSETS,
  globalCss: INSIGHTS_BLOG_GLOBAL_CSS,
  globalJs: INSIGHTS_BLOG_GLOBAL_JS,
  customHead: INSIGHTS_BLOG_CUSTOM_HEAD,
  createdBy: "system",
  createdAt: new Date("2026-03-08"),
  updatedAt: new Date("2026-03-08"),
};

export const ALL_NEW_WEBSITE_TEMPLATES: Template[] = [
  CLOUDFLOW_SAAS_TEMPLATE,
  LAUNCHPAD_STARTUP_TEMPLATE,
  APEX_CONSULTING_TEMPLATE,
  MERIDIAN_CORPORATE_TEMPLATE,
  TECHCORE_IT_TEMPLATE,
  ALEX_PORTFOLIO_TEMPLATE,
  JAMES_RESUME_TEMPLATE,
  CREATIVE_FREELANCE_TEMPLATE,
  STUDIO_DESIGNER_TEMPLATE,
  DEV_DEVELOPER_TEMPLATE,
  SHOPPRO_PRODUCT_TEMPLATE,
  LUXE_FASHION_TEMPLATE,
  GOURMET_RESTAURANT_TEMPLATE,
  TECHGADGETS_ELECTRONICS_TEMPLATE,
  GRAND_EVENT_TEMPLATE,
  LINCOLN_SCHOOL_TEMPLATE,
  FITLIFE_GYM_TEMPLATE,
  PRIME_REALESTATE_TEMPLATE,
  PRODUCT_LANDING_TEMPLATE,
  INSIGHTS_BLOG_TEMPLATE,
];

export const CUSTOM_WEBSITE_CHROME_MAP: Record<string, { sharedHeader: PageSection; sharedFooter: PageSection; assets: Record<string, any> }> = {
  "tpl-cloudflow-saas": { sharedHeader: CLOUDFLOW_SAAS_SHARED_HEADER, sharedFooter: CLOUDFLOW_SAAS_SHARED_FOOTER, assets: CLOUDFLOW_SAAS_ASSETS },
  "tpl-launchpad-startup": { sharedHeader: LAUNCHPAD_STARTUP_SHARED_HEADER, sharedFooter: LAUNCHPAD_STARTUP_SHARED_FOOTER, assets: LAUNCHPAD_STARTUP_ASSETS },
  "tpl-apex-consulting": { sharedHeader: APEX_CONSULTING_SHARED_HEADER, sharedFooter: APEX_CONSULTING_SHARED_FOOTER, assets: APEX_CONSULTING_ASSETS },
  "tpl-meridian-corporate": { sharedHeader: MERIDIAN_CORPORATE_SHARED_HEADER, sharedFooter: MERIDIAN_CORPORATE_SHARED_FOOTER, assets: MERIDIAN_CORPORATE_ASSETS },
  "tpl-techcore-it": { sharedHeader: TECHCORE_IT_SHARED_HEADER, sharedFooter: TECHCORE_IT_SHARED_FOOTER, assets: TECHCORE_IT_ASSETS },
  "tpl-alex-portfolio": { sharedHeader: ALEX_PORTFOLIO_SHARED_HEADER, sharedFooter: ALEX_PORTFOLIO_SHARED_FOOTER, assets: ALEX_PORTFOLIO_ASSETS },
  "tpl-james-resume": { sharedHeader: JAMES_RESUME_SHARED_HEADER, sharedFooter: JAMES_RESUME_SHARED_FOOTER, assets: JAMES_RESUME_ASSETS },
  "tpl-creative-freelance": { sharedHeader: CREATIVE_FREELANCE_SHARED_HEADER, sharedFooter: CREATIVE_FREELANCE_SHARED_FOOTER, assets: CREATIVE_FREELANCE_ASSETS },
  "tpl-studio-designer": { sharedHeader: STUDIO_DESIGNER_SHARED_HEADER, sharedFooter: STUDIO_DESIGNER_SHARED_FOOTER, assets: STUDIO_DESIGNER_ASSETS },
  "tpl-dev-developer": { sharedHeader: DEV_DEVELOPER_SHARED_HEADER, sharedFooter: DEV_DEVELOPER_SHARED_FOOTER, assets: DEV_DEVELOPER_ASSETS },
  "tpl-shoppro-product": { sharedHeader: SHOPPRO_PRODUCT_SHARED_HEADER, sharedFooter: SHOPPRO_PRODUCT_SHARED_FOOTER, assets: SHOPPRO_PRODUCT_ASSETS },
  "tpl-luxe-fashion": { sharedHeader: LUXE_FASHION_SHARED_HEADER, sharedFooter: LUXE_FASHION_SHARED_FOOTER, assets: LUXE_FASHION_ASSETS },
  "tpl-gourmet-restaurant": { sharedHeader: GOURMET_RESTAURANT_SHARED_HEADER, sharedFooter: GOURMET_RESTAURANT_SHARED_FOOTER, assets: GOURMET_RESTAURANT_ASSETS },
  "tpl-techgadgets-electronics": { sharedHeader: TECHGADGETS_ELECTRONICS_SHARED_HEADER, sharedFooter: TECHGADGETS_ELECTRONICS_SHARED_FOOTER, assets: TECHGADGETS_ELECTRONICS_ASSETS },
  "tpl-grand-event": { sharedHeader: GRAND_EVENT_SHARED_HEADER, sharedFooter: GRAND_EVENT_SHARED_FOOTER, assets: GRAND_EVENT_ASSETS },
  "tpl-lincoln-school": { sharedHeader: LINCOLN_SCHOOL_SHARED_HEADER, sharedFooter: LINCOLN_SCHOOL_SHARED_FOOTER, assets: LINCOLN_SCHOOL_ASSETS },
  "tpl-fitlife-gym": { sharedHeader: FITLIFE_GYM_SHARED_HEADER, sharedFooter: FITLIFE_GYM_SHARED_FOOTER, assets: FITLIFE_GYM_ASSETS },
  "tpl-prime-realestate": { sharedHeader: PRIME_REALESTATE_SHARED_HEADER, sharedFooter: PRIME_REALESTATE_SHARED_FOOTER, assets: PRIME_REALESTATE_ASSETS },
  "tpl-product-landing": { sharedHeader: PRODUCT_LANDING_SHARED_HEADER, sharedFooter: PRODUCT_LANDING_SHARED_FOOTER, assets: PRODUCT_LANDING_ASSETS },
  "tpl-insights-blog": { sharedHeader: INSIGHTS_BLOG_SHARED_HEADER, sharedFooter: INSIGHTS_BLOG_SHARED_FOOTER, assets: INSIGHTS_BLOG_ASSETS },
  "tpl-drivepro-driving-school": { sharedHeader: DRIVE_PRO_SHARED_HEADER, sharedFooter: DRIVE_PRO_SHARED_FOOTER, assets: DRIVE_PRO_ASSETS },
};
