
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PlusCircle } from 'lucide-react';

// Sample friends data
const initialFriends = [
  { id: 1, name: "Alex Johnson", avatar: "", status: "online" },
  { id: 2, name: "Sam Taylor", avatar: "", status: "offline" },
  { id: 3, name: "Jordan Lee", avatar: "", status: "online" },
  { id: 4, name: "Casey Morgan", avatar: "", status: "away" }
];

const FriendsView = () => {
  const [friends, setFriends] = useState(initialFriends);
  const [newFriendName, setNewFriendName] = useState('');
  const { toast } = useToast();

  const handleAddFriend = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newFriendName.trim()) return;
    
    const newFriend = {
      id: friends.length + 1,
      name: newFriendName,
      avatar: "",
      status: "offline"
    };
    
    setFriends([...friends, newFriend]);
    setNewFriendName('');
    
    toast({
      title: "Friend added",
      description: `${newFriendName} has been added to your friends list.`,
    });
  };

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-theme-purple-dark mb-2">Friends</h2>
        <p className="text-sm text-muted-foreground">Manage your friends list</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-2">
          {friends.map((friend) => (
            <div 
              key={friend.id} 
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-theme-purple/5 transition-colors"
            >
              <Avatar>
                <AvatarImage src={friend.avatar} />
                <AvatarFallback className="bg-theme-purple/20 text-theme-purple-dark">
                  {friend.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium">{friend.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{friend.status}</p>
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

      <div className="mt-4 pt-4 border-t border-theme-purple/20">
        <form onSubmit={handleAddFriend} className="flex gap-2">
          <Input
            value={newFriendName}
            onChange={(e) => setNewFriendName(e.target.value)}
            placeholder="Add friend by name..."
            className="flex-1 focus-visible:ring-theme-purple"
          />
          <Button 
            type="submit"
            className="bg-theme-purple hover:bg-theme-purple-dark"
          >
            <PlusCircle size={18} className="mr-2" />
            Add
          </Button>
        </form>
      </div>
    </div>
  );
};

export default FriendsView;
