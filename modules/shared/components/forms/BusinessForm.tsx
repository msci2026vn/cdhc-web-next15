"use client";

import { useState } from "react";
import {
  BUSINESS_PRODUCTS,
  BUSINESS_TYPES,
  CONTACT_POSITION_OPTIONS,
  EMPLOYEE_COUNT_OPTIONS,
} from "../../data/form-options";
import {
  LocationSelect,
  MultiSelectWithOther,
  SelectWithOther,
  TextField,
} from "../ui";

export interface BusinessFormData {
  companyName: string;
  taxCode: string;
  businessType: string;
  businessTypeOther: string;
  provinceCode: string;
  wardCode: string;
  address: string;
  contactName: string;
  contactBirthDate: string;
  contactPosition: string;
  contactPositionOther: string;
  contactPhone: string;
  contactEmail: string;
  website: string;
  employeeCount: string;
  mainProducts: string[];
  mainProductsOther: string;
}

interface BusinessFormProps {
  readonly onSubmit: (data: BusinessFormData) => void;
  readonly isLoading?: boolean;
}

export function BusinessForm({
  onSubmit,
  isLoading = false,
}: BusinessFormProps) {
  const [formData, setFormData] = useState<BusinessFormData>({
    companyName: "",
    taxCode: "",
    businessType: "",
    businessTypeOther: "",
    provinceCode: "",
    wardCode: "",
    address: "",
    contactName: "",
    contactBirthDate: "",
    contactPosition: "",
    contactPositionOther: "",
    contactPhone: "",
    contactEmail: "",
    website: "",
    employeeCount: "",
    mainProducts: [],
    mainProductsOther: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof BusinessFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof BusinessFormData, string>> = {};

    if (!formData.companyName)
      newErrors.companyName = "Vui lòng nhập tên công ty";
    if (!formData.taxCode) newErrors.taxCode = "Vui lòng nhập mã số thuế";
    if (!formData.businessType)
      newErrors.businessType = "Vui lòng chọn loại hình";
    if (!formData.provinceCode)
      newErrors.provinceCode = "Vui lòng chọn tỉnh/thành";
    if (!formData.address) newErrors.address = "Vui lòng nhập địa chỉ trụ sở";
    if (!formData.contactName)
      newErrors.contactName = "Vui lòng nhập người liên hệ";
    if (!formData.contactPosition)
      newErrors.contactPosition = "Vui lòng chọn chức vụ";
    if (!formData.contactPhone)
      newErrors.contactPhone = "Vui lòng nhập SĐT liên hệ";
    if (!formData.website) newErrors.website = "Vui lòng nhập website";
    if (!formData.employeeCount)
      newErrors.employeeCount = "Vui lòng chọn quy mô nhân sự";
    if (formData.mainProducts.length === 0)
      newErrors.mainProducts = "Vui lòng chọn ít nhất 1 sản phẩm";

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
        required
        error={errors.taxCode}
      />

      <SelectWithOther
        label="Loại hình kinh doanh"
        name="businessType"
        value={formData.businessType}
        otherValue={formData.businessTypeOther}
        onChange={(v) => {
          setFormData({ ...formData, businessType: v });
        }}
        onOtherChange={(v) => {
          setFormData({ ...formData, businessTypeOther: v });
        }}
        options={BUSINESS_TYPES}
        required
        error={errors.businessType}
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
        label="Địa chỉ trụ sở"
        name="address"
        value={formData.address}
        onChange={(v) => {
          setFormData({ ...formData, address: v });
        }}
        placeholder="Số nhà, đường..."
        required
        error={errors.address}
      />

      <TextField
        label="Người liên hệ"
        name="contactName"
        value={formData.contactName}
        onChange={(v) => {
          setFormData({ ...formData, contactName: v });
        }}
        placeholder="Nguyễn Văn A"
        required
        error={errors.contactName}
      />

      <TextField
        label="Ngày sinh người liên hệ"
        name="contactBirthDate"
        type="date"
        value={formData.contactBirthDate}
        onChange={(v) => {
          setFormData({ ...formData, contactBirthDate: v });
        }}
      />

      <div className="grid grid-cols-2 gap-3">
        <SelectWithOther
          label="Chức vụ"
          name="contactPosition"
          value={formData.contactPosition}
          otherValue={formData.contactPositionOther}
          onChange={(v) => {
            setFormData({ ...formData, contactPosition: v });
          }}
          onOtherChange={(v) => {
            setFormData({ ...formData, contactPositionOther: v });
          }}
          options={CONTACT_POSITION_OPTIONS}
          required
          error={errors.contactPosition}
        />

        <TextField
          label="SĐT liên hệ"
          name="contactPhone"
          type="tel"
          value={formData.contactPhone}
          onChange={(v) => {
            setFormData({ ...formData, contactPhone: v });
          }}
          placeholder="0912 345 678"
          required
          error={errors.contactPhone}
        />
      </div>

      <TextField
        label="Email liên hệ"
        name="contactEmail"
        type="email"
        value={formData.contactEmail}
        onChange={(v) => {
          setFormData({ ...formData, contactEmail: v });
        }}
        placeholder="email@company.com (tùy chọn)"
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
        required
        error={errors.website}
      />

      <SelectWithOther
        label="Quy mô nhân sự"
        name="employeeCount"
        value={formData.employeeCount}
        otherValue=""
        onChange={(v) => {
          setFormData({ ...formData, employeeCount: v });
        }}
        onOtherChange={() => {}}
        options={EMPLOYEE_COUNT_OPTIONS}
        required
        error={errors.employeeCount}
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
        options={BUSINESS_PRODUCTS}
        required
        error={errors.mainProducts}
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
