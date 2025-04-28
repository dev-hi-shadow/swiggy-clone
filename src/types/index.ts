export interface ApiResponse<T> {
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

export interface IRestaurant {
  id: number;
  owner_id: number  ;
  name: string | null;
  slug: string | null;
  description: string | null;
  image: string | null;
  email: string | null;
  phone_number: string | null;
  alternate_phone_number: string | null;
  website_url: string | null;
  facebook_url: string | null;
  instagram_url: string | null;
  gst_number: string | null;
  status: string | null;
  rejection_reason: string | null;
  fssai_license_number: string | null;
  is_chain: boolean;
  founded_year: string | null;
  total_branches: number | null;
  cuisine_types: string | null;
  tags: string | null;
  average_rating: number | null;
  total_reviews: number| null;
  is_verified: boolean;
  approval_status: "pending" | "approved" | "rejected";
  approval_notes: string | null;
  timezone: string;
  external_integration_id: number | null;
  priority_order: number | null;
  visibility_status: "visible" | "hidden";
  cancellation_policy: string | null;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
  created_by: number | null;
  updated_by: number | null;
  deleted_by: number | null;
  account_number: string | null;
  upi_id: string | null;
  swift_code: string | null;
  bank_name: string | null;
  bank_branch: string | null;
  ifsc_code: string | null;
  account_holder_name: string | null;
  branches: IRBranch[];
  branch: IRBranch;
  owner: IUser;
}

export interface IRBranch {
  id: number;
  restaurant_id: number;
  manager_id: number;
  location: string;
  longitude: number;
  latitude: number;
  image: string;
  email: string;
  phone_number?: string;
  alternate_phone_number?: string;
  expected_delivery_time: number;
  average_price_for_one: number;
  average_price_for_two?: number;
  delivery_charge: number;
  min_order_value?: number;
  max_order_value?: number;
  packaging_charge?: number;
  rating: number;
  is_open: boolean;
  is_featured: boolean;
  is_available_for_delivery: boolean;
  is_available_for_pickup: boolean;
  is_veg_only: boolean;
  opening_time?: string;
  closing_time?: string;
  special_opening_time?: string;
  special_closing_time?: string;
  average_preparation_time?: number;
  slug?: string;
  short_description?: string;
  full_description?: string;
  gst_number?: string;
  fssai_license_number?: string;
  service_radius_km?: number;
  approval_status: "pending" | "approved" | "rejected";
  approval_notes?: string;
  cancellation_policy?: string;
  external_integration_id?: string;
  timezone: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  restaurant?: IRestaurant;
}
