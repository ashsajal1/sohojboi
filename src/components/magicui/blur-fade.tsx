import * as React from "react";
import { cn } from "@/lib/utils";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  /** kept for API compatibility; animation now runs on paint, not on scroll */
  variant?: {
    hidden: { y: number };
    visible: { y: number };
  };
  duration?: number;
  delay?: number;
  yOffset?: number;
  inView?: boolean;
  inViewMargin?: string;
  blur?: string;
}

/**
 * Fade/blur-in wrapper driven by CSS instead of framer-motion, so children are
 * painted by the browser on first render instead of waiting for hydration
 * (the old `initial="hidden"` SSR'd `opacity:0` onto every question card).
 */
export default function BlurFade({
  children,
  className,
  duration = 0.4,
  delay = 0,
  yOffset = 6,
  blur = "6px",
}: BlurFadeProps) {
  return (
    <div
      className={cn("blur-fade", className)}
      style={
        {
          "--blur-fade-duration": `${duration}s`,
          "--blur-fade-delay": `${0.04 + delay}s`,
          "--blur-fade-y": `${yOffset}px`,
          "--blur-fade-blur": blur,
        } as React.CSSProperties
      }
    >
      {children}
    </div>
  );
}
