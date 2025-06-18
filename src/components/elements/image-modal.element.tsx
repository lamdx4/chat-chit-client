import { FileServer } from "@/types/file.model";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";

export function ImageModal({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: {
  images: FileServer[];
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
