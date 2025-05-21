/* eslint-disable @typescript-eslint/no-explicit-any */
import { Moment } from "moment";

import { baseQuery } from "../BaseFetchQuery";
import { FormatResponse } from "../../types";
type ListQueryArgs = {
  endpoint: string;
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: number | string;
  config?: {
    [key: string]: string;
  };
  [key: string]:
    | string
    | boolean
    | number
    | undefined
    | Moment
    | Date
    | { [key: string]: string }
};
type MutationArgs<T> = {
  endpoint: string;
  body: T;
  invalidateQueries?: string[];
};

type DeleteArgs = {
  endpoint: string;
  invalidateQueries?: string[];
};

export const paginatedApi = baseQuery.injectEndpoints({
  endpoints: (build) => ({
    Get: build.query<
      {
        data: {
          data: any;
          isNextPage?: boolean;
          limit?: number;
          page?: number;
          totalCount?: number;
        };
        message: string;
        status: number;
        success: boolean;
        toast: boolean;
      },
      ListQueryArgs & { config?: RequestInit }
    >({
      query: ({ endpoint, page, limit, search, sortBy, config, ...rest }) => {
        const sortedParams = Object.fromEntries(
          Object.entries({ page, limit, search, sortBy, ...rest }).sort(
            ([a], [b]) => a.localeCompare(b)
          )
        );
        return {
          url: endpoint,
          params: sortedParams,
          ...config,
        };
      },
      transformResponse: (response: any) => response,
      providesTags: (_result, _error, arg) => [
        { type: "Swiggy" as const, id: arg.endpoint },
      ],
      keepUnusedDataFor: Infinity,
    }),

    Post: build.mutation<FormatResponse, MutationArgs<unknown>>({
      query: ({ endpoint, body }) => ({
        url: endpoint,
        method: "POST",
        body,
      }),
      transformResponse: (response: FormatResponse) => response,
      invalidatesTags: (
        _result,
        _error,
        { invalidateQueries = [], endpoint }
      ) => [
        ...invalidateQueries.map((id) => ({
          type: "Swiggy" as const,
          id,
        })),
        { type: "Swiggy" as const, id: endpoint },
      ],
    }),

    Put: build.mutation<FormatResponse, MutationArgs<unknown>>({
      query: ({ endpoint, body }) => ({
        url: endpoint,
        method: "PUT",
        body,
      }),
      transformResponse: (response: FormatResponse) => response,
      invalidatesTags: (
        _result,
        _error,
        { invalidateQueries = [], endpoint }
      ) => [
        ...invalidateQueries.map((id) => ({
          type: "Swiggy" as const,
          id,
        })),
        { type: "Swiggy" as const, id: endpoint },
      ],
    }),

    Delete: build.mutation<unknown, DeleteArgs>({
      query: ({ endpoint }) => ({
        url: endpoint,
        method: "DELETE",
      }),
      transformResponse: (response: FormatResponse) => response,
      invalidatesTags: (
        _result,
        _error,
        { invalidateQueries = [], endpoint }
      ) => [
        ...invalidateQueries.map((id) => ({
          type: "Swiggy" as const,
          id,
        })),
        { type: "Swiggy" as const, id: endpoint },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetQuery,
  usePostMutation,
  usePutMutation,
  useDeleteMutation,
  useLazyGetQuery,
} = paginatedApi;
