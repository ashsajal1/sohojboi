import prisma from '@/lib/prisma';
import React from 'react';

export default async function page() {
  const quiz = await prisma.quiz.create({
    data: {
      title: 'Physics Quiz',
      description: 'A quiz on basic concepts of physics',
      topic: 'Physics',
      chapter: 'Gravitation',
      questions: {
        create: [
          {
            content: 'What is the acceleration due to gravity on Earth?',
            options: {
              create: [
                { content: '9.8 m/s²', isCorrect: true }, // Marking correct option
                { content: '10.8 m/s²' },
                { content: '8.8 m/s²' },
                { content: '7.8 m/s²' },
              ],
            },
          },
          {
            content: 'Who formulated the law of universal gravitation?',
            options: {
              create: [
                { content: 'Albert Einstein' },
                { content: 'Isaac Newton', isCorrect: true }, // Marking correct option
                { content: 'Galileo Galilei' },
                { content: 'Nikola Tesla' },
              ],
            },
          },
          {
            content: 'What is the gravitational force between two 1 kg masses 1 meter apart?',
            options: {
              create: [
                { content: '9.8 N' },
                { content: '1 N' },
                { content: '0.1 N' },
                { content: '6.674 × 10^-11 N', isCorrect: true }, // Marking correct option
              ],
            },
          },
        ],
      },
    },
    include: {
      questions: {
        include: {
          options: true,
        },
      },
    },
  });

  console.log('Quiz created:', quiz);

  return (
    <div>page</div>
  );
}
