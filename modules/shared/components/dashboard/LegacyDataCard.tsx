"use client";

import { useState } from "react";

// ===== TYPES =====
interface F1Member {
  id: string;
  n: string; // name
  p: string; // phone
}

interface LegacyDataCardProps {
  readonly profile: {
    legacyRank?: string | null;
    legacyShares?: string | null;
    legacyOgn?: string | null;
    legacyTor?: string | null;
    legacyF1Total?: number | null;
    legacyF1s?: F1Member[] | null;
  } | null;
}

// ===== COMPONENT =====
export function LegacyDataCard({ profile }: LegacyDataCardProps) {
  const [showF1List, setShowF1List] = useState(false);

  // Don't render if no legacy data
  if (!profile?.legacyRank) {
    return null;
  }

  // Format number with thousand separators
  const formatNumber = (value: string | number | null | undefined): string => {
    if (!value) return "0";
    const num = typeof value === "string" ? parseFloat(value) : value;
    return num.toLocaleString("vi-VN");
  };

  return (
    <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200 shadow-sm">
      {/* ===== HEADER ===== */}
      <div className="flex items-center gap-3 mb-6">
        <span className="text-3xl">🎖️</span>
        <div>
          <h2 className="text-xl font-bold text-blue-900">
            Thông tin từ hệ thống cũ
          </h2>
          <p className="text-sm text-blue-700">
            Dữ liệu được bảo toàn từ tài khoản trước đây
          </p>
        </div>
      </div>

      {/* ===== STATS GRID ===== */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {/* Stat 1: Rank */}
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Cấp bậc
          </p>
          <p className="text-lg md:text-xl font-bold text-blue-900 truncate">
            {profile.legacyRank}
          </p>
        </div>

        {/* Stat 2: Shares */}
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Số cổ phần
          </p>
          <p className="text-lg md:text-xl font-bold text-green-600 truncate">
            {formatNumber(profile.legacyShares)}
          </p>
        </div>

        {/* Stat 3: F1 Total */}
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Số F1
          </p>
          <p className="text-lg md:text-xl font-bold text-purple-600 truncate">
            {profile.legacyF1Total || 0}
          </p>
        </div>

        {/* Stat 4: OGN */}
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Điểm OGN
          </p>
          <p className="text-lg md:text-xl font-bold text-orange-600 truncate">
            {formatNumber(profile.legacyOgn)}
          </p>
        </div>

        {/* Stat 5: TOR */}
        <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
            Điểm TOR
          </p>
          <p className="text-lg md:text-xl font-bold text-pink-600 truncate">
            {formatNumber(profile.legacyTor)}
          </p>
        </div>
      </div>

      {/* ===== F1 LIST (EXPANDABLE) ===== */}
      {profile.legacyF1s && profile.legacyF1s.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm">
          {/* Toggle Button */}
          <button
            type="button"
            onClick={() => setShowF1List(!showF1List)}
            className="w-full flex items-center justify-between text-left hover:bg-gray-50 rounded-lg p-2 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span className="text-xl">📋</span>
              <span className="font-semibold text-gray-900">Danh sách F1</span>
              <span className="text-sm text-gray-500">
                ({profile.legacyF1s.length} thành viên)
              </span>
            </div>
            <span className="text-blue-600 font-medium">
              {showF1List ? "▼" : "▶"}
            </span>
          </button>

          {/* F1 List Content */}
          {showF1List && (
            <div className="mt-4 max-h-64 overflow-y-auto border-t pt-4">
              <ul className="space-y-3">
                {profile.legacyF1s.map((f1, index) => (
                  <li
                    key={f1.id || index}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-bold text-blue-600">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{f1.n}</p>
                        <p className="text-sm text-gray-500">{f1.p}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* ===== FOOTER NOTE ===== */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-xs text-blue-700 flex items-start gap-2">
          <span>ℹ️</span>
          <span>
            Thông tin này được tự động chuyển đổi từ hệ thống cũ. Nếu có sai
            sót, vui lòng liên hệ bộ phận hỗ trợ.
          </span>
        </p>
      </div>
    </div>
  );
}
