import { Supplier } from "@/types/cultivation/SupplierType";
import { cultivationClient } from "../../cultivationClient";

const supplierApi = cultivationClient.injectEndpoints({
  endpoints: (builder) => ({
    getFullListOfSuppliers: builder.query({
      query: () => `/suppliers`,
      providesTags: () => [{ type: "Suppliers", id: "FULL_LIST" }],
      transformResponse: (response: { result: Supplier[] }) => response.result,
    }),
    getListOfSuppliers: builder.infiniteQuery({
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

        // Only add status and searchQuery if they have values
        if (queryArg.status) {
          params.append("status", queryArg.status);
        }
        if (queryArg.searchQuery) {
          params.append("searchQuery", queryArg.searchQuery);
        }

        return `/suppliers?${params.toString()}`;
      },
      providesTags: () => [{ type: "Suppliers", id: "LIST" }],

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
      transformResponse: (response: { result: Supplier[] }) => response.result,
    }),
    getSupplierById: builder.query<Supplier, string>({
      query: (id) => `/supplier/${id}`,
      providesTags: (result, error, id) => [{ type: "Suppliers", id }],
    }),
    createNewSupplier: builder.mutation({
      query: ({ payload }) => ({
        url: `/supplier`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: () => {
        return [
          { type: "Suppliers", id: "LIST" },
          { type: "Suppliers", id: "FULL_LIST" },
        ];
      },
    }),
    updateSupplierById: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/supplier/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Suppliers", id: "LIST" },
        { type: "Suppliers", id: "FULL_LIST" },
        { type: "Suppliers", id },
      ],
    }),
    archiveSupplierById: builder.mutation({
      query: (id) => ({
        url: `/supplier/${id}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Suppliers", id: "LIST" },
        { type: "Suppliers", id: "FULL_LIST" },
        { type: "Suppliers", id },
      ],
    }),
  }),
});

export const {
  useGetFullListOfSuppliersQuery,
  useGetListOfSuppliersInfiniteQuery,
  useGetSupplierByIdQuery,
  useCreateNewSupplierMutation,
  useUpdateSupplierByIdMutation,
  useArchiveSupplierByIdMutation,
} = supplierApi;
