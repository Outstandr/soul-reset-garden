import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";

interface VideoPlayerProps {
  videoUrl: string;
  startTime: string;
  endTime: string;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

const timeToSeconds = (time: string): number => {
  const parts = time.split(":");
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
};

export const VideoPlayer = ({ videoUrl, startTime, endTime, onProgress, onComplete }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  const startSeconds = timeToSeconds(startTime);
  const endSeconds = timeToSeconds(endTime);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      video.currentTime = startSeconds;
      setDuration(endSeconds - startSeconds);
    };

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      if (current >= endSeconds) {
        video.pause();
        setIsPlaying(false);
        onComplete?.();
      } else if (current >= startSeconds) {
        const elapsed = current - startSeconds;
        const segmentDuration = endSeconds - startSeconds;
        const progressPercent = (elapsed / segmentDuration) * 100;
        setProgress(progressPercent);
        setCurrentTime(elapsed);
        onProgress?.(progressPercent);
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
    };
  }, [startSeconds, endSeconds, onProgress, onComplete]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      if (video.currentTime >= endSeconds || video.currentTime < startSeconds) {
        video.currentTime = startSeconds;
      }
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    const newTime = startSeconds + (value[0] / 100) * (endSeconds - startSeconds);
    video.currentTime = newTime;
    setProgress(value[0]);
  };

  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      video.requestFullscreen();
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="relative rounded-xl overflow-hidden bg-black shadow-strong">
      <video
        ref={videoRef}
        className="w-full aspect-video"
        src={videoUrl}
        playsInline
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
        <Slider
          value={[progress]}
          onValueChange={handleSeek}
          max={100}
          step={0.1}
          className="mb-4"
        />
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={togglePlay}
              className="text-white hover:bg-white/20"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>
            
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMute}
              className="text-white hover:bg-white/20"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </Button>
            
            <span className="text-white text-sm">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>
          
          <Button
            size="icon"
            variant="ghost"
            onClick={toggleFullscreen}
            className="text-white hover:bg-white/20"
          >
            <Maximize className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};