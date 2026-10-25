import * as React from "react";
import { cn } from "@/lib/utils";

interface BoxRevealProps {
  children: React.ReactNode;
  width?: "fit-content" | "100%";
  boxColor?: string;
  duration?: number;
}

/**
 * Title reveal driven by CSS (previously framer-motion, which SSR'd
 * `opacity:0` plus a covering overlay until hydration).
 */
export const BoxReveal = ({
  children,
  width = "fit-content",
  boxColor,
  duration = 0.5,
}: BoxRevealProps) => {
  return (
    <div
      className={cn("box-reveal", width === "100%" && "w-full")}
      style={
        {
          width,
          "--box-reveal-duration": `${duration}s`,
          ...(boxColor ? { "--box-reveal-color": boxColor } : {}),
        } as React.CSSProperties
      }
    >
      <div className="box-reveal-content">{children}</div>
      <div className="box-reveal-wipe" aria-hidden="true" />
    </div>
  );
};

export default BoxReveal;
