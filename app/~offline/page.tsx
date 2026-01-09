"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";

export default function OfflinePage() {
  const router = useRouter();
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [retryCount, setRetryCount] = useState<number>(0);
  const reloadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsOnline(navigator.onLine);

    const handleOnline = () => {
      setIsOnline(true);
      // Clear any previous timeout
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
      reloadTimeoutRef.current = setTimeout(() => {
        window.location.reload();
      }, 1000);
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      // Cleanup timeout on unmount
      if (reloadTimeoutRef.current) {
        clearTimeout(reloadTimeoutRef.current);
      }
    };
  }, []);

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <svg
            className="w-24 h-24 mx-auto text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-gray-800 mb-3">
          Không có kết nối mạng
        </h1>

        <p className="text-gray-600 mb-6">
          Vui lòng kiểm tra kết nối internet của bạn và thử lại. Một số tính
          năng có thể vẫn hoạt động ở chế độ ngoại tuyến.
        </p>

        <div
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 ${
            isOnline ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          }`}
        >
          <span
            className={`w-2 h-2 rounded-full ${
              isOnline ? "bg-green-500" : "bg-red-500"
            }`}
          />
          {isOnline ? "Đã kết nối lại" : "Đang ngoại tuyến"}
        </div>

        <div className="space-y-3">
          <button
            type="button"
            onClick={handleRetry}
            className="w-full px-6 py-3 bg-green-600 text-white font-medium rounded-lg hover:bg-green-700 transition-colors"
          >
            Thử lại
          </button>

          <button
            type="button"
            onClick={() => router.back()}
            className="w-full px-6 py-3 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors"
          >
            Quay lại trang trước
          </button>
        </div>

        <div className="mt-8 p-4 bg-green-50 rounded-lg text-left">
          <h3 className="font-semibold text-green-800 mb-2">
            Tính năng ngoại tuyến:
          </h3>
          <ul className="text-sm text-green-700 space-y-1">
            <li>- Xem sản phẩm đã lưu trong bộ nhớ đệm</li>
            <li>- Đặt hàng (sẽ gửi khi có mạng)</li>
            <li>- Xem thông tin đơn hàng gần đây</li>
            <li>- Quét mã QR sản phẩm</li>
          </ul>
        </div>

        {retryCount > 2 && (
          <p className="mt-4 text-sm text-gray-500">
            Mẹo: Thử di chuyển đến nơi có sóng điện thoại tốt hơn
          </p>
        )}
      </div>
    </div>
  );
}
