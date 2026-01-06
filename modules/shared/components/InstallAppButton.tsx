"use client";

import { useState } from "react";
import { usePWAInstall } from "../hooks/usePWAInstall";

interface InstallAppButtonProps {
  className?: string;
  children?: React.ReactNode;
}

export function InstallAppButton({
  className = "",
  children,
}: InstallAppButtonProps) {
  const { isIOS, isInstalled, isStandalone, promptInstall, canPrompt } =
    usePWAInstall();
  const [showIOSModal, setShowIOSModal] = useState(false);

  const handleClick = async () => {
    // Already installed - open app or do nothing
    if (isInstalled || isStandalone) {
      return;
    }

    // iOS - show instructions modal
    if (isIOS) {
      setShowIOSModal(true);
      return;
    }

    // Android/Desktop - try native prompt
    if (canPrompt) {
      await promptInstall();
    } else {
      // Fallback: show iOS-style instructions or reload to trigger prompt
      setShowIOSModal(true);
    }
  };

  // If already installed, show disabled state (no action needed)
  if (isInstalled || isStandalone) {
    return (
      <button
        type="button"
        className={`${className} opacity-70 cursor-default`}
        disabled
        aria-label="Ứng dụng đã được cài đặt"
      >
        {children || (
          <>
            <span>✓</span>
            Đã Cài Đặt
          </>
        )}
      </button>
    );
  }

  return (
    <>
      <button type="button" className={className} onClick={handleClick}>
        {children || (
          <>
            <span>📥</span>
            Tải App Miễn Phí
          </>
        )}
      </button>

      {/* iOS Instructions Modal */}
      {showIOSModal && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="install-modal-title"
          className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/50 p-4"
          onClick={() => setShowIOSModal(false)}
          onKeyDown={(e) => e.key === "Escape" && setShowIOSModal(false)}
        >
          <div
            role="document"
            className="bg-white rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 animate-[slideUp_0.3s_ease-out]"
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(e) => e.stopPropagation()}
          >
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-2xl flex items-center justify-center">
                <span className="text-3xl">📲</span>
              </div>
              <h3
                id="install-modal-title"
                className="text-xl font-bold text-gray-900 mb-2"
              >
                Cài đặt Con Đường Hữu Cơ
              </h3>
              <p className="text-gray-600 text-sm">
                Thêm ứng dụng vào màn hình chính để truy cập nhanh hơn
              </p>
            </div>

            {isIOS ? (
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Nhấn nút Chia sẻ
                    </p>
                    <p className="text-sm text-gray-500">
                      Biểu tượng{" "}
                      <span className="inline-block px-2 py-0.5 bg-gray-200 rounded text-xs">
                        ⬆️
                      </span>{" "}
                      ở thanh dưới cùng Safari
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Chọn &quot;Thêm vào MH chính&quot;
                    </p>
                    <p className="text-sm text-gray-500">
                      Cuộn xuống và tìm tùy chọn này
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white shrink-0">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Nhấn Thêm</p>
                    <p className="text-sm text-gray-500">
                      Ứng dụng sẽ xuất hiện trên màn hình chính
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4 mb-6">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white shrink-0">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Mở menu trình duyệt
                    </p>
                    <p className="text-sm text-gray-500">
                      Nhấn biểu tượng{" "}
                      <span className="inline-block px-2 py-0.5 bg-gray-200 rounded text-xs">
                        ⋮
                      </span>{" "}
                      góc phải trên
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center text-white shrink-0">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Chọn &quot;Cài đặt ứng dụng&quot;
                    </p>
                    <p className="text-sm text-gray-500">
                      Hoặc &quot;Thêm vào màn hình chính&quot;
                    </p>
                  </div>
                </div>
              </div>
            )}

            <button
              type="button"
              onClick={() => setShowIOSModal(false)}
              className="w-full py-3 bg-green-600 text-white font-semibold rounded-xl hover:bg-green-700 transition"
            >
              Đã hiểu
            </button>
          </div>
        </div>
      )}
    </>
  );
}
