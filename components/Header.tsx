/** components/Header.tsx */
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { AlignJustify } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / brand */}
        <Link href="/" className="flex items-center space-x-2">
          {/* You can swap this for an SVG logo */}
          <h1 className="text-xl font-bold tracking-tight text-primary">
            🇱🇺 LuxLearn
          </h1>
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden space-x-6 md:flex">
          <Link
            href="#features"
            className="text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            Features
          </Link>
          <Link
            href="#about"
            className="text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="#contact"
            className="text-sm font-medium text-foreground/80 hover:text-foreground"
          >
            Contact
          </Link>
        </nav>

        {/* CTA button (desktop) */}
        <div className="hidden md:block">
          <Button asChild>
            <Link href="/lessons">Start Learning</Link>
          </Button>
        </div>

        {/* Mobile menu toggle – (you can replace with a real drawer later) */}
        <Button variant="ghost" size="icon" className="md:hidden">
          <AlignJustify className="h-5 w-5" />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>
    </header>
  );
}