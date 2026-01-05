"use client";

import { useState } from "react";
import {
  COOP_CERTIFICATE_TYPES,
  COOP_EMPLOYEE_COUNT_OPTIONS,
  COOP_FARM_AREA_OPTIONS,
  COOP_MEMBER_COUNT_OPTIONS,
  COOP_POSITION_OPTIONS,
  COOP_PRODUCTS,
  ESTABLISHED_YEAR_OPTIONS,
} from "../../data/form-options";
import {
  LocationSelect,
  MultiSelectWithOther,
  RadioField,
  SelectField,
  SelectWithOther,
  TextField,
} from "../ui";

export interface CoopFormData {
  coopName: string;
  coopCode: string;
  establishedYear: string;
  province: string;
  ward: string;
  address: string;
  representativeName: string;
  representativeBirthDate: string;
  representativePosition: string;
  representativePositionOther: string;
  phone: string;
  memberCount: string;
  employeeCount: string;
  farmArea: string;
  mainProducts: string[];
  mainProductsOther: string;
  hasCertificate: string;
  certificateType: string;
  certificateTypeOther: string;
  hasWebsite: string;
  website: string;
}

interface CoopFormProps {
  readonly onSubmit: (data: CoopFormData) => void;
  readonly isLoading?: boolean;
}

export function CoopForm({ onSubmit, isLoading = false }: CoopFormProps) {
  const [formData, setFormData] = useState<CoopFormData>({
    coopName: "",
    coopCode: "",
    establishedYear: "",
    province: "",
    ward: "",
    address: "",
    representativeName: "",
    representativeBirthDate: "",
    representativePosition: "",
    representativePositionOther: "",
    phone: "",
    memberCount: "",
    employeeCount: "",
    farmArea: "",
    mainProducts: [],
    mainProductsOther: "",
    hasCertificate: "",
    certificateType: "",
    certificateTypeOther: "",
    hasWebsite: "",
    website: "",
  });
  const [errors, setErrors] = useState<
    Partial<Record<keyof CoopFormData, string>>
  >({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CoopFormData, string>> = {};

    if (!formData.coopName) newErrors.coopName = "Vui lòng nhập tên HTX";
    if (!formData.coopCode) newErrors.coopCode = "Vui lòng nhập mã số HTX";
    if (!formData.establishedYear)
      newErrors.establishedYear = "Vui lòng chọn năm thành lập";
    if (!formData.province) newErrors.province = "Vui lòng chọn tỉnh/thành";
    if (!formData.address) newErrors.address = "Vui lòng nhập địa chỉ trụ sở";
    if (!formData.representativeName)
      newErrors.representativeName = "Vui lòng nhập người đại diện";
    if (!formData.representativePosition)
      newErrors.representativePosition = "Vui lòng chọn chức vụ";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập SĐT";
    if (!formData.memberCount)
      newErrors.memberCount = "Vui lòng chọn số thành viên";
    if (!formData.employeeCount)
      newErrors.employeeCount = "Vui lòng chọn số lao động";
    if (!formData.farmArea)
      newErrors.farmArea = "Vui lòng chọn diện tích canh tác";
    if (formData.mainProducts.length === 0)
      newErrors.mainProducts = "Vui lòng chọn ít nhất 1 sản phẩm";
    if (!formData.hasCertificate)
      newErrors.hasCertificate = "Vui lòng chọn có/không";
    if (formData.hasCertificate === "yes" && !formData.certificateType)
      newErrors.certificateType = "Vui lòng chọn loại chứng nhận";
    if (!formData.hasWebsite) newErrors.hasWebsite = "Vui lòng chọn có/không";
    if (formData.hasWebsite === "yes" && !formData.website)
      newErrors.website = "Vui lòng nhập website";

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
        label="Tên Hợp tác xã"
        name="coopName"
        value={formData.coopName}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, coopName: v }));
        }}
        placeholder="HTX Nông nghiệp ABC"
        required
        error={errors.coopName}
      />

      <TextField
        label="Mã số HTX"
        name="coopCode"
        value={formData.coopCode}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, coopCode: v }));
        }}
        placeholder="0123456789"
        required
        error={errors.coopCode}
      />

      <SelectField
        label="Năm thành lập"
        name="establishedYear"
        value={formData.establishedYear}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, establishedYear: v }));
        }}
        options={ESTABLISHED_YEAR_OPTIONS}
        required
        error={errors.establishedYear}
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

      <TextField
        label="Địa chỉ trụ sở"
        name="address"
        value={formData.address}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, address: v }));
        }}
        placeholder="Số nhà, đường..."
        required
        error={errors.address}
      />

      <TextField
        label="Người đại diện"
        name="representativeName"
        value={formData.representativeName}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, representativeName: v }));
        }}
        placeholder="Nguyễn Văn A"
        required
        error={errors.representativeName}
      />

      <TextField
        label="Ngày sinh người đại diện"
        name="representativeBirthDate"
        type="date"
        value={formData.representativeBirthDate}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, representativeBirthDate: v }));
        }}
      />

      <div className="grid grid-cols-2 gap-3">
        <SelectWithOther
          label="Chức vụ"
          name="representativePosition"
          value={formData.representativePosition}
          otherValue={formData.representativePositionOther}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, representativePosition: v }));
          }}
          onOtherChange={(v) => {
            setFormData((prev) => ({
              ...prev,
              representativePositionOther: v,
            }));
          }}
          options={COOP_POSITION_OPTIONS}
          required
          error={errors.representativePosition}
        />

        <TextField
          label="SĐT liên hệ"
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
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SelectField
          label="Số thành viên"
          name="memberCount"
          value={formData.memberCount}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, memberCount: v }));
          }}
          options={COOP_MEMBER_COUNT_OPTIONS}
          required
          error={errors.memberCount}
        />

        <SelectField
          label="Số lao động"
          name="employeeCount"
          value={formData.employeeCount}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, employeeCount: v }));
          }}
          options={COOP_EMPLOYEE_COUNT_OPTIONS}
          required
          error={errors.employeeCount}
        />
      </div>

      <SelectField
        label="Diện tích canh tác"
        name="farmArea"
        value={formData.farmArea}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, farmArea: v }));
        }}
        options={COOP_FARM_AREA_OPTIONS}
        required
        error={errors.farmArea}
      />

      <MultiSelectWithOther
        label="Sản phẩm chính"
        name="mainProducts"
        value={formData.mainProducts}
        otherValue={formData.mainProductsOther}
        onChange={(v) => {
          setFormData((prev) => ({ ...prev, mainProducts: v }));
        }}
        onOtherChange={(v) => {
          setFormData((prev) => ({ ...prev, mainProductsOther: v }));
        }}
        options={COOP_PRODUCTS}
        required
        error={errors.mainProducts}
      />

      <RadioField
        label="Đã có chứng nhận hữu cơ?"
        name="hasCertificate"
        value={formData.hasCertificate}
        onChange={(v) => {
          setFormData((prev) => ({
            ...prev,
            hasCertificate: v,
            certificateType: v === "no" ? "" : prev.certificateType,
            certificateTypeOther: v === "no" ? "" : prev.certificateTypeOther,
          }));
        }}
        options={[
          { value: "yes", label: "Có" },
          { value: "no", label: "Chưa" },
        ]}
        required
        error={errors.hasCertificate}
      />

      {formData.hasCertificate === "yes" && (
        <SelectWithOther
          label="Loại chứng nhận"
          name="certificateType"
          value={formData.certificateType}
          otherValue={formData.certificateTypeOther}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, certificateType: v }));
          }}
          onOtherChange={(v) => {
            setFormData((prev) => ({ ...prev, certificateTypeOther: v }));
          }}
          options={COOP_CERTIFICATE_TYPES}
          required
          error={errors.certificateType}
        />
      )}

      <RadioField
        label="Đã có website?"
        name="hasWebsite"
        value={formData.hasWebsite}
        onChange={(v) => {
          setFormData({
            ...formData,
            hasWebsite: v,
            website: v === "no" ? "" : formData.website,
          });
        }}
        options={[
          { value: "yes", label: "Đã có" },
          { value: "no", label: "Chưa có" },
        ]}
        required
        error={errors.hasWebsite}
      />

      {formData.hasWebsite === "yes" && (
        <TextField
          label="Website"
          name="website"
          type="url"
          value={formData.website}
          onChange={(v) => {
            setFormData((prev) => ({ ...prev, website: v }));
          }}
          placeholder="https://example.com"
          required
          error={errors.website}
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
