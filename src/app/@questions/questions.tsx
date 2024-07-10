"use client"

import { usePathname } from "next/navigation"
import { ReactNode } from "react"

export default function Questions({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const isHomeRoute = pathname === "/" || pathname === "/qustion";

    if (isHomeRoute) {
        return <>{children}</>
    }
    return (
        <>
        </>
    )
}
