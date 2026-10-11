import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { createProjectFromTemplate, type Template } from "@/services/templates";
import { WtoAuthBackdrop, WtoAuthCard } from "@/components/auth/WtoAuthCard";
import { X } from "lucide-react";

interface LandingAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  pendingTemplate?: Template | null;
}

export function LandingAuthModal({
  isOpen,
  onClose,
  pendingTemplate,
}: LandingAuthModalProps) {
  const { loginWithGoogle, signingIn } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSuccessRedirect = (templateToClone?: Template | null) => {
    onClose();
    if (templateToClone && templateToClone.status !== "upcoming") {
      try {
        const newProjectId = createProjectFromTemplate(templateToClone);
        toast.success(`Created project from ${templateToClone.name}! Opening editor…`);
        navigate({
          to: "/editor/$projectId",
          params: { projectId: newProjectId },
        });
        return;
      } catch (err) {
        console.error("Failed to clone template after login:", err);
      }
    }
    navigate({ to: "/dashboard" as never });
  };

  const handleGoogleLogin = async () => {
    if (loading || signingIn) return;
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google!");
      handleSuccessRedirect(pendingTemplate);
    } catch (err: any) {
      console.error("Google sign in error:", err);
      toast.error(err?.message || "Google sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isWorking = loading || signingIn;

  const title = pendingTemplate
    ? "Sign in to continue"
    : "Sign in to your account";
  const subtitle = pendingTemplate
    ? `Continue with Google to securely open "${pendingTemplate.name}" in the visual editor.`
    : "Continue with Google to securely access your workspace and everything you have been building.";

  return createPortal(
    <div
      className="fixed inset-0 z-[2000] min-h-screen w-screen h-screen flex items-center justify-center p-4 sm:p-6 bg-[#10110e] overflow-hidden"
      role="dialog"
      aria-modal="true"
    >
      {/* Refined animated contour-grid backdrop */}
      <WtoAuthBackdrop />

      {/* Brand logo top-left */}
      <div className="fixed top-6 left-6 sm:top-7 sm:left-8 z-20 flex items-center gap-2.5 text-white font-extrabold text-[1.02rem] tracking-tight">
        <div className="w-[34px] h-[34px] rounded-[10px] bg-[#f4d536] text-[#10110e] flex items-center justify-center font-black text-lg shadow-[0_0_24px_rgba(244,213,54,0.2)]">
          W
        </div>
        <span>WebToolOcean</span>
      </div>

      {/* Close button top-right */}
      <button
        type="button"
        onClick={() => !isWorking && onClose()}
        className="fixed top-6 right-6 sm:top-7 sm:right-8 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer shadow-lg"
        aria-label="Close"
        disabled={isWorking}
      >
        <X size={18} />
      </button>

      {/* Centered Auth Card */}
      <WtoAuthCard
        title={title}
        subtitle={subtitle}
        loading={isWorking}
        onGoogleClick={handleGoogleLogin}
        animate="card-in"
      />
    </div>,
    document.body
  );
}
