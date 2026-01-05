"use client";

/**
 * PointsConversionSection.tsx
 *
 * ALL-IN-ONE component for points conversion
 * Contains: Modal + API calls + History table + All logic
 *
 * Easy to delete: Just remove this file + revert dashboard import
 *
 * @created 2026-01-05
 * @strategy QUICK & DIRTY - easy to remove after 2-3 months
 */

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

// ============================================================
// TYPES (INLINE - NO SEPARATE FILE)
// ============================================================
interface ConversionHistory {
  id: string;
  fromType: "ogn" | "tor";
  fromAmount: number;
  toAmount: number;
  status: "success" | "failed" | "pending";
  createdAt: string;
}

interface ProfileData {
  legacyOgn?: string | number | null;
  legacyTor?: string | number | null;
  legacyShares?: string | number | null;
}

interface Props {
  readonly profile: ProfileData | null;
  readonly onConversionSuccess: () => void;
}

// ============================================================
// CONSTANTS
// ============================================================
const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "https://pro.cdhc.vn";

// Conversion rates (1:1 for now, can be changed)
const CONVERSION_RATES = {
  ogn: 1.0, // 1 OGN = 1 CPO
  tor: 1.0, // 1 TOR = 1 CPO
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================
const getAuthHeaders = (): HeadersInit => {
  const token = localStorage.getItem("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const parseNumber = (value: string | number | null | undefined): number => {
  if (!value) return 0;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return isNaN(num) ? 0 : num;
};

const formatNumber = (value: number): string => {
  return value.toLocaleString("vi-VN");
};

const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export function PointsConversionSection({
  profile,
  onConversionSuccess,
}: Props) {
  // ===== MODAL STATE =====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [convertType, setConvertType] = useState<"ogn" | "tor">("ogn");
  const [amount, setAmount] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===== HISTORY STATE =====
  const [history, setHistory] = useState<ConversionHistory[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // ===== COMPUTED VALUES =====
  const currentOgn = parseNumber(profile?.legacyOgn);
  const currentTor = parseNumber(profile?.legacyTor);
  const currentCpo = parseNumber(profile?.legacyShares);

  const maxAmount = convertType === "ogn" ? currentOgn : currentTor;
  const inputAmount = parseNumber(amount);
  const rate = CONVERSION_RATES[convertType];
  const willReceive = inputAmount * rate;
  const remaining = maxAmount - inputAmount;
  const newCpo = currentCpo + willReceive;

  const canConvert =
    inputAmount > 0 && inputAmount <= maxAmount && !isConverting;

  // ===== LOAD HISTORY =====
  const loadHistory = useCallback(async (pageNum: number) => {
    try {
      setIsLoadingHistory(true);
      setHistoryError(null);

      const response = await fetch(
        `${API_URL}/api/points/history?page=${pageNum}&limit=10`,
        { headers: getAuthHeaders() }
      );

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          return;
        }
        throw new Error("Khong the tai lich su");
      }

      const data = await response.json();

      if (data.success) {
        setHistory(data.conversions || []);
        setPage(data.pagination?.page || 1);
        setTotalPages(data.pagination?.totalPages || 1);
      } else {
        throw new Error(data.message || "Khong the tai lich su");
      }
    } catch (err: any) {
      console.error("Failed to load history:", err);
      setHistoryError(err.message || "Khong the tai lich su");
      setHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Load history on mount
  useEffect(() => {
    loadHistory(1);
  }, [loadHistory]);

  // ===== CONVERT POINTS =====
  const handleConvert = async () => {
    setError(null);

    // Validation
    if (!amount || inputAmount <= 0) {
      setError("Vui long nhap so diem hop le");
      return;
    }

    if (inputAmount > maxAmount) {
      setError(
        `Khong du ${convertType.toUpperCase()}. Ban chi co ${formatNumber(maxAmount)}`
      );
      return;
    }

    try {
      setIsConverting(true);

      const response = await fetch(`${API_URL}/api/points/convert`, {
        method: "POST",
        headers: getAuthHeaders(),
        body: JSON.stringify({
          fromType: convertType,
          amount: inputAmount,
          idempotencyKey: crypto.randomUUID(),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem("accessToken");
          window.location.href = "/login";
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Doi diem that bai");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Doi diem that bai");
      }

      // Success
      toast.success(
        `Doi ${formatNumber(inputAmount)} ${convertType.toUpperCase()} thanh ${formatNumber(willReceive)} CPO thanh cong!`
      );

      // Reset modal
      setIsModalOpen(false);
      setAmount("");
      setConvertType("ogn");

      // Refresh data
      onConversionSuccess();
      loadHistory(1);
    } catch (err: any) {
      setError(err.message || "Doi diem that bai");
      toast.error(err.message || "Doi diem that bai");
    } finally {
      setIsConverting(false);
    }
  };

  // ===== HANDLERS =====
  const handleOpenModal = () => {
    setIsModalOpen(true);
    setError(null);
    setAmount("");
  };

  const handleCloseModal = () => {
    if (!isConverting) {
      setIsModalOpen(false);
      setError(null);
      setAmount("");
    }
  };

  const handleSetMax = () => {
    setAmount(maxAmount.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow positive numbers
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
      setError(null);
    }
  };

  // ===== DON'T RENDER IF NO LEGACY DATA =====
  if (!profile?.legacyOgn && !profile?.legacyTor) {
    return null;
  }

  // ===== RENDER =====
  return (
    <div className="space-y-6">
      {/* ========================================= */}
      {/* SECTION 1: CONVERSION CARD               */}
      {/* ========================================= */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-green-900 flex items-center gap-2">
              <span className="text-2xl">💱</span>
              Doi diem lay CPO
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Doi diem OGN hoac TOR thanh CPO voi ty le 1:1
            </p>
          </div>
          <button
            type="button"
            onClick={handleOpenModal}
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
          >
            Doi diem ngay
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Diem OGN
            </p>
            <p className="text-lg font-bold text-orange-600">
              {formatNumber(currentOgn)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              Diem TOR
            </p>
            <p className="text-lg font-bold text-pink-600">
              {formatNumber(currentTor)}
            </p>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
              So CPO
            </p>
            <p className="text-lg font-bold text-green-600">
              {formatNumber(currentCpo)}
            </p>
          </div>
        </div>
      </div>

      {/* ========================================= */}
      {/* MODAL (INLINE)                           */}
      {/* ========================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-2xl">💱</span>
                Doi diem
              </h3>
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isConverting}
                className="text-gray-400 hover:text-gray-600 text-2xl disabled:opacity-50"
              >
                ×
              </button>
            </div>

            {/* Type Selection */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Chon loai diem muon doi
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setConvertType("ogn");
                    setAmount("");
                    setError(null);
                  }}
                  disabled={isConverting || currentOgn <= 0}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    convertType === "ogn"
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 hover:border-orange-300"
                  } ${currentOgn <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="text-2xl mb-1">🔶</div>
                  <div className="font-semibold text-gray-900">Diem OGN</div>
                  <div className="text-sm text-gray-600">
                    Co: {formatNumber(currentOgn)}
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setConvertType("tor");
                    setAmount("");
                    setError(null);
                  }}
                  disabled={isConverting || currentTor <= 0}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    convertType === "tor"
                      ? "border-pink-500 bg-pink-50"
                      : "border-gray-200 hover:border-pink-300"
                  } ${currentTor <= 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="text-2xl mb-1">💎</div>
                  <div className="font-semibold text-gray-900">Diem TOR</div>
                  <div className="text-sm text-gray-600">
                    Co: {formatNumber(currentTor)}
                  </div>
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                So diem muon doi
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Nhap so diem"
                  disabled={isConverting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={handleSetMax}
                  disabled={isConverting || maxAmount <= 0}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-green-600 hover:text-green-700 font-semibold hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  Tat ca
                </button>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Toi da: {formatNumber(maxAmount)} {convertType.toUpperCase()}
              </div>
            </div>

            {/* Preview */}
            {inputAmount > 0 && (
              <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Xem truoc:
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Doi:</span>
                    <span className="font-bold text-red-600">
                      -{formatNumber(inputAmount)} {convertType.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nhan duoc:</span>
                    <span className="font-bold text-green-600">
                      +{formatNumber(willReceive)} CPO
                    </span>
                  </div>
                  <div className="border-t border-gray-300 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {convertType.toUpperCase()} con lai:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatNumber(Math.max(0, remaining))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tong CPO moi:</span>
                    <span className="font-bold text-green-700 text-lg">
                      {formatNumber(newCpo)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-5 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-start gap-2">
                <span>⚠️</span>
                <span>{error}</span>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleCloseModal}
                disabled={isConverting}
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-700 font-semibold hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Huy
              </button>
              <button
                type="button"
                onClick={handleConvert}
                disabled={!canConvert}
                className="flex-1 px-4 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all"
              >
                {isConverting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Dang xu ly...
                  </span>
                ) : (
                  "Xac nhan doi"
                )}
              </button>
            </div>

            {/* Info */}
            <div className="mt-4 text-xs text-gray-500 text-center">
              Ty le doi: 1 {convertType.toUpperCase()} = {rate} CPO
            </div>
          </div>
        </div>
      )}

      {/* ========================================= */}
      {/* SECTION 2: CONVERSION HISTORY            */}
      {/* ========================================= */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <span className="text-xl">📜</span>
          Lich su doi diem
        </h3>

        {isLoadingHistory ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3" />
            <p className="text-gray-500">Dang tai lich su...</p>
          </div>
        ) : historyError ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-3">❌ {historyError}</p>
            <button
              type="button"
              onClick={() => loadHistory(1)}
              className="px-4 py-2 text-green-600 hover:text-green-700 font-semibold"
            >
              Thu lai
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl mb-3 block">📭</span>
            <p className="text-gray-500">Chua co giao dich doi diem nao</p>
          </div>
        ) : (
          <>
            {/* Table - Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Thoi gian
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Loai
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      So diem doi
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      CPO nhan
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Trang thai
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.map((conv) => (
                    <tr key={conv.id} className="hover:bg-gray-50">
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDateTime(conv.createdAt)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            conv.fromType === "ogn"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-pink-100 text-pink-800"
                          }`}
                        >
                          {conv.fromType.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium text-red-600">
                        -{formatNumber(conv.fromAmount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-right font-medium text-green-600">
                        +{formatNumber(conv.toAmount)}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-center">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            conv.status === "success"
                              ? "bg-green-100 text-green-800"
                              : conv.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {conv.status === "success"
                            ? "Thanh cong"
                            : conv.status === "pending"
                              ? "Dang xu ly"
                              : "That bai"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Cards - Mobile */}
            <div className="md:hidden space-y-3">
              {history.map((conv) => (
                <div
                  key={conv.id}
                  className="bg-gray-50 rounded-xl p-4 border border-gray-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        conv.fromType === "ogn"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      {conv.fromType.toUpperCase()}
                    </span>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        conv.status === "success"
                          ? "bg-green-100 text-green-800"
                          : conv.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {conv.status === "success"
                        ? "Thanh cong"
                        : conv.status === "pending"
                          ? "Dang xu ly"
                          : "That bai"}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-red-600 font-medium">
                      -{formatNumber(conv.fromAmount)}{" "}
                      {conv.fromType.toUpperCase()}
                    </span>
                    <span className="text-gray-400">→</span>
                    <span className="text-green-600 font-medium">
                      +{formatNumber(conv.toAmount)} CPO
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    {formatDateTime(conv.createdAt)}
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Trang {page} / {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => loadHistory(page - 1)}
                    disabled={page === 1 || isLoadingHistory}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    ← Truoc
                  </button>
                  <button
                    type="button"
                    onClick={() => loadHistory(page + 1)}
                    disabled={page === totalPages || isLoadingHistory}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                  >
                    Sau →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
