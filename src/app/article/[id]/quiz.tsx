"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ChallengeQuestion as ChallengeQuestionProps, AnswerOption, ArticleSection } from '@prisma/client';
import { triggerStarConfetti } from './star-confetti';
import { CheckCircle2, XCircle, Send, HelpCircle, Trophy } from 'lucide-react';

interface ChallengeQuestionType extends ChallengeQuestionProps {
    options: AnswerOption[];
    articleSection?: ArticleSection | null;
}

interface ArticleQuestionProps {
    question: ChallengeQuestionType;
    showConfetti?: boolean;
}

// Shuffle function to randomize options
const shuffleArray = (array: AnswerOption[]) => {
    return array.sort(() => Math.random() - 0.5);
};

// ArticleQuestion component to display the question, options, and answer after submission
const ArticleQuestion: React.FC<ArticleQuestionProps> = ({ question, showConfetti = false }) => {
    const [shuffledOptions, setShuffledOptions] = useState<AnswerOption[]>([]);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

    useEffect(() => {
        setShuffledOptions(shuffleArray([...question.options]));
    }, [question.options]);

    // Handle option selection
    const handleOptionClick = (optionId: string) => {
        if (!submitted) {
            setSelectedOption(optionId);
        }
    };

    // Handle form submission
    const handleSubmit = () => {
        if (selectedOption !== null) {
            setSubmitted(true);
            if (showConfetti && selectedOption === shuffledOptions.find((option) => option.isCorrect)?.id) {
                triggerStarConfetti();
            }
        }
    };

    return (
        <div className="p-4 border rounded-md shadow-sm bg-white dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center gap-2 mb-4">
                <Trophy className="w-5 h-5 text-yellow-500 dark:text-yellow-400" />
                <h2 className="text-lg font-semibold dark:text-gray-100">{question?.content}</h2>
            </div>
            <div className="space-y-2">
                {shuffledOptions.map((option) => (
                    <div
                        key={option.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 flex items-center gap-2
                            ${submitted && option.isCorrect ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : ''}
                            ${submitted && selectedOption === option.id && !option.isCorrect ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800' : ''}
                            ${selectedOption === option.id && !submitted ? 'border-blue-500 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/30' : ''}
                            hover:bg-gray-50 dark:hover:bg-gray-700/50
                            dark:border-gray-600 dark:text-gray-100
                        `}
                        onClick={() => handleOptionClick(option.id)}
                    >
                        {submitted && option.isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 dark:text-green-400" />}
                        {submitted && selectedOption === option.id && !option.isCorrect && <XCircle className="w-5 h-5 text-red-500 dark:text-red-400" />}
                        <Label className="flex-1 dark:text-gray-100">{option?.content}</Label>
                    </div>
                ))}
            </div>

            <Separator className="my-4 dark:bg-gray-700" />

            <Button
                onClick={handleSubmit}
                className="w-full gap-2 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100"
                disabled={submitted || selectedOption === null}
            >
                <Send className="w-4 h-4" />
                Submit Answer
            </Button>

            {submitted && (
                <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                        <Trophy className="w-5 h-5 text-green-600 dark:text-green-400" />
                        <h3 className="text-md font-semibold text-green-600 dark:text-green-400">Correct Answer:</h3>
                    </div>
                    {shuffledOptions
                        .filter(option => option.isCorrect)
                        .map(option => (
                            <p key={option.id} className="text-green-800 dark:text-green-300 ml-7">
                                {option.content}
                            </p>
                        ))}
                    {question.explanation && (
                        <div className="mt-4">
                            <div className="flex items-center gap-2 mb-2">
                                <HelpCircle className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                <h4 className="text-sm font-semibold text-gray-600 dark:text-gray-400">Explanation:</h4>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 ml-7">{question.explanation}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ArticleQuestion;
