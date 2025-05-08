import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AppSidebar from "@/components/AppSidebar";
import ChatView from "@/components/ChatView";
import FriendsView from "@/components/FriendsView";
import { cn } from "@/lib/utils";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("chat");

  useEffect(() => {
    // Set initial sidebar state based on screen size
    const handleResize = () => {
      setSidebarOpen(window.innerWidth >= 768);
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // If we're on mobile, close the sidebar when a section is selected
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-white to-theme-purple-light/30">
      {/* Sidebar overlay - only visible on mobile when sidebar is open */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <AppSidebar
        isOpen={sidebarOpen}
        onClose={toggleSidebar}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main Content */}
      <main
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          sidebarOpen ? "md:ml-64" : "md:ml-16"
        )}
      >
        {/* Mobile Header */}
        <div className="md:hidden p-4 border-b border-theme-purple/20 bg-white/60 backdrop-blur-sm">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="hover:bg-theme-purple/10"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-theme-purple"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
            <span className="sr-only">Toggle sidebar</span>
          </Button>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-4">
          {activeSection === "chat" && <ChatView />}
          {activeSection === "friends" && <FriendsView />}
          {activeSection === "settings" && <div>Settings View</div>}
        </div>
      </main>
    </div>
  );
};

export default Index;
