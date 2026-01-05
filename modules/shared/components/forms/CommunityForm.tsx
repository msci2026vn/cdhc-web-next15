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
    <div className="space-y-1">
      {/* ===== LEGACY USER BANNER ===== */}
      {isLegacyUser && (
        <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200 shadow-sm mb-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">🎉</span>
            <div className="flex-1">
              <h3 className="font-bold text-green-900 text-lg mb-1">
                Chào mừng thành viên cũ quay trở lại!
              </h3>
              <p className="text-sm text-green-700 leading-relaxed">
                Hệ thống đã tự động điền thông tin của bạn từ tài khoản cũ. Vui
                lòng kiểm tra và bổ sung thông tin còn thiếu.
              </p>
            </div>
          </div>
        </div>
      )}

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

      <button
        type="button"
        onClick={handleSubmit}
        disabled={isLoading}
        className={`w-full py-3 rounded-full font-semibold text-white transition-all mt-4 ${
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
