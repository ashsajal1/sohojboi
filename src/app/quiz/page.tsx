import prisma from '@/lib/prisma';
import React from 'react';
import QuizPlayer from './quiz-player';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Practise Quizzes on Any Topic | Sohojboi',
    description:
        'Practise multiple-choice quizzes on your syllabus topics, check your score instantly and learn from the explanations. Free quiz practice for HSC, SSC and admission tests.',
    alternates: { canonical: '/quiz' },
};

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
            <h1 className='p-4 text-center text-xl font-bold md:text-2xl'>Quiz practice</h1>
            <QuizPlayer questions={questions!} />
        </div>
    );
}