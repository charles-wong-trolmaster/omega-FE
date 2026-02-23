import { growRoomClient } from "../../../growRoomClient";

const usersApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getUserList: builder.query({
      query: () => ({
        url: `/api/v1/admin/users`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["Users"],
    }),
    getOneUserById: builder.query({
      query: (user_id) => ({
        url: `/api/v1/admin/users/${user_id}`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: (result, error, user_id) => [
        { type: "Users", id: user_id },
      ],
    }),
    createUser: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/admin/users`,
        method: "POST",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["Users"],
    }),
    updateUser: builder.mutation({
      query: ({ user_id, ...payload }) => ({
        url: `/api/v1/admin/users/${user_id}`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: (result, error, { user_id }) => [
        "Users",
        { type: "Users", id: user_id },
      ],
    }),
    setUserPassword: builder.mutation({
      query: ({ user_id, ...payload }) => ({
        url: `/api/v1/admin/users/${user_id}/password`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
    }),
    enableUser: builder.mutation({
      query: (user_id) => ({
        url: `/api/v1/admin/users/${user_id}/enable`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      invalidatesTags: (result, error, user_id) => [
        "Users",
        { type: "Users", id: user_id },
      ],
    }),
    disableUser: builder.mutation({
      query: (user_id) => ({
        url: `/api/v1/admin/users/${user_id}/disable`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      invalidatesTags: (result, error, user_id) => [
        "Users",
        { type: "Users", id: user_id },
      ],
    }),
    getUserGroups: builder.query({
      query: (user_id) => ({
        url: `/api/v1/admin/users/${user_id}/groups`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: (result, error, user_id) => [
        { type: "Users", id: user_id },
      ],
    }),
    deleteUser: builder.mutation({
      query: (user_id) => ({
        url: `/api/v1/admin/users/${user_id}`,
        method: "DELETE",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useCreateUserMutation,
  useDeleteUserMutation,
  useDisableUserMutation,
  useEnableUserMutation,
  useGetOneUserByIdQuery,
  useGetUserGroupsQuery,
  useGetUserListQuery,
  useSetUserPasswordMutation,
  useUpdateUserMutation,
} = usersApi;
