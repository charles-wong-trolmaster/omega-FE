import { Package } from "@/types/cultivation/PackageType";
import { cultivationClient } from "../../cultivationClient";

const packagesApi = cultivationClient.injectEndpoints({
  endpoints: (builder) => ({
    getFullListOfPackages: builder.query({
      query: () => `/packages`,
      providesTags: () => [{ type: "Packages", id: "FULL_LIST" }],
      transformResponse: (response: { result: Package[] }) => response.result,
    }),
    getListOfPackages: builder.infiniteQuery({
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

        return `/packages?${params.toString()}`;
      },
      providesTags: () => [{ type: "Packages", id: "LIST" }],

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
      transformResponse: (response: { result: Package[] }) => response.result,
    }),
    getPackageById: builder.query<Package, string>({
      query: (id) => `/package/${id}`,
      providesTags: (result, error, id) => [{ type: "Packages", id }],
    }),
    createNewPackage: builder.mutation({
      query: ({ payload }) => ({
        url: `/package`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: () => {
        return [
          { type: "Packages", id: "LIST" },
          { type: "Packages", id: "FULL_LIST" },
        ];
      },
    }),
    updatePackageById: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/package/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Packages", id: "LIST" },
        { type: "Packages", id: "FULL_LIST" },
        { type: "Packages", id },
      ],
    }),
    adjustPackageById: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/package/${id}/adjust`,
        method: "PATCH",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Packages", id: "LIST" },
        { type: "Packages", id: "FULL_LIST" },
        { type: "Packages", id },
      ],
    }),
    createPlantingByPackageId: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/package/${id}/planting`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Packages", id: "LIST" },
        { type: "Packages", id: "FULL_LIST" },
        { type: "Packages", id },
      ],
    }),
  }),
});

export const {
  useGetFullListOfPackagesQuery,
  useAdjustPackageByIdMutation,
  useCreateNewPackageMutation,
  useCreatePlantingByPackageIdMutation,
  useGetListOfPackagesInfiniteQuery,
  useGetPackageByIdQuery,
  useUpdatePackageByIdMutation,
} = packagesApi;
