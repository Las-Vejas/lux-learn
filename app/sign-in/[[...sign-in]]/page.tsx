import { SignIn } from "@clerk/nextjs";

import { AuthShell } from "@/components/auth-shell";

export default function Page() {
  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Pick up your Luxembourgish where you left off."
      description="Your lessons, missed words, and review progress stay tied to your account."
    >
      <SignIn />
    </AuthShell>
  );
}
