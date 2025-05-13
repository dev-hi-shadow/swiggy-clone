import { Chain } from "../../zeus/zeus";
import { API_URL } from "../constants/config";
import { IAuthenticate } from "../types";
import { queryClient } from "./QueryClient";

export const graphql = Chain(API_URL, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${
      queryClient.getQueryData<IAuthenticate>(["auth"])?.token ??
      localStorage.getItem("authToken")
    }`,
  },
}); 
