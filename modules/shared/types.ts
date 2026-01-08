// User types
export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "farmer" | "business" | "coop" | "community" | "admin";
  createdAt: string;
  updatedAt: string;
}

// Auth types
export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Google Auth types
export interface GoogleAuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

// ===== CAPTCHA TYPES =====
export interface CaptchaChallenge {
  token: string;
  question: string;
  hint: string;
  options: number[];
}

export interface CaptchaState {
  challenge: CaptchaChallenge | null;
  selected: number | null;
  loading: boolean;
  error: string | null;
}

// ===== LEGACY LOOKUP TYPES =====
export interface LegacyAccount {
  name: string;
  rank: string;
  shares: number;
  ogn: number;
  tor: number;
  f1Total: number;
}

export interface LegacyLookupRequest {
  email: string;
  phone: string;
  captchaToken?: string;
  captchaAnswer?: number;
}

export type LegacyErrorCode =
  | "CAPTCHA_REQUIRED"
  | "CAPTCHA_WRONG"
  | "CAPTCHA_EXPIRED"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "SERVER_ERROR"
  | "TIMEOUT";

export interface LegacyApiError {
  code: LegacyErrorCode;
  message: string;
}

export interface LegacyLookupResponse {
  success: boolean;
  data?: LegacyAccount;
  error?: LegacyApiError;
}
