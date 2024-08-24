import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs/server";

export default async function Dashboard() {
    let user, questions, articles, answers;
    try {
        user = await currentUser();
        [questions, articles, answers] = await Promise.all([
            prisma.question.findMany({ where: { userId: user?.id } }),
            prisma.article.findMany({ where: { authorId: user?.id } }),
            prisma.answer.findMany({ where: { userId: user?.id } }),
        ])
    } catch (error) {
        throw error;
    }
    // console.log(user, questions, articles, answers)
  return (
    <div>Dashboard</div>
  )
}
