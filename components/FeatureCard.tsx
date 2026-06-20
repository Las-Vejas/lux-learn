/** components/FeatureCard.tsx */
import { Card } from "@/components/ui/card";

type FeatureCardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export default function FeatureCard({
  title,
  description,
  icon,
}: FeatureCardProps) {
  return (
    <Card className="group relative overflow-hidden rounded-2xl border border-border bg-card p-6 transition-all duration-300 hover:-translate-y-2 hover:border-primary/30 hover:shadow-xl">
      {/* Decorative background blob that appears on hover */}
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-primary/5 transition-transform duration-300 group-hover:scale-150" />

      <div className="relative flex flex-col items-start">
        {/* Icon container */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
          {icon}
        </div>

        <h3 className="mt-5 text-xl font-semibold tracking-tight">
          {title}
        </h3>

        <p className="mt-2 text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </Card>
  );
}