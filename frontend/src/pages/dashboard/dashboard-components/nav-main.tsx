import { NavLink } from "react-router-dom";
import { Bot, SquareTerminal } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navMain = [
  {
    title: "Home",
    url: "/home",
    icon: SquareTerminal,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: Bot,
  },
  {
    title: "Delete Profile",
    url: "/delete-account",
    icon: Bot,
  },
  {
    title: "User List",
    url: "/explore",
    icon: Bot,
  },
];

export function NavMain() {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {navMain.map((item) => (
          <SidebarMenuItem key={item.title}>
            <NavLink to={item.url}>
              <SidebarMenuButton tooltip={item.title}>
                {item.icon && <item.icon className="h-4 w-4" />}
                {/* this span will automatically be hidden by Sidebar when collapsed */}
                <span className="ml-2">{item.title}</span>
              </SidebarMenuButton>
            </NavLink>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
