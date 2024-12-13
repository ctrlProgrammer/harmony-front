"use client";

import { DashboardPageComponent } from "../../components/pages/dashboard";
import { SessionValidation } from "../../components/organisms/sessionValidation";

export default function Dashboard() {
  return (
    <>
      <SessionValidation />
      <DashboardPageComponent />
    </>
  );
}
