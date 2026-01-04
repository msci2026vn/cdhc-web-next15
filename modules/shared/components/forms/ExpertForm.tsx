"use client";

import { useState } from "react";
import {
  EXPERT_DEGREE_OPTIONS,
  EXPERT_EXPERIENCE_OPTIONS,
  EXPERT_EXPERTISE,
  EXPERT_POSITION_OPTIONS,
  EXPERT_WORKPLACE_TYPE_OPTIONS,
} from "../../data/form-options";
import { LocationSelect, MultiSelect, SelectField, TextField } from "../ui";

export interface ExpertFormData {
  fullName: string;
  phone: string;
  provinceCode: string;
  wardCode: string;
  expertise: string[];
  degree: string;
  experienceYears: string;
  workplaceType: string;
  workplace: string;
  position: string;
  bio: string;
}

interface ExpertFormProps {
  readonly onSubmit: (data: ExpertFormData) => void;
  readonly isLoading?: boolean;
}

export function ExpertForm({ onSubmit, isLoading = false }: ExpertFormProps) {
  const [formData, setFormData] = useState<ExpertFormData>({
    fullName: "",
    phone: "",
    provinceCode: "",
    wardCode: "",
    expertise: [],
    degree: "",
    experienceYears: "",
    workplaceType: "",
    workplace: "",
    position: "",
    bio: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ExpertFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ExpertFormData, string>> = {};

    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.provinceCode)
      newErrors.provinceCode = "Vui lòng chọn tỉnh/thành";
    if (formData.expertise.length === 0)
      newErrors.expertise = "Vui lòng chọn ít nhất 1 lĩnh vực";
    if (!formData.degree) newErrors.degree = "Vui lòng chọn trình độ";
    if (!formData.experienceYears)
      newErrors.experienceYears = "Vui lòng chọn số năm kinh nghiệm";
    if (!formData.workplaceType)
      newErrors.workplaceType = "Vui lòng chọn loại nơi làm việc";
    if (!formData.position) newErrors.position = "Vui lòng chọn chức vụ";

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

      <MultiSelect
        label="Lĩnh vực chuyên môn"
        name="expertise"
        value={formData.expertise}
        onChange={(v) => {
          setFormData({ ...formData, expertise: v });
        }}
        options={EXPERT_EXPERTISE}
        required
        error={errors.expertise}
      />

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Trình độ"
          name="degree"
          value={formData.degree}
          onChange={(v) => {
            setFormData({ ...formData, degree: v });
          }}
          options={EXPERT_DEGREE_OPTIONS}
          required
          error={errors.degree}
        />

        <SelectField
          label="Số năm kinh nghiệm"
          name="experienceYears"
          value={formData.experienceYears}
          onChange={(v) => {
            setFormData({ ...formData, experienceYears: v });
          }}
          options={EXPERT_EXPERIENCE_OPTIONS}
          required
          error={errors.experienceYears}
        />
      </div>

      <SelectField
        label="Loại nơi làm việc"
        name="workplaceType"
        value={formData.workplaceType}
        onChange={(v) => {
          setFormData({ ...formData, workplaceType: v });
        }}
        options={EXPERT_WORKPLACE_TYPE_OPTIONS}
        required
        error={errors.workplaceType}
      />

      <TextField
        label="Nơi làm việc"
        name="workplace"
        value={formData.workplace}
        onChange={(v) => {
          setFormData({ ...formData, workplace: v });
        }}
        placeholder="Tên trường/viện/công ty (tùy chọn)"
      />

      <SelectField
        label="Chức vụ"
        name="position"
        value={formData.position}
        onChange={(v) => {
          setFormData({ ...formData, position: v });
        }}
        options={EXPERT_POSITION_OPTIONS}
        required
        error={errors.position}
      />

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
          placeholder="Mô tả ngắn về kinh nghiệm và chuyên môn (tùy chọn)"
          rows={3}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl transition-colors focus:outline-none focus:border-green-500 resize-none"
        />
      </div>

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
