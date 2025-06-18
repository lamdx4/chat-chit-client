"use client"

import type React from "react"
import { useCallback, useRef, useState } from "react"

interface UseLoadMoreSafeScrollOptions {
  threshold?: number
  onLoadMore?: () => Promise<void>
  loadMoreCooldown?: number // Prevent rapid load more calls
}

interface UseLoadMoreSafeScrollReturn {
  containerRef: React.RefObject<HTMLDivElement | null>
  isNearBottom: boolean
  showScrollToBottom: boolean
  scrollToBottom: (smooth?: boolean) => void
  handleScroll: () => void
  isLoadingMore: boolean
  shouldPreventAutoScroll: boolean
}

export function useLoadMoreSafeScroll({
  threshold = 100,
  onLoadMore,
  loadMoreCooldown = 1000,
}: UseLoadMoreSafeScrollOptions = {}): UseLoadMoreSafeScrollReturn {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isNearBottom, setIsNearBottom] = useState(true)
  const [showScrollToBottom, setShowScrollToBottom] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [shouldPreventAutoScroll, setShouldPreventAutoScroll] = useState(false)
  const [lastLoadTime, setLastLoadTime] = useState(0)

  // Check if user is near bottom
  const checkIfNearBottom = useCallback(() => {
    if (!containerRef.current) return false

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight
    return distanceFromBottom <= threshold
  }, [threshold])

  // Scroll to bottom function
  const scrollToBottom = useCallback(
    (smooth = true) => {
      if (!containerRef.current || shouldPreventAutoScroll) return

      const scrollOptions: ScrollToOptions = {
        top: containerRef.current.scrollHeight,
        behavior: smooth ? "smooth" : "instant",
      }
      containerRef.current.scrollTo(scrollOptions)
    },
    [shouldPreventAutoScroll],
  )

  // Safe load more with cooldown
  const handleLoadMore = useCallback(async () => {
    if (!onLoadMore || isLoadingMore) return

    const now = Date.now()
    if (now - lastLoadTime < loadMoreCooldown) return

    setIsLoadingMore(true)
    setShouldPreventAutoScroll(true)
    setLastLoadTime(now)

    try {
      await onLoadMore()
    } catch (error) {
      console.error("Failed to load more:", error)
    } finally {
      // Re-enable auto-scroll after delay
      setTimeout(() => {
        setIsLoadingMore(false)
        setShouldPreventAutoScroll(false)
      }, 500)
    }
  }, [onLoadMore, isLoadingMore, lastLoadTime, loadMoreCooldown])

  // Handle scroll events
  const handleScroll = useCallback(() => {
    if (!containerRef.current || isLoadingMore) return

    const nearBottom = checkIfNearBottom()
    setIsNearBottom(nearBottom)
    setShowScrollToBottom(!nearBottom)

    // Trigger load more when scrolled to top
    if (containerRef.current.scrollTop === 0) {
      handleLoadMore()
    }
  }, [checkIfNearBottom, isLoadingMore, handleLoadMore])

  return {
    containerRef,
    isNearBottom,
    showScrollToBottom,
    scrollToBottom,
    handleScroll,
    isLoadingMore,
    shouldPreventAutoScroll,
  }
}
