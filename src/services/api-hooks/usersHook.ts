import { useMutation } from "@tanstack/react-query";
import type { IUser, Response } from "../../types";
import { updateUser } from "../APIs/users";
 
export const useUpdateUser = () => {
  return (
    useMutation <
    Response<Partial<IUser> | undefined, Error, Partial<IUser>>({
      mutationFn: updateUser,
      onSuccess: (data) => {
        if (data?.success) {
          if (data.isToast) {
            console.log(data.message);
          }
        }
      },
      onError: (error: Error) => {
        console.error("Error creating user:", error);
      },
    })
  );
};
