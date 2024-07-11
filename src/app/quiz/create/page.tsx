import prisma from "@/lib/prisma";
import CreateForm from "./create-form";

export default async function page() {
  const topics = await prisma.topic.findMany()
  return (
    <div>
      <CreateForm topics={topics} />
    </div>
  )
}



// import prisma from '@/lib/prisma';
// import React from 'react';

// export default async function page() {
//   const tag1 = await prisma.tag.create({
//     data: {
//       name: "Math",
//     },
//   });

//   const tag2 = await prisma.tag.create({
//     data: {
//       name: "Science",
//     },
//   });

//   // Create topics
//   const topic = await prisma.topic.create({
//     data: {
//       name: "Algebra",
//     },
//   });

//   // Create chapters
//   const chapter = await prisma.chapter.create({
//     data: {
//       name: "Chapter 1",
//     },
//   });
//   const question1 = await prisma.challengeQuestion.create({
//     data: {
//       content: "What is 2 + 2?",
//       topic: { connect: { id: topic.id } },
//       chapter: { connect: { id: chapter.id } },
//       options: {
//         create: [
//           { content: "3", isCorrect: false },
//           { content: "4", isCorrect: true },
//           { content: "5", isCorrect: false },
//         ],
//       },
//       tags: {
//         create: [
//           { tag: { connect: { id: tag1.id } } },
//           { tag: { connect: { id: tag2.id } } },
//         ],
//       },
//     },
//   });

//   const question2 = await prisma.challengeQuestion.create({
//     data: {
//       content: "What is H2O?",
//       topic: { connect: { id: topic.id } },
//       chapter: { connect: { id: chapter.id } },
//       options: {
//         create: [
//           { content: "Water", isCorrect: true },
//           { content: "Oxygen", isCorrect: false },
//           { content: "Hydrogen", isCorrect: false },
//         ],
//       },
//       tags: {
//         create: [
//           { tag: { connect: { id: tag1.id } } },
//           { tag: { connect: { id: tag2.id } } },
//         ],
//       },
//     },
//   });


//   console.log('Quiz created:', question1, question2);

//   return (
//     <div>page</div>
//   );
// }
