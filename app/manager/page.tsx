"use client";

import { ManagerPageComponent } from "@/components/pages/manager";
import { SessionValidation } from "../../components/organisms/sessionValidation";

export default function Manager() {
  return (
    <>
      <SessionValidation />
      <ManagerPageComponent />
    </>
  );
}
