"use client";

import { useState } from "react";
import { PRODUCT_CATEGORIES, SHOP_TYPES } from "../../data/form-options";
import { LocationSelect, MultiSelect, SelectField, TextField } from "../ui";

export interface ShopFormData {
  phone: string;
  shopName: string;
  shopType: string;
  categories: string[];
  website: string;
  provinceCode: string;
  wardCode: string;
}

interface ShopFormProps {
  readonly onSubmit: (data: ShopFormData) => void;
  readonly isLoading?: boolean;
}

export function ShopForm({
  onSubmit,
  isLoading = false,
}: Readonly<ShopFormProps>) {
  const [formData, setFormData] = useState<ShopFormData>({
    phone: "",
    shopName: "",
    shopType: "",
    categories: [],
    website: "",
    provinceCode: "",
    wardCode: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ShopFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShopFormData, string>> = {};

    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.shopName) newErrors.shopName = "Vui lòng nhập tên cửa hàng";
    if (!formData.shopType) newErrors.shopType = "Vui lòng chọn hình thức";
    if (formData.categories.length === 0)
      newErrors.categories = "Vui lòng chọn ít nhất 1 danh mục";
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
        label="Tên cửa hàng"
        name="shopName"
        value={formData.shopName}
        onChange={(v) => {
          setFormData({ ...formData, shopName: v });
        }}
        placeholder="Cửa hàng Hữu Cơ ABC"
        required
        error={errors.shopName}
      />

      <SelectField
        label="Hình thức kinh doanh"
        name="shopType"
        value={formData.shopType}
        onChange={(v) => {
          setFormData({ ...formData, shopType: v });
        }}
        options={SHOP_TYPES}
        required
        error={errors.shopType}
      />

      <MultiSelect
        label="Danh mục sản phẩm"
        name="categories"
        value={formData.categories}
        onChange={(v) => {
          setFormData({ ...formData, categories: v });
        }}
        options={PRODUCT_CATEGORIES}
        required
        maxSelect={4}
        error={errors.categories}
      />

      <TextField
        label="Website/Fanpage"
        name="website"
        type="url"
        value={formData.website}
        onChange={(v) => {
          setFormData({ ...formData, website: v });
        }}
        placeholder="https://facebook.com/shop"
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
