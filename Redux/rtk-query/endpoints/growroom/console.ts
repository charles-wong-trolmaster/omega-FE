import { growRoomClient } from "../../growRoomClient";

const growRoomConsoleApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getClimateConsoleStatusAndConfiguration: builder.query({
      query: ({ facility_id, room_id }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/console`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["GrowRoom"],
      transformResponse: (response: any, meta) => {
        const headers = meta?.response?.headers;
        let formOptionsHeader = null;

        if (headers) {
          formOptionsHeader =
            headers.get("X-Form-Options") ||
            headers.get("x-form-options") ||
            null;
        }

        return {
          ...response,
          headers: {
            "X-Form-Options": formOptionsHeader,
          },
        };
      },
    }),
    getIrrigationConsoleStatusAndConfiguration: builder.query({
      query: ({ facility_id, room_id }) => {
        return {
          url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/console/irrigation`,
          method: "GET",
          headers: {
            "X-Realm": window.sessionStorage.getItem("realm") || "",
            Accept: "text/event-stream",
          },
          responseHandler: async (response) => {
            const reader = response.body?.getReader();

            if (!reader) {
              console.error("=== NO READER AVAILABLE ===");
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
                    } catch (e) {
                      console.error("=== PARSE ERROR ===", e);
                    }
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
    updateConsoleSettings: builder.mutation({
      query: ({ facility_id, room_id, console_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/console/${console_id}`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
    }),
    startOverrideConfiguration: builder.mutation({
      query: ({ facility_id, room_id, override_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/console/override/${override_id}/start`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
    }),
    stopOverrideConfiguration: builder.mutation({
      query: ({ facility_id, room_id, override_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/console/override/${override_id}/stop`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
    }),
    updateOverrideConfiguration: builder.mutation({
      query: ({ facility_id, room_id, override_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/console/override/${override_id}`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    deleteOverrideConfiguration: builder.mutation({
      query: ({ facility_id, room_id, override_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/console/override/${override_id}`,
        method: "DELETE",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["GrowRoom"],
    }),
    addOverrideModeConfiguration: builder.mutation({
      query: ({ facility_id, room_id, payload }) => ({
        url: `/api/v1/facilities/${facility_id}/growroom/rooms/${room_id}/console/override`,
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
  useAddOverrideModeConfigurationMutation,
  useDeleteOverrideConfigurationMutation,
  useGetClimateConsoleStatusAndConfigurationQuery,
  useGetIrrigationConsoleStatusAndConfigurationQuery,
  useStartOverrideConfigurationMutation,
  useStopOverrideConfigurationMutation,
  useUpdateConsoleSettingsMutation,
  useUpdateOverrideConfigurationMutation,
} = growRoomConsoleApi;
