import { useEffect, useRef } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, any>) => void;
          prompt: (callback?: (notification: any) => void) => void;
          cancel: () => void;
        };
      };
    };
  }
}

/**
 * Google One Tap integration for WebToolOcean.
 *
 * Requirements:
 * - Checks environment for configured OAuth 2.0 Web Client ID (VITE_GOOGLE_CLIENT_ID or VITE_GOOGLE_OAUTH_CLIENT_ID).
 * - Never prompts if user is already authenticated.
 * - Authenticates with Firebase using GoogleAuthProvider.credential and signInWithCredential.
 * - Handles dismissals, skipped prompts, FedCM, and browser privacy restrictions gracefully.
 * - Keeps manual Google login (OAuth account chooser) as the primary/fallback action.
 */
export function useGoogleOneTap(enabled: boolean = true) {
  const { user, authReady, loginWithGoogleCredential } = useAuth();
  const initializedRef = useRef(false);

  useEffect(() => {
    // Only attempt on public surfaces when unauthenticated
    if (!enabled || !authReady || user) {
      if (window.google?.accounts?.id && initializedRef.current) {
        window.google.accounts.id.cancel();
      }
      return;
    }

    const clientId =
      import.meta.env.VITE_GOOGLE_CLIENT_ID ||
      import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID ||
      "";

    if (!clientId) {
      if (import.meta.env.DEV && !initializedRef.current) {
        console.info(
          "[Google One Tap] VITE_GOOGLE_CLIENT_ID is not configured in the environment. Google One Tap prompt skipped."
        );
      }
      return;
    }

    let scriptElement: HTMLScriptElement | null = null;

    const setupOneTap = () => {
      if (!window.google?.accounts?.id || initializedRef.current) return;
      initializedRef.current = true;

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: async (response: { credential?: string }) => {
          if (!response?.credential) return;
          try {
            await loginWithGoogleCredential(response.credential);
            toast.success("Welcome! Signed in successfully with Google.");
          } catch (err: any) {
            console.error("Google One Tap sign in error:", err);
            toast.error(err?.message || "Google sign in failed. Please try again.");
          }
        },
        auto_select: false,
        cancel_on_tap_outside: true,
        use_fedcm_for_prompt: true,
        itp_support: true,
      });

      window.google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed?.()) {
          const reason = notification.getNotDisplayedReason?.();
          if (import.meta.env.DEV) {
            console.debug("[Google One Tap] Prompt not displayed:", reason);
          }
        } else if (notification.isSkippedMoment?.()) {
          const reason = notification.getSkippedReason?.();
          if (import.meta.env.DEV) {
            console.debug("[Google One Tap] Prompt skipped:", reason);
          }
        } else if (notification.isDismissedMoment?.()) {
          const reason = notification.getDismissedReason?.();
          if (import.meta.env.DEV) {
            console.debug("[Google One Tap] Prompt dismissed:", reason);
          }
        }
      });
    };

    if (window.google?.accounts?.id) {
      setupOneTap();
    } else {
      const existingScript = document.querySelector<HTMLScriptElement>(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (existingScript) {
        existingScript.addEventListener("load", setupOneTap, { once: true });
      } else {
        scriptElement = document.createElement("script");
        scriptElement.src = "https://accounts.google.com/gsi/client";
        scriptElement.async = true;
        scriptElement.defer = true;
        scriptElement.onload = setupOneTap;
        document.head.appendChild(scriptElement);
      }
    }

    return () => {
      if (window.google?.accounts?.id && initializedRef.current) {
        window.google.accounts.id.cancel();
      }
    };
  }, [enabled, authReady, user, loginWithGoogleCredential]);
}
