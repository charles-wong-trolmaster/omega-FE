import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PageParam {
  limit: number;
  offset: number;
}

export const cultivationClient = createApi({
  reducerPath: "client",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://59.148.50.238:3001/api",
    prepareHeaders: (headers) => {
      // This function runs on each request, in the browser
      if (typeof window !== "undefined") {
        const token = sessionStorage.getItem("token");
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: [
    "Suppliers",
    "Items",
    "Categories",
    "UnitOfMeasures",
    "Strains",
    "PackageTags",
    "Locations",
    "Reasons",
    "Packages",
    "PlantBatches",
    "Phases",
    "Plantings",
    "PlantTags",
    "Plants",
    "Harvests",
    "Additives",
  ],
  endpoints: () => ({}),
});
