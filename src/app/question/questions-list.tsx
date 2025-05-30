import { Question } from "@prisma/client";
import { getQuestions } from "./actions";
import QuestionsListClient from "./questions-list-client";

export default async function QuestionsList() {
  const initialQuestions = await getQuestions(1);
  
  return <QuestionsListClient initialQuestions={initialQuestions} />;
}
