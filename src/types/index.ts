export interface Response<T> {
  status: number;
  success: boolean;
  isToast: boolean;
  message: string;
  data?: T;
  [key: string]: unknown;
}

export interface IRoutes {
  path: string;
  element: React.ReactNode;
}


// Forms
export interface IRegister {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  terms_conditions_accepted: boolean;
  data?: IUser;
  token?: string;
}

export interface IRole {
  id: number;
  name: string;
  description?: string | null;
  permissions: Record<string, "write" | "read" | "delete" | "update"[]>;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  is_admin: boolean;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
}

export interface IUser {
  id?: number;
  username?: string;
  phone?: string;
  gender?: string;
  dob?: Date;
  aadhar_card?: string;
  pan_card?: string;
  voter_id?: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role_id?: number;
  is_active?: boolean;
  is_verified?: boolean;
  profile_picture?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip_code?: string;
  last_login_at?: Date;
  login_count?: number;
  device_token?: string;
  wallet_balance?: number;
  referral_code?: string;
  referred_by?: string;
  otp_code?: string;
  otp_expiry?: Date;
  blocked_reason?: string;
  language_preference?: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  terms_conditions_accepted: boolean;
  role?: IRole;
}
