import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { WtoAuthBackdrop, WtoAuthCard } from "@/components/auth/WtoAuthCard";
import { X } from "lucide-react";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialMode?: "sign-in" | "sign-up";
}

export function LoginDialog({ open, onOpenChange, initialMode }: LoginDialogProps) {
  const { loginWithGoogle, signingIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (loading || signingIn) return;
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google successfully!");
      onOpenChange(false);
    } catch (err: any) {
      console.error("Google sign in failed:", err);
      toast.error(err?.message || "Google sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isWorking = loading || signingIn;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="fixed inset-0 z-[2000] min-h-screen w-screen h-screen flex items-center justify-center p-4 sm:p-6 bg-[#10110e] border-none shadow-none max-w-none [&>button]:hidden overflow-hidden">
        {/* Animated contour-grid backdrop */}
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
          onClick={() => !isWorking && onOpenChange(false)}
          className="fixed top-6 right-6 sm:top-7 sm:right-8 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-400 hover:text-white transition-all cursor-pointer shadow-lg"
          aria-label="Close"
          disabled={isWorking}
        >
          <X size={18} />
        </button>

        <WtoAuthCard
          title="Sign in to your account"
          subtitle="Continue with Google to securely access your workspace and everything you have been building."
          loading={isWorking}
          onGoogleClick={handleGoogleSignIn}
          animate="card-in"
        />
      </DialogContent>
    </Dialog>
  );
}