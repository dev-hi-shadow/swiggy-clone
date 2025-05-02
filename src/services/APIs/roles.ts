import { ApiResponse, IRole } from "../../types";
import { graphql } from "../graphqlClient";

export const getRoles = async (): Promise<
  ApiResponse<Array<Partial<IRole>>>
> => {
  const res = await graphql("query")({
    roleList: {
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
      input,
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
