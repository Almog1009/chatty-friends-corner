import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import { userService, type User, type MindTribute, MindTributeType } from "@/services/userService";

interface FriendsViewProps {
  onReturn?: () => void;
}

const getScoreColor = (type: MindTributeType, score: number): string => {
  // Define max scores for each type
  const maxScores: Record<MindTributeType, number> = {
    [MindTributeType.sadness]: 5,
    [MindTributeType.loneliness]: 6,
    [MindTributeType.anxiety]: 5,
    [MindTributeType.fear]: 7,
    [MindTributeType.anger]: 7
  };

  const maxScore = maxScores[type];
  // Convert score to a percentage of the max score
  const percentage = Math.min(score / maxScore, 1);
  // Convert percentage to hue (0 = red, 120 = green)
  const hue = ((1 - percentage) * 120).toString();
  return `hsl(${hue}, 70%, 50%)`;
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
            const latestTribute = user.mindTributes?.[0];
            const avatarColor = latestTribute 
              ? getScoreColor(latestTribute.type, latestTribute.score)
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
                  {latestTribute && (
                    <div className="mt-2 space-y-1">
                      <p className="text-sm font-medium text-theme-purple-dark">
                        {latestTribute.type.charAt(0).toUpperCase() + latestTribute.type.slice(1)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {latestTribute.summary}
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
