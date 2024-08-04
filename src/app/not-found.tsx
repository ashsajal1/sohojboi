'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Link from "next/link";

export default function NotFound() {
    return (
        <div className="grid place-items-center p-12">
            <Card className="grid place-items-center p-6">
                <CardHeader>
                    <h1 className="font-bold text-3xl font-mono text-center">404</h1>
                    <p>The content you are looking for is not found!</p>
                </CardHeader>
                <CardContent className="flex gap-2 items-center">
                    <a href={'/'}>
                        <Button>
                            Home
                        </Button>
                    </a>
                    <Button variant={'outline'} onClick={() => location.reload()}>
                        Back
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}
