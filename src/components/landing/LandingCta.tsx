interface LandingCtaProps {
  onStartBuilding: () => void;
}

export function LandingCta({ onStartBuilding }: LandingCtaProps) {
  const handleScrollToTemplates = (e: React.MouseEvent) => {
    e.preventDefault();
    const target = document.getElementById("templates");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="cta cta-v2" id="launch">
      <div className="orb" />
      <div className="cta-eyebrow">
        <span>—</span> READY TO LAUNCH <span>—</span>
      </div>
      <h2>
        Pick one. Launch <span className="hl">in minutes.</span>
      </h2>

      <div className="cta-steps-v2">
        <span className="cta-pill">
          <i className="cta-check">✓</i> Sign up free
        </span>
        <span className="cta-pill">
          <i className="cta-check">✓</i> Pick a template
        </span>
        <span className="cta-pill">
          <i className="cta-check">✓</i> Edit live
        </span>
        <span className="cta-pill">
          <i className="cta-check">✓</i> Download or publish
        </span>
      </div>

      <div className="cta-btns">
        <button
          type="button"
          className="btn btn-y btn-lg cta-btn-primary"
          onClick={onStartBuilding}
        >
          Start Free →
        </button>
        <a
          className="btn btn-w btn-lg cta-btn-secondary"
          href="#templates"
          onClick={handleScrollToTemplates}
        >
          Browse Templates
        </a>
      </div>
    </section>
  );
}
