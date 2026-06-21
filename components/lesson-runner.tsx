"use client";

import { useMemo, useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Lightbulb, XCircle } from "lucide-react";

import { completeLesson } from "@/app/lesson/[id]/action";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { getLessonAnswerResult } from "@/lib/lesson-scoring";
import { cn } from "@/lib/utils";

type LessonStep = {
  id: string;
  type:
    | "teach"
    | "multiple_choice"
    | "translate_to_english"
    | "translate_to_lux"
    | "fill_blank";
  order: number;
  prompt: string;
  content: string | null;
  answer: string | null;
  choices: string[] | null;
};

type SubmittedAnswer = {
  stepId: string;
  answer: string;
};

export function LessonRunner({
  lesson,
  steps,
}: {
  lesson: {
    id: string;
    slug: string;
    title: string;
    description: string | null;
    xpReward: number;
  };
  steps: LessonStep[];
}) {
  const [index, setIndex] = useState(0);
  const [typedAnswer, setTypedAnswer] = useState("");
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [feedback, setFeedback] = useState<
    "correct" | "accent-warning" | "wrong" | null
  >(null);
  const [answers, setAnswers] = useState<SubmittedAnswer[]>([]);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const currentStep = steps[index];
  const progress = ((index + 1) / steps.length) * 100;
  const isChoiceStep =
    currentStep.type === "multiple_choice" || currentStep.type === "fill_blank";
  const needsTextInput =
    currentStep.type === "translate_to_english" ||
    currentStep.type === "translate_to_lux";
  const activeAnswer = isChoiceStep ? selectedAnswer : typedAnswer;
  const isTeachStep = currentStep.type === "teach";
  const canSubmit = isTeachStep || activeAnswer.trim().length > 0;
  const lessonPath = `/lesson/${lesson.slug}`;
  const promptLabel = useMemo(() => getPromptLabel(currentStep.type), [currentStep.type]);

  function recordAndContinue(answer: string) {
    const nextAnswers = upsertAnswer(answers, {
      stepId: currentStep.id,
      answer,
    });

    setAnswers(nextAnswers);

    if (index === steps.length - 1) {
      startTransition(async () => {
        await completeLesson({
          lessonId: lesson.id,
          lessonPath,
          answers: nextAnswers,
        });
        router.push("/learn");
        router.refresh();
      });
      return;
    }

    setIndex((current) => current + 1);
    setTypedAnswer("");
    setSelectedAnswer("");
    setFeedback(null);
  }

  function checkAnswer() {
    if (isTeachStep) {
      recordAndContinue("Viewed");
      return;
    }

    const result = getLessonAnswerResult(activeAnswer, currentStep.answer ?? "");

    setFeedback(result);
  }

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-3xl flex-col gap-5 px-4 py-6">
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="icon">
          <Link href="/learn" aria-label="Back to learn">
            <ArrowLeft />
          </Link>
        </Button>
        <Progress value={progress} className="flex-1" />
        <span className="text-sm text-muted-foreground">
          {index + 1}/{steps.length}
        </span>
      </div>

      <Card className="min-h-[31rem]">
        <CardHeader>
          <div className="flex items-center justify-between gap-3">
            <div className="flex flex-col gap-1">
              <CardTitle>{lesson.title}</CardTitle>
              <CardDescription>{lesson.description}</CardDescription>
            </div>
            <div className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground">
              {lesson.xpReward} XP
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-1 flex-col gap-6">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-medium text-muted-foreground">
              {promptLabel}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              {currentStep.prompt}
            </h1>
            {currentStep.content ? (
              <p className="text-base leading-7 text-muted-foreground">
                {currentStep.content}
              </p>
            ) : null}
          </div>

          {isTeachStep ? (
            <div className="flex flex-col gap-3 rounded-xl border bg-muted/40 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lightbulb aria-hidden="true" />
                New phrase
              </div>
              <p className="text-2xl font-semibold">{currentStep.answer}</p>
            </div>
          ) : null}

          {isChoiceStep ? (
            <div className="grid gap-3 sm:grid-cols-2">
              {(currentStep.choices ?? []).map((choice) => {
                const isSelected = selectedAnswer === choice;

                return (
                  <Button
                    key={choice}
                    type="button"
                    variant={isSelected ? "secondary" : "outline"}
                    className="h-auto justify-start whitespace-normal px-4 py-3 text-left"
                    onClick={() => {
                      setSelectedAnswer(choice);
                      setFeedback(null);
                    }}
                    disabled={feedback !== null || isPending}
                  >
                    {choice}
                  </Button>
                );
              })}
            </div>
          ) : null}

          {needsTextInput ? (
            <form
              className="flex flex-col gap-3"
              onSubmit={(event) => {
                event.preventDefault();
                if (canSubmit && feedback === null) {
                  checkAnswer();
                }
              }}
            >
              <Input
                value={typedAnswer}
                onChange={(event) => {
                  setTypedAnswer(event.target.value);
                  setFeedback(null);
                }}
                placeholder="Type your answer"
                aria-label="Answer"
                disabled={feedback !== null || isPending}
                autoFocus
              />
            </form>
          ) : null}

          {feedback ? (
            <div
              className={cn(
                "flex flex-col gap-2 rounded-xl border p-4",
                feedback === "wrong" ? "bg-destructive/10" : "bg-muted/40"
              )}
            >
              <div className="flex items-center gap-2 font-medium">
                {feedback === "wrong" ? (
                  <XCircle aria-hidden="true" />
                ) : (
                  <CheckCircle2 aria-hidden="true" />
                )}
                {feedback === "wrong" ? "Not quite." : "Nice, that is right."}
              </div>
              {feedback === "wrong" ? (
                <p className="text-sm text-muted-foreground">
                  Correct answer: {currentStep.answer}
                </p>
              ) : null}
              {feedback === "accent-warning" ? (
                <div className="rounded-lg border bg-background p-3 text-sm text-muted-foreground">
                  <span className="font-medium text-foreground">
                    Accent note:
                  </span>{" "}
                  You had the right answer, but the spelling uses accents:{" "}
                  <span className="font-medium text-foreground">
                    {currentStep.answer}
                  </span>
                </div>
              ) : null}
            </div>
          ) : null}
        </CardContent>
        <CardFooter className="mt-auto justify-end gap-2">
          {feedback ? (
            <Button
              type="button"
              onClick={() => recordAndContinue(activeAnswer)}
              disabled={isPending}
            >
              {index === steps.length - 1 ? "Finish lesson" : "Continue"}
            </Button>
          ) : (
            <Button
              type="button"
              onClick={checkAnswer}
              disabled={!canSubmit || isPending}
            >
              {isTeachStep ? "Continue" : "Check"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

function upsertAnswer(answers: SubmittedAnswer[], answer: SubmittedAnswer) {
  const withoutCurrent = answers.filter((item) => item.stepId !== answer.stepId);

  return [...withoutCurrent, answer];
}

function getPromptLabel(type: LessonStep["type"]) {
  switch (type) {
    case "teach":
      return "Learn";
    case "multiple_choice":
      return "Choose the meaning";
    case "translate_to_english":
      return "Translate to English";
    case "translate_to_lux":
      return "Translate to Luxembourgish";
    case "fill_blank":
      return "Fill the blank";
  }
}
