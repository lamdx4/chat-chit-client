"use client"

import React from "react"
import { X, FileText, FileVideo, FileAudio, File } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FilePreviewProps {
  files: File[]
  onRemove: (index: number) => void
}

export function FilePreview({ files, onRemove }: FilePreviewProps) {
  if (!files.length) return null

  return (
    <div className="p-2 border-t border-gray-100 bg-white">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {files.map((file, index) => (
          <FilePreviewItem key={index} file={file} onRemove={() => onRemove(index)} index={index} />
        ))}
      </div>
    </div>
  )
}

interface FilePreviewItemProps {
  file: File
  onRemove: () => void
  index: number
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function FilePreviewItem({ file, onRemove, index }: FilePreviewItemProps) {
  console.log(index)
  const fileType = file.type.split("/")[0]
  const fileExtension = file.name.split(".").pop()?.toLowerCase()

  // Create object URL for preview
  const [previewUrl, setPreviewUrl] = React.useState<string | null>(null)

  React.useEffect(() => {
    // Create object URL for preview
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)

    // Clean up the URL when component unmounts
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [file])

  // Truncate filename to first 15 characters
  const truncatedName = file.name.length > 15 ? file.name.substring(0, 12) + "..." : file.name

  return (
    <div className="relative group flex-shrink-0">
      <div className="w-20 h-20 rounded-md border border-gray-200 overflow-hidden flex items-center justify-center bg-gray-50">
        {fileType === "image" && previewUrl ? (
          <img src={previewUrl || "/placeholder.svg"} alt={file.name} className="w-full h-full object-cover" />
        ) : fileType === "video" && previewUrl ? (
          <div className="relative w-full h-full">
            <video className="w-full h-full object-cover">
              <source src={previewUrl} type={file.type} />
            </video>
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
              <FileVideo className="h-8 w-8 text-white" />
            </div>
          </div>
        ) : fileType === "audio" ? (
          <FileAudio className="h-10 w-10 text-gray-400" />
        ) : fileExtension === "pdf" ? (
          <FileText className="h-10 w-10 text-gray-400" />
        ) : fileExtension === "doc" || fileExtension === "docx" ? (
          <FileText className="h-10 w-10 text-blue-400" />
        ) : fileExtension === "xls" || fileExtension === "xlsx" ? (
          <FileText className="h-10 w-10 text-green-400" />
        ) : (
          <File className="h-10 w-10 text-gray-400" />
        )}
      </div>

      {/* File name displayed below the preview */}
      <div className="mt-1 text-xs text-center truncate w-20">{truncatedName}</div>

      {/* File name tooltip on hover */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs rounded p-1 whitespace-nowrap z-10">
        {file.name}
      </div>

      {/* Remove button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute -top-2 -right-2 h-5 w-5 rounded-full bg-gray-200 hover:bg-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={onRemove}
      >
        <X className="h-3 w-3" />
      </Button>
    </div>
  )
}
