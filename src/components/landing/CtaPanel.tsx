import { useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";

interface CtaPanelProps {
  onSuccessRedirect?: string;
}

export function CtaPanel({ onSuccessRedirect = "/dashboard" }: CtaPanelProps) {
  const { register, loginWithGoogle, signingIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email.");
      return;
    }

    if (!showPassword) {
      setShowPassword(true);
      return;
    }

    if (!password.trim() || password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const parts = email.split("@")[0].split(".");
      const first = parts[0] || "User";
      const last = parts[1] || "";
      await register(first, last, email.trim(), password);
      toast.success("Account created successfully! Welcome to WebToolOcean.");
      navigate({ to: onSuccessRedirect as never });
    } catch (err: any) {
      console.error("Signup error:", err);
      toast.error(err?.message || "Could not create account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google!");
      navigate({ to: onSuccessRedirect as never });
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      toast.error(err?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const isWorking = loading || signingIn;

  return (
    <section className="panel cta" data-name="05 — Launch" id="panel-4">
      <div className="orb" id="orb" />
      <div className="eyebrow">
        <i />
        Ready when you are
      </div>
      <h2>
        Launch in
        <br />
        <span className="hl" id="count">
          99
        </span>{" "}
        seconds.
      </h2>

      <div className="steps">
        <span>
          <b>1</b>Sign up
        </span>
        <em>→</em>
        <span>
          <b>2</b>Pick a template
        </span>
        <em>→</em>
        <span>
          <b>3</b>Edit
        </span>
        <em>→</em>
        <span>
          <b>4</b>Download / Publish
        </span>
      </div>

      <form className="signup" onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="you@company.com"
          aria-label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {showPassword && (
          <input
            type="password"
            placeholder="Password (min 6 chars)"
            aria-label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
          />
        )}
        <button type="submit" className="btn btn-y magnetic" disabled={isWorking}>
          {isWorking ? (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Loader2 size={16} className="animate-spin" />
              <span>Creating…</span>
            </span>
          ) : showPassword ? (
            "Complete free sign up"
          ) : (
            "Create free account"
          )}
        </button>
      </form>

      <div className="oauth">
        or continue with{" "}
        <button type="button" onClick={handleGoogleSignIn} disabled={isWorking}>
          <svg width="14" height="14" viewBox="0 0 24 24">
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
          Google
        </button>
        <button
          type="button"
          onClick={() => {
            navigate({ to: "/login" as never });
          }}
        >
          Sign in
        </button>
      </div>
    </section>
  );
}
