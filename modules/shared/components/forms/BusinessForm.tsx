"use client";

import { useState } from "react";
import {
  BUSINESS_TYPES,
  EMPLOYEE_COUNT_OPTIONS,
  POSITION_OPTIONS,
} from "../../data/form-options";
import { LocationSelect, SelectField, TextField } from "../ui";

export interface BusinessFormData {
  phone: string;
  companyName: string;
  taxCode: string;
  businessType: string;
  position: string;
  employeeCount: string;
  website: string;
  provinceCode: string;
  wardCode: string;
}

interface BusinessFormProps {
  readonly onSubmit: (data: BusinessFormData) => void;
  readonly isLoading?: boolean;
}

export function BusinessForm({
  onSubmit,
  isLoading = false,
}: Readonly<BusinessFormProps>) {
  const [formData, setFormData] = useState<BusinessFormData>({
    phone: "",
    companyName: "",
    taxCode: "",
    businessType: "",
    position: "",
    employeeCount: "",
    website: "",
    provinceCode: "",
    wardCode: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof BusinessFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BusinessFormData, string>> = {};

    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.companyName)
      newErrors.companyName = "Vui lòng nhập tên công ty";
    if (!formData.businessType)
      newErrors.businessType = "Vui lòng chọn lĩnh vực";
    if (!formData.position) newErrors.position = "Vui lòng chọn chức vụ";
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
        label="Tên công ty"
        name="companyName"
        value={formData.companyName}
        onChange={(v) => {
          setFormData({ ...formData, companyName: v });
        }}
        placeholder="Công ty TNHH ABC"
        required
        error={errors.companyName}
      />

      <TextField
        label="Mã số thuế"
        name="taxCode"
        value={formData.taxCode}
        onChange={(v) => {
          setFormData({ ...formData, taxCode: v });
        }}
        placeholder="0123456789"
      />

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Lĩnh vực"
          name="businessType"
          value={formData.businessType}
          onChange={(v) => {
            setFormData({ ...formData, businessType: v });
          }}
          options={BUSINESS_TYPES}
          required
          error={errors.businessType}
        />

        <SelectField
          label="Chức vụ"
          name="position"
          value={formData.position}
          onChange={(v) => {
            setFormData({ ...formData, position: v });
          }}
          options={POSITION_OPTIONS}
          required
          error={errors.position}
        />
      </div>

      <SelectField
        label="Quy mô nhân sự"
        name="employeeCount"
        value={formData.employeeCount}
        onChange={(v) => {
          setFormData({ ...formData, employeeCount: v });
        }}
        options={EMPLOYEE_COUNT_OPTIONS}
      />

      <TextField
        label="Website"
        name="website"
        type="url"
        value={formData.website}
        onChange={(v) => {
          setFormData({ ...formData, website: v });
        }}
        placeholder="https://example.com"
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
