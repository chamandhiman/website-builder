"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import {
  getPublishedTemplates,
  getUpcomingTemplates,
  createProjectFromTemplate,
  type Template,
} from "@/services/templates";
import { toast } from "sonner";

import { LandingSvgSymbols } from "./LandingSvgSymbols";
import { LandingNavbar } from "./LandingNavbar";
import { LandingHero } from "./LandingHero";
import { LandingStrip } from "./LandingStrip";
import { LandingGallery } from "./LandingGallery";
import { LandingFeatures } from "./LandingFeatures";
import { LandingWidgets } from "./LandingWidgets";
import { LandingCta } from "./LandingCta";
import { LandingFooter } from "./LandingFooter";
import { LandingThemePanel } from "./LandingThemePanel";
import { LandingPreviewModal } from "./LandingPreviewModal";
import { LandingAuthModal } from "./LandingAuthModal";

import "./landing.css";

export function LandingPage() {
  const navigate = useNavigate();
  const { user, authReady } = useAuth();

  const [templates, setTemplates] = useState<Template[]>([]);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [pendingTemplate, setPendingTemplate] = useState<Template | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<any | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  // Fetch real prebuilt & published templates from Firestore and seed definitions
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

  // Window scroll progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      if (total > 0) {
        setScrollProgress((window.scrollY / total) * 100);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleStartBuilding = () => {
    if (authReady && user) {
      navigate({ to: "/dashboard" as never });
    } else {
      setPendingTemplate(null);
      setAuthModalOpen(true);
    }
  };

  const handleSelectTemplate = (template: any) => {
    if (!template) return;

    if (template.status === "upcoming") {
      toast.info(`"${template.name || template.n}" is coming soon! Stay tuned.`);
      return;
    }

    if (authReady && user) {
      try {
        const newProjectId = createProjectFromTemplate(template);
        toast.success(`Created project from ${template.name || template.n}! Opening builder…`);
        navigate({
          to: "/editor/$projectId",
          params: { projectId: newProjectId },
        });
      } catch (err) {
        console.error("Failed to clone template:", err);
        if (template.id) {
          navigate({
            to: "/templates/$templateId",
            params: { templateId: template.id },
          });
        }
      }
    } else {
      setPendingTemplate(template);
      setAuthModalOpen(true);
    }
  };

  return (
    <div className="wto-landing">
      {/* SVG Symbol Definitions for All Vector Icons */}
      <LandingSvgSymbols />

      {/* Top Scroll Progress Indicator */}
      <div className="sprog">
        <i id="spi" style={{ width: `${scrollProgress}%` }} />
      </div>

      {/* Top Navigation */}
      <LandingNavbar
        onOpenAuthModal={() => {
          setPendingTemplate(null);
          setAuthModalOpen(true);
        }}
      />

      {/* Hero Section with Interactive 3D Builder Mockup */}
      <LandingHero onStartBuilding={handleStartBuilding} />

      {/* Categories Marquee Strip */}
      <LandingStrip />

      {/* Template Library Gallery */}
      <LandingGallery
        realTemplates={templates}
        onPreviewTemplate={(t) => setPreviewTemplate(t)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Features Bento Grid */}
      <LandingFeatures />

      {/* Premium Widgets Showcase */}
      <LandingWidgets />

      {/* Launch CTA Section */}
      <LandingCta onStartBuilding={handleStartBuilding} />

      {/* Footer */}
      <LandingFooter />

      {/* Floating Theme Customizer Panel and Back to Top Button */}
      <LandingThemePanel />

      {/* Template Live Preview Modal */}
      <LandingPreviewModal
        isOpen={Boolean(previewTemplate)}
        onClose={() => setPreviewTemplate(null)}
        template={previewTemplate}
        onUseTemplate={(t) => {
          setPreviewTemplate(null);
          handleSelectTemplate(t);
        }}
      />

      {/* Authentication Modal */}
      <LandingAuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        pendingTemplate={pendingTemplate}
      />
    </div>
  );
}
