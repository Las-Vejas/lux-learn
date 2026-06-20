import Link from "next/link";

export function AuthShell({
  children,
  eyebrow,
  title,
  description,
}: {
  children: React.ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="min-h-[calc(100svh-4rem)] bg-muted/30">
      <div className="container mx-auto grid min-h-[calc(100svh-4rem)] items-center gap-10 px-4 py-12 lg:grid-cols-[0.95fr_1.05fr]">
        <section className="mx-auto flex max-w-xl flex-col gap-6 text-center lg:mx-0 lg:text-left">
          <Link href="/" className="text-sm font-semibold text-muted-foreground">
            LuxLearn
          </Link>
          <div className="flex flex-col gap-3">
            <p className="text-sm font-medium text-muted-foreground">
              {eyebrow}
            </p>
            <h1 className="text-4xl font-bold leading-tight tracking-tight md:text-5xl">
              {title}
            </h1>
            <p className="text-base leading-7 text-muted-foreground">
              {description}
            </p>
          </div>
        </section>

        <section className="mx-auto flex w-full max-w-md justify-center lg:justify-end">
          {children}
        </section>
      </div>
    </div>
  );
}
