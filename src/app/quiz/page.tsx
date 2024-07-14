import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma'
import React from 'react'
import QuizComponent from './quizzes';

export default async function page() {
    let questions;
    try {
        questions = await prisma.challengeQuestion.findMany({
          include: {
            topic: true, 
            chapter: true, 
            options: true, 
          },
        });
    
        console.log("Questions:", questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } 

    console.log(questions)
    return (
        <div className='flex flex-col gap-2'>
            {questions!.map(question => (
                <Card key={question.id}>
                    <CardHeader>
                        <CardTitle>{question.content}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {question.options.map(option => (
                            <Button className='mr-2' key={option.id}>{option.content}</Button>
                        ))}
                    </CardContent>
                </Card>
            ))}
            {/* <QuizComponent quizQuestions={questions} /> */}
        </div>
    )
}
