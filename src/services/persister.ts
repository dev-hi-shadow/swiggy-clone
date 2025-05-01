import { Persister } from "@tanstack/react-query-persist-client";

export const localStoragePersister: Persister = {
  persistClient: async (client) => {
    localStorage.setItem("REACT_QUERY_OFFLINE_CACHE", JSON.stringify(client));
  },
  restoreClient: async () => {
    const cache = localStorage.getItem("REACT_QUERY_OFFLINE_CACHE");
    return cache ? JSON.parse(cache) : undefined;
  },
  removeClient: async () => {
    localStorage.removeItem("REACT_QUERY_OFFLINE_CACHE");
  },
};
