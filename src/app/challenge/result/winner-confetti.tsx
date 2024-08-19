"use client";

import { useRef } from "react";

import type { ConfettiRef } from "@/components/magicui/confetti";
import Confetti from "@/components/magicui/confetti";

export default function WinnerConfetti() {
    const confettiRef = useRef<ConfettiRef>(null);

    return (
        <Confetti
            ref={confettiRef}
            className="absolute left-0 top-20 z-0 size-full"
            onLoad={() => {
                confettiRef.current?.fire({});
            }}
        />
    )
}
