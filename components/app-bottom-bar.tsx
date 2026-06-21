"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Cog, Lock, PlayCircle, Sparkles, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  {
    href: "/learn",
    label: "Learn",
    icon: PlayCircle,
  },
  {
    href: "/learn/practice",
    label: "Practice",
    icon: Sparkles,
  },
  //{
  //  href: "/learn/leaderboard",
  //  label: "Ranks",
  //  icon: Lock,
  //},
  {
    href: "/learn/profile",
    label: "Profile",
    icon: User,
  },
];

export function AppBottomBar() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="Learning navigation"
      className="fixed inset-x-0 bottom-0 bg-transparent px-3 pb-[calc(env(safe-area-inset-bottom)+0.75rem)] pt-3 backdrop-blur"
    >
      <div className="mx-auto flex max-w-2xl items-center justify-between gap-1 border-2 px-2 py-2 rounded-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/learn" && pathname.startsWith(item.href));

          return (
            <Button
              key={item.href}
              asChild
              variant={isActive ? "secondary" : "ghost"}
              size="sm"
              className={cn(
                "h-14 flex-1 flex-col gap-1 rounded-full px-2",
                isActive && "font-semibold"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <Link href={item.href}>
                <Icon aria-hidden="true" />
                <span className="max-w-full truncate text-xs">
                  {item.label}
                </span>
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
