import { useState } from "react";
import { toast } from "sonner";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCommentDots,
  faDollarSign,
  faStopwatch,
  faStar,
  faEnvelope,
  faCookieBite,
  faImage,
  faPaperPlane,
  faLocationDot,
  faShareNodes,
  faPlay,
  faBullhorn,
  faUsers,
  faChartSimple,
  faQuestionCircle,
} from "@fortawesome/free-solid-svg-icons";

interface LandingWidgetsProps {
  onAddWidget?: (widgetName: string) => void;
}

interface WidgetItem {
  id: string;
  name: string;
  desc: string;
  color: string;
  icon?: any;
  customIcon?: "whatsapp";
}

const WIDGETS: WidgetItem[] = [
  {
    id: "chat",
    name: "Live Chat Bubble",
    desc: "Talk to visitors in real time.",
    color: "#10B981",
    icon: faCommentDots,
  },
  {
    id: "pricing",
    name: "Pricing Table",
    desc: "Display plans and pricing easily.",
    color: "#8B5CF6",
    icon: faDollarSign,
  },
  {
    id: "timer",
    name: "Countdown Timer",
    desc: "Create urgency for special offers.",
    color: "#F59E0B",
    icon: faStopwatch,
  },
  {
    id: "testimonial",
    name: "Testimonial Slider",
    desc: "Show what your customers say.",
    color: "#F43F5E",
    icon: faStar,
  },
  {
    id: "newsletter",
    name: "Newsletter Popup",
    desc: "Grow your email list.",
    color: "#EF4444",
    icon: faEnvelope,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Button",
    desc: "Floating chat on your website.",
    color: "#22C55E",
    customIcon: "whatsapp",
  },
  {
    id: "cookie",
    name: "Cookie Banner",
    desc: "Stay compliant with cookie laws.",
    color: "#3B82F6",
    icon: faCookieBite,
  },
  {
    id: "gallery",
    name: "Gallery Lightbox",
    desc: "Beautiful image galleries.",
    color: "#6366F1",
    icon: faImage,
  },
  {
    id: "contact",
    name: "Contact Form",
    desc: "Form that sends to your email.",
    color: "#0EA5E9",
    icon: faPaperPlane,
  },
  {
    id: "map",
    name: "Google Map",
    desc: "Show your location with a pin.",
    color: "#10B981",
    icon: faLocationDot,
  },
  {
    id: "social",
    name: "Social Feed",
    desc: "Show your latest posts.",
    color: "#EC4899",
    icon: faShareNodes,
  },
  {
    id: "video",
    name: "Video Popup",
    desc: "Play videos in a pop-up.",
    color: "#F43F5E",
    icon: faPlay,
  },
  {
    id: "banner",
    name: "Announcement Bar",
    desc: "Top bar for offers and news.",
    color: "#F59E0B",
    icon: faBullhorn,
  },
  {
    id: "team",
    name: "Team Cards",
    desc: "Show your team with photos.",
    color: "#6366F1",
    icon: faUsers,
  },
  {
    id: "stats",
    name: "Stats Counter",
    desc: "Numbers that count up.",
    color: "#8B5CF6",
    icon: faChartSimple,
  },
  {
    id: "faq",
    name: "FAQ Accordion",
    desc: "Questions that open and close.",
    color: "#06B6D4",
    icon: faQuestionCircle,
  },
];

export function LandingWidgets({ onAddWidget }: LandingWidgetsProps) {
  const [showAll, setShowAll] = useState(false);
  const visibleWidgets = showAll ? WIDGETS : WIDGETS.slice(0, 8);

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
    <section className="sec widget-section-v2" id="widgets">
      <div className="wrap">
        {/* Section Header matching Screenshot 2 */}
        <div className="w2-header rv in">
          <div className="w2-header-left">
            <div className="w2-eyebrow">
              <span className="w2-dash">—</span> PREMIUM WIDGETS
            </div>
            <h2>
              Add power with <span className="hl">one click.</span>
            </h2>
            <p>Drop ready-made widgets into any template. No plugins, no setup.</p>
          </div>

          <div className="w2-header-right">
            <button
              type="button"
              className="w2-see-all-btn"
              onClick={handleToggle}
            >
              <span>{showAll ? "Show Fewer Widgets" : "See All Widgets"}</span>
              <span className="w2-arrow">→</span>
            </button>
          </div>
        </div>

        {/* 4-column Cards Grid matching Screenshot 2 */}
        <div className="w2-grid">
          {visibleWidgets.map((w) => (
            <div key={w.id} className="w2-card">
              <div className="w2-card-top">
                {/* Colored icon badge */}
                <div
                  className="w2-icon-box"
                  style={{ backgroundColor: w.color }}
                >
                  {w.customIcon === "whatsapp" ? (
                    <svg
                      viewBox="0 0 24 24"
                      className="w2-svg-icon"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                    </svg>
                  ) : (
                    <FontAwesomeIcon icon={w.icon} className="w2-fa-icon" />
                  )}
                </div>

                {/* Title & Desc */}
                <div className="w2-card-text">
                  <h4>{w.name}</h4>
                  <p>{w.desc}</p>
                </div>
              </div>

              {/* Full-width Add Widget action button */}
              <button
                type="button"
                className="w2-add-btn"
                onClick={() => handleAddWidget(w.name)}
              >
                + Add Widget
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
