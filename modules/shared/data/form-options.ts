// Form options cho các role khác nhau - CẬP NHẬT THEO YÊU CẦU MỚI

// ===== FARMER OPTIONS =====
export const FARM_SIZE_OPTIONS = [
  { value: "under_1sao", label: "< 1 sào" },
  { value: "1_3sao", label: "1-3 sào" },
  { value: "3_5sao", label: "3-5 sào" },
  { value: "5_10sao", label: "5-10 sào" },
  { value: "10_20sao", label: "10-20 sào" },
  { value: "over_20sao", label: "> 20 sào" },
];

export const FARM_TYPE_OPTIONS = [
  { value: "crops", label: "Trồng trọt" },
  { value: "livestock", label: "Chăn nuôi" },
  { value: "aquaculture", label: "Thủy sản" },
  { value: "forestry", label: "Lâm nghiệp" },
];

export const FARMER_PRODUCTS = [
  { value: "rice", label: "Lúa" },
  { value: "vegetables", label: "Rau màu" },
  { value: "fruits", label: "Trái cây" },
  { value: "cattle", label: "Gia súc" },
  { value: "poultry", label: "Gia cầm" },
  { value: "seafood", label: "Thủy sản" },
  { value: "industrial_crops", label: "Cây công nghiệp" },
  { value: "other", label: "Khác" },
];

export const CERTIFICATE_TYPES = [
  { value: "pgs", label: "PGS" },
  { value: "usda", label: "USDA Organic" },
  { value: "eu", label: "EU Organic" },
  { value: "jas", label: "JAS" },
  { value: "other", label: "Khác" },
];

// ===== COMMUNITY OPTIONS =====
export const COMMUNITY_INTERESTS = [
  { value: "vegetables", label: "Rau củ" },
  { value: "fruits", label: "Trái cây" },
  { value: "rice", label: "Gạo" },
  { value: "meat", label: "Thịt" },
  { value: "eggs", label: "Trứng" },
  { value: "milk", label: "Sữa" },
  { value: "processed", label: "Thực phẩm chế biến" },
  { value: "beverages", label: "Đồ uống" },
  { value: "cosmetics", label: "Mỹ phẩm hữu cơ" },
];

// ===== BUSINESS OPTIONS =====
export const BUSINESS_TYPES = [
  { value: "export", label: "Xuất khẩu" },
  { value: "import", label: "Nhập khẩu" },
  { value: "processing", label: "Chế biến" },
  { value: "distribution", label: "Phân phối" },
  { value: "retail", label: "Bán lẻ" },
  { value: "production", label: "Sản xuất" },
  { value: "logistics", label: "Logistics" },
];

export const CONTACT_POSITION_OPTIONS = [
  { value: "director", label: "Giám đốc" },
  { value: "deputy_director", label: "Phó GĐ" },
  { value: "head_department", label: "Trưởng phòng" },
  { value: "staff", label: "Nhân viên" },
  { value: "owner", label: "Chủ sở hữu" },
  { value: "other", label: "Khác" },
];

export const EMPLOYEE_COUNT_OPTIONS = [
  { value: "under_10", label: "< 10" },
  { value: "10_50", label: "10-50" },
  { value: "50_100", label: "50-100" },
  { value: "100_200", label: "100-200" },
  { value: "200_500", label: "200-500" },
  { value: "over_500", label: "> 500" },
];

export const BUSINESS_PRODUCTS = [
  { value: "vegetables", label: "Rau củ" },
  { value: "fruits", label: "Trái cây" },
  { value: "rice", label: "Gạo" },
  { value: "meat", label: "Thịt" },
  { value: "seafood", label: "Thủy sản" },
  { value: "spices", label: "Gia vị" },
  { value: "beverages", label: "Đồ uống" },
  { value: "processed", label: "Thực phẩm chế biến" },
];

// ===== COOP OPTIONS =====
export const ESTABLISHED_YEAR_OPTIONS = [
  { value: "before_2000", label: "Trước 2000" },
  { value: "2000_2010", label: "2000-2010" },
  { value: "2010_2015", label: "2010-2015" },
  { value: "2015_2020", label: "2015-2020" },
  { value: "2020_2024", label: "2020-2024" },
  { value: "2024_now", label: "2024-nay" },
];

export const COOP_POSITION_OPTIONS = [
  { value: "director", label: "Giám đốc" },
  { value: "deputy_director", label: "Phó GĐ" },
  { value: "chairman", label: "Chủ tịch HĐQT" },
  { value: "vice_chairman", label: "Phó CT HĐQT" },
  { value: "chief_accountant", label: "Kế toán trưởng" },
  { value: "other", label: "Khác" },
];

export const COOP_MEMBER_COUNT_OPTIONS = [
  { value: "under_10", label: "< 10" },
  { value: "10_30", label: "10-30" },
  { value: "30_50", label: "30-50" },
  { value: "50_100", label: "50-100" },
  { value: "100_200", label: "100-200" },
  { value: "over_200", label: "> 200" },
];

export const COOP_EMPLOYEE_COUNT_OPTIONS = [
  { value: "under_5", label: "< 5" },
  { value: "5_10", label: "5-10" },
  { value: "10_20", label: "10-20" },
  { value: "20_50", label: "20-50" },
  { value: "over_50", label: "> 50" },
];

export const COOP_FARM_AREA_OPTIONS = [
  { value: "under_5ha", label: "< 5 ha" },
  { value: "5_10ha", label: "5-10 ha" },
  { value: "10_30ha", label: "10-30 ha" },
  { value: "30_50ha", label: "30-50 ha" },
  { value: "50_100ha", label: "50-100 ha" },
  { value: "over_100ha", label: "> 100 ha" },
];

export const COOP_PRODUCTS = [
  { value: "rice", label: "Lúa" },
  { value: "vegetables", label: "Rau màu" },
  { value: "fruits", label: "Trái cây" },
  { value: "coffee", label: "Cà phê" },
  { value: "tea", label: "Chè" },
  { value: "pepper", label: "Tiêu" },
  { value: "cashew", label: "Điều" },
  { value: "seafood", label: "Thủy sản" },
  { value: "cattle", label: "Gia súc" },
  { value: "poultry", label: "Gia cầm" },
];

export const COOP_CERTIFICATE_TYPES = [
  { value: "pgs", label: "PGS" },
  { value: "usda", label: "USDA Organic" },
  { value: "eu", label: "EU Organic" },
  { value: "vietgap", label: "VietGAP" },
  { value: "globalgap", label: "GlobalGAP" },
  { value: "other", label: "Khác" },
];

// ===== SHOP OPTIONS =====
export const SHOP_TYPE_OPTIONS = [
  { value: "offline", label: "Cửa hàng (offline)" },
  { value: "online", label: "Online" },
  { value: "both", label: "Cả hai" },
];

export const SELLING_PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "shopee", label: "Shopee" },
  { value: "lazada", label: "Lazada" },
  { value: "tiki", label: "Tiki" },
  { value: "tiktok_shop", label: "TikTok Shop" },
  { value: "website", label: "Website riêng" },
  { value: "zalo", label: "Zalo" },
  { value: "other", label: "Khác" },
];

export const SHOP_PRODUCT_CATEGORIES = [
  { value: "vegetables", label: "Rau củ" },
  { value: "fruits", label: "Trái cây" },
  { value: "rice", label: "Gạo" },
  { value: "meat", label: "Thịt" },
  { value: "eggs", label: "Trứng" },
  { value: "milk", label: "Sữa" },
  { value: "dried", label: "Đồ khô" },
  { value: "spices", label: "Gia vị" },
  { value: "beverages", label: "Đồ uống" },
  { value: "cosmetics", label: "Mỹ phẩm" },
];

// ===== EXPERT OPTIONS =====
export const EXPERT_EXPERTISE = [
  { value: "crops", label: "Trồng trọt" },
  { value: "livestock", label: "Chăn nuôi" },
  { value: "aquaculture", label: "Thủy sản" },
  { value: "forestry", label: "Lâm nghiệp" },
  { value: "processing", label: "Chế biến" },
  { value: "preservation", label: "Bảo quản" },
  { value: "organic_fertilizer", label: "Phân bón hữu cơ" },
  { value: "pest_control", label: "Phòng trừ sâu bệnh" },
  { value: "marketing", label: "Marketing nông sản" },
];

export const EXPERT_DEGREE_OPTIONS = [
  { value: "bachelor", label: "Cử nhân" },
  { value: "engineer", label: "Kỹ sư" },
  { value: "master", label: "Thạc sĩ" },
  { value: "doctor", label: "Tiến sĩ" },
  { value: "assoc_professor", label: "PGS" },
  { value: "professor", label: "GS" },
];

export const EXPERT_EXPERIENCE_OPTIONS = [
  { value: "under_2", label: "< 2 năm" },
  { value: "2_5", label: "2-5 năm" },
  { value: "5_10", label: "5-10 năm" },
  { value: "10_20", label: "10-20 năm" },
  { value: "over_20", label: "> 20 năm" },
];

export const EXPERT_WORKPLACE_TYPE_OPTIONS = [
  { value: "university", label: "Trường đại học" },
  { value: "research", label: "Viện nghiên cứu" },
  { value: "enterprise", label: "Doanh nghiệp" },
  { value: "freelance", label: "Tự do" },
  { value: "other", label: "Khác" },
];

export const EXPERT_POSITION_OPTIONS = [
  { value: "lecturer", label: "Giảng viên" },
  { value: "researcher", label: "Nghiên cứu viên" },
  { value: "manager", label: "Quản lý" },
  { value: "consultant", label: "Tư vấn viên" },
  { value: "other", label: "Khác" },
];

// ===== KOL OPTIONS =====
export const KOL_CONTENT_TYPES = [
  { value: "food", label: "Ẩm thực" },
  { value: "health", label: "Sức khỏe" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "agriculture", label: "Nông nghiệp" },
  { value: "beauty", label: "Làm đẹp" },
  { value: "travel", label: "Du lịch" },
  { value: "family", label: "Gia đình" },
];

export const KOL_PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "blog", label: "Blog" },
  { value: "podcast", label: "Podcast" },
];

export const KOL_FOLLOWER_OPTIONS = [
  { value: "under_10k", label: "< 10K" },
  { value: "10k_50k", label: "10K-50K" },
  { value: "50k_100k", label: "50K-100K" },
  { value: "100k_500k", label: "100K-500K" },
  { value: "500k_1m", label: "500K-1M" },
  { value: "over_1m", label: "> 1M" },
];

export const KOL_ENGAGEMENT_OPTIONS = [
  { value: "under_1", label: "< 1%" },
  { value: "1_3", label: "1-3%" },
  { value: "3_5", label: "3-5%" },
  { value: "5_10", label: "5-10%" },
  { value: "over_10", label: "> 10%" },
];

export const KOL_PRICE_OPTIONS = [
  { value: "under_2m", label: "< 2 triệu" },
  { value: "2_5m", label: "2-5 triệu" },
  { value: "5_10m", label: "5-10 triệu" },
  { value: "10_20m", label: "10-20 triệu" },
  { value: "20_50m", label: "20-50 triệu" },
  { value: "over_50m", label: "> 50 triệu" },
];

// ===== KOC OPTIONS =====
export const KOC_REVIEW_CATEGORIES = [
  { value: "food", label: "Thực phẩm" },
  { value: "beverages", label: "Đồ uống" },
  { value: "cosmetics", label: "Mỹ phẩm hữu cơ" },
  { value: "household", label: "Đồ gia dụng" },
  { value: "fashion", label: "Thời trang bền vững" },
];

export const KOC_PLATFORMS = [
  { value: "facebook", label: "Facebook" },
  { value: "tiktok", label: "TikTok" },
  { value: "shopee", label: "Shopee" },
  { value: "lazada", label: "Lazada" },
  { value: "youtube", label: "YouTube" },
  { value: "instagram", label: "Instagram" },
];

export const KOC_FOLLOWER_OPTIONS = [
  { value: "under_1k", label: "< 1K" },
  { value: "1k_5k", label: "1K-5K" },
  { value: "5k_10k", label: "5K-10K" },
  { value: "10k_50k", label: "10K-50K" },
  { value: "50k_100k", label: "50K-100K" },
  { value: "over_100k", label: "> 100K" },
];

export const KOC_REVIEW_COUNT_OPTIONS = [
  { value: "under_10", label: "< 10" },
  { value: "10_30", label: "10-30" },
  { value: "30_50", label: "30-50" },
  { value: "50_100", label: "50-100" },
  { value: "over_100", label: "> 100" },
];

export const KOC_PRICE_OPTIONS = [
  { value: "under_500k", label: "< 500K" },
  { value: "500k_1m", label: "500K-1 triệu" },
  { value: "1_2m", label: "1-2 triệu" },
  { value: "2_5m", label: "2-5 triệu" },
  { value: "over_5m", label: "> 5 triệu" },
];
