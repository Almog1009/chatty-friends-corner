import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { userService, type User, type MindTribute, MindTributeType } from "@/services/userService";

interface FriendsViewProps {
  onReturn?: () => void;
}

const getScoreColor = (type: MindTributeType, score: number): string => {
  // Define base colors for each type
  const baseColors: Record<MindTributeType, string> = {
    [MindTributeType.anxiety]: "#FFA500", // Orange
    [MindTributeType.sadness]: "#4169E1", // Blue
    [MindTributeType.loneliness]: "#FFD700", // Yellow
    [MindTributeType.fear]: "#800080", // Purple
    [MindTributeType.anger]: "#FF0000" // Red
  };

  const baseColor = baseColors[type];
  // Convert score to a percentage (assuming max score is 5)
  const percentage = Math.min(score / 5, 1);
  // Adjust opacity based on score (higher score = more opaque)
  const opacity = 0.3 + (percentage * 0.7); // Range from 0.3 to 1.0
  
  // Convert hex to rgba
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

const FriendsView = ({ onReturn }: FriendsViewProps) => {
  const [supporting, setSupporting] = useState<User[]>([]);

  // Load supporting users on component mount
  useEffect(() => {
    // Using user ID "1" (Alex Johnson) as the current user
    const supportingUsers = userService.getSupporting("1");
    setSupporting(supportingUsers);
  }, []);

  return (
    <div className="flex flex-col h-full p-4">
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-theme-purple-dark">
            Supporting
          </h2>
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
        <p className="text-sm text-muted-foreground">People you are supporting</p>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4">
          {supporting.map((user) => {
            // Find the mindTribute with the highest score
            const highestTribute = user.mindTributes?.reduce((highest, current) => 
              (current.score > highest.score) ? current : highest
            , user.mindTributes[0]);
            
            const avatarColor = highestTribute 
              ? getScoreColor(highestTribute.type, highestTribute.score)
              : "#6B7280";

            return (
              <div
                key={user.id}
                className="flex items-start gap-3 p-4 rounded-lg hover:bg-theme-purple/5 transition-colors"
              >
                <Avatar>
                  <AvatarImage src="" />
                  <AvatarFallback 
                    className="text-white"
                    style={{ backgroundColor: avatarColor }}
                  >
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs text-muted-foreground">{user.pronouns}</p>
                    </div>
                    <Button variant="outline" size="sm" className="text-xs">
                      Message
                    </Button>
                  </div>
                  {highestTribute && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-medium text-theme-purple-dark">
                        {highestTribute.type.charAt(0).toUpperCase() + highestTribute.type.slice(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {highestTribute.summary}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default FriendsView;
