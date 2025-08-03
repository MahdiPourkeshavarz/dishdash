/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useStore } from "@/store/useStore";

export const ZustandSessionSync = () => {
  const { data: session, status } = useSession();
  const { setUser, setAccessToken } = useStore();

  useEffect(() => {
    if (status === "authenticated") {
      setUser(session.user);
      setAccessToken((session as any).accessToken);
    } else {
      setUser(null);
      setAccessToken(null);
    }
  }, [status, session, setUser, setAccessToken]);

  return null;
};
