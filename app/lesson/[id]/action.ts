"use server";

import { randomUUID } from "node:crypto";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { eq, sql } from "drizzle-orm";

import { db } from "@/db";
import {
  lessonSteps,
  lessons,
  userFlashcardProgress,
  userLessonAttempts,
  userLessonProgress,
} from "@/db/schema";
import { isLessonAnswerCorrect } from "@/lib/lesson-scoring";

type SubmittedAnswer = {
  stepId: string;
  answer: string;
};

export async function completeLesson({
  lessonId,
  lessonPath,
  answers,
}: {
  lessonId: string;
  lessonPath: string;
  answers: SubmittedAnswer[];
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const [lesson] = await db
    .select({ id: lessons.id, slug: lessons.slug })
    .from(lessons)
    .where(eq(lessons.id, lessonId))
    .limit(1);

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  const steps = await db
    .select({
      id: lessonSteps.id,
      type: lessonSteps.type,
      order: lessonSteps.order,
      answer: lessonSteps.answer,
      flashcardId: lessonSteps.flashcardId,
    })
    .from(lessonSteps)
    .where(eq(lessonSteps.lessonId, lessonId))
    .orderBy(lessonSteps.order);

  if (steps.length === 0) {
    throw new Error("Lesson has no steps");
  }

  const submittedByStep = new Map(
    answers.map((answer) => [answer.stepId, answer.answer])
  );
  const now = new Date();
  const results = steps.map((step) => {
    const answer =
      step.type === "teach" ? "Viewed" : submittedByStep.get(step.id) ?? "";
    const isCorrect =
      step.type === "teach" ||
      isLessonAnswerCorrect(answer, step.answer ?? "");

    return {
      step,
      answer,
      isCorrect,
    };
  });
  const correctCount = results.filter((result) => result.isCorrect).length;
  const wrongResults = results.filter((result) => !result.isCorrect);

  await db.insert(userLessonAttempts).values(
    results.map((result) => ({
      id: randomUUID(),
      clerkUserId: userId,
      lessonStepId: result.step.id,
      answer: result.answer,
      isCorrect: result.isCorrect,
    }))
  );

  await db
    .insert(userLessonProgress)
    .values({
      id: randomUUID(),
      clerkUserId: userId,
      lessonId,
      status: "complete",
      currentStepOrder: steps.length,
      correctCount,
      wrongCount: wrongResults.length,
      completedAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [userLessonProgress.clerkUserId, userLessonProgress.lessonId],
      set: {
        status: "complete",
        currentStepOrder: steps.length,
        correctCount,
        wrongCount: wrongResults.length,
        completedAt: now,
        updatedAt: now,
      },
    });

  for (const result of wrongResults) {
    if (!result.step.flashcardId) continue;

    await db
      .insert(userFlashcardProgress)
      .values({
        id: randomUUID(),
        clerkUserId: userId,
        flashcardId: result.step.flashcardId,
        wrongCount: 1,
        masteryLevel: 0,
        lastAnsweredAt: now,
        nextReviewAt: new Date(now.getTime() + 1000 * 60 * 60 * 24),
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: [
          userFlashcardProgress.clerkUserId,
          userFlashcardProgress.flashcardId,
        ],
        set: {
          wrongCount: sql`${userFlashcardProgress.wrongCount} + 1`,
          masteryLevel: sql`max(${userFlashcardProgress.masteryLevel} - 1, 0)`,
          lastAnsweredAt: now,
          nextReviewAt: new Date(now.getTime() + 1000 * 60 * 60 * 24),
          updatedAt: now,
        },
      });
  }

  revalidatePath("/learn");
  revalidatePath("/learn/practice");
  revalidatePath("/learn/profile");
  revalidatePath(lessonPath);
}
