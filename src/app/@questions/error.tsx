"use client";

import { Card, CardContent, CardTitle } from "@/components/ui/card";

/**
 * Keeps a database outage in the questions slot from taking down the rest of
 * the home page (hero, nav, check-in) with it.
 */
export default function QuestionsError({ reset }: { error: Error; reset: () => void }) {
  return (
    <Card className="p-4 m-12">
      <CardTitle as="h2">Couldn&apos;t load questions</CardTitle>
      <CardContent className="px-0 pt-2 text-sm text-muted-foreground">
        The database is unreachable right now.
        <button
          type="button"
          onClick={() => reset()}
          className="ml-2 text-primary underline underline-offset-4"
        >
          Try again
        </button>
      </CardContent>
    </Card>
  );
}
