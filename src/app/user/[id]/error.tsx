'use client'

import { Card } from "@/components/ui/card"

export default function error({ error }: { error: { message: string } }) {
    return (
        <Card className='p-4 mt-4 grid place-items-center'>
            <span>An error occurred! </span>
            <span>{error.message}</span>
        </Card>
    )
}
