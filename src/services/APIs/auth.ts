import { IRegister, IUser, ApiResponse,  } from "../../types";
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
export const login = async (input: {
  email: string;
  password: string;
}): Promise<ApiResponse<Partial<IUser>> & { token: string } | undefined
> => {
  const res = await graphql("mutation")({
    login: [
      { ...input },
      {
        success: true,
        isToast: true,
        message: true,
        token: true,
        data: {
          language_preference: true,
          id: true,
          first_name: true,
          last_name: true,
        },
      },
    ],
  });
  return res?.login as ApiResponse<Partial<IUser>> & { token: string };
};

export const getProfile = async (): Promise<ApiResponse<Partial<IUser>>> => {
  const res = await graphql("query")({
    getProfile: {
      status: true,
      success: true,
      isToast: true,
      message: true,
      data: {
        id: true,
        username: true,
        phone: true,
        gender: true,
        dob: true,
        aadhar_card: true,
        pan_card: true,
        voter_id: true,
        first_name: true,
        last_name: true,
        email: true,
        password: true,
        role_id: true,
        is_active: true,
        is_verified: true,
        profile_picture: true,
        address: true,
        city: true,
        state: true,
        country: true,
        zip_code: true,
        last_login_at: true,
        login_count: true,
        device_token: true,
        wallet_balance: true,
        referral_code: true,
        referred_by: true,
        otp_code: true,
        otp_expiry: true,
        blocked_reason: true,
        language_preference: true,
        created_at: true,
        updated_at: true,
        deleted_at: true,
        created_by: true,
        updated_by: true,
        deleted_by: true,
        terms_conditions_accepted: true,
        facebook: true,
        x: true,
        linkedin: true,
        instagram: true,
        role: {
          name: true,
          id: true,
          is_admin: true,
        },
      },
    },
  });

  return res.getProfile as ApiResponse<Partial<IUser>>;
};
