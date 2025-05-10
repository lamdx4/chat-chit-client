import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { X } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { InfiniteScrollTrigger } from "./infinite-roll-trigger";
import {
  useBlockList,
  useRelationshipMutations,
} from "@/hooks/use-relationship";
import { formatDistanceToNow } from "date-fns";

export default function BlockList() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useBlockList();

  const { unblockUser } = useRelationshipMutations();
  const unblockUserHandler = (targetUserId: number) => {
    unblockUser.mutate(targetUserId);
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-xl shadow-md ">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Block List</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data?.pages.map((page) =>
          page.data.dataPag.map((request) => (
            <Card key={`${request.relationshipId}`}>
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={request.targetUser.avatar ?? undefined} />
                    <AvatarFallback>
                      {request.targetUser.fullName?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex flex-col">
                      <h3 className="font-medium">
                        {request.targetUser.fullName}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {formatDistanceToNow(new Date(request.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <Button
                          onClick={() => {
                            unblockUserHandler(request.targetUser.userId);
                          }}
                          variant="outline"
                          className="w-full"
                        >
                          <X className="mr-1 h-4 w-4" /> Cancel
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
    </div>
  );
}
