"use client";
import type React from "react";
import { useRef, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Check,
  Heart,
  Pause,
  Play,
  Share2,
  Volume2,
  VolumeX,
} from "lucide-react";

interface ReelProps {
  videoUrl: string;
  productName: string;
  productUrl: string;
  isActive: boolean;
  observerRef: React.RefObject<IntersectionObserver | null>;
}

export default function Reels({
  videoUrl,
  productName,
  productUrl,
  isActive,
  observerRef,
}: ReelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    if (containerRef.current && observerRef.current)
      observerRef.current.observe(containerRef.current);

    return () => {
      if (containerRef.current && observerRef.current) {
        observerRef.current.unobserve(containerRef.current);
      }
    };
  }, [observerRef]);

  useEffect(() => {
    if (videoRef.current) {
      if (isActive) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  }, [isActive]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = isMuted;
  }, [isMuted]);

  const togglePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) videoRef.current.pause();
      else videoRef.current.play();
      setIsPlaying(!isPlaying);
    }
  };

  const handleShare = async () => {
    await navigator.clipboard.writeText(productUrl);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 2000);
  };

  return (
    <div ref={containerRef} className="relative h-full w-full bg-black">
      <video
        ref={videoRef}
        src={videoUrl}
        className="h-full w-full object-cover"
        loop
        playsInline
        muted={isMuted}
        onClick={togglePlayPause}
      />
      <div className="absolute bottom-40 right-4 flex flex-col items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsMuted(!isMuted)}
          className="hover:bg-gray-700/80 bg-gray-900 text-white rounded-full p-4 transition-all duration-300 hover:scale-110"
        >
          {isMuted ? (
            <VolumeX className="h-8 w-8 text-yellow-400" />
          ) : (
            <Volume2 className="h-8 w-8 text-green-400" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={togglePlayPause}
          className="hover:bg-gray-700/80 bg-gray-900 text-white rounded-full p-4 transition-all duration-300 hover:scale-110"
        >
          {isPlaying ? (
            <Pause className="h-8 w-8 text-blue-400" />
          ) : (
            <Play className="h-8 w-8 text-blue-400" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setIsLiked(!isLiked)}
          className={`rounded-full p-4 transition-all duration-300 hover:scale-125 hover:bg-red-500/30 ${
            isLiked ? "animate-bounce-once" : ""
          }`}
        >
          <Heart
            className={`h-8 w-8 ${
              isLiked ? "text-red-500 fill-red-500" : "text-gray-400"
            }`}
          />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={handleShare}
          className="rounded-full p-4 bg-gray-900 text-white hover:bg-gray-700/80 transition-all duration-300 hover:scale-110 hover:rotate-12"
        >
          <Share2 className="h-8 w-8 text-purple-400" />
        </Button>
      </div>
      <div className="absolute bottom-20 left-4 animate-fade-in">
        <Button
          variant="secondary"
          className="bg-white/80 text-black hover:bg-white"
        >
          {productName}
        </Button>
      </div>
      {showPopup && (
        <div className="absolute bottom-16 bg-gray-800 text-white px-4 py-2 rounded-md flex items-center gap-2 animate-fade-in">
          <Check className="h-5 w-5 text-green-500" />
          Link copied successfully!
        </div>
      )}
    </div>
  );
}
