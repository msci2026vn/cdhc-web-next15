"use client";

import type { CredentialResponse } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Role = "business" | "coop" | "community" | "shop";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://pro.cdhc.vn";

const ROLE_REDIRECTS: Record<Role, string> = {
  business: "/business/dashboard",
  coop: "/coop/dashboard",
  community: "/community/dashboard",
  shop: "/shop/dashboard",
};

const ROLES = [
  { role: "business" as const, label: "Doanh nghiệp", icon: "🏢" },
  { role: "coop" as const, label: "Hợp tác xã", icon: "🤝" },
  { role: "community" as const, label: "Cộng đồng", icon: "👥" },
  { role: "shop" as const, label: "Cửa hàng hữu cơ", icon: "🏪" },
];

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!selectedRole) {
      setError("Vui lòng chọn loại tài khoản trước");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idToken: response.credential,
          role: selectedRole,
        }),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          accessToken: string;
          user: unknown;
        };
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));
        localStorage.setItem("selectedRole", selectedRole);
        router.push(ROLE_REDIRECTS[selectedRole]);
      } else {
        setError("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch {
      setError("Lỗi kết nối server. Vui lòng thử lại sau.");
    }
  };

  const handleGoogleError = () => {
    setError("Đăng nhập Google thất bại");
  };

  const handleSelectRole = (role: Role) => {
    setSelectedRole(role);
    setError(null);
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center text-2xl">
              🌱
            </div>
          </Link>
          <h1
            className="text-2xl font-bold text-slate-800"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Đăng nhập
          </h1>
          <p className="text-slate-500 mt-2">Chào mừng đến Con Đường Hữu Cơ</p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
            {error}
          </div>
        )}

        {/* Role Selection */}
        <div className="mb-8">
          <p className="text-sm font-medium text-slate-700 mb-4">Bạn là ai?</p>
          <div className="grid grid-cols-2 gap-3">
            {ROLES.map((item) => {
              const isSelected = selectedRole === item.role;
              return (
                <button
                  type="button"
                  key={item.role}
                  onClick={() => {
                    handleSelectRole(item.role);
                  }}
                  className={`relative p-4 border-2 rounded-xl transition-all text-center ${
                    isSelected
                      ? "border-green-500 bg-green-50"
                      : "border-slate-200 bg-white hover:border-green-500 hover:bg-green-50"
                  }`}
                >
                  {isSelected && (
                    <span className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={3}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                  )}
                  <span className="text-2xl block mb-2">{item.icon}</span>
                  <span className="text-sm font-medium text-slate-700">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Google Login Button */}
        <div
          className={`flex justify-center ${!selectedRole ? "opacity-50 pointer-events-none" : ""}`}
        >
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            theme="outline"
            size="large"
            text="signin_with"
            shape="pill"
            width="320"
          />
        </div>

        {/* Hint when no role selected */}
        {!selectedRole && (
          <p className="text-center text-sm text-amber-600 mt-4">
            Vui lòng chọn loại tài khoản trước
          </p>
        )}

        {/* Divider */}
        <div className="my-6 text-center text-sm text-slate-400">
          Chỉ hỗ trợ đăng nhập bằng Google
        </div>

        {/* Info */}
        <p className="text-xs text-slate-400 text-center">
          Bằng việc đăng nhập, bạn đồng ý với{" "}
          <Link href="/terms" className="text-green-600 hover:underline">
            Điều khoản sử dụng
          </Link>{" "}
          và{" "}
          <Link href="/privacy" className="text-green-600 hover:underline">
            Chính sách bảo mật
          </Link>
        </p>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-green-600 transition-colors"
          >
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
