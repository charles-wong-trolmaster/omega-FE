import { growRoomClient } from "../../growRoomClient";

const settingApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getConfiguration: builder.query({
      query: () => ({
        url: `/api/v1/admin/setting/unit_preferences`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: () => [{ type: "Setting" }],
    }),
    updateConfiguration: builder.mutation({
      query: ({ ...payload }) => ({
        url: `/api/v1/admin/setting/unit_preferences`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: () => [{ type: "Setting" }],
    }),
  }),
});

export const { useGetConfigurationQuery, useUpdateConfigurationMutation } =
  settingApi;
