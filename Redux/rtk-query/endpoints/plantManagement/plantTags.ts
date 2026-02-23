import { cultivationClient } from "../../cultivationClient";
import { PlantTag } from "@/types/cultivation/PlantTagType";

const plantTagsApi = cultivationClient.injectEndpoints({
  endpoints: (builder) => ({
    getFullListOfPlantTags: builder.query({
      query: () => `/plantTags`,
      providesTags: () => [{ type: "PlantTags", id: "FULL_LIST" }],
      transformResponse: (response: { result: PlantTag[] }) => response.result,
    }),
    getListOfPlantTags: builder.infiniteQuery({
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

        return `/plantTags?${params.toString()}`;
      },
      providesTags: () => [{ type: "PlantTags", id: "LIST" }],

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
      transformResponse: (response: { result: PlantTag[] }) => response.result,
    }),
  }),
});

export const {
  useGetFullListOfPlantTagsQuery,
  useGetListOfPlantTagsInfiniteQuery,
} = plantTagsApi;
