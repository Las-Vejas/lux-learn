"use server";

import { randomUUID } from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { sql } from "drizzle-orm";

import { db } from "@/db";
import { userFlashcardProgress } from "@/db/schema";

export async function recordFlashcardReview(
  flashcardId: string,
  result: "correct" | "wrong",
  deckPath: string
) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const now = new Date();
  const nextReviewAt =
    result === "correct"
      ? new Date(now.getTime() + 1000 * 60 * 60 * 24 * 3)
      : new Date(now.getTime() + 1000 * 60 * 60 * 24);

  await db
    .insert(userFlashcardProgress)
    .values({
      id: randomUUID(),
      clerkUserId: userId,
      flashcardId,
      correctCount: result === "correct" ? 1 : 0,
      wrongCount: result === "wrong" ? 1 : 0,
      masteryLevel: result === "correct" ? 1 : 0,
      lastAnsweredAt: now,
      nextReviewAt,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [
        userFlashcardProgress.clerkUserId,
        userFlashcardProgress.flashcardId,
      ],
      set: {
        correctCount:
          result === "correct"
            ? sql`${userFlashcardProgress.correctCount} + 1`
            : userFlashcardProgress.correctCount,
        wrongCount:
          result === "wrong"
            ? sql`${userFlashcardProgress.wrongCount} + 1`
            : userFlashcardProgress.wrongCount,
        masteryLevel:
          result === "correct"
            ? sql`min(${userFlashcardProgress.masteryLevel} + 1, 5)`
            : sql`max(${userFlashcardProgress.masteryLevel} - 1, 0)`,
        lastAnsweredAt: now,
        nextReviewAt,
        updatedAt: now,
      },
    });

  revalidatePath(deckPath);
  revalidatePath("/learn/practice");
}
