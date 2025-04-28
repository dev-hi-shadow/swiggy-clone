import { IRegister, IUser, ApiResponse } from "../../types";
import { graphql } from "../graphqlClient";

export const register = async (
  input: IRegister
): Promise<ApiResponse<IRegister> | undefined> => {
  const res = await graphql("mutation")({ 
    register: [
      { ...input },
      {
        success: true,
        isToast: true,
        message: true,
        token: true,
      },
    ],
  });
  return res?.register as ApiResponse<IRegister>;
};

export const getProfile = async (): Promise<ApiResponse<Partial<IUser>>> => {
  const res = await graphql("query")({
    getProfile: {
      status: true,
      success: true,
      isToast: true,
      message: true,
      data: {
        wallet_balance: true,
        id: true,
        first_name: true,
        last_name: true,
        email: true,
        profile_picture: true,
        is_active: true,
        blocked_reason: true,
        device_token: true,
        gender: true,
        is_verified: true,
        terms_conditions_accepted: true,
        language_preference: true,
        username: true,
        role: {
          name: true,
          id: true,
          permissions: true,
        },
      },
    },
  });

  return res.getProfile as ApiResponse<Partial<IUser>>;
};

