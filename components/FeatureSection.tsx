/** components/FeatureSection.tsx */
import FeatureCard from "@/components/FeatureCard";
import { Rocket, BrainCircuit, Headphones } from "lucide-react";

export default function FeatureSection() {
  const features = [
    {
      title: "Gamified Learning",
      description:
        "Earn XP, level up, keep a streak, and unlock fun achievements as you progress.",
      icon: <Rocket className="h-6 w-6" />,
    },
    {
      title: "Spaced Repetition",
      description:
        "Smart review system that shows you words right before you forget them.",
      icon: <BrainCircuit className="h-6 w-6" />,
    },
    {
      title: "Audio & Pronunciation",
      description:
        "Native-speaker recordings for every phrase, plus instant voice-record feedback.",
      icon: <Headphones className="h-6 w-6" />,
    },
  ];

  return (
    <section id="features" className="py-16 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <span className="mb-3 inline-block rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            Features
          </span>
          <h2 className="text-3xl font-bold md:text-4xl">
            Why LuxLearner?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted-foreground">
            Everything you need to go from &quot;Moien&quot; to fluent, designed to keep you motivated every single day.
          </p>
        </div>

        {/* Card Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f, i) => (
            <FeatureCard
              key={i}
              title={f.title}
              description={f.description}
              icon={f.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}