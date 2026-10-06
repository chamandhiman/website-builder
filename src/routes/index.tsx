import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing/LandingPage";
import { getSubdomainSlug } from "@/services/publishing";
import { PublicSiteRenderer } from "@/components/builder/PublicSiteRenderer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WebToolOcean | Build Beautiful Websites Without Code" },
      {
        name: "description",
        content:
          "Pick a professional website template, edit with our visual builder, and download clean website files. Fast, responsive, and code-free.",
      },
      {
        property: "og:title",
        content: "WebToolOcean Website Builder | Build & Download Websites",
      },
      {
        property: "og:description",
        content:
          "Pick a template, edit anything with your mouse, and download clean website files. No coding needed.",
      },
    ],
  }),
  component: RootOrSubdomainIndex,
});

function RootOrSubdomainIndex() {
  const [subdomainSlug, setSubdomainSlug] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const slug = getSubdomainSlug(window.location.hostname);
      if (slug) {
        setSubdomainSlug(slug);
      }
    }
  }, []);

  if (subdomainSlug) {
    return <PublicSiteRenderer slug={subdomainSlug} />;
  }

  return <LandingPage />;
}
