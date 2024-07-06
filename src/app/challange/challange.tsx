"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createCompetition } from './actions';
interface QuizQuestionsProps {
    challangeeId: string,
    challangerId: string,
    quizId: string,
    quizQuestions: {
        id: string;
        text: string;
        options: {
            id: string;
            text: string;
            isCorrect: boolean;
        }[];
    }[];
}

const Challange: React.FC<QuizQuestionsProps> = ({challangeeId, challangerId, quizQuestions, quizId }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    console.log(quizQuestions);

    const handleOptionSelect = (optionId: string) => {
        setSelectedOption(optionId);
    };

    const nextQuestion = async () => {
        const currentQuestion = quizQuestions[currentQuestionIndex]; // Access the current question directly
        const isCorrect = currentQuestion.options.find(
            (option) => option.id === selectedOption
        )?.isCorrect;

        if (isCorrect) {
            setScore(score + 1);
        }

        if (currentQuestionIndex < quizQuestions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
            setSelectedOption(null);
        } else {
            setShowResults(true);
            await createCompetition(challangeeId, challangerId,quizId, score)
        }
    };

    return (
        <div>
            {quizQuestions.length > 0 && (
                <>
                    {showResults ? (
                        <Card>
                            <CardHeader>
                                <CardTitle>Results: </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p>
                                    You scored {score} out of {quizQuestions.length}
                                </p>
                            </CardContent>
                        </Card>
                    ) : (
                        <Card>
                            <CardHeader>
                                <h3>Question {currentQuestionIndex + 1}</h3>
                                <CardTitle><p>{quizQuestions[currentQuestionIndex].text}</p></CardTitle>
                            </CardHeader>

                            <CardContent>
                                <ul>
                                    {quizQuestions[currentQuestionIndex].options.map((option) => (
                                        <li key={option.id}>
                                            <Button variant={'outline'} className='w-full mb-2'
                                                onClick={() => handleOptionSelect(option.id)}
                                                disabled={selectedOption !== null}
                                            >
                                                {option.text}
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

export default Challange;