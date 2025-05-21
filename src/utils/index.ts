// utils/idEncoder.ts
import Hashids from "hashids";
import { SECRET_KEY } from "../constants/config";
 import {
   API_ENDPOINTS,
   RESTAURANT_API_ENDPOINTS,
   BRANCH_API_ENDPOINTS,
 } from "../constants";
import store from "../services/store";


const hashids = new Hashids(SECRET_KEY, 6); 


export const encodeId = (id: number): string => {
  return hashids.encode(id);
};


export const decodeId = (encodedId: number|string): number => {
  const [decoded] = hashids.decode(String(encodedId));
  return typeof decoded === "number" ? decoded : NaN;
};



const buildUrl = (args: Record<string, unknown>, endpoint: string) => {
  const sortedParams = Object.fromEntries(
    Object.entries(args)
      .filter(([k]) => k !== "endpoint")
      .sort(([a], [b]) => a.localeCompare(b))
  );

  const searchParams = new URLSearchParams(
    Object.entries(sortedParams).reduce((acc, [key, value]) => {
      acc[key] = typeof value === "string" ? value : JSON.stringify(value);
      return acc;
    }, {} as Record<string, string>)
  ).toString();

  return searchParams ? `${endpoint}?${searchParams}` : endpoint;
};

export const invalidateRoutes = (inputUrl: string) => {
  const cacheState = store?.getState()?.api?.queries;
  const matchedRoutes: string[] =
    inputUrl === "ALL"
      ? (Object.values(API_ENDPOINTS) as string[]).concat(
          Object.values(RESTAURANT_API_ENDPOINTS) as string[]
        )
      : inputUrl === "CHANGE_RESTAURANT"
      ? Object.values(RESTAURANT_API_ENDPOINTS).concat(Object.values(BRANCH_API_ENDPOINTS))
      : [];

  // Handle "ALL"
  if (inputUrl === "ALL") {
    for (const key in cacheState) {
      const parsed = key.match(/^getData\((.*)\)$/);
      if (!parsed) continue;

      try {
        const args = JSON.parse(parsed[1]);
        const url = buildUrl(args, args.endpoint);
        matchedRoutes.push(url);
      } catch {
        continue;
      }
    }
  }

  // Handle "CHANGE_RESTAURANT"
  else if (inputUrl === "CHANGE_RESTAURANT") {
    const validEndpoints = new Set(
      Object.values(RESTAURANT_API_ENDPOINTS).concat(
        Object.values(BRANCH_API_ENDPOINTS)
      )
    );
    
    for (const key in cacheState) {
      const parsed = key.match(/^getData\((.*)\)$/);
      if (!parsed) continue;

      try {
        const args = JSON.parse(parsed[1]);
        const endpoint = args.endpoint;
        if (validEndpoints.has(endpoint)) {
          matchedRoutes.push(buildUrl(args, endpoint));
        }
      } catch {
        continue;
      }
    }
  }
  else if (inputUrl === "CHANGE_BRANCH") {
    const validEndpoints = new Set(Object.values(BRANCH_API_ENDPOINTS));
    for (const key in cacheState) {
      const parsed = key.match(/^getData\((.*)\)$/);
      if (!parsed) continue;

      try {
        const args = JSON.parse(parsed[1]);
        const endpoint = args.endpoint;
        if (validEndpoints.has(endpoint)) {
          matchedRoutes.push(buildUrl(args, endpoint));
        }
      } catch {
        continue;
      }
    }
  }

else {
  const [basePath] = inputUrl.split("?");
  const segments = (basePath ? basePath : inputUrl).split("/").filter(Boolean);

  const targets = new Set<string>();
  let currentPath = "";
  for (const segment of segments) {
    currentPath += `/${segment}`;
    targets.add(currentPath);
  }

  for (const key in cacheState) {
    const parsed = key.match(/^Get\((.*)\)$/);
    if (!parsed) continue;

    try {
      const args = JSON.parse(parsed[1]);
      const endpoint = args.endpoint;
      // Check if the endpoint starts with any of the target prefixes
      if (Array.from(targets).some((target) => endpoint.startsWith(target))) {
        matchedRoutes.push(buildUrl(args, endpoint));
      }
    } catch {
      continue;
    }
  }
}

  console.log("🚀 ~ invalidateRoutes ~ matchedRoutes:", matchedRoutes)
  return matchedRoutes;
};
