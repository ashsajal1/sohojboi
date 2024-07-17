import prisma from "@/lib/prisma"
import QuestionCard from "./question-card";
import { Card, CardTitle } from "@/components/ui/card";

import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
    title: "Explore Questions on Various Topics | Sohojboi",
    description: "Discover and engage with a wide range of questions on diverse topics. Join the Sohojboi community to ask, answer, and learn interactively.",
}

export default async function Page({ searchParams }: { searchParams: { page: string } }) {
    const page = parseInt(searchParams.page) || 1;
    const skipSize = (page - 1) * 10;

    const questions = await prisma.question.findMany({
        skip: skipSize,
        take: 10,
        orderBy: {
            createdAt: 'desc'
        }
    });
    
    return (
        <>
            <div className="grid md:grid-cols-2 gap-2">
                {questions.map(question => (
                    <QuestionCard key={question.id} question={question} />
                ))}
            </div>

            {questions.length === 0 && <h1 className='font-bold text-xl text-center p-12'>No questions Found!</h1>}
            <div className='mt-2 flex items-center justify-between gap-2'>
                {page > 1 && <Link href={`/question?page=${page - 1}`}>
                    <Button>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Previous Page
                    </Button>
                </Link>}
                <Link href={`/question?page=${page + 1}`}>
                    <Button variant={'outline'}>
                        Next Page
                        <ArrowRight className='h-4 w-4 ml-2' />
                    </Button>
                </Link>
            </div>
        </>
    )
}
