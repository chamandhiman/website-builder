import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import {
  getTemplate,
  createProjectFromTemplate,
  type Template,
} from "@/services/templates";
import { PublicNav } from "@/components/layout/PublicNav";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { TemplatePreviewModal } from "@/components/builder/TemplatePreviewModal";
import { toast } from "sonner";
import {
  Sparkles,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Layers,
  ChevronLeft,
  Smartphone,
  Monitor,
  Download,
} from "lucide-react";

export const Route = createFileRoute("/templates/$templateId")({
  component: TemplateDetailPage,
});

function TemplateDetailPage() {
  const { templateId } = Route.useParams();
  const navigate = useNavigate();
  const { user, authReady } = useAuth();
  const [template, setTemplate] = useState<Template | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [previewDevice, setPreviewDevice] = useState<"desktop" | "mobile">("desktop");
  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const found = await getTemplate(templateId);
        if (!cancelled) {
          setTemplate(found);
        }
      } catch (err) {
        console.error("Failed to load template:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => {
      cancelled = true;
    };
  }, [templateId]);

  const handleUseTemplate = async () => {
    if (!template) return;

    if (template.status === "upcoming") {
      toast.info(`"${template.name}" is coming soon! Check back shortly.`);
      return;
    }

    if (!authReady || !user) {
      toast.info("Please sign in or create an account to start editing.", {
        description: `We'll automatically set up "${template.name}" for you.`,
      });
      navigate({
        to: "/login" as never,
        search: {
          templateId: template.id,
          action: "use",
          redirect: `/templates/${template.id}`,
        } as any,
      });
      return;
    }

    setActionLoading(true);
    try {
      const newProjectId = createProjectFromTemplate(template);
      toast.success(`Created project from ${template.name}! Opening editor…`);
      navigate({
        to: "/editor/$projectId",
        params: { projectId: newProjectId },
      });
    } catch (err) {
      console.error("Failed to create project from template:", err);
      toast.error("Failed to initialize template project. Please try again.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0e0e10] text-[#f4f4f5] flex flex-col font-['Inter',sans-serif]">
        <PublicNav />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="space-y-4 text-center">
            <div className="h-10 w-10 border-2 border-[#facc15] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm text-[#9a9aa3]">Loading template details…</p>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="min-h-screen bg-[#0e0e10] text-[#f4f4f5] flex flex-col font-['Inter',sans-serif]">
        <PublicNav />
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="max-w-md text-center space-y-4">
            <h1 className="text-2xl font-bold text-[#f4f4f5]">Template Not Found</h1>
            <p className="text-sm text-[#9a9aa3]">
              The template you're looking for doesn't exist, was moved, or has been unpublished.
            </p>
            <Link
              to="/templates"
              className="inline-flex items-center gap-2 rounded-full bg-[#facc15] px-5 py-2.5 text-xs font-bold text-[#151515] hover:bg-yellow-400 transition"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Browse All Templates</span>
            </Link>
          </div>
        </div>
        <PublicFooter />
      </div>
    );
  }

  const isUpcoming = template.status === "upcoming";
  const pagesCount = template.pages?.length || 1;

  const featuresList = [
    "Fully responsive layouts optimized for mobile, tablet, and desktop",
    "Pre-styled color palette and harmonious typography",
    "Interactive UI components including navigation, hero, and contact blocks",
    "Clean semantic HTML structure ready for one-click download",
    "Easily customizable text, images, styles, and links using visual controls",
  ];

  return (
    <div className="min-h-screen bg-[#0e0e10] text-[#f4f4f5] flex flex-col font-['Inter',sans-serif]">
      <PublicNav />

      {/* Breadcrumb Header */}
      <div className="border-b border-[#2a2a2f] bg-[#17171a] py-4 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl flex items-center justify-between text-xs text-[#9a9aa3]">
          <Link
            to="/templates"
            className="inline-flex items-center gap-1.5 hover:text-[#f4f4f5] transition"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to Template Library</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-[#202024] px-2.5 py-0.5 font-medium text-[#facc15] border border-[#2a2a2f]">
              {template.category}
            </span>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex-1 w-full space-y-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-[#facc15]/10 px-3 py-1 text-xs font-semibold text-[#facc15] border border-[#facc15]/20">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{template.category} Website Template</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight font-['Bricolage_Grotesque'] text-[#f4f4f5]">
                {template.name}
              </h1>
              <p className="text-sm text-[#9a9aa3] leading-relaxed">
                {template.description ||
                  "A complete, production-ready website template engineered with modern visual design, responsive layouts, and clean code."}
              </p>
            </div>

            {/* Meta chips */}
            <div className="grid grid-cols-2 gap-3 py-2">
              <div className="rounded-xl border border-[#2a2a2f] bg-[#17171a] p-3 text-left">
                <span className="block text-[10px] uppercase font-bold text-[#9a9aa3]">Pages</span>
                <span className="text-sm font-semibold text-[#f4f4f5]">{pagesCount} Page{pagesCount > 1 ? "s" : ""}</span>
              </div>
              <div className="rounded-xl border border-[#2a2a2f] bg-[#17171a] p-3 text-left">
                <span className="block text-[10px] uppercase font-bold text-[#9a9aa3]">Format</span>
                <span className="text-sm font-semibold text-[#f4f4f5]">HTML5 / CSS / JS</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {isUpcoming ? (
                <div className="rounded-xl border border-[#facc15]/30 bg-[#facc15]/5 p-4 text-center">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold text-[#facc15]">
                    <Clock className="h-4 w-4" />
                    <span>Coming Soon</span>
                  </div>
                  <p className="mt-1 text-xs text-[#9a9aa3]">
                    This template is currently in development and will be released in the upcoming update.
                  </p>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setShowPreviewModal(true)}
                    className="w-full flex items-center justify-center gap-2 rounded-full border-2 border-[#facc15] bg-[#facc15]/10 py-3.5 px-6 text-sm font-bold text-[#facc15] hover:bg-[#facc15] hover:text-[#111111] transition shadow-lg"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Open Live Interactive Preview</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleUseTemplate}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-full bg-[#facc15] py-3.5 px-6 text-sm font-bold text-[#151515] hover:bg-yellow-400 transition shadow-lg"
                  >
                    <span>{actionLoading ? "Setting up project…" : "Use This Template"}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>

                  <button
                    type="button"
                    onClick={handleUseTemplate}
                    disabled={actionLoading}
                    className="w-full flex items-center justify-center gap-2 rounded-full border border-[#2a2a2f] bg-[#17171a] py-3 px-6 text-sm font-semibold text-[#f4f4f5] hover:border-[#facc15] transition"
                  >
                    <span>Edit Live in Builder</span>
                  </button>
                </>
              )}
            </div>

            {/* Feature highlights */}
            <div className="space-y-3 pt-4 border-t border-[#2a2a2f]">
              <h3 className="text-xs uppercase font-bold text-[#9a9aa3] tracking-wider">
                What's Included
              </h3>
              <ul className="space-y-2.5">
                {featuresList.map((f, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-[#9a9aa3]">
                    <CheckCircle2 className="h-4 w-4 text-[#facc15] flex-shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right Preview Showcase */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#9a9aa3]">Interactive Preview</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPreviewModal(true)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-[#facc15]/40 bg-[#facc15]/10 px-2.5 py-1 text-xs font-semibold text-[#facc15] hover:bg-[#facc15]/20 transition"
                >
                  <Eye className="h-3.5 w-3.5" />
                  <span>Full Screen</span>
                </button>
                <div className="flex items-center gap-1 rounded-lg border border-[#2a2a2f] bg-[#17171a] p-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("desktop")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition ${
                      previewDevice === "desktop" ? "bg-[#202024] text-[#facc15]" : "text-[#9a9aa3]"
                    }`}
                  >
                    <Monitor className="h-3.5 w-3.5" />
                    <span>Desktop</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewDevice("mobile")}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded transition ${
                      previewDevice === "mobile" ? "bg-[#202024] text-[#facc15]" : "text-[#9a9aa3]"
                    }`}
                  >
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>Mobile</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Frame Mockup */}
            <div
              onClick={() => setShowPreviewModal(true)}
              className={`group/frame relative mx-auto rounded-2xl border border-[#2a2a2f] bg-[#17171a] shadow-2xl overflow-hidden transition-all duration-300 cursor-pointer hover:border-[#facc15]/60 ${
                previewDevice === "mobile" ? "max-w-[340px]" : "w-full"
              }`}
            >
              {/* Browser bar */}
              <div className="flex items-center justify-between border-b border-[#2a2a2f] bg-[#1f1f23] px-4 py-2.5 text-xs text-[#9a9aa3]">
                <div className="flex items-center gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                </div>
                <span className="truncate max-w-[200px] text-[11px] font-mono opacity-60">
                  {template.slug}.webtoolocean.app
                </span>
                <span />
              </div>

              {/* Preview Image / View */}
              <div className="relative aspect-[16/10] bg-[#0b0c10] overflow-hidden">
                {template.thumbnail || template.previewImage ? (
                  <img
                    src={template.previewImage || template.thumbnail || ""}
                    alt={template.name}
                    className="w-full h-full object-cover group-hover/frame:scale-105 transition duration-500"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center p-8 text-center text-[#9a9aa3]">
                    <span className="text-xl font-bold">{template.name}</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/frame:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <span className="rounded-full bg-[#facc15] text-[#111111] px-4 py-2 text-xs font-bold shadow-xl flex items-center gap-1.5">
                    <Eye className="h-3.5 w-3.5" />
                    Click to Open Full Interactive Preview
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <PublicFooter />

      {/* Full-Screen Template Preview Modal */}
      <TemplatePreviewModal
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        template={template}
        onUseTemplate={(tpl) => {
          setShowPreviewModal(false);
          void handleUseTemplate();
        }}
      />
    </div>
  );
}
