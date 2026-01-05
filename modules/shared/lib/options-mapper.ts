/**
 * Options Mapper Utility
 * Maps form option values to human-readable Vietnamese labels
 */

import {
  BUSINESS_PRODUCTS,
  BUSINESS_TYPES,
  CERTIFICATE_TYPES,
  COMMUNITY_INTERESTS,
  CONTACT_POSITION_OPTIONS,
  COOP_CERTIFICATE_TYPES,
  COOP_EMPLOYEE_COUNT_OPTIONS,
  COOP_FARM_AREA_OPTIONS,
  COOP_MEMBER_COUNT_OPTIONS,
  COOP_POSITION_OPTIONS,
  COOP_PRODUCTS,
  EMPLOYEE_COUNT_OPTIONS,
  ESTABLISHED_YEAR_OPTIONS,
  EXPERT_DEGREE_OPTIONS,
  EXPERT_EXPERIENCE_OPTIONS,
  EXPERT_EXPERTISE,
  EXPERT_POSITION_OPTIONS,
  EXPERT_WORKPLACE_TYPE_OPTIONS,
  FARM_SIZE_OPTIONS,
  FARM_TYPE_OPTIONS,
  FARMER_PRODUCTS,
  KOC_FOLLOWER_OPTIONS,
  KOC_PLATFORMS,
  KOC_PRICE_OPTIONS,
  KOC_REVIEW_CATEGORIES,
  KOC_REVIEW_COUNT_OPTIONS,
  KOL_CONTENT_TYPES,
  KOL_ENGAGEMENT_OPTIONS,
  KOL_FOLLOWER_OPTIONS,
  KOL_PLATFORMS,
  KOL_PRICE_OPTIONS,
  SELLING_PLATFORMS,
  SHOP_PRODUCT_CATEGORIES,
  SHOP_TYPE_OPTIONS,
} from "../data/form-options";

type OptionItem = { value: string; label: string };

/**
 * Generic function to get label from options array
 */
function getLabel(options: OptionItem[], value: string): string {
  const item = options.find((opt) => opt.value === value);
  return item?.label || value;
}

/**
 * Generic function to get labels for multiple values
 */
function getLabels(options: OptionItem[], values: string[]): string[] {
  return values.map((v) => getLabel(options, v));
}

// ===== COMMUNITY =====
export function getInterestLabel(value: string): string {
  return getLabel(COMMUNITY_INTERESTS, value);
}

export function getInterestLabels(values: string[]): string[] {
  return getLabels(COMMUNITY_INTERESTS, values);
}

// ===== FARMER =====
export function getFarmSizeLabel(value: string): string {
  return getLabel(FARM_SIZE_OPTIONS, value);
}

export function getFarmTypeLabel(value: string): string {
  return getLabel(FARM_TYPE_OPTIONS, value);
}

export function getFarmTypeLabels(values: string[]): string[] {
  return getLabels(FARM_TYPE_OPTIONS, values);
}

export function getFarmerProductLabel(value: string): string {
  return getLabel(FARMER_PRODUCTS, value);
}

export function getFarmerProductLabels(values: string[]): string[] {
  return getLabels(FARMER_PRODUCTS, values);
}

export function getCertificateLabel(value: string): string {
  return getLabel(CERTIFICATE_TYPES, value);
}

export function getCertificateLabels(values: string[]): string[] {
  return getLabels(CERTIFICATE_TYPES, values);
}

// ===== BUSINESS =====
export function getBusinessTypeLabel(value: string): string {
  return getLabel(BUSINESS_TYPES, value);
}

export function getBusinessTypeLabels(values: string[]): string[] {
  return getLabels(BUSINESS_TYPES, values);
}

export function getBusinessProductLabel(value: string): string {
  return getLabel(BUSINESS_PRODUCTS, value);
}

export function getBusinessProductLabels(values: string[]): string[] {
  return getLabels(BUSINESS_PRODUCTS, values);
}

export function getContactPositionLabel(value: string): string {
  return getLabel(CONTACT_POSITION_OPTIONS, value);
}

export function getEmployeeCountLabel(value: string): string {
  return getLabel(EMPLOYEE_COUNT_OPTIONS, value);
}

// ===== COOP =====
export function getCoopPositionLabel(value: string): string {
  return getLabel(COOP_POSITION_OPTIONS, value);
}

export function getCoopMemberCountLabel(value: string): string {
  return getLabel(COOP_MEMBER_COUNT_OPTIONS, value);
}

export function getCoopEmployeeCountLabel(value: string): string {
  return getLabel(COOP_EMPLOYEE_COUNT_OPTIONS, value);
}

export function getCoopFarmAreaLabel(value: string): string {
  return getLabel(COOP_FARM_AREA_OPTIONS, value);
}

export function getCoopProductLabel(value: string): string {
  return getLabel(COOP_PRODUCTS, value);
}

export function getCoopProductLabels(values: string[]): string[] {
  return getLabels(COOP_PRODUCTS, values);
}

export function getCoopCertificateLabel(value: string): string {
  return getLabel(COOP_CERTIFICATE_TYPES, value);
}

export function getCoopCertificateLabels(values: string[]): string[] {
  return getLabels(COOP_CERTIFICATE_TYPES, values);
}

export function getEstablishedYearLabel(value: string): string {
  return getLabel(ESTABLISHED_YEAR_OPTIONS, value);
}

// ===== SHOP =====
export function getShopTypeLabel(value: string): string {
  return getLabel(SHOP_TYPE_OPTIONS, value);
}

export function getSellingPlatformLabel(value: string): string {
  return getLabel(SELLING_PLATFORMS, value);
}

export function getSellingPlatformLabels(values: string[]): string[] {
  return getLabels(SELLING_PLATFORMS, values);
}

export function getShopProductCategoryLabel(value: string): string {
  return getLabel(SHOP_PRODUCT_CATEGORIES, value);
}

export function getShopProductCategoryLabels(values: string[]): string[] {
  return getLabels(SHOP_PRODUCT_CATEGORIES, values);
}

// ===== EXPERT =====
export function getExpertiseLabel(value: string): string {
  return getLabel(EXPERT_EXPERTISE, value);
}

export function getExpertiseLabels(values: string[]): string[] {
  return getLabels(EXPERT_EXPERTISE, values);
}

export function getExpertDegreeLabel(value: string): string {
  return getLabel(EXPERT_DEGREE_OPTIONS, value);
}

export function getExpertExperienceLabel(value: string): string {
  return getLabel(EXPERT_EXPERIENCE_OPTIONS, value);
}

export function getExpertWorkplaceTypeLabel(value: string): string {
  return getLabel(EXPERT_WORKPLACE_TYPE_OPTIONS, value);
}

export function getExpertPositionLabel(value: string): string {
  return getLabel(EXPERT_POSITION_OPTIONS, value);
}

// ===== KOL =====
export function getKolContentTypeLabel(value: string): string {
  return getLabel(KOL_CONTENT_TYPES, value);
}

export function getKolContentTypeLabels(values: string[]): string[] {
  return getLabels(KOL_CONTENT_TYPES, values);
}

export function getKolPlatformLabel(value: string): string {
  return getLabel(KOL_PLATFORMS, value);
}

export function getKolFollowerLabel(value: string): string {
  return getLabel(KOL_FOLLOWER_OPTIONS, value);
}

export function getKolEngagementLabel(value: string): string {
  return getLabel(KOL_ENGAGEMENT_OPTIONS, value);
}

export function getKolPriceLabel(value: string): string {
  return getLabel(KOL_PRICE_OPTIONS, value);
}

// ===== KOC =====
export function getKocReviewCategoryLabel(value: string): string {
  return getLabel(KOC_REVIEW_CATEGORIES, value);
}

export function getKocReviewCategoryLabels(values: string[]): string[] {
  return getLabels(KOC_REVIEW_CATEGORIES, values);
}

export function getKocPlatformLabel(value: string): string {
  return getLabel(KOC_PLATFORMS, value);
}

export function getKocFollowerLabel(value: string): string {
  return getLabel(KOC_FOLLOWER_OPTIONS, value);
}

export function getKocReviewCountLabel(value: string): string {
  return getLabel(KOC_REVIEW_COUNT_OPTIONS, value);
}

export function getKocPriceLabel(value: string): string {
  return getLabel(KOC_PRICE_OPTIONS, value);
}
