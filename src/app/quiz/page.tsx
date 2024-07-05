import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma'
import React from 'react'

export default async function page() {
    const quizzes = await prisma.quiz.findMany({
        orderBy: {
            createdAt: 'desc'
        },
        include: {
            questions: {
                include: {
                    options: true
                }
            },
        }
    })

    const quizQuestions = quizzes.map((quiz) => ({
        id: quiz.id,
        title: quiz.title,
        questions: quiz.questions.map((question) => ({
            id: question.id,
            text: question.content,
            options: question.options.map((option) => ({
                id: option.id,
                text: option.content,
                isCorrect: option.isCorrect
            }))
        }))
    })).map(quesitons => quesitons.questions)[0];

    console.log(quizQuestions)
    return (
        <div className='flex flex-col gap-2'>
            {quizQuestions.map(question => (
                <Card key={question.id}>
                    <CardHeader>
                        <CardTitle>{question.text}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {question.options.map(option => (
                            <Button className='mr-2' key={option.id}>{option.text}</Button>
                        ))}
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
