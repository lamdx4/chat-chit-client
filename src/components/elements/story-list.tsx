"use client"

import { useState } from "react"
import { Plus, Play } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { StoryViewer } from "./story-viewer"

interface StoryItem {
  id: string
  type: "image" | "video"
  url: string
  duration: number
  timestamp: string
}

interface StoryUser {
  id: string
  name: string
  avatar: string
  stories: StoryItem[]
  isViewed?: boolean
}

// Mock data - replace with your actual data
const mockStories: StoryUser[] = [
  {
    id: "user1",
    name: "Your Story",
    avatar: "/placeholder.svg",
    stories: [],
  },
  {
    id: "user2",
    name: "John Doe",
    avatar: "/placeholder.svg",
    stories: [
      {
        id: "story1",
        type: "image",
        url: "/placeholder.svg?height=800&width=600",
        duration: 5000,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
      },
      {
        id: "story2",
        type: "video",
        url: "/placeholder.svg?height=800&width=600",
        duration: 10000,
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
      },
    ],
    isViewed: false,
  },
  {
    id: "user3",
    name: "Jane Smith",
    avatar: "/placeholder.svg",
    stories: [
      {
        id: "story3",
        type: "image",
        url: "/placeholder.svg?height=800&width=600",
        duration: 5000,
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
      },
    ],
    isViewed: true,
  },
  {
    id: "user4",
    name: "Mike Johnson",
    avatar: "/placeholder.svg",
    stories: [
      {
        id: "story4",
        type: "video",
        url: "/placeholder.svg?height=800&width=600",
        duration: 8000,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
      },
      {
        id: "story5",
        type: "image",
        url: "/placeholder.svg?height=800&width=600",
        duration: 5000,
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
      },
    ],
    isViewed: false,
  },
]

export function StoryList() {
  const [selectedStory, setSelectedStory] = useState<{
    userIndex: number
    storyIndex: number
  } | null>(null)
  const [stories, setStories] = useState<StoryUser[]>(mockStories)

  const handleStoryClick = (userIndex: number, storyIndex = 0) => {
    // Skip if it's "Your Story" and has no stories
    if (userIndex === 0 && stories[0].stories.length === 0) {
      // Handle create story action
      console.log("Create new story")
      return
    }

    setSelectedStory({ userIndex, storyIndex })

    // Mark as viewed
    setStories((prev) => prev.map((user, index) => (index === userIndex ? { ...user, isViewed: true } : user)))
  }

  const handleStoryClose = () => {
    setSelectedStory(null)
  }

  const handleStoryChange = (userIndex: number, storyIndex: number) => {
    setSelectedStory({ userIndex, storyIndex })
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const storyTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - storyTime.getTime()) / (1000 * 60))

    if (diffInMinutes < 60) return `${diffInMinutes}m`
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h`
    return `${Math.floor(diffInHours / 24)}d`
  }

  return (
    <>
      <div className="w-full">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Stories</h2>
          <Button variant="ghost" size="sm" className="text-blue-500">
            See all
          </Button>
        </div>

        <ScrollArea className="w-full whitespace-nowrap">
          <div className="flex gap-3 pb-2">
            {stories.map((user, userIndex) => (
              <div
                key={user.id}
                className="flex flex-col items-center gap-2 cursor-pointer group"
                onClick={() => handleStoryClick(userIndex)}
              >
                <div className="relative">
                  {/* Story ring */}
                  <div
                    className={`p-0.5 rounded-full ${
                      user.stories.length > 0
                        ? user.isViewed
                          ? "bg-gray-300"
                          : "bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500"
                        : "bg-gray-200"
                    }`}
                  >
                    <div className="p-0.5 bg-white rounded-full">
                      <Avatar className="h-14 w-14">
                        <AvatarImage src={user.avatar || "/placeholder.svg"} />
                        <AvatarFallback>{user.name[0]}</AvatarFallback>
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

                  {/* Story count indicator */}
                  {user.stories.length > 1 && (
                    <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {user.stories.length}
                    </div>
                  )}
                </div>

                {/* User name and time */}
                <div className="text-center">
                  <p className="text-xs font-medium truncate w-16">{userIndex === 0 ? "Your Story" : user.name}</p>
                  {user.stories.length > 0 && userIndex !== 0 && (
                    <p className="text-xs text-gray-500">
                      {formatTimeAgo(user.stories[user.stories.length - 1].timestamp)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      {/* Story Viewer */}
      {selectedStory && (
        <StoryViewer
          stories={stories.filter((user) => user.stories.length > 0)}
          initialUserIndex={selectedStory.userIndex === 0 ? 0 : selectedStory.userIndex - 1}
          initialStoryIndex={selectedStory.storyIndex}
          onClose={handleStoryClose}
          onStoryChange={handleStoryChange}
        />
      )}
    </>
  )
}
