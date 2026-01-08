"use client";

import { useEffect, useRef, useState } from "react";

interface RateLimitBlockedProps {
  retryAfter: number; // seconds
  onUnblock?: () => void;
}

export function RateLimitBlocked({
  retryAfter,
  onUnblock,
}: RateLimitBlockedProps) {
  const [remaining, setRemaining] = useState(retryAfter);

  // Refs to track mounted state and avoid stale closures
  const isMountedRef = useRef(true);
  const onUnblockRef = useRef(onUnblock);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep onUnblock ref updated
  onUnblockRef.current = onUnblock;

  useEffect(() => {
    isMountedRef.current = true;

    // Cleanup function for all timers
    const cleanup = () => {
      isMountedRef.current = false;
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

    // Safe callback that checks mounted state
    const safeUnblock = () => {
      if (isMountedRef.current) {
        onUnblockRef.current?.();
      }
    };

    // Already expired, call onUnblock immediately
    if (remaining <= 0) {
      timeoutRef.current = setTimeout(safeUnblock, 0);
      return cleanup;
    }

    // Countdown timer
    timerRef.current = setInterval(() => {
      if (!isMountedRef.current) {
        if (timerRef.current) clearInterval(timerRef.current);
        return;
      }

      setRemaining((r) => {
        const next = r - 1;
        if (next <= 0) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
          }
          // Schedule callback outside of state update
          timeoutRef.current = setTimeout(safeUnblock, 0);
        }
        return Math.max(0, next);
      });
    }, 1000);

    return cleanup;
  }, [remaining]);

  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  const percentage = ((retryAfter - remaining) / retryAfter) * 100;

  return (
    <div className="rounded-lg border border-red-300 bg-red-50 p-6">
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-full bg-red-100 p-3">
          <svg
            className="h-8 w-8 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-red-900">
            Tài khoản tạm thời bị khóa
          </h3>
          <p className="mt-1 text-sm text-red-700">
            Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau:
          </p>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-red-600 tabular-nums">
            {minutes}:{seconds.toString().padStart(2, "0")}
          </div>
          <p className="mt-1 text-xs text-red-600">
            {minutes > 0 ? `${minutes} phút` : ""} {seconds} giây
          </p>
        </div>

        <div className="w-full max-w-xs">
          <div className="h-2 w-full overflow-hidden rounded-full bg-red-200">
            <div
              className="h-full bg-red-600 transition-all duration-1000"
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>

        <p className="text-xs text-red-600">
          Sau thời gian này, bạn có thể thử đăng nhập lại
        </p>
      </div>
    </div>
  );
}
