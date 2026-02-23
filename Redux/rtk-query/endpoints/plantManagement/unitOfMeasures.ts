import { UnitOfMeasure } from "@/types/cultivation/UnitOfMeasureType";
import { cultivationClient } from "../../cultivationClient";

const unitOfMeasuresApi = cultivationClient.injectEndpoints({
  endpoints: (builder) => ({
    getFullListOfUnitOfMeasures: builder.query({
      query: () => `/uoms`,
      providesTags: () => [{ type: "UnitOfMeasures", id: "FULL_LIST" }],
      transformResponse: (response: { result: UnitOfMeasure[] }) =>
        response.result,
    }),
    getListOfUnitOfMeasures: builder.infiniteQuery({
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

        return `/uoms?${params.toString()}`;
      },
      providesTags: () => [{ type: "UnitOfMeasures", id: "LIST" }],

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
      transformResponse: (response: { result: UnitOfMeasure[] }) =>
        response.result,
    }),
  }),
});

export const {
  useGetFullListOfUnitOfMeasuresQuery,
  useGetListOfUnitOfMeasuresInfiniteQuery,
} = unitOfMeasuresApi;
