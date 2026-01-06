"use client";

import type { ProfileData } from "@/modules/shared/lib/validation";

interface ProfileInfoSectionProps {
  profile: ProfileData;
  provinceName: string;
  wardName: string;
  interestLabels: string[];
  variant?: "mobile" | "desktop";
}

const formatBirthDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "Chưa cập nhật";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  } catch {
    return "Chưa cập nhật";
  }
};

interface InfoItemProps {
  icon: string;
  label: string;
  value: string;
  isMobile?: boolean;
}

function InfoItem({ icon, label, value, isMobile = true }: InfoItemProps) {
  return (
    <div
      className={`flex items-start gap-3 ${isMobile ? "p-3" : "py-2"} ${isMobile ? "bg-gray-50 rounded-xl" : ""}`}
    >
      <div
        className={`${isMobile ? "w-10 h-10" : "w-8 h-8"} rounded-lg bg-green-100 flex items-center justify-center ${isMobile ? "" : "shrink-0"}`}
      >
        <span className={isMobile ? "text-lg" : "text-sm"}>{icon}</span>
      </div>
      <div className="min-w-0 flex-1">
        <div className={`text-xs text-gray-500 ${isMobile ? "mb-0.5" : ""}`}>
          {label}
        </div>
        <div
          className={`${isMobile ? "" : "text-sm"} font-medium text-gray-900 ${isMobile ? "break-words" : "truncate"}`}
        >
          {value}
        </div>
      </div>
    </div>
  );
}

export function ProfileInfoSection({
  profile,
  provinceName,
  wardName,
  interestLabels,
  variant = "mobile",
}: ProfileInfoSectionProps) {
  const isMobile = variant === "mobile";

  const infoItems = [
    { icon: "👤", label: "Họ tên", value: profile.fullName },
    {
      icon: "📞",
      label: "Số điện thoại",
      value: profile.phone || "Chưa cập nhật",
    },
    {
      icon: "🎂",
      label: "Ngày sinh",
      value: formatBirthDate(profile.birthDate),
    },
    {
      icon: "📍",
      label: "Địa chỉ",
      value:
        wardName && provinceName
          ? `${wardName}, ${provinceName}`
          : "Chưa cập nhật",
    },
    {
      icon: "💚",
      label: "Quan tâm",
      value:
        interestLabels.length > 0 ? interestLabels.join(", ") : "Chưa cập nhật",
    },
  ];

  if (isMobile) {
    return (
      <div className="p-4 space-y-3">
        {infoItems.map((item) => (
          <InfoItem
            key={item.label}
            icon={item.icon}
            label={item.label}
            value={item.value}
            isMobile={true}
          />
        ))}
      </div>
    );
  }

  // Desktop variant
  return (
    <div className="divide-y divide-gray-100">
      {infoItems.map((item) => (
        <InfoItem
          key={item.label}
          icon={item.icon}
          label={item.label}
          value={item.value}
          isMobile={false}
        />
      ))}
    </div>
  );
}
