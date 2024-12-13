import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { SessionValidation } from "../components/organisms/sessionValidation";

import "@caldwell619/react-kanban/dist/styles.css";
import "../globals.css";

export const metadata: Metadata = {
  title: "Harmony Manager",
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
