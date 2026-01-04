"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";

interface User {
  name: string;
  email: string;
  role: string;
  rejectionReason?: string;
}

function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem("user");
  if (!userData) return null;
  try {
    return JSON.parse(userData) as User;
  } catch {
    return null;
  }
}

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("storage", callback);
  };
}

export default function RejectedPage() {
  const user = useSyncExternalStore(subscribe, getStoredUser, () => null);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        {/* Icon */}
        <div className="w-20 h-20 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-4xl">❌</span>
        </div>

        {/* Title */}
        <h1
          className="text-2xl font-bold text-slate-800 mb-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Yêu cầu bị từ chối
        </h1>

        <p className="text-slate-500 mb-6">
          Rất tiếc, yêu cầu đăng ký của bạn không được chấp nhận
        </p>

        {/* Reason */}
        {user?.rejectionReason && (
          <div className="bg-red-50 rounded-xl p-4 mb-6 text-left">
            <p className="text-sm text-red-700">
              <strong>Lý do:</strong> {user.rejectionReason}
            </p>
          </div>
        )}

        {/* Contact */}
        <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-slate-600">
            📧 Nếu cần hỗ trợ, vui lòng liên hệ:{" "}
            <strong>support@cdhc.vn</strong>
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="py-3 gradient-primary text-white rounded-full font-semibold text-center"
          >
            Về trang chủ
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="py-3 border-2 border-slate-200 rounded-full font-semibold text-slate-600 hover:bg-slate-50"
          >
            Đăng nhập tài khoản khác
          </button>
        </div>
      </div>
    </div>
  );
}
