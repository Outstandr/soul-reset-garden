import { useEffect, useRef, useState } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SubtitleTrack {
  src: string;
  lang: string;
  label: string;
}

interface VideoPlayerProps {
  videoUrl: string;
  startTime: string;
  endTime: string;
  subtitles?: SubtitleTrack[];
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

export const VideoPlayer = ({ videoUrl, startTime, endTime, subtitles, onProgress, onComplete }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [activeSubtitle, setActiveSubtitle] = useState<string>("off");
  const [isSeeking, setIsSeeking] = useState(false);

  const startSeconds = timeToSeconds(startTime);
  const endSeconds = timeToSeconds(endTime);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      video.currentTime = startSeconds;
      const videoDuration = video.duration;
      // Use the shorter of configured end time or actual video duration
      const effectiveEndTime = Math.min(endSeconds, videoDuration);
      setDuration(effectiveEndTime - startSeconds);
    };

    const handleTimeUpdate = () => {
      // Don't update progress while user is seeking
      if (isSeeking) return;
      
      const current = video.currentTime;
      const videoDuration = video.duration;
      // Use actual video duration if it's shorter than configured end time
      const effectiveEndTime = Math.min(endSeconds, videoDuration);
      
      // Calculate progress percentage
      const elapsed = current - startSeconds;
      const segmentDuration = effectiveEndTime - startSeconds;
      const progressPercent = (elapsed / segmentDuration) * 100;
      
      // Check if we've reached near the end (98% completion or within 2 seconds)
      const isNearEnd = progressPercent >= 98 || current >= effectiveEndTime - 2;
      
      if (isNearEnd && current > startSeconds) {
        video.pause();
        setIsPlaying(false);
        setProgress(100);
        onComplete?.();
      } else if (current >= startSeconds) {
        setProgress(Math.min(progressPercent, 100));
        setCurrentTime(elapsed);
        onProgress?.(Math.min(progressPercent, 100));
      }
    };

    const handleVideoEnded = () => {
      // Handle when video naturally ends
      setIsPlaying(false);
      setProgress(100);
      onComplete?.();
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleVideoEnded);

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleVideoEnded);
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

  const handleSeekStart = () => {
    setIsSeeking(true);
  };

  const handleSeek = (value: number[]) => {
    const video = videoRef.current;
    if (!video) return;
    const videoDuration = video.duration;
    const effectiveEndTime = Math.min(endSeconds, videoDuration);
    const segmentDuration = effectiveEndTime - startSeconds;
    const newTime = startSeconds + (value[0] / 100) * segmentDuration;
    video.currentTime = newTime;
    setProgress(value[0]);
    const elapsed = newTime - startSeconds;
    setCurrentTime(elapsed);
  };

  const handleSeekEnd = (value: number[]) => {
    handleSeek(value);
    setIsSeeking(false);
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

  const handleSubtitleChange = (lang: string) => {
    const video = videoRef.current;
    if (!video) return;

    const tracks = video.textTracks;
    for (let i = 0; i < tracks.length; i++) {
      tracks[i].mode = tracks[i].language === lang ? "showing" : "hidden";
    }
    setActiveSubtitle(lang);
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
        crossOrigin="anonymous"
      >
        {subtitles?.map((subtitle) => (
          <track
            key={subtitle.lang}
            kind="subtitles"
            src={subtitle.src}
            srcLang={subtitle.lang}
            label={subtitle.label}
            default={subtitle.lang === "en"}
          />
        ))}
      </video>
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4">
        <Slider
          value={[progress]}
          onValueChange={handleSeek}
          onValueCommit={handleSeekEnd}
          onPointerDown={handleSeekStart}
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
          
          <div className="flex items-center gap-2">
            {subtitles && subtitles.length > 0 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="text-white hover:bg-white/20"
                  >
                    <Languages className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => handleSubtitleChange("off")}>
                    Off
                  </DropdownMenuItem>
                  {subtitles.map((subtitle) => (
                    <DropdownMenuItem
                      key={subtitle.lang}
                      onClick={() => handleSubtitleChange(subtitle.lang)}
                    >
                      {subtitle.label}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
            
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
    </div>
  );
};