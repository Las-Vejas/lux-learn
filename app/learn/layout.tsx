import { AppBottomBar } from "@/components/app-bottom-bar";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/navbar2";

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <Navbar/>
      {children}
      <AppBottomBar />
    </TooltipProvider>
  );
}
