import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@/components/builder/ClientOnly";
import { PublicSiteRenderer } from "@/components/builder/PublicSiteRenderer";

interface SiteSearch {
  page?: string;
}

export const Route = createFileRoute("/site/$slug")({
  validateSearch: (search: Record<string, unknown>): SiteSearch => {
    return {
      page: typeof search.page === "string" ? search.page : undefined,
    };
  },
  component: SitePage,
});

function SitePage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();

  return (
    <ClientOnly>
      <PublicSiteRenderer slug={slug} initialPageSlug={search.page} />
    </ClientOnly>
  );
}
