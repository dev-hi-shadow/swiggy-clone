import { ApiResponse, IRBranch } from "../../types";
import { graphql } from "../graphqlClient";

export const getRBranches = async (): Promise<
  ApiResponse<Array<Partial<IRBranch>>>
> => {
  const res = await graphql("query")({
    RBranchList: {
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
        }
      },
    },
  });

  return res.RBranchList as ApiResponse<Array<Partial<IRBranch>>>;
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
        },
      },
    ],
  });

  return res.updateBranch as ApiResponse<Partial<IRBranch>>;
};
