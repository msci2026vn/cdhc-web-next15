"use client";

import { useCallback, useEffect, useState } from "react";
import { Workbox } from "workbox-window";

interface ServiceWorkerState {
  showBanner: boolean;
  showBadge: boolean;
  waitingWorker: ServiceWorker | null;
}

export function UpdateNotification() {
  const [state, setState] = useState<ServiceWorkerState>({
    showBanner: false,
    showBadge: false,
    waitingWorker: null,
  });
  const [wb, setWb] = useState<Workbox | null>(null);

  const showUpdateNotification = useCallback(
    (sw: ServiceWorker | null, immediate = false) => {
      const dismissedTime = localStorage.getItem("pwa-update-dismissed");
      const hoursSinceDismissed = dismissedTime
        ? (Date.now() - Number.parseInt(dismissedTime, 10)) / (1000 * 60 * 60)
        : Number.POSITIVE_INFINITY;

      setState({
        showBanner: immediate || hoursSinceDismissed > 1,
        showBadge: true,
        waitingWorker: sw,
      });
    },
    []
  );

  useEffect(() => {
    if (
      typeof window === "undefined" ||
      !("serviceWorker" in navigator) ||
      process.env.NODE_ENV !== "production"
    ) {
      return;
    }

    const workbox = new Workbox("/sw.js", {
      scope: "/",
    });

    setWb(workbox);

    // New SW is waiting to activate
    workbox.addEventListener("waiting", (event) => {
      console.log("[PWA] New service worker waiting");
      showUpdateNotification(event.sw ?? null);
    });

    // New SW took control (after skipWaiting)
    workbox.addEventListener("controlling", () => {
      console.log("[PWA] New service worker controlling, reloading...");
      window.location.reload();
    });

    // SW was updated and activated
    workbox.addEventListener("activated", (event) => {
      // Only show if this is NOT the first install
      if (!event.isUpdate) {
        console.log("[PWA] Service worker installed for first time");
        return;
      }
      console.log("[PWA] Service worker updated and activated");
    });

    // Check if there's already a waiting SW
    workbox.register().then((registration) => {
      if (registration?.waiting) {
        console.log("[PWA] Found waiting service worker on register");
        showUpdateNotification(registration.waiting);
      }

      // Also check periodically for updates (every 60 seconds)
      const checkInterval = setInterval(() => {
        registration?.update().catch(() => {
          // Ignore errors
        });
      }, 60 * 1000);

      return () => clearInterval(checkInterval);
    });

    // Listen for SW state changes directly
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      console.log("[PWA] Controller changed");
    });
  }, [showUpdateNotification]);

  const handleUpdate = useCallback(() => {
    if (state.waitingWorker) {
      state.waitingWorker.postMessage({ type: "SKIP_WAITING" });
    } else if (wb) {
      // Force update check and reload
      wb.messageSkipWaiting();
    }
    localStorage.removeItem("pwa-update-dismissed");
  }, [state.waitingWorker, wb]);

  const handleMinimize = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showBanner: false,
      showBadge: true,
    }));
    localStorage.setItem("pwa-update-dismissed", Date.now().toString());
  }, []);

  const handleBadgeClick = useCallback(() => {
    setState((prev) => ({
      ...prev,
      showBanner: true,
    }));
  }, []);

  // Floating badge (minimized state)
  if (state.showBadge && !state.showBanner) {
    return (
      <button
        type="button"
        onClick={handleBadgeClick}
        className="fixed bottom-4 right-4 w-14 h-14 bg-green-600 text-white rounded-full flex items-center justify-center cursor-pointer shadow-xl hover:bg-green-700 transition-all hover:scale-110 z-50"
        aria-label="Cập nhật phiên bản mới"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
          />
        </svg>
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs flex items-center justify-center font-bold animate-pulse">
          1
        </span>
      </button>
    );
  }

  // Full banner
  if (!state.showBanner) return null;

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl p-4 max-w-sm border-2 border-green-600 z-50 animate-[slideUp_0.3s_ease-out]">
      <div className="flex items-start gap-3 mb-3">
        <div className="shrink-0 w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-800 mb-1">
            Phiên bản mới có sẵn!
          </h3>
          <p className="text-sm text-gray-600">
            Cập nhật để nhận tính năng mới và cải thiện hiệu suất
          </p>
        </div>
        <button
          type="button"
          onClick={handleMinimize}
          className="shrink-0 text-gray-400 hover:text-gray-600 transition"
          aria-label="Thu nhỏ"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={handleMinimize}
          className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
        >
          Để sau
        </button>
        <button
          type="button"
          onClick={handleUpdate}
          className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
        >
          Cập nhật ngay
        </button>
      </div>
    </div>
  );
}
