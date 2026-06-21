import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { BookOpen, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { flashcardDecks, flashcards, userFlashcardProgress } from "@/db/schema";

export default async function PracticePage() {
  const { userId } = await auth();
  const decks = await db
    .select({
      id: flashcardDecks.id,
      slug: flashcardDecks.slug,
      title: flashcardDecks.title,
      description: flashcardDecks.description,
      cardCount: sql<number>`count(${flashcards.id})`,
    })
    .from(flashcardDecks)
    .leftJoin(flashcards, eq(flashcards.deckId, flashcardDecks.id))
    .groupBy(flashcardDecks.id)
    .orderBy(flashcardDecks.title);

  const missedCount = userId
    ? await db
        .select({ count: sql<number>`count(${userFlashcardProgress.id})` })
        .from(userFlashcardProgress)
        .where(
          sql`${userFlashcardProgress.clerkUserId} = ${userId} and ${userFlashcardProgress.wrongCount} > 0`
        )
        .then((rows) => rows[0]?.count ?? 0)
    : 0;

  return (
    <main className="min-h-svh bg-muted/30 pb-28">
      <div className="container mx-auto flex flex-col gap-8 px-4 py-8">
          <header className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              Flashcards
            </p>
            <h1 className="text-4xl font-bold tracking-tight">Practice words</h1>
            <p className="max-w-2xl text-muted-foreground">
              Pick a preset deck, flip through words, and missed cards return
              for review.
            </p>
          </header>

          <section className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
                  <RotateCcw aria-hidden="true" />
                </div>
                <CardTitle>Words you missed</CardTitle>
                <CardDescription>
                  Auto-built from cards you mark as missed.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{missedCount}</p>
                <p className="text-sm text-muted-foreground">cards waiting</p>
              </CardContent>
              <CardFooter>
                {missedCount > 0 ? (
                  <Button asChild>
                    <Link href="/learn/practice/missed">Review missed</Link>
                  </Button>
                ) : (
                  <Button disabled>Review missed</Button>
                )}
              </CardFooter>
            </Card>

            {decks.map((deck) => (
              <Card key={deck.id}>
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
                    <BookOpen aria-hidden="true" />
                  </div>
                  <CardTitle>{deck.title}</CardTitle>
                  <CardDescription>{deck.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{deck.cardCount}</p>
                  <p className="text-sm text-muted-foreground">cards</p>
                </CardContent>
                <CardFooter>
                  <Button asChild>
                    <Link href={`/learn/practice/${deck.slug}`}>Start deck</Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </section>
      </div>
    </main>
  );
}
