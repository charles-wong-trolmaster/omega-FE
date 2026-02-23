import { PackageTag } from "@/types/cultivation/PackageTagType";
import { cultivationClient } from "../../cultivationClient";

const packageTagsApi = cultivationClient.injectEndpoints({
  endpoints: (builder) => ({
    getFullListOfPackageTags: builder.query({
      query: () => `/packageTags`,
      providesTags: () => [{ type: "PackageTags", id: "FULL_LIST" }],
      transformResponse: (response: { result: PackageTag[] }) =>
        response.result,
    }),
    getListOfPackageTags: builder.infiniteQuery({
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

        return `/packageTags?${params.toString()}`;
      },
      providesTags: () => [{ type: "PackageTags", id: "LIST" }],

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
      transformResponse: (response: { result: PackageTag[] }) =>
        response.result,
    }),
  }),
});

export const {
  useGetFullListOfPackageTagsQuery,
  useGetListOfPackageTagsInfiniteQuery,
} = packageTagsApi;
