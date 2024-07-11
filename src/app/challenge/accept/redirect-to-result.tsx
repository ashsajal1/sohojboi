"use client"

import { redirect } from "next/navigation"

export default function RedirectToResult({ competitionId }: { competitionId: string }) {
    return (
        redirect(`/challenge/result?competitionId=${competitionId}`)
    )
}
