// lib/redux/store.ts
"use client";

import { configureStore } from "@reduxjs/toolkit";
import errorDialogReducer from "./features/error/errorDialogSlice";
import { cultivationClient } from "./rtk-query/cultivationClient";
import { rtkQueryErrorMiddleware } from "./rtk-query/middleware/ErrorMiddleware";
import { growRoomClient } from "./rtk-query/growRoomClient";

export const store = configureStore({
  reducer: {
    errorDialog: errorDialogReducer,
    [cultivationClient.reducerPath]: cultivationClient.reducer,
    [growRoomClient.reducerPath]: growRoomClient.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({})
      .concat(cultivationClient.middleware)
      .concat(growRoomClient.middleware)
      .concat(rtkQueryErrorMiddleware),
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
