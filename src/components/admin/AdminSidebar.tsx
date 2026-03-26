"use client";

import {
  LayoutDashboard,
  GraduationCap,
  CalendarDays,
  Users,
  FileText,
  Building2,
  BookOpen,
  FileEdit,
  LogOut,
  Handshake,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { usePathname } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import logo from "@/assets/logo-new.png";

const mainNav = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Programs", url: "/admin/programs", icon: GraduationCap },
  { title: "Cohorts", url: "/admin/cohorts", icon: CalendarDays },
  { title: "Students", url: "/admin/students", icon: Users },
  { title: "Applications", url: "/admin/applications", icon: FileText },
  { title: "Enterprise Leads", url: "/admin/enterprise-leads", icon: Building2 },
  { title: "Exam Prep", url: "/admin/exam-prep", icon: BookOpen },
  { title: "Institutional", url: "/admin/institutional", icon: Building2 },
  { title: "Partners", url: "/admin/partners", icon: Building2 },
  { title: "Partnerships", url: "/admin/partnerships", icon: Handshake },
  { title: "Content", url: "/admin/content", icon: FileEdit },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { signOut } = useAuth();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className="p-4 flex items-center gap-2">
          <div className="relative h-8 w-8">
             <Image src={logo} alt="Aliko" fill className="object-contain" />
          </div>
          {!collapsed && <span className="font-semibold text-sm">Admin</span>}
        </div>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      href={item.url}
                      end={item.url === "/admin"}
                      className="hover:bg-muted/50 flex items-center w-full h-full px-2 py-1.5"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className="mr-2 h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3">
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-muted-foreground"
          onClick={signOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          {!collapsed && "Sign Out"}
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
