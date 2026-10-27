import React from "react";
import { Loader2, X } from "lucide-react";

interface WtoAuthCardProps {
  title?: string;
  subtitle?: string;
  loading?: boolean;
  onGoogleClick: () => void;
  onClose?: () => void;
  animate?: "slide-down" | "card-in" | "none";
}

export function GoogleLogoSvg(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className="wto-auth-google-logo"
      viewBox="0 0 48 48"
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

export function WtoAuthCard({
  title = "Sign in to your account",
  subtitle = "Continue with Google to securely access your workspace and everything you have been building.",
  loading = false,
  onGoogleClick,
  onClose,
  animate = "card-in",
}: WtoAuthCardProps) {
  const animClass =
    animate === "slide-down"
      ? "animate-slide-down"
      : animate === "card-in"
      ? "animate-card-in"
      : "";

  return (
    <main
      className={`wto-auth-card ${animClass}`}
      style={{
        padding: "42px 38px 34px",
        boxSizing: "border-box",
        width: "100%",
        maxWidth: "440px",
      }}
    >
      {/* Heading */}
      <div
        className="wto-auth-welcome"
        role="heading"
        aria-level={1}
        style={{ margin: "0 0 12px 0", padding: 0 }}
      >
        {title}
      </div>

      {/* Subtitle */}
      <p
        className="wto-auth-sub"
        style={{ margin: "0 auto 24px auto", padding: 0, maxWidth: "350px" }}
      >
        {subtitle}
      </p>

      {/* Google Sign In Button */}
      <button
        id="google"
        type="button"
        className="wto-auth-google"
        onClick={onGoogleClick}
        disabled={loading}
        style={{
          margin: "0 0 22px 0",
          height: "55px",
          padding: "0 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "12px",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin text-amber-500" />
            <span>Signing you in…</span>
          </>
        ) : (
          <>
            <GoogleLogoSvg />
            <span>Continue with Google</span>
          </>
        )}
      </button>

      {/* Divider */}
      <div
        className="wto-auth-divider"
        style={{
          margin: "0 0 18px 0",
          padding: 0,
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        FAST, SECURE ACCESS
      </div>

      {/* Privacy Note */}
      <div
        className="wto-auth-privacy"
        style={{
          padding: "13px 15px",
          margin: "0 0 18px 0",
          display: "flex",
          alignItems: "flex-start",
          gap: "11px",
          boxSizing: "border-box",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <rect x="4" y="10" width="16" height="11" rx="2" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
        <span>
          We only use your Google account to securely verify your identity. We
          never see or store your Google password.
        </span>
      </div>

      {/* Terms */}
      <p
        className="wto-auth-terms"
        style={{ margin: "0 0 18px 0", padding: 0 }}
      >
        By continuing, you agree to our{" "}
        <a href="#terms" onClick={(e) => e.preventDefault()}>
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#privacy" onClick={(e) => e.preventDefault()}>
          Privacy Policy
        </a>
        .
      </p>

      {/* Security Shield */}
      <div
        className="wto-auth-secure"
        style={{
          margin: 0,
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "7px",
        }}
      >
        <svg
          viewBox="0 0 24 24"
          width="15"
          height="15"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11z" />
          <path d="m9 12 2 2 4-4" />
        </svg>
        <span>Protected with secure Google authentication</span>
      </div>
    </main>
  );
}
