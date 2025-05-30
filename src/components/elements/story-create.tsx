import type React from "react"
import { useState, useRef } from "react"
import { X, Camera, ImageIcon, Type, Smile, Download, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface StoryCreateProps {
  onClose: () => void
  onSave: (story: { type: "image" | "video"; url: string; text?: string }) => void
}

export function StoryCreate({ onClose, onSave }: StoryCreateProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const [storyText, setStoryText] = useState("")
  const [textPosition] = useState({ x: 50, y: 50 })
  const [textColor, setTextColor] = useState("#ffffff")
  const [backgroundColor, setBackgroundColor] = useState("#000000")

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }

  const handleSave = () => {
    if (selectedFile) {
      const storyData = {
        type: selectedFile.type.startsWith("video") ? ("video" as const) : ("image" as const),
        url: previewUrl,
        text: storyText,
      }
      onSave(storyData)
    }
  }

  const backgroundColors = [
    "#000000",
    "#ffffff",
    "#ff0000",
    "#00ff00",
    "#0000ff",
    "#ffff00",
    "#ff00ff",
    "#00ffff",
    "#ffa500",
    "#800080",
  ]

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black/50">
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white">
          <X className="h-6 w-6" />
        </Button>
        <h1 className="text-white font-medium">Create Story</h1>
        <Button variant="ghost" size="sm" onClick={handleSave} disabled={!selectedFile} className="text-white">
          <Send className="h-4 w-4 mr-1" />
          Share
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative overflow-hidden">
        {!selectedFile ? (
          /* Upload Area */
          <div className="h-full flex flex-col items-center justify-center p-8">
            <div className="text-center space-y-6">
              <div className="space-y-4">
                <Button size="lg" className="w-full max-w-xs" onClick={() => fileInputRef.current?.click()}>
                  <Camera className="h-5 w-5 mr-2" />
                  Take Photo
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="w-full max-w-xs"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Choose from Gallery
                </Button>
              </div>

              <div className="text-gray-400 text-sm">
                <p>Share a photo or video that disappears after 24 hours</p>
              </div>
            </div>
          </div>
        ) : (
          /* Preview Area */
          <div className="h-full relative flex items-center justify-center" style={{ backgroundColor }}>
            {selectedFile.type.startsWith("video") ? (
              <video src={previewUrl} className="max-w-full max-h-full object-contain" controls autoPlay muted />
            ) : (
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Story preview"
                className="max-w-full max-h-full object-contain"
              />
            )}

            {/* Text Overlay */}
            {storyText && (
              <div
                className="absolute text-2xl font-bold cursor-move select-none"
                style={{
                  left: `${textPosition.x}%`,
                  top: `${textPosition.y}%`,
                  color: textColor,
                  transform: "translate(-50%, -50%)",
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
                }}
              >
                {storyText}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Bottom Tools */}
      {selectedFile && (
        <div className="bg-black/80 p-4 space-y-4">
          {/* Text Input */}
          <div className="flex items-center gap-2">
            <Type className="h-5 w-5 text-white" />
            <Input
              placeholder="Add text to your story..."
              value={storyText}
              onChange={(e) => setStoryText(e.target.value)}
              className="bg-white/20 border-white/30 text-white placeholder:text-white/70"
            />
          </div>

          {/* Color Pickers */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-white text-sm">Text:</span>
              <div className="flex gap-1">
                {["#ffffff", "#000000", "#ff0000", "#00ff00", "#0000ff"].map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-full border-2 border-white/50"
                    style={{ backgroundColor: color }}
                    onClick={() => setTextColor(color)}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-white text-sm">Background:</span>
              <div className="flex gap-1">
                {backgroundColors.slice(0, 5).map((color) => (
                  <button
                    key={color}
                    className="w-6 h-6 rounded-full border-2 border-white/50"
                    style={{ backgroundColor: color }}
                    onClick={() => setBackgroundColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4">
            <Button variant="ghost" size="icon" className="text-white">
              <Smile className="h-6 w-6" />
            </Button>
            <Button variant="ghost" size="icon" className="text-white">
              <Download className="h-6 w-6" />
            </Button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input ref={fileInputRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleFileSelect} />
    </div>
  )
}
