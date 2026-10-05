import { useEffect, useRef } from "react";
import gsap from "gsap";

interface InteractiveCursorProps {
  mousePosRef: React.MutableRefObject<{ x: number; y: number }>;
}

export function InteractiveCursor({ mousePosRef }: InteractiveCursorProps) {
  const cursorRef = useRef<HTMLDivElement | null>(null);
  const dotRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const cur = cursorRef.current;
    const dot = dotRef.current;
    if (!cur || !dot) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePosRef.current.x = e.clientX;
      mousePosRef.current.y = e.clientY;
      gsap.set(dot, { x: e.clientX, y: e.clientY });
      gsap.to(cur, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.35,
        ease: "power3.out",
      });
    };

    window.addEventListener("mousemove", handleMouseMove);

    // Hover interactions for clickable elements
    const handleElementHover = () => {
      const interactives = document.querySelectorAll(
        "a, button, .tpl, .swatches i, [role='button'], input"
      );

      interactives.forEach((el) => {
        el.addEventListener("mouseenter", () => cur.classList.add("big"));
        el.addEventListener("mouseleave", () => cur.classList.remove("big"));
      });

      // Magnetic buttons
      const magnetics = document.querySelectorAll<HTMLElement>(".magnetic");
      magnetics.forEach((b) => {
        const onMouseMove = (e: MouseEvent) => {
          const r = b.getBoundingClientRect();
          gsap.to(b, {
            x: (e.clientX - r.left - r.width / 2) * 0.3,
            y: (e.clientY - r.top - r.height / 2) * 0.4,
            duration: 0.3,
          });
        };
        const onMouseLeave = () => {
          gsap.to(b, {
            x: 0,
            y: 0,
            duration: 0.6,
            ease: "elastic.out(1, 0.4)",
          });
        };

        b.addEventListener("mousemove", onMouseMove);
        b.addEventListener("mouseleave", onMouseLeave);
      });
    };

    const timer = setTimeout(handleElementHover, 500);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearTimeout(timer);
    };
  }, [mousePosRef]);

  return (
    <>
      <div className="cursor" ref={cursorRef} />
      <div className="dot" ref={dotRef} />
    </>
  );
}
