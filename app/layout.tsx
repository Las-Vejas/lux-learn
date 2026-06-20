/** app/layout.tsx */
import "./globals.css";
import type { Metadata } from "next";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteChrome } from "@/components/site-chrome";
import { Providers } from "@/app/providers";
import { Analytics } from "@vercel/analytics/next"

export const metadata: Metadata = {
  title: "LuxLearn - Learn Luxembourgish",
  description: "Gamified Luxembourgish lessons",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
      suppressHydrationWarning
    >
      <body className="flex min-h-screen flex-col bg-background text-foreground font-sans">
        <Providers>
        <Analytics/>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <SiteChrome>{children}</SiteChrome>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
