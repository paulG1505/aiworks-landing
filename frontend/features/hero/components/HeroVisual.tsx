'use client';

import { useRef, useEffect } from 'react';

export function HeroVisual() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch((error) => {
        console.log('Autoplay prevented:', error);
      });
    }
  }, []);

  return (
    <div className="w-full max-w-5xl mx-auto">
      {/* Simple video container */}
      <div className="relative w-full rounded-2xl overflow-hidden border border-white/20 shadow-2xl bg-black">
        {/* Video element */}
        <video
          ref={videoRef}
          className="w-full h-auto"
          style={{ display: 'block', minHeight: '400px' }}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
        >
          <source src="/videos/landing.mp4" type="video/mp4" />
          Tu navegador no soporta video HTML5.
        </video>

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent pointer-events-none" />

        {/* Glow effect */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 pointer-events-none animate-pulse"
          style={{ animationDuration: '4s' }}
        />
      </div>
    </div>
  );
}
