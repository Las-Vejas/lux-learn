"use client";

import Link from "next/link";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";
import { AlignJustify } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/90 backdrop-blur-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        {/* Logo / Brand */}
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold tracking-tight text-primary">
            🇱🇺 LuxLearn
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden space-x-6 md:flex">
          <Link href="#features"
                className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Features
          </Link>
          <Link href="#testimonials"
                className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Stories
          </Link>
          <Link href="#contact"
                className="text-sm font-medium text-foreground/80 hover:text-foreground">
            Contact
          </Link>
        </nav>

        {/* Desktop actions */}
        <div className="hidden items-center gap-2 md:flex">
          <ThemeToggle />
          <Show when="signed-out">
            <SignInButton>
              <Button variant="ghost">Sign in</Button>
            </SignInButton>
            <SignUpButton>
              <Button>Sign up</Button>
            </SignUpButton>
          </Show>
          <Show when="signed-in">
            <Button asChild>
              <Link href="/learn">Open lessons</Link>
            </Button>
            <UserButton />
          </Show>
        </div>

        {/* Mobile menu icon – placeholder (you can wire a drawer later) */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <Show when="signed-in">
            <UserButton />
          </Show>
          <Show when="signed-out">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/sign-in">
                <AlignJustify className="h-5 w-5" />
                <span className="sr-only">Sign in</span>
              </Link>
            </Button>
          </Show>
        </div>
      </div>
    </header>
  );
}
