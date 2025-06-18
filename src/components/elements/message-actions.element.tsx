import { useState } from "react"
import { Button } from "../ui/button"
import { MoreVertical, Reply, SmilePlusIcon, Forward, Pin, Copy, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../ui/dropdown-menu"
import EmojiPicker, { EmojiClickData, EmojiStyle } from "emoji-picker-react"
import { cn } from "@/lib/utils"

interface MessageActionsProps {
  isVisible: boolean
  onEmojiSelect: (emoji: string) => void
  onReply: () => void
  onForward: () => void
  onPin: () => void
  onCopy: () => void
  onDelete?: () => void
  showDeleteOption?: boolean
  className?: string
}

export function MessageActions({
  isVisible,
  onEmojiSelect,
  onReply,
  onForward,
  onPin,
  onCopy,
  onDelete,
  showDeleteOption = false,
  className,
}: MessageActionsProps) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false)

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    onEmojiSelect(emojiData.emoji)
    setIsEmojiPickerOpen(false)
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1 transition-opacity duration-200",
        {
          "opacity-0 pointer-events-none": !isVisible,
          "opacity-100": isVisible,
        },
        className,
      )}
    >
      {/* Emoji Reaction Button */}
      <div className="relative">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-8 w-8 rounded-full", {
            "bg-gray-200": isEmojiPickerOpen,
          })}
          onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
        >
          <SmilePlusIcon className="h-4 w-4" />
        </Button>

        {isEmojiPickerOpen && (
          <div className="absolute bottom-full right-0 mb-2 z-50">
            <EmojiPicker
              reactionsDefaultOpen={true}
              emojiStyle={EmojiStyle.FACEBOOK}
              onEmojiClick={handleEmojiClick}
              width={300}
              height={400}
            />
          </div>
        )}
      </div>

      {/* Reply Button */}
      <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full" onClick={onReply}>
        <Reply className="h-4 w-4" />
      </Button>

      {/* More Actions Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 rounded-full">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onForward} className="flex items-center gap-2">
            <Forward className="h-4 w-4" />
            Forward
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onPin} className="flex items-center gap-2">
            <Pin className="h-4 w-4" />
            Pin Message
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onCopy} className="flex items-center gap-2">
            <Copy className="h-4 w-4" />
            Copy Text
          </DropdownMenuItem>
          {showDeleteOption && onDelete && (
            <DropdownMenuItem onClick={onDelete} className="flex items-center gap-2 text-red-600 focus:text-red-600">
              <Trash2 className="h-4 w-4" />
              Delete
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
