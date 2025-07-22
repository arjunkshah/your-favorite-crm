"use client"

import { Button } from "@/components/ui/button"
import { 
  Sidebar, 
  SidebarContent, 
  SidebarHeader, 
  SidebarMenu, 
  SidebarMenuButton, 
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeToggle } from "@/components/theme-toggle"
import Link from "next/link"
import { 
  Users, 
  BarChart3, 
  Settings, 
  Bell, 
  Search, 
  Plus,
  Home,
  Calendar,
  Mail,
  FileText,
  TrendingUp
} from "lucide-react"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full bg-background">
        <Sidebar collapsible="icon">
          <SidebarHeader>
            <div className="flex items-center gap-3 px-3 py-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg">
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">CRM Dashboard</span>
                <span className="text-xs text-muted-foreground">v1.0.0</span>
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/" className="hover:bg-sidebar-accent/50 transition-colors">
                    <Home className="h-4 w-4" />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/customers" className="hover:bg-sidebar-accent/50 transition-colors">
                    <Users className="h-4 w-4" />
                    <span>Customers</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/analytics" className="hover:bg-sidebar-accent/50 transition-colors">
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/calendar" className="hover:bg-sidebar-accent/50 transition-colors">
                    <Calendar className="h-4 w-4" />
                    <span>Calendar</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/messages" className="hover:bg-sidebar-accent/50 transition-colors">
                    <Mail className="h-4 w-4" />
                    <span>Messages</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/reports" className="hover:bg-sidebar-accent/50 transition-colors">
                    <FileText className="h-4 w-4" />
                    <span>Reports</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/settings" className="hover:bg-sidebar-accent/50 transition-colors">
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <div className="flex-1 flex flex-col min-w-0">
          {/* Header with Claymorphic Styling */}
          <header className="flex h-16 items-center gap-4 border-b bg-background/80 backdrop-blur-sm px-4 md:px-6 shadow-sm w-full">
            <SidebarTrigger />
            <div className="flex-1 min-w-0">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search customers, deals..."
                  className="w-full rounded-xl border border-input bg-background/50 pl-10 pr-4 py-2.5 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm hover:shadow-md transition-shadow"
                />
              </div>
            </div>
            <div className="flex items-center gap-3 flex-shrink-0">
              <Button variant="outline" size="sm" className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Plus className="h-4 w-4 mr-2" />
                New Deal
              </Button>
              <Button variant="ghost" size="icon" className="rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <Bell className="h-4 w-4" />
              </Button>
              <ThemeToggle />
              <Avatar className="shadow-sm hover:shadow-md transition-shadow">
                <AvatarImage src="/avatars/01.png" alt="User" />
                <AvatarFallback className="bg-primary/10 text-primary">JD</AvatarFallback>
              </Avatar>
            </div>
          </header>
          
          {/* Main Content */}
          <main className="flex-1 overflow-auto bg-gradient-to-br from-background to-background/80 w-full">
            <div className="w-full h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
} 