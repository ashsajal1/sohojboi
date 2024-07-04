'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import Link from "next/link"

export default function error({ error }: any) {
    return (
        <div className="p-12 grid place-items-center">
            <Card>
                <CardHeader>
                    An unexpected error occurred!
                </CardHeader>
                <CardContent>
                    <kbd>{error.message}</kbd>
                </CardContent>
                <CardFooter>
                    <Link href={'/'}>
                        <Button>Home</Button>
                    </Link>
                </CardFooter>
            </Card>
        </div>
    )
}
