"use client";

import type { ProfileData } from "@/modules/shared/lib/validation";

interface LegacyInfoCardProps {
  profile: ProfileData;
  variant?: "mobile" | "desktop";
}

const formatNumber = (value: string | number | null | undefined): string => {
  if (!value) return "0";
  const num = typeof value === "string" ? Number.parseFloat(value) : value;
  return num.toLocaleString("vi-VN");
};

export function LegacyInfoCard({
  profile,
  variant = "mobile",
}: LegacyInfoCardProps) {
  if (!profile.legacyRank) return null;

  const isMobile = variant === "mobile";

  return (
    <div className={isMobile ? "px-6 pb-6" : ""}>
      <div
        className={`${isMobile ? "border-t border-gray-100 pt-6" : "bg-gray-50 rounded-xl p-4"}`}
      >
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
  );
}
