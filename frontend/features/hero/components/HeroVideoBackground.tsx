'use client';

import { useRef, useEffect, useState } from 'react';

export function HeroVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoError, setVideoError] = useState(false);

  useEffect(() => {
    if (videoRef.current && !videoError) {
      videoRef.current.play().catch((error) => {
        console.log('Autoplay prevented:', error);
      });
    }
  }, [videoError]);

  return (
    <>
      {/* Video background - fallback to gradient if video fails or doesn't exist */}
      {!videoError ? (
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          onError={() => setVideoError(true)}
        >
          <source src="/videos/landing.mp4" type="video/mp4" />
        </video>
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-slate-900 via-blue-900/30 to-slate-900" />
      )}

      {/* Subtle animated glow */}
      <div
        className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 animate-pulse pointer-events-none"
        style={{ animationDuration: '4s' }}
      />
    </>
  );
}
