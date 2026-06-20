/** components/Hero.tsx */
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 py-20 md:py-28">
      {/* Optional illustration – replace with your own SVG/PNG */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/images/hero-illustration.svg"
          alt="Illustration"
          fill
          className="object-contain opacity-15"
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="font-heading text-5xl font-extrabold leading-tight tracking-tight md:text-6xl lg:text-7xl">
          Learn Luxembourgish <br className="hidden md:inline" />
          the fun, gamified way.
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-foreground/80 md:text-xl">
          Master the language through bite‑size lessons, spaced‑repetition,
          XP, streaks.
        </p>

        <div className="mt-10 flex flex-col items-center gap-4 md:flex-row md:justify-center">
          <Button size="lg" asChild>
            <a href="/lessons">Start Your First Lesson</a>
          </Button>

          <Button
            size="lg"
            variant="outline"
            asChild
            className="bg-white/90 hover:bg-white/80"
          >
            <a href="#features">Explore Features</a>
          </Button>
        </div>
      </div>
    </section>
  );
}