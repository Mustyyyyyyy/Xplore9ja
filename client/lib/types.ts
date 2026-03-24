export type UserRole = "USER" | "ADMIN" | "SUPERADMIN";

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  isVerified?: boolean;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  accessToken: string;
  refreshToken?: string;
  user: AuthUser;
};

export type BasicMessageResponse = {
  success: boolean;
  message: string;
};