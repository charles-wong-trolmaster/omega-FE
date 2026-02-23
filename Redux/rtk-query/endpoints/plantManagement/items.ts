import { cultivationClient } from "../../cultivationClient";
import { Item } from "@/types/cultivation/ItemType";

const itemsApi = cultivationClient.injectEndpoints({
  endpoints: (builder) => ({
    getFullListOfItems: builder.query({
      query: () => `/items`,
      providesTags: () => [{ type: "Items", id: "FULL_LIST" }],
      transformResponse: (response: { result: Item[] }) => response.result,
    }),
    getListOfItems: builder.infiniteQuery({
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

        return `/items?${params.toString()}`;
      },
      providesTags: () => [{ type: "Items", id: "LIST" }],

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
      transformResponse: (response: { result: Item[] }) => response.result,
    }),
    getItemById: builder.query<Item, string>({
      query: (id) => `/item/${id}`,
      providesTags: (result, error, id) => [{ type: "Items", id }],
    }),
    createNewItem: builder.mutation({
      query: ({ payload }) => ({
        url: `/item`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: () => {
        return [
          { type: "Items", id: "LIST" },
          { type: "Items", id: "FULL_LIST" },
        ];
      },
    }),
    updateItemById: builder.mutation({
      query: ({ id, payload }) => ({
        url: `/item/${id}`,
        method: "PUT",
        body: payload,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Items", id: "LIST" },
        { type: "Items", id: "FULL_LIST" },
        { type: "Items", id },
      ],
    }),
    archiveItemById: builder.mutation({
      query: (id) => ({
        url: `/item/${id}/archive`,
        method: "PATCH",
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Items", id: "LIST" },
        { type: "Items", id: "FULL_LIST" },
        { type: "Items", id },
      ],
    }),
  }),
});

export const {
  useGetFullListOfItemsQuery,
  useGetItemByIdQuery,
  useArchiveItemByIdMutation,
  useCreateNewItemMutation,
  useGetListOfItemsInfiniteQuery,
  useUpdateItemByIdMutation,
} = itemsApi;
