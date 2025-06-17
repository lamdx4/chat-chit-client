// components/InfiniteScrollTrigger.tsx
import { useInView } from "react-intersection-observer";
import { Loader2 } from "lucide-react";

export const InfiniteScrollTrigger = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
}: {
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
}) => {
  const { ref } = useInView({
    threshold: 0.1,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  return (
    <div ref={ref} className="py-4 text-center">
      {isFetchingNextPage && (
        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
      )}
      {!hasNextPage && <p className="text-gray-500">No more data</p>}
    </div>
  );
};
