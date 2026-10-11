"use client";

import { useEffect } from "react";

const GA_MEASUREMENT_ID = "G-W14JC88EV7";

export function GoogleAnalytics() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const script = document.createElement("script");
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    script.async = true;
    document.head.appendChild(script);

    const init = () => {
      (window as any).dataLayer = (window as any).dataLayer || [];
      function gtag(...args: any[]) {
        (window as any).dataLayer.push(args);
      }
      gtag("js", new Date());
      gtag("config", GA_MEASUREMENT_ID);
    };

    script.addEventListener("load", init);
    script.addEventListener("error", init);

    return () => {
      script.removeEventListener("load", init);
      script.removeEventListener("error", init);
    };
  }, []);

  return null;
}
