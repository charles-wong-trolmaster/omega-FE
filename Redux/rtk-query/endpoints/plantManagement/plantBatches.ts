import { PlantBatch } from "@/types/cultivation/PlantBatchType";
import { cultivationClient } from "../../cultivationClient";

const plantBatchesApi = cultivationClient.injectEndpoints({
  endpoints: (builder) => ({
    getFullListOfPlantBatches: builder.query({
      query: () => `/plantBatches`,
      providesTags: () => [{ type: "PlantBatches", id: "FULL_LIST" }],
      transformResponse: (response: { result: PlantBatch[] }) =>
        response.result,
    }),
    getListOfPlantBatchByPhaseId: builder.query<PlantBatch[], string>({
      query: (id) => `/plantBatches/phase/${id}`,
      providesTags: (result, error) => [{ type: "PlantBatches", id: "LIST" }],
      transformResponse: (response: { result: PlantBatch[] }) =>
        response.result,
    }),
    changeGrowPhase: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/plantBatch/${id}/phase`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => {
        return [
          { type: "PlantBatches", id: "LIST" },
          { type: "PlantBatches", id: "FULL_LIST" },
          { type: "PlantBatches", id },
        ];
      },
    }),
    createPackageFromPlantBatchById: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/plantBatch/${id}/package`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PlantBatches", id: "LIST" },
        { type: "PlantBatches", id: "FULL_LIST" },
        { type: "PlantBatches", id },
      ],
    }),
    splitPlantBatchById: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/plantBatch/${id}/split`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PlantBatches", id: "LIST" },
        { type: "PlantBatches", id: "FULL_LIST" },
        { type: "PlantBatches", id },
      ],
    }),
    changeStrainForPlantBatch: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/plantBatch/${id}/strain`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PlantBatches", id: "LIST" },
        { type: "PlantBatches", id: "FULL_LIST" },
        { type: "PlantBatches", id },
      ],
    }),
    replaceTagForPlantBatch: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/plantBatch/${id}/tag`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PlantBatches", id: "LIST" },
        { type: "PlantBatches", id: "FULL_LIST" },
        { type: "PlantBatches", id },
      ],
    }),
    changeLocationForPlantBatch: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/plantBatch/${id}/location`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PlantBatches", id: "LIST" },
        { type: "PlantBatches", id: "FULL_LIST" },
        { type: "PlantBatches", id },
      ],
    }),
    adjustPlantBatchById: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/plantBatch/${id}/adjust`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PlantBatches", id: "LIST" },
        { type: "PlantBatches", id: "FULL_LIST" },
        { type: "PlantBatches", id },
      ],
    }),
    destroyPlantBatchById: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/plantBatch/${id}/destroy`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PlantBatches", id: "LIST" },
        { type: "PlantBatches", id: "FULL_LIST" },
        { type: "PlantBatches", id },
      ],
    }),
    splitMaturePlantBatch: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/plantBatch/${id}/splitMature`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "PlantBatches", id: "LIST" },
        { type: "PlantBatches", id: "FULL_LIST" },
        { type: "PlantBatches", id },
      ],
    }),
    getAllPlantBatches: builder.infiniteQuery({
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

        return `/plantBatches?${params.toString()}`;
      },
      providesTags: () => [{ type: "PlantBatches", id: "LIST" }],

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
      transformResponse: (response: { result: PlantBatch[] }) =>
        response.result,
    }),
  }),
});

export const {
  useGetFullListOfPlantBatchesQuery,
  useAdjustPlantBatchByIdMutation,
  useChangeGrowPhaseMutation,
  useChangeLocationForPlantBatchMutation,
  useChangeStrainForPlantBatchMutation,
  useCreatePackageFromPlantBatchByIdMutation,
  useDestroyPlantBatchByIdMutation,
  useGetAllPlantBatchesInfiniteQuery,
  useGetListOfPlantBatchByPhaseIdQuery,
  useReplaceTagForPlantBatchMutation,
  useSplitMaturePlantBatchMutation,
  useSplitPlantBatchByIdMutation,
} = plantBatchesApi;
