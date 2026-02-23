import { growRoomClient } from "../../growRoomClient";

const roomsApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getRoomList: builder.query({
      query: (facility_id) => ({
        url: `/api/v1/admin/facilities/${facility_id}/rooms?offset=0&limit=1000`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: (result, error, facility_id) => [
        { type: "Rooms", id: facility_id },
      ],
    }),
    createRooms: builder.mutation({
      query: ({ facility_id, rooms }) => ({
        url: `/api/v1/admin/facilities/${facility_id}/rooms`,
        method: "POST",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: rooms,
      }),
      invalidatesTags: (result, error, { facility_id }) => [
        { type: "Rooms", id: facility_id },
      ],
    }),
    updateRoom: builder.mutation({
      query: ({ facility_id, room_id, ...payload }) => ({
        url: `/api/v1/admin/facilities/${facility_id}/rooms/${room_id}`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: (result, error, { facility_id }) => [
        { type: "Rooms", id: facility_id },
      ],
    }),
    deleteRoom: builder.mutation({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/admin/facilities/${facility_id}/rooms/${room_id}`,
        method: "DELETE",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      invalidatesTags: (result, error, { facility_id }) => [
        { type: "Rooms", id: facility_id },
      ],
    }),
  }),
});

export const {
  useCreateRoomsMutation,
  useDeleteRoomMutation,
  useGetRoomListQuery,
  useLazyGetRoomListQuery,
  useUpdateRoomMutation,
} = roomsApi;
