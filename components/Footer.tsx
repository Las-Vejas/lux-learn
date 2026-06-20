/** components/Footer.tsx */
export default function Footer() {
  return (
    <footer className="border-t border-border bg-background py-6 text-center text-sm text-foreground/70">
      <p>
        © {new Date().getFullYear()} LuxLearn. All rights reserved.
      </p>
      <p className="mt-1">
        Built by <a href="https://github.com/las-vejas" className="underline">Vejas S</a>
      </p>
    </footer>
  );
}