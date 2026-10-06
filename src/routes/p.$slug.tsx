import { createFileRoute } from "@tanstack/react-router";
import { ClientOnly } from "@/components/builder/ClientOnly";
import { PublicSiteRenderer } from "@/components/builder/PublicSiteRenderer";

interface SiteSearch {
  page?: string;
}

export const Route = createFileRoute("/p/$slug")({
  validateSearch: (search: Record<string, unknown>): SiteSearch => {
    return {
      page: typeof search.page === "string" ? search.page : undefined,
    };
  },
  component: PublicPage,
});

function PublicPage() {
  const { slug } = Route.useParams();
  const search = Route.useSearch();

  return (
    <ClientOnly>
      <PublicSiteRenderer slug={slug} initialPageSlug={search.page} />
    </ClientOnly>
  );
}
