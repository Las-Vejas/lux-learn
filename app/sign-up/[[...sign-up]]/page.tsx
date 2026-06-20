import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-16">
      <SignUp />
    </div>
  );
}
