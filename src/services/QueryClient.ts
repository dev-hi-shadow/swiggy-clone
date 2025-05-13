import { QueryClient } from "@tanstack/react-query";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { localStoragePersister } from "./persister";

const whitelist = ["profile", "activeRestaurant", "activeRBranch", "auth"];

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error) => {
        console.log(
          "errorerrorerrorerrorerrorerrorerrorerrorerrorerrorerrorerrorerrorerrorerrorerrorerrorerror",
          error
        );
      },
    },
 
  },
});

persistQueryClient({
  queryClient,
  persister: localStoragePersister,
  dehydrateOptions: {
    shouldDehydrateQuery: (query) => {
      return whitelist.includes(query.queryKey[0] as string);
    },
  },
});
