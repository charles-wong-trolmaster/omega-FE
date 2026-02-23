import { growRoomClient } from "../../growRoomClient";

const growRoomAlarmApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getAlarms: builder.query({
      query: ({ facility_id, room_id, type }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/alarms/${type}?offset=0&limit=1000&sortBy=string&order=ASC`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    updateMultipleAlarms: builder.mutation({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/alarms`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    deleteMultipleAlarms: builder.mutation({
      query: ({ facility_id, room_id, alarmIds }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/alarms?alarmIds=${alarmIds ? alarmIds.join() : ""}`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    getAlarmSettingsConfiguration: builder.query({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/alarms/settings`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      providesTags: ["GrowRoom"],
    }),
    updateAlarmSettings: builder.mutation({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/alarms/settings`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
    }),
    getAlarmSettingDetails: builder.query({
      query: ({
        facility_id,
        room_id,
        alarm_setting_type,
        day_night_none,
      }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/alarms/settings/${alarm_setting_type}/${day_night_none}`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    updateAlarmSettingDetails: builder.mutation({
      query: ({
        facility_id,
        room_id,
        alarm_setting_type,
        day_night_none,
        payload,
      }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/alarms/settings/${alarm_setting_type}/${day_night_none}`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    getLinkIrrigationDevices: builder.query({
      query: ({ facility_id, room_id, sensor_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/alarms/settings/link_devices/${sensor_id}`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
  }),
});

export const {
  useDeleteMultipleAlarmsMutation,
  useGetAlarmSettingDetailsQuery,
  useGetAlarmSettingsConfigurationQuery,
  useGetAlarmsQuery,
  useGetLinkIrrigationDevicesQuery,
  useUpdateAlarmSettingDetailsMutation,
  useUpdateAlarmSettingsMutation,
  useUpdateMultipleAlarmsMutation,
} = growRoomAlarmApi;
