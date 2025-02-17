"use client";
import { useRef, useState, useEffect, useCallback } from "react";
import Reels from "./Reels";
import { fetchVideos } from "@/service/videoService";

export interface Reel {
  id: string;
  videoUrl: string;
  productName: string;
  productUrl: string;
}

export default function ReelList() {
  const [reels, setReels] = useState<Reel[]>([]);
  const [activeReelIndex, setActiveReelIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastReelRef = useRef<HTMLDivElement | null>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [showScrollMessage, setShowScrollMessage] = useState(true);
  const [isScrolling, setIsScrolling] = useState(false);
  const touchStartY = useRef<number | null>(null);
  const touchEndY = useRef<number | null>(null);

  useEffect(() => {
    async function loadVideos() {
      const videos = await fetchVideos();
      setReels(videos);
    }
    loadVideos();
  }, []);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setReels((prevReels) => [
            ...prevReels,
            ...prevReels.map((reel, index) => ({
              ...reel,
              id: `${reel.id}-${prevReels.length + index}`,
            })),
          ]);
        }
      },
      { threshold: 0.5 }
    );
    if (lastReelRef.current) observerRef.current.observe(lastReelRef.current);
    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [reels]);

  const scrollToReel = (index: number) => {
    if (isScrolling) return;
    setIsScrolling(true);
    const element = document.getElementById(`reel-${index}`);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveReelIndex(index);
      setShowScrollMessage(false);
      setTimeout(() => {
        setIsScrolling(false);
      }, 500);
    }
  };

  // Handle wheel scrolling (for desktop)
  const handleWheel = useCallback(
    (e: WheelEvent) => {
      e.preventDefault();
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        if (isScrolling) return;
        const direction = e.deltaY > 0 ? 1 : -1;
        const newIndex = Math.min(
          Math.max(0, activeReelIndex + direction),
          reels.length - 1
        );
        if (newIndex !== activeReelIndex) scrollToReel(newIndex);
      }, 100);
    },
    [activeReelIndex, reels.length, isScrolling]
  );

  // Handle touch scrolling (for mobile)
  const handleTouchStart = (e: TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: TouchEvent) => {
    if (!touchStartY.current) return;
    touchEndY.current = e.changedTouches[0].clientY;
    const deltaY = touchStartY.current - touchEndY.current;

    if (Math.abs(deltaY) > 50) {
      // Minimum swipe distance to detect a scroll action
      const direction = deltaY > 0 ? 1 : -1;
      const newIndex = Math.min(
        Math.max(0, activeReelIndex + direction),
        reels.length - 1
      );
      if (newIndex !== activeReelIndex) scrollToReel(newIndex);
    }

    // Reset values
    touchStartY.current = null;
    touchEndY.current = null;
  };

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener("wheel", handleWheel, { passive: false });
      container.addEventListener("touchstart", handleTouchStart, {
        passive: true,
      });
      container.addEventListener("touchend", handleTouchEnd, { passive: true });

      return () => {
        container.removeEventListener("wheel", handleWheel);
        container.removeEventListener("touchstart", handleTouchStart);
        container.removeEventListener("touchend", handleTouchEnd);
      };
    }
  }, [handleWheel]);

  return (
    <div
      ref={containerRef}
      className="snap-y snap-mandatory h-screen overflow-y-hidden relative"
    >
      {reels.map((reel, index) => (
        <div
          key={reel.id}
          className="snap-start h-screen w-full relative"
          id={`reel-${index}`}
          ref={index === reels.length - 1 ? lastReelRef : null}
        >
          <Reels
            videoUrl={reel.videoUrl}
            productName={reel.productName}
            productUrl={reel.productUrl}
            isActive={index === activeReelIndex}
            observerRef={observerRef}
          />
        </div>
      ))}

      {showScrollMessage && activeReelIndex === 0 && (
        <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2 text-white animate-bounce flex flex-col items-center">
          <p className="text-lg font-bold text-white drop-shadow-md">
            Scroll Down
          </p>
          <svg
            className="w-8 h-8 text-white drop-shadow-md mt-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      )}
    </div>
  );
}