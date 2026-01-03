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
