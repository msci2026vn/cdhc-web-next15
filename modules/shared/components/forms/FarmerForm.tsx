"use client";

import { useState } from "react";
import {
  CERTIFICATE_TYPES,
  FARM_SIZE_OPTIONS,
  FARM_TYPE_OPTIONS,
  FARMER_PRODUCTS,
} from "../../data/form-options";
import { LocationSelect, MultiSelect, SelectField, TextField } from "../ui";

export interface FarmerFormData {
  phone: string;
  farmName: string;
  farmSize: string;
  farmType: string;
  products: string[];
  certificate: string;
  provinceCode: string;
  wardCode: string;
}

interface FarmerFormProps {
  onSubmit: (data: FarmerFormData) => void;
  isLoading?: boolean;
}

export function FarmerForm({ onSubmit, isLoading = false }: FarmerFormProps) {
  const [formData, setFormData] = useState<FarmerFormData>({
    phone: "",
    farmName: "",
    farmSize: "",
    farmType: "",
    products: [],
    certificate: "",
    provinceCode: "",
    wardCode: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof FarmerFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FarmerFormData, string>> = {};

    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.farmSize) newErrors.farmSize = "Vui lòng chọn quy mô";
    if (!formData.farmType) newErrors.farmType = "Vui lòng chọn loại hình";
    if (formData.products.length === 0)
      newErrors.products = "Vui lòng chọn ít nhất 1 sản phẩm";
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
        onChange={(v) => setFormData({ ...formData, phone: v })}
        placeholder="0912 345 678"
        required
        error={errors.phone}
      />

      <TextField
        label="Tên nông trại"
        name="farmName"
        value={formData.farmName}
        onChange={(v) => setFormData({ ...formData, farmName: v })}
        placeholder="Nông trại Hữu Cơ ABC"
      />

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Quy mô"
          name="farmSize"
          value={formData.farmSize}
          onChange={(v) => setFormData({ ...formData, farmSize: v })}
          options={FARM_SIZE_OPTIONS}
          required
          error={errors.farmSize}
        />

        <SelectField
          label="Loại hình"
          name="farmType"
          value={formData.farmType}
          onChange={(v) => setFormData({ ...formData, farmType: v })}
          options={FARM_TYPE_OPTIONS}
          required
          error={errors.farmType}
        />
      </div>

      <MultiSelect
        label="Sản phẩm chính"
        name="products"
        value={formData.products}
        onChange={(v) => setFormData({ ...formData, products: v })}
        options={FARMER_PRODUCTS}
        required
        maxSelect={5}
        error={errors.products}
      />

      <SelectField
        label="Chứng nhận"
        name="certificate"
        value={formData.certificate}
        onChange={(v) => setFormData({ ...formData, certificate: v })}
        options={CERTIFICATE_TYPES}
      />

      <LocationSelect
        provinceCode={formData.provinceCode}
        wardCode={formData.wardCode}
        onProvinceChange={(v) =>
          setFormData({ ...formData, provinceCode: v, wardCode: "" })
        }
        onWardChange={(v) => setFormData({ ...formData, wardCode: v })}
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
