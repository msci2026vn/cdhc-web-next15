"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface User {
  name: string;
  email: string;
  role: string;
  picture?: string;
}

interface Profile {
  phone?: string;
  // Farmer
  farmName?: string;
  farmSize?: string;
  farmType?: string;
  products?: string[];
  certificate?: string;
  // Business
  companyName?: string;
  businessType?: string;
  position?: string;
  employeeCount?: string;
  // Coop
  coopName?: string;
  coopType?: string;
  memberCount?: string;
  // Shop
  shopName?: string;
  shopType?: string;
  categories?: string[];
  website?: string;
  // Expert
  title?: string;
  organization?: string;
  expertise?: string[];
  experience?: string;
  bio?: string;
  // KOL
  nickname?: string;
  platforms?: string[];
  followers?: string;
  contentTypes?: string[];
  profileUrl?: string;
  // KOC
  reviewExperience?: string;
  reviewCategories?: string[];
  // Community
  interests?: string[];
  // Location
  provinceCode?: string;
  wardCode?: string;
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

// Labels cho các field
const FIELD_LABELS: Record<string, Record<string, string>> = {
  farmSize: {
    under_1ha: "Dưới 1 ha",
    "1_5ha": "1-5 ha",
    "5_10ha": "5-10 ha",
    over_10ha: "Trên 10 ha",
  },
  farmType: {
    vegetables: "Rau củ",
    fruits: "Trái cây",
    rice: "Lúa gạo",
    livestock: "Chăn nuôi",
    aquaculture: "Thủy sản",
    mixed: "Tổng hợp",
  },
  products: {
    vegetables: "Rau xanh",
    tubers: "Củ quả",
    fruits: "Trái cây",
    rice: "Gạo",
    eggs: "Trứng",
    meat: "Thịt",
    seafood: "Hải sản",
    herbs: "Thảo dược",
    honey: "Mật ong",
    mushroom: "Nấm",
  },
  certificate: {
    none: "Chưa có",
    pgs: "PGS",
    organic_vn: "Organic VN",
    vietgap: "VietGAP",
    globalgap: "GlobalGAP",
    usda: "USDA Organic",
    eu: "EU Organic",
  },
  businessType: {
    processor: "Chế biến nông sản",
    exporter: "Xuất khẩu",
    importer: "Nhập khẩu",
    distributor: "Phân phối",
    retailer: "Bán lẻ",
    restaurant: "Nhà hàng/F&B",
    tech: "Công nghệ nông nghiệp",
  },
  position: {
    owner: "Chủ doanh nghiệp",
    director: "Giám đốc",
    manager: "Quản lý",
    staff: "Nhân viên",
  },
  employeeCount: {
    "1_10": "1-10 người",
    "11_50": "11-50 người",
    "51_200": "51-200 người",
    over_200: "Trên 200 người",
  },
  coopType: {
    production: "Sản xuất",
    service: "Dịch vụ",
    trading: "Thương mại",
    mixed: "Tổng hợp",
  },
  memberCount: {
    under_20: "Dưới 20 thành viên",
    "20_50": "20-50 thành viên",
    "50_100": "50-100 thành viên",
    over_100: "Trên 100 thành viên",
  },
  shopType: {
    online: "Online",
    offline: "Cửa hàng vật lý",
    both: "Cả hai",
  },
  categories: {
    fresh: "Nông sản tươi",
    processed: "Thực phẩm chế biến",
    dried: "Đồ khô",
    beverages: "Đồ uống",
    supplements: "Thực phẩm chức năng",
    cosmetics: "Mỹ phẩm hữu cơ",
  },
  expertise: {
    soil: "Đất & phân bón",
    pest: "Sâu bệnh",
    irrigation: "Tưới tiêu",
    harvest: "Thu hoạch & bảo quản",
    certification: "Chứng nhận hữu cơ",
    marketing: "Marketing nông sản",
    technology: "Công nghệ nông nghiệp",
  },
  experience: {
    "1_3": "1-3 năm",
    "3_5": "3-5 năm",
    "5_10": "5-10 năm",
    over_10: "Trên 10 năm",
  },
  platforms: {
    facebook: "Facebook",
    youtube: "YouTube",
    tiktok: "TikTok",
    instagram: "Instagram",
    blog: "Blog/Website",
  },
  followers: {
    under_10k: "Dưới 10K",
    "10k_50k": "10K-50K",
    "50k_100k": "50K-100K",
    "100k_500k": "100K-500K",
    over_500k: "Trên 500K",
  },
  contentTypes: {
    review: "Review sản phẩm",
    recipe: "Công thức nấu ăn",
    lifestyle: "Lifestyle",
    education: "Giáo dục",
    entertainment: "Giải trí",
  },
  reviewExperience: {
    beginner: "Mới bắt đầu",
    intermediate: "Đã có kinh nghiệm",
    experienced: "Nhiều kinh nghiệm",
  },
  reviewCategories: {
    food: "Thực phẩm",
    health: "Sức khỏe",
    beauty: "Làm đẹp",
    home: "Đồ gia dụng",
    baby: "Mẹ & bé",
  },
  interests: {
    buy_organic: "Mua nông sản hữu cơ",
    learn_farming: "Học làm nông",
    health: "Sức khỏe dinh dưỡng",
    environment: "Bảo vệ môi trường",
    cooking: "Nấu ăn healthy",
    gardening: "Làm vườn tại nhà",
  },
};

function getLabel(field: string, value: string): string {
  return FIELD_LABELS[field]?.[value] ?? value;
}

function getLabels(field: string, values: string[]): string {
  return values.map((v) => getLabel(field, v)).join(", ");
}

function getInitialUser(): User | null {
  if (typeof window === "undefined") return null;
  const userData = localStorage.getItem("user");
  if (!userData) return null;
  try {
    return JSON.parse(userData) as User;
  } catch {
    return null;
  }
}

function getInitialProfile(): Profile | null {
  if (typeof window === "undefined") return null;
  const profileData = localStorage.getItem("profile");
  if (!profileData) return null;
  try {
    return JSON.parse(profileData) as Profile;
  } catch {
    return null;
  }
}

export default function PendingPage() {
  const [user] = useState<User | null>(getInitialUser);
  const [profile] = useState<Profile | null>(getInitialProfile);

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    localStorage.removeItem("profile");
    window.location.href = "/login";
  };

  const renderProfileInfo = () => {
    if (!profile || !user) return null;

    const role = user.role;

    return (
      <div className="bg-slate-50 rounded-xl p-4 mb-6 text-left space-y-2">
        {/* Common fields */}
        {profile.phone && (
          <InfoRow label="Số điện thoại" value={profile.phone} />
        )}

        {/* Farmer */}
        {role === "farmer" && (
          <>
            {profile.farmName && (
              <InfoRow label="Tên nông trại" value={profile.farmName} />
            )}
            {profile.farmSize && (
              <InfoRow
                label="Quy mô"
                value={getLabel("farmSize", profile.farmSize)}
              />
            )}
            {profile.farmType && (
              <InfoRow
                label="Loại hình"
                value={getLabel("farmType", profile.farmType)}
              />
            )}
            {profile.products && profile.products.length > 0 && (
              <InfoRow
                label="Sản phẩm chính"
                value={getLabels("products", profile.products)}
              />
            )}
            {profile.certificate && (
              <InfoRow
                label="Chứng nhận"
                value={getLabel("certificate", profile.certificate)}
              />
            )}
          </>
        )}

        {/* Business */}
        {role === "business" && (
          <>
            {profile.companyName && (
              <InfoRow label="Tên công ty" value={profile.companyName} />
            )}
            {profile.businessType && (
              <InfoRow
                label="Loại hình"
                value={getLabel("businessType", profile.businessType)}
              />
            )}
            {profile.position && (
              <InfoRow
                label="Chức vụ"
                value={getLabel("position", profile.position)}
              />
            )}
            {profile.employeeCount && (
              <InfoRow
                label="Quy mô"
                value={getLabel("employeeCount", profile.employeeCount)}
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
            {profile.coopType && (
              <InfoRow
                label="Loại hình"
                value={getLabel("coopType", profile.coopType)}
              />
            )}
            {profile.memberCount && (
              <InfoRow
                label="Số thành viên"
                value={getLabel("memberCount", profile.memberCount)}
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
            {profile.shopType && (
              <InfoRow
                label="Hình thức"
                value={getLabel("shopType", profile.shopType)}
              />
            )}
            {profile.categories && profile.categories.length > 0 && (
              <InfoRow
                label="Danh mục"
                value={getLabels("categories", profile.categories)}
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
            {profile.title && (
              <InfoRow label="Chức danh" value={profile.title} />
            )}
            {profile.organization && (
              <InfoRow label="Tổ chức" value={profile.organization} />
            )}
            {profile.expertise && profile.expertise.length > 0 && (
              <InfoRow
                label="Chuyên môn"
                value={getLabels("expertise", profile.expertise)}
              />
            )}
            {profile.experience && (
              <InfoRow
                label="Kinh nghiệm"
                value={getLabel("experience", profile.experience)}
              />
            )}
            {profile.bio && <InfoRow label="Giới thiệu" value={profile.bio} />}
          </>
        )}

        {/* KOL */}
        {role === "kol" && (
          <>
            {profile.nickname && (
              <InfoRow label="Tên nghệ danh" value={profile.nickname} />
            )}
            {profile.platforms && profile.platforms.length > 0 && (
              <InfoRow
                label="Nền tảng"
                value={getLabels("platforms", profile.platforms)}
              />
            )}
            {profile.followers && (
              <InfoRow
                label="Số followers"
                value={getLabel("followers", profile.followers)}
              />
            )}
            {profile.contentTypes && profile.contentTypes.length > 0 && (
              <InfoRow
                label="Loại nội dung"
                value={getLabels("contentTypes", profile.contentTypes)}
              />
            )}
            {profile.profileUrl && (
              <InfoRow label="Link profile" value={profile.profileUrl} />
            )}
          </>
        )}

        {/* KOC */}
        {role === "koc" && (
          <>
            {profile.nickname && (
              <InfoRow label="Tên" value={profile.nickname} />
            )}
            {profile.reviewExperience && (
              <InfoRow
                label="Kinh nghiệm review"
                value={getLabel("reviewExperience", profile.reviewExperience)}
              />
            )}
            {profile.reviewCategories &&
              profile.reviewCategories.length > 0 && (
                <InfoRow
                  label="Danh mục quan tâm"
                  value={getLabels(
                    "reviewCategories",
                    profile.reviewCategories
                  )}
                />
              )}
            {profile.platforms && profile.platforms.length > 0 && (
              <InfoRow
                label="Nền tảng"
                value={getLabels("platforms", profile.platforms)}
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
              value={getLabels("interests", profile.interests)}
            />
          )}
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
            📧 Chúng tôi sẽ gửi email thông báo khi tài khoản được phê duyệt
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
