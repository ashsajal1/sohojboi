/**
 * Increases the view count for a given user and type.
 *
 * @param {string} userId - The ID of the user.
 * @param {string} id - The ID of the article or question.
 * @param {"article" | "question"} type - The type of the item.
 * @throws {Error} If the input parameters are invalid or the type is invalid.
 * @throws {Error} If failed to increase the view count.
 */

import prisma from "@/lib/prisma";

export const increaseView = async (
  userId: string,
  id: string,
  type: "article" | "question"
) => {
  if (!userId || !id || !type) {
    throw new Error("Invalid input parameters");
  }

  try {
    switch (type) {
      case "question":
        await prisma.view.upsert({
          where: {
            user_question_unique: {
              userId: userId,
              questionId: id,
            },
          },
          update: {
            count: {
              increment: 1,
            },
          },
          create: {
            userId: userId,
            count: 1,
            questionId: id,
          },
        });
        break;

      case "article":
        await prisma.view.upsert({
          where: {
            user_article_unique: {
              userId: userId,
              articleId: id,
            },
          },
          update: {
            count: {
              increment: 1,
            },
          },
          create: {
            userId: userId,
            count: 1,
            articleId: id,
          },
        });
        break;

      default:
        throw new Error("Invalid type provided");
    }
  } catch (error) {
    throw new Error("Failed to increase view count");
  }
};
