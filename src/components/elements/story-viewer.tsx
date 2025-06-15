"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { X, ChevronLeft, ChevronRight, Heart, Pause, Play, Volume2, VolumeX } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {StoryUserWithItems } from "@/types/story"



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
  const [showReactions, setShowReactions] = useState(false)

  const videoRef = useRef<HTMLVideoElement>(null)
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

  const currentUser = stories[currentUserIndex]
  const currentStory = currentUser?.stories[currentStoryIndex]
  const storyDuration = currentStory?.type === "image" ? 5000 : 10000

  // Auto-advance story
  useEffect(() => {
    if (isPaused) return

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
  }, [currentUserIndex, currentStoryIndex, isPaused, storyDuration])

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

  // Call onStoryChange when currentUserIndex or currentStoryIndex changes
  useEffect(() => {
    onStoryChange?.(currentUserIndex, currentStoryIndex)
  }, [currentUserIndex, currentStoryIndex, onStoryChange])

  const nextStory = useCallback(() => {
    const nextStoryIndex = currentStoryIndex + 1

    if (nextStoryIndex < currentUser.stories.length) {
      setCurrentStoryIndex(nextStoryIndex)
      setProgress(0)
    } else {
      // Move to next user
      const nextUserIndex = currentUserIndex + 1
      if (nextUserIndex < stories.length) {
        setCurrentUserIndex(nextUserIndex)
        setCurrentStoryIndex(0)
        setProgress(0)
      } else {
        onClose()
      }
    }
  }, [currentUserIndex, currentStoryIndex, currentUser, stories, onClose])

  const previousStory = useCallback(() => {
    const prevStoryIndex = currentStoryIndex - 1

    if (prevStoryIndex >= 0) {
      setCurrentStoryIndex(prevStoryIndex)
      setProgress(0)
    } else {
      // Move to previous user
      const prevUserIndex = currentUserIndex - 1
      if (prevUserIndex >= 0) {
        const prevUser = stories[prevUserIndex]
        setCurrentUserIndex(prevUserIndex)
        setCurrentStoryIndex(prevUser.stories.length - 1)
        setProgress(0)
      }
    }
  }, [currentUserIndex, currentStoryIndex, stories])

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

  const handleReaction = (reaction: string) => {
    console.log("Reaction sent:", reaction)
    setShowReactions(false)
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const storyTime = new Date(timestamp)
    const diffInHours = Math.floor((now.getTime() - storyTime.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return "now"
    if (diffInHours >= 24) return "24h"
    return `${diffInHours}h`
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
            <Avatar className="h-16 w-16 border-2 border-white">
              <AvatarImage src={currentUser.avatar || "/placeholder.svg"} />
              <AvatarFallback className="text-xl">{currentUser.userName[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white font-medium text-xl">{currentUser.userName}</p>
              <p className="text-white/70 text-lg">{formatTimeAgo(currentStory.createdAt)}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {currentStory.type === "video" && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 text-white hover:bg-white/20"
                  onClick={() => setIsPaused(!isPaused)}
                >
                  {isPaused ? <Play className="h-10 w-10" /> : <Pause className="h-10 w-10" />}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-12 w-12 text-white hover:bg-white/20"
                  onClick={() => setIsMuted(!isMuted)}
                >
                  {isMuted ? <VolumeX className="h-10 w-10" /> : <Volume2 className="h-10 w-10" />}
                </Button>
              </>
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
          {/* Reactions */}
          {showReactions && (
            <div className="mb-6 flex justify-center gap-4 bg-black/50 rounded-full p-4">
              {["❤️", "😂", "😮", "😢", "😡", "👍"].map((emoji) => (
                <button
                  key={emoji}
                  className="text-5xl hover:scale-110 transition-transform"
                  onClick={() => handleReaction(emoji)}
                >
                  {emoji}
                </button>
              ))}
            </div>
          )}

          {/* Heart button only */}
          <div className="flex justify-center">
            <Button
              variant="ghost"
              size="icon"
              className="h-14 w-14 text-white hover:bg-white/20"
              onClick={() => setShowReactions(!showReactions)}
            >
              <Heart className="h-10 w-10" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
