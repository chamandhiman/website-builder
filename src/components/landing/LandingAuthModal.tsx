import { useState } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { createProjectFromTemplate, type Template } from "@/services/templates";
import { Loader2, X, Sparkles } from "lucide-react";

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
  const { loginWithGoogle, login, register, signingIn } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"google" | "email">("google");
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

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

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please fill in email and password.");
      return;
    }

    setLoading(true);
    try {
      if (isRegister) {
        const parts = fullName.trim().split(" ");
        const first = parts[0] || "User";
        const last = parts.slice(1).join(" ") || "";
        await register(first, last, email.trim(), password);
        toast.success("Account created successfully!");
      } else {
        await login(email.trim(), password);
        toast.success("Welcome back!");
      }
      handleSuccessRedirect(pendingTemplate);
    } catch (err: any) {
      console.error("Email auth error:", err);
      toast.error(err?.message || "Authentication failed. Please check credentials.");
    } finally {
      setLoading(false);
    }
  };

  const isWorking = loading || signingIn;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-md transition-opacity"
        onClick={() => !isWorking && onClose()}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-2xl border border-white/10 bg-[#141416] p-7 text-[#f2f0ea] shadow-2xl shadow-yellow-500/10">
        <button
          type="button"
          className="absolute right-4 top-4 rounded-full p-2 text-[#9a978f] hover:bg-white/5 hover:text-white transition"
          onClick={() => !isWorking && onClose()}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        {pendingTemplate ? (
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-yellow-500/30 bg-yellow-500/10 px-3 py-1 text-xs font-semibold text-[#ffd21f] mb-3">
              <Sparkles size={13} />
              <span>Selected Template</span>
            </div>
            <h3 className="font-['Clash_Display',sans-serif] text-2xl font-bold tracking-tight text-white">
              {pendingTemplate.name}
            </h3>
            <p className="mt-1 text-xs text-[#9a978f]">
              Sign in with Google to start customizing this template in the visual builder.
            </p>

            {pendingTemplate.thumbnail && (
              <div className="mt-3.5 h-28 w-full overflow-hidden rounded-xl border border-white/10">
                <img
                  src={pendingTemplate.thumbnail}
                  alt={pendingTemplate.name}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        ) : (
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#ffd21f] text-xl font-black text-[#111]">
              W
            </div>
            <h3 className="font-['Clash_Display',sans-serif] text-2xl font-bold tracking-tight text-white">
              Sign in to WebToolOcean
            </h3>
            <p className="mt-1 text-xs text-[#9a978f]">
              Access your saved websites, templates, and downloads.
            </p>
          </div>
        )}

        {/* Google Primary CTA */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={isWorking}
          className="w-full flex items-center justify-center gap-3 rounded-full bg-[#ffd21f] py-3.5 px-5 font-bold text-sm text-[#111] hover:bg-[#ffb800] transition shadow-lg shadow-yellow-500/20 disabled:opacity-60"
        >
          {isWorking ? (
            <>
              <Loader2 size={18} className="animate-spin" />
              <span>Signing in with Google…</span>
            </>
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
              <span>Continue with Google</span>
            </>
          )}
        </button>

        {/* Option to sign in with email */}
        <div className="mt-5 text-center">
          {mode === "google" ? (
            <button
              type="button"
              onClick={() => setMode("email")}
              className="text-xs text-[#9a978f] hover:text-white transition underline underline-offset-4"
            >
              Or sign in with email & password
            </button>
          ) : (
            <form onSubmit={handleEmailSubmit} className="mt-4 space-y-3 text-left">
              {isRegister && (
                <input
                  type="text"
                  placeholder="Full name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-[#0c0c0d] px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#ffd21f] focus:outline-none"
                  required
                />
              )}
              <input
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0c0c0d] px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#ffd21f] focus:outline-none"
                required
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-[#0c0c0d] px-3.5 py-2.5 text-xs text-white placeholder-white/40 focus:border-[#ffd21f] focus:outline-none"
                required
              />

              <button
                type="submit"
                disabled={isWorking}
                className="w-full rounded-xl bg-white/10 py-2.5 text-xs font-bold text-white hover:bg-white/20 transition"
              >
                {isRegister ? "Create account" : "Sign in"}
              </button>

              <div className="flex justify-between items-center pt-1 text-[11px] text-[#9a978f]">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="hover:underline"
                >
                  {isRegister ? "Already have an account? Sign in" : "Need an account? Register"}
                </button>
                <button
                  type="button"
                  onClick={() => setMode("google")}
                  className="hover:underline"
                >
                  Back to Google
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
