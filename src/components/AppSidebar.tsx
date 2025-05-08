import { useState } from "react";
import { Settings, Users, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

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
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out bg-theme-purple/10 border-r border-theme-purple/20",
        isOpen ? "w-64" : "w-16"
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
            Mind Mates
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
              <path d="M15 18l-6-6 6-6" />
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
                  activeSection === "friends"
                    ? "bg-theme-purple/20 text-theme-purple-dark"
                    : "hover:bg-theme-purple/10",
                  !isOpen && "justify-center p-2"
                )}
                onClick={() => onSectionChange("friends")}
              >
                <Users size={18} />
                {isOpen && <span>Friends</span>}
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
          <p
            className={cn("text-xs text-muted-foreground", !isOpen && "hidden")}
          >
            Mind Mates v1.0
          </p>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
