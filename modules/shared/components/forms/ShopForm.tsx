"use client";

import { useState } from "react";
import {
  SELLING_PLATFORMS,
  SHOP_PRODUCT_CATEGORIES,
  SHOP_TYPE_OPTIONS,
} from "../../data/form-options";
import {
  LocationSelect,
  MultiSelectWithOther,
  RadioField,
  TextField,
} from "../ui";

export interface ShopFormData {
  shopName: string;
  ownerName: string;
  ownerBirthDate: string;
  phone: string;
  shopType: string;
  province: string;
  ward: string;
  address: string;
  website: string;
  sellingPlatforms: string[];
  sellingPlatformsOther: string;
  productCategories: string[];
  productCategoriesOther: string;
}

interface ShopFormProps {
  readonly onSubmit: (data: ShopFormData) => void;
  readonly isLoading?: boolean;
}

export function ShopForm({ onSubmit, isLoading = false }: ShopFormProps) {
  const [formData, setFormData] = useState<ShopFormData>({
    shopName: "",
    ownerName: "",
    ownerBirthDate: "",
    phone: "",
    shopType: "",
    province: "",
    ward: "",
    address: "",
    website: "",
    sellingPlatforms: [],
    sellingPlatformsOther: "",
    productCategories: [],
    productCategoriesOther: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ShopFormData, string>>
  >({});

  const needsAddress =
    formData.shopType === "offline" || formData.shopType === "both";

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShopFormData, string>> = {};

    if (!formData.shopName) newErrors.shopName = "Vui lòng nhập tên cửa hàng";
    if (!formData.ownerName) newErrors.ownerName = "Vui lòng nhập tên chủ shop";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.shopType)
      newErrors.shopType = "Vui lòng chọn hình thức kinh doanh";
    if (!formData.province) newErrors.province = "Vui lòng chọn tỉnh/thành";
    if (needsAddress && !formData.address)
      newErrors.address = "Vui lòng nhập địa chỉ";
    if (formData.sellingPlatforms.length === 0)
      newErrors.sellingPlatforms = "Vui lòng chọn ít nhất 1 nền tảng";
    if (formData.productCategories.length === 0)
      newErrors.productCategories = "Vui lòng chọn ít nhất 1 danh mục";

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
        label="Tên cửa hàng"
        name="shopName"
        value={formData.shopName}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, shopName: v }));
        }}
        placeholder="Cửa hàng Hữu Cơ ABC"
        required
        error={errors.shopName}
      />

      <TextField
        label="Tên chủ shop"
        name="ownerName"
        value={formData.ownerName}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, ownerName: v }));
        }}
        placeholder="Nguyễn Văn A"
        required
        error={errors.ownerName}
      />

      <TextField
        label="Ngày sinh chủ shop"
        name="ownerBirthDate"
        type="date"
        value={formData.ownerBirthDate}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, ownerBirthDate: v }));
        }}
      />

      <TextField
        label="Số điện thoại"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, phone: v }));
        }}
        placeholder="0912 345 678"
        required
        error={errors.phone}
      />

      <RadioField
        label="Hình thức kinh doanh"
        name="shopType"
        value={formData.shopType}
        onChange={(v) => {
          setFormData({
            ...formData,
            shopType: v,
            address: v === "online" ? "" : formData.address,
          });
        }}
        options={SHOP_TYPE_OPTIONS}
        required
        error={errors.shopType}
      />

      <LocationSelect
        provinceCode={formData.province}
        wardCode={formData.ward}
        onProvinceChange={(v) => {
          setFormData((prev) => ({ ...prev, province: v, ward: "" }));
        }}
        onWardChange={(v) => {
          setFormData((prev) => ({ ...prev, ward: v }));
        }}
        required
        error={errors.province}
      />

      {needsAddress && (
        <TextField
          label="Địa chỉ cửa hàng"
          name="address"
          value={formData.address}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, address: v }));
          }}
          placeholder="Số nhà, đường..."
          required
          error={errors.address}
        />
      )}

      <TextField
        label="Website/Fanpage"
        name="website"
        type="url"
        value={formData.website}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, website: v }));
        }}
        placeholder="https://example.com (tùy chọn)"
      />

      <MultiSelectWithOther
        label="Nền tảng bán hàng"
        name="sellingPlatforms"
        value={formData.sellingPlatforms}
        otherValue={formData.sellingPlatformsOther}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, sellingPlatforms: v }));
        }}
        onOtherChange={(v) => {
          setFormData((prev) => ({ ...prev, sellingPlatformsOther: v }));
        }}
        options={SELLING_PLATFORMS}
        required
        error={errors.sellingPlatforms}
      />

      <MultiSelectWithOther
        label="Danh mục sản phẩm"
        name="productCategories"
        value={formData.productCategories}
        otherValue={formData.productCategoriesOther}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, productCategories: v }));
        }}
        onOtherChange={(v) => {
          setFormData((prev) => ({ ...prev, productCategoriesOther: v }));
        }}
        options={SHOP_PRODUCT_CATEGORIES}
        required
        error={errors.productCategories}
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
