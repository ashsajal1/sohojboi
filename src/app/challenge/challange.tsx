"use client"

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createCompetition } from './actions';
import { AnswerOption, ChallengeQuestion } from '@prisma/client';

interface ChallengeProps {
    challengeeId: string;
    challengerId: string;
    quizId: string;
    quizQuestions: (ChallengeQuestion & { options: AnswerOption[] })[];
}

const Challenge: React.FC<ChallengeProps> = ({ challengeeId, challengerId, quizId, quizQuestions }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);

    const questionsIds = quizQuestions.map(q => q.id)

    useEffect(() => {
        createCompetitionFunc();

        async function createCompetitionFunc() {
            if (showResults) {
                await createCompetition(challengeeId, challengerId, questionsIds, score);
            }
        }
    }, [challengeeId, challengerId, questionsIds, score, showResults])

    const handleOptionSelect = (optionId: string) => {
        setSelectedOption(optionId);
    };

    const nextQuestion = async () => {
        const currentQuestion = quizQuestions[currentQuestionIndex];
        const selectedOptionObject = currentQuestion.options.find((option) => option.id === selectedOption);

        if (selectedOptionObject?.isCorrect) {
            setScore(score + 1);
        }

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
        } else {
            setShowResults(true);
            // console.log(challengeeId, challengerId, "user ids from client")
        }
    };

    return (
        <div className='w-full'>
            {quizQuestions.length > 0 && (
                <>
                    {showResults ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Results:</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>You scored {score} out of {quizQuestions.length}</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <h3>Question {currentQuestionIndex + 1}</h3>
                                <CardTitle><p>{quizQuestions[currentQuestionIndex].content}</p></CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul>
                                    {quizQuestions[currentQuestionIndex].options.map((option) => (
                                        <li key={option.id}>
                                            <Button
                                                variant={'outline'}
                                                className='w-full mb-2'
                                                onClick={() => handleOptionSelect(option.id)}
                                                disabled={selectedOption !== null}
                                            >
                                                {option.content}
                                            </Button>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                            <CardFooter>
                                {selectedOption !== null && (
                                    <Button className='w-full' onClick={nextQuestion}>Next</Button>
                                )}
                            </CardFooter>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default Challenge;
