"use client"
import { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import QuestionCard from "./question-card";
import { Card, CardTitle } from "@/components/ui/card";
import { Question } from '@prisma/client';
import { getQuestions } from './actions';

export default function InfiniteQuestions() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [page, setPage] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    const [hasMoreQuestions, setHasMoreQuestions] = useState(true);
    const [ref, inView] = useInView({
        triggerOnce: false,
        threshold: 1,
    });

    const fetchQuestions = async (page: number) => {
        setIsLoading(true);
        try {
            const newQuestions = await getQuestions(page);
            if (newQuestions.length === 0) {
                setHasMoreQuestions(false);
            } else {
                setQuestions((prevQuestions) => [...prevQuestions, ...newQuestions]);
            }
        } catch (error) {
            console.error("Failed to load questions", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (hasMoreQuestions) {
            fetchQuestions(page);
        }
    }, [page, hasMoreQuestions]);

    useEffect(() => {
        if (inView && !isLoading && hasMoreQuestions) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [inView, isLoading, hasMoreQuestions]);


    if (questions.length === 0 && !isLoading) {
        return (
            <Card className="p-4 m-12">
                <CardTitle>Loading...!</CardTitle>
            </Card>
        );
    }

    return (
        <div className="p-4 grid md:grid-cols-2 gap-2">

            {questions.map((question, _) => (
                <div className='p-24 border mb-2' key={question.id}>{question.questionTitle}</div>

                // <QuestionCard key={question.id} question={question} />

            ))}

            <div ref={ref}></div>
            {isLoading && <div>Loading...</div>}
            {!hasMoreQuestions && <div>No more questions to load</div>}
        </div>
    );
}
