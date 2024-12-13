"use client";

import { useAppStore } from "@/core/state/app";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const SessionValidation = () => {
  const router = useRouter();
  const { sessionCode, user, loadedData, validateSession } = useAppStore();

  useEffect(() => {
    if (loadedData) {
      if (sessionCode && user) {
        validateSession(user.email, sessionCode).then((success) => {
          console.log("Validated session");
          if (!success) router.push("/");
        });
      } else router.push("/");
    }
  }, [loadedData]);

  return <div></div>;
};
