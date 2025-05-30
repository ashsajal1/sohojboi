import React from "react";
import { clerkClient, currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Challange from "../challenge";
import { redirect } from "next/navigation";
import { getCompetitionDetails, fetchQuestionsByIds, fetchQuestionsByTopic } from "./play-queries.ts";

export const metadata: Metadata = {
  title: "Challenge Your Friends in Quizzes | Sohojboi",
  description:
    "Test your knowledge and challenge your friends in quizzes across various topics. Join the fun and see who comes out on top on Sohojboi.",
  keywords: [
    "challenge, quiz, knowledge, friends, competition, topics, education, fun",
  ],
};

export default async function page(props: { searchParams: Promise<any> }) {
  const searchParams = await props.searchParams;
  // Variables for starting a challenge
  let currentUserData = await currentUser();
  currentUserData = JSON.parse(JSON.stringify(currentUserData));

  let opponentId = searchParams.challengeeId;

  const selectedTopicId = searchParams.topicId;
  const existingCompetitionId = searchParams.competitionId;

  let questions, competition;

  if (existingCompetitionId) {
    competition = await getCompetitionDetails(existingCompetitionId);

    // redirect to result if competition status is completed
    if (competition?.status === "completed") {
      redirect(`/challenge/result?competitionId=${existingCompetitionId}`);
    }

    //this var for accept existing challenge
    const challengerId = competition?.challengerId;
    let challenger = await clerkClient().users.getUser(challengerId!);
    challenger = JSON.parse(JSON.stringify(challenger));

    questions = await fetchQuestionsByIds(competition?.questionIds!);

    return (
      <div className="flex flex-col items-center gap-2">
        <Challange
          topic={questions![0].topic?.name!}
          quizId={questions![0].id}
          challenger={challenger!}
          challengeeId={currentUserData?.id!}
          quizQuestions={questions!}
          competition={competition!}
        />
      </div>
    );
  } else {
    try {
      questions = await fetchQuestionsByTopic(selectedTopicId);
    } catch (error) {
      throw new Error("Error fetching questions:");
    }
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-2 font-bold">
        There are no questions for this topic
      </div>
    );
  }

  if (opponentId === currentUserData?.id) {
    throw new Error("You cannot challenge yourself!");
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Challange
        topic={questions![0].topic?.name!}
        quizId={questions![0].id}
        challenger={currentUserData!}
        challengeeId={opponentId}
        quizQuestions={questions!}
      />
    </div>
  );
}
