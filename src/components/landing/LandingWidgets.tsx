import { useState } from "react";
import { toast } from "sonner";

interface LandingWidgetsProps {
  onAddWidget?: (widgetName: string) => void;
}

const WIDGETS = [
  { icon: "chat", name: "Live Chat Bubble", desc: "Talk to visitors on any page.", pro: true },
  { icon: "dollar", name: "Pricing Table", desc: "Three plans with monthly/yearly toggle.", pro: true },
  { icon: "clock", name: "Countdown Timer", desc: "Launch or sale countdown banner.", pro: true },
  { icon: "star", name: "Testimonial Slider", desc: "Auto-sliding review cards.", pro: true },
  { icon: "mail", name: "Newsletter Popup", desc: "Exit-intent signup popup.", pro: true },
  { icon: "phone", name: "WhatsApp Button", desc: "Floating click-to-chat button.", pro: true },
  { icon: "shield", name: "Cookie Banner", desc: "Consent bar for privacy rules.", pro: false },
  { icon: "image", name: "Gallery Lightbox", desc: "Full-screen image gallery.", pro: true },
  { icon: "help", name: "FAQ Accordion", desc: "Questions that open and close.", pro: false },
  { icon: "send", name: "Contact Form", desc: "Form that sends to your email.", pro: true },
  { icon: "pin", name: "Google Map", desc: "Show your location with a pin.", pro: false },
  { icon: "share", name: "Social Feed", desc: "Show your latest posts.", pro: true },
  { icon: "play", name: "Video Popup", desc: "Play videos in a pop-up.", pro: true },
  { icon: "bell", name: "Announcement Bar", desc: "Top bar for offers and news.", pro: false },
  { icon: "users", name: "Team Cards", desc: "Show your team with photos.", pro: false },
  { icon: "chart", name: "Stats Counter", desc: "Numbers that count up.", pro: true },
];

export function LandingWidgets({ onAddWidget }: LandingWidgetsProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleCount = showAll ? WIDGETS.length : 8;

  const handleAddWidget = (name: string) => {
    toast.success(`✓ ${name} widget added — sign up free to use it in your website!`);
    if (onAddWidget) {
      onAddWidget(name);
    }
  };

  const handleToggle = () => {
    const nextState = !showAll;
    setShowAll(nextState);
    if (!nextState) {
      const el = document.getElementById("widgets");
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section className="sec" id="widgets">
      <div className="wrap">
        <div className="head rv in">
          <div className="eyebrow">
            <i></i>Premium widgets
          </div>
          <h2>
            Add power with <span className="hl">one click.</span>
          </h2>
          <p>Drop ready-made widgets into any template. No plugins, no setup.</p>
        </div>
      </div>

      <div className="wwrap">
        <div className={`wgrid ${showAll ? "all" : ""}`} id="wgrid">
          {WIDGETS.map((w, i) => (
            <div key={w.name} className={`wd ${i >= 8 ? "xtra" : ""}`}>
              <span className={`pro ${w.pro ? "" : "free"}`}>
                {w.pro ? "PREMIUM" : "FREE"}
              </span>
              <span className="wi">
                <svg className="ic">
                  <use href={`#i-${w.icon}`} />
                </svg>
              </span>
              <h4>{w.name}</h4>
              <p>{w.desc}</p>
              <button
                type="button"
                className="btn btn-k sm"
                onClick={() => handleAddWidget(w.name)}
              >
                + Add widget
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="wmore">
        <button
          type="button"
          className={`btn btn-w btn-lg ${showAll ? "open" : ""}`}
          id="wall"
          onClick={handleToggle}
        >
          <span>{showAll ? "Show fewer widgets " : `See all ${WIDGETS.length} widgets `}</span>
          <svg className="ic">
            <use href="#i-down" />
          </svg>
        </button>
        <p id="wcount">
          Showing {visibleCount} of {WIDGETS.length} widgets
        </p>
      </div>
    </section>
  );
}
