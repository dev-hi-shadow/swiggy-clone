import { ApiResponse, IPagination, IRole } from "../../types";
import { graphql } from "../graphqlClient";

export const getRoles = async (
  payload?: null | IPagination<IRole>
): Promise<ApiResponse<Array<Partial<IRole>>>> => {
  const res = await graphql("query")({
    roleList: [
      payload || {},
      {
        status: true,
        success: true,
        isToast: true,
        message: true,
        data: {
          name: true,
          permissions: true,
          id: true,
          is_admin: true,
        },
      },
    ],
  });

  return res?.roleList as ApiResponse<Array<Partial<IRole>>>;
};
export const getRole = async (input: {
  id: number;
}): Promise<ApiResponse<Partial<IRole>>> => {
  const res = await graphql("query")({
    getRoleById: [
      input,
      {
        status: true,
        success: true,
        isToast: true,
        message: true,
        data: {
          name: true,
          permissions: true,
          id: true,
          is_admin: true,
        },
      },
    ],
  });

  return res?.getRoleById as ApiResponse<Partial<IRole>>;
};

export const createRole = async (
  input: Partial<IRole>
): Promise<ApiResponse<Partial<IRole>> | undefined> => {
  const res = await graphql("mutation")({
    createRole: [
      { ...input, permissions: JSON.stringify(input.permissions) },
      {
        status: true,
        success: true,
        isToast: true,
        message: true,
      },
    ],
  });
  return res?.createRole as ApiResponse<Partial<IRole>>;
};
export const updateRole = async (
  input: Partial<IRole>
): Promise<ApiResponse<Partial<IRole>> | undefined> => {
  const res = await graphql("mutation")({
    updateRole: [
      {
        ...input,
        permissions: JSON.stringify(input.permissions),
      },
      {
        data: {
          id: true,
          name: true,
          permissions: true,
          is_admin: true,
        },
        isError: true,
        status: true,
        success: true,
        isToast: true,
        message: true,
      },
    ],
  });
  return res?.updateRole as ApiResponse<Partial<IRole>>;
};
