import { Strain } from "@/types/cultivation/StrainType";
import { cultivationClient } from "../../cultivationClient";

const strainsApi = cultivationClient.injectEndpoints({
  endpoints: (builder) => ({
    getFullListOfStrains: builder.query({
      query: () => `/strains`,
      providesTags: () => [{ type: "Strains", id: "FULL_LIST" }],
      transformResponse: (response: { result: Strain[] }) => response.result,
    }),
    getListOfStrains: builder.infiniteQuery({
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

        return `/strains?${params.toString()}`;
      },
      providesTags: () => [{ type: "Strains", id: "LIST" }],

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
      transformResponse: (response: { result: Strain[] }) => response.result,
    }),
    getStrainById: builder.query<Strain, string>({
      query: (id) => `/strain/${id}`,
      providesTags: (result, error, id) => [{ type: "Strains", id }],
    }),
    createNewStrain: builder.mutation({
      query: ({ payload }) => ({
        url: `/strain`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: () => {
        return [
          { type: "Strains", id: "LIST" },
          { type: "Strains", id: "FULL_LIST" },
        ];
      },
    }),
    updateStrainById: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/strain/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Strains", id: "LIST" },
        { type: "Strains", id: "FULL_LIST" },
        { type: "Strains", id },
      ],
    }),
    archiveStrainById: builder.mutation({
      query: (id) => ({
        url: `/strain/${id}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Strains", id: "LIST" },
        { type: "Strains", id: "FULL_LIST" },
        { type: "Strains", id },
      ],
    }),
  }),
});

export const {
  useGetFullListOfStrainsQuery,
  useArchiveStrainByIdMutation,
  useCreateNewStrainMutation,
  useGetListOfStrainsInfiniteQuery,
  useGetStrainByIdQuery,
  useUpdateStrainByIdMutation,
} = strainsApi;
