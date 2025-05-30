"use client";

import QuestionCard from "./question-card";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import { useEffect, useState, useRef, useMemo } from "react";
import { getQuestions } from "./actions";
import { Question } from "@prisma/client";

interface QuestionsListClientProps {
  initialQuestions: Question[];
}

export default function QuestionsListClient({ initialQuestions }: QuestionsListClientProps) {
  const [questions, setQuestions] = useState<Question[]>(initialQuestions);
  const [page, setPage] = useState(1);
  const [hasMoreQuestions, setHasMoreQuestions] = useState(true);
  const observerRef = useRef<HTMLDivElement | null>(null);
  const isFetching = useRef(false);

  // Fetch Questions Function
  const fetchQuestions = async (currentPage: number) => {
    if (isFetching.current) return;

    isFetching.current = true;
    const newQuestions = await getQuestions(currentPage);

    if (newQuestions.length === 0 || newQuestions.length < 5) {
      setHasMoreQuestions(false);
    }

    setQuestions((prev) => [...prev, ...newQuestions]);
    isFetching.current = false;
  };

  // Infinite Scroll Observer
  useEffect(() => {
    const currentRef = observerRef.current;

    const observer = new IntersectionObserver(
      (entries) => {
        if (
          entries[0].isIntersecting &&
          hasMoreQuestions &&
          !isFetching.current
        ) {
          setPage((prev) => prev + 1);
        }
      },
      { threshold: 1.0 }
    );

    if (observerRef.current) observer.observe(observerRef.current);

    return () => {
      if (currentRef) observer.unobserve(currentRef!);
    };
  }, [hasMoreQuestions]);

  // Fetch data on page change
  useEffect(() => {
    if (page > 1) {
      fetchQuestions(page);
    }
  }, [page]);

  // Memoize the question list to avoid unnecessary re-renders
  const memoizedQuestions = useMemo(() => questions, [questions]);

  return (
    <>
      <div className="grid md:grid-cols-2 gap-2">
        <div className="fixed bottom-12 z-20 right-12">
          <Link href="/question/create">
            <Button size={"icon"} variant={"destructive"}>
              <PlusIcon />
            </Button>
          </Link>
        </div>
        {memoizedQuestions.map((question) => (
          <QuestionCard key={question.id} question={question} />
        ))}
      </div>

      {(questions.length === 0 && !isFetching.current) && (
        <h1 className="font-bold text-xl text-center p-12">
          No questions Found!
        </h1>
      )}

      {hasMoreQuestions && (
        <div ref={observerRef} className="mt-2 flex justify-center">
          <p>Loading more questions...</p>
        </div>
      )}
    </>
  );
} 