import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect, type FormEvent } from "react";
import { useAuth } from "@/lib/auth";
import { getTemplate, createProjectFromTemplate } from "@/services/templates";
import { toast } from "sonner";
import { Loader2, ArrowRight, Check } from "lucide-react";

interface RegisterSearchParams {
  redirect?: string;
  templateId?: string;
  action?: string;
}

export const Route = createFileRoute("/register")({
  validateSearch: (search: Record<string, unknown>): RegisterSearchParams => {
    return {
      redirect: search.redirect ? String(search.redirect) : undefined,
      templateId: search.templateId ? String(search.templateId) : undefined,
      action: search.action ? String(search.action) : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Create Free Account | WebToolOcean Website Builder" },
      {
        name: "description",
        content:
          "Start building beautiful websites with WebToolOcean. Choose a template, customize in minutes, and launch or download.",
      },
    ],
  }),
  component: RegisterPage,
});

export function RegisterPage() {
  const { redirect, templateId, action } = Route.useSearch();
  const navigate = useNavigate();
  const { user, authReady, register, loginWithGoogle, signingIn } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // If user is already logged in or becomes logged in:
  useEffect(() => {
    if (!authReady || !user) return;

    const handlePostAuth = async () => {
      if (templateId) {
        try {
          const tpl = await getTemplate(templateId);
          if (tpl) {
            const newProjectId = createProjectFromTemplate(tpl);
            toast.success(`Created project from ${tpl.name}! Opening editor…`);
            navigate({
              to: "/editor/$projectId",
              params: { projectId: newProjectId },
            });
            return;
          }
        } catch (err) {
          console.error("Post-register template cloning error:", err);
        }
      }

      if (redirect && redirect.startsWith("/")) {
        navigate({ to: redirect as never });
      } else {
        navigate({ to: "/dashboard" as never });
      }
    };

    void handlePostAuth();
  }, [authReady, user, templateId, redirect, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) {
      toast.error("Please enter your email and a password.");
      return;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      await register(firstName.trim(), lastName.trim(), email.trim(), password);
      toast.success("Account created successfully! Welcome to WebToolOcean.");
      // Post-auth effect handles redirect and template cloning
    } catch (err: any) {
      console.error("Registration failed:", err);
      toast.error(err?.message || "Could not complete registration. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      toast.success("Signed in with Google!");
      // Post-auth effect handles redirect and template cloning
    } catch (err: any) {
      console.error("Google sign-in error:", err);
      toast.error(err?.message || "Google sign-in failed.");
    } finally {
      setLoading(false);
    }
  };

  const isWorking = loading || signingIn;

  return (
    <div className="min-h-screen bg-[#0e0e10] text-[#f4f4f5] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Inter',sans-serif]">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-[#f4f4f5]">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#facc15] font-black text-[#151515] text-lg">
            W
          </span>
          <span className="font-['Bricolage_Grotesque'] text-2xl">WebToolOcean</span>
        </Link>
        <h2 className="mt-6 text-2xl sm:text-3xl font-bold tracking-tight font-['Bricolage_Grotesque'] text-[#f4f4f5]">
          Start building free today
        </h2>
        {templateId ? (
          <p className="mt-2 text-xs text-[#facc15] font-medium">
            Create an account to immediately customize and save your selected template
          </p>
        ) : (
          <p className="mt-2 text-xs text-[#9a9aa3]">
            Already have an account?{" "}
            <Link
              to="/login"
              search={{ redirect, templateId, action }}
              className="text-[#facc15] hover:underline font-semibold"
            >
              Sign in
            </Link>
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="rounded-2xl border border-[#2a2a2f] bg-[#17171a] p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#9a9aa3] mb-1.5">
                  First name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Jane"
                  className="w-full rounded-xl border border-[#2a2a2f] bg-[#0e0e10] py-3 px-3.5 text-sm text-[#f4f4f5] placeholder-[#62626a] focus:border-[#facc15] focus:outline-none transition"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#9a9aa3] mb-1.5">
                  Last name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  className="w-full rounded-xl border border-[#2a2a2f] bg-[#0e0e10] py-3 px-3.5 text-sm text-[#f4f4f5] placeholder-[#62626a] focus:border-[#facc15] focus:outline-none transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9a9aa3] mb-1.5">
                Email address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full rounded-xl border border-[#2a2a2f] bg-[#0e0e10] py-3 px-3.5 text-sm text-[#f4f4f5] placeholder-[#62626a] focus:border-[#facc15] focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#9a9aa3] mb-1.5">
                Password (min 6 characters)
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-[#2a2a2f] bg-[#0e0e10] py-3 px-3.5 text-sm text-[#f4f4f5] placeholder-[#62626a] focus:border-[#facc15] focus:outline-none transition"
              />
            </div>

            <div className="space-y-1.5 text-xs text-[#9a9aa3] pt-1">
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#facc15]" />
                <span>Full access to prebuilt template library</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#facc15]" />
                <span>Live drag & drop website editor</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="h-3.5 w-3.5 text-[#facc15]" />
                <span>Clean HTML/CSS export and downloads</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isWorking}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#facc15] py-3 px-4 text-sm font-bold text-[#151515] hover:bg-yellow-400 transition shadow"
            >
              {isWorking ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Creating account…</span>
                </>
              ) : (
                <>
                  <span>Create free account</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#2a2a2f]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#17171a] px-2 text-[#62626a]">or</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={isWorking}
            className="w-full flex items-center justify-center gap-2.5 rounded-xl border border-[#2a2a2f] bg-[#0e0e10] py-3 px-4 text-xs font-semibold text-[#f4f4f5] hover:border-[#facc15] transition"
          >
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
          </button>
        </div>
      </div>
    </div>
  );
}
