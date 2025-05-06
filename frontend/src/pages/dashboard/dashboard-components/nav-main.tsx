import { NavLink } from "react-router-dom";
import { Bot, House, User, UsersRound } from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

const navMain = [
  {
    title: "Post Feed",
    url: "/post/feed",
    icon: House,
  },
  {
    title: "Videos",
    url: "/post/videos",
    icon: House,
  },
  {
    title: "Video Feed",
    url: "/post/feedvideo",
    icon: House,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
  },
  {
    title: "Delete Profile",
    url: "/delete-account",
    icon: Bot,
  },
  {
    title: "Explore Users",
    url: "/explore",
    icon: UsersRound,
  },

  {
    title: "Learning Plans",
    url: "/learning-plans",
    icon: UsersRound,
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
                {item.icon && <item.icon className="h-6 w-6" />}
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
