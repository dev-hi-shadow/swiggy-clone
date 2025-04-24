import { IRegister, IUser, Response } from "../../types";
import { graphql } from "../graphqlClient";

export const register = async (
  input: IRegister
): Promise<Response<IRegister> | undefined> => {
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
  return res?.register as Response<IRegister>;
};

export const getProfile = async (): Promise<Response<Partial<IUser>>> => {
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
      },
    },
  });

  return res.getProfile as Response<Partial<IUser>>;
};
