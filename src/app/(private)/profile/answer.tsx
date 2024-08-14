import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardFooter, CardHeader } from '@/components/ui/card'
import { type Answer } from '@prisma/client'
import Link from 'next/link'

export default function Answer({ answer }: { answer: Answer }) {
    return (
        <>
            <Card className='mt-2'>
                <CardHeader>
                    <CardDescription>{answer.answer.slice(0, 300)}...</CardDescription>
                </CardHeader>
                <CardFooter>
                    <Link href={`/question/${answer.questionId}`}>
                        <Button variant="link">Back to Question</Button>
                    </Link>
                </CardFooter>
            </Card>
        </>
    )
}
