"use client"
import { useState, useRef } from "react";
import { Play } from "lucide-react"; // Icon for the play button

const VideoPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handlePlay = () => {
    if (videoRef.current) {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  return (
    <div className="relative w-full h-auto">
      {/* Video Element */}
      <video
        ref={videoRef}
        className="w-full h-auto rounded-xl"
        controls
        preload="none"
        poster="/login.jpg"
        onPlay={() => setIsPlaying(true)}
      >
        <source src="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
      </video>

      {/* Play Button (Visible Only When Video is Not Playing) */}
      {!isPlaying && (
        <button
          onClick={handlePlay}
          className="absolute inset-0 flex items-center justify-center  bg-opacity-50 rounded-xl"
        >
          <div className="bg-white p-4 rounded-full shadow-lg transition-transform duration-300 hover:scale-110">
            <Play className="text-black w-10 h-10" />
          </div>
        </button>
      )}
    </div>
  );
};

export default VideoPlayer;
