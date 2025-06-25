import { useEffect, useRef, type FC } from "react";
interface FullScreenVideoProps {
  videoUrl?: string;
  isPlaying?: boolean;
  resetTrigger?: number;
}

const FullScreenVideo: FC<FullScreenVideoProps> = ({
  videoUrl,
  isPlaying = true,
  resetTrigger = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Điều khiển Play/Pause
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      if (isPlaying) {
        video.play().catch(() => {});
      } else {
        video.pause();
      }
    }
  }, [isPlaying]);

  // Reset video
  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
      if (isPlaying) {
        video.play().catch(() => {});
      }
    }
  }, [resetTrigger]);

  if (!videoUrl) return null;

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
        muted
        controls={false}
        autoPlay={isPlaying}
      />
    </div>
  );
};

export default FullScreenVideo;
