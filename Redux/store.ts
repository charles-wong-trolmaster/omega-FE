// lib/redux/store.ts
"use client";

import { configureStore } from "@reduxjs/toolkit";
import errorDialogReducer from "./features/error/errorDialogSlice";
import { cultivationClient } from "./rtk-query/cultivationClient";
import { rtkQueryErrorMiddleware } from "./rtk-query/middleware/ErrorMiddleware";
import { growRoomClient } from "./rtk-query/growRoomClient";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

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

type AppDispatch = typeof store.dispatch;
type RootState = ReturnType<typeof store.getState>;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
