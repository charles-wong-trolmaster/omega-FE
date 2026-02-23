import { growRoomClient } from "../../growRoomClient";

const zonesApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getZoneList: builder.query({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/admin/facilities/${facility_id}/rooms/${room_id}/zones?offset=0&limit=1000`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: (result, error, { facility_id, room_id }) => [
        { type: "Zones", id: `${facility_id}-${room_id}` },
      ],
    }),
    createZones: builder.mutation({
      query: ({ facility_id, room_id, zones }) => ({
        url: `/api/v1/admin/facilities/${facility_id}/rooms/${room_id}/zones`,
        method: "POST",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: zones,
      }),
      invalidatesTags: (result, error, { facility_id, room_id }) => [
        { type: "Rooms", id: facility_id },
        { type: "Zones", id: `${facility_id}-${room_id}` },
      ],
    }),
    updateZone: builder.mutation({
      query: ({ facility_id, room_id, zone_id, ...payload }) => ({
        url: `/api/v1/admin/facilities/${facility_id}/rooms/${room_id}/zones/${zone_id}`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: (result, error, { facility_id, room_id }) => [
        { type: "Zones", id: `${facility_id}-${room_id}` },
        { type: "Rooms", id: facility_id },
      ],
    }),
    deleteZone: builder.mutation({
      query: ({ facility_id, room_id, zone_id }) => ({
        url: `/api/v1/admin/facilities/${facility_id}/rooms/${room_id}/zones/${zone_id}`,
        method: "DELETE",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      invalidatesTags: (result, error, { facility_id, room_id }) => [
        { type: "Zones", id: `${facility_id}-${room_id}` },
        { type: "Rooms", id: facility_id },
      ],
    }),
  }),
});

export const {
  useCreateZonesMutation,
  useDeleteZoneMutation,
  useGetZoneListQuery,
  useUpdateZoneMutation,
} = zonesApi;
