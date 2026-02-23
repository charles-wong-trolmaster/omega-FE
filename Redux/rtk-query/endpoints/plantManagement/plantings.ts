import { PlantBatch } from "@/types/cultivation/PlantBatchType";
import { cultivationClient } from "../../cultivationClient";
import { Planting } from "@/types/cultivation/PlantingType";

const plantingsApi = cultivationClient.injectEndpoints({
  endpoints: (builder) => ({
    getFullListOfPlantings: builder.query({
      query: () => `/plantings`,
      providesTags: () => [{ type: "Plantings", id: "FULL_LIST" }],
      transformResponse: (response: { result: Planting[] }) => response.result,
      transformErrorResponse: () => [],
    }),
    getListOfPlantings: builder.infiniteQuery({
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

        return `/plantings?${params.toString()}`;
      },
      providesTags: () => [{ type: "Plantings", id: "LIST" }],

      infiniteQueryOptions: {
        initialPageParam: {
          offset: 0,
          limit: 100,
        },

        getNextPageParam: (lastPage, allPages, lastPageParam) => {
          const currentPageData = lastPage;

          if (!currentPageData || currentPageData.length === 0) {
            return undefined;
          }

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
      transformResponse: (response: { result: Planting[] }) => response.result,
    }),
    getPlantingById: builder.query<Planting, string>({
      query: (id) => `/planting/${id}`,
      providesTags: (result, error, id) => [{ type: "Plantings", id }],
    }),
    retrocedePlantingToPackage: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/planting/${id}/retrocede`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id, payload }) => {
        return [
          { type: "Plantings", id: "LIST" },
          { type: "Plantings", id: "FULL_LIST" },
          { type: "Plantings", id },
          { type: "Packages", id: "LIST" },
          { type: "Packages", id: payload?.package },
        ];
      },
    }),
    createPlantBatchFromPlantingById: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/planting/${id}/batch`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => {
        return [
          { type: "Plantings", id: "LIST" },
          { type: "Plantings", id: "FULL_LIST" },
          { type: "Plantings", id },
        ];
      },
    }),
  }),
});

export const {
  useGetFullListOfPlantingsQuery,
  useCreatePlantBatchFromPlantingByIdMutation,
  useGetListOfPlantingsInfiniteQuery,
  useGetPlantingByIdQuery,
  useRetrocedePlantingToPackageMutation,
} = plantingsApi;
