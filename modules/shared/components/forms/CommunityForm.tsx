"use client";

import { useState } from "react";
import { toast } from "sonner";
import { COMMUNITY_INTERESTS } from "../../data/form-options";
import { LocationSelect, MultiSelectWithOther, TextField } from "../ui";

export interface CommunityFormData {
  fullName: string;
  phone?: string;
  birthDate?: string;
  province: string;
  ward: string;
  interests: string[];
  interestsOther?: string;
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
    province: initialData?.province || "",
    ward: initialData?.ward || "",
    interests: initialData?.interests || [],
    interestsOther: initialData?.interestsOther || "",
    rank: initialData?.rank,
    shares: initialData?.shares,
    f1_total: initialData?.f1_total,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CommunityFormData, string>>
  >({});

  const validateField = (
    field: keyof CommunityFormData,
    value: any
  ): string => {
    switch (field) {
      case "fullName":
        if (!value || value.trim().length < 2) {
          return "Họ và tên phải có ít nhất 2 ký tự";
        }
        break;
      case "province":
        if (!value) return "Vui lòng chọn tỉnh/thành phố";
        break;
      case "ward":
        if (!value) return "Vui lòng chọn quận/huyện/xã";
        break;
      case "interests":
        if (!value || value.length === 0) {
          return "Vui lòng chọn ít nhất 1 sản phẩm quan tâm";
        }
        break;
    }
    return "";
  };

  const handleFieldChange = (field: keyof CommunityFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field]: error || undefined }));
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CommunityFormData, string>> = {};

    // Validate all required fields
    const fullNameError = validateField("fullName", formData.fullName);
    if (fullNameError) newErrors.fullName = fullNameError;

    const provinceError = validateField("province", formData.province);
    if (provinceError) newErrors.province = provinceError;

    const wardError = validateField("ward", formData.ward);
    if (wardError) newErrors.ward = wardError;

    const interestsError = validateField("interests", formData.interests);
    if (interestsError) newErrors.interests = interestsError;

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission

    if (validate()) {
      // Clean data before submitting
      const cleanData = {
        ...formData,
        fullName: formData.fullName.trim(),
        phone: formData.phone?.trim() || undefined,
        birthDate: formData.birthDate || undefined,
        province: formData.province,
        ward: formData.ward,
        interests: formData.interests,
        interestsOther: formData.interestsOther?.trim() || undefined,
      };
      onSubmit(cleanData);
    } else {
      toast.error("Vui lòng kiểm tra lại thông tin còn thiếu");
    }
  };

  // Check if form is valid for button state
  const isFormValid = () => {
    return (
      formData.fullName.trim().length >= 2 &&
      formData.province &&
      formData.ward &&
      formData.interests.length > 0
    );
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

      {/* Validation Summary */}
      {Object.keys(errors).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600">
          <p className="font-semibold mb-1">⚠️ Vui lòng sửa các lỗi sau:</p>
          <ul className="list-disc list-inside">
            {Object.entries(errors).map(([key, msg]) =>
              msg ? <li key={key}>{msg}</li> : null
            )}
          </ul>
        </div>
      )}

      <div className="space-y-1">
        <TextField
          label="Họ và tên"
          name="fullName"
          value={formData.fullName}
          onChange={(v) => handleFieldChange("fullName", v)}
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
          value={formData.phone || ""}
          onChange={(v) => handleFieldChange("phone", v)}
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
          value={formData.birthDate || ""}
          onChange={(v) => handleFieldChange("birthDate", v)}
          disabled={isLegacyUser && !!initialData?.birthDate}
          helperText={
            isLegacyUser && !!initialData?.birthDate
              ? "📌 Thông tin từ hệ thống cũ"
              : undefined
          }
        />

        <LocationSelect
          provinceCode={formData.province}
          wardCode={formData.ward}
          onProvinceChange={(v) => {
            setFormData((prev) => ({ ...prev, province: v, ward: "" }));
            handleFieldChange("province", v);
          }}
          onWardChange={(v) => {
            handleFieldChange("ward", v);
          }}
          required
          error={errors.province || errors.ward}
        />

        <MultiSelectWithOther
          label="Sản phẩm quan tâm"
          name="interests"
          value={formData.interests}
          otherValue={formData.interestsOther || ""}
          onChange={(v) => handleFieldChange("interests", v)}
          onOtherChange={(v) =>
            setFormData((prev) => ({ ...prev, interestsOther: v }))
          }
          options={COMMUNITY_INTERESTS}
          required
          error={errors.interests}
        />
      </div>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading || (!isLegacyUser && !isFormValid())}
        className={`w-full py-3 rounded-full font-semibold text-white transition-all ${
          isLoading || (!isLegacyUser && !isFormValid())
            ? "bg-slate-300 cursor-not-allowed"
            : "gradient-primary hover:shadow-lg"
        }`}
      >
        {isLoading ? (
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
        ) : isLegacyUser ? (
          "Khôi phục tài khoản"
        ) : (
          "Hoàn tất đăng ký"
        )}
      </button>

      {!isLegacyUser && !isFormValid() && (
        <p className="text-center text-xs text-slate-500 mt-2">
          ⚠️ Vui lòng điền đầy đủ các trường bắt buộc (*)
        </p>
      )}
    </div>
  );
}
