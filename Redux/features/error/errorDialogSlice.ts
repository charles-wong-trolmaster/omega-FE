// lib/redux/features/errorDialog/errorDialogSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ErrorDialogState {
  isOpen: boolean;
  message: string;
}

const initialState: ErrorDialogState = {
  isOpen: false,
  message: "",
};

const errorDialogSlice = createSlice({
  name: "errorDialog",
  initialState,
  reducers: {
    showErrorDialog: (state, action: PayloadAction<string>) => {
      state.isOpen = true;
      state.message = action.payload;
    },
    closeErrorDialog: (state) => {
      state.isOpen = false;
      state.message = "";
    },
  },
});

export const { showErrorDialog, closeErrorDialog } = errorDialogSlice.actions;
export default errorDialogSlice.reducer;
