"use server"

import prisma from "@/lib/prisma";


export const chekcIsQuestionUpvoted = async (
    actorId: string,
    quesitonId: string
  ) => {
    let isUpvotedQuestion;
  
    isUpvotedQuestion = await prisma.upvote.findUnique({
      where: {
        userId_questionId: {
          userId: actorId || "",
          questionId: quesitonId,
        },
      },
    });
  
    return (isUpvotedQuestion = !!isUpvotedQuestion);
  };
  
  export const chekcIsAnswerUpvoted = async (
    actorId: string,
    answerId: string
  ) => {
    let isUpvotedAnswer;
  
    isUpvotedAnswer = await prisma.upvote.findUnique({
      where: {
        userId_answerId: {
          userId: actorId || "",
          answerId: answerId,
        },
      },
    });
  
    return (isUpvotedAnswer = !!isUpvotedAnswer);
  };
  