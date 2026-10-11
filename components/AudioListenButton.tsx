"use client";

import React, { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  VolumeHighIcon,
  StopIcon,
  PlayIcon,
  PauseIcon,
  Loading03Icon
} from "@hugeicons/core-free-icons";

interface AudioListenButtonProps {
  textToSpeak: string;
  lang?: "en" | "hi";
  label?: string;
  className?: string;
}

export default function AudioListenButton({
  textToSpeak,
  lang = "en",
  label,
  className = ""
}: AudioListenButtonProps) {
  const [status, setStatus] = useState<"idle" | "loading" | "playing" | "paused">("idle");
  const [source, setSource] = useState<"polly" | "browser" | null>(null);
  const [playbackRate, setPlaybackRate] = useState<number>(1.0);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      utteranceRef.current = null;
    }
    setStatus("idle");
    setSource(null);
    setCurrentTime(0);
    setDuration(0);
  };

  const togglePause = () => {
    if (status === "playing") {
      if (source === "polly" && audioRef.current) {
        audioRef.current.pause();
        setStatus("paused");
      } else if (source === "browser" && typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.pause();
        setStatus("paused");
      }
    } else if (status === "paused") {
      if (source === "polly" && audioRef.current) {
        audioRef.current.play();
        setStatus("playing");
      } else if (source === "browser" && typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.resume();
        setStatus("playing");
      }
    }
  };

  const handleSpeedToggle = (newRate: number) => {
    setPlaybackRate(newRate);
    if (audioRef.current) {
      audioRef.current.playbackRate = newRate;
    }
  };

  // Clean up audio on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const handleListen = async () => {
    if (status === "playing" || status === "paused") {
      stopPlayback();
      return;
    }

    if (!textToSpeak.trim()) return;

    setStatus("loading");

    try {
      // 1. Try server-side Amazon Polly first
      const response = await fetch("/api/speak", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: textToSpeak.slice(0, 1500),
          lang
        })
      });

      if (response.ok) {
        const blob = await response.blob();
        const audioUrl = URL.createObjectURL(blob);
        const audio = new Audio(audioUrl);
        audio.playbackRate = playbackRate;
        audioRef.current = audio;

        audio.onloadedmetadata = () => {
          setDuration(audio.duration || 0);
        };

        audio.ontimeupdate = () => {
          setCurrentTime(audio.currentTime || 0);
        };

        audio.onended = () => {
          setStatus("idle");
          setSource(null);
          setCurrentTime(0);
          setDuration(0);
          URL.revokeObjectURL(audioUrl);
        };

        audio.onerror = () => {
          fallbackToBrowserSpeech();
        };

        await audio.play();
        setStatus("playing");
        setSource("polly");
        return;
      }
    } catch {
      // Polly route unavailable -> use browser fallback
    }

    // 2. Fallback to browser Web Speech API (Rule 9)
    fallbackToBrowserSpeech();
  };

  const fallbackToBrowserSpeech = () => {
    if (typeof window === "undefined" || !window.speechSynthesis) {
      alert("Audio speech is not supported in this browser.");
      setStatus("idle");
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === "hi" ? "hi-IN" : "en-IN";
    utterance.rate = playbackRate * 0.95;
    utteranceRef.current = utterance;

    // Pick best matching voice if available
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => (lang === "hi" ? v.lang.startsWith("hi") : v.lang.includes("IN")));
    if (voice) {
      utterance.voice = voice;
    }

    utterance.onstart = () => {
      setStatus("playing");
      setSource("browser");
    };

    utterance.onend = () => {
      setStatus("idle");
      setSource(null);
    };

    utterance.onerror = () => {
      setStatus("idle");
      setSource(null);
    };

    window.speechSynthesis.speak(utterance);
  };

  const formatSeconds = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const defaultLabel =
    lang === "hi"
      ? status === "playing"
        ? "आवाज रोकें"
        : status === "loading"
        ? "तैयार हो रहा है..."
        : "योजना सुनें (काजल AI)"
      : status === "playing"
      ? "Stop Audio"
      : status === "loading"
      ? "Preparing audio..."
      : "Listen to Plan (Kajal AI)";

  const isAudioActive = status === "playing" || status === "paused";

  return (
    <div className="inline-flex items-center flex-wrap gap-2">
      {/* Main Listen / Stop Button */}
      <button
        type="button"
        onClick={handleListen}
        disabled={status === "loading"}
        aria-label={isAudioActive ? "Stop audio playback" : "Listen to audio plan"}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
          isAudioActive
            ? "bg-[#D92D20] text-white hover:bg-[#B91C1C]"
            : "bg-[#FFFAF4] text-[#1E2A44] border border-[#1E2A44]/20 hover:bg-[#FBEBD9] hover:border-[#F47A1F]"
        } ${className}`}
      >
        {status === "loading" ? (
          <HugeiconsIcon icon={Loading03Icon} size={15} className="animate-spin text-[#F47A1F]" />
        ) : isAudioActive ? (
          <HugeiconsIcon icon={StopIcon} size={15} strokeWidth={2.4} />
        ) : (
          <HugeiconsIcon icon={VolumeHighIcon} size={15} strokeWidth={2.4} className="text-[#F47A1F]" />
        )}
        <span>{label || defaultLabel}</span>
      </button>

      {/* When audio is actively playing or paused: show Pause, Progress, Waveform & Speed Toggle */}
      {isAudioActive && (
        <div className="flex items-center gap-2 bg-[#FBEBD9]/80 border border-[#1E2A44]/15 px-2.5 py-1.5 rounded-xl shadow-xs animate-fade-rise-1">
          {/* Pause / Resume Button */}
          <button
            type="button"
            onClick={togglePause}
            title={status === "playing" ? "Pause playback" : "Resume playback"}
            className="p-1 rounded-lg bg-[#FFFAF4] text-[#1E2A44] hover:bg-[#F47A1F] hover:text-[#FFFAF4] transition-colors cursor-pointer"
          >
            {status === "playing" ? (
              <HugeiconsIcon icon={PauseIcon} size={13} strokeWidth={2.4} />
            ) : (
              <HugeiconsIcon icon={PlayIcon} size={13} strokeWidth={2.4} />
            )}
          </button>

          {/* Animated sound wave bars when speaking */}
          {status === "playing" && (
            <div className="flex items-center gap-0.5 h-3 px-1" aria-label="Audio active wave">
              <span className="w-1 h-2 bg-[#F47A1F] rounded-full animate-pulse [animation-duration:600ms]" />
              <span className="w-1 h-3.5 bg-[#F47A1F] rounded-full animate-pulse [animation-duration:400ms]" />
              <span className="w-1 h-2 bg-[#F47A1F] rounded-full animate-pulse [animation-duration:700ms]" />
              <span className="w-1 h-3 bg-[#F47A1F] rounded-full animate-pulse [animation-duration:500ms]" />
            </div>
          )}

          {/* Time Counter for Polly Stream or Source Badge */}
          {source === "polly" && duration > 0 ? (
            <span className="text-[10px] font-bold text-[#1E2A44] font-mono">
              {formatSeconds(currentTime)} / {formatSeconds(duration)}
            </span>
          ) : (
            <span className="text-[10px] font-bold text-[#2E9E5B]">
              {source === "polly" ? "Polly Neural" : "Web Voice"}
            </span>
          )}

          {/* Playback Speed Pill (1x / 1.25x) */}
          <div className="flex items-center bg-[#FFFAF4] rounded-md p-0.5 border border-[#1E2A44]/10 text-[10px] font-bold">
            <button
              type="button"
              onClick={() => handleSpeedToggle(1.0)}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                playbackRate === 1.0 ? "bg-[#F47A1F] text-[#FFFAF4]" : "text-[#5B6577]"
              }`}
            >
              1x
            </button>
            <button
              type="button"
              onClick={() => handleSpeedToggle(1.25)}
              className={`px-1.5 py-0.5 rounded cursor-pointer transition-colors ${
                playbackRate === 1.25 ? "bg-[#F47A1F] text-[#FFFAF4]" : "text-[#5B6577]"
              }`}
            >
              1.25x
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
