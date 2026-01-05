"use client";

import { useState } from "react";
import { COMMUNITY_INTERESTS } from "../../data/form-options";
import { LocationSelect, MultiSelectWithOther, TextField } from "../ui";

export interface CommunityFormData {
  fullName: string;
  phone: string;
  birthDate: string;
  provinceCode: string;
  wardCode: string;
  interests: string[];
  interestsOther: string;
  // Legacy fields
  rank?: string;
  shares?: number;
  f1_total?: number;
}

interface CommunityFormProps {
  readonly onSubmit: (data: CommunityFormData) => void;
  readonly isLoading?: boolean;
  readonly initialData?: Partial<CommunityFormData>;
  readonly isLegacyUser?: boolean;
}

export function CommunityForm({
  onSubmit,
  isLoading = false,
  initialData,
  isLegacyUser,
}: CommunityFormProps) {
  const [formData, setFormData] = useState<CommunityFormData>({
    fullName: initialData?.fullName || "",
    phone: initialData?.phone || "",
    birthDate: initialData?.birthDate || "",
    provinceCode: initialData?.provinceCode || "",
    wardCode: initialData?.wardCode || "",
    interests: initialData?.interests || [],
    interestsOther: initialData?.interestsOther || "",
    rank: initialData?.rank,
    shares: initialData?.shares,
    f1_total: initialData?.f1_total,
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CommunityFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CommunityFormData, string>> = {};

    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.provinceCode)
      newErrors.provinceCode = "Vui lòng chọn tỉnh/thành";
    if (formData.interests.length === 0)
      newErrors.interests = "Vui lòng chọn ít nhất 1 sản phẩm quan tâm";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* ===== LEGACY USER BANNER & STATS ===== */}
      {isLegacyUser && (
        <>
          {/* Welcome Banner */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎉</span>
              <div>
                <h3 className="font-bold text-green-900 text-lg">
                  Chào mừng thành viên cũ quay trở lại!
                </h3>
                <p className="text-sm text-green-700">
                  Hệ thống đã tự động điền thông tin của bạn.
                </p>
              </div>
            </div>
          </div>

          {/* Legacy Data Display */}
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl p-5 border border-blue-200">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span className="text-xl">📊</span>
              Thông tin từ hệ thống cũ
            </h4>

            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* Rank */}
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Cấp bậc
                </p>
                <p className="text-base font-bold text-blue-900">
                  {formData.rank || "N/A"}
                </p>
              </div>

              {/* Shares */}
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Cổ phần
                </p>
                <p className="text-base font-bold text-green-600">
                  {Number(formData.shares || 0).toLocaleString("vi-VN")}
                </p>
              </div>

              {/* F1 */}
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-xs font-medium text-gray-500 uppercase mb-1">
                  Số F1
                </p>
                <p className="text-base font-bold text-purple-600">
                  {formData.f1_total || 0}
                </p>
              </div>
            </div>

            <p className="text-xs text-blue-700 flex items-start gap-1">
              <span>ℹ️</span>
              <span>Dữ liệu được tự động chuyển từ hệ thống cũ</span>
            </p>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-300"></div>

          {/* Instruction */}
          <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
            <p className="text-sm text-yellow-900 flex items-center gap-2">
              <span className="text-lg">✏️</span>
              <span className="font-medium">
                Vui lòng bổ sung thông tin còn thiếu bên dưới
              </span>
            </p>
          </div>
        </>
      )}

      <div className="space-y-1">
        <TextField
          label="Họ và tên"
          name="fullName"
          value={formData.fullName}
          onChange={(v) => {
            setFormData({ ...formData, fullName: v });
          }}
          placeholder="Nguyễn Văn A"
          required
          error={errors.fullName}
          disabled={isLegacyUser}
          helperText={
            isLegacyUser
              ? "📌 Thông tin từ hệ thống cũ (không thể thay đổi)"
              : undefined
          }
        />

        <TextField
          label="Số điện thoại"
          name="phone"
          type="tel"
          value={formData.phone}
          onChange={(v) => {
            setFormData({ ...formData, phone: v });
          }}
          placeholder="0912 345 678 (tùy chọn)"
          disabled={isLegacyUser}
          helperText={
            isLegacyUser
              ? "📌 Thông tin từ hệ thống cũ (không thể thay đổi)"
              : undefined
          }
        />

        <TextField
          label="Ngày sinh"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={(v) => {
            setFormData({ ...formData, birthDate: v });
          }}
          disabled={isLegacyUser && !!initialData?.birthDate}
          helperText={
            isLegacyUser && !!initialData?.birthDate
              ? "📌 Thông tin từ hệ thống cũ"
              : undefined
          }
        />

        <LocationSelect
          provinceCode={formData.provinceCode}
          wardCode={formData.wardCode}
          onProvinceChange={(v) => {
            setFormData({ ...formData, provinceCode: v, wardCode: "" });
          }}
          onWardChange={(v) => {
            setFormData({ ...formData, wardCode: v });
          }}
          required
          error={errors.provinceCode}
        />

        <MultiSelectWithOther
          label="Sản phẩm quan tâm"
          name="interests"
          value={formData.interests}
          otherValue={formData.interestsOther}
          onChange={(v) => {
            setFormData({ ...formData, interests: v });
          }}
          onOtherChange={(v) => {
            setFormData({ ...formData, interestsOther: v });
          }}
          options={COMMUNITY_INTERESTS}
          required
          error={errors.interests}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className={`w-full py-3 rounded-full font-semibold text-white transition-all ${
          isLoading
            ? "bg-slate-300 cursor-not-allowed"
            : "gradient-primary hover:shadow-lg"
        }`}
      >
        {isLoading
          ? "Đang xử lý..."
          : isLegacyUser
            ? "Khôi phục tài khoản"
            : "Hoàn tất đăng ký"}
      </button>
    </div>
  );
}
