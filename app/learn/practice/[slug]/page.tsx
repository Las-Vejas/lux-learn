import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { and, eq, gt } from "drizzle-orm";
import { notFound } from "next/navigation";

import { FlashcardReviewer } from "@/components/flashcard-reviewer";
import { Button } from "@/components/ui/button";
import { db } from "@/db";
import { flashcardDecks, flashcards, userFlashcardProgress } from "@/db/schema";

export default async function FlashcardDeckPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const deckPath = `/learn/practice/${slug}`;

  if (slug === "missed") {
    const { userId } = await auth();

    if (!userId) notFound();

    const missedCards = await db
      .select({
        id: flashcards.id,
        luxembourgish: flashcards.luxembourgish,
        english: flashcards.english,
        pronunciation: flashcards.pronunciation,
        exampleSentence: flashcards.exampleSentence,
      })
      .from(userFlashcardProgress)
      .innerJoin(flashcards, eq(flashcards.id, userFlashcardProgress.flashcardId))
      .where(
        and(
          eq(userFlashcardProgress.clerkUserId, userId),
          gt(userFlashcardProgress.wrongCount, 0)
        )
      )
      .orderBy(userFlashcardProgress.nextReviewAt);

    return (
      <main className="min-h-svh bg-muted/30 pb-28">
        <div className="container mx-auto flex flex-col items-center gap-8 px-4 py-8">
          <Header
            eyebrow="Smart review"
            title="Words I missed"
            description="Cards you marked as missed return here automatically."
          />
          <FlashcardReviewer cards={missedCards} deckPath={deckPath} />
        </div>
      </main>
    );
  }

  const [deck] = await db
    .select()
    .from(flashcardDecks)
    .where(eq(flashcardDecks.slug, slug))
    .limit(1);

  if (!deck) notFound();

  const cards = await db
    .select({
      id: flashcards.id,
      luxembourgish: flashcards.luxembourgish,
      english: flashcards.english,
      pronunciation: flashcards.pronunciation,
      exampleSentence: flashcards.exampleSentence,
    })
    .from(flashcards)
    .where(eq(flashcards.deckId, deck.id))
    .orderBy(flashcards.luxembourgish);

  return (
    <main className="min-h-svh bg-muted/30 pb-28">
      <div className="container mx-auto flex flex-col items-center gap-8 px-4 py-8">
        <Header
          eyebrow="Preset deck"
          title={deck.title}
          description={deck.description ?? "Practice this word set."}
        />
        <FlashcardReviewer cards={cards} deckPath={deckPath} />
      </div>
    </main>
  );
}

function Header({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <header className="flex w-full max-w-2xl flex-col gap-4">
      <Button variant="ghost" asChild className="w-fit">
        <Link href="/learn/practice">Back to decks</Link>
      </Button>
      <div className="flex flex-col gap-2">
        <p className="text-sm font-medium text-muted-foreground">{eyebrow}</p>
        <h1 className="text-4xl font-bold tracking-tight">{title}</h1>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </header>
  );
}
