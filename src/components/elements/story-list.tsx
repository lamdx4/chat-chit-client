import { useState, useEffect } from "react";
import { Plus, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StoryViewer } from "./story-viewer";
import { StoryCreate } from "@/components/elements/story-create";
import { createStory, getFriendsStoriesList, viewStory } from "@/services/story.service";
import { toast } from "sonner";
import {StoryUserWithItems } from "@/types/story";


export function StoryList() {
  const [openCreate, setOpenCreate] = useState(false);
  const [selectedStory, setSelectedStory] = useState<{
    userIndex: number;
    storyIndex: number;
  } | null>(null);
  const [stories, setStories] = useState<StoryUserWithItems[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch friends stories on component mount
  useEffect(() => {
    const fetchStories = async () => {
      try {
        const friendsStories = await getFriendsStoriesList();

        // Convert API response to component format
        const convertedStories: StoryUserWithItems[] = [
          // Add "Your Story" as first item
          {
            userId: 1,
            userName: "Your Story",
            avatar: "/placeholder.svg",
            stories: [],
            isViewed: false,
          },
          // Add friends' stories
          ...friendsStories.map((friend: StoryUserWithItems) => ({
            userId: friend.userId,
            userName: friend.userName,
            avatar: friend.avatar || "/placeholder.svg",
            stories: friend.stories, // Will be populated when we have detailed story data
            isViewed: friend.isViewed,
          })),
        ];

        setStories(convertedStories);
      } catch (error) {
        console.error("Failed to fetch stories:", error);
        toast.error("Failed to load stories");
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, []);

  // Handle story save event (called by StoryCreate)
  const handleSave = async (story: { type: "image" | "video"; url: string; text?: string; file: File }) => {
    const result = await createStory({ file: story.file, text: story.text });
    if (result) {
      toast.success("Story created successfully!");
      // Refresh story list after creating new story
      const friendsStories = await getFriendsStoriesList();
      const convertedStories: StoryUserWithItems[] = [
        // Add "Your Story" as first item
        {
          userId: 1,
          userName: "Your Story",
          avatar: "/placeholder.svg",
          stories: [],
          isViewed: false,
        },
        // Add friends' stories
        ...friendsStories.map((friend: StoryUserWithItems) => ({
          userId: friend.userId,
          userName: friend.userName,
          avatar: friend.avatar || "/placeholder.svg",
          stories: friend.stories, // Will be populated when we have detailed story data
          isViewed: friend.isViewed,
        })),
      ];
      setStories(convertedStories);
    } else {
      toast.error("Failed to create story.");
    }
    setOpenCreate(false);
  };

  const handleStoryClick = async (userIndex: number, storyIndex = 0) => {
    // Skip if it's "Your Story" and has no stories
    if (userIndex === 0 && stories[0].stories.length === 0) {
      // Handle create story action
      console.log("Create new story");
      return;
    }

    setSelectedStory({ userIndex, storyIndex });
    const currentStory = stories[userIndex]?.stories[storyIndex];
    if (currentStory) {
      try {
        await viewStory(currentStory.storyId);
      } catch (error) {
        console.error("Failed to mark story as viewed:", error);
      }
    }
  };

  const handleStoryClose = () => {
    setSelectedStory(null);
  };

  const handleStoryChange = async (userIndex: number, storyIndex: number) => {
    setSelectedStory({ userIndex, storyIndex });
    
    // Get the filtered stories (only users with stories)
    const storiesWithContent = stories.filter((user) => user.stories.length > 0);
    const currentStory = storiesWithContent[userIndex]?.stories[storyIndex];
    
    if (currentStory) {
      try {
        await viewStory(currentStory.storyId);
        
        // Find the original user index in the full stories array
        const originalUserIndex = stories.findIndex(user => user.userId === storiesWithContent[userIndex].userId);
        
        // Update local state to mark the specific story as viewed
        setStories(prev => 
          prev.map((user, idx) => {
            if (idx === originalUserIndex) {
              // Update the specific story's isViewed status
              const updatedStories = user.stories.map((story, sIdx) => 
                sIdx === storyIndex ? { ...story, isViewed: true } : story
              );
              
              // Check if all stories are now viewed
              const allStoriesViewed = updatedStories.every(story => story.isViewed);
              
              return {
                ...user,
                stories: updatedStories,
                isViewed: allStoriesViewed
              };
            }
            return user;
          })
        );
      } catch (error) {
        console.error("Failed to mark story as viewed:", error);
      }
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const storyTime = new Date(timestamp)
    // Add 7 hours to the story time
    storyTime.setHours(storyTime.getHours() + 7)
    
    const diffInMilliseconds = now.getTime() - storyTime.getTime()
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60))

    if (diffInHours < 1) {
      if (diffInMinutes < 1) return "now"
      return `${diffInMinutes}m`
    }
    if (diffInHours >= 24) return "24h"
    return `${diffInHours}h`
  }

  if (loading) {
    return (
      <div className="w-full h-20 flex items-center justify-center">
        Loading stories...
      </div>
    );
  }

  return (
    <>
      <div className="w-full">
        {/* Desktop Horizontal Layout */}
        <div className="hidden md:block">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-4 pb-4">
              {stories.map((user, userIndex) => (
                <div
                  key={user.userId}
                  className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0"
                  onClick={() =>
                    userIndex === 0 && user.stories.length === 0
                      ? setOpenCreate(true)
                      : handleStoryClick(userIndex)
                  }
                >
                  <div className="relative">
                    {/* Story ring */}
                    <div
                      className={`p-1 rounded-full transition-all duration-200 ${
                        user.stories.length > 0
                          ? user.isViewed
                            ? "bg-gray-300"
                            : "bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400"
                          : userIndex === 0
                          ? "bg-gray-200 group-hover:bg-gray-300"
                          : "bg-gray-200"
                      }`}
                    >
                      <div className="p-1 bg-white rounded-full">
                        <Avatar className="h-16 w-16 lg:h-20 lg:w-20">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-lg">
                            {user.userName[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    {/* Add story button for user's own story */}
                    {userIndex === 0 && user.stories.length === 0 && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 group-hover:bg-blue-600 transition-colors">
                        <Plus className="h-4 w-4 text-white" />
                      </div>
                    )}

                  </div>

                  {/* User name */}
                  <div className="text-center">
                    <p className="text-sm font-medium truncate max-w-[80px]">
                      {userIndex === 0 ? "Your Story" : user.userName}
                    </p>
                    {user.stories.length > 0 && userIndex !== 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatTimeAgo(
                          user.stories[user.stories.length - 1].createdAt
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>

        {/* Mobile Horizontal Layout */}
        <div className="md:hidden">
          <ScrollArea className="w-full whitespace-nowrap">
            <div className="flex gap-3 pb-2">
              {stories.map((user, userIndex) => (
                <div
                  key={user.userId}
                  className="flex flex-col items-center gap-2 cursor-pointer group flex-shrink-0"
                  onClick={() =>
                    userIndex === 0 && user.stories.length === 0
                      ? setOpenCreate(true)
                      : handleStoryClick(userIndex)
                  }
                >
                  <div className="relative">
                    {/* Story ring */}
                    <div
                      className={`p-0.5 rounded-full ${
                        user.stories.length > 0
                          ? user.isViewed
                            ? "bg-gray-300"
                            : "bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400"
                          : userIndex === 0
                          ? "bg-gray-200"
                          : "bg-gray-200"
                      }`}
                    >
                      <div className="p-0.5 bg-white rounded-full">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{user.userName[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    {/* Add story button for user's own story */}
                    {userIndex === 0 && user.stories.length === 0 && (
                      <div className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1">
                        <Plus className="h-3 w-3 text-white" />
                      </div>
                    )}

                    {/* Play icon for video stories */}
                    {user.stories.length > 0 && user.stories[0].type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-black/50 rounded-full p-1">
                          <Play className="h-4 w-4 text-white fill-white" />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* User name and time */}
                  <div className="text-center">
                    <p className="text-xs font-medium truncate w-16">
                      {userIndex === 0 ? "Your Story" : user.userName}
                    </p>
                    {user.stories.length > 0 && userIndex !== 0 && (
                      <p className="text-xs text-gray-500">
                        {formatTimeAgo(
                          user.stories[user.stories.length - 1].createdAt
                        )}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      {/* Story Viewer */}
      {selectedStory && (
        <StoryViewer
          stories={stories.filter((user) => user.stories.length > 0)}
          initialUserIndex={
            selectedStory.userIndex === 0 ? 0 : selectedStory.userIndex - 1
          }
          initialStoryIndex={selectedStory.storyIndex}
          onClose={handleStoryClose}
          onStoryChange={handleStoryChange}
        />
      )}

      {/* StoryCreate modal */}
      {openCreate && (
        <StoryCreate onClose={() => setOpenCreate(false)} onSave={handleSave} />
      )}
    </>
  );
}
