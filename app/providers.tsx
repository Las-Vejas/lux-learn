"use client";

import { ClerkProvider } from "@clerk/nextjs";
import { shadcn } from "@clerk/ui/themes";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        theme: shadcn,
        variables: {
          borderRadius: "0.5rem",
          colorBackground: "var(--card)",
          colorBorder: "var(--border)",
          colorForeground: "var(--card-foreground)",
          colorInput: "var(--input)",
          colorInputForeground: "var(--card-foreground)",
          colorMuted: "var(--muted)",
          colorMutedForeground: "var(--muted-foreground)",
          colorPrimary: "var(--primary)",
          colorPrimaryForeground: "var(--primary-foreground)",
          colorRing: "var(--ring)",
          fontFamily: "var(--font-sans)",
          fontFamilyButtons: "var(--font-sans)",
          spacing: "0.95rem",
        },
        options: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "blockButton",
        },
        elements: {
          cardBox: "border shadow-none",
          card: "gap-5",
          headerTitle: "font-heading text-2xl font-bold tracking-tight",
          headerSubtitle: "text-muted-foreground",
          formButtonPrimary: "h-11 font-semibold",
          formFieldInput: "h-11",
          socialButtonsBlockButton: "h-11",
          footerActionLink: "font-semibold",
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
