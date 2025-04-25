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
 }

export interface IRole {
  id: number | null;
  name: string | null;
  description?: string | null;
  permissions: Record<string, "write" | "read" | "delete" | "update"[]> | null;
  is_active: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
  deleted_at?: Date | null;
  is_admin: boolean | null;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
}

export interface IUser {
  id?: number | null;
  username?: string | null;
  phone?: string | null;
  gender?: string | null;
  dob?: Date | null;
  aadhar_card?: string | null;
  pan_card?: string | null;
  voter_id?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  password?: string | null;
  role_id?: number | null;
  is_active?: boolean | null;
  is_verified?: boolean | null;
  profile_picture?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  country?: string | null;
  zip_code?: string | null;
  last_login_at?: Date | null;
  login_count?: number | null;
  device_token?: string | null;
  wallet_balance?: number | null;
  referral_code?: string | null;
  referred_by?: string | null;
  otp_code?: string | null;
  otp_expiry?: Date | null;
  blocked_reason?: string | null;
  language_preference?: string | null;
  created_at?: Date | null;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  terms_conditions_accepted: boolean | null;
  facebook: string | null;
  x: string | null;
  linkedin: string | null;
  instagram: string | null;
  role?: IRole | null;
}
