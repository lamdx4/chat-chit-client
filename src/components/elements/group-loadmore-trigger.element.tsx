import { useEffect, useRef, RefObject } from "react";
import { Loader2 } from "lucide-react";

interface LoadMoreTriggerProps {
  onLoadMore: () => Promise<void>;
  isLoading: boolean;
  containerRef: RefObject<HTMLDivElement>;
  threshold?: number; // Distance from bottom to trigger load
}

const GroupLoadMoreTrigger: React.FC<LoadMoreTriggerProps> = ({
  onLoadMore,
  isLoading,
  containerRef,
  threshold = 100,
}) => {
  const triggerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    const trigger = triggerRef.current;

    if (!container || !trigger) return;

    const handleScroll = () => {
      const containerRect = container.getBoundingClientRect();
      const triggerRect = trigger.getBoundingClientRect();

      // Check if trigger is visible in container
      const isVisible = triggerRect.top <= containerRect.bottom + threshold;

      if (isVisible && !isLoading) {
        console.log("🎯 Load more trigger activated");
        onLoadMore();
      }
    };

    // Initial check
    handleScroll();

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [onLoadMore, isLoading, threshold, containerRef]);

  return (
    <div ref={triggerRef} className="flex items-center justify-center py-4">
      {isLoading ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-sm">Loading more groups...</span>
        </div>
      ) : (
        <div className="text-gray-400 text-sm">Scroll to load more</div>
      )}
    </div>
  );
};

export default GroupLoadMoreTrigger;
