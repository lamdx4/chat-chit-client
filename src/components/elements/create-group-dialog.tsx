import type React from "react";
import { useState } from "react";
import { Search, X, Loader2, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useFriends } from "@/hooks/use-relationship";
import { InfiniteScrollTrigger } from "./infinite-roll-trigger";
import { GetFriendListRes } from "@/services/types/friend-list";

export function CreateGroupChatDialog({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [conversationName, setConversationName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [selectedFriends, setSelectedFriends] = useState<GetFriendListRes[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useFriends(searchTerm);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const toggleFriendSelection = (friend: GetFriendListRes) => {
    if (
      selectedFriends.some(
        (f) => f.targetUser.userId === friend.targetUser.userId
      )
    ) {
      setSelectedFriends(
        selectedFriends.filter(
          (f) => f.targetUser.userId !== friend.targetUser.userId
        )
      );
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  const removeFriend = (friendId: number) => {
    setSelectedFriends(
      selectedFriends.filter((f) => f.targetUserId !== friendId)
    );
  };

  const handleCreateConversation = async () => {
    if (selectedFriends.length < 2) {
      setError("Please select at least 2 friends");
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // ...API call here
      setOpen(false);
      resetForm();
    } catch {
      setError("Failed to create conversation. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setConversationName("");
    setSelectedFriends([]);
    setSearchTerm("");
    // setPage(0);
    // setHasMore(true);
    setError(null);
  };

  const showSelectedPanel = selectedFriends.length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(newOpen) => {
        setOpen(newOpen);
        if (!newOpen) resetForm();
      }}
    >
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Create New Group Chat</DialogTitle>
          <DialogDescription>
            Start a new conversation with your friends. You need to select at
            least 2 friends.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-1 h-[500px] overflow-hidden">
          {/* Left Column - Friend Selection */}
          <div
            className={`${
              showSelectedPanel ? "w-2/3" : "w-full"
            } flex flex-col transition-all duration-300`}
          >
            {/* Conversation Name */}
            <div className="p-4 border-b">
              <Label htmlFor="conversation-name" className="text-sm">
                Group Name
              </Label>
              <Input
                id="conversation-name"
                placeholder="Enter group name"
                value={conversationName}
                onChange={(e) => setConversationName(e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Leave blank to use participants' names
              </p>
            </div>

            {/* Friend Search */}
            <div className="p-4 border-b">
              <div className="flex justify-between items-center">
                <Label htmlFor="friend-search" className="text-sm">
                  Search Friends
                </Label>
                {selectedFriends.length > 0 && (
                  <Badge variant="outline" className="font-normal">
                    {selectedFriends.length} selected
                  </Badge>
                )}
              </div>
              <div className="relative mt-1">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="friend-search"
                  placeholder="Search by name"
                  className="pl-8"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
            </div>

            {/* Friends List - native scroll */}
            <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
              <div className="p-2 space-y-1">
                {data?.pages.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    {searchTerm
                      ? "No friends found matching your search"
                      : "No friends available"}
                  </div>
                ) : (
                  data?.pages.map((listData) =>
                    listData.data.dataPag.map((friend) => (
                      <div
                        key={friend.targetUserId}
                        className={`flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-md cursor-pointer ${
                          selectedFriends.some(
                            (f) => f.targetUserId === friend.targetUserId
                          )
                            ? "bg-blue-50"
                            : ""
                        }`}
                        onClick={() => toggleFriendSelection(friend)}
                      >
                        <Checkbox
                          id={`friend-${friend.targetUserId}`}
                          checked={selectedFriends.some(
                            (f) => f.targetUserId === friend.targetUserId
                          )}
                          onCheckedChange={() => toggleFriendSelection(friend)}
                        />
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={friend.targetUser.avatar} />
                          <AvatarFallback>
                            {friend.targetUser.fullName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="font-medium text-sm">
                            {friend.targetUser.fullName}
                          </div>
                        </div>
                      </div>
                    ))
                  )
                )}

                {/* Loading indicator and intersection observer target */}
                <InfiniteScrollTrigger
                  fetchNextPage={fetchNextPage}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Selected Friends - Only show when friends are selected */}
          {showSelectedPanel && (
            <div className="w-1/3 border-l border-gray-200 flex flex-col transition-all duration-300">
              <div className="p-4 border-b">
                <h3 className="text-sm font-medium flex items-center justify-between">
                  Selected Friends
                  <Badge variant="outline" className="font-normal">
                    {selectedFriends.length}
                  </Badge>
                </h3>
              </div>

              <div className="flex-1 overflow-auto" style={{ minHeight: 0 }}>
                <div className="p-2">
                  {selectedFriends.map((friend) => (
                    <div
                      key={friend.targetUserId}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded-md group"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={friend.targetUser.avatar || "/placeholder.svg"}
                          />
                          <AvatarFallback>
                            {friend.targetUser.fullName[0]}
                          </AvatarFallback>
                        </Avatar>
                        <div className="text-sm font-medium">
                          {friend.targetUser.fullName}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => removeFriend(friend.targetUserId)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Error message and footer */}
        <div className="px-6 py-4 border-t">
          {error && <div className="text-sm text-red-500 mb-4">{error}</div>}

          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {selectedFriends.length < 2 ? (
                <span className="text-amber-600">
                  Select at least {2 - selectedFriends.length} more friend(s)
                </span>
              ) : (
                <span className="text-green-600">✓ Ready to create group</span>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={handleCreateConversation}
                disabled={selectedFriends.length < 2 || isSubmitting}
                className="gap-2"
              >
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                <Users className="h-4 w-4 mr-1" />
                Create Group
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
