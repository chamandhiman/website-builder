import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";

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
  component: RegisterRedirectPage,
});

function RegisterRedirectPage() {
  const { redirect, templateId, action } = Route.useSearch();
  const navigate = useNavigate();

  useEffect(() => {
    void navigate({
      to: "/login" as any,
      search: { redirect, templateId, action } as any,
      replace: true,
    });
  }, [navigate, redirect, templateId, action]);

  return (
    <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[#facc15] border-t-transparent" />
    </div>
  );
}
