import Link from "next/link";
import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";

import { LessonRunner } from "@/components/lesson-runner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import { lessonSteps, lessons } from "@/db/schema";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [lesson] = await db
    .select({
      id: lessons.id,
      slug: lessons.slug,
      title: lessons.title,
      description: lessons.description,
      xpReward: lessons.xpReward,
    })
    .from(lessons)
    .where(eq(lessons.slug, id))
    .limit(1);

  if (!lesson) {
    notFound();
  }

  const steps = await db
    .select({
      id: lessonSteps.id,
      type: lessonSteps.type,
      order: lessonSteps.order,
      prompt: lessonSteps.prompt,
      content: lessonSteps.content,
      answer: lessonSteps.answer,
      choices: lessonSteps.choices,
    })
    .from(lessonSteps)
    .where(eq(lessonSteps.lessonId, lesson.id))
    .orderBy(lessonSteps.order);

  if (steps.length === 0) {
    return (
      <main className="min-h-svh bg-muted/30 px-4 py-8">
        <Card className="mx-auto max-w-xl">
          <CardHeader>
            <CardTitle>{lesson.title}</CardTitle>
            <CardDescription>This lesson has no exercises yet.</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href="/learn">Back to learn</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-svh bg-muted/30">
      <LessonRunner lesson={lesson} steps={steps} />
    </main>
  );
}
