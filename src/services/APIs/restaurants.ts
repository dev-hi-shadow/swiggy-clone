import { ApiResponse, IPagination, IRestaurant } from "../../types";
import { graphql } from "../graphqlClient";

export const getRestaurants = async (
  payload?: null | IPagination<IRestaurant>
): Promise<ApiResponse<Array<Partial<IRestaurant>>>> => {
  const res = await graphql("query")({
    RestaurantList: [
      payload || {},
      {
        status: true,
        success: true,
        isToast: true,
        message: true,
        data: {
          id: true,
          name: true,
          gst_number: true,
          status: true,
          website_url: true,
          phone_number: true,
          email: true,
          is_verified: true,
          facebook_url: true,
          instagram_url: true,
          owner: {
            first_name: true,
            last_name: true,
          },
          branches: {
            id: true,
            location: true,
            is_open: true,
            is_available_for_delivery: true,
            is_available_for_pickup: true,
          },
        },
      },
    ],
  });

  return res.RestaurantList as ApiResponse<Array<Partial<IRestaurant>>>;
};


export const getRestaurant = async (input: {
  id: number;
}): Promise<ApiResponse<Partial<IRestaurant>>> => {
  const res = await graphql("query")({
    restaurant: [
      input,
      {
        data: {
          id: true,
          owner_id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          email: true,
          phone_number: true,
          alternate_phone_number: true,
          website_url: true,
          facebook_url: true,
          instagram_url: true,
          gst_number: true,
          status: true,
          rejection_reason: true,
          fssai_license_number: true,
          is_chain: true,
          founded_year: true,
          total_branches: true,
          cuisine_types: true,
          tags: true,
          created_at: true,
          updated_at: true,
          created_by: true,
          updated_by: true,
          deleted_by: true,
          account_number: true,
          upi_id: true,
          swift_code: true,
          bank_name: true,
          bank_branch: true,
          ifsc_code: true,
          account_holder_name: true,
        },
      },
    ],
  });

  return res.restaurant as ApiResponse<Partial<IRestaurant>>;
};

export const createRestaurant = async (
  input: Partial<IRestaurant>
): Promise<ApiResponse<Partial<IRestaurant>> | undefined> => {
  const res = await graphql("mutation")({
    createRestaurant: [
      input,
      {
        data: {
          id: true,
          owner_id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          email: true,
          phone_number: true,
          alternate_phone_number: true,
          website_url: true,
          facebook_url: true,
          instagram_url: true,
          gst_number: true,
          status: true,
          rejection_reason: true,
          fssai_license_number: true,
          is_chain: true,
          founded_year: true,
          total_branches: true,
          cuisine_types: true,
          tags: true,
          average_rating: true,
          total_reviews: true,
          is_verified: true,
          approval_status: true,
          approval_notes: true,
          timezone: true,
          external_integration_id: true,
          priority_order: true,
          visibility_status: true,
          cancellation_policy: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          created_by: true,
          updated_by: true,
          deleted_by: true,
          account_number: true,
          upi_id: true,
          swift_code: true,
          bank_name: true,
          bank_branch: true,
          ifsc_code: true,
          account_holder_name: true,
        },
        isError: true,
        status: true,
        success: true,
        isToast: true,
        message: true,
      },
    ],
  });
  return res?.createRestaurant as ApiResponse<Partial<IRestaurant>>;
};

export const updateRestaurant = async (
  input: Partial<IRestaurant>
): Promise<ApiResponse<Partial<IRestaurant>> | undefined> => {
  const res = await graphql("mutation")({
    updateRestaurant: [
      input,
      {
        data: {
          id: true,
          owner_id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          email: true,
          phone_number: true,
          alternate_phone_number: true,
          website_url: true,
          facebook_url: true,
          instagram_url: true,
          gst_number: true,
          status: true,
          rejection_reason: true,
          fssai_license_number: true,
          is_chain: true,
          founded_year: true,
          total_branches: true,
          cuisine_types: true,
          tags: true,
          average_rating: true,
          total_reviews: true,
          is_verified: true,
          approval_status: true,
          approval_notes: true,
          timezone: true,
          external_integration_id: true,
          priority_order: true,
          visibility_status: true,
          cancellation_policy: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          created_by: true,
          updated_by: true,
          deleted_by: true,
          account_number: true,
          upi_id: true,
          swift_code: true,
          bank_name: true,
          bank_branch: true,
          ifsc_code: true,
          account_holder_name: true,
        },
        isError: true,
        status: true,
        success: true,
        isToast: true,
        message: true,
      },
    ],
  });
  return res?.updateRestaurant as ApiResponse<Partial<IRestaurant>>;
};
