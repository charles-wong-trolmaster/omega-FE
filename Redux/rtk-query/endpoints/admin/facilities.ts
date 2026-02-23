import { growRoomClient } from "../../growRoomClient";

const facilitiesApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getFacilityList: builder.query({
      query: () => ({
        url: `/api/v1/admin/facilities?offset=0&limit=1000`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
          //   authorization: `Bearer ${
          //     window.sessionStorage.getItem("access_token") || ""
          //   }`,
        },
      }),
      providesTags: ["Facilities"],
    }),
    createFacilities: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/admin/facilities`,
        method: "POST",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["Facilities"],
    }),
    updateFacility: builder.mutation({
      query: ({ facility_id, ...payload }) => ({
        url: `/api/v1/admin/facilities/${facility_id}`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["Facilities"],
    }),
    deleteFacility: builder.mutation({
      query: (facility_id) => ({
        url: `/api/v1/admin/facilities/${facility_id}`,
        method: "DELETE",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      invalidatesTags: ["Facilities"],
    }),
  }),
});

export const {
  useCreateFacilitiesMutation,
  useDeleteFacilityMutation,
  useGetFacilityListQuery,
  useUpdateFacilityMutation,
} = facilitiesApi;
