"use client";

import type { CredentialResponse } from "@react-oauth/google";
import { GoogleLogin } from "@react-oauth/google";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  | KocFormData;

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
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roles, setRoles] = useState<RoleOption[]>([]);

  // Step 2: Profile form
  const [step, setStep] = useState<1 | 2>(1);

  // Fetch danh sach roles khi mount
  useEffect(() => {
    fetch(`${API_URL}/api/auth/roles`)
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
      .catch(() => {
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
  }, []);

  const handleGoogleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      setError("Không nhận được thông tin từ Google");
      return;
    }

    setIsLoading(true);
    setError(null);

    console.log("=== DEBUG LOGIN ===");
    console.log(
      "1. Google credential:",
      `${response.credential.substring(0, 50)}...`
    );
    console.log("2. API_URL:", API_URL);

    try {
      const apiUrl = `${API_URL}/api/auth/google`;
      console.log("3. Calling API:", apiUrl);

      const res = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken: response.credential }),
      });

      console.log("4. Response status:", res.status);

      const data = (await res.json()) as {
        success: boolean;
        message?: string;
        needRegister?: boolean;
        googleUser?: GoogleUser;
        accessToken?: string;
        user?: User;
      };

      console.log("5. Response data:", JSON.stringify(data, null, 2));

      if (!data.success) {
        console.log("6. ERROR: success = false");
        setError(data.message ?? "Đăng nhập thất bại");
        return;
      }

      if (data.needRegister) {
        console.log("7. USER MỚI - Hiện modal chọn role");
        console.log("   googleUser:", data.googleUser);
        setGoogleUser(data.googleUser ?? null);
        setIdToken(response.credential);
        setShowRoleModal(true);
        setStep(1);
      } else if (data.accessToken && data.user) {
        console.log("8. USER CŨ - Redirect theo role:", data.user.role);
        console.log("   status:", data.user.status);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.status === "pending") {
          router.push("/pending");
        } else if (data.user.status === "rejected") {
          router.push("/rejected");
        } else {
          router.push(ROLE_REDIRECTS[data.user.role]);
        }
      } else {
        console.log("9. UNEXPECTED: Không có needRegister và không có user");
        setError("Phản hồi từ server không hợp lệ");
      }
    } catch (err) {
      console.log("10. CATCH ERROR:", err);
      setError("Lỗi kết nối server");
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
      setError("Thiếu thông tin đăng ký");
      return;
    }

    setIsLoading(true);
    setError(null);

    console.log("=== DEBUG REGISTER ===");
    console.log("1. idToken:", `${idToken.substring(0, 50)}...`);
    console.log("2. role:", selectedRole);
    console.log("3. profileData:", JSON.stringify(profileData, null, 2));

    try {
      // Spread profile data at root level instead of nested
      const payload = {
        idToken,
        role: selectedRole,
        ...profileData,
      };
      console.log("4. Final payload:", JSON.stringify(payload, null, 2));

      const res = await fetch(`${API_URL}/api/auth/google/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      console.log("5. Response status:", res.status);

      const data = (await res.json()) as {
        success: boolean;
        message?: string;
        accessToken?: string;
        user?: User;
      };

      console.log("6. Response data:", JSON.stringify(data, null, 2));

      if (!data.success) {
        console.log("7. ERROR: success = false, message:", data.message);
        setError(data.message ?? "Đăng ký thất bại");
        return;
      }

      if (data.accessToken && data.user) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data.user.status === "pending") {
          router.push("/pending");
        } else {
          router.push(ROLE_REDIRECTS[data.user.role]);
        }
      }
    } catch {
      setError("Lỗi kết nối server");
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

  const renderProfileForm = () => {
    if (!selectedRole) return null;

    const formProps = {
      onSubmit: handleProfileSubmit,
      isLoading,
    };

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
        {error && !showRoleModal && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-xl text-sm text-center">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <div
          className={`flex justify-center ${isLoading ? "opacity-50 pointer-events-none" : ""}`}
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
