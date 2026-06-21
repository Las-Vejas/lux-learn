"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, RotateCcw, XCircle } from "lucide-react";

import { recordFlashcardReview } from "@/app/learn/practice/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

type ReviewCard = {
  id: string;
  luxembourgish: string;
  english: string;
  pronunciation: string | null;
  exampleSentence: string | null;
};

export function FlashcardReviewer({
  cards,
  deckPath,
}: {
  cards: ReviewCard[];
  deckPath: string;
}) {
  const [index, setIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showBackContent, setShowBackContent] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentCard = cards[index];
  const progress = currentCard ? ((index + 1) / cards.length) * 100 : 0;

  useEffect(() => {
    if (!isFlipped) {
      setShowBackContent(false);
      return;
    }

    const timeout = window.setTimeout(() => {
      setShowBackContent(true);
    }, 180);

    return () => window.clearTimeout(timeout);
  }, [isFlipped]);

  function goNext() {
    if (index === cards.length - 1) {
      router.push("/learn/practice");
      return;
    }

    setIsFlipped(false);
    setShowBackContent(false);
    setIndex((current) => current + 1);
  }

  function review(result: "correct" | "wrong") {
    if (!currentCard) return;

    startTransition(async () => {
      await recordFlashcardReview(currentCard.id, result, deckPath);
      goNext();
    });
  }

  if (!currentCard) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No cards yet</CardTitle>
          <CardDescription>This deck is waiting for words.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="flex w-full max-w-2xl flex-col gap-4">
      <div className="flex items-center gap-3">
        <Progress value={progress} className="flex-1" />
        <span className="text-sm text-muted-foreground">
          {index + 1}/{cards.length}
        </span>
      </div>

      <Card className="min-h-[22rem]">
        <CardHeader>
          <CardTitle>{isFlipped ? "Luxembourgish" : "Meaning"}</CardTitle>
          <CardDescription>
            {isFlipped ? "Say it back before marking." : "Tap card to reveal."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <button
            type="button"
            className="w-full rounded-lg outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
            onClick={() => setIsFlipped((value) => !value)}
            aria-label="Flip flashcard"
          >
            <div className="[perspective:1200px]">
              <div
                className={cn(
                  "relative min-h-56 rounded-lg transition-transform duration-500 [transform-style:preserve-3d]",
                  isFlipped && "[transform:rotateY(180deg)]"
                )}
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-lg border bg-muted/30 px-6 py-10 text-center [backface-visibility:hidden]">
                  <span className="text-4xl font-bold tracking-tight">
                    {currentCard.english}
                  </span>
                </div>

                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-lg border bg-card px-6 py-10 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  {showBackContent ? (
                    <>
                      <span className="text-4xl font-bold tracking-tight">
                        {currentCard.luxembourgish}
                      </span>
                      {currentCard.pronunciation ? (
                        <span className="text-sm text-muted-foreground">
                          {currentCard.pronunciation}
                        </span>
                      ) : null}
                      {currentCard.exampleSentence ? (
                        <span className="max-w-md text-sm leading-6 text-muted-foreground">
                          {currentCard.exampleSentence}
                        </span>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>
            </div>
          </button>
        </CardContent>
        <CardFooter className="grid gap-2 sm:grid-cols-3">
          <Button
            type="button"
            variant="destructive"
            onClick={() => review("wrong")}
            disabled={isPending}
          >
            <XCircle data-icon="inline-start" />
            Missed
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsFlipped((value) => !value)}
            disabled={isPending}
          >
            <RotateCcw data-icon="inline-start" />
            Flip
          </Button>
          <Button
            type="button"
            onClick={() => review("correct")}
            disabled={isPending}
          >
            <CheckCircle2 data-icon="inline-start" />
            Got it
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
