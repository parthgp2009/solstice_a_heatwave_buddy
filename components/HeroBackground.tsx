"use client";

import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import Image from "next/image";

interface HeroBackgroundProps {
  adjustedFeelsLikeTemp?: number;
}

// Photo analysis coordinates
const SUN_POS = { xPercent: 96.9, yPercent: 45.0 };
const SKYLINE_Y = 47.9; // percent
const MIST_Y = 52.0;    // percent

const subscribeReducedMotion = (callback: () => void) => {
  const query = window.matchMedia("(prefers-reduced-motion: reduce)");
  query.addEventListener("change", callback);
  return () => query.removeEventListener("change", callback);
};
const getReducedMotionSnapshot = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const getReducedMotionServerSnapshot = () => false;

const subscribeSmallScreen = (callback: () => void) => {
  window.addEventListener("resize", callback, { passive: true });
  return () => window.removeEventListener("resize", callback);
};
const getSmallScreenSnapshot = () => window.innerWidth < 768;
const getSmallScreenServerSnapshot = () => false;

export default function HeroBackground({ adjustedFeelsLikeTemp = 40 }: HeroBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const photoLayerRef = useRef<HTMLDivElement>(null);
  const sunGlowRef = useRef<HTMLDivElement>(null);
  const hazeLayerRef = useRef<HTMLDivElement>(null);

  const [photoError, setPhotoError] = useState(false);
  const reducedMotion = useSyncExternalStore(subscribeReducedMotion, getReducedMotionSnapshot, getReducedMotionServerSnapshot);
  const isSmallScreen = useSyncExternalStore(subscribeSmallScreen, getSmallScreenSnapshot, getSmallScreenServerSnapshot);

  // Parallax offsets
  const mousePos = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });
  const scrollYRef = useRef(0);
  const isVisibleRef = useRef(true);

  // Heat shimmer displacement scale (0 at 25C, ~4-6px at 45C+)
  const shimmerScale = Math.max(0, Math.min(6, (adjustedFeelsLikeTemp - 25) * 0.3));

  useEffect(() => {
    // Scroll listener
    const onScroll = () => {
      scrollYRef.current = window.scrollY;
      if (sunGlowRef.current) {
        const glowOpacity = Math.max(0, 1 - window.scrollY * 0.003);
        sunGlowRef.current.style.opacity = `${glowOpacity}`;
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Mouse pointer parallax
    const onMouseMove = (e: MouseEvent) => {
      if (window.innerWidth < 768) return;
      const nx = (e.clientX / window.innerWidth) * 2 - 1; // -1 to 1
      const ny = (e.clientY / window.innerHeight) * 2 - 1;
      mousePos.current.targetX = nx;
      mousePos.current.targetY = ny;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    // Visibility observer to pause RAF
    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    if (containerRef.current) observer.observe(containerRef.current);

    const onVisibilityChange = () => {
      isVisibleRef.current = document.visibilityState === "visible";
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      observer.disconnect();
    };
  }, []);

  // Shared 30fps RequestAnimationFrame loop for canvas specks and parallax
  useEffect(() => {
    if (reducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let lastTime = 0;
    const fpsInterval = 1000 / 30; // 30 fps cap

    // 24 glowing specks (12 on small screens)
    const speckCount = isSmallScreen ? 12 : 24;
    const specks = Array.from({ length: speckCount }, () => ({
      x: Math.random() * (canvas.width || 800),
      y: Math.random() * (canvas.height || 500),
      radius: Math.random() * 2 + 1.2,
      baseSpeedY: Math.random() * 0.4 + 0.25,
      swayOffset: Math.random() * Math.PI * 2,
      opacity: Math.random() * 0.45 + 0.25
    }));

    const resizeCanvas = () => {
      if (!canvas || !containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas, { passive: true });

    const render = (time: number) => {
      animId = requestAnimationFrame(render);

      if (!isVisibleRef.current) return;

      const elapsed = time - lastTime;
      if (elapsed < fpsInterval) return;
      lastTime = time - (elapsed % fpsInterval);

      // Smooth mouse lerp
      mousePos.current.x += (mousePos.current.targetX - mousePos.current.x) * 0.08;
      mousePos.current.y += (mousePos.current.targetY - mousePos.current.y) * 0.08;

      if (!reducedMotion) {
        if (photoLayerRef.current) {
          const px = mousePos.current.x * 12;
          const py = mousePos.current.y * 8 + scrollYRef.current * 0.15;
          photoLayerRef.current.style.transform = `translate3d(${px}px, ${-py}px, 0)`;
        }
        if (hazeLayerRef.current) {
          const hx = mousePos.current.x * 20;
          hazeLayerRef.current.style.transform = `translate3d(${hx}px, 0, 0)`;
        }
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const mouseCanvasX = ((mousePos.current.x + 1) / 2) * canvas.width;
      const mouseCanvasY = ((mousePos.current.y + 1) / 2) * canvas.height;

      // Update & draw glowing rising specks
      for (const sp of specks) {
        sp.y -= sp.baseSpeedY;
        sp.swayOffset += 0.03;
        sp.x += Math.sin(sp.swayOffset) * 0.4;

        // Repel from cursor within 120px
        const dx = sp.x - mouseCanvasX;
        const dy = sp.y - mouseCanvasY;
        const dist = Math.hypot(dx, dy);
        if (dist < 120 && dist > 1) {
          const force = (120 - dist) / 120;
          sp.x += (dx / dist) * force * 3;
          sp.y += (dy / dist) * force * 3;
        }

        // Recycle if above top
        if (sp.y < -10) {
          sp.y = canvas.height + 10;
          sp.x = Math.random() * canvas.width;
        }
        if (sp.x < -10) sp.x = canvas.width + 10;
        if (sp.x > canvas.width + 10) sp.x = -10;

        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(244, 122, 31, ${sp.opacity})`;
        ctx.shadowColor = "rgba(245, 184, 61, 0.6)";
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [reducedMotion, isSmallScreen]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0"
      aria-hidden="true"
    >
      {/* SVG Shimmer Filter Definition */}
      <svg className="absolute w-0 h-0" aria-hidden="true">
        <defs>
          <filter id="skylineHeatShimmer" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.06"
              numOctaves="1"
              result="noise"
              seed="7"
            >
              {!reducedMotion && (
                <animate
                  attributeName="baseFrequency"
                  dur="16s"
                  values="0.02 0.06; 0.025 0.05; 0.02 0.06"
                  repeatCount="indefinite"
                />
              )}
            </feTurbulence>
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={reducedMotion ? 0 : shimmerScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* Layer 1: Hero Photo with gradient mask on left */}
      <div
        ref={photoLayerRef}
        className="absolute inset-0 w-full h-full"
        style={{
          transition: reducedMotion ? "none" : "transform 0.15s ease-out"
        }}
      >
        {!photoError ? (
          <div
            className={`relative w-full h-full ${reducedMotion ? "" : "animate-photo-drift"}`}
            style={{
              maskImage:
                "linear-gradient(to right, transparent 0%, transparent 15%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,1) 85%)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent 0%, transparent 15%, rgba(0,0,0,0.4) 35%, rgba(0,0,0,0.85) 60%, rgba(0,0,0,1) 85%)"
            }}
          >
            <Image
              src="/hero-photo.webp"
              alt="Sunset heatwave skyline over river and bridge"
              fill
              priority
              quality={85}
              className="object-cover object-right-top"
              onError={() => setPhotoError(true)}
            />
          </div>
        ) : (
          /* Fallback flat warm background if photo fails */
          <div className="w-full h-full bg-[#F6D9B8]" />
        )}
      </div>

      {/* Layer 2: Sun Glow positioned over the sun in the photo (mix-blend-mode: screen) */}
      <div
        ref={sunGlowRef}
        className="absolute pointer-events-none"
        style={{
          left: `${SUN_POS.xPercent}%`,
          top: `${SUN_POS.yPercent}%`,
          transform: "translate(-50%, -50%)"
        }}
      >
        <div
          className={`w-[480px] h-[480px] md:w-[720px] md:h-[720px] rounded-full pointer-events-none ${
            reducedMotion ? "" : "animate-sun-glow"
          }`}
          style={{
            background:
              "radial-gradient(circle, rgba(255, 200, 100, 0.75) 0%, rgba(244, 122, 31, 0.45) 30%, rgba(244, 122, 31, 0.15) 55%, transparent 75%)",
            mixBlendMode: "screen"
          }}
        />
      </div>

      {/* Layer 3: Drifting Haze & Wisps (3 translucent layers, cream and peach, 20-35% opacity) */}
      {!reducedMotion && (
        <div
          ref={hazeLayerRef}
          className="absolute inset-0 pointer-events-none overflow-hidden"
          style={{
            transition: "transform 0.2s ease-out"
          }}
        >
          {/* Haze Layer 1: Peach wisp drifting (140s loop) */}
          <div
            className="absolute top-[28%] left-0 w-[200%] h-[160px] opacity-25 animate-haze-1"
            style={{
              background:
                "linear-gradient(90deg, transparent, rgba(253, 239, 227, 0.7) 25%, rgba(246, 205, 176, 0.5) 50%, rgba(253, 239, 227, 0.7) 75%, transparent)"
            }}
          />

          {/* Haze Layer 2: Cream wisp drifting reverse (100s loop) */}
          <div
            className="absolute top-[38%] left-0 w-[200%] h-[180px] opacity-30 animate-haze-2"
            style={{
              background:
                "linear-gradient(90deg, rgba(253, 243, 231, 0.6) 0%, transparent 40%, rgba(253, 243, 231, 0.7) 70%, transparent 100%)"
            }}
          />

          {/* Haze Layer 3: Warm golden layer (160s loop) */}
          {!isSmallScreen && (
            <div
              className="absolute top-[45%] left-0 w-[300%] h-[130px] opacity-20 animate-haze-3"
              style={{
                background:
                  "linear-gradient(90deg, transparent 0%, rgba(245, 184, 61, 0.4) 30%, transparent 60%, rgba(253, 239, 227, 0.6) 80%, transparent 100%)"
              }}
            />
          )}

          {/* Low mist layer near the skyline / river (Y: ~52%) */}
          <div
            className="absolute left-0 w-full h-[120px] pointer-events-none"
            style={{
              top: `${MIST_Y}%`,
              background:
                "linear-gradient(to bottom, transparent, rgba(253, 243, 231, 0.55) 45%, rgba(253, 243, 231, 0.3) 80%, transparent)"
            }}
          />
        </div>
      )}

      {/* Layer 4: Heat Shimmer Band over the skyline (Y: ~44% to 50%) with SVG filter */}
      {!reducedMotion && shimmerScale > 0 && (
        <div
          className="absolute left-0 right-0 pointer-events-none"
          style={{
            top: `${SKYLINE_Y - 4}%`,
            height: "10%",
            filter: "url(#skylineHeatShimmer)",
            backdropFilter: "blur(0.5px)"
          }}
        />
      )}

      {/* Layer 5: Rising warm air glowing specks canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 pointer-events-none w-full h-full"
      />

      {/* Layer 6: Smooth curved cream swoosh at the bottom of the hero over the photo */}
      <div className="absolute bottom-0 left-0 right-0 w-full pointer-events-none z-10 leading-none">
        <svg
          viewBox="0 0 1440 84"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
          className="w-full h-12 sm:h-16 md:h-20 block text-[#FDF3E7]"
        >
          <path
            d="M0,0 C320,68 760,84 1440,32 L1440,84 L0,84 Z"
            fill="currentColor"
          />
        </svg>
      </div>
    </div>
  );
}
