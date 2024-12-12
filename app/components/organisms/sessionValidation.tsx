"use client";

import { useAppStore } from "@/app/core/state/app";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export const SessionValidation = () => {
  const router = useRouter();
  const { sessionCode, user, validateSession } = useAppStore();

  useEffect(() => {
    if (sessionCode && user) {
      validateSession(user.email, sessionCode).then((success) => {
        if (!success) router.push("/");
      });
    } else router.push("/");
  }, []);

  return <div></div>;
};
