import React from "react";
import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";
import { Metadata } from "next";
import Challange from "../challange";

export const metadata: Metadata = {
  title: "Challenge Your Friends in Quizzes | Sohojboi",
  description:
    "Test your knowledge and challenge your friends in quizzes across various topics. Join the fun and see who comes out on top on Sohojboi.",
  keywords: [
    "challenge, quiz, knowledge, friends, competition, topics, education, fun",
  ],
};

export default async function page({ searchParams }: { searchParams: any }) {
  let user = await currentUser();
  user = JSON.parse(JSON.stringify(user));
  let challengeeId = searchParams.challengeeId;
  let challengerId;
  const topicId = searchParams.topicId;
  const competitionId = searchParams.competitionId;
  let questions;

  if (competitionId) {
    const competition = await prisma.competition.findUnique({
      where: {
        id: competitionId,
      },
    });

    challengerId = competition?.challengerId;
    if (competition?.challengerId === user?.id) {
      throw new Error("You cannot challenge yourself!");
    }

    questions = await prisma.challengeQuestion.findMany({
      where: {
        id: {
          in: competition?.questionIds,
        },
      },
      include: {
        topic: true,
        chapter: true,
        options: true,
      },
    });
  } else {
    try {
      questions = await prisma.challengeQuestion.findMany({
        where: {
          topicId: topicId,
        },
        include: {
          topic: true,
          chapter: true,
          options: true,
        },
        take: 3,
      });
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

  if (challengeeId === user?.id) {
    throw new Error("You cannot challenge yourself!");
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Challange
        topic={questions![0].topic?.name!}
        quizId={questions![0].id}
        challenger={user!}
        challengeeId={challengeeId ? challengeeId : challengerId}
        quizQuestions={questions!}
      />
    </div>
  );
}
