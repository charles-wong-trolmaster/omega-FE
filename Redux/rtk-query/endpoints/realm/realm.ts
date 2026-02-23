import { growRoomClient } from "../../growRoomClient";

const realmApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    createRealm: builder.mutation({
      query: (payload) => ({
        url: `/realm`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const { useCreateRealmMutation } = realmApi;
