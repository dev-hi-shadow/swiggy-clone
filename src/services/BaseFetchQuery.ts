import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import store from "./store";

export const FetchBaseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL as string,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");
    headers.set("Authorization", `Bearer ${store.getState()?.auth?.token}`);
     return headers;
  },
});

export const baseQuery = createApi({
  reducerPath: "api",
  baseQuery: FetchBaseQuery,
  tagTypes: ["Swiggy"],
  endpoints: () => ({}),
});
