import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export interface PageParam {
  limit: number;
  offset: number;
}

export const growRoomClient = createApi({
  reducerPath: "authClient",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://omega.dev.trolmaster.com",
    prepareHeaders: (headers) => {
      // This function runs on each request, in the browser
      if (typeof window !== "undefined") {
        const token = window.sessionStorage.getItem("access_token");
        if (token) {
          headers.set("authorization", `Bearer ${token}`);
        }
      }
      return headers;
    },
  }),
  tagTypes: [
    "Facilities",
    "Rooms",
    "Zones",
    "Setting",
    "Users",
    "Groups",
    "Controllers",
    "UserLogs",
    "My",
    "Company",
    "GrowRoom",
  ],
  endpoints: () => ({}),
});
