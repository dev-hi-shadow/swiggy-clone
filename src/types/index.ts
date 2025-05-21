export interface ApiResponse<T> {
  status: number;
  success: boolean;
  isToast: boolean;
  message: string;
  data?: T;
  [key: string]: unknown;
}
export interface IPagination<T> {
  page?: number;
  pageSize?: number;
  total?: number;
  totalPages?: number;
  filter?: Record<keyof T | string, unknown>;
  sortBy?: keyof T | string;
  sortOrder?: "asc" | "desc";
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
  terms_conditions_accepted?: boolean;
  token?: string;
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
  owner_id: number;
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
  total_reviews: number | null;
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
  expected_delivery_time: string;
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
  average_preparation_time?: string;
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
  country: string;
  state: string;
  city: string;
  zip_code: string;
  landmark?: string;
  block_floor_number?: number;
  nearby_landmark?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  restaurant?: IRestaurant;
  owner?: IUser;
  manager?: IUser;
}

export interface IActiveRestaurant {
  id: number;
  name: string;
}

export interface IActiveRBranch {
  id: number;
  location: string;
  orderAccepting: boolean;
  dayOff: boolean;
}

export interface ICategory {
  id: number;
  name: string;
  slug?: string;
  short_description?: string;
  long_description?: string;
  image?: string;
  banner_image?: string;
  icon?: string;
  display_order?: number;
  is_featured: boolean;
  is_active: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
  dish: IDish[];
  dishes: IDish[];
}

export interface ISubCategory {
  id: number;
  category_id: number;
  name: string;
  slug?: string;
  short_description?: string;
  long_description?: string;
  image?: string;
  banner_image?: string;
  icon?: string;
  display_order?: number;
  is_featured: boolean;
  is_active: boolean;
  seo_title?: string;
  seo_description?: string;
  seo_keywords?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
}

export interface IAuthenticate {
  token?: string | null;
 }

export interface IDish {
  id: number;
  restaurant_id: number;
  branch_id?: number;
  category_id?: number;
  subcategory_id?: number;
  parent_dish_id?: number;
  name: string;
  slug?: string;
  description?: string;
  long_description?: string;
  image?: string;
  banner_image?: string;
  gallery_images?: string[];
  video_url?: string;
  tags?: string[];
  price: number;
  original_price?: number;
  currency: string;
  price_unit?: "per_item" | "per_kg" | "per_litre" | "per_person";
  tax_percentage?: number;
  tax_inclusive?: boolean;
  service_charge_percentage?: number;
  packaging_charge?: number;
  discount_type: "fixed" | "percentage";
  discount_amount?: number;
  discount_amount_upto?: number;
  discount_percentage?: number;
  discount_start_time?: string;
  discount_end_time?: string;
  discount_max_quantity?: number;
  discount_min_quantity?: number;
  discount_max_quantity_per_user?: number;
  discount_min_quantity_per_user?: number;
  discount_max_quantity_per_order?: number;
  discount_min_quantity_per_order?: number;
  discount_max_quantity_per_user_per_order?: number;
  discount_min_quantity_per_user_per_order?: number;
  discount_applies_with_coupon?: boolean;
  promo_code_applicable?: boolean;
  is_available: boolean;
  availability_days?: string[];
  availability_start_time?: string;
  availability_end_time?: string;
  blackout_dates?: string[];
  preorder_available?: boolean;
  preorder_hours?: number;
  delivery_eta_minutes?: number;
  delivery_buffer_minutes?: number;
  preparation_time_minutes?: number;
  stock_quantity?: number;
  min_order_qty?: number;
  max_order_qty?: number;
  available_portions?: number;
  is_veg: boolean;
  is_customizable: boolean;
  spicy_level?: "mild" | "medium" | "hot";
  dietary_tags?: string[];
  allergen_info?: string[];
  allergens?: string[];
  ingredients?: string;
  ingredients_options?: IDIngredient[];
  customization_groups?: IDCustomization[];
  meal_time_tags?: string[];
  featured: boolean;
  is_featured: boolean;
  is_new: boolean;
  is_popular: boolean;
  is_recommended: boolean;
  is_best_seller: boolean;
  is_chef_special: boolean;
  is_available_for_delivery: boolean;
  is_available_for_pickup: boolean;
  is_available_for_dine_in: boolean;
  is_available_for_takeaway: boolean;
  language_tags?: string[];
  regional_exclusivity?: string[];
  cuisine_type?: string[];
  name_translations?: Record<string, string>;
  description_translations?: Record<string, string>;
  seo_title?: string;
  seo_description?: string;
  promo_tags?: string[];
  share_url?: string;
  rating?: number;
  total_reviews?: number;
  average_rating?: number;
  total_orders?: number;
  reorder_rate?: number;
  cart_additions?: number;
  view_count?: number;
  conversion_rate?: number;
  user_likes_count?: number;
  order_count?: number;
  reorder_probability?: number;
  smart_tags?: string[];
  kitchen_station?: string;
  priority_order?: number;
  shelf_life_hours?: number;
  is_ready_to_eat?: boolean;
  approval_status: "pending" | "approved" | "rejected";
  rejection_reason?: string;
  fssai_info?: {
    license_number: string;
    label_required: boolean;
  };
  auto_tags?: string[];
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
  created_by?: number | null;
  updated_by?: number | null;
  deleted_by?: number | null;
}
export interface IDIngredient {
  id: number;
  dish_id: number;
  name: string;
  image_url?: string;
  has_options: boolean;
  created_at: Date;
  updated_at: Date;
  options?: IDIOption[];
}

export interface IDIOption {
  id: number;
  name: string;
  price: number;
  ingredient_id: number;
  description?: string;
  image_url?: string;
  created_at: Date;
  updated_at: Date;
}
export interface IDCustomization {
  id: number;
  dish_id: number;
  title: string;
  is_required: boolean;
  min_selection: number;
  max_selection: number;
  selection_type: "single" | "multiple";
  order: number;
  options?: IDCOption[];
}

export interface IDCOption {
  id: number;
  customization_id: number;
  title: string;
  price: number;
  is_default: boolean;
  is_available: boolean;
  calories?: number | null;
  order: number;
  image?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FormatResponse<T = any> = {
  success: boolean;
  data: {
    data: T;
    totalCount?: number;
    page?: number;
    limit?: number;
    dataPerPage: number;
  };
  message: string;
  status: number;
  toast: boolean;
};
