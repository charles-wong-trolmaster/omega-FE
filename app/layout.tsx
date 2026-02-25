import { ReduxProvider } from "@/Redux/providers/ReduxProvider";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import type { Metadata } from "next";
import "@/styles/globals.css";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/styles/theme";
import { Montserrat } from "next/font/google";

export const metadata: Metadata = {
  title: "Omega",
  description: "Omega",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Omega",
  },
  formatDetection: {
    telephone: false,
  },
  other: {
    "mobile-web-app-capable": "yes",
    "apple-mobile-web-app-capable": "yes",
    "apple-mobile-web-app-status-bar-style": "black-translucent",
  },
};

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <meta name="theme-color" content="#000000" />
      </head>
      <body
        style={{
          margin: 0,
          padding: 0,
          width: "100vw",
          height: "100vh",
        }}
      >
        <ReduxProvider>
          <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </AppRouterCacheProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
