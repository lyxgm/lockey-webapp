"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Home, LogOut, Settings, Users, Activity } from "lucide-react"

interface AppSidebarProps {
  activeNav: string
  onNavigate: (page: string) => void
  onSignOut: () => void
  onEditProfile: () => void
  currentUser: {
    name: string
    email: string
    avatar?: string
  }
}

const navigationItems = [
  { name: "Dashboard", icon: Home },
  { name: "People", icon: Users },
  { name: "Activity Log", icon: Activity },
  { name: "Settings", icon: Settings },
]

export function AppSidebar({ activeNav, onNavigate, onSignOut, onEditProfile, currentUser }: AppSidebarProps) {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="p-2">
          <div
            className="text-2xl font-bold text-blue-600 italic cursor-pointer"
            onClick={() => onNavigate("Dashboard")}
          >
            Lockey
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navigationItems.map((item) => {
            const Icon = item.icon
            return (
              <SidebarMenuItem key={item.name}>
                <SidebarMenuButton
                  isActive={item.name === activeNav}
                  className="w-full cursor-pointer"
                  onClick={() => onNavigate(item.name)}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <div className="p-4">
          <div
            className="flex items-center space-x-3 mb-3 cursor-pointer hover:bg-sidebar-accent rounded-md p-2 -m-2 transition-colors"
            onClick={onEditProfile}
          >
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg?height=40&width=40"} alt={currentUser.name} />
              <AvatarFallback>
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-sm font-medium text-sidebar-foreground">{currentUser.name}</p>
              <p className="text-xs text-sidebar-foreground/70">{currentUser.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-sidebar-foreground hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-2"
            onClick={onSignOut}
          >
            <LogOut className="h-4 w-4 group-data-[collapsible=icon]:mr-0 mr-2" />
            <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  )
}
