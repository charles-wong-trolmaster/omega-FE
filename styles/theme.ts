"use client";

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  typography: {
    fontFamily: "var(--font-montserrat), sans-serif",
    h1: {
      fontSize: "40px",
    },
    h2: {
      fontSize: "24px",
    },
    h3: {
      fontSize: "20px",
    },
    h4: {
      fontSize: "16px",
    },
    h5: {
      fontSize: "14px",
    },
    h6: {
      fontSize: "12px",
    },
  },
});
