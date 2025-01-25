"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  completeCompetition,
  createCompetition,
  getChallengeData,
} from "./actions";
import { AnswerOption, ChallengeQuestion, Competition } from "@prisma/client";
import { User } from "@clerk/nextjs/server";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useRouter } from "next/navigation";

interface ChallengeProps {
  topic: string;
  challengeeId: string;
  challenger: User;
  quizId: string;
  quizQuestions: (ChallengeQuestion & { options: AnswerOption[] })[];
  competition?: Competition;
}

const Challenge: React.FC<ChallengeProps> = ({
  challengeeId,
  challenger,
  quizId,
  topic,
  quizQuestions,
  competition,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [challengee, setChallenge] = useState<User | null>();
  const router = useRouter();

  const questionsIds = quizQuestions.map((q) => q.id);

  useEffect(() => {
    const fetchData = async () => {
      let data = await getChallengeData(challengeeId);
      setChallenge(data);
    };
    fetchData();
  }, [challengeeId]);

  useEffect(() => {
    if (!showResults) return; // Only execute when results are ready to be processed.

    if (competition?.status !== "completed") {
      completeCompetitionFunc();
    } else {
      createCompetitionFunc();
    }

    async function createCompetitionFunc() {
      const newCompetition = await createCompetition(
        challengeeId,
        challenger.id,
        questionsIds,
        score
      );
      router.push(`/challenge/result?competitionId=${newCompetition.id}`);
    }

    async function completeCompetitionFunc() {
      let winnerId;
      if (score > competition!.challengerScore) {
        winnerId = competition!.challengeeId;
      } else if (score < competition!.challengerScore) {
        winnerId = competition!.challengerId;
      } else {
        winnerId = null;
      }

      const completedCompetition = await completeCompetition(
        competition!.id,
        score,
        challenger.id,
        winnerId,
        challengeeId
      );

      router.push(`/challenge/result?competitionId=${completedCompetition.id}`);
    }
  }, [
    challengeeId,
    challenger,
    competition,
    questionsIds,
    router,
    score,
    showResults,
  ]);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const nextQuestion = async () => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    const selectedOptionObject = currentQuestion.options.find(
      (option) => option.id === selectedOption
    );

    if (selectedOptionObject?.isCorrect) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
    } else {
      setShowResults(true);
    }
  };

  return (
    <div className="w-full">
      {quizQuestions.length > 0 && (
        <>
          {showResults ? (
            <Card>
              <CardHeader>
                <CardTitle>Results:</CardTitle>
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
                <div className="flex justify-between py-2">
                  <Avatar className="">
                    <AvatarImage src={challenger?.imageUrl} />
                    <AvatarFallback>
                      {challenger?.firstName?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                  <p>Topic : {topic}</p>

                  <Avatar className="">
                    <AvatarImage src={challengee?.imageUrl} />
                    <AvatarFallback>
                      {challengee?.firstName?.slice(0, 1)}
                    </AvatarFallback>
                  </Avatar>
                </div>

                <Progress
                  className="mt-2"
                  value={
                    ((currentQuestionIndex + 1) / quizQuestions.length) * 100
                  }
                />

                <CardTitle className="py-2">
                  <p>
                    {currentQuestionIndex + 1}.{" "}
                    {quizQuestions[currentQuestionIndex].content}
                  </p>
                </CardTitle>
              </CardHeader>

              <CardContent>
                <ul>
                  {quizQuestions[currentQuestionIndex].options.map((option) => (
                    <li key={option.id}>
                      <Button
                        variant={"outline"}
                        className="w-full mb-2"
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
                  <Button className="w-full" onClick={nextQuestion}>
                    Next
                  </Button>
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
