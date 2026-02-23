// lib/redux/middleware/rtkQueryErrorMiddleware.ts
import { isRejectedWithValue } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";
import { showErrorDialog } from "../../features/error/errorDialogSlice";

export const rtkQueryErrorMiddleware: Middleware =
  (api) => (next) => (action) => {
    if (isRejectedWithValue(action)) {
      const error = action.payload as any;

      // Extract error message from your API response
      let errorMessage = "An unexpected error occurred";

      try {
        // Check for error.data.error.message (your API structure)
        if (
          error?.data?.error?.message &&
          typeof error.data.error.message === "string"
        ) {
          errorMessage = error.data.error.message;
        }
        // Check for error.data.message
        else if (
          error?.data?.message &&
          typeof error.data.message === "string"
        ) {
          errorMessage = error.data.message;
        }
        // Check for error.data.error (if it's a string)
        else if (error?.data?.error && typeof error.data.error === "string") {
          errorMessage = error.data.error;
        }
        // Check for error.error
        else if (error?.error && typeof error.error === "string") {
          errorMessage = error.error;
        }
        // Check for error.message
        else if (error?.message && typeof error.message === "string") {
          errorMessage = error.message;
        }
        // Check if error.data is a string
        else if (typeof error?.data === "string") {
          errorMessage = error.data;
        }
        // If error itself is a string
        else if (typeof error === "string") {
          errorMessage = error;
        }
      } catch (e) {
        console.error("Error extracting error message:", e);
        errorMessage = "An unexpected error occurred";
      }

      // Dispatch action to show error dialog
      api.dispatch(showErrorDialog(errorMessage));

      console.error("RTK Query Error:", error);
    }

    return next(action);
  };
