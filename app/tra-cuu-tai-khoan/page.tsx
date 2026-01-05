"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { MathCaptcha, TextField } from "@/modules/shared/components/ui";
import { lookupLegacyAccount } from "@/modules/shared/lib/api";
import type { LegacyAccount } from "@/modules/shared/types";

interface FormData {
  email: string;
  phone: string;
}

interface FormErrors {
  email?: string;
  phone?: string;
}

export default function LegacyLookupPage() {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<LegacyAccount | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showCaptcha, setShowCaptcha] = useState(false);
  const [captchaData, setCaptchaData] = useState<{
    answer: number;
    token: string;
  } | null>(null);

  // Validation
  const validateEmail = (email: string): string | undefined => {
    if (!email) return "Vui lòng nhập email";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Email không hợp lệ";
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone) return "Vui lòng nhập số điện thoại";
    if (phone.length < 10) return "Số điện thoại phải có ít nhất 10 số";
    const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
    if (!phoneRegex.test(phone))
      return "Số điện thoại không hợp lệ (VD: 0979399882)";
    return undefined;
  };

  const validate = (): boolean => {
    const newErrors: FormErrors = {
      email: validateEmail(formData.email),
      phone: validatePhone(formData.phone),
    };
    setErrors(newErrors);
    return !newErrors.email && !newErrors.phone;
  };

  // Handlers
  const handleFieldChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleCaptchaVerify = (answer: number, token: string) => {
    setCaptchaData({ answer, token });
  };

  const handleCaptchaError = (errorMsg: string) => {
    setError(`Lỗi CAPTCHA: ${errorMsg}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      toast.error("Vui lòng kiểm tra lại thông tin");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await lookupLegacyAccount({
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        captchaToken: captchaData?.token,
        captchaAnswer: captchaData?.answer,
      });

      if (response.success && response.data) {
        setResult(response.data);
        setShowCaptcha(false);
        setCaptchaData(null);
        toast.success("Tìm thấy thông tin tài khoản!");
      } else {
        const errorCode = response.error?.code;
        const errorMsg = response.error?.message || "Tra cứu thất bại";

        if (errorCode === "CAPTCHA_REQUIRED") {
          setShowCaptcha(true);
          setError("Vui lòng hoàn thành CAPTCHA để tiếp tục");
        } else if (errorCode === "CAPTCHA_WRONG") {
          setCaptchaData(null);
          setError("Kết quả CAPTCHA sai! Vui lòng thử lại");
        } else if (errorCode === "CAPTCHA_EXPIRED") {
          setCaptchaData(null);
          setError("CAPTCHA đã hết hạn, vui lòng làm lại");
        } else if (errorCode === "NOT_FOUND") {
          setError(
            "Không tìm thấy thông tin. Vui lòng kiểm tra lại email và số điện thoại."
          );
        } else {
          setError(errorMsg);
        }
      }
    } catch (err) {
      console.error("Lookup error:", err);
      setError("Không thể kết nối đến server. Vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen gradient-hero py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 gradient-primary rounded-2xl flex items-center justify-center text-2xl">
              🌱
            </div>
          </Link>
          <h1
            className="text-3xl sm:text-4xl font-bold text-white"
            style={{ fontFamily: "var(--font-serif)" }}
          >
            Tra Cứu Tài Khoản Cũ
          </h1>
          <p className="text-green-100">
            Kiểm tra thông tin tài khoản từ hệ thống trước đây
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          <div className="mb-6">
            <h2
              className="text-xl font-bold text-slate-800"
              style={{ fontFamily: "var(--font-serif)" }}
            >
              Nhập Thông Tin
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Vui lòng nhập email và số điện thoại đã đăng ký
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(v) => handleFieldChange("email", v)}
              placeholder="example@email.com"
              required
              error={errors.email}
              disabled={loading}
            />

            {/* Phone */}
            <TextField
              label="Số điện thoại"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={(v) => handleFieldChange("phone", v)}
              placeholder="0979399882"
              required
              error={errors.phone}
              disabled={loading}
              helperText="Số điện thoại bắt đầu bằng 0 hoặc +84"
            />

            {/* CAPTCHA */}
            {showCaptcha && (
              <MathCaptcha
                onVerify={handleCaptchaVerify}
                onError={handleCaptchaError}
              />
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || (showCaptcha && !captchaData)}
              className={`w-full py-3 rounded-full font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                loading || (showCaptcha && !captchaData)
                  ? "bg-slate-300 cursor-not-allowed"
                  : "gradient-primary hover:shadow-lg"
              }`}
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
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
                  Đang tra cứu...
                </>
              ) : showCaptcha && !captchaData ? (
                "Vui lòng hoàn thành CAPTCHA"
              ) : (
                <>
                  <svg
                    className="h-5 w-5"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  Tra cứu
                </>
              )}
            </button>
          </form>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-medium text-red-800">Lỗi tra cứu</p>
              <p className="text-sm text-red-600">{error}</p>
            </div>
          </div>
        )}

        {/* Result Card */}
        {result && (
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Result Header */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 border-b border-green-100">
              <div className="flex items-center gap-3">
                <span className="text-3xl">✅</span>
                <div>
                  <h3
                    className="text-xl font-bold text-green-900"
                    style={{ fontFamily: "var(--font-serif)" }}
                  >
                    Thông tin từ hệ thống cũ
                  </h3>
                  <p className="text-sm text-green-700">
                    Dữ liệu được bảo toàn từ tài khoản trước đây
                  </p>
                </div>
              </div>
            </div>

            {/* Result Content */}
            <div className="p-6 space-y-6">
              {/* User Name */}
              <div className="p-4 bg-slate-50 rounded-xl">
                <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                  Họ và tên
                </p>
                <p className="text-xl font-bold text-slate-900">
                  {result.name}
                </p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {/* Cấp Bậc */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Cấp Bậc
                  </p>
                  <p className="text-lg font-bold text-slate-900">
                    {result.rank}
                  </p>
                </div>

                {/* Số Cổ Phần */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Số CPO
                  </p>
                  <p className="text-lg font-bold text-green-600">
                    {result.shares.toLocaleString("vi-VN")}
                  </p>
                </div>

                {/* Số F1 */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Đồng đội
                  </p>
                  <p className="text-lg font-bold text-purple-600">
                    {result.f1Total}
                  </p>
                </div>

                {/* Điểm OGN */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Điểm OGN
                  </p>
                  <p className="text-lg font-bold text-orange-600">
                    {result.ogn.toLocaleString("vi-VN")}
                  </p>
                </div>

                {/* Điểm TOR */}
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                    Điểm TOR
                  </p>
                  <p className="text-lg font-bold text-pink-600">
                    {result.tor.toLocaleString("vi-VN")}
                  </p>
                </div>
              </div>

              {/* Info Box */}
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
                <p className="text-sm text-blue-900 flex items-start gap-2">
                  <span>ℹ️</span>
                  <span>
                    Tài khoản của bạn đã được tìm thấy! Vui lòng đăng ký/đăng
                    nhập để kích hoạt và sử dụng tài khoản.
                  </span>
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex gap-3">
                <Link href="/login" className="flex-1">
                  <button
                    type="button"
                    className="w-full py-3 rounded-full font-semibold text-white gradient-primary hover:shadow-lg transition-all"
                  >
                    Đăng nhập ngay
                  </button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Help Card */}
        <div className="bg-white/90 backdrop-blur rounded-2xl p-6">
          <h3 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
            <span className="text-xl">📌</span>
            Lưu ý quan trọng
          </h3>
          <ul className="space-y-2 text-sm text-slate-600">
            <li>
              • Email và số điện thoại phải trùng khớp với thông tin đã đăng ký
            </li>
            <li>• Số điện thoại có thể bắt đầu bằng 0 hoặc +84</li>
            <li>
              • Sau 2 lần tra cứu không thành công, hệ thống sẽ yêu cầu xác minh
              CAPTCHA
            </li>
            <li>
              • Nếu gặp khó khăn, vui lòng liên hệ hỗ trợ:{" "}
              <a href="tel:0979399882" className="text-green-600 font-medium">
                0979-399-882
              </a>
            </li>
          </ul>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link
            href="/"
            className="text-sm text-green-100 hover:text-white transition-colors"
          >
            ← Quay về trang chủ
          </Link>
        </div>
      </div>
    </div>
  );
}
