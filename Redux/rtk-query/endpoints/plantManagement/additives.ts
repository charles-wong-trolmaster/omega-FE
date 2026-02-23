import { Additive } from "@/types/cultivation/AdditiveType";
import { cultivationClient } from "../../cultivationClient";

const additivesApi = cultivationClient.injectEndpoints({
  endpoints: (builder) => ({
    getFullListOfAdditives: builder.query({
      query: () => `/additives`,
      providesTags: () => [{ type: "Additives", id: "FULL_LIST" }],
      transformResponse: (response: { result: Additive[] }) => response.result,
    }),
    getListOfAdditives: builder.infiniteQuery({
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

        return `/additives?${params.toString()}`;
      },
      providesTags: () => [{ type: "Additives", id: "LIST" }],

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
      transformResponse: (response: { result: Additive[] }) => response.result,
    }),
    getAdditiveById: builder.query<Additive, string>({
      query: (id) => `/additive/${id}`,
      providesTags: (result, error, id) => [{ type: "Additives", id }],
    }),

    createAdditive: builder.mutation({
      query: ({ payload }) => ({
        url: `/additive`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: () => {
        return [
          { type: "Additives", id: "LIST" },
          { type: "Additives", id: "FULL_LIST" },
        ];
      },
    }),
    applyAdditiveToPlantBatch: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/plantBatch/${id}/additive`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Additives", id: "LIST" },
        { type: "Additives", id: "FULL_LIST" },
        { type: "Additives", id },
      ],
    }),
    applyAdditiveToLocation: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/location/${id}/additive`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Additives", id: "LIST" },
        { type: "Additives", id: "FULL_LIST" },
        { type: "Additives", id },
      ],
    }),
    applyAdditiveToPlant: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/plant/additive`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Additives", id: "LIST" },
        { type: "Additives", id: "FULL_LIST" },
        { type: "Additives", id },
      ],
    }),
    updateAdditive: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/additive/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Additives", id: "LIST" },
        { type: "Additives", id: "FULL_LIST" },
        { type: "Additives", id },
      ],
    }),
    archiveAdditive: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/additive/${id}/archive`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Additives", id: "LIST" },
        { type: "Additives", id: "FULL_LIST" },
        { type: "Additives", id },
      ],
    }),
  }),
});

export const {
  useGetFullListOfAdditivesQuery,
  useGetListOfAdditivesInfiniteQuery,
  useGetAdditiveByIdQuery,
  useApplyAdditiveToLocationMutation,
  useApplyAdditiveToPlantBatchMutation,
  useApplyAdditiveToPlantMutation,
  useArchiveAdditiveMutation,
  useCreateAdditiveMutation,
  useUpdateAdditiveMutation,
} = additivesApi;
