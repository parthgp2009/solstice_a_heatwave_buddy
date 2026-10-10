"use client";

import React, { useState, useRef, useEffect } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { VolumeHighIcon, StopIcon, Loading03Icon } from "@hugeicons/core-free-icons";

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
  const [status, setStatus] = useState<"idle" | "loading" | "playing">("idle");
  const [source, setSource] = useState<"polly" | "browser" | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Clean up audio / speech on unmount
  useEffect(() => {
    return () => {
      stopPlayback();
    };
  }, []);

  const stopPlayback = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setStatus("idle");
    setSource(null);
  };

  const handleListen = async () => {
    if (status === "playing") {
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
        audioRef.current = audio;

        audio.onended = () => {
          setStatus("idle");
          setSource(null);
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
    } catch (err) {
      console.warn("Polly audio request failed, using browser speech fallback:", err);
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
    utterance.rate = 0.95;

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

  const defaultLabel =
    lang === "hi"
      ? status === "playing"
        ? "आवाज रोकें"
        : status === "loading"
        ? "ऑडियो तैयार हो रहा है..."
        : "योजना सुनें (काजल AI)"
      : status === "playing"
      ? "Stop Audio"
      : status === "loading"
      ? "Preparing audio..."
      : "Listen to Plan (Kajal AI)";

  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={handleListen}
        disabled={status === "loading"}
        aria-label={status === "playing" ? "Stop audio playback" : "Listen to audio plan"}
        className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer shadow-xs ${
          status === "playing"
            ? "bg-[#D92D20] text-white hover:bg-[#B91C1C]"
            : "bg-[#FFFAF4] text-[#1E2A44] border border-[#1E2A44]/20 hover:bg-[#FBEBD9] hover:border-[#F47A1F]"
        } ${className}`}
      >
        {status === "loading" ? (
          <HugeiconsIcon icon={Loading03Icon} size={15} className="animate-spin text-[#F47A1F]" />
        ) : status === "playing" ? (
          <HugeiconsIcon icon={StopIcon} size={15} strokeWidth={2.4} />
        ) : (
          <HugeiconsIcon icon={VolumeHighIcon} size={15} strokeWidth={2.4} className="text-[#F47A1F]" />
        )}
        <span>{label || defaultLabel}</span>
      </button>

      {status === "playing" && (
        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#EAF6EE] text-[#2E9E5B] border border-[#2E9E5B]/20 animate-pulse">
          {source === "polly" ? "Amazon Polly (Kajal)" : "Browser Voice"}
        </span>
      )}
    </div>
  );
}
