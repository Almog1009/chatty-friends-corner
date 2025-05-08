import { useState } from "react";
import { Settings, Users, MessageCircle, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AppSidebar = ({
  isOpen,
  onClose,
  activeSection,
  onSectionChange,
}: AppSidebarProps) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("currentUser");
    // Navigate to landing page
    navigate("/");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out bg-theme-purple/10 border-r border-theme-purple/20",
        isOpen ? "w-64" : "w-0"
      )}
    >
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-theme-purple/20">
          <h2
            className={cn(
              "font-semibold text-theme-purple",
              !isOpen && "hidden"
            )}
          >
            Chatty Friends Corner
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="hover:bg-theme-purple/10"
          >
            <span className="sr-only">
              {isOpen ? "Collapse sidebar" : "Expand sidebar"}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={cn(
                "text-theme-purple transition-transform",
                !isOpen && "rotate-180"
              )}
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-2">
            <li>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-left font-normal",
                  activeSection === "chat"
                    ? "bg-theme-purple/20 text-theme-purple-dark"
                    : "hover:bg-theme-purple/10",
                  !isOpen && "justify-center p-2"
                )}
                onClick={() => onSectionChange("chat")}
              >
                <MessageCircle size={18} />
                {isOpen && <span>Chat</span>}
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-left font-normal",
                  activeSection === "supporting"
                    ? "bg-theme-purple/20 text-theme-purple-dark"
                    : "hover:bg-theme-purple/10",
                  !isOpen && "justify-center p-2"
                )}
                onClick={() => onSectionChange("supporting")}
              >
                <Users size={18} />
                {isOpen && <span>Supporting</span>}
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-left font-normal",
                  activeSection === "settings"
                    ? "bg-theme-purple/20 text-theme-purple-dark"
                    : "hover:bg-theme-purple/10",
                  !isOpen && "justify-center p-2"
                )}
                onClick={() => onSectionChange("settings")}
              >
                <Settings size={18} />
                {isOpen && <span>App Settings</span>}
              </Button>
            </li>
          </ul>
        </nav>

        <div className="p-4 border-t border-theme-purple/20">
          <div className="flex flex-col gap-4">
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start gap-3 text-left font-normal text-theme-purple hover:text-theme-purple-dark hover:bg-theme-purple/10",
                !isOpen && "justify-center p-2"
              )}
              onClick={handleLogout}
            >
              <LogOut size={18} />
              {isOpen && <span>Log Out</span>}
            </Button>
            <p
              className={cn("text-xs text-muted-foreground", !isOpen && "hidden")}
            >
              Chatty Friends Corner v1.0
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
