"use client";

import * as React from "react";

export default function AccountSettingsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="uk-flex uk-height-1-1">
      <div className="uk-flex-1">{children}</div>
    </div>
  );
}
