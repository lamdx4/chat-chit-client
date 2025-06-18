import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import type Message from "@/types/message.model";
import { MessageType } from "@/types/message.model";
import {
  Download,
  MoreVertical,
  Reply,
  SmilePlusIcon,
  ZoomIn,
} from "lucide-react";
import type { FileServer } from "@/types/file.model";
import { ImageModal } from "./image-modal.element";
import EmojiPicker, { EmojiStyle } from "emoji-picker-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { chatService } from "@/services/group-service";
import { useChatContext } from "@/hooks/use-chat";

// Image Modal Component (shared with MessageRight)

function MessageTextLeft({ message }: { message: Message }) {
  const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false);
  const [isOpenTool, setIsOpenTool] = useState(false);
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );
  const { selectedGroupId } = useChatContext();
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    images: FileServer[];
    currentIndex: number;
  }>({
    isOpen: false,
    images: [],
    currentIndex: 0,
  });

  // Helper function to get file icon and name from mimeType
  const getFileInfo = (mimeType: string, fileId: string) => {
    if (mimeType.startsWith("image/")) {
      return { icon: "🖼️", type: "Image", name: `image_${fileId}` };
    } else if (mimeType.startsWith("video/")) {
      return { icon: "🎥", type: "Video", name: `video_${fileId}` };
    } else if (mimeType.startsWith("audio/")) {
      return { icon: "🎵", type: "Audio", name: `audio_${fileId}` };
    } else if (mimeType.includes("pdf")) {
      return { icon: "📄", type: "PDF", name: `document_${fileId}.pdf` };
    } else if (mimeType.includes("word")) {
      return { icon: "📝", type: "Document", name: `document_${fileId}.docx` };
    } else if (mimeType.includes("excel") || mimeType.includes("spreadsheet")) {
      return {
        icon: "📊",
        type: "Spreadsheet",
        name: `spreadsheet_${fileId}.xlsx`,
      };
    } else if (mimeType.includes("text")) {
      return { icon: "📝", type: "Text", name: `text_${fileId}.txt` };
    } else if (mimeType.includes("zip") || mimeType.includes("rar")) {
      return { icon: "🗜️", type: "Archive", name: `archive_${fileId}` };
    } else {
      return { icon: "📎", type: "File", name: `file_${fileId}` };
    }
  };

  // Get file extension from mimeType
  const getFileExtension = (mimeType: string) => {
    const mimeToExt: { [key: string]: string } = {
      "image/jpeg": "jpg",
      "image/jpg": "jpg",
      "image/png": "png",
      "image/gif": "gif",
      "image/webp": "webp",
      "video/mp4": "mp4",
      "video/avi": "avi",
      "video/mov": "mov",
      "audio/mp3": "mp3",
      "audio/wav": "wav",
      "audio/ogg": "ogg",
      "application/pdf": "pdf",
      "text/plain": "txt",
    };
    return mimeToExt[mimeType] || "file";
  };

  // Handle image error
  const handleImageError = (fileId: string) => {
    setImageErrors((prev) => ({ ...prev, [fileId]: true }));
  };

  // Open image modal
  const openImageModal = (images: FileServer[], index: number) => {
    setModalState({
      isOpen: true,
      images,
      currentIndex: index,
    });
  };

  // Close image modal
  const closeImageModal = () => {
    setModalState({
      isOpen: false,
      images: [],
      currentIndex: 0,
    });
  };

  // Navigate to next image
  const nextImage = () => {
    setModalState((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex < prev.images.length - 1 ? prev.currentIndex + 1 : 0,
    }));
  };

  // Navigate to previous image
  const prevImage = () => {
    setModalState((prev) => ({
      ...prev,
      currentIndex:
        prev.currentIndex > 0 ? prev.currentIndex - 1 : prev.images.length - 1,
    }));
  };

  // Render image with proper aspect ratio handling
  const renderImage = (
    file: FileServer,
    index: number,
    allImages: FileServer[]
  ) => {
    if (imageErrors[file.fileId]) {
      // Fallback UI when image fails to load
      const fileInfo = getFileInfo(file.mimeType, file.fileId);
      return (
        <div className="bg-[#F0F0F0] text-gray-800 rounded-2xl p-3 flex items-center gap-3 max-w-[300px]">
          <div className="flex-shrink-0 text-2xl">{fileInfo.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fileInfo.name}</p>
            <p className="text-xs text-gray-500">Image failed to load</p>
          </div>
          <button
            onClick={() => window.open(file.url, "_blank")}
            className="flex-shrink-0 hover:bg-gray-200 rounded p-1"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      );
    }

    return (
      <div className="relative group max-w-[300px]">
        <img
          src={file.url || "/placeholder.svg"}
          alt={`Image ${file.fileId}`}
          className="w-full h-auto rounded-lg object-cover max-h-[400px] min-h-[100px] cursor-pointer"
          style={{ aspectRatio: "auto" }}
          loading="lazy"
          onError={() => handleImageError(file.fileId)}
          onClick={() => openImageModal(allImages, index)}
        />

        {/* Overlay with zoom icon */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer">
          <div className="bg-white/90 rounded-full p-2">
            <ZoomIn className="h-4 w-4 text-gray-700" />
          </div>
        </div>
      </div>
    );
  };

  // Render multiple images in grid
  const renderImageGrid = (files: FileServer[]) => {
    const imageFiles = files.filter((file) =>
      file.mimeType.startsWith("image/")
    );

    if (imageFiles.length === 1) {
      return renderImage(imageFiles[0], 0, imageFiles);
    }

    if (imageFiles.length === 2) {
      return (
        <div className="grid grid-cols-2 gap-1 max-w-[300px]">
          {imageFiles.map((file, index) => (
            <div
              key={file.fileId}
              className="aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={file.url || "/placeholder.svg"}
                alt={`Image ${file.fileId}`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                loading="lazy"
                onError={() => handleImageError(file.fileId)}
                onClick={() => openImageModal(imageFiles, index)}
              />
            </div>
          ))}
        </div>
      );
    }

    if (imageFiles.length === 3) {
      return (
        <div className="max-w-[300px]">
          <div className="mb-1">
            <img
              src={imageFiles[0].url || "/placeholder.svg"}
              alt={`Image ${imageFiles[0].fileId}`}
              className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
              loading="lazy"
              onError={() => handleImageError(imageFiles[0].fileId)}
              onClick={() => openImageModal(imageFiles, 0)}
            />
          </div>
          <div className="grid grid-cols-2 gap-1">
            {imageFiles.slice(1).map((file, index) => (
              <div
                key={file.fileId}
                className="aspect-square overflow-hidden rounded-lg"
              >
                <img
                  src={file.url || "/placeholder.svg"}
                  alt={`Image ${file.fileId}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                  loading="lazy"
                  onError={() => handleImageError(file.fileId)}
                  onClick={() => openImageModal(imageFiles, index + 1)}
                />
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (imageFiles.length >= 4) {
      return (
        <div className="grid grid-cols-2 gap-1 max-w-[300px]">
          {imageFiles.slice(0, 3).map((file, index) => (
            <div
              key={file.fileId}
              className="aspect-square overflow-hidden rounded-lg"
            >
              <img
                src={file.url || "/placeholder.svg"}
                alt={`Image ${file.fileId}`}
                className="w-full h-full object-cover cursor-pointer hover:opacity-90 transition-opacity"
                loading="lazy"
                onError={() => handleImageError(file.fileId)}
                onClick={() => openImageModal(imageFiles, index)}
              />
            </div>
          ))}
          <div className="aspect-square overflow-hidden rounded-lg relative">
            <img
              src={imageFiles[3].url || "/placeholder.svg"}
              alt={`Image ${imageFiles[3].fileId}`}
              className="w-full h-full object-cover cursor-pointer"
              loading="lazy"
              onError={() => handleImageError(imageFiles[3].fileId)}
              onClick={() => openImageModal(imageFiles, 3)}
            />
            {imageFiles.length > 4 && (
              <div
                className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-semibold cursor-pointer"
                onClick={() => openImageModal(imageFiles, 3)}
              >
                +{imageFiles.length - 4}
              </div>
            )}
          </div>
        </div>
      );
    }

    return null;
  };
  return (
    <>
      <div
        className="flex items-start mt-1 mb-1 gap-2 "
        onMouseEnter={() => {
          setIsOpenTool(true);
        }}
        onMouseLeave={() => {
          setIsEmojiPickerOpen(false);
          setIsOpenTool(false);
        }}
      >
        <Tooltip>
          <TooltipTrigger>
            <Avatar className="self-end flex items-center justify-center">
              <AvatarImage
                src={message.ownerMember.user?.avatar || ""}
                className="w-7 h-7"
              />
              <AvatarFallback className="w-7 h-7 self-center">T</AvatarFallback>
            </Avatar>
          </TooltipTrigger>
          <TooltipContent>
            <p>{message.ownerMember.user.fullName}</p>
          </TooltipContent>
        </Tooltip>

        <div className="">
          {((message) => {
            if (message.type === MessageType.Gif) {
              return (
                <div className="max-w-[300px]">
                  <img
                    src={message.content || "/placeholder.svg"}
                    alt="gif"
                    className="w-full h-auto rounded-lg max-h-[300px] object-contain cursor-pointer"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg";
                    }}
                    onClick={() =>
                      openImageModal(
                        [
                          {
                            url: message.content,
                            fileId: "gif",
                            mimeType: "image/gif",
                          },
                        ],
                        0
                      )
                    }
                  />
                </div>
              );
            } else if (message.type === MessageType.File) {
              const imageFiles =
                message.files?.filter((file) =>
                  file.mimeType.startsWith("image/")
                ) || [];
              const nonImageFiles =
                message.files?.filter(
                  (file) => !file.mimeType.startsWith("image/")
                ) || [];

              return (
                <div className="flex flex-col gap-2 max-w-[350px]">
                  {/* Show text content if exists */}
                  {message.content && message.content.trim() && (
                    <div className="rounded-[18px] border-solid pl-3 pr-3 pt-2 pb-2 bg-[#F0F0F0] break-words max-w-[80%]">
                      <p className="text-[15px] text-normal text-[rgb(5, 5, 5)]">
                        {message.content}
                      </p>
                    </div>
                  )}

                  {/* Render images in grid */}
                  {imageFiles.length > 0 && renderImageGrid(imageFiles)}

                  {/* Render non-image files */}
                  {nonImageFiles.map((file) => {
                    const fileInfo = getFileInfo(file.mimeType, file.fileId);
                    const fileExtension = getFileExtension(file.mimeType);

                    if (file.mimeType.startsWith("video/")) {
                      return (
                        <div key={file.fileId} className="max-w-[300px]">
                          <video
                            src={file.url}
                            controls
                            className="w-full h-auto rounded-lg max-h-[300px]"
                            preload="metadata"
                          />
                        </div>
                      );
                    } else if (file.mimeType.startsWith("audio/")) {
                      return (
                        <div
                          key={file.fileId}
                          className="bg-[#F0F0F0] rounded-2xl p-3 max-w-[300px]"
                        >
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-gray-800 text-lg">🎵</span>
                            <span className="text-gray-800 text-sm font-medium truncate">
                              {fileInfo.name}.{fileExtension}
                            </span>
                          </div>
                          <audio src={file.url} controls className="w-full" />
                        </div>
                      );
                    } else {
                      // Unknown file type
                      return (
                        <div
                          key={file.fileId}
                          className="bg-[#F0F0F0] text-gray-800 rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:bg-gray-200 transition-colors max-w-[300px]"
                          onClick={() => window.open(file.url, "_blank")}
                        >
                          <div className="flex-shrink-0 text-2xl">
                            {fileInfo.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {fileInfo.name}.{fileExtension}
                            </p>
                            <p className="text-xs text-gray-500">
                              {fileInfo.type} • {file.mimeType}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <Download className="h-4 w-4" />
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              );
            } else {
              return (
                <div className="rounded-[18px] border-solid pl-3 pr-3 pt-2 pb-2 items-center  bg-[#F0F0F0] break-words">
                  <p className="text-[15px] text-normal text-[rgb(5, 5, 5)]">
                    {message.content}
                  </p>
                </div>
              );
            }
          })(message)}
        </div>

        <div
          className={cn("flex flex-1 items-center", {
            "opacity-0": !isOpenTool,
            "opacity-100": isOpenTool,
          })}
        >
          {/* Download Button */}
          <div className="relative">
            <Button
              className={`${isEmojiPickerOpen ? "bg-gray-400" : ""}`}
              variant="ghost"
              size="icon"
              onClick={() => setIsEmojiPickerOpen(!isEmojiPickerOpen)}
            >
              <SmilePlusIcon className="h-6 w-6" />
            </Button>
            {/* GIF Picker Button and Popup */}

            {isEmojiPickerOpen && (
              <div className="">
                <EmojiPicker
                  reactionsDefaultOpen={true}
                  emojiStyle={EmojiStyle.FACEBOOK}
                  onEmojiClick={(emojiData) => {
                    // Handle emoji click
                    const emoji = emojiData.emoji;
                    console.log("Emoji selected:", emoji);
                    chatService
                      .reactMessage(selectedGroupId!, message.messageId, emoji)
                      .then((res) => {
                        if (res) {
                          console.log("Emoji reaction added:", res.data);
                        }
                      })
                      .catch((error) => {
                        console.error("Error adding emoji reaction:", error);
                      });
                    setIsEmojiPickerOpen(false);
                  }}
                />
              </div>
            )}
          </div>

          <div className="relative">
            <Button variant="ghost" size="icon" className="rounded-full">
              <Reply className="h-6 w-6" />
            </Button>
          </div>

          <div className="relative">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="h-6 w-6" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                <DropdownMenuItem>Forward</DropdownMenuItem>
                <DropdownMenuItem>Pin</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <ImageModal
        images={modalState.images}
        currentIndex={modalState.currentIndex}
        isOpen={modalState.isOpen}
        onClose={closeImageModal}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </>
  );
}

export default React.memo(MessageTextLeft);
