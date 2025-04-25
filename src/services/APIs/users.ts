import { IUser, ApiResponse } from "../../types";
import { graphql } from "../graphqlClient";

export const updateUser = async (
  input: Partial<IUser>
): Promise<ApiResponse<Partial<IUser>> | undefined> => {
  const res = await graphql("mutation")({
    updateUser: [
      {
        ...input,
        zip_code: input.zip_code != null ? Number(input.zip_code) : null,
        referral_code:
          input.referral_code != null ? Number(input.referral_code) : null,
        referred_by:
          input.referred_by != null ? Number(input.referred_by) : null,
        otp_code: input.otp_code != null ? Number(input.otp_code) : null,
      },
      {
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
        },
        isError: true,
        status: true,
        success: true,
        isToast: true,
        message: true,
       },
    ],
  });
  return res?.updateUser as ApiResponse<Partial<IUser>>;
};


export const getUserDetails = async (): Promise<ApiResponse<Partial<IUser>>> => {
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
        aadhar_card: true,
        pan_card: true,
        voter_id: true,
        dob: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        country: true,
        zip_code: true,
        referred_by: true,
        role: {
          name: true,
          id: true,
        },
      },
    },
  });

  return res.getProfile as ApiResponse<Partial<IUser>>;
};