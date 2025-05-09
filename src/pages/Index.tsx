import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AppSidebar from "@/components/AppSidebar";
import ChatView from "@/components/ChatView";
import FriendsView from "@/components/FriendsView";
import { cn } from "@/lib/utils";
import { userService, type User } from "@/services/userService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState("chat");
  const [supporters, setSupporters] = useState<User[]>([]);
  const [potentialSupporters, setPotentialSupporters] = useState<User[]>([]);

  useEffect(() => {
    // Set initial sidebar state based on screen size
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setSidebarOpen(true);
      }
    };

    // Set initial state
    handleResize();

    // Add event listener
    window.addEventListener("resize", handleResize);

    // Cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // Load supporters for the current user (using ID "1" for now)
    const currentSupporters = userService.getSupporters("1");
    setSupporters(currentSupporters);

    // Load all users and filter out current supporters
    const allUsers = userService.getAllUsers();
    const currentSupporterIds = new Set(currentSupporters.map((s) => s.id));
    const potential = allUsers.filter(
      (user) => !currentSupporterIds.has(user.id)
    );
    setPotentialSupporters(potential);
  }, []);

  const handleAddSupporter = (user: User) => {
    // Add to supporters list
    setSupporters((prev) => [...prev, user]);
    // Remove from potential supporters
    setPotentialSupporters((prev) => prev.filter((u) => u.id !== user.id));
  };

  const handleRemoveSupporter = (user: User) => {
    // Remove from supporters list
    setSupporters((prev) => prev.filter((u) => u.id !== user.id));
    // Add back to potential supporters
    setPotentialSupporters((prev) => [...prev, user]);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // If we're on mobile, close the sidebar when a section is selected
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  };

  const SettingsView = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [showAddSupporters, setShowAddSupporters] = useState(false);

    const filteredSupporters = supporters.filter((supporter) =>
      supporter.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className="p-4 max-w-md mx-auto">
        <h2 className="text-xl font-semibold mb-4">App Settings</h2>

        <div className="space-y-6">
          <div className="p-4 bg-white rounded-lg shadow-sm border border-theme-purple/20">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium">My Supporters</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAddSupporters(!showAddSupporters)}
                className="text-xs"
              >
                {showAddSupporters ? "Hide Add Supporters" : "Add Supporters"}
              </Button>
            </div>
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="text"
                placeholder="Search supporters..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 focus-visible:ring-theme-purple"
              />
            </div>
            <div className="space-y-2">
              {filteredSupporters.map((supporter) => (
                <div
                  key={supporter.id}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-theme-purple/5 transition-colors"
                >
                  <Avatar>
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-theme-purple/20 text-theme-purple-dark">
                      {supporter.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{supporter.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {supporter.pronouns}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSupporter(supporter)}
                    className="text-theme-purple hover:text-theme-purple-dark hover:bg-theme-purple/10"
                  >
                    Remove
                  </Button>
                </div>
              ))}
              {filteredSupporters.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No supporters found
                </p>
              )}
            </div>

            {showAddSupporters && (
              <div className="mt-4 pt-4 border-t border-theme-purple/20">
                <h4 className="text-sm font-medium mb-3">Add New Supporters</h4>
                <div className="space-y-2">
                  {potentialSupporters.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 rounded-lg hover:bg-theme-purple/5 transition-colors"
                    >
                      <Avatar>
                        <AvatarImage src="" />
                        <AvatarFallback className="bg-theme-purple/20 text-theme-purple-dark">
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {user.pronouns}
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleAddSupporter(user)}
                        className="text-theme-purple hover:bg-theme-purple/10"
                      >
                        Add
                      </Button>
                    </div>
                  ))}
                  {potentialSupporters.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-2">
                      No more users available to add
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="p-4 bg-white rounded-lg shadow-sm border border-theme-purple/20">
            <h3 className="text-lg font-medium mb-2">Interface Settings</h3>
            <p className="text-sm text-muted-foreground">
              Settings for UI preferences coming soon...
            </p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-white to-theme-purple-light/30">
      {/* Sidebar overlay - only visible on mobile when sidebar is open */}
      {sidebarOpen && window.innerWidth < 768 && (
        <div
          className="fixed inset-0 bg-black/20 z-30 md:hidden"
          onClick={toggleSidebar}
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
        <div className="md:hidden sticky top-0 z-30 p-4 border-b border-theme-purple/20 bg-white/60 backdrop-blur-sm">
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
          {activeSection === "supporting" && <FriendsView />}
          {activeSection === "settings" && <SettingsView />}
        </div>
      </main>
    </div>
  );
};

export default Index;
