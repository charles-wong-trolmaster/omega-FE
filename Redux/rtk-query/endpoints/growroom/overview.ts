import { growRoomClient } from "../../growRoomClient";

const growRoomOverviewApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getRoomInfo: builder.query({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/overview/room_info`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    getRoomEnvironment: builder.query({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/overview/environment`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    getRoomMedium: builder.query({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/overview/irrigation/medium`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    getRoomNutrition: builder.query({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/overview/irrigation/nutrition`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    getRoomFlowmeter: builder.query({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/overview/irrigation/flow_meter`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    getRoomWaterDetector: builder.query({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/overview/irrigation/water_detector`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    getRoomSchedule: builder.query({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/overview/irrigation/schedule`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    updateRoomInfo: builder.mutation({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/overview/room_info`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
  }),
});

export const {
  useGetRoomInfoQuery,
  useGetRoomEnvironmentQuery,
  useGetRoomFlowmeterQuery,
  useGetRoomMediumQuery,
  useGetRoomNutritionQuery,
  useGetRoomScheduleQuery,
  useGetRoomWaterDetectorQuery,
  useUpdateRoomInfoMutation,
} = growRoomOverviewApi;
