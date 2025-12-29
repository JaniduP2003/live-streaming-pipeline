"use client";

import { useEffect, useRef } from "react";

interface VideoPlayerProps {
  hlsUrl: string;
}

export default function VideoPlayer({ hlsUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    // Check if HLS.js is supported
    if (typeof window !== "undefined") {
      import("hls.js").then((HLS) => {
        const Hls = HLS.default;

        if (Hls.isSupported() && videoRef.current) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
          });

          hls.loadSource(hlsUrl);
          hls.attachMedia(videoRef.current);

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            videoRef.current?.play();
          });

          hls.on(Hls.Events.ERROR, (event, data) => {
            console.error("HLS.js error:", data);
          });

          return () => {
            hls.destroy();
          };
        } else if (
          videoRef.current.canPlayType("application/vnd.apple.mpegurl")
        ) {
          // For Safari (native HLS support)
          videoRef.current.src = hlsUrl;
          videoRef.current.addEventListener("loadedmetadata", () => {
            videoRef.current?.play();
          });
        }
      });
    }
  }, [hlsUrl]);

  return (
    <div className="relative aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
      <video
        ref={videoRef}
        className="w-full h-full"
        controls
        playsInline
        autoPlay
        muted
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
