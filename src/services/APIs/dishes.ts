import { ApiResponse, IDish } from "../../types";
import { graphql } from "../graphqlClient";


export const getDishes = async (): Promise<
  ApiResponse<{ count: number; rows: Array<IDish> }>
> => {
  const res = await graphql("query")({
    dishList: {
      status: true,
      success: true,
      isToast: true,
      message: true,
      data: {
        count: true,
        rows: {
          id: true,
          restaurant_id: true,
          branch_id: true,
          category_id: true,
          subcategory_id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          banner_image: true,
          price: true,
          original_price: true,
          currency: true,
          discount_percentage: true,
          is_available: true,
          is_veg: true,
          is_customizable: true,
          spicy_level: true,
          preparation_time_minutes: true,
          dietary_tags: true,
          ingredients: true,
          availability_start_time: true,
          availability_end_time: true,
          stock_quantity: true,
          min_order_qty: true,
          max_order_qty: true,
          rating: true,
          approval_status: true,
          rejection_reason: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          created_by: true,
          updated_by: true,
          deleted_by: true,
          ingredients_options: {
            has_options: true,
            name: true,
            image_url: true,
            id: true,
            dish_id: true,
            options: {
              id: true,
              name: true,
              price: true,
              image_url: true,
              ingredient_id: true,
            },
          },
        },
      },
    },
  });
  return res?.dishList as ApiResponse<{ count: number; rows: Array<IDish> }>;
};


 
export const getDishById = async (input: {
  id: number;
}): Promise<ApiResponse<IDish>> => {
  const res = await graphql("query")({
    getDishById: [
      input,
      {
        status: true,
        success: true,
        isToast: true,
        message: true,
        data: {
          id: true,
          restaurant_id: true,
          branch_id: true,
          category_id: true,
          subcategory_id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          banner_image: true,
          price: true,
          original_price: true,
          currency: true,
          discount_percentage: true,
          is_available: true,
          is_veg: true,
          is_customizable: true,
          spicy_level: true,
          preparation_time_minutes: true,
          dietary_tags: true,
          ingredients: true,
          availability_start_time: true,
          availability_end_time: true,
          stock_quantity: true,
          min_order_qty: true,
          max_order_qty: true,
          rating: true,
          approval_status: true,
          rejection_reason: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          created_by: true,
          updated_by: true,
          deleted_by: true,
          ingredients_options: {
            has_options: true,
            name: true,
            image_url: true,
            id: true,
            dish_id: true,
            options: {
              id: true,
              name: true,
              price: true,
              image_url: true,
              ingredient_id: true,
            },
          },
        },
      },
    ],
  });
  return res?.getDishById as ApiResponse<IDish>;
};




export const createDish = async (
  input: Partial<IDish>
): Promise<ApiResponse<Partial<IDish>> | undefined> => {
  const res = await graphql("mutation")({
    createDish: [
      {
        ...input,
      },
      {
        data: {
          id: true,
          restaurant_id: true,
          branch_id: true,
          category_id: true,
          subcategory_id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          banner_image: true,
          price: true,
          original_price: true,
          currency: true,
          discount_percentage: true,
          is_available: true,
          is_veg: true,
          is_customizable: true,
          spicy_level: true,
          preparation_time_minutes: true,
          dietary_tags: true,
          ingredients: true,
          availability_start_time: true,
          availability_end_time: true,
          stock_quantity: true,
          min_order_qty: true,
          max_order_qty: true,
          rating: true,
          approval_status: true,
          rejection_reason: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          created_by: true,
        },
        isError: true,
        status: true,
        success: true,
        isToast: true,
        message: true,
      },
    ],
  });
  return res?.createDish as ApiResponse<Partial<IDish>>;
};
export const updateDish = async (
  input: Partial<IDish>
): Promise<ApiResponse<Partial<IDish>> | undefined> => {
  const res = await graphql("mutation")({
    updateDish: [
      {
        ...input,
      },
      {
        data: {
          id: true,
          restaurant_id: true,
          branch_id: true,
          category_id: true,
          subcategory_id: true,
          name: true,
          slug: true,
          description: true,
          image: true,
          banner_image: true,
          price: true,
          original_price: true,
          currency: true,
          discount_percentage: true,
          is_available: true,
          is_veg: true,
          is_customizable: true,
          spicy_level: true,
          preparation_time_minutes: true,
          dietary_tags: true,
          ingredients: true,
          availability_start_time: true,
          availability_end_time: true,
          stock_quantity: true,
          min_order_qty: true,
          max_order_qty: true,
          rating: true,
          approval_status: true,
          rejection_reason: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          created_by: true,
        },
        isError: true,
        status: true,
        success: true,
        isToast: true,
        message: true,
      },
    ],
  });
  return res?.updateDish as ApiResponse<Partial<IDish>>;
};


