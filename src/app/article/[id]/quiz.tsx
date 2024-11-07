"use client"

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { ChallengeQuestion as ChallengeQuestionProps, AnswerOption } from '@prisma/client';

interface ChallengeQuestionType extends ChallengeQuestionProps {
    options: AnswerOption[];
}

interface ArticleQuestionProps {
    question: ChallengeQuestionType;
}

// ArticleQuestion component to display the question, options, and answer after submission
const ArticleQuestion: React.FC<ArticleQuestionProps> = ({ question }) => {
    // const { content, options, explanation } = question;
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState(false);

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
        }
    };

    return (
        <div className="p-4 border rounded-md shadow-sm">
            <h2 className="text-lg font-semibold mb-4">{question?.content}</h2>
            <div className="space-y-2">
                {question?.options.map((option) => (
                    <div
                        key={option.id}
                        className={`p-2 border rounded cursor-pointer
                            ${submitted && option.isCorrect ? 'bg-green-200 text-muted' : ''}
                            ${submitted && selectedOption === option.id && !option.isCorrect ? 'bg-red-200 text-muted' : ''}
                            ${
                                selectedOption === option.id
                                    && 'border-blue-500'}
                        `}
                        onClick={() => handleOptionClick(option.id)}
                    >
                        <Label>{option?.content}</Label>
                    </div>
                ))}
            </div>

            <Separator className="my-4" />

            <Button
                onClick={handleSubmit}
                className="w-full"
                disabled={submitted || selectedOption === null}
            >
                Submit Answer
            </Button>

            {submitted && (
                <div className="mt-4">
                    <h3 className="text-md font-semibold text-green-600">Correct Answer:</h3>
                    {question.options
                        .filter(option => option.isCorrect)
                        .map(option => (
                            <p key={option.id} className="text-green-800">
                                {option.content}
                            </p>
                        ))}
                    {question.explanation && (
                        <div className="mt-2">
                            <h4 className="text-sm font-semibold text-gray-600">Explanation:</h4>
                            <p className="text-gray-700">{question.explanation}</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ArticleQuestion;
