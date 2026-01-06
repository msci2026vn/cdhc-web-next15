"use client";

interface RateLimitWarningProps {
  attemptsRemaining: number;
  maxAttempts?: number;
}

export function RateLimitWarning({
  attemptsRemaining,
  maxAttempts = 5,
}: RateLimitWarningProps) {
  if (attemptsRemaining > 2 || attemptsRemaining <= 0) {
    return null;
  }

  const dots = Array.from({ length: maxAttempts }).map((_, i) => (
    <div
      key={i}
      className={`h-3 w-3 rounded-full transition-colors ${
        i < attemptsRemaining ? "bg-green-500" : "bg-red-500"
      }`}
    />
  ));

  return (
    <div className="rounded-lg border border-yellow-300 bg-yellow-50 p-4">
      <div className="flex items-start gap-3">
        <svg
          className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
        <div className="flex-1">
          <p className="text-sm font-medium text-yellow-800">⚠️ Cảnh báo</p>
          <p className="mt-1 text-sm text-yellow-700">
            Còn <strong>{attemptsRemaining}</strong> lần thử trước khi tài khoản
            bị khóa tạm thời.
          </p>
          <div className="mt-3 flex gap-2">{dots}</div>
        </div>
      </div>
    </div>
  );
}
