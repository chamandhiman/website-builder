import { useState, useEffect } from "react";
import { useNavigate, useSearch, Link, createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import {
  createProjectFromTemplate,
  getPublishedTemplates,
  type Template,
} from "@/services/templates";
import { WtoAuthBackdrop, WtoAuthCard } from "@/components/auth/WtoAuthCard";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as {
    redirect?: string;
    templateId?: string;
  };
  const redirect = search?.redirect;
  const templateId = search?.templateId;

  const { user, loginWithGoogle, signingIn, authReady } = useAuth();
  const [loading, setLoading] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // If redirected because of a specific template, load it
  useEffect(() => {
    let cancelled = false;
    async function loadTemplate() {
      if (!templateId) return;
      try {
        const all = await getPublishedTemplates();
        const found = all.find((t) => t.id === templateId);
        if (!cancelled && found) {
          setSelectedTemplate(found);
        }
      } catch (err) {
        console.error("Failed to load template on login page:", err);
      }
    }
    void loadTemplate();
    return () => {
      cancelled = true;
    };
  }, [templateId]);

  // Handle auto-redirect if already logged in
  useEffect(() => {
    if (!authReady || !user) return;

    const handlePostLogin = async () => {
      if (templateId) {
        try {
          const all = await getPublishedTemplates();
          const tpl = all.find((t) => t.id === templateId);
          if (tpl && tpl.status !== "upcoming") {
            const newProjectId = createProjectFromTemplate(tpl);
            toast.success(`Created project from ${tpl.name}! Opening editor…`);
            navigate({
              to: "/editor/$projectId",
              params: { projectId: newProjectId },
            });
            return;
          }
        } catch (err) {
          console.error("Post-login template cloning error:", err);
        }
      }

      if (redirect && redirect.startsWith("/")) {
        navigate({ to: redirect as never });
      } else {
        navigate({ to: "/dashboard" as never });
      }
    };

    void handlePostLogin();
  }, [authReady, user, templateId, redirect, navigate]);

  const handleGoogleSignIn = async () => {
    if (loading || signingIn) return;
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Welcome! Signed in successfully with Google.");
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      toast.error(err?.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isWorking = loading || signingIn;

  // Do not show the login page if redirected from dashboard
  if (redirect === "/dashboard" || redirect?.startsWith("/dashboard")) {
    return null;
  }

  const title = selectedTemplate
    ? "Sign in to continue"
    : "Sign in to your account";
  const subtitle = selectedTemplate
    ? `Continue with Google to securely open "${selectedTemplate.name}" in the visual editor.`
    : "Continue with Google to securely access your workspace and everything you have been building.";

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center p-4 sm:p-6 bg-[#10110e] overflow-hidden">
      {/* Animated contour-grid backdrop */}
      <WtoAuthBackdrop />

      {/* Brand logo top-left */}
      <Link
        to="/"
        className="fixed top-6 left-6 sm:top-7 sm:left-8 z-20 flex items-center gap-2.5 text-white font-extrabold text-[1.02rem] tracking-tight hover:opacity-90 transition-opacity"
      >
        <div className="w-[34px] h-[34px] rounded-[10px] bg-[#f4d536] text-[#10110e] flex items-center justify-center font-black text-lg shadow-[0_0_24px_rgba(244,213,54,0.2)]">
          W
        </div>
        <span>WebToolOcean</span>
      </Link>

      {/* Centered Auth Card */}
      <WtoAuthCard
        title={title}
        subtitle={subtitle}
        loading={isWorking}
        onGoogleClick={handleGoogleSignIn}
        animate="card-in"
      />
    </div>
  );
}
