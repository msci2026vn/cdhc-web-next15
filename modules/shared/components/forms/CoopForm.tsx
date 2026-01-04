"use client";

import { useState } from "react";
import {
  CERTIFICATE_TYPES,
  COOP_TYPES,
  FARMER_PRODUCTS,
  MEMBER_COUNT_OPTIONS,
} from "../../data/form-options";
import { LocationSelect, MultiSelect, SelectField, TextField } from "../ui";

export interface CoopFormData {
  phone: string;
  coopName: string;
  coopType: string;
  memberCount: string;
  products: string[];
  certificate: string;
  provinceCode: string;
  wardCode: string;
}

interface CoopFormProps {
  readonly onSubmit: (data: CoopFormData) => void;
  readonly isLoading?: boolean;
}

export function CoopForm({
  onSubmit,
  isLoading = false,
}: Readonly<CoopFormProps>) {
  const [formData, setFormData] = useState<CoopFormData>({
    phone: "",
    coopName: "",
    coopType: "",
    memberCount: "",
    products: [],
    certificate: "",
    provinceCode: "",
    wardCode: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CoopFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CoopFormData, string>> = {};

    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.coopName) newErrors.coopName = "Vui lòng nhập tên HTX";
    if (!formData.coopType) newErrors.coopType = "Vui lòng chọn loại hình";
    if (!formData.memberCount) newErrors.memberCount = "Vui lòng chọn quy mô";
    if (!formData.provinceCode)
      newErrors.provinceCode = "Vui lòng chọn địa điểm";

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

      <TextField
        label="Tên Hợp tác xã"
        name="coopName"
        value={formData.coopName}
        onChange={(v) => {
          setFormData({ ...formData, coopName: v });
        }}
        placeholder="HTX Nông nghiệp ABC"
        required
        error={errors.coopName}
      />

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Loại hình"
          name="coopType"
          value={formData.coopType}
          onChange={(v) => {
            setFormData({ ...formData, coopType: v });
          }}
          options={COOP_TYPES}
          required
          error={errors.coopType}
        />

        <SelectField
          label="Quy mô thành viên"
          name="memberCount"
          value={formData.memberCount}
          onChange={(v) => {
            setFormData({ ...formData, memberCount: v });
          }}
          options={MEMBER_COUNT_OPTIONS}
          required
          error={errors.memberCount}
        />
      </div>

      <MultiSelect
        label="Sản phẩm chính"
        name="products"
        value={formData.products}
        onChange={(v) => {
          setFormData({ ...formData, products: v });
        }}
        options={FARMER_PRODUCTS}
        maxSelect={5}
      />

      <SelectField
        label="Chứng nhận"
        name="certificate"
        value={formData.certificate}
        onChange={(v) => {
          setFormData({ ...formData, certificate: v });
        }}
        options={CERTIFICATE_TYPES}
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
