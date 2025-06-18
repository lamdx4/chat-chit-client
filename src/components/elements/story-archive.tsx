import { ArchivedStoryItem } from "@/types/story";
import { useState, useEffect } from "react";
import { MoreVertical, Eye, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { StoryViewInteract } from "./story-view-interact";

interface StoryArchiveProps {
  stories?: ArchivedStoryItem[];
  isMe?: boolean;
  onStoryClick?: (storyId: number) => Promise<void>;
  onHeartClick?: (storyId: number) => Promise<void>;
  onRemoveFromArchive?: (storyId: number) => Promise<void>;
}

export function StoryArchive({ 
  stories = [], 
  isMe = false, 
  onStoryClick,
  onHeartClick,
  onRemoveFromArchive 
}: StoryArchiveProps) {
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number>(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localStories, setLocalStories] = useState(stories);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showInteractModal, setShowInteractModal] = useState(false);

  // Update local stories when props change
  useEffect(() => {
    setLocalStories(stories);
  }, [stories]);

  const storiesToRender = localStories.length > 0 ? localStories : [];

  // Handle empty state - only show when no real stories are provided
  if (stories.length === 0) {
    return (
      <div className="w-full px-4">
        <div className="flex flex-col items-center justify-center py-12 max-w-2xl mx-auto">
          <div className="text-gray-400 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-600 mb-2">No Archived Stories Yet</h3>
          </div>
        </div>
      </div>
    );
  }

  const openStoryModal = async (index: number) => {
    const story = storiesToRender[index];
    if (story && onStoryClick) {
      await onStoryClick(story.storyId);
    }
    setSelectedStoryIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedStoryIndex(0);
  };

  const nextStory = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex < storiesToRender.length - 1) {
      setSelectedStoryIndex(selectedStoryIndex + 1);
    }
  };

  const prevStory = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
    }
  };

  const currentStory = selectedStoryIndex !== null ? storiesToRender[selectedStoryIndex] : null;

  const handleHeartClick = async (e: React.MouseEvent, storyId: number) => {
    e.stopPropagation();
    
    const currentStory = storiesToRender.find(story => story.storyId === storyId);
    if (!currentStory || currentStory.isReacted || !onHeartClick) return;
    
    await onHeartClick(storyId);
  };

  const handleRemoveFromArchive = async () => {
    const currentStory = storiesToRender[selectedStoryIndex];
    if (!currentStory || !onRemoveFromArchive) return;
    
    setIsMenuOpen(false);
    await onRemoveFromArchive(currentStory.storyId);
    closeModal();
  };

  const handleViewInteractions = () => {
    setIsMenuOpen(false);
    setShowInteractModal(true);
  };

  return (
    <>
      <div className="w-full px-4">
        <div className="grid grid-cols-3 gap-3 max-w-2xl mx-auto">
          {storiesToRender.map((story, index) => (
            <div
              key={story.storyId}
              className="relative aspect-[3/4] cursor-pointer group overflow-hidden rounded-lg"
              onClick={() => openStoryModal(index)}
            >
              <img
                src={story.content}
                alt={`Story ${story.storyId}`}
                className="w-full h-full object-cover"
              />
              
              {/* Hover overlay with stats only */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <div className="text-white">
                  {/* Bottom stats */}
                  <div className="flex items-center gap-4">
                    {/* Heart/Like count */}
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                      </svg>
                      <span className="text-sm font-medium">{Number(story.reactCount)}</span>
                    </div>
                    
                    {/* View count */}
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5 text-white fill-current" viewBox="0 0 24 24">
                        <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/>
                      </svg>
                      <span className="text-sm font-medium">{Number(story.viewCount)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Story Modal */}
      {isModalOpen && currentStory && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50">
          <div className="relative flex items-center justify-center w-full max-w-6xl px-20 story-modal-container">
            {/* Left Navigation */}
            {selectedStoryIndex > 0 && (
              <button
                onClick={prevStory}
                className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:bg-opacity-30 transition-all duration-200 mr-8"
              >
                <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}

            {/* Story Container */}
            <div className="relative max-w-md w-full">
              {/* Header with close button and three-dot menu */}
              <div className="absolute -top-12 left-0 right-0 flex items-center justify-between">
                <div></div> {/* Empty div for spacing */}
                <div className="flex items-center gap-3">
                  {/* Three-dot menu for user's own stories */}
                  {isMe && (
                    <DropdownMenu open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-10 w-10 text-white hover:bg-white/20"
                        >
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="w-56" 
                        align="end"
                      >
                        <DropdownMenuItem onClick={handleViewInteractions}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Interactions
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={handleRemoveFromArchive}>
                          <Archive className="h-4 w-4 mr-2" />
                          Remove from Archive
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}

                  {/* Close button */}
                  <button
                    onClick={closeModal}
                    className="text-white text-2xl hover:text-gray-300 w-10 h-10 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Story content */}
              <div 
                className="relative aspect-[3/4] rounded-lg overflow-hidden"
              >
                <img
                  src={currentStory.content}
                  alt={`Story ${currentStory.storyId}`}
                  className="w-full h-full object-cover object-center"
                  style={{ objectFit: 'contain' }}
                />

                {/* Story text overlay - centered */}
                {currentStory.text && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <p className="text-white text-center text-2xl font-bold break-words max-w-xs mx-4">
                      {currentStory.text}
                    </p>
                  </div>
                )}

                {/* Story overlay with stats */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-4">
                  <div className="text-white">
                    {/* Heart button */}
                    <div className="flex justify-start">
                      <button 
                        className="flex items-center gap-1 hover:scale-110 active:scale-95 transition-all duration-200"
                        onClick={(e) => handleHeartClick(e, currentStory.storyId)}
                      >
                        <svg 
                          className={`w-6 h-6 transition-all duration-200 ${
                            currentStory.isReacted
                              ? 'text-red-500 fill-current scale-110' 
                              : 'text-white fill-current hover:text-red-400'
                          }`} 
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                        </svg>
                        <span className="text-sm font-medium">{Number(currentStory.reactCount)}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Story indicator dots */}
              <div className="flex justify-center mt-4 gap-1">
                {storiesToRender.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full cursor-pointer transition-all duration-200 ${
                      index === selectedStoryIndex ? 'bg-white' : 'bg-white/50 hover:bg-white/70'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStoryIndex(index);
                    }}
                  />
                ))}
              </div>
            </div>

            {/* Right Navigation */}
            {selectedStoryIndex < storiesToRender.length - 1 && (
              <button
                onClick={nextStory}
                className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:bg-opacity-30 transition-all duration-200 ml-8"
              >
                <svg className="w-5 h-5 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>

          {/* Story Interactions Modal */}
          {currentStory && (
            <StoryViewInteract
              isOpen={showInteractModal}
              onClose={() => setShowInteractModal(false)}
              storyId={currentStory.storyId}
            />
          )}
        </div>
      )}
    </>
  );    
};

export default StoryArchive;
