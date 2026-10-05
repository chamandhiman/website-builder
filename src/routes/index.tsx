import { createFileRoute } from "@tanstack/react-router";
import { LandingPage } from "@/components/landing/LandingPage";

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
  component: LandingPage,
});
