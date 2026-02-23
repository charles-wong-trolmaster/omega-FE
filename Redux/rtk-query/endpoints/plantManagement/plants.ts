import { Plant } from "@/types/cultivation/PlantType";
import { cultivationClient } from "../../cultivationClient";

const plantsApi = cultivationClient.injectEndpoints({
  endpoints: (builder) => ({
    getFullListOfPlants: builder.query({
      query: () => `/plants`,
      providesTags: () => [{ type: "Plants", id: "FULL_LIST" }],
      transformResponse: (response: { result: Plant[] }) => response.result,
    }),
    getListOfPlants: builder.infiniteQuery({
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

        return `/plants?${params.toString()}`;
      },
      providesTags: () => [{ type: "Plants", id: "LIST" }],

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
      transformResponse: (response: { result: Plant[] }) => response.result,
    }),
    changeStrainForPlants: builder.mutation({
      query: ({ payload }) => ({
        url: `/plant/strain`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => {
        return [
          { type: "Plants", id: "LIST" },
          { type: "Plants", id: "FULL_LIST" },
          { type: "Plants", id },
          { type: "PlantBatches", id: "LIST" },
        ];
      },
    }),
    changeTagForPlant: builder.mutation({
      query: ({ payload }) => ({
        url: `/plant/tag`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => {
        return [
          { type: "Plants", id: "LIST" },
          { type: "Plants", id: "FULL_LIST" },
          { type: "Plants", id },
          { type: "PlantBatches", id: "LIST" },
        ];
      },
    }),
    createHarvestFromPlants: builder.mutation({
      query: ({ payload }) => ({
        url: `/plant/harvest`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => {
        return [
          { type: "Plants", id: "LIST" },
          { type: "Plants", id: "FULL_LIST" },
          { type: "Plants", id },
          { type: "PlantBatches", id: "LIST" },
        ];
      },
    }),
    createManicureFromPlants: builder.mutation({
      query: ({ payload }) => ({
        url: `/plant/manicure`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => {
        return [
          { type: "Plants", id: "LIST" },
          { type: "Plants", id: "FULL_LIST" },
          { type: "Plants", id },
          { type: "PlantBatches", id: "LIST" },
        ];
      },
    }),
  }),
});

export const {
  useGetFullListOfPlantsQuery,
  useChangeStrainForPlantsMutation,
  useChangeTagForPlantMutation,
  useCreateHarvestFromPlantsMutation,
  useCreateManicureFromPlantsMutation,
  useGetListOfPlantsInfiniteQuery,
} = plantsApi;
