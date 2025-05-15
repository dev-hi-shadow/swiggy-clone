import { ApiResponse, IDish, IPagination } from "../../types";
import { graphql } from "../graphqlClient";

export const getDishes = async (
  payload?: null | IPagination<IDish>
): Promise<ApiResponse<{ count: number; rows: Array<IDish> }>> => {
  const res = await graphql("query")({
    dishList: [
      { ...payload },
      {
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
    ],
  });
  return res?.dishList as ApiResponse<{ count: number; rows: Array<IDish> }>;
};

export const getDishesByCategory = async (
  payload?: null | IPagination<IDish>
): Promise<
  ApiResponse<{
    count: number;
    rows: Array<{ id: number; name: string; dishes: Array<IDish> }>;
  }>
> => {
  const res = await graphql("query")({
    getDishByCategories: [
      { ...payload },
      {
        status: true,
        success: true,
        isToast: true,
        message: true,
        data: {
          count: true,
          rows: {
            id: true,
            name: true,
            dishes: {
              name: true,
              id: true,
              image: true,
              // original_price: true,
            },
          },
        },
      },
    ],
  });
  return res?.getDishByCategories as ApiResponse<{
    count: number;
    rows: {
      id: number;
      name: string;
      dishes: Array<IDish>;
    }[];
  }>;
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
          parent_dish_id: true,
          name: true,
          slug: true,
          description: true,
          long_description: true,
          image: true,
          banner_image: true,
          gallery_images: true,
          video_url: true,
          tags: true,
          price: true,
          original_price: true,
          currency: true,
          price_unit: true,
          tax_percentage: true,
          tax_inclusive: true,
          service_charge_percentage: true,
          packaging_charge: true,
          
          is_available: true,
          availability_days: true,
          availability_start_time: true,
          availability_end_time: true,
          blackout_dates: true,
          preorder_available: true,
          preorder_hours: true,
          delivery_eta_minutes: true,
          delivery_buffer_minutes: true,
          preparation_time_minutes: true,
          stock_quantity: true,
          min_order_qty: true,
          max_order_qty: true,
          available_portions: true,
          is_veg: true,
          is_customizable: true,
          spicy_level: true,
          dietary_tags: true,
          allergen_info: true,
          allergens: true,
          ingredients: true,
          meal_time_tags: true,
          featured: true,
          is_featured: true,
          is_new: true,
          is_popular: true,
          is_recommended: true,
          is_best_seller: true,
          is_chef_special: true,
          is_available_for_delivery: true,
          is_available_for_pickup: true,
          is_available_for_dine_in: true,
          is_available_for_takeaway: true,
          language_tags: true,
          regional_exclusivity: true,
          cuisine_type: true,
          name_translations: true,
          description_translations: true,
          seo_title: true,
          seo_description: true,
          promo_tags: true,
          share_url: true,
          rating: true,
          total_reviews: true,
          average_rating: true,
          total_orders: true,
          reorder_rate: true,
          cart_additions: true,
          view_count: true,
          conversion_rate: true,
          user_likes_count: true,
          order_count: true,
          reorder_probability: true,
          smart_tags: true,
          kitchen_station: true,
          priority_order: true,
          shelf_life_hours: true,
          is_ready_to_eat: true,
          approval_status: true,
          rejection_reason: true,
          fssai_info: true,
          auto_tags: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
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
        customization_groups: null,
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
        customization_groups: null,
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
