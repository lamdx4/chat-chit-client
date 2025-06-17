import { useState, useEffect, useRef, useCallback } from "react"
import { useNavigate } from "react-router"
import { X, ChevronLeft, ChevronRight, Heart, Pause, Play, Volume2, VolumeX, MoreVertical, Archive, Trash2, Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { StoryUserWithItems } from "@/types/story"
import { StoryViewInteract } from "./story-view-interact"
import { archiveStory } from "@/services/story.service"
import { toast } from "sonner"
import { reactToStory } from "@/services/story.service"

interface StoryViewerProps {
  stories: StoryUserWithItems[]
  initialUserIndex: number
  initialStoryIndex: number
  onClose: () => void
  onStoryChange?: (userIndex: number, storyIndex: number) => void
}

export function StoryViewer({
  stories,
  initialUserIndex,
  initialStoryIndex,
  onClose,
  onStoryChange,
}: StoryViewerProps) {
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex)
  const [currentStoryIndex, setCurrentStoryIndex] = useState(initialStoryIndex)
  const [progress, setProgress] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [hearts, setHearts] = useState<{ id: number; x: number; y: number }[]>([])
  const [isHeartLiked, setIsHeartLiked] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showInteractModal, setShowInteractModal] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const currentUser = stories[currentUserIndex]
  const currentStory = currentUser?.stories[currentStoryIndex]
  const storyDuration = currentStory?.type === "image" ? 5000 : 10000

  // Auto-advance story
  useEffect(() => {
    if (isPaused || isMenuOpen || showInteractModal) return

    const startTime = Date.now()
    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime
      const newProgress = (elapsed / storyDuration) * 100

      if (newProgress >= 100) {
        nextStory()
      } else {
        setProgress(newProgress)
      }
    }, 50)

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [currentUserIndex, currentStoryIndex, isPaused, isMenuOpen, showInteractModal, storyDuration])

  // Handle video events
  useEffect(() => {
    const video = videoRef.current
    if (video && currentStory?.type === "video") {
      video.muted = isMuted
      if (!isPaused) {
        video.play()
      } else {
        video.pause()
      }
    }
  }, [currentStory, isPaused, isMuted])

  const nextStory = useCallback(() => {
    const nextStoryIndex = currentStoryIndex + 1

    if (nextStoryIndex < currentUser.stories.length) {
      setCurrentStoryIndex(nextStoryIndex)
      setProgress(0)
      onStoryChange?.(currentUserIndex, nextStoryIndex)
    } else {
      // Move to next user
      const nextUserIndex = currentUserIndex + 1
      if (nextUserIndex < stories.length) {
        setCurrentUserIndex(nextUserIndex)
        setCurrentStoryIndex(0)
        setProgress(0)
        onStoryChange?.(nextUserIndex, 0)
      } else {
        onClose()
      }
    }
  }, [currentUserIndex, currentStoryIndex, currentUser, stories, onClose, onStoryChange])

  const previousStory = useCallback(() => {
    const prevStoryIndex = currentStoryIndex - 1

    if (prevStoryIndex >= 0) {
      setCurrentStoryIndex(prevStoryIndex)
      setProgress(0)
      onStoryChange?.(currentUserIndex, prevStoryIndex)
    } else {
      // Move to previous user
      const prevUserIndex = currentUserIndex - 1
      if (prevUserIndex >= 0) {
        const prevUser = stories[prevUserIndex]
        setCurrentUserIndex(prevUserIndex)
        setCurrentStoryIndex(prevUser.stories.length - 1)
        setProgress(0)
        onStoryChange?.(prevUserIndex, prevUser.stories.length - 1)
      }
    }
  }, [currentUserIndex, currentStoryIndex, stories, onStoryChange])

  // Touch handlers for mobile navigation
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return

    const touchEnd = {
      x: e.changedTouches[0].clientX,
      y: e.changedTouches[0].clientY,
    }

    const deltaX = touchEnd.x - touchStartRef.current.x
    const deltaY = Math.abs(touchEnd.y - touchStartRef.current.y)

    // Only handle horizontal swipes
    if (Math.abs(deltaX) > 50 && deltaY < 100) {
      if (deltaX > 0) {
        previousStory()
      } else {
        nextStory()
      }
    }

    touchStartRef.current = null
  }

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const centerX = rect.width / 2

    if (clickX < centerX) {
      previousStory()
    } else {
      nextStory()
    }
  }

  const handleHeartClick = async (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent story navigation
    
    // Only react if story hasn't been reacted to
    if (!currentStory.isReacted) {
      const success = await reactToStory(currentStory.storyId)
      if (success) {
        // Update the story's react status locally
        currentStory.isReacted = true
      } else {
        toast.error("Failed to react to story")
        return
      }
    }
    
    // Toggle heart liked state for animation
    setIsHeartLiked(!isHeartLiked)
    
    // Create heart animation
    const newHeart = {
      id: Date.now(),
      x: Math.random() * 200 - 100, // Random x offset
      y: 0
    }
    
    setHearts(prev => [...prev, newHeart])
    
    // Remove heart after animation
    setTimeout(() => {
      setHearts(prev => prev.filter(heart => heart.id !== newHeart.id))
    }, 2000)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const storyTime = new Date(timestamp)
    // Add 7 hours (7 * 60 * 60 * 1000 milliseconds) to the story time
    const adjustedStoryTime = new Date(storyTime.getTime() + (7 * 60 * 60 * 1000))
    
    // Calculate difference between now and the adjusted story time
    const diffInMilliseconds = now.getTime() - adjustedStoryTime.getTime()
    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60))
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60))

    if (diffInHours < 1) {
      if (diffInMinutes < 1) return "now"
      return `${diffInMinutes}m`
    }
    if (diffInHours >= 24) return "24h"
    return `${diffInHours}h`
  }

  const navigate = useNavigate()

  const handleAvatarClick = (e: React.MouseEvent) => {
    e.stopPropagation() // Prevent story navigation
    
    // Don't navigate if it's the user's own story
    if (currentUser.userName === "Your Story") {
      return
    }
    
    navigate(`/u/profile/${currentUser.userName}`)
  }

  // Temporary handlers for three-dot menu
  const handleAddToArchive = async () => {
    try {
      await archiveStory(currentStory.storyId)
      setIsMenuOpen(false)
      toast.success("Story archived successfully")
    } catch (error) {
      console.error("Failed to archive story:", error)
      toast.error("Failed to archive story")
    }
  }

  const handleDeleteStory = () => {
    console.log("Delete story clicked for story:", currentStory.storyId)
    setIsMenuOpen(false)
    // TODO: Implement delete story functionality
  }

  const handleViewInteractions = () => {
    console.log("View interactions clicked for story:", currentStory.storyId)
    setIsMenuOpen(false)
    setShowInteractModal(true)
  }

  if (!currentUser || !currentStory) return null

  return (
    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
      {/* Background overlay */}
      <div className="absolute inset-0 bg-black/90" />

      {/* Story content */}
      <div className="relative w-full h-full max-w-lg mx-auto">
        {/* Progress bars */}
        <div className="absolute top-6 left-6 right-6 z-20 flex gap-2">
          {currentUser.stories.map((_, index) => (
            <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: index < currentStoryIndex ? "100%" : index === currentStoryIndex ? `${progress}%` : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className="absolute top-12 left-6 right-6 z-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Avatar 
              className="h-16 w-16 border-2 border-white cursor-pointer hover:opacity-80 transition-opacity"
              onClick={handleAvatarClick}
            >
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xl">{currentUser.userName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium text-xl">{currentUser.userName}</p>
              <p className="text-white/70 text-lg">{formatTimeAgo(currentStory.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Three-dot menu for "Your Story" */}
            {currentUser.userName === "Your Story" && (
              <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-12 w-12 text-white hover:bg-white/20"
                  >
                    <MoreVertical className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent 
                  className="w-56" 
                  align="end"
                >
                  <DropdownMenuItem onClick={handleAddToArchive}>
                    <Archive className="h-4 w-4 mr-2" />
                    Add to Archive
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDeleteStory} className="text-red-600">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete Story
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleViewInteractions}>
                    <Eye className="h-4 w-4 mr-2" />
                    View Interactions
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {/* Pause/Play button for all stories */}
            <Button
              variant="ghost"
              size="icon"
              className="h-12 w-12 text-white hover:bg-white/20"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-10 w-10" /> : <Pause className="h-10 w-10" />}
            </Button>

            {/* Mute/Unmute button only for videos */}
            {currentStory.type === "video" && (
              <Button
                variant="ghost"
                size="icon"
                className="h-12 w-12 text-white hover:bg-white/20"
                onClick={() => setIsMuted(!isMuted)}
              >
                {isMuted ? <VolumeX className="h-10 w-10" /> : <Volume2 className="h-10 w-10" />}
              </Button>
            )}
            <Button variant="ghost" size="icon" className="h-12 w-12 text-white hover:bg-white/20" onClick={onClose}>
              <X className="h-10 w-10" />
            </Button>
          </div>
        </div>

        {/* Story media */}
        <div
          className="w-full h-full flex items-center justify-center cursor-pointer px-6"
          onClick={handleClick}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {currentStory.type === "image" ? (
            <img
              src={currentStory.content || "/placeholder.svg"}
              alt="Story"
              className="max-w-full max-h-full object-contain rounded-lg"
            />
          ) : (
            <video
              ref={videoRef}
              src={currentStory.content || "/placeholder.mp4"}
              className="max-w-full max-h-full object-contain rounded-lg"
              loop
              playsInline
            />
          )}
        </div>

        {/* Navigation arrows (desktop) */}
        <div className="hidden md:block">
          {currentUserIndex > 0 || currentStoryIndex > 0 ? (
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-6 top-1/2 -translate-y-1/2 h-16 w-16 text-white hover:bg-white/20"
              onClick={previousStory}
            >
              <ChevronLeft className="h-12 w-12" />
            </Button>
          ) : null}

          {currentUserIndex < stories.length - 1 || currentStoryIndex < currentUser.stories.length - 1 ? (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-6 top-1/2 -translate-y-1/2 h-16 w-16 text-white hover:bg-white/20"
              onClick={nextStory}
            >
              <ChevronRight className="h-12 w-12" />
            </Button>
          ) : null}
        </div>

        {/* Bottom actions */}
        <div className="absolute bottom-6 left-6 right-6 z-20">
          {/* Heart animations */}
          {hearts.map(heart => (
            <div
              key={heart.id}
              className="absolute bottom-16 left-1/2 pointer-events-none"
              style={{
                transform: `translateX(${heart.x}px)`,
                animation: 'heartFloat 2s ease-out forwards'
              }}
            >
              <Heart className="h-6 w-6 text-red-500 fill-red-500" />
            </div>
          ))}
          
            {/* Heart button */}
            <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-14 w-14 text-white hover:bg-white/20 transition-transform active:scale-110"
              onClick={handleHeartClick}
            >
              <Heart className={`h-13 w-13 transition-all duration-200 ${
              currentStory.isReacted ? 'text-red-500 fill-red-500 scale-110' : 'text-white'
              }`} />
            </Button>
            </div>
        </div>

      </div>
      
      {/* Story Interactions Modal */}
      <StoryViewInteract
        isOpen={showInteractModal}
        onClose={() => setShowInteractModal(false)}
        storyId={currentStory.storyId}
      />

      <style>{`
        @keyframes heartFloat {
          0% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
          50% {
            opacity: 1;
            transform: translateY(-50px) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translateY(-120px) scale(1.5);
          }
        }
      `}</style>
    </div>
  )
}
