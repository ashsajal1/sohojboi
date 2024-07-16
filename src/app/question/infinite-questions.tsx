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
    const [ref, inView] = useInView({
        triggerOnce: false,
        threshold: 1,
    });

    const fetchQuestions = async (page: number) => {
        setIsLoading(true);
        try {
            const newQuestions = await getQuestions(page);
            setQuestions((prevQuestions) => [...prevQuestions, ...newQuestions]);
        } catch (error) {
            console.error("Failed to load questions", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchQuestions(page);
    }, [page]);

    useEffect(() => {
        if (inView && !isLoading) {
            setPage((prevPage) => prevPage + 1);
        }
    }, [inView, isLoading]);

    if (questions.length === 0 && !isLoading) {
        return (
            <Card className="p-4 m-12">
                <CardTitle>Question is empty!</CardTitle>
            </Card>
        );
    }

    return (
        <div className="p-4 grid md:grid-cols-2 gap-2">
            {questions.map((question, _) => (
                <QuestionCard key={question.id} question={question} />
            ))}
            <div ref={ref}></div>
            {isLoading && <div>Loading...</div>}
        </div>
    );
}
