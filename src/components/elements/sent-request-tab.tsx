// components/SentRequestsTab.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import {
  useRelationshipMutations,
  useSentRequests,
} from "@/hooks/use-relationship";
import { InfiniteScrollTrigger } from "./infinite-roll-trigger";
import { formatDistanceToNow } from "date-fns";
import { showDialog } from "./dialog.element";
import { useNavigate } from "react-router";

export const SentRequestsTab = () => {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSentRequests();

  const { cancelSentRequest } = useRelationshipMutations();

  const rejectFriendRequest = (targetUserId: number) => {
    console.log("Rejecting friend request for user ID:", targetUserId);
    cancelSentRequest.mutate(targetUserId);
  };
  const navigate = useNavigate();

  const navToProfile = (userName: string) => {
    navigate(`/u/profile/${userName}`);
  };
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.pages.map((page, pageIndex) =>
          page.data.dataPag.map((request) => (
            <Card key={`${request.relationshipId}-${pageIndex}`}>
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
                        className=" hover:underline cursor-pointer font-bold"
                        onClick={() => {
                          navToProfile(request.targetUser.userName);
                        }}
                      >
                        {request.targetUser.fullName}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {request.mutualFriends} mutual friends
                      </p>
                      <p className="text-sm text-gray-500">
                        {formatDistanceToNow(new Date(request.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={() => {
                            showDialog({
                              title: "Cancel Request",
                              description: `Are you sure you want to cancel the request to ${request.targetUser.fullName}?`,
                              actions: [
                                {
                                  label: "Confirm",
                                  onClick: () => {
                                    rejectFriendRequest(
                                      request.targetUser.userId
                                    );
                                  },
                                },
                              ],
                            });
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          <X className="mr-1 h-4 w-4" /> Cancel Request
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
