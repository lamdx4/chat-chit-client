import { useState, useEffect } from "react"
import { Heart, Eye } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { getStoryInteractions } from "@/services/story.service"
import { StoryReaction } from "@/types/story"

interface StoryViewInteractProps {
  isOpen: boolean
  onClose: () => void
  storyId: number
}

export function StoryViewInteract({
  isOpen,
  onClose,
  storyId
}: StoryViewInteractProps) {
  const [reactions, setReactions] = useState<StoryReaction[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen && storyId) {
      setLoading(true)
      getStoryInteractions(storyId)
        .then((data) => {
          setReactions(data)
        })
        .catch((error) => {
          console.error("Failed to fetch story interactions:", error)
        })
        .finally(() => {
          setLoading(false)
        })
    }
  }, [isOpen, storyId])

  const totalViews = reactions.length
  const totalReactions = reactions.filter(reaction => reaction.isReacted).length

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md w-full mx-auto bg-white dark:bg-gray-900 rounded-lg animate-in fade-in-0 zoom-in-95 duration-200">
        <DialogHeader className="pb-4 border-b">
          <DialogTitle className="text-lg font-semibold">Story Interactions</DialogTitle>
        </DialogHeader>

        {/* Stats */}
        <div className="flex items-center gap-6 py-3 border-b">
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium">{totalViews} views</span>
          </div>
          <div className="flex items-center gap-2">
            <Heart className="h-4 w-4 text-red-500" />
            <span className="text-sm font-medium">{totalReactions} reactions</span>
          </div>
        </div>

        {/* Interactions List */}
        <ScrollArea className="max-h-96">
          <div className="space-y-3 py-2">
            {loading ? (
              <div className="text-center text-gray-500 py-8">
                <p>Loading...</p>
              </div>
            ) : reactions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <Heart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No interactions yet</p>
              </div>
            ) : (
              reactions.map((reaction) => (
                <div
                  key={reaction.userId}
                  className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={reaction.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{reaction.userName[0]}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">{reaction.userName}</p>
                    </div>
                  </div>
                  
                  {reaction.isReacted && (
                    <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                  )}
                </div>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
