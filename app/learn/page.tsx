import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import { CheckCircle2, Lock, Play, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { db } from "@/db";
import {
  courseSections,
  courseUnits,
  lessons,
  lessonSteps,
  userLessonProgress,
} from "@/db/schema";
import { cn } from "@/lib/utils";

type LessonNode = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: number;
  order: number;
  xpReward: number;
  stepCount: number;
  status: "not_started" | "in_progress" | "complete";
  isUnlocked: boolean;
};

type UnitNode = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  lessons: LessonNode[];
};

type SectionNode = {
  id: string;
  title: string;
  description: string | null;
  order: number;
  units: UnitNode[];
};

export default async function LearnPage() {
  const { userId } = await auth();

  const rows = await db
    .select({
      sectionId: courseSections.id,
      sectionTitle: courseSections.title,
      sectionDescription: courseSections.description,
      sectionOrder: courseSections.order,
      unitId: courseUnits.id,
      unitTitle: courseUnits.title,
      unitDescription: courseUnits.description,
      unitOrder: courseUnits.order,
      lessonId: lessons.id,
      lessonSlug: lessons.slug,
      lessonTitle: lessons.title,
      lessonDescription: lessons.description,
      lessonLevel: lessons.level,
      lessonOrder: lessons.order,
      lessonXpReward: lessons.xpReward,
      stepCount: sql<number>`count(${lessonSteps.id})`,
    })
    .from(lessons)
    .innerJoin(courseUnits, eq(lessons.unitId, courseUnits.id))
    .innerJoin(courseSections, eq(courseUnits.sectionId, courseSections.id))
    .leftJoin(lessonSteps, eq(lessonSteps.lessonId, lessons.id))
    .groupBy(lessons.id, courseUnits.id, courseSections.id)
    .orderBy(courseSections.order, courseUnits.order, lessons.order);

  const progressRows = userId
    ? await db
        .select({
          lessonId: userLessonProgress.lessonId,
          status: userLessonProgress.status,
        })
        .from(userLessonProgress)
        .where(eq(userLessonProgress.clerkUserId, userId))
    : [];

  const progressByLesson = new Map(
    progressRows.map((progress) => [progress.lessonId, progress.status])
  );
  const sections = buildTree(rows, progressByLesson);
  const lessonCount = sections.reduce(
    (total, section) =>
      total +
      section.units.reduce(
        (unitTotal, unit) => unitTotal + unit.lessons.length,
        0
      ),
    0
  );
  const completedLessonCount = sections.reduce(
    (total, section) =>
      total +
      section.units.reduce(
        (unitTotal, unit) =>
          unitTotal +
          unit.lessons.filter((lesson) => lesson.status === "complete").length,
        0
      ),
    0
  );

  return (
    <main className="min-h-svh bg-muted/30 pb-28">
      <div className="container mx-auto flex flex-col gap-8 px-4 py-8">
        <header className="flex flex-col gap-3">
          <p className="text-sm font-medium text-muted-foreground">Learn</p>
          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl font-bold tracking-tight">
                Choose your next lesson
              </h1>
              <p className="max-w-2xl text-muted-foreground">
                Move through the path lesson by lesson. Each lesson has a short
                set of exercises and unlocks the next step when complete.
              </p>
            </div>
            <Card size="sm" className="md:min-w-56">
              <CardHeader>
                <CardTitle>Course progress</CardTitle>
                <CardDescription>
                  {completedLessonCount} of {lessonCount} lessons complete
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </header>

        {sections.length > 0 ? (
          <section className="flex flex-col gap-6">
            {sections.map((section) => (
              <Card key={section.id}>
                <CardHeader>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
                    <Sparkles aria-hidden="true" />
                  </div>
                  <CardTitle>{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-8">
                  {section.units.map((unit) => (
                    <div key={unit.id} className="flex flex-col gap-5">
                      <div className="flex flex-col gap-1">
                        <h2 className="text-xl font-semibold">{unit.title}</h2>
                        <p className="text-sm text-muted-foreground">
                          {unit.description}
                        </p>
                      </div>

                      <div className="relative mx-auto flex w-full max-w-md flex-col items-center gap-6 py-2">
                        <div className="absolute bottom-12 top-12 left-1/2 w-px -translate-x-1/2 bg-border" />
                        {unit.lessons.map((lesson, index) => (
                          <LessonTreeNode
                            key={lesson.id}
                            lesson={lesson}
                            side={index % 2 === 0 ? "left" : "right"}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))}
          </section>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>No lessons yet</CardTitle>
              <CardDescription>
                Run the seed script to add the first Basics lessons.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <code className="rounded-md bg-muted px-2 py-1 text-sm">
                npm run db:seed
              </code>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}

function buildTree(
  rows: Array<{
    sectionId: string;
    sectionTitle: string;
    sectionDescription: string | null;
    sectionOrder: number;
    unitId: string;
    unitTitle: string;
    unitDescription: string | null;
    unitOrder: number;
    lessonId: string;
    lessonSlug: string;
    lessonTitle: string;
    lessonDescription: string | null;
    lessonLevel: number;
    lessonOrder: number;
    lessonXpReward: number;
    stepCount: number;
  }>,
  progressByLesson: Map<string, "not_started" | "in_progress" | "complete">
) {
  const sections = new Map<string, SectionNode>();

  for (const row of rows) {
    if (!sections.has(row.sectionId)) {
      sections.set(row.sectionId, {
        id: row.sectionId,
        title: row.sectionTitle,
        description: row.sectionDescription,
        order: row.sectionOrder,
        units: [],
      });
    }

    const section = sections.get(row.sectionId)!;
    let unit = section.units.find((item) => item.id === row.unitId);

    if (!unit) {
      unit = {
        id: row.unitId,
        title: row.unitTitle,
        description: row.unitDescription,
        order: row.unitOrder,
        lessons: [],
      };
      section.units.push(unit);
    }

    unit.lessons.push({
      id: row.lessonId,
      slug: row.lessonSlug,
      title: row.lessonTitle,
      description: row.lessonDescription,
      level: row.lessonLevel,
      order: row.lessonOrder,
      xpReward: row.lessonXpReward,
      stepCount: Number(row.stepCount),
      status: progressByLesson.get(row.lessonId) ?? "not_started",
      isUnlocked: false,
    });
  }

  const tree = Array.from(sections.values()).sort((a, b) => a.order - b.order);

  for (const section of tree) {
    section.units.sort((a, b) => a.order - b.order);

    for (const unit of section.units) {
      unit.lessons.sort((a, b) => a.order - b.order);
      let previousIsComplete = true;

      for (const lesson of unit.lessons) {
        lesson.isUnlocked = previousIsComplete || lesson.status !== "not_started";
        previousIsComplete = lesson.status === "complete";
      }
    }
  }

  return tree;
}

function LessonTreeNode({
  lesson,
  side,
}: {
  lesson: LessonNode;
  side: "left" | "right";
}) {
  const isComplete = lesson.status === "complete";
  const isInProgress = lesson.status === "in_progress";
  const Icon = isComplete ? CheckCircle2 : lesson.isUnlocked ? Play : Lock;
  const node = (
    <>
      <Icon aria-hidden="true" />
    </>
  );

  return (
    <div
      className={cn(
        "relative flex w-full",
        side === "left" ? "justify-start" : "justify-end"
      )}
    >
      <div className="flex w-[min(17rem,80%)] flex-col gap-3 rounded-2xl border bg-background p-3 shadow-sm">
        <div className="flex items-center gap-3">
          {lesson.isUnlocked ? (
            <Button
              asChild
              size="icon-lg"
              variant={isComplete ? "secondary" : "default"}
              className="size-14 rounded-full"
            >
              <Link href={`/lesson/${lesson.slug}`} aria-label={lesson.title}>
                {node}
              </Link>
            </Button>
          ) : (
            <Button
              disabled
              size="icon-lg"
              variant="outline"
              className="size-14 rounded-full"
            >
              {node}
            </Button>
          )}

          <div className="min-w-0 flex-1">
            <h3 className="truncate font-semibold">{lesson.title}</h3>
            <p className="text-sm text-muted-foreground">
              Level {lesson.level} · {lesson.stepCount} steps ·{" "}
              {lesson.xpReward} XP
            </p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">{lesson.description}</p>
        <p className="text-xs font-medium text-muted-foreground">
          {isComplete
            ? "Complete"
            : isInProgress
              ? "In progress"
              : lesson.isUnlocked
                ? "Ready to start"
                : "Locked"}
        </p>
      </div>
    </div>
  );
}
