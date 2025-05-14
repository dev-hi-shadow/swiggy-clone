import { ApiResponse, ICategory, IPagination } from "../../types";
import { graphql } from "../graphqlClient";

export const getCategories = async (
  payload?: null | IPagination<ICategory>
): Promise<
  ApiResponse<{
    count: number;
    rows: Array<Partial<ICategory>>;
  }>
> => {
  const res = await graphql("query")({
    categoryList: [
      payload ?? {},
      {
        status: true,
        success: true,
        isToast: true,
        message: true,
        data: {
          count: true,
          rows: {
            name: true,
            id: true,
            image: true,
            short_description: true,
            is_active: true,
          },
        },
      },
    ],
  });
  return res?.categoryList as ApiResponse<{
    count: number;
    rows: Array<Partial<ICategory>>;
  }>;
};
export const getCategory = async (input: {
  id: number;
}): Promise<ApiResponse<Partial<ICategory>>> => {
  const res = await graphql("query")({
    getCategoryById: [
      input,
      {
        status: true,
        success: true,
        isToast: true,
        message: true,
        data: {
          id: true,
          name: true,
          slug: true,
          short_description: true,
          long_description: true,
          image: true,
          banner_image: true,
          icon: true,
          display_order: true,
          is_featured: true,
          is_active: true,
          seo_title: true,
          seo_description: true,
          seo_keywords: true,
        },
      },
    ],
  });
  return res?.getCategoryById as ApiResponse<Partial<ICategory>>;
};



export const createCategory = async (
  input: Partial<ICategory>
): Promise<ApiResponse<Partial<ICategory>> | undefined> => {
  const res = await graphql("mutation")({
    createCategory: [
      {
        ...input,
      },
      {
        data: {
          id: true,
          name: true,
          slug: true,
          short_description: true,
          long_description: true,
          image: true,
          banner_image: true,
          icon: true,
          display_order: true,
          is_featured: true,
          is_active: true,
          seo_title: true,
          seo_description: true,
          seo_keywords: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          created_by: true,
          updated_by: true,
          deleted_by: true,
        },
        isError: true,
        status: true,
        success: true,
        isToast: true,
        message: true,
      },
    ],
  });
  return res?.createCategory as ApiResponse<Partial<ICategory>>;
};
export const updateCategory = async (
  input: Partial<ICategory>
): Promise<ApiResponse<Partial<ICategory>> | undefined> => {
  const res = await graphql("mutation")({
    updateCategory: [
      {
        ...input,
      },
      {
        data: {
          id: true,
          name: true,
          slug: true,
          short_description: true,
          long_description: true,
          image: true,
          banner_image: true,
          icon: true,
          display_order: true,
          is_featured: true,
          is_active: true,
          seo_title: true,
          seo_description: true,
          seo_keywords: true,
          created_at: true,
          updated_at: true,
          deleted_at: true,
          created_by: true,
          updated_by: true,
          deleted_by: true,
        },
        isError: true,
        status: true,
        success: true,
        isToast: true,
        message: true,
      },
    ],
  });
  return res?.updateCategory as ApiResponse<Partial<ICategory>>;
};