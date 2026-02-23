import { Location } from "@/types/cultivation/Location";
import { cultivationClient } from "../../cultivationClient";

const locationsApi = cultivationClient.injectEndpoints({
  endpoints: (builder) => ({
    getFullListOfLocations: builder.query({
      query: () => `/locations`,
      providesTags: () => [{ type: "Locations", id: "FULL_LIST" }],
      transformResponse: (response: { result: Location[] }) => response.result,
    }),
    getListOfLocations: builder.infiniteQuery({
      query: (args) => {
        const {
          queryArg = { status: "", searchQuery: "" },
          pageParam = { offset: 0, limit: 100 },
        } = args;
        const { offset, limit } = pageParam;

        const params = new URLSearchParams({
          offset: offset.toString(),
          limit: limit.toString(),
        });

        return `/locations?${params.toString()}`;
      },
      providesTags: () => [{ type: "Locations", id: "LIST" }],

      infiniteQueryOptions: {
        initialPageParam: {
          offset: 0,
          limit: 100,
        },

        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          // Check if lastPage has data
          const currentPageData = lastPage;

          // If current page is empty or has no data, no more pages
          if (!currentPageData || currentPageData.length === 0) {
            return undefined;
          }

          // If the current page has fewer items than the limit, it's the last page
          if (currentPageData.length < lastPageParam.limit) {
            return undefined;
          }

          const nextOffset = lastPageParam.offset + lastPageParam.limit;

          return {
            offset: nextOffset,
            limit: lastPageParam.limit,
          };
        },

        getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
          const prevOffset = firstPageParam.offset - firstPageParam.limit;
          if (prevOffset < 0) return undefined;

          return {
            offset: prevOffset,
            limit: firstPageParam.limit,
          };
        },
      },
      transformResponse: (response: { result: Location[] }) => response.result,
    }),
    getLocationById: builder.query<Location, string>({
      query: (id) => `/location/${id}`,
      providesTags: (result, error, id) => [{ type: "Locations", id }],
    }),
    createNewLocation: builder.mutation({
      query: ({ payload }) => ({
        url: `/location`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: () => {
        return [
          { type: "Locations", id: "LIST" },
          { type: "Locations", id: "FULL_LIST" },
        ];
      },
    }),
    updateLocationById: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/location/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Locations", id: "LIST" },
        { type: "Locations", id: "FULL_LIST" },
        { type: "Locations", id },
      ],
    }),
    archiveLocationById: builder.mutation({
      query: (id) => ({
        url: `/location/${id}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Locations", id: "LIST" },
        { type: "Locations", id: "FULL_LIST" },
        { type: "Locations", id },
      ],
    }),
  }),
});

export const {
  useGetFullListOfLocationsQuery,
  useArchiveLocationByIdMutation,
  useCreateNewLocationMutation,
  useGetListOfLocationsInfiniteQuery,
  useGetLocationByIdQuery,
  useUpdateLocationByIdMutation,
} = locationsApi;
