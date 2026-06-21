import Link from "next/link";
import { currentUser } from "@clerk/nextjs/server";
import { eq, sql } from "drizzle-orm";
import {
  BookOpenCheck,
  Mail,
  RotateCcw,
  ShieldCheck,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import { AccountDetailsDialog } from "@/components/account-details-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { db } from "@/db";
import { userFlashcardProgress } from "@/db/schema";

export default async function ProfilePage() {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  const [stats] = await db
    .select({
      studiedCards: sql<number>`count(${userFlashcardProgress.id})`,
      correct: sql<number>`coalesce(sum(${userFlashcardProgress.correctCount}), 0)`,
      missed: sql<number>`coalesce(sum(${userFlashcardProgress.wrongCount}), 0)`,
      mastered: sql<number>`coalesce(sum(case when ${userFlashcardProgress.masteryLevel} >= 4 then 1 else 0 end), 0)`,
    })
    .from(userFlashcardProgress)
    .where(eq(userFlashcardProgress.clerkUserId, user.id));

  const totalAnswers = Number(stats?.correct ?? 0) + Number(stats?.missed ?? 0);
  const accuracy =
    totalAnswers > 0
      ? Math.round((Number(stats?.correct ?? 0) / totalAnswers) * 100)
      : 0;
  const displayName =
    user.firstName ||
    user.username ||
    user.emailAddresses[0]?.emailAddress.split("@")[0] ||
    "Learner";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <main className="min-h-svh bg-muted/30 pb-28">
      <div className="container mx-auto flex flex-col gap-6 px-4 py-8">
        <header className="flex flex-col gap-2">
          <p className="text-sm font-medium text-muted-foreground">Profile</p>
          <h1 className="text-4xl font-bold tracking-tight">Profile</h1>
          <p className="max-w-2xl text-muted-foreground">
            Manage your account details and track your learning
            progress here.
          </p>
        </header>

        <section className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
          <Card>
            <CardHeader className="items-center text-center">
              <div className="flex flex-row items-center gap-7 text-left">
                <Avatar className="size-20">
                  <AvatarImage src={user.imageUrl} alt="" />
                  <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1">
                  <CardTitle className="text-xl font-semibold">
                    {displayName}
                  </CardTitle>
                  <CardDescription>
                    {user.emailAddresses[0]?.emailAddress}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <AccountDetailsDialog />
              <Button asChild>
                <Link href="/learn/practice">Practice flashcards</Link>
              </Button>
              <div className="grid gap-3 pt-2">
                <InfoRow
                  icon={Mail}
                  label="Email"
                  value={user.emailAddresses[0]?.emailAddress ?? "No email"}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Flashcard stats</CardTitle>
              <CardDescription>
                Based on the cards you have reviewed so far.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <StatCard
                icon={BookOpenCheck}
                label="Cards studied"
                value={Number(stats?.studiedCards ?? 0)}
              />
              <StatCard
                icon={RotateCcw}
                label="Missed words"
                value={Number(stats?.missed ?? 0)}
              />
              <StatCard
                icon={Trophy}
                label="Mastered"
                value={Number(stats?.mastered ?? 0)}
              />
              <div className="flex flex-col gap-3 rounded-lg border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">Accuracy</span>
                  <span className="text-2xl font-bold">{accuracy}%</span>
                </div>
                <Progress value={accuracy} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Statistics</CardTitle>
              <CardDescription>
                Based on the cards you have reviewed so far.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <StatCard
                icon={BookOpenCheck}
                label="XP earned"
                value={Number(stats?.studiedCards ?? 0)}
              />
              <StatCard
                icon={RotateCcw}
                label="Words learned"
                value={Number(stats?.missed ?? 0)}
              />
              <StatCard
                icon={Trophy}
                label="Lessons completed"
                value={Number(stats?.mastered ?? 0)}
              />
              <div className="flex flex-col gap-3 rounded-lg border bg-background p-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm font-medium">Accuracy</span>
                  <span className="text-2xl font-bold">{accuracy}%</span>
                </div>
                <Progress value={accuracy} />
              </div>
            </CardContent>
          </Card>

        </section>
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: number;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-background p-4">
      <div className="flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
        <Icon aria-hidden="true" />
      </div>
      <div className="flex flex-col">
        <span className="text-2xl font-bold">{value}</span>
        <span className="text-sm text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border bg-background p-3">
      <div className="flex size-9 items-center justify-center rounded-lg bg-muted text-primary">
        <Icon aria-hidden="true" />
      </div>
      <div className="flex min-w-0 flex-col">
        <span className="text-sm font-medium">{label}</span>
        <span className="truncate text-sm text-muted-foreground">{value}</span>
      </div>
    </div>
  );
}
