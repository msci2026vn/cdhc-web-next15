"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  getInterestLabels,
  getProvinceName,
  getWardName,
} from "@/modules/shared";
import { LegacyDataCard } from "@/modules/shared/components/dashboard/LegacyDataCard";

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

export function CommunityDashboardClient() {
  const router = useRouter();

  // ===== STATE =====
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [provinceName, setProvinceName] = useState<string>("");
  const [wardName, setWardName] = useState<string>("");

  // ===== FETCH PROFILE DATA =====
  useEffect(() => {
    const fetchProfile = async () => {
      // Get token from localStorage
      const token = localStorage.getItem("accessToken");

      if (!token) {
        router.push("/login");
        return;
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
            // Token expired
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
      } catch (err: any) {
        console.error("Error fetching profile:", err);
        setError(err.message || "Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  // ===== FETCH LOCATION NAMES =====
  useEffect(() => {
    if (profile?.province) {
      getProvinceName(profile.province).then(setProvinceName);
    }
    if (profile?.ward) {
      getWardName(profile.ward).then(setWardName);
    }
  }, [profile?.province, profile?.ward]);

  // ===== LOADING STATE =====
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    );
  }

  // ===== ERROR STATE =====
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">❌ {error}</p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // ===== MAIN RENDER =====
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Cộng đồng
        </h1>
        <p className="text-gray-600">
          Chào mừng {profile?.fullName || "bạn"} 👋
        </p>
      </div>

      {/* Main Content */}
      <div className="space-y-6">
        {/* ===== LEGACY DATA CARD ===== */}
        <LegacyDataCard profile={profile} />

        {/* ===== REGULAR PROFILE CARD ===== */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Thông tin cá nhân
          </h2>

          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Họ và tên
              </dt>
              <dd className="text-base font-semibold text-gray-900">
                {profile?.fullName || "Chưa cập nhật"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Số điện thoại
              </dt>
              <dd className="text-base font-semibold text-gray-900">
                {profile?.phone || "Chưa cập nhật"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Tỉnh/Thành phố
              </dt>
              <dd className="text-base font-semibold text-gray-900">
                {provinceName || profile?.province || "Chưa cập nhật"}
              </dd>
            </div>

            <div>
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Xã/Phường
              </dt>
              <dd className="text-base font-semibold text-gray-900">
                {wardName || profile?.ward || "Chưa cập nhật"}
              </dd>
            </div>

            <div className="md:col-span-2">
              <dt className="text-sm font-medium text-gray-500 mb-1">
                Sản phẩm quan tâm
              </dt>
              <dd className="text-base font-semibold text-gray-900">
                {profile?.interests && profile.interests.length > 0
                  ? getInterestLabels(profile.interests).join(", ")
                  : "Chưa cập nhật"}
              </dd>
            </div>
          </dl>
        </div>

        {/* ===== PLACEHOLDER FOR FUTURE FEATURES ===== */}
        <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-200">
          <p className="text-gray-500">
            🚧 Các tính năng khác đang được phát triển...
          </p>
        </div>
      </div>
    </div>
  );
}
