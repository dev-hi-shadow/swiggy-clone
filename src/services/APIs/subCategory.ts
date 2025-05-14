import { ApiResponse, IPagination, ISubCategory } from "../../types";
import { graphql } from "../graphqlClient";

export const getSubCategories = async (
  payload?: null | IPagination<ISubCategory>
): Promise<
  ApiResponse<{
    count: number;
    rows: Array<Partial<ISubCategory>>;
  }>
> => {
  const res = await graphql("query")({
    subCategoriesList: [
      { ...payload },
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
            slug: true,
            short_description: true,
          },
        },
      },
    ],
  });
  return res?.subCategoriesList as ApiResponse<{
    count: number;
    rows: Array<Partial<ISubCategory>>;
  }>;
};
export const getSubCategory = async (input: {
  id: number;
}): Promise<ApiResponse<Partial<ISubCategory>>> => {
  const res = await graphql("query")({
    getSubcategoryById: [
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
  return res?.getSubcategoryById as ApiResponse<Partial<ISubCategory>>;
};



export const createSubCategory = async (
  input: Partial<ISubCategory>
): Promise<ApiResponse<Partial<ISubCategory>> | undefined> => {
  const res = await graphql("mutation")({
    createSubcategory: [
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
  return res?.createSubcategory as ApiResponse<Partial<ISubCategory>>;
};
export const updateSubCategory = async (
  input: Partial<ISubCategory>
): Promise<ApiResponse<Partial<ISubCategory>> | undefined> => {
  const res = await graphql("mutation")({
    updateSubcategory: [
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
  return res?.updateSubcategory as ApiResponse<Partial<ISubCategory>>;
};