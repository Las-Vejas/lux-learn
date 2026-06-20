/** components/Footer.tsx */
export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-8 text-center text-sm text-foreground/70">
      <p>
        © {new Date().getFullYear()} LuxLearner. All rights reserved.
      </p>
      <p className="mt-1">
        Built with{" "}
        <a href="https://nextjs.org" className="underline hover:text-foreground">
          Next.js
        </a>
        ,{" "}
        <a href="https://tailwindcss.com" className="underline hover:text-foreground">
          Tailwind
        </a>
        , and{" "}
        <a href="https://ui.shadcn.com" className="underline hover:text-foreground">
          shadcn/ui
        </a>
        .
      </p>
    </footer>
  );
}