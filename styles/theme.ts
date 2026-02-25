"use client";

import { createTheme } from "@mui/material/styles";

let theme = createTheme({
  palette: {
    primary: {
      main: "#33405D",
      contrastText: "#FFFFFF",
    },
    secondary: {
      main: "#26B2A7",
      contrastText: "#FFFFFF",
    },
  },
  typography: {
    fontFamily: "var(--font-montserrat), sans-serif",
    allVariants: {
      color: "#FFFFFF",
    },
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

export default theme = createTheme(theme, {
  components: {
    MuiLink: {
      styleOverrides: {
        root: {
          color: theme.palette.primary.contrastText,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            backgroundColor: "#ffffff",
            borderRadius: "999px",
          },
        },
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "&.Mui-checked": {
            color: theme.palette.secondary.main,
          },
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        root: {
          color: "#ffffff",
          "& .MuiFormControlLabel-label": {
            fontSize: "0.9rem",
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: "999px",
          "&.Mui-disabled": {
            background: "transparent",
            border: "1px solid #C8D0D0",
            color: "#C8D0D0",
          },
        },
      },
    },
    MuiToggleButtonGroup: {
      styleOverrides: {
        root: {
          backgroundColor: "#1e2a38",
          borderRadius: "999px",
          padding: "4px",
          "& .MuiToggleButton-root": {
            border: "none",
            borderRadius: "999px",
            color: theme.palette.primary.contrastText,
            padding: "6px 24px",
            textTransform: "none",
            "&.Mui-selected": {
              backgroundColor: theme.palette.secondary.main,
              color: theme.palette.secondary.contrastText,
              "&:hover": {
                backgroundColor: theme.palette.secondary.main,
              },
            },
          },
        },
      },
    },
  },
});
