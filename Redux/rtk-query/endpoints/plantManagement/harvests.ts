import { Harvest } from "@/types/cultivation/HarvestType";
import { cultivationClient } from "../../cultivationClient";
import { Item } from "@/types/cultivation/ItemType";

export const harvestsApi = cultivationClient.injectEndpoints({
  endpoints: (builder) => ({
    getFullListOfHarvests: builder.query({
      query: () => `/harvests`,
      providesTags: () => [{ type: "Harvests", id: "FULL_LIST" }],
      transformResponse: (response: { result: Harvest[] }) => response.result,
    }),
    getListOfHarvests: builder.infiniteQuery({
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

        return `/harvests?${params.toString()}`;
      },
      providesTags: () => [{ type: "Harvests", id: "LIST" }],

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
      transformResponse: (response: { result: Harvest[] }) => response.result,
    }),
    getHarvestById: builder.query<Harvest, string>({
      query: (id) => `/harvest/${id}`,
      providesTags: (result, error, id) => [{ type: "Harvests", id }],
    }),
    changeHarvestName: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/harvest/${id}/name`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => {
        return [
          { type: "Harvests", id: "LIST" },
          { type: "Harvests", id: "FULL_LIST" },
          { type: "Harvests", id },
        ];
      },
    }),
    changeHarvestLocation: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/harvest/${id}/location`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => {
        return [
          { type: "Harvests", id: "LIST" },
          { type: "Harvests", id: "FULL_LIST" },
          { type: "Harvests", id },
        ];
      },
    }),
    createPackageFromHarvest: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/harvest/${id}/package`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => {
        return [
          { type: "Harvests", id: "LIST" },
          { type: "Harvests", id: "FULL_LIST" },
          { type: "Harvests", id },
        ];
      },
    }),
  }),
});

export const {
  useGetFullListOfHarvestsQuery,
  useChangeHarvestLocationMutation,
  useChangeHarvestNameMutation,
  useGetHarvestByIdQuery,
  useGetListOfHarvestsInfiniteQuery,
  useCreatePackageFromHarvestMutation,
} = harvestsApi;
