"use client";

import { useCallback, useEffect, useState } from "react";
import { getCaptchaChallenge } from "../../lib/api";
import type { CaptchaChallenge } from "../../types";

interface MathCaptchaProps {
  onVerify: (answer: number, token: string) => void;
  onError?: (error: string) => void;
}

export function MathCaptcha({ onVerify, onError }: MathCaptchaProps) {
  const [challenge, setChallenge] = useState<CaptchaChallenge | null>(null);
  const [selected, setSelected] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChallenge = useCallback(async () => {
    setLoading(true);
    setError(null);
    setSelected(null);

    try {
      const data = await getCaptchaChallenge();
      setChallenge(data);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Lỗi tải CAPTCHA";
      setError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setLoading(false);
    }
  }, [onError]);

  useEffect(() => {
    loadChallenge();
  }, [loadChallenge]);

  const handleSelect = (answer: number) => {
    setSelected(answer);
    if (challenge) {
      onVerify(answer, challenge.token);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center p-8 border-2 border-green-200 rounded-xl bg-green-50">
        <svg
          className="h-6 w-6 animate-spin text-green-600"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span className="ml-2 text-sm text-green-700">Đang tải CAPTCHA...</span>
      </div>
    );
  }

  // Error state
  if (error || !challenge) {
    return (
      <div className="p-4 border-2 border-red-200 rounded-xl bg-red-50">
        <p className="text-sm text-red-600 mb-3">
          {error || "Không thể tải CAPTCHA"}
        </p>
        <button
          type="button"
          onClick={loadChallenge}
          className="w-full py-2 px-4 border-2 border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 border-2 border-green-200 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🧮</span>
          <h3 className="font-semibold text-green-900">Xác minh bảo mật</h3>
        </div>
        <button
          type="button"
          onClick={loadChallenge}
          className="h-8 w-8 p-0 flex items-center justify-center rounded-lg hover:bg-green-100 transition-colors"
          title="Làm mới CAPTCHA"
        >
          <svg
            className="h-4 w-4 text-green-600"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path d="M23 4v6h-6M1 20v-6h6M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
          </svg>
        </button>
      </div>

      {/* Question */}
      <div className="mb-4 p-4 bg-white rounded-xl border border-green-100 shadow-sm">
        <p className="text-3xl sm:text-4xl font-mono text-center mb-2 tracking-wider leading-relaxed text-slate-800">
          {challenge.question}
        </p>
        <p className="text-xs text-gray-500 text-center font-medium">
          {challenge.hint}
        </p>
      </div>

      {/* Options */}
      <div className="grid grid-cols-4 gap-2">
        {challenge.options.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => handleSelect(option)}
            className={`
              py-4 px-3 rounded-xl border-2 font-bold text-xl
              transition-all duration-200
              hover:scale-105 active:scale-95
              ${
                selected === option
                  ? "border-green-600 bg-green-100 shadow-lg ring-2 ring-green-300"
                  : "border-gray-300 bg-white hover:border-green-400 hover:shadow-md"
              }
            `}
          >
            {option}
          </button>
        ))}
      </div>

      {/* Helper text */}
      <p className="text-xs text-gray-500 text-center mt-3">
        Chọn đáp án đúng để xác minh bạn không phải robot 🤖
      </p>
    </div>
  );
}
