import { NavLink } from "react-router-dom";
import { House, User, BookOpen, Video, Search } from "lucide-react";
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
    title: "Video Feed",
    url: "/post/feedvideo",
    icon: Video,
  },
  {
    title: "Explore Users",
    url: "/explore",
    icon: Search,
  },
  {
    title: "Learning Plans",
    url: "/learning-plans",
    icon: BookOpen,
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
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

                <span className="ml-2">{item.title}</span>
              </SidebarMenuButton>
            </NavLink>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
