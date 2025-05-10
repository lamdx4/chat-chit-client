import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { useFriends, useRelationshipMutations } from "@/hooks/use-relationship";
import { InfiniteScrollTrigger } from "./infinite-roll-trigger";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { useNavigate } from "react-router";
import { showDialog } from "./dialog.element";

export const FriendsTab = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFriends();
  const { removeFriend, blockUser } = useRelationshipMutations();

  const removeFriendHandler = (targetUserId: number) => {
    removeFriend.mutate(targetUserId);
  };
  const blockUserHandler = (targetUserId: number) => {
    blockUser.mutate(targetUserId);
  };
  const navigate = useNavigate();

  const navToProfile = (userName: string) => {
    navigate(`/u/profile/${userName}`);
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {data?.pages.map((page, pageIndex) =>
          page.data.dataPag.map((friend) => (
            <Card key={`${friend.relationshipId}-${pageIndex}`}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar
                    className="h-14 w-14"
                    onClick={() => {
                      navToProfile(friend.targetUser.userName);
                    }}
                  >
                    <AvatarImage src={friend.targetUser.avatar} />
                    <AvatarFallback>
                      {friend.targetUser.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3
                      className="truncate hover:underline cursor-pointer font-bold"
                      onClick={() => {
                        navToProfile(friend.targetUser.userName);
                      }}
                    >
                      {friend.targetUser.fullName}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {friend.mutualFriends} mutual friends
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Mở menu"
                        tabIndex={0}
                      >
                        <MoreHorizontal className="h-5 w-5" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onSelect={() =>
                          showDialog({
                            title: "Remove Friend",
                            description: `Are you sure you want to remove ${friend.targetUser.fullName} from your friends?`,
                            actions: [
                              {
                                label: "Confirm",
                                onClick: () => {
                                  removeFriendHandler(friend.targetUser.userId);
                                },
                              },
                            ],
                          })
                        }
                      >
                        Remove Friend
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onSelect={() =>
                          showDialog({
                            title: "Block User",
                            description: `Are you sure you want to block ${friend.targetUser.fullName}?`,
                            actions: [
                              {
                                label: "Confirm",
                                onClick: () => {
                                  blockUserHandler(friend.targetUser.userId);
                                },
                              },
                            ],
                          })
                        }
                      >
                        Block User
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <InfiniteScrollTrigger
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
};
