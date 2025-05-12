import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome,
  FiUsers,
  FiUser,
  FiLogOut,
    FiBook,
    FiFileText,
  FiCompass,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { motion } from "framer-motion";

interface SidebarProps {
  toggleLeftPanel: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ toggleLeftPanel }) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <motion.div
      className={`h-screen fixed left-0 top-0 flex flex-col justify-between bg-background border-r p-4 ${
        isCollapsed ? "w-16" : "w-64"
      }`}
      initial={{ width: isCollapsed ? 64 : 256 }}
      animate={{ width: isCollapsed ? 64 : 256 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
    >
      {/* Top Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <motion.h2
            className="text-2xl font-bold overflow-hidden"
            animate={{ opacity: isCollapsed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            ChopChop
          </motion.h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="h-8 w-8 p-0"
          >
            {isCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
          </Button>
        </div>

        <nav className="space-y-1">
          {[
            { icon: <FiHome />, text: "Home", path: "/home" },
            { icon: <FiCompass />, text: "Explore", path: "/explore" },
            {
              icon: <FiUser />,
              text: "Profile",
              path: `/profile/${currentUser?.id}`,
            },
            { icon: <FiUsers />, text: "Followers", path: "/followers" },
          ].map((item) => (
            <Tooltip key={item.text} delayDuration={0}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-3"
                  asChild
                >
                  <Link to={item.path}>
                    <span className="text-xl">{item.icon}</span>
                    <motion.span
                      className="whitespace-nowrap"
                      animate={{ opacity: isCollapsed ? 0 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      {item.text}
                    </motion.span>
                  </Link>
                </Button>
              </TooltipTrigger>
              {isCollapsed && (
                <TooltipContent side="right">
                  <p>{item.text}</p>
                </TooltipContent>
              )}
            </Tooltip>
          ))}
        </nav>
      </div>

      {/* Bottom Section */}
      <div className="space-y-4 border-t pt-4">
        <div className="flex items-center justify-between px-2 gap-2">
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full p-0 h-10 w-10"
                onClick={toggleLeftPanel}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage
                    src={currentUser?.profileImage}
                    alt={currentUser?.username}
                  />
                  <AvatarFallback>
                    {currentUser?.username?.[0]?.toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Account Settings</p>
              </TooltipContent>
            )}
          </Tooltip>

          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className="gap-2 p-2"
                onClick={handleLogout}
              >
                <FiLogOut className="text-xl" />
                <motion.span
                  className="whitespace-nowrap"
                  animate={{ opacity: isCollapsed ? 0 : 1 }}
                  transition={{ duration: 0.2 }}
                >
                  Logout
                </motion.span>
              </Button>
            </TooltipTrigger>
            {isCollapsed && (
              <TooltipContent side="right">
                <p>Logout</p>
              </TooltipContent>
            )}
          </Tooltip>
        </div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
