"use client";

import { useEffect, useRef } from "react";
import { useLocation } from "@tanstack/react-router";

export const GA_MEASUREMENT_ID = "G-4C1PP726EZ";

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

export function GoogleAnalytics() {
  const location = useLocation();
  const lastTrackedPath = useRef<string | null>(null);

  // Initialize dataLayer, gtag queue, and ensure script is present
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Initialize dataLayer and window.gtag queue function
    window.dataLayer = window.dataLayer || [];
    if (typeof window.gtag !== "function") {
      window.gtag = function gtag() {
        window.dataLayer.push(arguments);
      };
    }

    // 2. Ensure official gtag.js script is loaded asynchronously without duplicates
    const scriptSrc = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    const existingScript = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`);
    if (!existingScript) {
      const script = document.createElement("script");
      script.src = scriptSrc;
      script.async = true;
      document.head.appendChild(script);
    }

    // 3. Configure GA4 with send_page_view: false so client-side navigation handles page views cleanly
    window.gtag("js", new Date());
    window.gtag("config", GA_MEASUREMENT_ID, {
      send_page_view: false,
    });
  }, []);

  // Track client-side page views on route changes without duplicate events
  useEffect(() => {
    if (typeof window === "undefined") return;

    const currentPath = location.pathname + (location.searchStr || "");

    // Avoid duplicate page_view events for the exact same path
    if (lastTrackedPath.current === currentPath) return;
    lastTrackedPath.current = currentPath;

    // Small delay ensures document.title is updated by the current route
    const timer = setTimeout(() => {
      if (typeof window.gtag === "function") {
        window.gtag("event", "page_view", {
          page_title: document.title,
          page_location: window.location.href,
          page_path: currentPath,
        });
      }
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname, location.searchStr]);

  return null;
}
