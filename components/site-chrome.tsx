"use client";

import { usePathname } from "next/navigation";

import Header from "@/components/navbar";
import Footer from "@/components/footer";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideChrome =
    pathname.startsWith("/learn") || pathname.startsWith("/lesson");

  return (
    <>
      {hideChrome ? null : <Header />}
      <main className="flex-1">{children}</main>
      {hideChrome ? null : <Footer />}
    </>
  );
}
