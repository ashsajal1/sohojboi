import prisma from '@/lib/prisma';
import React from 'react';
import QuizPlayer from './quiz-player';

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
    } catch (error) {
        console.error("Error fetching questions:", error);
    }

    if (!questions) return <div>Loading...</div>;

    return (
        <div className='flex flex-col gap-2'>
            <QuizPlayer questions={questions!} />
        </div>
    );
}