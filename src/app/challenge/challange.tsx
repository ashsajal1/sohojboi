"use client"

import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { createCompetition, getChallengeData } from './actions';
import { AnswerOption, ChallengeQuestion } from '@prisma/client';
import { User } from '@clerk/nextjs/server';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface ChallengeProps {
    topic: string;
    challengeeId: string;
    challenger: User;
    quizId: string;
    quizQuestions: (ChallengeQuestion & { options: AnswerOption[] })[];
}

const Challenge: React.FC<ChallengeProps> = ({ challengeeId, challenger, quizId,topic, quizQuestions }) => {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [challengee, setChallenge] =  useState<User | null>()

    const questionsIds = quizQuestions.map(q => q.id);

    useEffect(() => {
        const fetchData = async () => {
             let data = await getChallengeData(challengeeId)
             setChallenge(data)
          }
        fetchData();
        
    },[challengeeId])

    useEffect(() => {
        createCompetitionFunc();

        async function createCompetitionFunc() {
            if (showResults) {
                await createCompetition(challengeeId, challenger.id, questionsIds, score);
            }
        }
    }, [challengeeId, challenger, questionsIds, score, showResults])

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
                                <div className='flex justify-between py-2'>
                                <Avatar className=''>
                                    <AvatarImage src={challenger?.imageUrl} />
                                    <AvatarFallback>{challenger?.firstName?.slice(0, 1)}</AvatarFallback>
                                </Avatar>
                                <h3>Question {currentQuestionIndex + 1}</h3>
                                <p>Topic : {topic}</p>

                                <Avatar className=''>
                                    <AvatarImage src={challengee?.imageUrl} />
                                    <AvatarFallback>{challengee?.firstName?.slice(0, 1)}</AvatarFallback>
                                </Avatar>
                                </div>

                                <Separator className='py-1 mt-4'/>

                                <CardTitle className='py-2'><p>{quizQuestions[currentQuestionIndex].content}</p></CardTitle>
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
