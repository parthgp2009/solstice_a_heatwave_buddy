"use client";

import { useEffect } from "react";

/**
 * Service Worker Registration Component (Step 5A).
 * Registers /sw.js ONLY in production environments.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (
      process.env.NODE_ENV === "production" &&
      typeof window !== "undefined" &&
      "serviceWorker" in navigator
    ) {
      const handleLoad = () => {
        navigator.serviceWorker
          .register("/sw.js")
          .catch((error) => {
            console.error("[Solstice SW] Registration failed:", error);
          });
      };

      window.addEventListener("load", handleLoad);
      return () => window.removeEventListener("load", handleLoad);
    }
  }, []);

  return null;
}
