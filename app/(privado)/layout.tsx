import React from "react";
import Navbar from "@/components/Navbar";
import AuthGuard from "@/components/AuthGuard";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <React.Fragment>
      <AuthGuard>
        <Navbar />
        {children}
      </AuthGuard>
    </React.Fragment>
  );
}