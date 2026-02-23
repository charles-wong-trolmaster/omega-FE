import { growRoomClient } from "../../growRoomClient";

const companyApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    getCompanyInformation: builder.query({
      query: () => ({
        url: `/api/v1/admin/company`,
        method: "GET",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
      }),
      providesTags: ["Company"],
    }),
    updateCompanyInformation: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/admin/company`,
        method: "PATCH",
        headers: {
          "X-Realm": window.sessionStorage.getItem("realm") || "",
        },
        body: payload,
      }),
      invalidatesTags: ["Company"],
    }),
  }),
});

export const {
  useGetCompanyInformationQuery,
  useUpdateCompanyInformationMutation,
} = companyApi;
