"use client";

import { ReactNode } from "react";
import BlurFade from "@/components/magicui/blur-fade";

interface QuestionCardClientProps {
  children: ReactNode;
}

export default function QuestionCardClient({ children }: QuestionCardClientProps) {
  return (
    <BlurFade delay={0.25} inView>
      {children}
    </BlurFade>
  );
} 