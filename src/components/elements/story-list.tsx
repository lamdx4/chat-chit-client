import { useState, useEffect } from "react";
import { Plus, Play } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { StoryViewer } from "./story-viewer";
import { StoryCreate } from "@/components/elements/story-create";
import { createStory, getFriendsStoriesList, viewStory, getUserStories, deleteStory  } from "@/services/story.service";
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
        const [userStories, friendsStories] = await Promise.all([
          getUserStories(),
          getFriendsStoriesList()
        ]);


        // Convert API response to component format with "Your Story" as first item
        const convertedStories: StoryUserWithItems[] = [
          // Add "Your Story" as first item
          {
            userId: 0,
            userName: "Your Story",
            avatar: "/placeholder.svg",
            stories: userStories?.stories || [],
            isViewed: userStories?.isViewed || false,
          },
          // Add friends' stories
          ...friendsStories.map((friend: StoryUserWithItems) => ({
            userId: friend.userId,
            userName: friend.userName,
            avatar: friend.avatar || "/placeholder.svg",
            stories: friend.stories,
            isViewed: friend.isViewed,
          }))
        ];

        console.log('Converted stories:', convertedStories);
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
  const handleSave = async (story: { type: "image" | "video"; url: string; text?: string; file: File; visibility: number }) => {
    const result = await createStory({ file: story.file, text: story.text, visibility: story.visibility });
    if (result) {
      toast.success("Story created successfully!");
      // Refresh story list after creating new story
      const [userStories, friendsStories] = await Promise.all([
        getUserStories(),
        getFriendsStoriesList()
      ]);
      
      const convertedStories: StoryUserWithItems[] = [
        {
          userId: 0,
          userName: "Your Story",
          avatar: "/placeholder.svg",
          stories: userStories?.stories || [],
          isViewed: false,
        },
        ...friendsStories.map((friend: StoryUserWithItems) => ({
          userId: friend.userId,
          userName: friend.userName,
          avatar: friend.avatar || "/placeholder.svg",
          stories: friend.stories,
          isViewed: friend.isViewed,
        }))
      ];
      setStories(convertedStories);
    } else {
      toast.error("Failed to create story.");
    }
    setOpenCreate(false);
  };

  const handleStoryClick = async (userIndex: number, storyIndex = 0) => {
    // If it's "Your Story" and has no stories, open create modal
    if (userIndex === 0 && stories[0].stories.length === 0) {
      setOpenCreate(true);
      return;
    }

    setSelectedStory({ userIndex, storyIndex });
    
    const currentStory = stories[userIndex]?.stories[storyIndex];
    
    if (currentStory && !currentStory.isViewed) {
      try {
        await viewStory(currentStory.storyId);
        
        // Update local state to mark the specific story as viewed
        setStories(prev => 
          prev.map((user, idx) => {
            if (idx === userIndex) {
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

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering handleStoryClick
    setOpenCreate(true);
  };

  const handleStoryClose = () => {
    setSelectedStory(null);
  };

  const handleStoryChange = async (userIndex: number, storyIndex: number) => {
    setSelectedStory({ userIndex, storyIndex });
    
    const currentStory = stories[userIndex]?.stories[storyIndex];
    
    if (currentStory && !currentStory.isViewed) {
      const success = await viewStory(currentStory.storyId);

      if (success) {
        // Update local state to mark the specific story as viewed
        setStories(prev => 
          prev.map((user, idx) => {
            if (idx === userIndex) {
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
      }
    }
  };

  const handleDeleteStory = async (storyIndex: number) => {
    // Get the story ID from the story at the given index in "Your Story"
    const storyToDelete = stories[0]?.stories[storyIndex];
    if (!storyToDelete) {
      toast.error("Story not found");
      return false;
    }

    const success = await deleteStory(storyToDelete.storyId);
    if (success) {
      toast.success("Story deleted successfully");
      
      // Remove the deleted story from "Your Story" (index 0)
      setStories(prev => 
        prev.map((user, idx) => {
          if (idx === 0) { // Only update "Your Story"
            const updatedStories = user.stories.filter((_, index) => index !== storyIndex);
            return {
              ...user,
              stories: updatedStories
            };
          }
          return user;
        })
      );
      
      return true;
    } else {
      toast.error("Failed to delete story");
      return false;
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
                  onClick={() => handleStoryClick(userIndex)}
                >
                  <div className="relative">
                    {/* Story ring */}
                    <div
                      className={`p-1 rounded-full transition-all duration-200 ${
                        userIndex === 0
                          ? user.stories.length === 0
                            ? "bg-gray-200 group-hover:bg-gray-300"
                            : user.isViewed
                            ? "bg-gray-300"
                            : "bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400"
                          : user.isViewed
                          ? "bg-gray-300"
                          : "bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400"
                      }`}
                    >
                      <div className="p-1 bg-white rounded-full">
                        <Avatar className="h-16 w-16 lg:h-20 lg:w-20">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-lg">
                            {userIndex === 0 ? "Y" : user.userName[0]}
                          </AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    {/* Add story button for "Your Story" - always show */}
                    {userIndex === 0 && (
                      <div 
                        className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1.5 group-hover:bg-blue-600 transition-colors"
                        onClick={handlePlusClick}
                      >
                        <Plus className="h-4 w-4 text-white" />
                      </div>
                    )}

                  </div>

                  {/* User name */}
                  <div className="text-center">
                    <p className="text-sm font-medium truncate max-w-[80px]">
                      {userIndex === 0 ? "Your Story" : user.userName}
                    </p>
                    {user.stories.length > 0 && (
                      <p className="text-xs text-gray-500 mt-0.5">
                        {formatTimeAgo(
                          user.stories[0].createdAt
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
                  onClick={() => handleStoryClick(userIndex)}
                >
                  <div className="relative">
                    {/* Story ring */}
                    <div
                      className={`p-0.5 rounded-full ${
                        userIndex === 0
                          ? user.stories.length === 0
                            ? "bg-gray-200"
                            : user.isViewed
                            ? "bg-gray-300"
                            : "bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400"
                          : user.isViewed
                          ? "bg-gray-300"
                          : "bg-gradient-to-tr from-purple-500 via-pink-500 to-orange-400"
                      }`}
                    >
                      <div className="p-0.5 bg-white rounded-full">
                        <Avatar className="h-14 w-14">
                          <AvatarImage src={user.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{userIndex === 0 ? "Y" : user.userName[0]}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>

                    {/* Add story button for "Your Story" - always show */}
                    {userIndex === 0 && (
                      <div 
                        className="absolute -bottom-1 -right-1 bg-blue-500 rounded-full p-1"
                        onClick={handlePlusClick}
                      >
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
                    {user.stories.length > 0 && (
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
            selectedStory.userIndex === 0 
              ? 0 // If "Your Story" has stories, it will be index 0 in filtered array
              : stories.filter((user, idx) => idx < selectedStory.userIndex && user.stories.length > 0).length
          }
          initialStoryIndex={selectedStory.storyIndex}
          onClose={handleStoryClose}
          onStoryChange={handleStoryChange}
          onStoryDelete={handleDeleteStory}
        />
      )}

      {/* StoryCreate modal */}
      {openCreate && (
        <StoryCreate onClose={() => setOpenCreate(false)} onSave={handleSave} />
      )}
    </>
  );
}
