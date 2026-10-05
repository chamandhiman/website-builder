export function DownloadPanel() {
  const codeLines = [
    '<span class="t">&lt;!doctype html&gt;</span>',
    '<span class="t">&lt;html</span> <span class="k">lang</span>=<span class="s">"en"</span><span class="t">&gt;</span>',
    '<span class="t">&lt;head&gt;</span>',
    '  <span class="t">&lt;title&gt;</span>DreamHome<span class="t">&lt;/title&gt;</span>',
    '  <span class="t">&lt;link</span> <span class="k">rel</span>=<span class="s">"stylesheet"</span> <span class="k">href</span>=<span class="s">"styles.css"</span><span class="t">&gt;</span>',
    '<span class="t">&lt;/head&gt;</span>',
    '<span class="t">&lt;body&gt;</span>',
    '  <span class="t">&lt;section</span> <span class="k">class</span>=<span class="s">"hero"</span><span class="t">&gt;</span>',
    '    <span class="t">&lt;h1&gt;</span>Live where light lives.<span class="t">&lt;/h1&gt;</span>',
    '    <span class="t">&lt;a</span> <span class="k">class</span>=<span class="s">"btn"</span><span class="t">&gt;</span>Book a tour<span class="t">&lt;/a&gt;</span>',
    '  <span class="t">&lt;/section&gt;</span>',
    '  <span class="t">&lt;section</span> <span class="k">class</span>=<span class="s">"listings"</span><span class="t">&gt;</span>…',
    '  <span class="t">&lt;script</span> <span class="k">src</span>=<span class="s">"main.js"</span><span class="t">&gt;&lt;/script&gt;</span>',
    '<span class="t">&lt;/body&gt;</span>',
    '<span class="t">&lt;/html&gt;</span>',
  ];

  return (
    <section className="panel" data-name="03 — Download" id="panel-2">
      <div className="split">
        <div>
          <div className="eyebrow">
            <i />
            Export & own
          </div>
          <h2>
            Your site.
            <br />
            Your code.
            <br />
            <span className="hl">Your rules.</span>
          </h2>
          <p className="lead">
            Download a clean, production-ready bundle in one click. Host it
            anywhere — or publish to your own domain with us.
          </p>

          <div className="formats">
            <span>
              <b>.html</b> Static site
            </span>
            <span>
              <b>.zip</b> Full bundle
            </span>
            <span>
              <b>↗</b> 1-click publish
            </span>
          </div>
        </div>

        <div className="dl-wrap" id="dl">
          <pre className="code" id="code">
            {codeLines.map((line, idx) => (
              <div
                key={idx}
                className="cl"
                dangerouslySetInnerHTML={{ __html: line }}
              />
            ))}
          </pre>

          <div className="file" style={{ left: "6%", top: "14%" }}>
            <i style={{ background: "#ff8fa3" }} />
            index.html
          </div>
          <div className="file" style={{ right: "8%", top: "22%" }}>
            <i style={{ background: "#8ee6c3" }} />
            styles.css
          </div>
          <div className="file" style={{ left: "12%", bottom: "22%" }}>
            <i style={{ background: "#FFD21F" }} />
            main.js
          </div>
          <div className="file" style={{ right: "4%", bottom: "14%" }}>
            <i style={{ background: "#9b8cff" }} />
            /assets
          </div>

          <div className="zip">
            <svg viewBox="0 0 64 64" fill="none">
              <rect
                x="12"
                y="6"
                width="40"
                height="52"
                rx="8"
                stroke="#111"
                strokeWidth="3.5"
              />
              <path
                d="M32 22v20M23 34l9 9 9-9"
                stroke="#111"
                strokeWidth="3.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <b>dreamhome.zip</b>
            <small id="dlTxt">Packing 7 pages…</small>
            <div className="prog">
              <i id="dlBar" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
