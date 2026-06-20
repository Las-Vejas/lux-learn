import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  BrainCircuit,
  CheckCircle2,
  Headphones,
  Rocket,
  Sparkles,
  Trophy,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Feature = {
  title: string;
  description: string;
  icon: LucideIcon;
};

type Testimonial = {
  name: string;
  role: string;
  quote: string;
  initials: string;
};

const features: Feature[] = [
  {
    title: "Daily lessons that stay light",
    description:
      "Practice vocabulary, listening, and phrases in short sessions that fit between classes, work, or the tram.",
    icon: Rocket,
  },
  {
    title: "Review before words fade",
    description:
      "Spaced repetition brings back the right Luxembourgish words when your memory needs a nudge.",
    icon: BrainCircuit,
  },
  {
    title: "Hear the language clearly",
    description:
      "Native-style audio and pronunciation practice help you build confidence before real conversations.",
    icon: Headphones,
  },
];

const testimonials: Testimonial[] = [
  {
    name: "Sophie B.",
    role: "Student, Luxembourg",
    quote:
      "LuxLearn made the language feel approachable. I can now follow simple conversations around campus.",
    initials: "SB",
  },
  {
    name: "Marc D.",
    role: "Freelancer",
    quote:
      "The review flow is calm but effective. I finally remember the words I used to relearn every week.",
    initials: "MD",
  },
  {
    name: "Anna K.",
    role: "Teacher",
    quote:
      "It gives beginners enough structure to keep moving without making practice feel heavy.",
    initials: "AK",
  },
];

const lessonSteps = [
  "Listen to a phrase",
  "Choose the meaning",
  "Repeat it aloud",
  "Review tomorrow",
];

export default function HomePage() {
  return (
    <>
      <section className="border-b bg-muted/30">
        <div className="container mx-auto grid min-h-[calc(100svh-4rem)] items-center gap-12 px-4 py-16 md:grid-cols-[1.05fr_0.95fr] md:py-20">
          <div className="flex max-w-3xl flex-col gap-8">
            <div className="flex flex-col gap-5">
              <p className="text-sm font-medium text-muted-foreground">
                Luxembourgish for daily life
              </p>
              <h1 className="text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
                Learn Luxembourgish in small, memorable lessons.
              </h1>
              <p className="max-w-2xl text-lg leading-8 text-muted-foreground md:text-xl">
                Build a daily habit with bite-size practice, smart reviews, and
                clear audio for the words people actually use in Luxembourg.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button size="lg" asChild>
                <Link href="/learn">
                  <Sparkles data-icon="inline-start" />
                  Start learning
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="#features">See how it works</Link>
              </Button>
            </div>

            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <p>5-minute sessions</p>
              <p>Review reminders</p>
              <p>Audio-first phrases</p>
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle>Today&apos;s lesson</CardTitle>
                <CardDescription>
                  A quick phrase path from listening to review.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {lessonSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-center gap-3 rounded-lg bg-muted/50 p-3"
                  >
                    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-background text-sm font-medium ring-1 ring-border">
                      {index + 1}
                    </span>
                    <span className="font-medium">{step}</span>
                    {index === 0 ? (
                      <CheckCircle2
                        className="ml-auto text-primary"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                ))}
              </CardContent>
              <CardFooter className="justify-between">
                <span className="text-sm text-muted-foreground">Streak</span>
                <span className="text-sm font-medium">12 days</span>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <section id="features" className="bg-background py-16 md:py-24">
        <div className="container mx-auto flex flex-col gap-10 px-4">
          <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Built for consistency
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Practice that feels doable every day.
            </h2>
            <p className="text-muted-foreground">
              LuxLearn focuses on the loop that matters: show up, understand a
              phrase, hear it clearly, and see it again before it slips away.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;

              return (
                <Card key={feature.title}>
                  <CardHeader>
                    <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
                      <Icon aria-hidden="true" />
                    </div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-y bg-muted/30 py-16 md:py-20">
        <div className="container mx-auto grid gap-4 px-4 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>2,000+</CardTitle>
              <CardDescription>words and phrases for beginners</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>5 min</CardTitle>
              <CardDescription>average daily lesson length</CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>4 skills</CardTitle>
              <CardDescription>listening, reading, speaking, review</CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      <section id="testimonials" className="bg-background py-16 md:py-24">
        <div className="container mx-auto flex flex-col gap-10 px-4">
          <div className="mx-auto flex max-w-2xl flex-col gap-3 text-center">
            <p className="text-sm font-medium text-muted-foreground">
              Learner stories
            </p>
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Quiet progress adds up.
            </h2>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.name}>
                <CardContent className="pt-0">
                  <blockquote className="text-base leading-7 text-muted-foreground">
                    &quot;{testimonial.quote}&quot;
                  </blockquote>
                </CardContent>
                <CardFooter className="gap-3">
                  <Avatar>
                    <AvatarFallback>{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="font-medium">{testimonial.name}</span>
                    <span className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </span>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary py-16 text-primary-foreground md:py-20">
        <div className="container mx-auto flex flex-col items-center gap-6 px-4 text-center">
          <Trophy aria-hidden="true" />
          <div className="flex max-w-2xl flex-col gap-3">
            <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
              Start with one lesson today.
            </h2>
            <p className="text-primary-foreground/80">
              Learn the first phrases, keep the streak alive, and let review do
              the heavy lifting tomorrow.
            </p>
          </div>
          <Button size="lg" variant="secondary" asChild>
            <Link href="/lessons">
              Start learning
              <Rocket data-icon="inline-end" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
