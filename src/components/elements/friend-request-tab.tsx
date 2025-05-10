// components/FriendRequestsTab.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  useFriendRequests,
  useRelationshipMutations,
} from "@/hooks/use-relationship";
import { Check, X } from "lucide-react";
import { InfiniteScrollTrigger } from "./infinite-roll-trigger";
import { formatDistanceToNow } from "date-fns";
import { useNavigate } from "react-router";

export const FriendRequestsTab = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useFriendRequests();

  const { acceptRequest, rejectRequest } = useRelationshipMutations();

  const rejectFriendRequest = (targetUserId: number) => {
    console.log("Rejecting friend request for user ID:", targetUserId);
    acceptRequest.mutate(targetUserId);
  };
  const acceptFriendRequest = (targetUserId: number) => {
    console.log("Accepting friend request for user ID:", targetUserId);
    rejectRequest.mutate(targetUserId);
  };
  const navigate = useNavigate();

  const navToProfile = (userName: string) => {
    navigate(`/u/profile/${userName}`);
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.pages.map((page) =>
          page.data.dataPag.map((request) => (
            <Card key={`${request.relationshipId}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar
                    className="h-14 w-14"
                    onClick={() => {
                      navToProfile(request.targetUser.userName);
                    }}
                  >
                    <AvatarImage src={request.targetUser.avatar} />
                    <AvatarFallback>
                      {request.targetUser.fullName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <h3
                        className="hover:underline cursor-pointer font-bold"
                        onClick={() => {
                          navToProfile(request.targetUser.userName);
                        }}
                      >
                        {request.targetUser.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {request.mutualFriends} mutual friends
                      </p>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(request.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={() => {
                            rejectFriendRequest(request.targetUser.userId);
                          }}
                          className="w-full bg-blue-500 hover:bg-blue-600"
                        >
                          <Check className="mr-1 h-4 w-4" /> Accept
                        </Button>
                        <Button
                          onClick={() => {
                            acceptFriendRequest(request.targetUser.userId);
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          <X className="mr-1 h-4 w-4" /> Decline
                        </Button>
                      </div>
                    </div>
                  </div>
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
