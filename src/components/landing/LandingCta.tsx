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
    <section className="cta" id="launch">
      <div className="orb" />
      <div className="eyebrow">
        <i></i>Ready?
      </div>
      <h2>
        Pick one.
        <br />
        Launch in <span className="hl">minutes.</span>
      </h2>

      <div className="steps">
        <span>
          <b>1</b>Sign up
        </span>
        <em>→</em>
        <span>
          <b>2</b>Pick a template
        </span>
        <em>→</em>
        <span>
          <b>3</b>Edit
        </span>
        <em>→</em>
        <span>
          <b>4</b>Download
        </span>
      </div>

      <div className="cta-btns">
        <button
          type="button"
          className="btn btn-y btn-lg"
          onClick={onStartBuilding}
        >
          Start free →
        </button>
        <a
          className="btn btn-w btn-lg"
          href="#templates"
          onClick={handleScrollToTemplates}
        >
          Browse templates
        </a>
      </div>
    </section>
  );
}
