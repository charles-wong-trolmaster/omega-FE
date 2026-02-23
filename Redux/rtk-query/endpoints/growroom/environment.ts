import { growRoomClient } from "../../growRoomClient";

const growRoomEnvironmentApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getRoomEnvironmentSettings: builder.query({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      transformResponse: (response: any, meta) => {
        console.log("=== RTK Query Transform Response ===");
        console.log("Raw response:", response);
        console.log("Meta:", meta);
        console.log("Response headers:", meta?.response?.headers);

        // Extract headers
        const headers: Record<string, string> = {};
        if (meta?.response?.headers) {
          meta.response.headers.forEach((value: string, key: string) => {
            headers[key.toLowerCase()] = value;
            console.log(`Header: ${key} = ${value}`);
          });
        }

        return {
          data: response,
          headers: headers,
        };
      },
      providesTags: ["GrowRoom"],
    }),
    getSensors: builder.query({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/sensors`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    getDevices: builder.query({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/devices`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    getDeviceDetails: builder.query({
      query: ({ facility_id, room_id, device_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/devices/${device_id}`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      transformResponse: (response: any, meta) => {
        console.log("=== RTK Query getDeviceDetails Transform Response ===");
        console.log("Raw response:", response);
        console.log("Meta:", meta);
        console.log("Response headers:", meta?.response?.headers);

        // Extract headers
        const headers: Record<string, string> = {};
        if (meta?.response?.headers) {
          meta.response.headers.forEach((value: string, key: string) => {
            headers[key.toLowerCase()] = value;
            console.log(`Header: ${key} = ${value}`);
          });
        }

        console.log("Extracted headers object:", headers);
        console.log("x-form-options header:", headers["X-Form-Options"]);

        return {
          data: response,
          headers: headers,
        };
      },
      providesTags: ["GrowRoom"],
    }),
    getLrcScheduleList: builder.query({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/devices/lrc/schedules`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    getPresets: builder.query({
      query: ({ facility_id, control, mode }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/presets?offset=0&limit=1000&sortBy=string&order=ASC&control=${control}&mode=${mode}`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    updateLightLineSettings: builder.mutation({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/light/line`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    updateLightLineGroupSettings: builder.mutation({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/light/line_group`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    updateLightSpectrumSettings: builder.mutation({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/light/spectrum`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    updateLightSpectrumGroupSettings: builder.mutation({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/light/spectrum_group`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    updateLightDLISettings: builder.mutation({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/light/dli`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    updateLightCloudEffectSettings: builder.mutation({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/light/cloud_effect`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    updateClimateControlSettings: builder.mutation({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/climate`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    updateSensorName: builder.mutation({
      query: ({ facility_id, room_id, sensor_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/sensors/${sensor_id}`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    updateDeviceDetails: builder.mutation({
      query: ({ facility_id, room_id, device_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/devices/${device_id}`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    updateLrcSchedule: builder.mutation({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/devices/lrc/schedules`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    updatePresetSettings: builder.mutation({
      query: ({ facility_id, preset_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/presets/${preset_id}`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    addLrcSchedule: builder.mutation({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/devices/lrc/schedules`,
        method: "POST",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    createNewPresetConfiguration: builder.mutation({
      query: ({ facility_id, mode, control, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/presets/${mode}/${control}`,
        method: "POST",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    deleteLrcSchedule: builder.mutation({
      query: ({ facility_id, room_id, schedule_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/environment/devices/lrc/schedules/${schedule_id}`,
        method: "DELETE",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    deletePreset: builder.mutation({
      query: ({ facility_id, preset_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/presets/${preset_id}`,
        method: "DELETE",
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
  useAddLrcScheduleMutation,
  useCreateNewPresetConfigurationMutation,
  useDeleteLrcScheduleMutation,
  useDeletePresetMutation,
  useGetDeviceDetailsQuery,
  useGetDevicesQuery,
  useGetLrcScheduleListQuery,
  useGetPresetsQuery,
  useGetRoomEnvironmentSettingsQuery,
  useGetSensorsQuery,
  useUpdateClimateControlSettingsMutation,
  useUpdateDeviceDetailsMutation,
  useUpdateLightCloudEffectSettingsMutation,
  useUpdateLightDLISettingsMutation,
  useUpdateLightLineGroupSettingsMutation,
  useUpdateLightLineSettingsMutation,
  useUpdateLightSpectrumGroupSettingsMutation,
  useUpdateLightSpectrumSettingsMutation,
  useUpdateLrcScheduleMutation,
  useUpdatePresetSettingsMutation,
  useUpdateSensorNameMutation,
} = growRoomEnvironmentApi;
