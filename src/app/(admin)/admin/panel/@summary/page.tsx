import { Button } from '@/components/ui/button'
import { CardContent, CardHeader, CardTitle, Card, CardFooter, CardDescription } from '@/components/ui/card'
import { getChallengeQuestionsSummarizeData } from '@/lib/db-query'
import React from 'react'

export default async function SummarySlot() {
  const summary = await getChallengeQuestionsSummarizeData();

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardContent>
          <CardHeader>
            <CardTitle>Summary of Sohojboi web app</CardTitle>
          </CardHeader>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
            <Card>
              <CardHeader>
                <CardTitle>{summary.totalQuestions}</CardTitle>
                <CardDescription>Total Questions</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{summary.archivedQuestions}</CardTitle>
                <CardDescription>Total Archived Questions</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{summary.pendingQuestions}</CardTitle>
                <CardDescription>Total Pending Questions</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>{summary.publishedQuestions}</CardTitle>
                <CardDescription>Total Published Questions</CardDescription>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Topic</CardTitle>
                <CardDescription>Topic with most questions : {summary.topicWithMostQuestions?.name} ({summary.topicWithMostQuestions?.questionsCount})</CardDescription>
              </CardHeader>
            </Card>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
