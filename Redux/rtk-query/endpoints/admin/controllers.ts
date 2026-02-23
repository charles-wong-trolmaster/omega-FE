import { growRoomClient } from "../../growRoomClient";

const controllersApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getControllerList: builder.query({
      query: () => ({
        url: `/api/v1/admin/controllers`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["Controllers"],
    }),
    getControllersFromDynamoDB: builder.query({
      query: () => ({
        url: `/api/v1/admin/controllers/dynamodb`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["Controllers"],
    }),
    getControllerDetails: builder.query({
      query: (mac: string) => ({
        url: `/api/v1/admin/controllers/${mac}`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: (result, error, mac) => [
        "Controllers",
        { type: "Controllers", id: mac },
      ],
    }),
    addController: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/admin/controllers`,
        method: "POST",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["Controllers"],
    }),
    deleteController: builder.mutation({
      query: (mac: string) => ({
        url: `/api/v1/admin/controllers/${mac}`,
        method: "DELETE",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      invalidatesTags: ["Controllers"],
    }),
    getControllerSensors: builder.query({
      query: (mac: string) => ({
        url: `/api/v1/admin/controllers/${mac}/sensors`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
    }),
    getControllerDevices: builder.query({
      query: (mac: string) => ({
        url: `/api/v1/admin/controllers/${mac}/devices`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
    }),
    assignControllerToFacilityAndRoom: builder.mutation({
      query: ({ mac, facility_id, room_id, ...payload }) => ({
        url: `/api/v1/admin/controllers/${mac}/assign_to/facilities/${facility_id}/rooms/${room_id}`,
        method: "POST",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
    }),
    assignControllerToFacility: builder.mutation({
      query: ({ mac, facility_id, ...payload }) => ({
        url: `/api/v1/admin/controllers/${mac}/assign_to/facilities/${facility_id}`,
        method: "POST",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
    }),
    assignControllerToSingleRoom: builder.mutation({
      query: ({ mac, facility_id, room_id, ...payload }) => ({
        url: `/api/v1/admin/controllers/${mac}/assign_to_single_room`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
    }),
    assignControllerToMultipleRoom: builder.mutation({
      query: ({ mac, facility_id, room_id, ...payload }) => ({
        url: `/api/v1/admin/controllers/${mac}/assign_to_multiple_rooms`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: [payload],
      }),
    }),
  }),
});

export const {
  useAddControllerMutation,
  useDeleteControllerMutation,
  useGetControllerDevicesQuery,
  useGetControllerDetailsQuery,
  useGetControllerListQuery,
  useGetControllersFromDynamoDBQuery,
  useGetControllerSensorsQuery,
  useAssignControllerToFacilityAndRoomMutation,
  useAssignControllerToFacilityMutation,
  useLazyGetControllerDetailsQuery,
  useLazyGetControllerDevicesQuery,
  useLazyGetControllerSensorsQuery,
  useLazyGetControllerListQuery,
  useAssignControllerToMultipleRoomMutation,
  useAssignControllerToSingleRoomMutation,
} = controllersApi;
