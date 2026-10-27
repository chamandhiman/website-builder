import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { createProjectFromTemplate, type Template } from "@/services/templates";
import { WtoAuthCard } from "@/components/auth/WtoAuthCard";
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !loading && !signingIn) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, loading, signingIn, onClose]);

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
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request" ||
        err?.message?.includes("closed-by-user")
      ) {
        return;
      }
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
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in-0 duration-200"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        if (e.target === e.currentTarget && !isWorking) {
          onClose();
        }
      }}
    >
      <div className="relative w-full max-w-[440px]">
        {/* Close button top-right */}
        <button
          type="button"
          onClick={() => !isWorking && onClose()}
          className="absolute -top-3 -right-3 z-30 w-8 h-8 rounded-full flex items-center justify-center bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-zinc-300 hover:text-white transition-all cursor-pointer shadow-lg"
          aria-label="Close"
          disabled={isWorking}
        >
          <X size={15} />
        </button>

        {/* Centered Auth Card */}
        <WtoAuthCard
          title={title}
          subtitle={subtitle}
          loading={isWorking}
          onGoogleClick={handleGoogleLogin}
          animate="card-in"
        />
      </div>
    </div>,
    document.body
  );
}
