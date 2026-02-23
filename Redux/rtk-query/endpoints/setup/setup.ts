import { growRoomClient } from "../../growRoomClient";

const setupApi = growRoomClient.injectEndpoints({
  endpoints: (builder) => ({
    verifyOTP: builder.mutation({
      query: ({ code, ...payload }) => ({
        url: `/api/v1/setup/otp?code=${code}`,
        method: "POST",
        body: payload,
      }),
    }),
    resendVerificationCode: builder.mutation({
      query: ({ ...payload }) => ({
        url: `/api/v1/setup/otp/resend?email=${payload.email}`,
        method: "POST",
        body: payload,
      }),
    }),
    getValidCode: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/setup/otp/sendcode`,
        method: "POST",
        body: payload,
      }),
    }),
    activeOmega: builder.mutation({
      query: (payload) => ({
        url: `/api/v1/setup/active`,
        method: "POST",
        body: payload,
      }),
    }),
  }),
});

export const {
  useVerifyOTPMutation,
  useResendVerificationCodeMutation,
  useGetValidCodeMutation,
  useActiveOmegaMutation,
} = setupApi;
