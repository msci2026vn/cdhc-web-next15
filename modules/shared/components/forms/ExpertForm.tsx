"use client";

import { useState } from "react";
import {
  EXPERT_DEGREE_OPTIONS,
  EXPERT_EXPERIENCE_OPTIONS,
  EXPERT_EXPERTISE,
  EXPERT_POSITION_OPTIONS,
  EXPERT_WORKPLACE_TYPE_OPTIONS,
} from "../../data/form-options";
import {
  LocationSelect,
  MultiSelectWithOther,
  SelectField,
  SelectWithOther,
  TextField,
} from "../ui";

export interface ExpertFormData {
  fullName: string;
  phone: string;
  birthDate: string;
  province: string;
  ward: string;
  expertise: string[];
  expertiseOther: string;
  degree: string;
  experienceYears: string;
  workplaceType: string;
  workplaceTypeOther: string;
  workplace: string;
  position: string;
  positionOther: string;
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
    birthDate: "",
    province: "",
    ward: "",
    expertise: [],
    expertiseOther: "",
    degree: "",
    experienceYears: "",
    workplaceType: "",
    workplaceTypeOther: "",
    workplace: "",
    position: "",
    positionOther: "",
    bio: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof ExpertFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ExpertFormData, string>> = {};

    if (!formData.fullName) newErrors.fullName = "Vui lòng nhập họ tên";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.province) newErrors.province = "Vui lòng chọn tỉnh/thành";
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
          setFormData((prev) => ({ ...prev, fullName: v }));
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
          setFormData((prev) => ({ ...prev, phone: v }));
        }}
        placeholder="0912 345 678"
        required
        error={errors.phone}
      />

      <TextField
        label="Ngày sinh"
        name="birthDate"
        type="date"
        value={formData.birthDate}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, birthDate: v }));
        }}
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

      <MultiSelectWithOther
        label="Lĩnh vực chuyên môn"
        name="expertise"
        value={formData.expertise}
        otherValue={formData.expertiseOther}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, expertise: v }));
        }}
        onOtherChange={(v) => {
          setFormData((prev) => ({ ...prev, expertiseOther: v }));
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
            setFormData((prev) => ({ ...prev, degree: v }));
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
            setFormData((prev) => ({ ...prev, experienceYears: v }));
          }}
          options={EXPERT_EXPERIENCE_OPTIONS}
          required
          error={errors.experienceYears}
        />
      </div>

      <SelectWithOther
        label="Loại nơi làm việc"
        name="workplaceType"
        value={formData.workplaceType}
        otherValue={formData.workplaceTypeOther}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, workplaceType: v }));
        }}
        onOtherChange={(v) => {
          setFormData((prev) => ({ ...prev, workplaceTypeOther: v }));
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
          setFormData((prev) => ({ ...prev, workplace: v }));
        }}
        placeholder="Tên trường/viện/công ty (tùy chọn)"
      />

      <SelectWithOther
        label="Chức vụ"
        name="position"
        value={formData.position}
        otherValue={formData.positionOther}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, position: v }));
        }}
        onOtherChange={(v) => {
          setFormData((prev) => ({ ...prev, positionOther: v }));
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
