"use client";

import { useState } from "react";
import {
  CERTIFICATE_TYPES,
  FARM_SIZE_OPTIONS,
  FARM_TYPE_OPTIONS,
  FARMER_PRODUCTS,
} from "../../data/form-options";
import {
  LocationSelect,
  MultiSelect,
  MultiSelectWithOther,
  RadioField,
  SelectWithOther,
  TextField,
} from "../ui";

export interface FarmerFormData {
  fullName: string;
  phone: string;
  birthDate: string;
  province: string;
  ward: string;
  address: string;
  farmSize: string;
  farmType: string[];
  mainProducts: string[];
  mainProductsOther: string;
  hasCertificate: string;
  certificateType: string;
  certificateTypeOther: string;
}

interface FarmerFormProps {
  readonly onSubmit: (data: FarmerFormData) => void;
  readonly isLoading?: boolean;
  readonly initialData?: Partial<FarmerFormData>;
  readonly isLegacyUser?: boolean;
}

export function FarmerForm({
  onSubmit,
  isLoading = false,
  initialData,
  isLegacyUser,
}: FarmerFormProps) {
  const [formData, setFormData] = useState<FarmerFormData>({
    fullName: initialData?.fullName || "",
    phone: initialData?.phone || "",
    birthDate: initialData?.birthDate || "",
    province: initialData?.province || "",
    ward: initialData?.ward || "",
    address: initialData?.address || "",
    farmSize: initialData?.farmSize || "",
    farmType: initialData?.farmType || [],
    mainProducts: initialData?.mainProducts || [],
    mainProductsOther: initialData?.mainProductsOther || "",
    hasCertificate: initialData?.hasCertificate || "",
    certificateType: initialData?.certificateType || "",
    certificateTypeOther: initialData?.certificateTypeOther || "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FarmerFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FarmerFormData, string>> = {};

    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.province) newErrors.province = "Vui lòng chọn tỉnh/thành";
    if (!formData.farmSize) newErrors.farmSize = "Vui lòng chọn quy mô";
    if (formData.farmType.length === 0)
      newErrors.farmType = "Vui lòng chọn loại hình";
    if (formData.mainProducts.length === 0)
      newErrors.mainProducts = "Vui lòng chọn ít nhất 1 sản phẩm";
    if (!formData.hasCertificate)
      newErrors.hasCertificate = "Vui lòng chọn tình trạng chứng nhận";
    if (formData.hasCertificate === "yes" && !formData.certificateType)
      newErrors.certificateType = "Vui lòng chọn loại chứng nhận";

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
        placeholder="0912 345 678"
        required
        error={errors.phone}
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
        provinceCode={formData.province}
        wardCode={formData.ward}
        onProvinceChange={(v) => {
          setFormData({ ...formData, province: v, ward: "" });
        }}
        onWardChange={(v) => {
          setFormData({ ...formData, ward: v });
        }}
        required
        error={errors.province}
      />

      <TextField
        label="Địa chỉ chi tiết"
        name="address"
        value={formData.address}
        onChange={(v) => {
          setFormData({ ...formData, address: v });
        }}
        placeholder="Số nhà, thôn/ấp..."
      />

      <SelectWithOther
        label="Quy mô canh tác"
        name="farmSize"
        value={formData.farmSize}
        otherValue=""
        onChange={(v) => {
          setFormData({ ...formData, farmSize: v });
        }}
        onOtherChange={() => {}}
        options={FARM_SIZE_OPTIONS}
        required
        error={errors.farmSize}
      />

      <MultiSelect
        label="Loại hình sản xuất"
        name="farmType"
        value={formData.farmType}
        onChange={(v) => {
          setFormData({ ...formData, farmType: v });
        }}
        options={FARM_TYPE_OPTIONS}
        required
        error={errors.farmType}
      />

      <MultiSelectWithOther
        label="Sản phẩm chính"
        name="mainProducts"
        value={formData.mainProducts}
        otherValue={formData.mainProductsOther}
        onChange={(v) => {
          setFormData({ ...formData, mainProducts: v });
        }}
        onOtherChange={(v) => {
          setFormData({ ...formData, mainProductsOther: v });
        }}
        options={FARMER_PRODUCTS}
        required
        maxSelect={5}
        error={errors.mainProducts}
      />

      <RadioField
        label="Chứng nhận hữu cơ"
        name="hasCertificate"
        value={formData.hasCertificate}
        onChange={(v) => {
          setFormData({
            ...formData,
            hasCertificate: v,
            certificateType: v === "no" ? "" : formData.certificateType,
            certificateTypeOther:
              v === "no" ? "" : formData.certificateTypeOther,
          });
        }}
        options={[
          { value: "yes", label: "Có" },
          { value: "no", label: "Chưa có" },
        ]}
        required
        error={errors.hasCertificate}
      />

      {formData.hasCertificate === "yes" && (
        <SelectWithOther
          label="Loại chứng nhận"
          name="certificateType"
          value={formData.certificateType}
          otherValue={formData.certificateTypeOther}
          onChange={(v) => {
            setFormData({ ...formData, certificateType: v });
          }}
          onOtherChange={(v) => {
            setFormData({ ...formData, certificateTypeOther: v });
          }}
          options={CERTIFICATE_TYPES}
          required
          error={errors.certificateType}
        />
      )}

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
