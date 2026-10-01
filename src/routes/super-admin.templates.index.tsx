import { createFileRoute } from "@tanstack/react-router";
import { TemplatesPage } from "@/components/super-admin/TemplatesPage";

export const Route = createFileRoute("/super-admin/templates/")({
  component: TemplatesPage,
});
