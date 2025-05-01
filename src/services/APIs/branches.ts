import { ApiResponse, IRBranch } from "../../types";
import { graphql } from "../graphqlClient";

export const getRBranches = async (
  restaurant_id: number
): Promise<ApiResponse<Array<Partial<IRBranch>>>> => {
  const res = await graphql("query")({
    RBranchList: [
      {
        restaurant_id,
      },
      {
        status: true,
        success: true,
        isToast: true,
        message: true,
        data: {
          id: true,
          location: true,
          restaurant: {
            name: true,
          },
          owner: {
            first_name: true,
            last_name: true,
          },
          manager: {
            first_name: true,
            last_name: true,
          },
        },
      },
    ],
  });

  return res.RBranchList as ApiResponse<Array<Partial<IRBranch>>>;
};
export const getRBranch = async (
  id: number
): Promise<ApiResponse<Partial<IRBranch>>> => {
  const res = await graphql("query")({
    getBranchById: [
      {
        id,
      },
      {
        status: true,
        success: true,
        isToast: true,
        message: true,
        data: {
          id: true,
          restaurant_id: true,
          manager_id: true,
          location: true,
          longitude: true,
          latitude: true,
          image: true,
          email: true,
          phone_number: true,
          alternate_phone_number: true,
          expected_delivery_time: true,
          average_price_for_one: true,
          average_price_for_two: true,
          delivery_charge: true,
          min_order_value: true,
          max_order_value: true,
          packaging_charge: true,
          rating: true,
          is_open: true,
          is_featured: true,
          is_available_for_delivery: true,
          is_available_for_pickup: true,
          is_veg_only: true,
          opening_time: true,
          closing_time: true,
          special_opening_time: true,
          special_closing_time: true,
          average_preparation_time: true,
          slug: true,
          short_description: true,
          full_description: true,
          gst_number: true,
          fssai_license_number: true,
          service_radius_km: true,
          approval_status: true,
          approval_notes: true,
          cancellation_policy: true,
          external_integration_id: true,
          timezone: true,
          country: true,
          state: true,
          city: true,
          zip_code: true,
          landmark: true,
          block_floor_number: true,
          nearby_landmark: true,
          created_at: true,
        },
      },
    ],
  });

  return res.getBranchById as ApiResponse<Partial<IRBranch>>;
};

export const createRBranch = async (
  input: Partial<IRBranch>
): Promise<ApiResponse<Partial<IRBranch>>> => {
  const res = await graphql("mutation")({
    createBranch: [
      {
        ...input,
      },
      {
        status: true,
        success: true,
        isToast: true,
        message: true,
        data: {
          id: true,
          location: true,
          restaurant_id: true,
        },
      },
    ],
  });

  return res.createBranch as ApiResponse<Partial<IRBranch>>;
};

export const updateRBranch = async (
  input: Partial<IRBranch>
): Promise<ApiResponse<Partial<IRBranch>>> => {
  const res = await graphql("mutation")({
    updateBranch: [
      input,
      {
        status: true,
        success: true,
        isToast: true,
        message: true,
        data: {
          id: true,
          location: true,
          restaurant_id: true,
        },
      },
    ],
  });

  return res.updateBranch as ApiResponse<Partial<IRBranch>>;
};
