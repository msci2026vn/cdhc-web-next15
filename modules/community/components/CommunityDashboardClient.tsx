"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
  getInterestLabels,
  getProvinceName,
  getWardName,
} from "@/modules/shared";
import { PointsConversionSection } from "./PointsConversionSection";

// ===== TYPES =====
interface ProfileData {
  fullName: string;
  phone: string;
  birthDate: string | null;
  province: string;
  ward: string;
  interests: string[];
  interestsOther: string | null;
  // Legacy fields
  legacyRank?: string | null;
  legacyShares?: string | null;
  legacyOgn?: string | null;
  legacyTor?: string | null;
  legacyF1Total?: number | null;
  legacyF1s?: Array<{
    id: string;
    n: string;
    p: string;
  }> | null;
  createdAt: string;
  updatedAt: string;
}

// ===== HELPER FUNCTIONS =====
const formatNumber = (value: string | number | null | undefined): string => {
  if (!value) return "0";
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  return num.toLocaleString("vi-VN");
};

export function CommunityDashboardClient() {
  const router = useRouter();

  // ===== STATE =====
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provinceName, setProvinceName] = useState<string>("");
  const [wardName, setWardName] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"exchange" | "team" | "history">(
    "exchange"
  );
  const [searchTeam, setSearchTeam] = useState("");
  const [userAvatar, setUserAvatar] = useState<string | null>(null);

  // ===== FETCH PROFILE DATA =====
  const fetchProfile = useCallback(async () => {
    const token = localStorage.getItem("accessToken");

    if (!token) {
      router.push("/login");
      return;
    }

    // Get Google avatar from localStorage
    try {
      const userStr = localStorage.getItem("user");
      if (userStr) {
        const userData = JSON.parse(userStr);
        if (userData.picture) {
          setUserAvatar(userData.picture);
        }
      }
    } catch {
      // Ignore parse error
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/data`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          localStorage.removeItem("user");
          router.push("/login");
          return;
        }
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();

      if (data.success && data.profile) {
        setProfile(data.profile);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Failed to load profile";
      console.error("Error fetching profile:", err);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ===== REFRESH PROFILE (for points conversion) =====
  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile/data`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.profile) {
          setProfile(data.profile);
        }
      }
    } catch (err) {
      console.error("Error refreshing profile:", err);
    }
  }, []);

  // ===== FETCH LOCATION NAMES =====
  useEffect(() => {
    if (profile?.province) {
      getProvinceName(profile.province).then(setProvinceName);
    }
    if (profile?.ward) {
      getWardName(profile.ward).then(setWardName);
    }
  }, [profile?.province, profile?.ward]);

  // ===== FILTER F1 MEMBERS =====
  const filteredF1s =
    profile?.legacyF1s?.filter(
      (f1) =>
        f1.n.toLowerCase().includes(searchTeam.toLowerCase()) ||
        f1.p.includes(searchTeam)
    ) || [];

  // ===== LOGOUT HANDLER =====
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    router.push("/");
  };

  // ===== CONVERSION MODAL STATE (for mobile) =====
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);

  // ===== LOADING STATE =====
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-green-800 to-green-900 lg:bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white lg:border-green-600 mx-auto mb-4" />
          <p className="text-white/80 lg:text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-700 via-green-800 to-green-900 lg:bg-gray-100">
        <div className="text-center bg-white rounded-2xl p-8 shadow-2xl">
          <p className="text-red-600 mb-4">❌ {error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-green-700 text-white rounded-xl hover:bg-green-800 font-semibold transition-all"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ===== MAIN RENDER =====
  return (
    <>
      {/* ============================================== */}
      {/* MOBILE LAYOUT (< lg)                          */}
      {/* ============================================== */}
      <div className="lg:hidden min-h-screen bg-gradient-to-br from-green-700 via-green-800 to-green-900 py-6 px-4">
        <div className="max-w-lg mx-auto space-y-6">
          {/* PROFILE CARD - MOBILE */}
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            {/* Profile Header - Background Image */}
            <div
              className="h-36 bg-cover bg-center relative"
              style={{
                backgroundImage:
                  "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&q=80')",
              }}
            >
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
              <button
                type="button"
                className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors"
                title="Thêm"
              >
                <span className="text-green-700 text-xl font-light">+</span>
              </button>
            </div>

            {/* Avatar */}
            <div className="flex justify-center -mt-12 relative z-10">
              <div className="relative">
                {/* Gradient Ring */}
                <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-purple-500 p-0.5" />
                <div className="relative w-24 h-24 rounded-full border-4 border-white bg-gradient-to-br from-green-600 to-green-800 overflow-hidden shadow-xl">
                  {userAvatar ? (
                    <Image
                      src={userAvatar}
                      alt="Avatar"
                      width={96}
                      height={96}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white text-3xl font-bold">
                      {profile?.fullName?.charAt(0) || "U"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Profile Info */}
            <div className="text-center px-6 pt-4 pb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                {profile?.fullName || "Thành viên CDHC"}
              </h2>
              <p className="text-gray-500 text-sm mb-6">
                Thành viên cộng đồng nông nghiệp hữu cơ Con Đường Hữu Cơ
              </p>

              {/* Stats Row */}
              <div className="flex justify-around mb-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {formatNumber(profile?.legacyShares)}
                  </div>
                  <div className="text-xs text-gray-500">CPO</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {profile?.legacyF1Total || 0}
                  </div>
                  <div className="text-xs text-gray-500">Đồng đội</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">
                    {formatNumber(
                      (Number(profile?.legacyOgn) || 0) +
                        (Number(profile?.legacyTor) || 0)
                    )}
                  </div>
                  <div className="text-xs text-gray-500">Tổng điểm</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-green-100 hover:text-green-700 transition-all"
                  title="Instagram"
                >
                  📷
                </button>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-green-100 hover:text-green-700 transition-all"
                  title="X"
                >
                  𝕏
                </button>
                <button
                  type="button"
                  className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center hover:bg-green-100 hover:text-green-700 transition-all"
                  title="Link"
                >
                  🔗
                </button>
              </div>
            </div>

            {/* Old System Info */}
            {profile?.legacyRank && (
              <div className="px-6 pb-6">
                <div className="border-t border-gray-100 pt-6">
                  <div className="text-center mb-4">
                    <div className="text-sm font-semibold text-gray-700">
                      Thông tin từ hệ thống cũ
                    </div>
                    <div className="text-xs text-gray-400">
                      Dữ liệu được bảo toàn từ tài khoản trước đây
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    {/* Rank - Full Width */}
                    <div className="col-span-3 bg-gradient-to-r from-green-700 to-green-800 rounded-xl p-3 text-center">
                      <div className="text-xs text-white/80 uppercase tracking-wide">
                        Cấp bậc
                      </div>
                      <div className="text-lg font-bold text-white">
                        {profile.legacyRank}
                      </div>
                    </div>

                    {/* CPO */}
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                        Số CPO
                      </div>
                      <div className="text-base font-bold text-green-600">
                        {formatNumber(profile.legacyShares)}
                      </div>
                    </div>

                    {/* OGN */}
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                        Điểm OGN
                      </div>
                      <div className="text-base font-bold text-orange-500">
                        {formatNumber(profile.legacyOgn)}
                      </div>
                    </div>

                    {/* TOR */}
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="text-[10px] text-gray-500 uppercase tracking-wide">
                        Điểm TOR
                      </div>
                      <div className="text-base font-bold text-pink-600">
                        {formatNumber(profile.legacyTor)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* DASHBOARD HEADER - MOBILE */}
          <div className="text-white">
            <h1 className="text-2xl font-bold">Dashboard Cộng đồng</h1>
            <p className="text-white/80">
              Chào mừng {profile?.fullName || "bạn"} 👋
            </p>
          </div>

          {/* TABS CONTAINER - MOBILE */}
          <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
            {/* Tabs Navigation */}
            <div className="flex bg-gray-50 p-2 gap-2">
              <button
                type="button"
                onClick={() => setActiveTab("exchange")}
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
                  activeTab === "exchange"
                    ? "bg-white shadow-md text-green-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">🔄</span>
                <span className="text-xs font-semibold">Đổi điểm</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("team")}
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
                  activeTab === "team"
                    ? "bg-white shadow-md text-green-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">👥</span>
                <span className="text-xs font-semibold">DS Đồng đội</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("history")}
                className={`flex-1 flex flex-col items-center gap-1 py-3 px-2 rounded-xl transition-all ${
                  activeTab === "history"
                    ? "bg-white shadow-md text-green-700"
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <span className="text-xl">📋</span>
                <span className="text-xs font-semibold">Lịch sử</span>
              </button>
            </div>

            {/* Tab Content */}
            <div className="p-5">
              {/* Exchange Tab */}
              {activeTab === "exchange" && (
                <div className="animate-fadeIn">
                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-200">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      <div>
                        <div className="text-2xl mb-2">🔄</div>
                        <h3 className="text-lg font-bold text-green-800">
                          Đổi điểm lấy CPO
                        </h3>
                        <p className="text-sm text-green-600">
                          Đổi điểm OGN hoặc TOR thành CPO với tỷ lệ 1:1
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsConversionModalOpen(true)}
                        className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all shadow-lg hover:shadow-xl whitespace-nowrap"
                      >
                        Đổi điểm ngay
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Team Tab */}
              {activeTab === "team" && (
                <div className="animate-fadeIn">
                  {/* Team Stats */}
                  <div className="grid grid-cols-3 gap-3 mb-5">
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-500">Tổng số</div>
                      <div className="text-xl font-bold text-green-700">
                        {profile?.legacyF1Total || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-500">Hoạt động</div>
                      <div className="text-xl font-bold text-green-600">
                        {profile?.legacyF1s?.length || 0}
                      </div>
                    </div>
                    <div className="bg-gray-50 rounded-xl p-3 text-center">
                      <div className="text-xs text-gray-500">Mới tháng này</div>
                      <div className="text-xl font-bold text-orange-500">0</div>
                    </div>
                  </div>

                  {/* Search */}
                  <input
                    type="text"
                    placeholder="🔍 Tìm kiếm đồng đội..."
                    value={searchTeam}
                    onChange={(e) => setSearchTeam(e.target.value)}
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-5 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                  />

                  {/* Team Members List */}
                  <div className="min-h-[200px]">
                    {profile?.legacyF1s && profile.legacyF1s.length > 0 ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {filteredF1s.map((f1, index) => (
                          <div
                            key={f1.id || index}
                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                          >
                            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-semibold">
                              {f1.n.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-gray-900">
                                {f1.n}
                              </div>
                              <div className="text-xs text-gray-500">
                                {f1.p}
                              </div>
                            </div>
                          </div>
                        ))}
                        {filteredF1s.length === 0 && searchTeam && (
                          <div className="text-center py-8 text-gray-400">
                            Không tìm thấy đồng đội nào
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <div className="text-5xl mb-4 opacity-30">👥</div>
                        <div className="text-gray-500 mb-1">
                          Chưa có đồng đội nào
                        </div>
                        <div className="text-xs text-gray-400">
                          Mời bạn bè tham gia để xây dựng đội nhóm của bạn
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* History Tab */}
              {activeTab === "history" && (
                <div className="animate-fadeIn">
                  <PointsConversionSection
                    profile={profile}
                    onConversionSuccess={refreshProfile}
                    showOnlyHistory
                  />
                </div>
              )}
            </div>
          </div>

          {/* PERSONAL INFO CARD - MOBILE */}
          <div className="bg-white rounded-3xl shadow-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4">
              Thông tin cá nhân
            </h3>

            <dl className="grid grid-cols-2 gap-4">
              <div>
                <dt className="text-xs text-gray-500 mb-1">Họ và tên</dt>
                <dd className="font-semibold text-gray-900">
                  {profile?.fullName || "Chưa cập nhật"}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-gray-500 mb-1">Số điện thoại</dt>
                <dd className="font-semibold text-gray-900">
                  {profile?.phone || "Chưa cập nhật"}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-gray-500 mb-1">Tỉnh/Thành phố</dt>
                <dd className="font-semibold text-gray-900">
                  {provinceName || profile?.province || "Chưa cập nhật"}
                </dd>
              </div>

              <div>
                <dt className="text-xs text-gray-500 mb-1">Xã/Phường</dt>
                <dd className="font-semibold text-gray-900">
                  {wardName || profile?.ward || "Chưa cập nhật"}
                </dd>
              </div>

              <div className="col-span-2">
                <dt className="text-xs text-gray-500 mb-1">
                  Sản phẩm quan tâm
                </dt>
                <dd className="font-semibold text-gray-900">
                  {profile?.interests && profile.interests.length > 0
                    ? getInterestLabels(profile.interests).join(", ")
                    : "Chưa cập nhật"}
                </dd>
              </div>
            </dl>
          </div>

          {/* LOGOUT BUTTON - MOBILE */}
          <button
            type="button"
            onClick={handleLogout}
            className="w-full py-4 bg-white/10 backdrop-blur-sm border-2 border-white/30 rounded-2xl text-white font-semibold hover:bg-white/20 hover:border-white/50 transition-all flex items-center justify-center gap-3 group"
          >
            <svg
              className="w-5 h-5 group-hover:translate-x-[-4px] transition-transform"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              role="img"
              aria-hidden="true"
            >
              <title>Đăng xuất</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Đăng xuất
          </button>

          {/* Points Conversion Modal (for mobile) */}
          <PointsConversionSection
            profile={profile}
            onConversionSuccess={refreshProfile}
            externalModalOpen={isConversionModalOpen}
            onExternalModalClose={() => setIsConversionModalOpen(false)}
          />
        </div>

        {/* Animation Style */}
        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(10px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out;
          }
        `}</style>
      </div>

      {/* ============================================== */}
      {/* DESKTOP LAYOUT (>= lg)                        */}
      {/* ============================================== */}
      <div className="hidden lg:block min-h-screen bg-gray-100">
        {/* Hero Banner with Background Image */}
        <div
          className="h-48 bg-cover bg-center relative"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-8 max-w-7xl">
              <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
                Dashboard Cộng đồng
              </h1>
              <p className="text-white/90 text-lg drop-shadow">
                Chào mừng {profile?.fullName || "bạn"} 👋
              </p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-8 py-8 max-w-7xl -mt-12 relative z-10">
          {/* Main Content - 2 Columns */}
          <div className="grid grid-cols-3 gap-8">
            {/* LEFT COLUMN - Profile & Legacy Data */}
            <div className="space-y-6">
              {/* Profile Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <div className="flex items-center gap-4 mb-6">
                  <div className="relative">
                    <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 to-purple-500 p-0.5" />
                    <div className="relative w-20 h-20 rounded-full border-4 border-white bg-gradient-to-br from-green-600 to-green-800 overflow-hidden shadow-lg">
                      {userAvatar ? (
                        <Image
                          src={userAvatar}
                          alt="Avatar"
                          width={80}
                          height={80}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                          unoptimized
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-2xl font-bold">
                          {profile?.fullName?.charAt(0) || "U"}
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {profile?.fullName || "Thành viên CDHC"}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Thành viên cộng đồng CDHC
                    </p>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-gray-900">
                      {formatNumber(profile?.legacyShares)}
                    </div>
                    <div className="text-xs text-gray-500">CPO</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-gray-900">
                      {profile?.legacyF1Total || 0}
                    </div>
                    <div className="text-xs text-gray-500">Đồng đội</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-xl">
                    <div className="text-lg font-bold text-gray-900">
                      {formatNumber(
                        (Number(profile?.legacyOgn) || 0) +
                          (Number(profile?.legacyTor) || 0)
                      )}
                    </div>
                    <div className="text-xs text-gray-500">Tổng điểm</div>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-all flex items-center justify-center gap-2"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    role="img"
                    aria-hidden="true"
                  >
                    <title>Đăng xuất</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  Đăng xuất
                </button>
              </div>

              {/* Legacy Data Card */}
              {profile?.legacyRank && (
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-2xl">🎖️</span>
                    <div>
                      <h3 className="font-bold text-blue-900">
                        Thông tin hệ thống cũ
                      </h3>
                      <p className="text-xs text-blue-700">
                        Dữ liệu được bảo toàn
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="bg-white rounded-xl p-3 shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">Cấp bậc</div>
                      <div className="font-bold text-blue-900">
                        {profile.legacyRank}
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div className="bg-white rounded-xl p-3 shadow-sm text-center">
                        <div className="text-xs text-gray-500 mb-1">CPO</div>
                        <div className="font-bold text-green-600">
                          {formatNumber(profile.legacyShares)}
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-3 shadow-sm text-center">
                        <div className="text-xs text-gray-500 mb-1">OGN</div>
                        <div className="font-bold text-orange-600">
                          {formatNumber(profile.legacyOgn)}
                        </div>
                      </div>
                      <div className="bg-white rounded-xl p-3 shadow-sm text-center">
                        <div className="text-xs text-gray-500 mb-1">TOR</div>
                        <div className="font-bold text-pink-600">
                          {formatNumber(profile.legacyTor)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Info Card */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Thông tin cá nhân
                </h3>

                <dl className="space-y-4">
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">Họ và tên</dt>
                    <dd className="font-semibold text-gray-900">
                      {profile?.fullName || "Chưa cập nhật"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">
                      Số điện thoại
                    </dt>
                    <dd className="font-semibold text-gray-900">
                      {profile?.phone || "Chưa cập nhật"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">
                      Tỉnh/Thành phố
                    </dt>
                    <dd className="font-semibold text-gray-900">
                      {provinceName || profile?.province || "Chưa cập nhật"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">Xã/Phường</dt>
                    <dd className="font-semibold text-gray-900">
                      {wardName || profile?.ward || "Chưa cập nhật"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-gray-500 mb-1">
                      Sản phẩm quan tâm
                    </dt>
                    <dd className="font-semibold text-gray-900">
                      {profile?.interests && profile.interests.length > 0
                        ? getInterestLabels(profile.interests).join(", ")
                        : "Chưa cập nhật"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* RIGHT COLUMN - Main Content (2 cols wide) */}
            <div className="col-span-2 space-y-6">
              {/* Points Conversion Section */}
              <PointsConversionSection
                profile={profile}
                onConversionSuccess={refreshProfile}
              />

              {/* Team List */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-xl">👥</span>
                  Danh sách đồng đội
                </h3>

                {/* Team Stats */}
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-700">
                      {profile?.legacyF1Total || 0}
                    </div>
                    <div className="text-sm text-gray-500">Tổng số</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {profile?.legacyF1s?.length || 0}
                    </div>
                    <div className="text-sm text-gray-500">Hoạt động</div>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <div className="text-2xl font-bold text-orange-500">0</div>
                    <div className="text-sm text-gray-500">Mới tháng này</div>
                  </div>
                </div>

                {/* Search */}
                <input
                  type="text"
                  placeholder="🔍 Tìm kiếm đồng đội..."
                  value={searchTeam}
                  onChange={(e) => setSearchTeam(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl mb-6 focus:border-green-600 focus:ring-2 focus:ring-green-200 transition-all outline-none"
                />

                {/* Team Members List */}
                {profile?.legacyF1s && profile.legacyF1s.length > 0 ? (
                  <div className="grid grid-cols-2 gap-3 max-h-96 overflow-y-auto">
                    {filteredF1s.map((f1, index) => (
                      <div
                        key={f1.id || index}
                        className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-green-800 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {f1.n.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">
                            {f1.n}
                          </div>
                          <div className="text-sm text-gray-500">{f1.p}</div>
                        </div>
                      </div>
                    ))}
                    {filteredF1s.length === 0 && searchTeam && (
                      <div className="col-span-2 text-center py-8 text-gray-400">
                        Không tìm thấy đồng đội nào
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-5xl mb-4 opacity-30">👥</div>
                    <div className="text-gray-500 mb-1">
                      Chưa có đồng đội nào
                    </div>
                    <div className="text-sm text-gray-400">
                      Mời bạn bè tham gia để xây dựng đội nhóm của bạn
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
