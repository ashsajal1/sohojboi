import prisma from "@/lib/prisma"
import QuestionCard from "./question-card";
import { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, PlusIcon } from "lucide-react";
import NextBtn from "./next-btn";
import PreviousBtn from "./previous-btn";

export const metadata: Metadata = {
    title: "Explore Questions on Various Topics | Sohojboi",
    description: "Discover and engage with a wide range of questions on diverse topics. Join the Sohojboi community to ask, answer, and learn interactively.",
}

export default async function Page({ searchParams }: { searchParams: { page: string } }) {
    const page = parseInt(searchParams.page) || 1;
    const skipSize = (page - 1) * 10;

    const totalQuestions = await prisma.question.count();
    const questions = await prisma.question.findMany({
        skip: skipSize,
        take: 10,
        where: {
            deletedAt: null
        },
        orderBy: {
            createdAt: 'desc'
        }
    });

    const hasMoreQuestions = totalQuestions > skipSize + questions.length;

    return (
        <>
            <div className="grid md:grid-cols-2 gap-2">
                <div className='fixed bottom-12 z-20 right-12'>
                    <Link href='/question/create'>
                        <Button size={'icon'} variant={'destructive'}>
                            <PlusIcon />
                        </Button>
                    </Link>
                </div>
                {questions.map(question => (
                    <QuestionCard key={question.id} question={question} />
                ))}
            </div>

            {questions.length === 0 && <h1 className='font-bold text-xl text-center p-12'>No questions Found!</h1>}
            <div className='mt-2 flex items-center justify-between gap-2'>
                {page > 1 && (
                    <div>
                        <PreviousBtn page={page - 1} />
                    </div>
                )}
                {hasMoreQuestions && (
                    <div className='ml-auto w-full md:w-auto'>
                        <NextBtn page={page + 1} />
                    </div>
                )}
            </div>
        </>
    )
}