import { growRoomClient } from "../../growRoomClient";

const myApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: () => ({
        url: `/my/profile`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["My"],
    }),
    updateProfile: builder.mutation({
      query: (payload) => ({
        url: `/my/profile`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["My"],
    }),
    setPassword: builder.mutation({
      query: (payload) => ({
        url: `/my/password`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["My"],
    }),
    setPin: builder.mutation({
      query: (payload) => ({
        url: `/my/pin`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["My"],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useSetPasswordMutation,
  useSetPinMutation,
  useUpdateProfileMutation,
} = myApi;
