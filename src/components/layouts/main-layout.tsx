import { useState } from "react";
import {
  MessageCircle,
  Users,
  Bell,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Outlet, useNavigate, useLocation } from "react-router";
import React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import useAuth from "@/hooks/use-auth";
import { showDialog } from "../elements/dialog.element";

function MainLayout() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [expanded, setExpanded] = useState(false);

  const navTab = (url: string) => {
    navigate(`/u/${url}`);
  };

  const isActive = (path: string) => {
    return location.pathname.includes(path);
  };

  const toggleSidebar = () => {
    setExpanded(!expanded);
  };

  const menuItems = [
    {
      path: "message",
      icon: <MessageCircle className="h-[18px] w-[18px]" />,
      label: "Messages",
    },
    {
      path: "friends",
      icon: <Users className="h-[18px] w-[18px]" />,
      label: "Friends",
    },
    {
      path: "notification",
      icon: <Bell className="h-[18px] w-[18px]" />,
      label: "Notifications",
    },
  ];

  const footerItems = [
    {
      action: () => {
        navigate("/u/setting");
      },
      icon: <Settings className="h-[18px] w-[18px]" />,
      label: "Settings",
    },
    {
      action: () => {
        showDialog({
          title: "Logout",
          description: "Are you sure you want to logout?",
          actions: [
            {
              label: "I want to logout",
              onClick: () => {
                auth.signout();
                navigate("/");
              },
            },
          ],
        });
      },
      icon: <LogOut className="h-[18px] w-[18px]" />,
      label: "Logout",
    },
  ];

  return (
    <div className="h-screen w-full overflow-hidden bg-[#F5F5F5]">
      <div className="flex h-full w-full">
        {/* Sidebar */}
        <aside
          className={cn(
            " rounded-xl mt-3 mb-3 ml-2 mr-2 bg-white shadow-sm transition-all duration-300 flex flex-col relative z-10",
            expanded ? "w-56" : "w-16"
          )}
        >
          {/* Toggle Button */}
          <div className="absolute -right-2.5 top-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 rounded-full shadow-sm border border-gray-100 bg-white"
              onClick={toggleSidebar}
            >
              {expanded ? (
                <ChevronLeft className="h-2.5 w-2.5" />
              ) : (
                <ChevronRight className="h-2.5 w-2.5" />
              )}
            </Button>
          </div>

          {/* Header */}
          <div className="py-3 px-3 border-b border-gray-100 flex items-center">
            {expanded ? (
              <div
                className="flex items-center gap-2 w-full hover:bg-gray-300 rounded-sm"
                onClick={() => navTab(`profile/${auth.user?.userName}`)}
              >
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gray-50 text-xs">
                    U
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {`${auth.user?.fullName}`}
                  </p>
                  <div className="text-xs text-gray-400 truncate">
                    {"@" + auth.user?.userName || "@"}
                  </div>
                </div>
              </div>
            ) : (
              <Button
                variant="ghost"
                className="flex justify-center w-full"
                onClick={() => navTab(`profile/${auth.user?.userName}`)}
              >
                <Avatar className="h-7 w-7">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-gray-50 text-xs">
                    U
                  </AvatarFallback>
                </Avatar>
              </Button>
            )}
          </div>

          {/* Navigation Menu */}
          <div className="flex-1 overflow-y-auto py-2">
            <nav className="px-2 space-y-0.5">
              <TooltipProvider delayDuration={0}>
                {menuItems.map((item) => (
                  <Tooltip key={item.path}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={() => navTab(item.path)}
                        className={cn(
                          "flex items-center gap-2 w-full py-2 px-3 rounded-md transition-colors text-sm",
                          isActive(item.path)
                            ? "bg-gray-100 text-gray-900 font-medium"
                            : "hover:bg-gray-50 text-gray-600",
                          !expanded && "justify-center"
                        )}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center",
                            isActive(item.path)
                              ? "text-gray-900"
                              : "text-gray-500"
                          )}
                        >
                          {item.icon}
                        </div>
                        {expanded && (
                          <span className="text-sm">{item.label}</span>
                        )}
                        {isActive(item.path) && expanded && (
                          <div className="w-1 h-4 bg-gray-300 rounded-full ml-auto"></div>
                        )}
                      </button>
                    </TooltipTrigger>
                    {!expanded && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </TooltipProvider>
            </nav>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-100 py-2 px-2">
            <nav className="space-y-0.5">
              <TooltipProvider delayDuration={0}>
                {footerItems.map((item, index) => (
                  <Tooltip key={index}>
                    <TooltipTrigger asChild>
                      <button
                        onClick={item.action}
                        className={cn(
                          "flex items-center gap-2 w-full py-2 px-3 rounded-md transition-colors text-sm",
                          "hover:bg-gray-50 text-gray-600",
                          !expanded && "justify-center"
                        )}
                      >
                        <div className="text-gray-500">{item.icon}</div>
                        {expanded && (
                          <span className="text-sm">{item.label}</span>
                        )}
                      </button>
                    </TooltipTrigger>
                    {!expanded && (
                      <TooltipContent side="right">{item.label}</TooltipContent>
                    )}
                  </Tooltip>
                ))}
              </TooltipProvider>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 overflow-auto mt-3 mr-3 mb-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default React.memo(MainLayout);
