import { SignUp } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth-shell";

export default function Page() {
  return (
    <AuthShell
      eyebrow="Start learning"
      title="Build your first Luxembourgish habit."
      description="Create an account to keep streaks, review missed words, and unlock smarter practice."
    >
      <SignUp />
    </AuthShell>
  );
}
