export function LandingFeatures() {
  return (
    <section className="sec alt" id="features">
      <div className="wrap">
        <div className="head rv in">
          <div className="eyebrow">
            <i></i>Features
          </div>
          <h2>
            Everything to go <span className="hl">live fast.</span>
          </h2>
          <p>Edit, export and extend — all from one builder.</p>
        </div>

        <div className="feat">
          {/* Bento Card 1: Live edit in browser */}
          <div className="fc rv in">
            <div className="ico">
              <svg className="ic">
                <use href="#i-edit" />
              </svg>
            </div>
            <h3>Live edit in your browser</h3>
            <p>
              Click any heading, image or button and change it instantly. No code needed.
            </p>
            <div className="edit">
              <span className="chip">Heading</span>
              <br />
              <span className="tt">
                Your dream home<span className="caret"></span>
              </span>
            </div>
          </div>

          {/* Bento Card 2: Download clean HTML */}
          <div className="fc rv in">
            <div className="ico">
              <svg className="ic">
                <use href="#i-download" />
              </svg>
            </div>
            <h3>Download clean HTML</h3>
            <p>
              Get a fast HTML, CSS and JS website. Upload it anywhere — you own the code.
            </p>
            <pre className="code">
              <span className="t">&lt;section</span>{" "}
              <span className="k">class</span>=
              <span className="s">"hero"</span>
              <span className="t">&gt;</span>
              {"\n  "}
              <span className="t">&lt;h1&gt;</span>Your dream home
              <span className="t">&lt;/h1&gt;</span>
              {"\n"}
              <span className="t">&lt;/section&gt;</span>
            </pre>
          </div>

          {/* Bento Card 3: Download React version */}
          <div className="fc rv in">
            <div className="ico">
              <svg className="ic">
                <use href="#i-react" />
              </svg>
            </div>
            <h3>Download React version</h3>
            <p>Export your site as reusable React components.</p>
            <pre className="code">
              <span className="k">export default function</span>{" "}
              <span className="t">Hero</span>(){"{"}
              {"\n  "}
              <span className="k">return</span> &lt;h1&gt;Your dream home&lt;/h1&gt;
              {"\n"}
              {"}"}
            </pre>
          </div>

          {/* Bento Card 4: Premium widgets */}
          <div className="fc rv in">
            <div className="ico">
              <svg className="ic">
                <use href="#i-grid" />
              </svg>
            </div>
            <h3>Premium widgets</h3>
            <p>
              Add chat, pricing tables, countdowns, popups and more with one click.
            </p>
          </div>

          {/* Bento Card 5: 120+ templates */}
          <div className="fc rv in">
            <div className="ico">
              <svg className="ic">
                <use href="#i-layout" />
              </svg>
            </div>
            <h3>120+ templates</h3>
            <p>
              Real estate, fitness, café, SaaS, shops, portfolios and more — new ones
              every week.
            </p>
          </div>

          {/* Bento Card 6: Mobile + SEO ready */}
          <div className="fc rv in">
            <div className="ico">
              <svg className="ic">
                <use href="#i-zap" />
              </svg>
            </div>
            <h3>Mobile + SEO ready</h3>
            <p>
              Every site is responsive and ships with meta tags, clean headings and
              fast loading.
            </p>
            <div className="seo-row">
              <span>✓ Responsive</span>
              <span>✓ Meta tags</span>
              <span>✓ Fast load</span>
              <span>✓ Clean code</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
