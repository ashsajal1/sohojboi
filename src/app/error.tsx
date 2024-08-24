'use client'

import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"

export default function error({ error }: any) {
    return (
        <div className="p-12 grid place-items-center">
            <Card>
                <CardHeader>
                    An unexpected error occurred!
                </CardHeader>
                <CardFooter>
                        <Button variant="outline" className="w-full" onClick={() => window.location.reload()}>Try again!</Button>
                </CardFooter>
            </Card>
        </div>
    )
}
