"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChallengeQuestion, AnswerOption } from '@prisma/client';

// Define the shape of the component props
interface QuizPlayerProps {
    questions: (ChallengeQuestion & { options: AnswerOption[] })[]; // Assuming each question includes options
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ questions }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<AnswerOption | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);

    const handleOptionClick = (option: AnswerOption) => {
        setSelectedOption(option);
        setIsAnswered(true);
    };

    const handleNextQuestion = () => {
        setSelectedOption(null);
        setIsAnswered(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1 < questions.length ? prevIndex + 1 : 0));
    };

    if (!questions || questions.length === 0) return <div>No questions available.</div>;

    const currentQuestion = questions[currentIndex];
    const correctOption = currentQuestion.options.find(option => option.isCorrect); // Assuming there's an isCorrect field

    return (
        <div className='flex flex-col gap-2'>
            <Card key={currentQuestion.id}>
                <CardHeader>
                    <CardTitle>{currentQuestion.content}</CardTitle>
                </CardHeader>
                <CardContent>
                    {currentQuestion.options.map(option => {
                        // Determine if the option is the selected one or the correct one
                        const isSelected = selectedOption?.id === option.id;
                        const isCorrect = correctOption?.id === option.id;

                        return (
                            <Button
                                variant={isSelected ? (isCorrect ? 'outline' : 'destructive') : 'secondary'}
                                className={`mr-2 ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                                key={option.id}
                                onClick={() => handleOptionClick(option)}
                                disabled={isAnswered}
                            >
                                {option.content}
                            </Button>
                        );
                    })}
                    {isAnswered && (
                        <div>
                            <p>
                                {selectedOption && selectedOption.id === correctOption?.id
                                    ? 'Correct!'
                                    : 'Incorrect! The correct answer was: ' + (correctOption?.content)}
                            </p>
                            <Button onClick={handleNextQuestion}>
                                Next Question
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default QuizPlayer;