import { growRoomClient } from "../../../growRoomClient";

const groupsApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getUserGroupListByFacility: builder.query({
      query: (facility_id) => ({
        url: `/api/v1/admin/groups/${facility_id}`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["Groups"],
    }),
    getUserGroupMembers: builder.query({
      query: (group_id) => ({
        url: `/api/v1/admin/groups/${group_id}/users`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: (result, error, group_id) => [
        { type: "Groups", id: group_id },
      ],
    }),
    addManyUsersToOneGroup: builder.mutation({
      query: ({ group_id, ...payload }) => ({
        url: `/api/v1/admin/groups/${group_id}/users`,
        method: "POST",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: (result, error, { group_id }) => [
        "Users",
        { type: "Groups", id: group_id },
      ],
    }),
    addManyGroupsToOneUser: builder.mutation({
      query: ({ user_id, ...payload }) => ({
        url: `/api/v1/admin/users/${user_id}/groups`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: (result, error, { user_id }) => [
        "Groups",
        { type: "Users", id: user_id },
      ],
    }),
    removeUserFromGroup: builder.mutation({
      query: ({ user_id, group_id }) => ({
        url: `/api/v1/admin/users/${user_id}/groups/${group_id}`,
        method: "DELETE",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      invalidatesTags: (result, error, { user_id, group_id }) => [
        "Groups",
        { type: "Groups", id: group_id },
        { type: "Users", id: user_id },
      ],
    }),
  }),
});

export const {
  useAddManyGroupsToOneUserMutation,
  useAddManyUsersToOneGroupMutation,
  useGetUserGroupListByFacilityQuery,
  useLazyGetUserGroupListByFacilityQuery,
  useGetUserGroupMembersQuery,
  useRemoveUserFromGroupMutation,
} = groupsApi;
