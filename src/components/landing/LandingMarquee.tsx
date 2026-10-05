export function LandingMarquee() {
  const words = [
    "Real Estate",
    "Fitness",
    "Portfolios",
    "Restaurants",
    "SaaS",
    "E-commerce",
    "Events",
    "Agencies",
  ];

  const content = words.map((w, i) => <span key={i}>{w}</span>);

  return (
    <div className="marquee">
      <div className="marquee-in" id="mq">
        {content}
        {content}
        {content}
      </div>
    </div>
  );
}
