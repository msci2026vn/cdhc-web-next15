"use client";

import { useState } from "react";
import {
  KOL_CONTENT_TYPES,
  KOL_ENGAGEMENT_OPTIONS,
  KOL_FOLLOWER_OPTIONS,
  KOL_PLATFORMS,
  KOL_PRICE_OPTIONS,
} from "../../data/form-options";
import { LocationSelect, MultiSelect, SelectField, TextField } from "../ui";

export interface KolFormData {
  fullName: string;
  stageName: string;
  phone: string;
  provinceCode: string;
  wardCode: string;
  contentTypes: string[];
  platforms: string[];
  totalFollowers: string;
  engagementRate: string;
  bio: string;
  mainPlatformUrl: string;
  priceRange: string;
}

interface KolFormProps {
  readonly onSubmit: (data: KolFormData) => void;
  readonly isLoading?: boolean;
}

export function KolForm({ onSubmit, isLoading = false }: KolFormProps) {
  const [formData, setFormData] = useState<KolFormData>({
    fullName: "",
    stageName: "",
    phone: "",
    provinceCode: "",
    wardCode: "",
    contentTypes: [],
    platforms: [],
    totalFollowers: "",
    engagementRate: "",
    bio: "",
    mainPlatformUrl: "",
    priceRange: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof KolFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof KolFormData, string>> = {};

    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.provinceCode)
      newErrors.provinceCode = "Vui lòng chọn tỉnh/thành";
    if (formData.contentTypes.length === 0)
      newErrors.contentTypes = "Vui lòng chọn ít nhất 1 loại nội dung";
    if (formData.platforms.length === 0)
      newErrors.platforms = "Vui lòng chọn ít nhất 1 nền tảng";
    if (!formData.totalFollowers)
      newErrors.totalFollowers = "Vui lòng chọn tổng số followers";
    if (!formData.engagementRate)
      newErrors.engagementRate = "Vui lòng chọn tỷ lệ tương tác";
    if (!formData.mainPlatformUrl)
      newErrors.mainPlatformUrl = "Vui lòng nhập link kênh chính";
    if (!formData.priceRange) newErrors.priceRange = "Vui lòng chọn mức giá";

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
        label="Tên nghệ danh"
        name="stageName"
        value={formData.stageName}
        onChange={(v) => {
          setFormData({ ...formData, stageName: v });
        }}
        placeholder="Tên kênh/nickname (tùy chọn)"
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

      <MultiSelect
        label="Loại nội dung"
        name="contentTypes"
        value={formData.contentTypes}
        onChange={(v) => {
          setFormData({ ...formData, contentTypes: v });
        }}
        options={KOL_CONTENT_TYPES}
        required
        error={errors.contentTypes}
      />

      <MultiSelect
        label="Nền tảng hoạt động"
        name="platforms"
        value={formData.platforms}
        onChange={(v) => {
          setFormData({ ...formData, platforms: v });
        }}
        options={KOL_PLATFORMS}
        required
        error={errors.platforms}
      />

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Tổng số followers"
          name="totalFollowers"
          value={formData.totalFollowers}
          onChange={(v) => {
            setFormData({ ...formData, totalFollowers: v });
          }}
          options={KOL_FOLLOWER_OPTIONS}
          required
          error={errors.totalFollowers}
        />

        <SelectField
          label="Tỷ lệ tương tác"
          name="engagementRate"
          value={formData.engagementRate}
          onChange={(v) => {
            setFormData({ ...formData, engagementRate: v });
          }}
          options={KOL_ENGAGEMENT_OPTIONS}
          required
          error={errors.engagementRate}
        />
      </div>

      <div className="mb-4">
        <label
          htmlFor="bio"
          className="block text-sm font-medium text-slate-700 mb-1"
        >
          Giới thiệu bản thân
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          placeholder="Mô tả ngắn về kênh/nội dung (tùy chọn)"
          rows={3}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-colors focus:outline-none focus:border-green-500 resize-none"
        />
      </div>

      <TextField
        label="Link kênh chính"
        name="mainPlatformUrl"
        type="url"
        value={formData.mainPlatformUrl}
        onChange={(v) => {
          setFormData({ ...formData, mainPlatformUrl: v });
        }}
        placeholder="https://facebook.com/yourpage"
        required
        error={errors.mainPlatformUrl}
      />

      <SelectField
        label="Mức giá hợp tác"
        name="priceRange"
        value={formData.priceRange}
        onChange={(v) => {
          setFormData({ ...formData, priceRange: v });
        }}
        options={KOL_PRICE_OPTIONS}
        required
        error={errors.priceRange}
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
