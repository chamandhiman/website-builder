const CATEGORIES = [
  "Real Estate",
  "Fitness",
  "Café",
  "SaaS",
  "E-commerce",
  "Portfolio",
  "Events",
  "Agency",
  "Travel",
  "Education",
  "Medical",
  "Law",
  "Beauty & Salon",
  "Freelancer",
];

export function LandingStrip() {
  const content = CATEGORIES.map((c) => `${c} ✦ `).join("");
  const repeated = content + content;

  return (
    <div className="strip">
      <div>
        <span>{repeated}</span>
        <span>{repeated}</span>
      </div>
    </div>
  );
}
