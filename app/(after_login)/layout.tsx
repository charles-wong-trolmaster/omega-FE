"use client";

import * as React from "react";
import ErrorDialog from "./_containers/ErrorDialog";
import OmegaAppBar from "./_containers/OmegaAppBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="main-bg-img main-theme">
      <OmegaAppBar />
      {children}
      <ErrorDialog />
    </div>
  );
}
