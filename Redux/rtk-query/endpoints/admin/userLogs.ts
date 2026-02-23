import { growRoomClient } from "../../growRoomClient";

const userLogsApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getUserLogs: builder.query({
      query: () => ({
        url: `/api/v1/admin/userlogs`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["UserLogs"],
    }),
  }),
});

export const { useGetUserLogsQuery } = userLogsApi;
