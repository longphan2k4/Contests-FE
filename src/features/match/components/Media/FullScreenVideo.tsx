import { useEffect, useRef, type FC } from "react";

interface FullScreenVideoProps {
  videoUrl?: string;
  control?: string | null; // "play" | "pause" | "reset"
}

const FullScreenVideo: FC<FullScreenVideoProps> = ({
  videoUrl,
  control = "start",
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (control === "start") {
      video.play().catch(() => {});
    } else if (control === "pause") {
      video.pause();
    } else if (control === "reset") {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  }, [control]);

  if (!videoUrl) return null;

  return (
    <div className="w-screen h-screen bg-black flex items-center justify-center">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-cover"
      />
    </div>
  );
};

export default FullScreenVideo;
