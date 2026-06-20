import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenuButton,
  SidebarMenu,
  SidebarHeader,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Cog, Flame, Lock, PlayCircle, Sparkles, User } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export function AppSidebar() {
  return (
    <Sidebar className="bg-[#101920] text-white">
      <SidebarHeader className="px-5 pt-6 pb-4">
        <Link href="/learn" className="block">
          <div className="text-4xl font-black tracking-tight">
            LuxLearn
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent className="px-4 pb-4">
        <SidebarGroup className="px-0 pt-2">
          <SidebarMenu className="gap-3">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive
                className="h-10 rounded-2xl border-2 border-sky-400/80 bg-[#21303a] px-4 text-[1.05rem] font-bold tracking-wide text-sky-300 shadow-none hover:bg-[#273944] [&_svg]:size-6"
              >
                <Link href="/learn">
                  <PlayCircle className="shrink-0" />
                  <span>Learn</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="h-10 rounded-2xl px-4 text-[1.05rem] font-bold tracking-wide text-slate-200 hover:bg-white/5 [&_svg]:size-6"
              >
                <Link href="/learn">
                  <Sparkles className="shrink-0 text-sky-400" />
                  <span>Practice</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="h-10 rounded-2xl px-4 text-[1.05rem] font-bold tracking-wide text-slate-200 hover:bg-white/5 [&_svg]:size-6"
              >
                <Link href="/learn">
                  <Lock className="shrink-0 text-yellow-300" />
                  <span>Leaderboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="h-10 rounded-2xl px-4 text-[1.05rem] font-bold tracking-wide text-slate-200 hover:bg-white/5 [&_svg]:size-6"
              >
                <Link href="/learn">
                  <User className="shrink-0 text-violet-300" />
                  <span>Profile</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                className="h-10 rounded-2xl px-4 text-[1.05rem] font-bold tracking-wide text-slate-200 hover:bg-white/5 [&_svg]:size-6"
              >
                <Link href="/learn">
                  <Cog className="shrink-0 text-pink-400" />
                  <span>Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="px-4 pb-5">

      </SidebarFooter>
    </Sidebar>
  )
}
