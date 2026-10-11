import { useState } from "react";
import { toast } from "sonner";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { useAuth } from "@/lib/auth";
import { WtoAuthCard } from "@/components/auth/WtoAuthCard";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pendingAction?: string;
  onSuccess?: () => void;
  initialMode?: "sign-in" | "sign-up";
}

export function AuthDrawer({
  open,
  onOpenChange,
  pendingAction,
  onSuccess,
}: Props) {
  const { signingIn, loginWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (loading || signingIn) return;
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google!");
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      console.error("Google sign in failed:", err);
      toast.error(err?.message || "Google sign in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isWorking = loading || signingIn;

  const subtitle = pendingAction
    ? `Continue with Google to ${pendingAction}.`
    : "Continue with Google to securely access your workspace and everything you have been building.";

  return (
    <Drawer open={open} onOpenChange={onOpenChange} shouldScaleBackground={false}>
      <DrawerContent className="h-full w-full max-w-[460px] p-4 flex items-center justify-center bg-transparent border-none shadow-none [&>button]:hidden font-sans">
        <WtoAuthCard
          title="Sign in to your account"
          subtitle={subtitle}
          loading={isWorking}
          onGoogleClick={handleGoogleSignIn}
          onClose={() => !isWorking && onOpenChange(false)}
          animate="card-in"
        />
      </DrawerContent>
    </Drawer>
  );
}
