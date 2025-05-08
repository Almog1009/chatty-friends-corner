import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ArrowLeft } from 'lucide-react';
import { userService, type User } from '@/services/userService';

interface FriendsViewProps {
  onReturn?: () => void;
}

const FriendsView = ({ onReturn }: FriendsViewProps) => {
  const [users, setUsers] = useState<User[]>([]);

  // Load all users on component mount
  useEffect(() => {
    const allUsers = userService.getAllUsers();
    setUsers(allUsers);
  }, []);

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-theme-purple-dark">Friends</h2>
          {onReturn && (
            <Button
              variant="outline"
              size="sm"
              onClick={onReturn}
              className="border-theme-purple/20 text-theme-purple hover:bg-theme-purple/10"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to Chat
            </Button>
          )}
        </div>
        <p className="text-sm text-muted-foreground">All friends</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {users.map((user) => (
            <div 
              key={user.id} 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-theme-purple/5 transition-colors"
            >
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback className="bg-theme-purple/20 text-theme-purple-dark">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.summary}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Score: {user.score} • {user.gender}
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="text-xs">
                  Message
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsView;
