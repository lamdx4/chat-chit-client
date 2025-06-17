import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";

type InfiniteScrollMessageTriggerProps = {
  fetchNextPage: () => void;
  hasNextPage?: boolean;
  isFetchingNextPage: boolean;
  groupId?: number;
};

export const InfiniteScrollMessageTrigger = ({
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  groupId,
}: InfiniteScrollMessageTriggerProps) => {
  const elementRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const fetchingRef = useRef(false);

  // ✅ Luôn giữ phiên bản fetchNextPage mới nhất
  const fetchNextPageRef = useRef(fetchNextPage);
  useEffect(() => {
    fetchNextPageRef.current = fetchNextPage;
  }, [fetchNextPage]);

  // ✅ Tạo hoặc reset observer mỗi khi groupId hoặc hasNextPage thay đổi
  useEffect(() => {
    // Cleanup observer cũ
    if (observerRef.current) {
      observerRef.current.disconnect();
      observerRef.current = null;
    }

    fetchingRef.current = false;

    // Tạo observer mới
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (
          entry.isIntersecting &&
          hasNextPage &&
          !isFetchingNextPage &&
          !fetchingRef.current
        ) {
          fetchingRef.current = true;
          fetchNextPageRef.current();
        }
      },
      {
        threshold: 0.1,
        rootMargin: "20px",
      }
    );

    // Observe phần tử trigger
    if (elementRef.current) {
      observerRef.current.observe(elementRef.current);
    }

    return () => {
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, [groupId, hasNextPage]); // ❗️groupId thay đổi → reset logic

  // ✅ Reset flag sau khi fetch xong
  useEffect(() => {
    if (!isFetchingNextPage) {
      fetchingRef.current = false;
    }
  }, [isFetchingNextPage]);

  return (
    <div
      ref={elementRef}
      className="py-4 text-center min-h-[60px] flex items-center justify-center"
    >
      {isFetchingNextPage && (
        <Loader2 className="h-6 w-6 animate-spin mx-auto" />
      )}
      {!hasNextPage && !isFetchingNextPage && (
        <p className="text-gray-500">No more messages</p>
      )}
    </div>
  );
};
