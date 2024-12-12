import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";

import "../globals.css";
import { SessionValidation } from "../components/organisms/sessionValidation";

export const metadata: Metadata = {
  title: "Harmony Dashboard",
  description: "Created by Sebastian Torres",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <SessionValidation />
      <Toaster />
      {children}
    </div>
  );
}
