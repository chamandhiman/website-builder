import React from "react";
import { Link } from "@tanstack/react-router";

export interface BrandLogoProps {
  /** If provided, wraps the logo with a Link or anchor */
  href?: string;
  /** "full" = full logo with mark & text (441x100), "icon" = origami bird mark only (100x100) */
  variant?: "full" | "icon";
  /** Optional className for the image */
  className?: string;
  /** Optional className for the container / link */
  containerClassName?: string;
  /** Alt text */
  alt?: string;
  /** Click handler */
  onClick?: (e: React.MouseEvent) => void;
}

export function BrandLogo({
  href,
  variant = "full",
  className = "",
  containerClassName = "",
  alt = "Website Builder by WebToolOcean",
  onClick,
}: BrandLogoProps) {
  const src = variant === "icon" ? "/logo-icon.png" : "/logo.png";
  const defaultImgClass =
    variant === "icon"
      ? "h-8 w-8 object-contain shrink-0"
      : "h-8 w-auto max-w-[210px] object-contain shrink-0";

  const imgElement = (
    <img
      src={src}
      alt={alt}
      className={`${defaultImgClass} ${className}`.trim()}
      loading="eager"
      decoding="async"
    />
  );

  if (href) {
    if (href.startsWith("http://") || href.startsWith("https://") || href.startsWith("#")) {
      return (
        <a
          href={href}
          onClick={onClick}
          className={`inline-flex items-center outline-none ${containerClassName}`.trim()}
          aria-label={alt}
        >
          {imgElement}
        </a>
      );
    }

    return (
      <Link
        to={href as any}
        onClick={onClick}
        className={`inline-flex items-center outline-none ${containerClassName}`.trim()}
        aria-label={alt}
      >
        {imgElement}
      </Link>
    );
  }

  return imgElement;
}

