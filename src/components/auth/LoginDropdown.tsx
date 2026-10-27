import React, { useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { Loader2, ShieldCheck, CheckCircle2 } from "lucide-react";

export function GoogleLogoSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      className="h-4 w-4 shrink-0"
      aria-hidden="true"
      {...props}
    >
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.74 7.18l7.73 6C44.43 37.98 46.98 31.83 46.98 24.55z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59A14.4 14.4 0 0 1 9.75 24c0-1.59.27-3.13.75-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.15 1.45-4.9 2.3-8.18 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export interface LoginDropdownProps {
  /** Optional custom trigger button element */
  trigger?: React.ReactNode;
  /** Optional class name to style default button */
  triggerClassName?: string;
  /** Label for default trigger button */
  triggerChildren?: React.ReactNode;
  /** Alignment relative to anchor button */
  align?: "start" | "center" | "end";
  /** Side offset in pixels */
  sideOffset?: number;
  /** Callback fired upon successful authentication */
  onSuccess?: () => void;
}

export function LoginDropdown({
  trigger,
  triggerClassName = "btn btn-ghost sm",
  triggerChildren = "Log in",
  align = "end",
  sideOffset = 8,
  onSuccess,
}: LoginDropdownProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loginWithGoogle, signingIn, user } = useAuth();

  // If already logged in, do not keep open
  React.useEffect(() => {
    if (user && open) {
      setOpen(false);
    }
  }, [user, open]);

  const handleGoogleSignIn = async () => {
    if (loading || signingIn) return;
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Welcome! Signed in successfully with Google.");
      setOpen(false);
      onSuccess?.();
    } catch (err: any) {
      // Handle user cancellation gracefully
      if (
        err?.code === "auth/popup-closed-by-user" ||
        err?.code === "auth/cancelled-popup-request" ||
        err?.message?.includes("closed-by-user")
      ) {
        // Intentionally closed without error banner
        return;
      }
      console.error("Google sign-in error:", err);
      toast.error(err?.message || "Google sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isWorking = loading || signingIn;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <button
            type="button"
            className={triggerClassName}
            aria-label="Log in with Google"
            aria-expanded={open}
          >
            {triggerChildren}
          </button>
        )}
      </PopoverTrigger>

      <PopoverContent
        align={align}
        sideOffset={sideOffset}
        collisionPadding={16}
        className="z-50 w-[320px] sm:w-[340px] max-w-[calc(100vw-32px)] p-0 rounded-2xl border border-white/10 bg-[#141512]/98 backdrop-blur-2xl text-zinc-100 shadow-[0_24px_50px_rgba(0,0,0,0.85),0_0_30px_rgba(244,213,54,0.08)] animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 duration-200 outline-none overflow-hidden"
      >
        {/* Subtle top gold accent bar */}
        <div
          className="h-[2px] w-full"
          style={{
            background:
              "linear-gradient(90deg, transparent, #f4d536 50%, transparent)",
          }}
        />

        {/* Content container */}
        <div className="p-5 pb-4">
          {/* Header branding & badges */}
          <div className="flex items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded-[6px] bg-[#f4d536] text-[#10110e] flex items-center justify-center font-black text-[11px] shadow-[0_0_12px_rgba(244,213,54,0.3)]">
                W
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-zinc-300">
                WebToolOcean
              </span>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              Verified
            </span>
          </div>

          <h3 className="text-base font-extrabold text-white tracking-tight leading-snug">
            Sign in to your account
          </h3>
          <p className="mt-1 text-xs text-zinc-400 leading-relaxed">
            Secure sign-in with your Google account. Choose any account already logged in your browser.
          </p>

          {/* Google Sign-in Action Button */}
          <div className="mt-4">
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={isWorking}
              className="group relative w-full h-11 px-4 rounded-xl bg-white hover:bg-zinc-100 active:scale-[0.98] text-zinc-900 font-bold text-sm flex items-center justify-center gap-2.5 transition-all duration-200 shadow-md hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f4d536] focus-visible:ring-offset-2 focus-visible:ring-offset-[#141512] disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
            >
              {isWorking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin text-amber-500" />
                  <span className="font-semibold">Signing you in…</span>
                </>
              ) : (
                <>
                  <GoogleLogoSvg />
                  <span>Continue with Google</span>
                </>
              )}
            </button>
          </div>

          {/* Supporting guarantee */}
          <p className="mt-2 text-center text-[11px] text-zinc-500 leading-normal">
            Secure sign-in with your Google account
          </p>
        </div>

        {/* Bottom security strip */}
        <div className="px-5 py-2.5 bg-white/[0.03] border-t border-white/5 flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-1.5 text-zinc-300">
            <ShieldCheck className="h-3.5 w-3.5 text-[#f4d536]" />
            <span className="font-medium">OAuth 2.0 Account Chooser</span>
          </div>
          <div className="flex items-center gap-1 text-zinc-500 text-[10px]">
            <CheckCircle2 className="h-3 w-3 text-emerald-400" />
            <span>Fast access</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
