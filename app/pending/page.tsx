"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";

interface User {
  name: string;
  email: string;
  role: string;
  picture?: string;
}

interface PlatformLink {
  platform: string;
  url: string;
  followers: string;
}

interface Profile {
  // Common
  fullName?: string;
  phone?: string;
  birthDate?: string;
  province?: string;
  ward?: string;
  address?: string;

  // Farmer
  farmSize?: string;
  farmType?: string[];
  mainProducts?: string[];
  mainProductsOther?: string;
  hasCertificate?: string;
  certificateType?: string;
  certificateTypeOther?: string;

  // Community
  interests?: string[];
  interestsOther?: string;

  // Business
  companyName?: string;
  taxCode?: string;
  businessType?: string;
  businessTypeOther?: string;
  contactName?: string;
  contactBirthDate?: string;
  contactPosition?: string;
  contactPositionOther?: string;
  contactPhone?: string;
  contactEmail?: string;
  website?: string;
  employeeCount?: string;

  // Coop
  coopName?: string;
  coopCode?: string;
  establishedYear?: string;
  representativeName?: string;
  representativeBirthDate?: string;
  representativePosition?: string;
  representativePositionOther?: string;
  memberCount?: string;
  farmArea?: string;
  hasWebsite?: string;

  // Shop
  shopName?: string;
  ownerName?: string;
  ownerBirthDate?: string;
  shopType?: string;
  sellingPlatforms?: string[];
  sellingPlatformsOther?: string;
  productCategories?: string[];
  productCategoriesOther?: string;

  // Expert
  expertise?: string[];
  expertiseOther?: string;
  degree?: string;
  experienceYears?: string;
  workplaceType?: string;
  workplaceTypeOther?: string;
  workplace?: string;
  position?: string;
  positionOther?: string;
  bio?: string;

  // KOL
  stageName?: string;
  contentTypes?: string[];
  contentTypesOther?: string;
  platformLinks?: PlatformLink[];
  priceRange?: string;

  // KOC
  reviewCategories?: string[];
  reviewCategoriesOther?: string;
  reviewCount?: string;
}

const ROLE_LABELS: Record<string, string> = {
  farmer: "Nhà nông",
  community: "Cộng đồng",
  business: "Doanh nghiệp",
  coop: "Hợp tác xã",
  shop: "Cửa hàng hữu cơ",
  expert: "Chuyên gia",
  kol: "KOL",
  koc: "KOC",
};

// Labels cho các field options
const FIELD_LABELS: Record<string, Record<string, string>> = {
  // Farmer
  farmSize: {
    under_1sao: "< 1 sào",
    "1_3sao": "1-3 sào",
    "3_5sao": "3-5 sào",
    "5_10sao": "5-10 sào",
    "10_20sao": "10-20 sào",
    over_20sao: "> 20 sào",
  },
  farmType: {
    crops: "Trồng trọt",
    livestock: "Chăn nuôi",
    aquaculture: "Thủy sản",
    forestry: "Lâm nghiệp",
  },
  mainProducts: {
    rice: "Lúa",
    vegetables: "Rau màu",
    fruits: "Trái cây",
    cattle: "Gia súc",
    poultry: "Gia cầm",
    seafood: "Thủy sản",
    industrial_crops: "Cây công nghiệp",
    coffee: "Cà phê",
    tea: "Chè",
    pepper: "Tiêu",
    cashew: "Điều",
    meat: "Thịt",
    eggs: "Trứng",
    milk: "Sữa",
    spices: "Gia vị",
    beverages: "Đồ uống",
    processed: "Thực phẩm chế biến",
    dried: "Đồ khô",
    cosmetics: "Mỹ phẩm",
    other: "Khác",
  },
  certificateType: {
    pgs: "PGS",
    usda: "USDA Organic",
    eu: "EU Organic",
    jas: "JAS",
    vietgap: "VietGAP",
    globalgap: "GlobalGAP",
    other: "Khác",
  },
  hasCertificate: {
    yes: "Có",
    no: "Chưa có",
  },
  hasWebsite: {
    yes: "Đã có",
    no: "Chưa có",
  },

  // Community
  interests: {
    vegetables: "Rau củ",
    fruits: "Trái cây",
    rice: "Gạo",
    meat: "Thịt",
    eggs: "Trứng",
    milk: "Sữa",
    processed: "Thực phẩm chế biến",
    beverages: "Đồ uống",
    cosmetics: "Mỹ phẩm hữu cơ",
    other: "Khác",
  },

  // Business
  businessType: {
    export: "Xuất khẩu",
    import: "Nhập khẩu",
    processing: "Chế biến",
    distribution: "Phân phối",
    retail: "Bán lẻ",
    production: "Sản xuất",
    logistics: "Logistics",
    other: "Khác",
  },
  contactPosition: {
    director: "Giám đốc",
    deputy_director: "Phó GĐ",
    head_department: "Trưởng phòng",
    staff: "Nhân viên",
    owner: "Chủ sở hữu",
    other: "Khác",
  },
  employeeCount: {
    under_10: "< 10",
    "10_50": "10-50",
    "50_100": "50-100",
    "100_200": "100-200",
    "200_500": "200-500",
    over_500: "> 500",
  },

  // Coop
  establishedYear: {
    before_2000: "Trước 2000",
    "2000_2010": "2000-2010",
    "2010_2015": "2010-2015",
    "2015_2020": "2015-2020",
    "2020_2024": "2020-2024",
    "2024_now": "2024-nay",
  },
  representativePosition: {
    director: "Giám đốc",
    deputy_director: "Phó GĐ",
    chairman: "Chủ tịch HĐQT",
    vice_chairman: "Phó CT HĐQT",
    chief_accountant: "Kế toán trưởng",
    other: "Khác",
  },
  memberCount: {
    under_10: "< 10",
    "10_30": "10-30",
    "30_50": "30-50",
    "50_100": "50-100",
    "100_200": "100-200",
    over_200: "> 200",
  },
  coopEmployeeCount: {
    under_5: "< 5",
    "5_10": "5-10",
    "10_20": "10-20",
    "20_50": "20-50",
    over_50: "> 50",
  },
  farmArea: {
    under_5ha: "< 5 ha",
    "5_10ha": "5-10 ha",
    "10_30ha": "10-30 ha",
    "30_50ha": "30-50 ha",
    "50_100ha": "50-100 ha",
    over_100ha: "> 100 ha",
  },

  // Shop
  shopType: {
    offline: "Cửa hàng (offline)",
    online: "Online",
    both: "Cả hai",
  },
  sellingPlatforms: {
    facebook: "Facebook",
    shopee: "Shopee",
    lazada: "Lazada",
    tiki: "Tiki",
    tiktok_shop: "TikTok Shop",
    website: "Website riêng",
    zalo: "Zalo",
    other: "Khác",
  },
  productCategories: {
    vegetables: "Rau củ",
    fruits: "Trái cây",
    rice: "Gạo",
    meat: "Thịt",
    eggs: "Trứng",
    milk: "Sữa",
    dried: "Đồ khô",
    spices: "Gia vị",
    beverages: "Đồ uống",
    cosmetics: "Mỹ phẩm",
    other: "Khác",
  },

  // Expert
  expertise: {
    crops: "Trồng trọt",
    livestock: "Chăn nuôi",
    aquaculture: "Thủy sản",
    forestry: "Lâm nghiệp",
    processing: "Chế biến",
    preservation: "Bảo quản",
    organic_fertilizer: "Phân bón hữu cơ",
    pest_control: "Phòng trừ sâu bệnh",
    marketing: "Marketing nông sản",
    other: "Khác",
  },
  degree: {
    bachelor: "Cử nhân",
    engineer: "Kỹ sư",
    master: "Thạc sĩ",
    doctor: "Tiến sĩ",
    assoc_professor: "PGS",
    professor: "GS",
  },
  experienceYears: {
    under_2: "< 2 năm",
    "2_5": "2-5 năm",
    "5_10": "5-10 năm",
    "10_20": "10-20 năm",
    over_20: "> 20 năm",
  },
  workplaceType: {
    university: "Trường đại học",
    research: "Viện nghiên cứu",
    enterprise: "Doanh nghiệp",
    freelance: "Tự do",
    other: "Khác",
  },
  position: {
    lecturer: "Giảng viên",
    researcher: "Nghiên cứu viên",
    manager: "Quản lý",
    consultant: "Tư vấn viên",
    other: "Khác",
  },

  // KOL
  contentTypes: {
    food: "Ẩm thực",
    health: "Sức khỏe",
    lifestyle: "Lifestyle",
    agriculture: "Nông nghiệp",
    beauty: "Làm đẹp",
    travel: "Du lịch",
    family: "Gia đình",
    other: "Khác",
  },
  platforms: {
    facebook: "Facebook",
    youtube: "YouTube",
    tiktok: "TikTok",
    instagram: "Instagram",
    blog: "Blog",
    podcast: "Podcast",
    shopee: "Shopee",
    lazada: "Lazada",
  },
  totalFollowers: {
    under_10k: "< 10K",
    "10k_50k": "10K-50K",
    "50k_100k": "50K-100K",
    "100k_500k": "100K-500K",
    "500k_1m": "500K-1M",
    over_1m: "> 1M",
    under_1k: "< 1K",
    "1k_5k": "1K-5K",
    "5k_10k": "5K-10K",
    over_100k: "> 100K",
  },
  priceRange: {
    under_2m: "< 2 triệu",
    "2_5m": "2-5 triệu",
    "5_10m": "5-10 triệu",
    "10_20m": "10-20 triệu",
    "20_50m": "20-50 triệu",
    over_50m: "> 50 triệu",
    under_500k: "< 500K",
    "500k_1m": "500K-1 triệu",
    "1_2m": "1-2 triệu",
    over_5m: "> 5 triệu",
  },

  // KOC
  reviewCategories: {
    food: "Thực phẩm",
    beverages: "Đồ uống",
    cosmetics: "Mỹ phẩm hữu cơ",
    household: "Đồ gia dụng",
    fashion: "Thời trang bền vững",
    other: "Khác",
  },
  reviewCount: {
    under_10: "< 10",
    "10_30": "10-30",
    "30_50": "30-50",
    "50_100": "50-100",
    over_100: "> 100",
  },
};

function getLabel(field: string, value: string): string {
  return FIELD_LABELS[field]?.[value] ?? value;
}

function getLabels(
  field: string,
  values: string[],
  otherValue?: string
): string {
  const labels = values.map((v) => {
    if (v === "other" && otherValue) {
      return `Khác: ${otherValue}`;
    }
    return getLabel(field, v);
  });
  return labels.join(", ");
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN");
}

// Validate and sanitize URL to prevent XSS
function isValidUrl(urlString: string): boolean {
  try {
    const url = new URL(urlString);
    // Only allow http and https protocols
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

// Sanitize URL for display (truncate long URLs)
function sanitizeUrlForDisplay(url: string, maxLength = 50): string {
  if (url.length <= maxLength) return url;
  return `${url.substring(0, maxLength)}...`;
}

// Zod schemas for validation
const UserSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  role: z.string().min(1).max(50),
  picture: z.string().url().optional(),
});

const PlatformLinkSchema = z.object({
  platform: z.string().max(50),
  url: z.string().max(500),
  followers: z.string().max(50),
});

const ProfileSchema = z
  .object({
    fullName: z.string().max(200).optional(),
    phone: z.string().max(20).optional(),
    birthDate: z.string().max(20).optional(),
    province: z.string().max(100).optional(),
    ward: z.string().max(100).optional(),
    address: z.string().max(500).optional(),
    farmSize: z.string().max(50).optional(),
    farmType: z.array(z.string().max(50)).optional(),
    mainProducts: z.array(z.string().max(50)).optional(),
    mainProductsOther: z.string().max(200).optional(),
    hasCertificate: z.string().max(10).optional(),
    certificateType: z.string().max(50).optional(),
    certificateTypeOther: z.string().max(200).optional(),
    interests: z.array(z.string().max(50)).optional(),
    interestsOther: z.string().max(200).optional(),
    companyName: z.string().max(200).optional(),
    taxCode: z.string().max(50).optional(),
    businessType: z.string().max(50).optional(),
    businessTypeOther: z.string().max(200).optional(),
    contactName: z.string().max(200).optional(),
    contactBirthDate: z.string().max(20).optional(),
    contactPosition: z.string().max(50).optional(),
    contactPositionOther: z.string().max(200).optional(),
    contactPhone: z.string().max(20).optional(),
    contactEmail: z.string().max(320).optional(),
    website: z.string().max(500).optional(),
    employeeCount: z.string().max(50).optional(),
    coopName: z.string().max(200).optional(),
    coopCode: z.string().max(50).optional(),
    establishedYear: z.string().max(20).optional(),
    representativeName: z.string().max(200).optional(),
    representativeBirthDate: z.string().max(20).optional(),
    representativePosition: z.string().max(50).optional(),
    representativePositionOther: z.string().max(200).optional(),
    memberCount: z.string().max(50).optional(),
    farmArea: z.string().max(50).optional(),
    hasWebsite: z.string().max(10).optional(),
    shopName: z.string().max(200).optional(),
    ownerName: z.string().max(200).optional(),
    ownerBirthDate: z.string().max(20).optional(),
    shopType: z.string().max(50).optional(),
    sellingPlatforms: z.array(z.string().max(50)).optional(),
    sellingPlatformsOther: z.string().max(200).optional(),
    productCategories: z.array(z.string().max(50)).optional(),
    productCategoriesOther: z.string().max(200).optional(),
    expertise: z.array(z.string().max(50)).optional(),
    expertiseOther: z.string().max(200).optional(),
    degree: z.string().max(50).optional(),
    experienceYears: z.string().max(50).optional(),
    workplaceType: z.string().max(50).optional(),
    workplaceTypeOther: z.string().max(200).optional(),
    workplace: z.string().max(200).optional(),
    position: z.string().max(50).optional(),
    positionOther: z.string().max(200).optional(),
    bio: z.string().max(1000).optional(),
    stageName: z.string().max(200).optional(),
    contentTypes: z.array(z.string().max(50)).optional(),
    contentTypesOther: z.string().max(200).optional(),
    platformLinks: z.array(PlatformLinkSchema).optional(),
    priceRange: z.string().max(50).optional(),
    reviewCategories: z.array(z.string().max(50)).optional(),
    reviewCategoriesOther: z.string().max(200).optional(),
    reviewCount: z.string().max(50).optional(),
  })
  .passthrough();

function getInitialUser(): User | null {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem("user");
  if (!userData) return null;
  try {
    const parsed = JSON.parse(userData);
    const result = UserSchema.safeParse(parsed);
    if (result.success) {
      return result.data as User;
    }
    console.warn("[Security] Invalid user data in localStorage");
    return null;
  } catch {
    return null;
  }
}

function getInitialProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  const profileData = localStorage.getItem("profile");
  if (!profileData) return null;
  try {
    const parsed = JSON.parse(profileData);
    const result = ProfileSchema.safeParse(parsed);
    if (result.success) {
      return result.data as Profile;
    }
    console.warn("[Security] Invalid profile data in localStorage");
    return null;
  } catch {
    return null;
  }
}

export default function PendingPage() {
  const [user] = useState<User | null>(getInitialUser);
  const [profile] = useState<Profile | null>(getInitialProfile);

  const handleLogout = async () => {
    try {
      // Call backend logout to clear HttpOnly cookies
      await fetch(
        `${process.env.NEXT_PUBLIC_API_URL ?? "https://pro.cdhc.vn"}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );
    } catch {
      // Continue logout even if API fails
    }
    // Clear local storage data
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    window.location.href = "/login";
  };

  const renderPlatformLinks = (links: PlatformLink[]) => {
    // Filter links that have platform and valid URL
    const validLinks = links.filter(
      (l) => l.platform && l.url && isValidUrl(l.url)
    );
    if (validLinks.length === 0) return null;
    return (
      <div className="text-sm text-slate-600">
        <strong className="text-slate-700">Kênh hoạt động:</strong>
        <ul className="ml-4 mt-1 space-y-1">
          {validLinks.map((link) => (
            <li key={`${link.platform}-${link.url}`}>
              {getLabel("platforms", link.platform)}:{" "}
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                {sanitizeUrlForDisplay(link.url)}
              </a>
              {link.followers && (
                <span className="text-slate-500">
                  {" "}
                  ({getLabel("totalFollowers", link.followers)} followers)
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderProfileInfo = () => {
    if (!profile || !user) return null;

    const role = user.role;

    return (
      <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2">
        {/* Common fields */}
        {profile.fullName && (
          <InfoRow label="Họ và tên" value={profile.fullName} />
        )}
        {profile.phone && (
          <InfoRow label="Số điện thoại" value={profile.phone} />
        )}
        {profile.birthDate && (
          <InfoRow label="Ngày sinh" value={formatDate(profile.birthDate)} />
        )}

        {/* Farmer */}
        {role === "farmer" && (
          <>
            {profile.farmSize && (
              <InfoRow
                label="Quy mô"
                value={getLabel("farmSize", profile.farmSize)}
              />
            )}
            {profile.farmType && profile.farmType.length > 0 && (
              <InfoRow
                label="Loại hình canh tác"
                value={getLabels("farmType", profile.farmType)}
              />
            )}
            {profile.mainProducts && profile.mainProducts.length > 0 && (
              <InfoRow
                label="Sản phẩm chính"
                value={getLabels(
                  "mainProducts",
                  profile.mainProducts,
                  profile.mainProductsOther
                )}
              />
            )}
            {profile.hasCertificate && (
              <InfoRow
                label="Chứng nhận"
                value={
                  profile.hasCertificate === "yes" && profile.certificateType
                    ? profile.certificateType === "other" &&
                      profile.certificateTypeOther
                      ? `Khác: ${profile.certificateTypeOther}`
                      : getLabel("certificateType", profile.certificateType)
                    : getLabel("hasCertificate", profile.hasCertificate)
                }
              />
            )}
          </>
        )}

        {/* Community */}
        {role === "community" &&
          profile.interests &&
          profile.interests.length > 0 && (
            <InfoRow
              label="Quan tâm"
              value={getLabels(
                "interests",
                profile.interests,
                profile.interestsOther
              )}
            />
          )}

        {/* Business */}
        {role === "business" && (
          <>
            {profile.companyName && (
              <InfoRow label="Tên công ty" value={profile.companyName} />
            )}
            {profile.taxCode && (
              <InfoRow label="Mã số thuế" value={profile.taxCode} />
            )}
            {profile.businessType && (
              <InfoRow
                label="Loại hình"
                value={
                  profile.businessType === "other" && profile.businessTypeOther
                    ? `Khác: ${profile.businessTypeOther}`
                    : getLabel("businessType", profile.businessType)
                }
              />
            )}
            {profile.contactName && (
              <InfoRow label="Người liên hệ" value={profile.contactName} />
            )}
            {profile.contactBirthDate && (
              <InfoRow
                label="Ngày sinh người liên hệ"
                value={formatDate(profile.contactBirthDate)}
              />
            )}
            {profile.contactPosition && (
              <InfoRow
                label="Chức vụ"
                value={
                  profile.contactPosition === "other" &&
                  profile.contactPositionOther
                    ? `Khác: ${profile.contactPositionOther}`
                    : getLabel("contactPosition", profile.contactPosition)
                }
              />
            )}
            {profile.contactPhone && (
              <InfoRow label="SĐT liên hệ" value={profile.contactPhone} />
            )}
            {profile.contactEmail && (
              <InfoRow label="Email" value={profile.contactEmail} />
            )}
            {profile.website && (
              <InfoRow label="Website" value={profile.website} />
            )}
            {profile.employeeCount && (
              <InfoRow
                label="Quy mô nhân sự"
                value={getLabel("employeeCount", profile.employeeCount)}
              />
            )}
            {profile.mainProducts && profile.mainProducts.length > 0 && (
              <InfoRow
                label="Sản phẩm chính"
                value={getLabels(
                  "mainProducts",
                  profile.mainProducts,
                  profile.mainProductsOther
                )}
              />
            )}
          </>
        )}

        {/* Coop */}
        {role === "coop" && (
          <>
            {profile.coopName && (
              <InfoRow label="Tên HTX" value={profile.coopName} />
            )}
            {profile.coopCode && (
              <InfoRow label="Mã số HTX" value={profile.coopCode} />
            )}
            {profile.establishedYear && (
              <InfoRow
                label="Năm thành lập"
                value={getLabel("establishedYear", profile.establishedYear)}
              />
            )}
            {profile.representativeName && (
              <InfoRow
                label="Người đại diện"
                value={profile.representativeName}
              />
            )}
            {profile.representativeBirthDate && (
              <InfoRow
                label="Ngày sinh người đại diện"
                value={formatDate(profile.representativeBirthDate)}
              />
            )}
            {profile.representativePosition && (
              <InfoRow
                label="Chức vụ"
                value={
                  profile.representativePosition === "other" &&
                  profile.representativePositionOther
                    ? `Khác: ${profile.representativePositionOther}`
                    : getLabel(
                        "representativePosition",
                        profile.representativePosition
                      )
                }
              />
            )}
            {profile.memberCount && (
              <InfoRow
                label="Số thành viên"
                value={getLabel("memberCount", profile.memberCount)}
              />
            )}
            {profile.farmArea && (
              <InfoRow
                label="Diện tích canh tác"
                value={getLabel("farmArea", profile.farmArea)}
              />
            )}
            {profile.mainProducts && profile.mainProducts.length > 0 && (
              <InfoRow
                label="Sản phẩm chính"
                value={getLabels(
                  "mainProducts",
                  profile.mainProducts,
                  profile.mainProductsOther
                )}
              />
            )}
            {profile.hasCertificate && (
              <InfoRow
                label="Chứng nhận"
                value={
                  profile.hasCertificate === "yes" && profile.certificateType
                    ? profile.certificateType === "other" &&
                      profile.certificateTypeOther
                      ? `Khác: ${profile.certificateTypeOther}`
                      : getLabel("certificateType", profile.certificateType)
                    : getLabel("hasCertificate", profile.hasCertificate)
                }
              />
            )}
            {profile.hasWebsite && (
              <InfoRow
                label="Website"
                value={
                  profile.hasWebsite === "yes" && profile.website
                    ? profile.website
                    : getLabel("hasWebsite", profile.hasWebsite)
                }
              />
            )}
          </>
        )}

        {/* Shop */}
        {role === "shop" && (
          <>
            {profile.shopName && (
              <InfoRow label="Tên cửa hàng" value={profile.shopName} />
            )}
            {profile.ownerName && (
              <InfoRow label="Chủ shop" value={profile.ownerName} />
            )}
            {profile.ownerBirthDate && (
              <InfoRow
                label="Ngày sinh chủ shop"
                value={formatDate(profile.ownerBirthDate)}
              />
            )}
            {profile.shopType && (
              <InfoRow
                label="Hình thức"
                value={getLabel("shopType", profile.shopType)}
              />
            )}
            {profile.sellingPlatforms &&
              profile.sellingPlatforms.length > 0 && (
                <InfoRow
                  label="Nền tảng bán hàng"
                  value={getLabels(
                    "sellingPlatforms",
                    profile.sellingPlatforms,
                    profile.sellingPlatformsOther
                  )}
                />
              )}
            {profile.productCategories &&
              profile.productCategories.length > 0 && (
                <InfoRow
                  label="Danh mục sản phẩm"
                  value={getLabels(
                    "productCategories",
                    profile.productCategories,
                    profile.productCategoriesOther
                  )}
                />
              )}
            {profile.website && (
              <InfoRow label="Website" value={profile.website} />
            )}
          </>
        )}

        {/* Expert */}
        {role === "expert" && (
          <>
            {profile.expertise && profile.expertise.length > 0 && (
              <InfoRow
                label="Chuyên môn"
                value={getLabels(
                  "expertise",
                  profile.expertise,
                  profile.expertiseOther
                )}
              />
            )}
            {profile.degree && (
              <InfoRow
                label="Trình độ"
                value={getLabel("degree", profile.degree)}
              />
            )}
            {profile.experienceYears && (
              <InfoRow
                label="Kinh nghiệm"
                value={getLabel("experienceYears", profile.experienceYears)}
              />
            )}
            {profile.workplaceType && (
              <InfoRow
                label="Loại nơi làm việc"
                value={
                  profile.workplaceType === "other" &&
                  profile.workplaceTypeOther
                    ? `Khác: ${profile.workplaceTypeOther}`
                    : getLabel("workplaceType", profile.workplaceType)
                }
              />
            )}
            {profile.workplace && (
              <InfoRow label="Nơi làm việc" value={profile.workplace} />
            )}
            {profile.position && (
              <InfoRow
                label="Chức vụ"
                value={
                  profile.position === "other" && profile.positionOther
                    ? `Khác: ${profile.positionOther}`
                    : getLabel("position", profile.position)
                }
              />
            )}
            {profile.bio && <InfoRow label="Giới thiệu" value={profile.bio} />}
          </>
        )}

        {/* KOL */}
        {role === "kol" && (
          <>
            {profile.stageName && (
              <InfoRow label="Tên nghệ danh" value={profile.stageName} />
            )}
            {profile.contentTypes && profile.contentTypes.length > 0 && (
              <InfoRow
                label="Loại nội dung"
                value={getLabels(
                  "contentTypes",
                  profile.contentTypes,
                  profile.contentTypesOther
                )}
              />
            )}
            {profile.platformLinks &&
              renderPlatformLinks(profile.platformLinks)}
            {profile.priceRange && (
              <InfoRow
                label="Mức giá"
                value={getLabel("priceRange", profile.priceRange)}
              />
            )}
            {profile.bio && <InfoRow label="Giới thiệu" value={profile.bio} />}
          </>
        )}

        {/* KOC */}
        {role === "koc" && (
          <>
            {profile.reviewCategories &&
              profile.reviewCategories.length > 0 && (
                <InfoRow
                  label="Danh mục review"
                  value={getLabels(
                    "reviewCategories",
                    profile.reviewCategories,
                    profile.reviewCategoriesOther
                  )}
                />
              )}
            {profile.platformLinks &&
              renderPlatformLinks(profile.platformLinks)}
            {profile.reviewCount && (
              <InfoRow
                label="Số bài review"
                value={getLabel("reviewCount", profile.reviewCount)}
              />
            )}
            {profile.priceRange && (
              <InfoRow
                label="Mức giá"
                value={getLabel("priceRange", profile.priceRange)}
              />
            )}
            {profile.bio && <InfoRow label="Giới thiệu" value={profile.bio} />}
          </>
        )}

        {/* Address (common for roles that have it) */}
        {profile.address && <InfoRow label="Địa chỉ" value={profile.address} />}
      </div>
    );
  };

  return (
    <div className="min-h-screen gradient-hero flex items-center justify-center px-6 py-8">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        {/* Icon / Avatar */}
        {user?.picture ? (
          <Image
            src={user.picture}
            alt={user.name}
            width={80}
            height={80}
            className="mx-auto mb-6 rounded-full"
          />
        ) : (
          <div className="w-20 h-20 mx-auto mb-6 bg-amber-100 rounded-full flex items-center justify-center">
            <span className="text-4xl">⏳</span>
          </div>
        )}

        {/* Title */}
        <h1
          className="text-2xl font-bold text-slate-800 mb-2"
          style={{ fontFamily: "var(--font-serif)" }}
        >
          Đang chờ phê duyệt
        </h1>

        <p className="text-slate-500 mb-6">
          Tài khoản{" "}
          <strong className="text-green-600">
            {ROLE_LABELS[user?.role ?? ""] ?? user?.role}
          </strong>{" "}
          của bạn đang được xem xét
        </p>

        {/* User Info */}
        {user && (
          <div className="bg-green-50 rounded-xl p-4 mb-4 text-left">
            <p className="text-sm text-green-800">
              <strong>Họ tên:</strong> {user.name}
            </p>
            <p className="text-sm text-green-800 mt-1">
              <strong>Email:</strong> {user.email}
            </p>
          </div>
        )}

        {/* Profile Info */}
        {renderProfileInfo()}

        {/* Info */}
        <div className="bg-amber-50 rounded-xl p-4 mb-6 text-left">
          <p className="text-sm text-amber-700">
            Chúng tôi sẽ gửi email thông báo khi tài khoản được phê duyệt
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Link
            href="/"
            className="py-3 gradient-primary text-white rounded-full font-semibold text-center"
          >
            Về trang chủ
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="py-3 border-2 border-slate-200 rounded-full font-semibold text-slate-600 hover:bg-slate-50"
          >
            Đăng nhập tài khoản khác
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <p className="text-sm text-slate-600">
      <strong className="text-slate-700">{label}:</strong> {value}
    </p>
  );
}
