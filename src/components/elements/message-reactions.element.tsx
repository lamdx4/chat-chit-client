import { useEffect, useMemo } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";
import type Message from "@/types/message.model";
import { chatService } from "@/services/group-service";
import { useChatContext } from "@/hooks/use-chat";

interface GroupedReaction {
  emoji: string;
  count: number;
  users: Array<{
    userId: number;
    fullName: string;
    avatar?: string;
    nickName: string;
  }>;
  hasCurrentUser: boolean;
}

interface MessageReactionsProps {
  message: Message;
  currentUserId?: number;
  className?: string;
}

export function MessageReactions({
  message,
  currentUserId,
  className,
}: MessageReactionsProps) {
  const { selectedGroupId } = useChatContext();

  useEffect(() => {
    console.log("MessageTextLeft rendered with message:", message);
  }, [message]);

  useEffect(() => {
    console.log("Grouped reactions useEffect:", message.reactions);
  }, [message.reactions]);

  // Group reactions by emoji
  const groupedReactions = useMemo(() => {
    console.log("Grouped reactions useMemo:", message.reactions);
    const groups: Record<string, GroupedReaction> = {};

    message.reactions?.forEach((reaction) => {
      const emoji = reaction.emojiData;

      if (!groups[emoji]) {
        groups[emoji] = {
          emoji,
          count: 0,
          users: [],
          hasCurrentUser: false,
        };
      }

      groups[emoji].count++;
      groups[emoji].users.push({
        userId: reaction.member.user.userId,
        fullName: reaction.member.user.fullName,
        avatar: reaction.member.user.avatar,
        nickName: reaction.member.nickName,
      });

      if (reaction.member.user.userId === currentUserId) {
        groups[emoji].hasCurrentUser = true;
      }
    });

    return Object.values(groups);
  }, [message.reactions, currentUserId]);

  const handleReactionClick = async (emoji: string) => {
    try {
      await chatService.reactMessage(
        selectedGroupId!,
        message.messageId,
        emoji
      );
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  };

  if (groupedReactions.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-1 mt-1", className)}>
      {groupedReactions.map((group) => (
        <TooltipProvider key={group.emoji}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-6 px-2 py-1 rounded-full text-xs font-medium transition-all duration-200",
                  "bg-gray-100 hover:bg-gray-200 border border-gray-200",
                  "flex items-center gap-1.5 min-w-0",
                  {
                    "bg-blue-100 border-blue-300 text-blue-700 hover:bg-blue-150":
                      group.hasCurrentUser,
                  }
                )}
                onClick={() => handleReactionClick(group.emoji)}
              >
                <span className="text-sm leading-none">{group.emoji}</span>
                <span className="text-xs font-semibold leading-none">
                  {group.count}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="top" className="max-w-xs">
              <div className="space-y-2">
                <div className="font-medium text-sm">
                  {group.emoji} {group.count}{" "}
                  {group.count === 1 ? "reaction" : "reactions"}
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {group.users.slice(0, 10).map((user) => (
                    <div key={user.userId} className="flex items-center gap-2">
                      <Avatar className="w-5 h-5">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="text-xs">
                          {user.fullName[0] || user.nickName[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm truncate">
                        {user.fullName || user.nickName}
                        {user.userId === currentUserId && " (You)"}
                      </span>
                    </div>
                  ))}
                  {group.users.length > 10 && (
                    <div className="text-xs text-gray-500 mt-1">
                      and {group.users.length - 10} more...
                    </div>
                  )}
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ))}
    </div>
  );
}
