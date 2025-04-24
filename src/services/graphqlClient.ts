import { Chain } from "../../zeus/zeus";
import { API_URL } from "../constants/config";

export const graphql = Chain(API_URL, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${localStorage.getItem("authToken") ?? ""}`,
  },
}); 
