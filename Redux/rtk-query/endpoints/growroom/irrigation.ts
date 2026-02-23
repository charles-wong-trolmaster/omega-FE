import { growRoomClient } from "../../growRoomClient";

interface FormOptions {
  wcs: { [deviceId: string]: string };
  dfm: { [deviceId: string]: string };
  valve: { [deviceId: string]: string };
  wd: { [deviceId: string]: string };
}

interface DeviceDetailsResponse {
  data: any;
  formOptions: FormOptions;
}

const growRoomIrrigationApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getIrrigationSensorsData: builder.query({
      query: ({ facility_id, room_id }) => {
        return {
          url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/irrigation/sensors`,
          method: "GET",
          headers: {
            "X-Realm": window.sessionStorage.getItem("realm") || "",
            Accept: "text/event-stream",
          },
          responseHandler: async (response) => {
            const reader = response.body?.getReader();

            if (!reader) {
              return {};
            }

            const decoder = new TextDecoder();

            let buffer = "";
            const dataMap: { [mac: string]: any[] } = {};
            let eventCount = 0;

            while (true) {
              const { done, value } = await reader.read();

              if (done) {
                break;
              }

              buffer += decoder.decode(value, { stream: true });

              const events = buffer.split("\n\n");
              buffer = events.pop() || "";

              for (const event of events) {
                if (!event.trim()) continue;

                eventCount++;

                const lines = event.split("\n");
                let eventData = null;

                for (const line of lines) {
                  if (line.startsWith("data:")) {
                    const jsonStr = line.substring(5).trim();

                    try {
                      eventData = JSON.parse(jsonStr);
                    } catch (e) {}
                  }
                }

                if (eventData) {
                  if (eventData.flag === "ALL_TASKS_COMPLETED") {
                    return dataMap;
                  }

                  if (
                    eventData.data &&
                    Object.keys(eventData.data).length > 0
                  ) {
                    Object.assign(dataMap, eventData.data);
                  } else {
                  }
                }
              }
            }
            return dataMap;
          },
        };
      },
      providesTags: ["GrowRoom"],
    }),
    updateIrrigationSensorSettings: builder.mutation({
      query: ({ facility_id, room_id, sensor_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/irrigation/sensors/${sensor_id}`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
    }),
    getIrrigationDevices: builder.query({
      query: ({ facility_id, room_id }) => {
        console.log("🔍 [IrrigationAPI] Query parameters:", {
          facility_id,
          room_id,
        });
        return {
          url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/irrigation/devices`,
          method: "GET",
          headers: {
            "X-Realm": window.sessionStorage.getItem("realm") || "",
            Accept: "text/event-stream",
          },
          responseHandler: async (response) => {
            console.log(
              "📥 [IrrigationAPI] Response received, starting SSE parsing...",
            );
            const reader = response.body?.getReader();

            if (!reader) {
              console.error("❌ [IrrigationAPI] No reader available");
              return { data: { pumps: {}, valves: {} } };
            }

            const decoder = new TextDecoder();
            let buffer = "";
            let finalData: any = { pumps: {}, valves: {} };

            while (true) {
              const { done, value } = await reader.read();

              if (done) {
                console.log("✅ [IrrigationAPI] Stream ended");
                break;
              }

              buffer += decoder.decode(value, { stream: true });
              const events = buffer.split("\n\n");
              buffer = events.pop() || "";

              for (const event of events) {
                if (!event.trim()) continue;

                const lines = event.split("\n");
                let eventData = null;

                for (const line of lines) {
                  if (line.startsWith("data:")) {
                    const jsonStr = line.substring(5).trim();
                    try {
                      eventData = JSON.parse(jsonStr);
                      console.log(
                        "📦 [IrrigationAPI] Parsed event:",
                        eventData,
                      );
                    } catch (e) {
                      console.error(
                        "❌ [IrrigationAPI] Failed to parse:",
                        jsonStr,
                      );
                    }
                  }
                }

                if (eventData) {
                  if (eventData.flag === "ALL_TASKS_COMPLETED") {
                    console.log(
                      "🏁 [IrrigationAPI] All tasks completed, final data:",
                      finalData,
                    );
                    return { data: finalData };
                  }

                  if (eventData.data) {
                    console.log(
                      "📊 [IrrigationAPI] Received data:",
                      eventData.data,
                    );
                    if (eventData.data.pumps) {
                      finalData.pumps = {
                        ...finalData.pumps,
                        ...eventData.data.pumps,
                      };
                    }
                    if (eventData.data.valves) {
                      finalData.valves = {
                        ...finalData.valves,
                        ...eventData.data.valves,
                      };
                    }
                  }
                }
              }
            }

            console.log("✅ [IrrigationAPI] Returning final data:", finalData);
            return { data: finalData };
          },
        };
      },
      transformResponse: (response: any) => {
        console.log(
          "📥 [IrrigationAPI] Transform Response:",
          JSON.stringify(response, null, 2),
        );
        return response;
      },
      transformErrorResponse: (error: any) => {
        console.error("❌ [IrrigationAPI] Error Response:", error);
        return error;
      },
      providesTags: ["GrowRoom"],
    }),

    updateIrrigationDevice: builder.mutation({
      query: ({ facility_id, room_id, device_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/irrigation/device/${device_id}`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      async onQueryStarted(
        { facility_id, room_id, device_id, payload },
        { dispatch, queryFulfilled },
      ) {
        // Optimistically update the cache
        const patchResult = dispatch(
          growRoomIrrigationApi.util.updateQueryData(
            "getIrrigationDevices",
            { facility_id, room_id },
            (draft) => {
              // Update pumps
              if (draft?.data?.pumps) {
                Object.keys(draft.data.pumps).forEach((key) => {
                  const devices = draft.data.pumps[key];
                  if (Array.isArray(devices)) {
                    devices.forEach((device) => {
                      if (device.deviceId === device_id && payload.deviceName) {
                        device.deviceName = payload.deviceName;
                      }
                    });
                  }
                });
              }

              // Update valves
              if (draft?.data?.valves) {
                Object.keys(draft.data.valves).forEach((key) => {
                  const devices = draft.data.valves[key];
                  if (Array.isArray(devices)) {
                    devices.forEach((device) => {
                      if (device.deviceId === device_id && payload.deviceName) {
                        device.deviceName = payload.deviceName;
                      }
                    });
                  }
                });
              }
            },
          ),
        );

        try {
          await queryFulfilled;
        } catch {
          // If the mutation fails, undo the optimistic update
          patchResult.undo();
        }
      },
      invalidatesTags: ["GrowRoom"],
    }),
    getIrrigationDeviceDetails: builder.query<
      DeviceDetailsResponse,
      { facility_id: string; room_id: string; device_id: string }
    >({
      query: ({ facility_id, room_id, device_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/irrigation/devices/${device_id}`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      transformResponse: (baseQueryReturnValue: any, meta) => {
        // Extract X-Form-Options header
        const formOptionsHeader =
          meta?.response?.headers?.get("X-Form-Options");
        let formOptions: FormOptions = { wcs: {}, dfm: {}, valve: {}, wd: {} };

        if (formOptionsHeader) {
          try {
            formOptions = JSON.parse(formOptionsHeader);
            console.log(
              "📋 [IrrigationAPI] Parsed X-Form-Options:",
              formOptions,
            );
          } catch (e) {
            console.error(
              "❌ [IrrigationAPI] Failed to parse X-Form-Options:",
              e,
            );
          }
        }

        return {
          data: baseQueryReturnValue.data,
          formOptions,
        };
      },
    }),
    getIrrigationPresets: builder.query({
      query: ({ facility_id, control_type }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/presets/irrigation?offset=0&limit=1000&sortBy=string&order=ASC&control=${control_type}`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
    }),
    updateIrrigationPresetSettings: builder.mutation({
      query: ({ facility_id, preset_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/presets/irrigation/${preset_id}`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    deletePreset: builder.mutation({
      query: ({ facility_id, preset_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/presets/irrigation/${preset_id}`,
        method: "DELETE",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    createPresetConfiguration: builder.mutation({
      query: ({ facility_id, control_type, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/presets/irrigation/${control_type}`,
        method: "POST",
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
  useCreatePresetConfigurationMutation,
  useDeletePresetMutation,
  useGetIrrigationDeviceDetailsQuery,
  useGetIrrigationDevicesQuery,
  useGetIrrigationPresetsQuery,
  useGetIrrigationSensorsDataQuery,
  useUpdateIrrigationDeviceMutation,
  useUpdateIrrigationPresetSettingsMutation,
  useUpdateIrrigationSensorSettingsMutation,
} = growRoomIrrigationApi;
