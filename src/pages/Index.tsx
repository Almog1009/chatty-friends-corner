
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import AppSidebar from '@/components/AppSidebar';
import ChatView from '@/components/ChatView';
import FriendsView from '@/components/FriendsView';
import { cn } from '@/lib/utils';
import { ArrowLeft, MessageCircle } from 'lucide-react';

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('chat');

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
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-30 md:hidden" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      {/* Sidebar */}
      <AppSidebar 
        isOpen={sidebarOpen} 
        onClose={() => setSidebarOpen(false)}
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />
      
      {/* Main Content */}
      <main className={cn(
        "flex-1 flex flex-col transition-all duration-300",
        sidebarOpen ? "md:ml-64" : ""
      )}>
        {/* Header */}
        <header className="border-b border-theme-purple/20 p-4 bg-white/60 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="mr-2 hover:bg-theme-purple/10"
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
              <h1 className="text-xl font-semibold text-theme-purple">
                {activeSection === 'chat' ? 'Chatty Friends Corner' : 
                 activeSection === 'friends' ? 'Friends List' : 'App Settings'}
              </h1>
            </div>
            {activeSection !== 'chat' && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleSectionChange('chat')}
                className="border-theme-purple/20 text-theme-purple hover:bg-theme-purple/10"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to Chat
              </Button>
            )}
          </div>
        </header>
        
        {/* Content Area */}
        <div className="flex-1 overflow-hidden">
          {activeSection === 'chat' && <ChatView />}
          {activeSection === 'friends' && <FriendsView />}
          {activeSection === 'settings' && (
            <div className="p-4 max-w-md mx-auto">
              <h2 className="text-xl font-semibold mb-4">App Settings</h2>
              
              <div className="space-y-6">
                <div className="p-4 bg-white rounded-lg shadow-sm border border-theme-purple/20">
                  <h3 className="text-lg font-medium mb-3">Chat Settings</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Configure your chat experience with Chatty Friends Corner
                  </p>
                  <Button 
                    onClick={() => handleSectionChange('chat')}
                    className="bg-theme-purple hover:bg-theme-purple-dark flex items-center gap-2"
                  >
                    <MessageCircle size={18} />
                    Go to Chatty Friends Corner
                  </Button>
                </div>
                
                <div className="p-4 bg-white rounded-lg shadow-sm border border-theme-purple/20">
                  <h3 className="text-lg font-medium mb-2">Interface Settings</h3>
                  <p className="text-sm text-muted-foreground">
                    Settings for UI preferences coming soon...
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Index;
