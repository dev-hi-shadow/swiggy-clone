import { queryClient } from "../services/QueryClient";

export const showSiteLoader = () => {
  queryClient.setQueryData(["siteLoader"], { toggle: true });
};
export const hideSiteLoader = () => {
  queryClient.setQueryData(["siteLoader"], { toggle: false });
};