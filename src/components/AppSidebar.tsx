
import { useState } from 'react';
import { Settings, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const AppSidebar = ({ isOpen, onClose, activeSection, onSectionChange }: AppSidebarProps) => {
  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out bg-theme-purple/10 border-r border-theme-purple/20",
        isOpen ? "w-64" : "w-0"
      )}
    >
      <div className="h-full flex flex-col overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-theme-purple/20">
          <h2 className="font-semibold text-theme-purple">Settings</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="hover:bg-theme-purple/10"
          >
            <span className="sr-only">Close sidebar</span>
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
              className="text-theme-purple"
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
                  activeSection === "friends"
                    ? "bg-theme-purple/20 text-theme-purple-dark"
                    : "hover:bg-theme-purple/10"
                )}
                onClick={() => onSectionChange("friends")}
              >
                <Users size={18} />
                Friends
              </Button>
            </li>
            <li>
              <Button
                variant="ghost"
                className={cn(
                  "w-full justify-start gap-3 text-left font-normal",
                  activeSection === "settings"
                    ? "bg-theme-purple/20 text-theme-purple-dark"
                    : "hover:bg-theme-purple/10"
                )}
                onClick={() => onSectionChange("settings")}
              >
                <Settings size={18} />
                App Settings
              </Button>
            </li>
          </ul>
        </nav>
        
        <div className="p-4 border-t border-theme-purple/20">
          <p className="text-xs text-muted-foreground">Chatty Friends Corner v1.0</p>
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
