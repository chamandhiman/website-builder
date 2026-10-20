export const WIDGET_SELECTION_LABELS: Record<string, string> = {
  navbar: "Header",
  header: "Header",
  hero: "Banner",
  banner: "Banner",
  grid: "Grid",
  heading: "Heading",
  text: "Paragraph",
  paragraph: "Paragraph",
  button: "Button",
  image: "Image",
  container: "Container",
  footer: "Footer",
  carousel: "Carousel",
  gallery: "Image Gallery",
  faq: "FAQ",
  services: "Services",
  about: "About Us",
  cta: "Call To Action",
  team: "Team",
  pricing: "Pricing Section",
  testimonials: "Testimonials",
  "google-reviews": "Google Reviews",
  "overlay-banner": "Background Image overlay text banner",
  youtube: "YouTube Video",
  vimeo: "Vimeo Video",
  map: "Google Map",
  "google-map": "Google Map",
  store_locator: "Store Locator",
  "custom-html": "Custom HTML / Embed",
};

export function getWidgetSelectionLabel(type?: string | null, fallback = "Widget"): string {
  if (!type) return fallback;
  const key = String(type).trim().toLowerCase();
  if (WIDGET_SELECTION_LABELS[key]) return WIDGET_SELECTION_LABELS[key];
  if (!key) return fallback;
  return key.charAt(0).toUpperCase() + key.slice(1);
}