// auth.ts
import { growRoomClient } from "../../growRoomClient";

const authApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: ({ realm, ...payload }) => ({
        url: `/auth/login`,
        method: "POST",
        headers: {
          "X-Realm": realm,
        },
        body: payload,
      }),
      transformResponse: (response: any, meta) => {
        // Extract headers and store in session storage
        if (meta?.response?.headers) {
          const headers = meta.response.headers;

          const traceId = headers.get("x-trace-id");
          const userEmail = headers.get("x-user-email");
          const userFirstname = headers.get("x-user-firstname");
          const userId = headers.get("x-user-id");
          const userLastname = headers.get("x-user-lastname");
          const userRoles = headers.get("x-user-roles");

          if (traceId) window.sessionStorage.setItem("traceId", traceId);
          if (userEmail) window.sessionStorage.setItem("userEmail", userEmail);
          if (userFirstname)
            window.sessionStorage.setItem("userFirstname", userFirstname);
          if (userId) window.sessionStorage.setItem("userId", userId);
          if (userLastname)
            window.sessionStorage.setItem("userLastname", userLastname);
          if (userRoles) window.sessionStorage.setItem("userRoles", userRoles);
        }

        return response;
      },
    }),
    refreshToken: builder.mutation({
      query: (payload) => ({
        url: `/auth/refresh`,
        method: "POST",
        body: payload,
      }),
    }),
    logout: builder.mutation({
      query: ({ realm, ...payload }) => ({
        url: `/auth/logout`,
        method: "POST",
        headers: {
          "X-Realm": realm,
        },
        body: payload,
      }),
      transformResponse: () => {
        window.sessionStorage.clear();
        window.location.href = "/";
      },
    }),
    getUnitPreference: builder.mutation({
      query: (realm) => ({
        url: `/api/v1/setting/unit_preferences`,
        method: "GET",
        headers: {
          "X-Realm": realm,
        },
      }),
      transformResponse: (response: any) => {
        if (response.success && response.data) {
          const data = response.data;
          window.sessionStorage.setItem("temp", String(data.temp));
          window.sessionStorage.setItem("light", String(data.light));
          window.sessionStorage.setItem("vpd", String(data.vpd));
          window.sessionStorage.setItem("tds", String(data.tds));
          window.sessionStorage.setItem("volume", String(data.volume));
          window.sessionStorage.setItem("flow", String(data.flow));
          window.sessionStorage.setItem("injection", String(data.injection));
          window.sessionStorage.setItem("timeFormat", String(data.timeFormat));
        }
        return response;
      },
    }),
  }),
});

export const {
  useLoginMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useGetUnitPreferenceMutation,
} = authApi;
