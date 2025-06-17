import type Message from "@/types/message.model";
import { MessageType } from "@/types/message.model";
import React, { useState } from "react";
import { Download, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";
import { File } from "@/types/file.model";

// Image Modal Component
function ImageModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: {
  images: File[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}) {
  if (!isOpen) return null;

  const currentImage = images[currentIndex];

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
      >
        <X className="h-8 w-8" />
      </button>

      {/* Image counter */}
      <div className="absolute top-4 left-4 text-white text-sm bg-black/50 px-3 py-1 rounded-full z-10">
        {currentIndex + 1} / {images.length}
      </div>

      {/* Previous button */}
      {images.length > 1 && currentIndex > 0 && (
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 rounded-full p-2 z-10"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
      )}

      {/* Next button */}
      {images.length > 1 && currentIndex < images.length - 1 && (
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 rounded-full p-2 z-10"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      )}

      {/* Download button */}
      <button
        onClick={() => window.open(currentImage.url, "_blank")}
        className="absolute bottom-4 right-4 text-white hover:text-gray-300 bg-black/50 hover:bg-black/70 rounded-full p-2 z-10"
      >
        <Download className="h-6 w-6" />
      </button>

      {/* Main image */}
      <div className="max-w-[90vw] max-h-[90vh] flex items-center justify-center">
        <img
          src={currentImage.url || "/placeholder.svg"}
          alt={`Image ${currentImage.fileId}`}
          className="max-w-full max-h-full object-contain"
          onClick={(e) => e.stopPropagation()}
        />
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}

function MessageRight({ message }: { message: Message }) {
  const [imageErrors, setImageErrors] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    images: File[];
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
  const openImageModal = (images: File[], index: number) => {
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
  const renderImage = (file: File, index: number, allImages: File[]) => {
    if (imageErrors[file.fileId]) {
      // Fallback UI when image fails to load
      const fileInfo = getFileInfo(file.mimeType, file.fileId);
      return (
        <div className="bg-[#0084ff] text-white rounded-2xl p-3 flex items-center gap-3 max-w-[300px]">
          <div className="flex-shrink-0 text-2xl">{fileInfo.icon}</div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{fileInfo.name}</p>
            <p className="text-xs text-blue-100">Image failed to load</p>
          </div>
          <button
            onClick={() => window.open(file.url, "_blank")}
            className="flex-shrink-0 hover:bg-white/20 rounded p-1"
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
  const renderImageGrid = (files: File[]) => {
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
      <div className="flex justify-end mb-2">
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
                  onClick={() => openImageModal(message.files, 0)}
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
                  <div className="bg-[#0084ff] text-white rounded-2xl p-2 break-words">
                    <p className="text-[15px] text-normal text-white">
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
                        className="bg-[#0084ff] rounded-2xl p-3 max-w-[300px]"
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-white text-lg">🎵</span>
                          <span className="text-white text-sm font-medium truncate">
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
                        className="bg-[#0084ff] text-white rounded-2xl p-3 flex items-center gap-3 cursor-pointer hover:bg-[#0066cc] transition-colors max-w-[300px]"
                        onClick={() => window.open(file.url, "_blank")}
                      >
                        <div className="flex-shrink-0 text-2xl">
                          {fileInfo.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">
                            {fileInfo.name}.{fileExtension}
                          </p>
                          <p className="text-xs text-blue-100">
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
              <div className="bg-[#0084ff] text-white rounded-2xl p-2 break-words max-w-[80%]">
                <p className="text-[15px] text-normal text-white">
                  {message.content}
                </p>
              </div>
            );
          }
        })(message)}
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

export default React.memo(MessageRight);
