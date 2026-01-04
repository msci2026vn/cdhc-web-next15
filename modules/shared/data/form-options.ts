// Form options cho các role khác nhau

// ===== FARMER OPTIONS =====
export const FARM_SIZE_OPTIONS = [
  { value: "under_1ha", label: "Dưới 1 ha" },
  { value: "1_5ha", label: "1-5 ha" },
  { value: "5_10ha", label: "5-10 ha" },
  { value: "over_10ha", label: "Trên 10 ha" },
];

export const FARM_TYPE_OPTIONS = [
  { value: "vegetables", label: "Rau củ" },
  { value: "fruits", label: "Trái cây" },
  { value: "rice", label: "Lúa gạo" },
  { value: "livestock", label: "Chăn nuôi" },
  { value: "aquaculture", label: "Thủy sản" },
  { value: "mixed", label: "Tổng hợp" },
];

export const FARMER_PRODUCTS = [
  { value: "vegetables", label: "Rau xanh" },
  { value: "tubers", label: "Củ quả" },
  { value: "fruits", label: "Trái cây" },
  { value: "rice", label: "Gạo" },
  { value: "eggs", label: "Trứng" },
  { value: "meat", label: "Thịt" },
  { value: "seafood", label: "Hải sản" },
  { value: "herbs", label: "Thảo dược" },
  { value: "honey", label: "Mật ong" },
  { value: "mushroom", label: "Nấm" },
];

export const CERTIFICATE_TYPES = [
  { value: "none", label: "Chưa có" },
  { value: "pgs", label: "PGS" },
  { value: "organic_vn", label: "Organic VN" },
  { value: "vietgap", label: "VietGAP" },
  { value: "globalgap", label: "GlobalGAP" },
  { value: "usda", label: "USDA Organic" },
  { value: "eu", label: "EU Organic" },
];

// ===== COMMUNITY OPTIONS =====
export const INTEREST_OPTIONS = [
  { value: "buy_organic", label: "Mua nông sản hữu cơ" },
  { value: "learn_farming", label: "Học làm nông" },
  { value: "health", label: "Sức khỏe dinh dưỡng" },
  { value: "environment", label: "Bảo vệ môi trường" },
  { value: "cooking", label: "Nấu ăn healthy" },
  { value: "gardening", label: "Làm vườn tại nhà" },
];

// ===== BUSINESS OPTIONS =====
export const BUSINESS_TYPES = [
  { value: "processor", label: "Chế biến nông sản" },
  { value: "exporter", label: "Xuất khẩu" },
  { value: "importer", label: "Nhập khẩu" },
  { value: "distributor", label: "Phân phối" },
  { value: "retailer", label: "Bán lẻ" },
  { value: "restaurant", label: "Nhà hàng/F&B" },
  { value: "tech", label: "Công nghệ nông nghiệp" },
];

export const POSITION_OPTIONS = [
  { value: "owner", label: "Chủ doanh nghiệp" },
  { value: "director", label: "Giám đốc" },
  { value: "manager", label: "Quản lý" },
  { value: "staff", label: "Nhân viên" },
];

export const EMPLOYEE_COUNT_OPTIONS = [
  { value: "1_10", label: "1-10 người" },
  { value: "11_50", label: "11-50 người" },
  { value: "51_200", label: "51-200 người" },
  { value: "over_200", label: "Trên 200 người" },
];

// ===== COOP OPTIONS =====
export const COOP_TYPES = [
  { value: "production", label: "Sản xuất" },
  { value: "service", label: "Dịch vụ" },
  { value: "trading", label: "Thương mại" },
  { value: "mixed", label: "Tổng hợp" },
];

export const MEMBER_COUNT_OPTIONS = [
  { value: "under_20", label: "Dưới 20 thành viên" },
  { value: "20_50", label: "20-50 thành viên" },
  { value: "50_100", label: "50-100 thành viên" },
  { value: "over_100", label: "Trên 100 thành viên" },
];

// ===== SHOP OPTIONS =====
export const SHOP_TYPES = [
  { value: "online", label: "Online" },
  { value: "offline", label: "Cửa hàng vật lý" },
  { value: "both", label: "Cả hai" },
];

export const PRODUCT_CATEGORIES = [
  { value: "fresh", label: "Nông sản tươi" },
  { value: "processed", label: "Thực phẩm chế biến" },
  { value: "dried", label: "Đồ khô" },
  { value: "beverages", label: "Đồ uống" },
  { value: "supplements", label: "Thực phẩm chức năng" },
  { value: "cosmetics", label: "Mỹ phẩm hữu cơ" },
];

// ===== EXPERT OPTIONS =====
export const EXPERTISE_AREAS = [
  { value: "soil", label: "Đất & phân bón" },
  { value: "pest", label: "Sâu bệnh" },
  { value: "irrigation", label: "Tưới tiêu" },
  { value: "harvest", label: "Thu hoạch & bảo quản" },
  { value: "certification", label: "Chứng nhận hữu cơ" },
  { value: "marketing", label: "Marketing nông sản" },
  { value: "technology", label: "Công nghệ nông nghiệp" },
];

export const EXPERIENCE_YEARS_OPTIONS = [
  { value: "1_3", label: "1-3 năm" },
  { value: "3_5", label: "3-5 năm" },
  { value: "5_10", label: "5-10 năm" },
  { value: "over_10", label: "Trên 10 năm" },
];

// ===== KOL OPTIONS =====
export const PLATFORM_OPTIONS = [
  { value: "facebook", label: "Facebook" },
  { value: "youtube", label: "YouTube" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "blog", label: "Blog/Website" },
];

export const FOLLOWER_COUNT_OPTIONS = [
  { value: "under_10k", label: "Dưới 10K" },
  { value: "10k_50k", label: "10K-50K" },
  { value: "50k_100k", label: "50K-100K" },
  { value: "100k_500k", label: "100K-500K" },
  { value: "over_500k", label: "Trên 500K" },
];

export const CONTENT_TYPES = [
  { value: "review", label: "Review sản phẩm" },
  { value: "recipe", label: "Công thức nấu ăn" },
  { value: "lifestyle", label: "Lifestyle" },
  { value: "education", label: "Giáo dục" },
  { value: "entertainment", label: "Giải trí" },
];

// ===== KOC OPTIONS =====
export const REVIEW_EXPERIENCE_OPTIONS = [
  { value: "beginner", label: "Mới bắt đầu" },
  { value: "intermediate", label: "Đã có kinh nghiệm" },
  { value: "experienced", label: "Nhiều kinh nghiệm" },
];

export const REVIEW_CATEGORIES = [
  { value: "food", label: "Thực phẩm" },
  { value: "health", label: "Sức khỏe" },
  { value: "beauty", label: "Làm đẹp" },
  { value: "home", label: "Đồ gia dụng" },
  { value: "baby", label: "Mẹ & bé" },
];
