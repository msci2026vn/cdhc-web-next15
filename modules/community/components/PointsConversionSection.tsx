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
 * @updated 2026-01-05 - Fixed: Vietnamese diacritics, status display, collapse UI
 * @strategy QUICK & DIRTY - easy to remove after 2-3 months
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { parsePointsHistoryResponse } from "@/modules/shared";

// ============================================================
// TYPES (INLINE - NO SEPARATE FILE)
// ============================================================
interface ConversionHistory {
  id: string;
  fromType: "ogn" | "tor";
  fromAmount: number;
  toAmount: number;
  status: string; // Can be 'success', 'failed', 'pending', or undefined
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
  readonly showOnlyHistory?: boolean;
  readonly externalModalOpen?: boolean;
  readonly onExternalModalClose?: () => void;
  readonly showOnlyModal?: boolean;
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
const parseNumber = (value: string | number | null | undefined): number => {
  if (!value) return 0;
  const num = typeof value === "string" ? parseFloat(value) : value;
  return Number.isNaN(num) ? 0 : num;
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

/**
 * FIX #2: Normalize status để handle edge cases
 * Default to 'success' nếu status undefined/null/empty
 */
const getStatusDisplay = (status: string | undefined | null) => {
  const normalizedStatus = (status || "success").toLowerCase().trim();
  const isSuccess = normalizedStatus === "success";
  const isPending = normalizedStatus === "pending";

  return {
    isSuccess,
    isPending,
    bgClass: isSuccess
      ? "bg-green-100 text-green-800"
      : isPending
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800",
    label: isSuccess ? "Thành công" : isPending ? "Đang xử lý" : "Thất bại",
  };
};

// ============================================================
// MAIN COMPONENT
// ============================================================
export function PointsConversionSection({
  profile,
  onConversionSuccess,
  showOnlyHistory = false,
  externalModalOpen = false,
  onExternalModalClose,
  showOnlyModal = false,
}: Props) {
  // ===== MODAL STATE =====
  const [internalModalOpen, setInternalModalOpen] = useState(false);

  // Combine internal and external modal state
  const isModalOpen = internalModalOpen || externalModalOpen;

  const setIsModalOpen = (open: boolean) => {
    setInternalModalOpen(open);
    if (!open && onExternalModalClose) {
      onExternalModalClose();
    }
  };
  const [convertType, setConvertType] = useState<"ogn" | "tor">("ogn");
  const [amount, setAmount] = useState("");
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ===== FIX #3: COLLAPSE STATE =====
  const [isSectionExpanded, setIsSectionExpanded] = useState(false);

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

  // ===== ABORT CONTROLLER REF =====
  const abortControllerRef = useRef<AbortController | null>(null);

  // ===== LOAD HISTORY =====
  const loadHistory = useCallback(async (pageNum: number) => {
    // Cancel previous request if any
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setIsLoadingHistory(true);
      setHistoryError(null);

      const response = await fetch(
        `${API_URL}/api/points/history?page=${pageNum}&limit=5`,
        {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }
        throw new Error("Không thể tải lịch sử");
      }

      const rawData = await response.json();
      const LIMIT = 5;

      // Validate API response with Zod schema
      const data = parsePointsHistoryResponse(rawData);

      if (data.success) {
        const conversions = data.conversions;
        setHistory(conversions);
        setPage(data.pagination?.page || pageNum);

        // Workaround: If backend returns totalPages=1 but we got exactly LIMIT items,
        // assume there might be more pages (allow user to try next page)
        const backendTotalPages = data.pagination?.totalPages || 1;
        const hasMorePages = conversions.length === LIMIT;

        // If we got full page of results, assume at least one more page exists
        if (backendTotalPages === 1 && hasMorePages && pageNum === 1) {
          setTotalPages(pageNum + 1); // Allow navigating to next page
        } else if (conversions.length === LIMIT) {
          // If we got full page, there might be more
          setTotalPages(Math.max(backendTotalPages, pageNum + 1));
        } else {
          // Got less than LIMIT, this is the last page
          setTotalPages(pageNum);
        }
      } else {
        throw new Error(data.error || "Không thể tải lịch sử");
      }
    } catch (err: unknown) {
      // Ignore abort errors
      if (err instanceof Error && err.name === "AbortError") {
        return;
      }
      const message =
        err instanceof Error ? err.message : "Không thể tải lịch sử";
      console.error("Failed to load history:", err);
      setHistoryError(message);
      setHistory([]);
    } finally {
      setIsLoadingHistory(false);
    }
  }, []);

  // Load history on mount and cleanup on unmount
  useEffect(() => {
    loadHistory(1);

    // Cleanup: abort any pending request on unmount
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [loadHistory]);

  // ===== CONVERT POINTS =====
  const handleConvert = async () => {
    setError(null);

    // Validation
    if (!amount || inputAmount <= 0) {
      setError("Vui lòng nhập số điểm hợp lệ");
      return;
    }

    if (inputAmount > maxAmount) {
      setError(
        `Không đủ ${convertType.toUpperCase()}. Bạn chỉ có ${formatNumber(maxAmount)}`
      );
      return;
    }

    try {
      setIsConverting(true);

      const response = await fetch(`${API_URL}/api/points/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          fromType: convertType,
          amount: inputAmount,
          idempotencyKey: crypto.randomUUID(),
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          window.location.href = "/login";
          return;
        }

        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Đổi điểm thất bại");
      }

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Đổi điểm thất bại");
      }

      // Success - FIX #1: Vietnamese with diacritics
      toast.success(
        `Đổi ${formatNumber(inputAmount)} ${convertType.toUpperCase()} thành ${formatNumber(willReceive)} CPO thành công!`
      );

      // Reset modal
      setIsModalOpen(false);
      setAmount("");
      setConvertType("ogn");

      // Refresh data
      onConversionSuccess();
      loadHistory(1);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Đổi điểm thất bại";
      setError(message);
      toast.error(message);
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

  // Ref for timeout cleanup
  const expandTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (expandTimeoutRef.current) {
        clearTimeout(expandTimeoutRef.current);
      }
    };
  }, []);

  // FIX #3: Handle button click - expand section and open modal
  const handleConvertButtonClick = () => {
    if (!isSectionExpanded) {
      setIsSectionExpanded(true);
      // Delay modal open để section expand trước
      // Clear previous timeout if any
      if (expandTimeoutRef.current) {
        clearTimeout(expandTimeoutRef.current);
      }
      expandTimeoutRef.current = setTimeout(() => {
        handleOpenModal();
      }, 300);
    } else {
      handleOpenModal();
    }
  };

  // ===== DON'T RENDER IF NO LEGACY DATA =====
  if (!profile?.legacyOgn && !profile?.legacyTor) {
    // Still show history if showOnlyHistory
    if (showOnlyHistory) {
      return (
        <div className="text-center py-10">
          <span className="text-4xl mb-3 block">📭</span>
          <p className="text-gray-500">Chưa có giao dịch đổi điểm nào</p>
        </div>
      );
    }
    // Modal-only mode still needs to render modal
    if (showOnlyModal) {
      return null;
    }
    return null;
  }

  // ===== SHOW ONLY MODAL MODE (for mobile - just render modal, no inline content) =====
  if (showOnlyModal) {
    return (
      <>
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <span className="text-2xl">💱</span>
                  Đổi điểm
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
                  Chọn loại điểm muốn đổi
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
                    <div className="font-semibold text-gray-900">Điểm OGN</div>
                    <div className="text-sm text-gray-600">
                      Có: {formatNumber(currentOgn)}
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
                    <div className="font-semibold text-gray-900">Điểm TOR</div>
                    <div className="text-sm text-gray-600">
                      Có: {formatNumber(currentTor)}
                    </div>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Số điểm muốn đổi
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={handleAmountChange}
                    placeholder="Nhập số điểm"
                    disabled={isConverting}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                  />
                  <button
                    type="button"
                    onClick={handleSetMax}
                    disabled={isConverting || maxAmount <= 0}
                    className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-green-600 hover:text-green-700 font-semibold hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                  >
                    Tất cả
                  </button>
                </div>
                <div className="mt-1 text-xs text-gray-500">
                  Tối đa: {formatNumber(maxAmount)} {convertType.toUpperCase()}
                </div>
              </div>

              {/* Preview */}
              {inputAmount > 0 && (
                <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <div className="text-sm font-medium text-gray-700 mb-3">
                    Xem trước:
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Đổi:</span>
                      <span className="font-bold text-red-600">
                        -{formatNumber(inputAmount)} {convertType.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Nhận được:</span>
                      <span className="font-bold text-green-600">
                        +{formatNumber(willReceive)} CPO
                      </span>
                    </div>
                    <div className="border-t border-gray-300 my-2" />
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">
                        {convertType.toUpperCase()} còn lại:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatNumber(Math.max(0, remaining))}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tổng CPO mới:</span>
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
                  Hủy
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
                      Đang xử lý...
                    </span>
                  ) : (
                    "Xác nhận đổi"
                  )}
                </button>
              </div>

              {/* Info */}
              <div className="mt-4 text-xs text-gray-500 text-center">
                Tỷ lệ đổi: 1 {convertType.toUpperCase()} = {rate} CPO
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // ===== SHOW ONLY HISTORY MODE =====
  if (showOnlyHistory) {
    return (
      <div>
        {isLoadingHistory ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-700 mx-auto mb-3" />
            <p className="text-gray-500">Đang tải lịch sử...</p>
          </div>
        ) : historyError ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-3">❌ {historyError}</p>
            <button
              type="button"
              onClick={() => loadHistory(1)}
              className="px-4 py-2 text-green-700 hover:text-green-800 font-semibold"
            >
              Thử lại
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-10">
            <span className="text-4xl mb-3 block">📭</span>
            <p className="text-gray-500">Chưa có giao dịch đổi điểm nào</p>
          </div>
        ) : (
          <div className="space-y-3">
            {history.map((conv) => {
              const statusDisplay = getStatusDisplay(conv.status);

              return (
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
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusDisplay.bgClass}`}
                    >
                      {statusDisplay.label}
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
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <div className="text-xs text-gray-500">
                  Trang {page} / {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => loadHistory(page - 1)}
                    disabled={page === 1 || isLoadingHistory}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    ←
                  </button>
                  <button
                    type="button"
                    onClick={() => loadHistory(page + 1)}
                    disabled={page === totalPages || isLoadingHistory}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
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
              Đổi điểm lấy CPO
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Đổi điểm OGN hoặc TOR thành CPO với tỷ lệ 1:1
            </p>
          </div>
          <button
            type="button"
            onClick={handleConvertButtonClick}
            data-conversion-btn
            className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
          >
            Đổi điểm ngay
          </button>
        </div>

        {/* FIX #3: Quick Stats - Chỉ hiển thị khi expanded */}
        {isSectionExpanded && (
          <div className="grid grid-cols-3 gap-4 mt-6 transition-all duration-300 ease-in-out">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Điểm OGN
              </p>
              <p className="text-lg font-bold text-orange-600">
                {formatNumber(currentOgn)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Điểm TOR
              </p>
              <p className="text-lg font-bold text-pink-600">
                {formatNumber(currentTor)}
              </p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1">
                Số CPO
              </p>
              <p className="text-lg font-bold text-green-600">
                {formatNumber(currentCpo)}
              </p>
            </div>
          </div>
        )}
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
                Đổi điểm
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
                Chọn loại điểm muốn đổi
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
                  <div className="font-semibold text-gray-900">Điểm OGN</div>
                  <div className="text-sm text-gray-600">
                    Có: {formatNumber(currentOgn)}
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
                  <div className="font-semibold text-gray-900">Điểm TOR</div>
                  <div className="text-sm text-gray-600">
                    Có: {formatNumber(currentTor)}
                  </div>
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Số điểm muốn đổi
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="Nhập số điểm"
                  disabled={isConverting}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 disabled:bg-gray-100"
                />
                <button
                  type="button"
                  onClick={handleSetMax}
                  disabled={isConverting || maxAmount <= 0}
                  className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1 text-sm text-green-600 hover:text-green-700 font-semibold hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                >
                  Tất cả
                </button>
              </div>
              <div className="mt-1 text-xs text-gray-500">
                Tối đa: {formatNumber(maxAmount)} {convertType.toUpperCase()}
              </div>
            </div>

            {/* Preview */}
            {inputAmount > 0 && (
              <div className="mb-5 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="text-sm font-medium text-gray-700 mb-3">
                  Xem trước:
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Đổi:</span>
                    <span className="font-bold text-red-600">
                      -{formatNumber(inputAmount)} {convertType.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Nhận được:</span>
                    <span className="font-bold text-green-600">
                      +{formatNumber(willReceive)} CPO
                    </span>
                  </div>
                  <div className="border-t border-gray-300 my-2" />
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">
                      {convertType.toUpperCase()} còn lại:
                    </span>
                    <span className="font-semibold text-gray-900">
                      {formatNumber(Math.max(0, remaining))}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Tổng CPO mới:</span>
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
                Hủy
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
                    Đang xử lý...
                  </span>
                ) : (
                  "Xác nhận đổi"
                )}
              </button>
            </div>

            {/* Info */}
            <div className="mt-4 text-xs text-gray-500 text-center">
              Tỷ lệ đổi: 1 {convertType.toUpperCase()} = {rate} CPO
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
          Lịch sử đổi điểm
        </h3>

        {isLoadingHistory ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto mb-3" />
            <p className="text-gray-500">Đang tải lịch sử...</p>
          </div>
        ) : historyError ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-3">❌ {historyError}</p>
            <button
              type="button"
              onClick={() => loadHistory(1)}
              className="px-4 py-2 text-green-600 hover:text-green-700 font-semibold"
            >
              Thử lại
            </button>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <span className="text-4xl mb-3 block">📭</span>
            <p className="text-gray-500">Chưa có giao dịch đổi điểm nào</p>
          </div>
        ) : (
          <>
            {/* Table - Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Thời gian
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Loại
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Số điểm đổi
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      CPO nhận
                    </th>
                    <th className="px-4 py-3 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Trạng thái
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {history.map((conv) => {
                    // FIX #2: Use helper function for status
                    const statusDisplay = getStatusDisplay(conv.status);

                    return (
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
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusDisplay.bgClass}`}
                          >
                            {statusDisplay.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Cards - Mobile */}
            <div className="md:hidden space-y-3">
              {history.map((conv) => {
                // FIX #2: Use helper function for status
                const statusDisplay = getStatusDisplay(conv.status);

                return (
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
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusDisplay.bgClass}`}
                      >
                        {statusDisplay.label}
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
                );
              })}
            </div>

            {/* Pagination - Always show when there's history */}
            <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
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
                  ← Trước
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
          </>
        )}
      </div>
    </div>
  );
}
