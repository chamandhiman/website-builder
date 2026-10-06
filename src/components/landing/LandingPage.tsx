"use client";

import { useState, useEffect, useRef } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import {
  getPublishedTemplates,
  getUpcomingTemplates,
  createProjectFromTemplate,
  type Template,
} from "@/services/templates";
import { toast } from "sonner";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { LandingHeader } from "./LandingHeader";
import { HeroPanel } from "./HeroPanel";
import { EditPanel } from "./EditPanel";
import { DownloadPanel } from "./DownloadPanel";
import { TemplatesPanel } from "./TemplatesPanel";
import { CtaPanel } from "./CtaPanel";
import { LandingHud } from "./LandingHud";
import { LandingMarquee } from "./LandingMarquee";
import { LandingFooter } from "./LandingFooter";
import { InteractiveCursor } from "./InteractiveCursor";
import { LandingAuthModal } from "./LandingAuthModal";
import { TemplatePreviewModal } from "@/components/builder/TemplatePreviewModal";

import "./landing.css";

gsap.registerPlugin(ScrollTrigger);

const PANEL_NAMES = [
  "01 — Build",
  "02 — Edit",
  "03 — Download",
  "04 — Templates",
  "05 — Launch",
];

export function LandingPage() {
  const navigate = useNavigate();
  const { user, authReady } = useAuth();
  const [activePanel, setActivePanel] = useState(0);
  const [progressPercent, setProgressPercent] = useState(0);
  const [templates, setTemplates] = useState<Template[]>([]);

  // Auth modal state for template selection without losing context
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const mousePosRef = useRef<{ x: number; y: number }>({
    x: typeof window !== "undefined" ? window.innerWidth / 2 : 500,
    y: typeof window !== "undefined" ? window.innerHeight / 2 : 400,
  });

  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  // Fetch real template data
  useEffect(() => {
    let cancelled = false;
    async function loadData() {
      try {
        const [published, upcoming] = await Promise.all([
          getPublishedTemplates(),
          getUpcomingTemplates(),
        ]);
        if (!cancelled) {
          setTemplates([...published, ...upcoming]);
        }
      } catch (err) {
        console.warn("[LandingPage] Failed to load templates:", err);
      }
    }
    void loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  // Setup GSAP horizontal scroll & animations
  useEffect(() => {
    if (typeof window === "undefined") return;

    const ctx = gsap.context(() => {
      // 1. Hero Entrance Animations
      gsap.from(".word > span", {
        yPercent: 110,
        duration: 1.1,
        stagger: 0.08,
        ease: "expo.out",
        delay: 0.2,
      });

      gsap.from(
        ".hero-grid .eyebrow, .hero-grid .lead, .hero-actions, .scroll-hint",
        {
          opacity: 0,
          y: 20,
          stagger: 0.1,
          delay: 0.6,
          duration: 0.8,
        }
      );

      gsap.from("nav", {
        y: -80,
        opacity: 0,
        duration: 1,
        ease: "expo.out",
      });

      gsap.from("#builder [data-b]", {
        opacity: 0,
        scale: 0.6,
        y: 40,
        rotate: () => gsap.utils.random(-8, 8),
        stagger: 0.12,
        duration: 0.9,
        ease: "back.out(1.6)",
        delay: 0.5,
      });

      gsap.from(".float-chip", {
        opacity: 0,
        scale: 0.5,
        stagger: 0.2,
        delay: 1.6,
        duration: 0.6,
        ease: "back.out(2)",
      });

      gsap.to(".chip-1", {
        y: -12,
        repeat: -1,
        yoyo: true,
        duration: 2.2,
        ease: "sine.inOut",
      });

      gsap.to(".chip-3", {
        y: 10,
        repeat: -1,
        yoyo: true,
        duration: 2.6,
        ease: "sine.inOut",
      });

      gsap.to(".chip-2", {
        y: -8,
        repeat: -1,
        yoyo: true,
        duration: 1.9,
        ease: "sine.inOut",
      });

      // 2. Horizontal Scroll & Per-Panel Choreography
      ScrollTrigger.matchMedia({
        "(min-width: 901px)": function () {
          const track = trackRef.current;
          if (!track) return;
          const panels = Array.from(track.querySelectorAll<HTMLElement>(".panel"));
          if (panels.length === 0) return;

          const dist = () => track.scrollWidth - window.innerWidth;

          const hTween = gsap.to(track, {
            x: () => -dist(),
            ease: "none",
            scrollTrigger: {
              trigger: "#world",
              pin: true,
              scrub: 1,
              end: () => `+=${dist()}`,
              invalidateOnRefresh: true,
              onUpdate: (self) => {
                const prog = self.progress * 100;
                setProgressPercent(prog);
                const x = self.progress * dist();
                let idx = 0;
                panels.forEach((p, i) => {
                  if (x >= p.offsetLeft - window.innerWidth * 0.5) idx = i;
                });
                setActivePanel(idx);
              },
            },
          });

          scrollTriggerRef.current = hTween.scrollTrigger || null;

          // Per-panel enter animations
          panels.slice(1).forEach((p) => {
            gsap.from(
              p.querySelectorAll(
                "h2, .eyebrow, .lead, .feat, .formats, .steps, .signup, .oauth, .tabs"
              ),
              {
                x: 160,
                opacity: 0,
                stagger: 0.06,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: p,
                  containerAnimation: hTween,
                  start: "left 85%",
                  end: "left 25%",
                  scrub: 1,
                },
              }
            );
          });

          // Builder 3D rotation exit
          gsap.to("#builder", {
            rotateY: -25,
            x: -120,
            opacity: 0.2,
            ease: "none",
            scrollTrigger: {
              trigger: panels[0],
              containerAnimation: hTween,
              start: "left left",
              end: "right left",
              scrub: true,
            },
          });

          // Editor 3D perspective entrance
          gsap.from("#editor", {
            rotateY: 30,
            rotateX: 8,
            x: 200,
            opacity: 0,
            transformPerspective: 1200,
            scrollTrigger: {
              trigger: panels[1],
              containerAnimation: hTween,
              start: "left 90%",
              end: "left 20%",
              scrub: 1,
            },
          });

          // Code lines animation
          gsap.from(".cl", {
            opacity: 0,
            x: -30,
            stagger: 0.05,
            scrollTrigger: {
              trigger: panels[2],
              containerAnimation: hTween,
              start: "left 70%",
              end: "left 10%",
              scrub: 1,
            },
          });

          // Floating files pop
          gsap.from(".file", {
            scale: 0,
            rotate: -30,
            stagger: 0.1,
            scrollTrigger: {
              trigger: panels[2],
              containerAnimation: hTween,
              start: "left 60%",
              end: "left 10%",
              scrub: 1,
            },
          });

          // Zip progress bar
          gsap.to("#dlBar", {
            width: "100%",
            scrollTrigger: {
              trigger: panels[2],
              containerAnimation: hTween,
              start: "left 50%",
              end: "left -10%",
              scrub: 1,
              onUpdate: (s) => {
                const dlTxt = document.getElementById("dlTxt");
                if (dlTxt) {
                  dlTxt.textContent =
                    s.progress > 0.98
                      ? "Ready ✓ 1.2 MB"
                      : `Packing 7 pages… ${Math.round(s.progress * 100)}%`;
                }
              },
            },
          });

          // Templates staggered wave
          gsap.from(".tpl", {
            y: (i) => (i % 2 ? 160 : -160),
            rotate: (i) => (i % 2 ? 6 : -6),
            opacity: 0,
            stagger: 0.08,
            scrollTrigger: {
              trigger: panels[3],
              containerAnimation: hTween,
              start: "left 80%",
              end: "left 0%",
              scrub: 1,
            },
          });

          // Orb scale
          gsap.fromTo(
            "#orb",
            { scale: 0.3 },
            {
              scale: 1.6,
              scrollTrigger: {
                trigger: panels[4],
                containerAnimation: hTween,
                start: "left right",
                end: "left left",
                scrub: true,
              },
            }
          );

          // Counter countdown 99 -> 60
          gsap.to(
            { v: 99 },
            {
              v: 60,
              ease: "none",
              scrollTrigger: {
                trigger: panels[4],
                containerAnimation: hTween,
                start: "left 80%",
                end: "left left",
                scrub: true,
              },
              onUpdate: function () {
                const countElem = document.getElementById("count");
                if (countElem) {
                  countElem.textContent = String(
                    Math.round((this.targets()[0] as any).v)
                  );
                }
              },
            }
          );

          return () => {
            scrollTriggerRef.current = null;
          };
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const handleNavigatePanel = (panelIndex: number) => {
    const track = trackRef.current;
    if (!track) return;
    const panels = Array.from(track.querySelectorAll<HTMLElement>(".panel"));
    const targetPanel = panels[panelIndex];
    if (!targetPanel) return;

    const st = scrollTriggerRef.current;
    if (st && window.innerWidth > 900) {
      const dist = track.scrollWidth - window.innerWidth;
      const targetScroll =
        st.start + (targetPanel.offsetLeft / dist) * (st.end - st.start);
      window.scrollTo({ top: targetScroll, behavior: "smooth" });
    } else {
      targetPanel.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStartBuilding = () => {
    if (authReady && user) {
      navigate({ to: "/dashboard" as never });
    } else {
      setPendingTemplate(null);
      setAuthModalOpen(true);
    }
  };

  const handleExploreTemplates = () => {
    navigate({ to: "/templates" as never });
  };

  const handleSelectTemplate = (template: Template) => {
    if (template.status === "upcoming") {
      toast.info(`"${template.name}" is coming soon! Stay tuned.`);
      return;
    }

    if (authReady && user) {
      try {
        const newProjectId = createProjectFromTemplate(template);
        toast.success(`Created project from ${template.name}! Opening builder…`);
        navigate({
          to: "/editor/$projectId",
          params: { projectId: newProjectId },
        });
      } catch (err) {
        console.error("Failed to copy template:", err);
        navigate({
          to: "/templates/$templateId",
          params: { templateId: template.id },
        });
      }
    } else {
      setPendingTemplate(template);
      setAuthModalOpen(true);
    }
  };

  const handleRequestLoginForTemplate = (template: Template) => {
    setPendingTemplate(template);
    setAuthModalOpen(true);
  };

  return (
    <div className="wto-flow-app" ref={containerRef}>
      <InteractiveCursor mousePosRef={mousePosRef} />

      <LandingHeader
        activePanel={activePanel}
        onNavigatePanel={handleNavigatePanel}
        onOpenAuthModal={() => {
          setPendingTemplate(null);
          setAuthModalOpen(true);
        }}
      />

      <main className="world" id="world">
        <div className="track" id="track" ref={trackRef}>
          <HeroPanel
            onStartBuilding={handleStartBuilding}
            onExploreTemplates={handleExploreTemplates}
            mousePosRef={mousePosRef}
          />

          <EditPanel />

          <DownloadPanel />

          <TemplatesPanel
            templates={templates}
            onSelectTemplate={handleSelectTemplate}
            onRequestLoginForTemplate={handleRequestLoginForTemplate}
            onPreviewTemplate={(t) => setPreviewTemplate(t)}
          />

          <CtaPanel onSuccessRedirect="/dashboard" />
        </div>
      </main>

      <LandingHud
        currentPanelName={PANEL_NAMES[activePanel] || PANEL_NAMES[0]}
        progressPercent={progressPercent}
        currentPanelIndex={activePanel}
        totalPanels={PANEL_NAMES.length}
      />

      <LandingMarquee />

      <LandingFooter />

      <LandingAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        pendingTemplate={pendingTemplate}
      />

      <TemplatePreviewModal
        isOpen={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
        onUseTemplate={(t) => {
          setPreviewTemplate(null);
          handleSelectTemplate(t);
        }}
      />
    </div>
  );
}
