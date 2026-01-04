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
  RadioField,
  SelectField,
  TextField,
} from "../ui";

export interface FarmerFormData {
  fullName: string;
  phone: string;
  provinceCode: string;
  wardCode: string;
  address: string;
  farmSize: string;
  farmType: string[];
  mainProducts: string[];
  hasCertificate: string;
  certificateType: string;
}

interface FarmerFormProps {
  readonly onSubmit: (data: FarmerFormData) => void;
  readonly isLoading?: boolean;
}

export function FarmerForm({ onSubmit, isLoading = false }: FarmerFormProps) {
  const [formData, setFormData] = useState<FarmerFormData>({
    fullName: "",
    phone: "",
    provinceCode: "",
    wardCode: "",
    address: "",
    farmSize: "",
    farmType: [],
    mainProducts: [],
    hasCertificate: "",
    certificateType: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FarmerFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FarmerFormData, string>> = {};

    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.provinceCode)
      newErrors.provinceCode = "Vui lòng chọn tỉnh/thành";
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

      <TextField
        label="Địa chỉ chi tiết"
        name="address"
        value={formData.address}
        onChange={(v) => {
          setFormData({ ...formData, address: v });
        }}
        placeholder="Số nhà, thôn/ấp..."
      />

      <SelectField
        label="Quy mô canh tác"
        name="farmSize"
        value={formData.farmSize}
        onChange={(v) => {
          setFormData({ ...formData, farmSize: v });
        }}
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

      <MultiSelect
        label="Sản phẩm chính"
        name="mainProducts"
        value={formData.mainProducts}
        onChange={(v) => {
          setFormData({ ...formData, mainProducts: v });
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
        <SelectField
          label="Loại chứng nhận"
          name="certificateType"
          value={formData.certificateType}
          onChange={(v) => {
            setFormData({ ...formData, certificateType: v });
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
        {isLoading ? "Đang xử lý..." : "Hoàn tất đăng ký"}
      </button>
    </div>
  );
}
