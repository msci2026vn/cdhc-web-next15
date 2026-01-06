"use client";

import type { CredentialResponse } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { RateLimitBlocked } from "@/components/auth/RateLimitBlocked";
import { RateLimitWarning } from "@/components/auth/RateLimitWarning";
import { checkRateLimit, handleRateLimitResponse } from "@/lib/api/rate-limit";
import type {
  BusinessFormData,
  CommunityFormData,
  CoopFormData,
  ExpertFormData,
  FarmerFormData,
  KocFormData,
  KolFormData,
  ShopFormData,
} from "@/modules/shared/components/forms";
import {
  BusinessForm,
  CommunityForm,
  CoopForm,
  ExpertForm,
  FarmerForm,
  KocForm,
  KolForm,
  ShopForm,
} from "@/modules/shared/components/forms";
import { SecureStorage } from "@/modules/shared/lib/secure-storage";
import { hasRequiredProfileFields } from "@/modules/shared/lib/validation";

type Role =
  | "farmer"
  | "community"
  | "business"
  | "coop"
  | "shop"
  | "expert"
  | "kol"
  | "koc";

interface RoleOption {
  value: Role;
  label: string;
  icon: string;
  description: string;
  needApproval: boolean;
}

interface GoogleUser {
  email: string;
  name: string;
  picture: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  status: "pending" | "approved" | "rejected";
}

type ProfileData =
  | FarmerFormData
  | CommunityFormData
  | BusinessFormData
  | CoopFormData
  | ShopFormData
  | ExpertFormData
  | KolFormData
  | KolFormData
  | KocFormData;

// ===== LEGACY USER TYPES =====
interface LegacyData {
  name: string;
  phone: string;
  rank: string;
  shares: number;
  ogn: number;
  tor: number;
  f1_total: number;
  dob: string;
  joined: string;
  f1s?: Array<{
    id: string;
    n: string;
    p: string;
  }>;
}

interface GoogleAuthResponse {
  success: boolean;
  message?: string;
  needRegister?: boolean;
  isLegacyUser?: boolean;
  legacyData?: LegacyData;
  googleUser?: GoogleUser;
  user?: User;
  accessToken?: string;
  refreshToken?: string;
  error?: {
    code: string;
    message: string;
  };
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://pro.cdhc.vn";

const ROLE_REDIRECTS: Record<Role, string> = {
  farmer: "/farmer/dashboard",
  community: "/community/dashboard",
  business: "/business/dashboard",
  coop: "/coop/dashboard",
  shop: "/shop/dashboard",
  expert: "/expert/dashboard",
  kol: "/kol/dashboard",
  koc: "/koc/dashboard",
};

const ROLE_ORDER = [
  "farmer",
  "community",
  "business",
  "coop",
  "shop",
  "expert",
  "kol",
  "koc",
];

const ROLE_LABELS: Record<Role, string> = {
  farmer: "Nhà nông",
  community: "Cộng đồng",
  business: "Doanh nghiệp",
  coop: "Hợp tác xã",
  shop: "Cửa hàng",
  expert: "Chuyên gia",
  kol: "KOL",
  koc: "KOC",
};

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // State cho modal chon role
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [googleUser, setGoogleUser] = useState<GoogleUser | null>(null);
  const [idToken, setIdToken] = useState<string | null>(null);
  const [legacyData, setLegacyData] = useState<LegacyData | null>(null);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<RoleOption[]>([]);

  // Step 2: Profile form
  const [step, setStep] = useState<1 | 2>(1);

  // Rate limiting state
  const [warning, setWarning] = useState<string>("");
  const [attemptsRemaining, setAttemptsRemaining] = useState(5);
  const [isBlocked, setIsBlocked] = useState(false);
  const [retryAfter, setRetryAfter] = useState(0);

  // ===== ABORT CONTROLLER REF =====
  const abortControllerRef = useRef<AbortController | null>(null);

  // Pre-check rate limit on mount (optional)
  useEffect(() => {
    async function preCheck() {
      const status = await checkRateLimit();
      if (status.blocked && status.remainingTime) {
        setIsBlocked(true);
        setRetryAfter(status.remainingTime);
      } else {
        setAttemptsRemaining(status.attemptsRemaining ?? 5);
      }
    }
    preCheck();
  }, []);

  // Fetch danh sach roles khi mount
  useEffect(() => {
    // Create abort controller for this request
    const controller = new AbortController();
    abortControllerRef.current = controller;

    fetch(`${API_URL}/api/auth/roles`, {
      signal: controller.signal,
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data: { success: boolean; roles?: RoleOption[] }) => {
        if (data.success && data.roles) {
          // Sort roles theo thứ tự đẹp
          const sortedRoles = [...data.roles].sort(
            (a, b) => ROLE_ORDER.indexOf(a.value) - ROLE_ORDER.indexOf(b.value)
          );
          setRoles(sortedRoles);
        }
      })
      .catch((err) => {
        // Ignore abort errors
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        // Fallback roles if API fails
        setRoles([
          {
            value: "farmer",
            label: "Nhà nông",
            icon: "🌾",
            description: "Nông dân trồng trọt, chăn nuôi",
            needApproval: false,
          },
          {
            value: "community",
            label: "Cộng đồng",
            icon: "👥",
            description: "Thành viên cộng đồng",
            needApproval: false,
          },
          {
            value: "business",
            label: "Doanh nghiệp",
            icon: "🏢",
            description: "Công ty, doanh nghiệp",
            needApproval: true,
          },
          {
            value: "coop",
            label: "Hợp tác xã",
            icon: "🤝",
            description: "Hợp tác xã nông nghiệp",
            needApproval: true,
          },
          {
            value: "shop",
            label: "Cửa hàng hữu cơ",
            icon: "🏪",
            description: "Cửa hàng bán lẻ nông sản",
            needApproval: true,
          },
          {
            value: "expert",
            label: "Chuyên gia",
            icon: "🎓",
            description: "Tư vấn kỹ thuật nông nghiệp",
            needApproval: true,
          },
          {
            value: "kol",
            label: "KOL",
            icon: "⭐",
            description: "Người có sức ảnh hưởng",
            needApproval: true,
          },
          {
            value: "koc",
            label: "KOC",
            icon: "📝",
            description: "Người đánh giá sản phẩm",
            needApproval: true,
          },
        ]);
      });

    // Cleanup: abort request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      toast.error("Không nhận được thông tin từ Google");
      return;
    }

    setIsLoading(true);
    setError(null);
    setWarning("");

    try {
      const apiUrl = `${API_URL}/api/auth/google`;

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ idToken: response.credential }),
      });

      const data = (await res.json()) as GoogleAuthResponse;

      // Handle rate limiting
      const rateLimitInfo = handleRateLimitResponse({
        status: res.status,
        data,
      });

      if (rateLimitInfo.isRateLimited) {
        setIsBlocked(true);
        setRetryAfter(rateLimitInfo.retryAfter ?? 60);
        setError(rateLimitInfo.message ?? "Tài khoản bị khóa tạm thời");
        toast.error(rateLimitInfo.message ?? "Tài khoản bị khóa tạm thời");
        return;
      }

      if (rateLimitInfo.warning) {
        setWarning(rateLimitInfo.warning);
        setAttemptsRemaining(rateLimitInfo.attemptsRemaining ?? 0);
      }

      if (!data.success) {
        toast.error(data.message ?? "Đăng nhập thất bại");
        return;
      }

      if (data.needRegister) {
        setGoogleUser(data.googleUser ?? null);
        setIdToken(response.credential);
        setStep(1);

        // Check legacy user from old system
        if (data.isLegacyUser && data.legacyData) {
          setLegacyData(data.legacyData);

          // Auto-select role for legacy users (always community)
          setSelectedRole("community");

          // Show welcome message
          toast.success(`🎉 Chào mừng ${data.legacyData.name} quay trở lại!`, {
            description: `Cấp bậc: ${data.legacyData.rank} - Cổ phần: ${data.legacyData.shares.toLocaleString()}`,
          });

          // SKIP role modal, show form directly
          setShowRoleModal(false);
          // Assuming step 2 is showing the profile form
          setStep(2);
          setShowRoleModal(true); // Re-using modal for form, just updated step
          return;
        } else {
          setLegacyData(null);
        }

        setShowRoleModal(true);
      } else if (data.user) {
        // User data saved locally (tokens are in HttpOnly cookies)
        SecureStorage.setUser(data.user);

        toast.success("Đăng nhập thành công!");

        if (data.user.status === "pending") {
          router.push("/pending");
        } else if (data.user.status === "rejected") {
          router.push("/rejected");
        } else {
          router.push(ROLE_REDIRECTS[data.user.role]);
        }
      } else {
        toast.error("Phản hồi từ server không hợp lệ");
      }
    } catch (err) {
      console.error(err);
      toast.error("Lỗi kết nối server");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleError = () => {
    setError("Đăng nhập Google thất bại");
  };

  const handleContinueToStep2 = () => {
    if (!selectedRole) {
      setError("Vui lòng chọn loại tài khoản");
      return;
    }
    setError(null);
    setStep(2);
  };

  const handleBackToStep1 = () => {
    setStep(1);
    setError(null);
  };

  const handleProfileSubmit = async (profileData: ProfileData) => {
    if (!selectedRole || !idToken) {
      toast.error("Thiếu thông tin đăng ký");
      return;
    }

    // Type-safe validation for Community/Farmer roles
    // These roles require fullName, province, and ward fields
    if (
      (selectedRole === "community" || selectedRole === "farmer") &&
      !hasRequiredProfileFields(profileData)
    ) {
      toast.error("Vui lòng điền đầy đủ thông tin bắt buộc");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        idToken,
        role: selectedRole,
        isLegacyUser: !!legacyData,
        profile: profileData,
      };

      const res = await fetch(`${API_URL}/api/auth/google/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = (await res.json()) as {
        success: boolean;
        message?: string;
        accessToken?: string;
        user?: User;
        refreshToken?: string;
        error?: {
          code: string;
          message: string;
          details?: Array<{ path?: string[]; message?: string }>;
        };
      };

      // Handle specific HTTP errors
      if (res.status === 400) {
        if (data.error?.code === "PROFILE_REQUIRED") {
          toast.error("Thông tin hồ sơ là bắt buộc");
        } else if (data.error?.code === "VALIDATION_ERROR") {
          toast.error(data.error.message || "Dữ liệu không hợp lệ");
        } else if (data.error?.code === "INVALID_PROFILE") {
          // Show detailed validation errors
          const details = data.error?.details;
          if (Array.isArray(details) && details.length > 0) {
            const errorMessages = details
              .map(
                (d) =>
                  `${d.path?.join(".") ?? "field"}: ${d.message ?? "invalid"}`
              )
              .join(", ");
            toast.error(`Lỗi validation: ${errorMessages}`);
          } else {
            toast.error(data.error.message || "Thông tin không hợp lệ");
          }
        } else {
          toast.error(data.message || "Vui lòng kiểm tra lại thông tin");
        }
        return; // Don't proceed
      }

      if (res.status === 500) {
        toast.error("Lỗi máy chủ. Vui lòng thử lại sau.");
        return;
      }

      // Check success flag from body
      if (!data.success) {
        toast.error(data.message ?? "Đăng ký thất bại");
        return;
      }

      if (data.user) {
        // User/profile data saved locally (tokens are in HttpOnly cookies)
        SecureStorage.setUser(data.user);
        SecureStorage.setProfile(profileData);

        // Clear legacy data from state
        setLegacyData(null);

        const message = legacyData
          ? "Tài khoản đã được khôi phục thành công!"
          : "Đăng ký thành công!";
        toast.success(message);

        if (data.user.status === "pending") {
          router.push("/pending");
        } else {
          router.push(ROLE_REDIRECTS[data.user.role]); // Now safe because data.user is typed
        }
      }
    } catch (err: unknown) {
      console.error("Registration error:", err);
      const message = err instanceof Error ? err.message : "Lỗi kết nối server";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowRoleModal(false);
    setSelectedRole(null);
    setStep(1);
    setError(null);
  };

  const handleUnblock = () => {
    setIsBlocked(false);
    setRetryAfter(0);
    setError(null);
    setWarning("");
    setAttemptsRemaining(5);
  };

  const renderProfileForm = () => {
    if (!selectedRole) return null;

    const baseProps = {
      onSubmit: handleProfileSubmit,
      isLoading,
    };

    const legacyProps = legacyData
      ? {
          isLegacyUser: true,
          initialData: {
            fullName: legacyData.name,
            phone: legacyData.phone,
            birthDate: legacyData.dob,
            contactName: legacyData.name,
            contactPhone: legacyData.phone,
            contactBirthDate: legacyData.dob,
            rank: legacyData.rank,
            shares: legacyData.shares,
            f1_total: legacyData.f1_total,
          },
        }
      : {
          isLegacyUser: false, // Explicitly false for type safety
          initialData: undefined,
        };

    // Dynamic props are hard to type strictly without intersection types
    const formProps = { ...baseProps, ...legacyProps };

    switch (selectedRole) {
      case "farmer":
        return <FarmerForm {...formProps} />;
      case "community":
        return <CommunityForm {...formProps} />;
      case "business":
        return <BusinessForm {...formProps} />;
      case "coop":
        return <CoopForm {...formProps} />;
      case "shop":
        return <ShopForm {...formProps} />;
      case "expert":
        return <ExpertForm {...formProps} />;
      case "kol":
        return <KolForm {...formProps} />;
      case "koc":
        return <KocForm {...formProps} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3 mb-4">
            <div className="w-14 h-14 rounded-2xl overflow-hidden">
              <Image
                src="/icons/icon-512x512.png"
                alt="CĐHC Logo"
                width={56}
                height={56}
                className="w-full h-full object-cover"
              />
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

        {/* Rate Limit Blocked */}
        {isBlocked && !showRoleModal && (
          <div className="mb-6">
            <RateLimitBlocked
              retryAfter={retryAfter}
              onUnblock={handleUnblock}
            />
          </div>
        )}

        {/* Rate Limit Warning */}
        {!isBlocked && warning && !showRoleModal && (
          <div className="mb-6">
            <RateLimitWarning attemptsRemaining={attemptsRemaining} />
          </div>
        )}

        {/* Error message */}
        {error && !showRoleModal && !isBlocked && !warning && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <div
          className={`flex justify-center ${isLoading || isBlocked ? "opacity-50 pointer-events-none" : ""}`}
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

        {/* Info */}
        <p className="text-center text-sm text-slate-500 mt-6">
          Tự động tạo tài khoản nếu bạn chưa có
        </p>

        {/* Terms */}
        <p className="text-xs text-slate-400 text-center mt-6">
          Bằng việc đăng nhập, bạn đồng ý với{" "}
          <Link href="/terms" className="text-green-600 hover:underline">
            Điều khoản sử dụng
          </Link>{" "}
          và{" "}
          <Link href="/privacy" className="text-green-600 hover:underline">
            Chính sách bảo mật
          </Link>
        </p>

        <div className="mt-8 text-center">
          <Link
            href="/"
            className="text-sm text-slate-500 hover:text-green-600 transition-colors"
          >
            ← Quay về trang chủ
          </Link>
        </div>
      </div>

      {/* Modal Chon Role / Profile */}
      {showRoleModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="text-center mb-6">
              {googleUser?.picture && (
                <Image
                  src={googleUser.picture}
                  alt={googleUser.name}
                  width={64}
                  height={64}
                  className="rounded-full mx-auto mb-4"
                />
              )}
              <h2
                className="text-xl font-bold text-slate-800"
                style={{ fontFamily: "var(--font-serif)" }}
              >
                {step === 1
                  ? `Chào mừng ${googleUser?.name ?? ""}!`
                  : `Thông tin ${selectedRole ? ROLE_LABELS[selectedRole] : ""}`}
              </h2>
              <p className="text-slate-500 mt-1">
                {step === 1
                  ? "Bạn muốn tham gia với vai trò nào?"
                  : "Hoàn tất thông tin để đăng ký"}
              </p>
            </div>

            {/* Step indicator */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 1 ? "gradient-primary text-white" : "bg-green-100 text-green-600"}`}
              >
                {step === 1 ? "1" : "✓"}
              </div>
              <div
                className={`w-12 h-1 rounded ${step === 2 ? "bg-green-500" : "bg-slate-200"}`}
              />
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${step === 2 ? "gradient-primary text-white" : "bg-slate-200 text-slate-400"}`}
              >
                2
              </div>
            </div>

            {/* Error in modal */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
                {error}
              </div>
            )}

            {/* Step 1: Role Selection */}
            {step === 1 && (
              <>
                {/* Role Grid */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {roles.map((role) => {
                    const isSelected = selectedRole === role.value;
                    return (
                      <button
                        type="button"
                        key={role.value}
                        disabled={isLoading}
                        onClick={() => {
                          setSelectedRole(role.value);
                          setError(null);
                        }}
                        className={`p-4 border-2 rounded-xl transition-all text-left relative ${
                          isSelected
                            ? "border-green-500 bg-green-50"
                            : "border-slate-200 hover:border-green-300"
                        } ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isSelected && (
                          <span className="absolute -top-2 -right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
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
                        <span className="text-2xl block mb-2">{role.icon}</span>
                        <span className="text-sm font-semibold text-slate-800 block">
                          {role.label}
                        </span>
                        <span className="text-xs text-slate-500 block mt-1">
                          {role.description}
                        </span>
                        {role.needApproval && (
                          <span className="text-xs text-amber-600 block mt-1">
                            ⏳ Cần phê duyệt
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Warning for roles need approval */}
                {selectedRole &&
                  roles.find((r) => r.value === selectedRole)?.needApproval && (
                    <div className="mb-4 p-3 bg-amber-50 border border-amber-200 text-amber-700 rounded-xl text-sm">
                      ⚠️ Vai trò này cần được Admin phê duyệt trước khi sử dụng
                    </div>
                  )}

                {/* Buttons */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isLoading}
                    className="flex-1 py-3 border-2 border-slate-200 rounded-full font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
                  >
                    Huỷ
                  </button>
                  <button
                    type="button"
                    onClick={handleContinueToStep2}
                    disabled={!selectedRole || isLoading}
                    className={`flex-1 py-3 rounded-full font-semibold text-white transition-all ${
                      selectedRole && !isLoading
                        ? "gradient-primary hover:shadow-lg"
                        : "bg-slate-300 cursor-not-allowed"
                    }`}
                  >
                    Tiếp tục
                  </button>
                </div>
              </>
            )}

            {/* Step 2: Profile Form */}
            {step === 2 && (
              <>
                {/* Back button */}
                <button
                  type="button"
                  onClick={handleBackToStep1}
                  disabled={isLoading}
                  className="mb-4 text-sm text-slate-500 hover:text-green-600 transition-colors flex items-center gap-1 disabled:opacity-50"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                  Quay lại chọn vai trò
                </button>

                {/* Render form based on role */}
                {renderProfileForm()}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
